"""
Builds everything the site takes from the official French national IRVE base
(Infrastructures de Recharge pour Vehicules Electriques), published on
data.gouv.fr / transport.data.gouv.fr under the Licence Ouverte 2.0.

Writes:
  src/data/department-stats.json       per-department statistics (department pages)
  src/data/department-stats-meta.json  source, license, generation date, national totals
  data/irve/stations.json.gz           every public station, as the map needs it
  data/irve/details.json.gz            per-station detail, loaded lazily when a popup opens

Usage:
  python scripts/generate_irve_data.py            # downloads the file (~120 MB)
  python scripts/generate_irve_data.py file.csv   # reuses a local copy

Only stations flagged "Acces libre" (open to the public) are counted. A point of
charge (PDC) is one plug that can serve one car; a station groups several PDC.

Departments come from the postal code found in the station address, falling
back to the INSEE commune code when there is no usable postal code. The INSEE
field is missing on about a quarter of the rows and wrong on some others
(placeholder 99999, or another commune's code: Orly filed under 91479), whereas
the address is what a person typed and is almost always right. Rows that cannot
be placed in a metropolitan department are counted as "unassigned" in the meta
file, never guessed.
"""
import collections
import csv
import datetime
import json
import os
import re
import sys
import tempfile
import urllib.request

from official_common import (
    AC_SINGLE, AC_THREE, CCS2, CHADEMO, DATE_RE, DC, SCHUKO, TYPE2_SOCKET, TYPE2_TETHERED, USAGE_PUBLIC,
    numeric_station_id, slugify, squash, title_case, town_key, write_gz_json,
)

SOURCE_URL = "https://proxy.transport.data.gouv.fr/resource/consolidation-transport-irve-statique"
SOURCE_PAGE = "https://www.data.gouv.fr/datasets/beta-bases-nationales-des-points-de-recharge-pour-vehicules-electriques-en-france-irve"
FAST_KW = 50
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")

csv.field_size_limit(10**9)


def load_departments() -> dict:
    """code -> (name, slug), read from the France block of src/lib/cities.ts."""
    text = open(os.path.join(ROOT, "src/lib/cities.ts"), encoding="utf-8").read()
    start = text.index('countryKey: "france"')
    end = text.index("countryKey:", start + 10)
    found = re.findall(r'name: "([^"]+)", lat: [\d.\-]+, lon: [\d.\-]+, code: "([0-9AB]{2})"', text[start:end])
    if len(found) != 96:
        sys.exit(f"expected 96 departments in cities.ts, found {len(found)}")
    return {code: (name, slugify(name)) for name, code in found}


def department_from_postal(postal: str):
    if postal.startswith("20"):
        return "2A" if postal[:3] in ("200", "201") else "2B"
    prefix = postal[:2]
    return prefix if prefix.isdigit() and prefix not in ("97", "98", "00") else None


POSTAL_RE = re.compile(r"\b(\d{5})\b")
STREET_START_RE = re.compile(
    r"^(?:\d|rue|avenue|av|boulevard|bd|route|rte|chemin|all[ée]e|place|parking|impasse|zone|za|zac|quai|cours|"
    r"esplanade|centre|lieu|aire|rond|carrefour|square|passage|voie|zi|parc|lotissement|r[ée]sidence|hameau)\b",
    re.I,
)
ARRONDISSEMENT_RE = re.compile(r"\s+\d{1,2}\s*(?:er|e|eme|ème|è)?(?:\s+arrondissement)?$", re.I)


def clean_town(raw: str):
    town = re.sub(r"\bcedex\b.*$", "", raw, flags=re.I)
    town = re.sub(r"\(.*$", "", town).strip(" ,;-.")  # "CHATEAUROUX (36) Centre" -> "CHATEAUROUX"
    town = ARRONDISSEMENT_RE.sub("", town).strip(" ,;-.")
    if not town or len(town) < 2 or town.lower() == "testville":  # test rows left in the source file
        return None
    if town.isupper() or town.islower():
        town = title_case(town)
    return town


def split_address(address: str):
    """(street, postal code, town) from 'street, Town 72610 France' or 'street 72610 TOWN'."""
    matches = list(re.finditer(r"\b\d{5}\b", address))
    if not matches:
        return address.strip(" ,;-."), None, None
    m = matches[-1]
    after = re.sub(r"[\s,;-]*\bfrance\b\s*$", "", address[m.end():], flags=re.I).strip(" ,;-.")
    before = address[: m.start()].strip(" ,;-.")
    if after:
        return before, m.group(0), clean_town(after)
    if "," in before:
        head, segment = before.rsplit(",", 1)
        segment = segment.strip()
        if segment and not STREET_START_RE.match(segment) and not re.search(r"\d", segment):
            return head.strip(" ,;-."), m.group(0), clean_town(segment)
    return before, m.group(0), None


def extract_town(address: str):
    return split_address(address)[2]


# ---------------------------------------------------------------------------
# Map dataset: one compact record per public station, in the shape the map
# already consumes from Open Charge Map (connector types are OCM ids, so the
# existing /api/reference labels and popup code keep working unchanged).
# ---------------------------------------------------------------------------
STATION_ID_BASE = 1_000_000_000  # Open Charge Map ids stay far below this
STATION_ID_SPAN = 2_000_000_000

# Rough boxes (south, north, west, east) of metropolitan France and the overseas
# territories. They exist to reject (0, 0), swapped or wildly wrong coordinates.
FRANCE_BOXES = [
    (41.0, 51.5, -5.6, 10.0),
    (14.0, 19.0, -64.0, -60.0),
    (1.5, 6.0, -55.0, -51.0),
    (-22.0, -20.0, 55.0, 56.0),
    (-14.0, -12.0, 44.5, 46.0),
    (46.5, 47.5, -57.0, -55.5),
    (-23.5, -19.0, 163.0, 169.0),
    (-28.0, -7.0, -155.0, -134.0),
    (-15.0, -13.0, -179.0, -175.0),
]


def plausible_coords(lat: float, lon: float) -> bool:
    return any(s <= lat <= n and w <= lon <= e for s, n, w, e in FRANCE_BOXES)


def format_phone(raw: str):
    digits = re.sub(r"[^\d+]", "", raw or "")
    if re.fullmatch(r"\+?33\d{9}", digits):
        n = digits.lstrip("+")[2:]
        return "+33 " + n[0] + " " + " ".join(n[i:i + 2] for i in range(1, 9, 2))
    if re.fullmatch(r"0\d{9}", digits):
        return " ".join(digits[i:i + 2] for i in range(0, 10, 2))
    return None


def useful_tariff(text: str) -> str:
    """Several operators paste the same boilerplate instead of a price: not worth a popup row."""
    return "" if re.search(r"peuvent varier|consulter directement|selon (?:votre|le) (?:abonnement|contrat)", text, re.I) else text


def parse_kw(raw: str):
    try:
        kw = float(raw)
    except (TypeError, ValueError):
        return None
    return round(kw, 1) if kw > 0 else None


def plugs_for(r: dict, kw):
    """One (OCM connector type id, kW, OCM current type id) per plug this point offers."""
    ac = None if kw is None else (AC_THREE if kw > 7.4 else AC_SINGLE)
    plugs = []
    if r["prise_type_2"] == "true":
        plugs.append((TYPE2_TETHERED if r["cable_t2_attache"] == "true" else TYPE2_SOCKET, kw, ac))
    if r["prise_type_combo_ccs"] == "true":
        plugs.append((CCS2, kw, DC))
    if r["prise_type_chademo"] == "true":
        plugs.append((CHADEMO, kw, DC))
    if r["prise_type_ef"] == "true":
        plugs.append((SCHUKO, kw, AC_SINGLE))
    return plugs


def add_to_station(stations: dict, station_id: str, r: dict, address: str) -> None:
    st = stations.get(station_id)
    if st is None:
        try:
            lat = float(r["consolidated_latitude"])
            lon = float(r["consolidated_longitude"])
        except ValueError:
            lat = lon = None
        street, postal, town = split_address(address)
        st = stations[station_id] = {
            "lat": lat,
            "lon": lon,
            "title": squash(r["nom_station"] or r["nom_enseigne"] or r["nom_operateur"], 120),
            "street": squash(street, 160),
            "postal": postal or "",
            "town": town or "",
            "date": "",
            "plugs": collections.Counter(),
            "points": 0,
            "tarif": useful_tariff(squash(r["tarification"], 300)),
            "gratuit": r["gratuit"] == "true",
            "horaires": squash(r["horaires"], 120),
            "pmr": "" if "inconnue" in (r["accessibilite_pmr"] or "").lower() else squash(r["accessibilite_pmr"], 80),
            "obs": squash(r["observations"], 400),
            "phone": format_phone(r["telephone_operateur"]) or "",
        }
    st["points"] += 1
    for plug in plugs_for(r, parse_kw(r["puissance_nominale"])):
        st["plugs"][plug] += 1
    updated = (r["date_maj"] or "")[:10]
    if DATE_RE.match(updated) and updated > st["date"]:
        st["date"] = updated


def build_map_dataset(stations: dict, generated: str):
    """(stations payload, details payload, number skipped for unusable coordinates)."""
    taken = set()
    rows, details, skipped = [], {}, 0
    for key in sorted(stations):
        st = stations[key]
        if st["lat"] is None or not plausible_coords(st["lat"], st["lon"]):
            skipped += 1
            continue
        numeric = numeric_station_id(key, STATION_ID_BASE, STATION_ID_SPAN, taken)

        ordered = sorted(st["plugs"].items(), key=lambda kv: (-(kv[0][1] or 0), kv[0][0], kv[0][2] or 0))
        conns, conns_detail = [], []
        for (type_id, kw, current), quantity in ordered:
            conns += [type_id, kw, current]
            conns_detail += [type_id, kw, current, quantity]

        rows.append([
            numeric, round(st["lat"], 5), round(st["lon"], 5), st["title"] or "Borne de recharge",
            st["street"], st["town"], st["postal"], st["points"], st["date"], conns, USAGE_PUBLIC,
        ])
        cost = st["tarif"] or ("Gratuit" if st["gratuit"] else "")
        access = " · ".join(x for x in (st["horaires"], st["pmr"]) if x)
        if cost or access or st["obs"] or st["phone"] or conns_detail:
            details[str(numeric)] = [cost, access, st["obs"], st["phone"], conns_detail]

    # Spatial order (0.05 degree bands of latitude, then longitude): lets the
    # server thin an over-full answer by simple striding and stay evenly spread.
    rows.sort(key=lambda row: (int(row[1] * 20), row[2], row[0]))
    return {"generatedAt": generated, "rows": rows}, {"generatedAt": generated, "details": details}, skipped


def download(dest: str) -> None:
    print("Downloading", SOURCE_URL)
    req = urllib.request.Request(SOURCE_URL, headers={"User-Agent": "ma-borne-electrique-stats/1.0"})
    with urllib.request.urlopen(req, timeout=300) as resp, open(dest, "wb") as out:
        while chunk := resp.read(1 << 20):
            out.write(chunk)


def main() -> None:
    departments = load_departments()
    path = sys.argv[1] if len(sys.argv) > 1 else None
    tmp = None
    if not path:
        tmp = tempfile.NamedTemporaryFile(suffix=".csv", delete=False)
        tmp.close()
        path = tmp.name
        download(path)

    # per department
    pdc_seen = set()
    stations = {code: set() for code in departments}
    points = collections.Counter()
    fast = collections.Counter()
    connectors = {code: collections.Counter() for code in departments}
    towns = {code: collections.defaultdict(lambda: [set(), collections.Counter()]) for code in departments}

    rows = public_rows = unassigned = via_insee = via_postal = disagree = 0
    national_pdc = set()
    national_stations = set()
    map_stations = {}

    with open(path, encoding="utf-8", newline="") as fh:
        for r in csv.DictReader(fh):
            rows += 1
            if r["condition_acces"] != "Accès libre":
                continue
            pdc_id = r["id_pdc_itinerance"]
            if not pdc_id or pdc_id in pdc_seen:
                continue
            pdc_seen.add(pdc_id)
            public_rows += 1
            station_id = r["id_station_itinerance"] or r["id_station_local"] or pdc_id
            national_pdc.add(pdc_id)
            national_stations.add(station_id)

            address = r["adresse_station"] or ""
            add_to_station(map_stations, station_id, r, address)
            postals = POSTAL_RE.findall(address)
            insee = (r["code_insee_commune"] or "").strip()
            code = None
            postal_code = department_from_postal(postals[-1]) if postals else None
            if postal_code in departments:
                code = postal_code
                via_postal += 1
                if insee and insee[:2].upper() != code:
                    disagree += 1
            elif insee and insee[:2].upper() in departments:
                code = insee[:2].upper()
                via_insee += 1
            if code is None:
                unassigned += 1
                continue

            stations[code].add(station_id)
            points[code] += 1
            try:
                if float(r["puissance_nominale"]) >= FAST_KW:
                    fast[code] += 1
            except ValueError:
                pass

            c = connectors[code]
            if r["prise_type_2"] == "true":
                c["Type 2"] += 1
            if r["prise_type_combo_ccs"] == "true":
                c["CCS Combo"] += 1
            if r["prise_type_chademo"] == "true":
                c["CHAdeMO"] += 1
            if r["prise_type_ef"] == "true":
                c["Type E/F (Schuko)"] += 1

            town = extract_town(address)
            if town:
                entry = towns[code][town_key(town)]
                entry[0].add(station_id)
                entry[1][town] += 1

    result = {}
    for code, (name, slug) in departments.items():
        top_towns = sorted(
            ((max(v[1], key=v[1].get), len(v[0])) for v in towns[code].values()),
            key=lambda t: (-t[1], t[0]),
        )[:6]
        result[slug] = {
            "stations": len(stations[code]),
            "points": points[code],
            "fastPoints": fast[code],
            "connectorBreakdown": [{"name": n, "count": c} for n, c in connectors[code].most_common(4)],
            "topTowns": [{"name": n, "count": c} for n, c in top_towns],
        }

    generated = datetime.date.today().isoformat()
    meta = {
        "source": "Base nationale des IRVE (transport.data.gouv.fr, consolidation dedoublonnee, beta)",
        "sourceUrl": SOURCE_PAGE,
        "license": "Licence Ouverte 2.0",
        "generatedAt": generated,
        "fastThresholdKw": FAST_KW,
        "nationalPublicPoints": len(national_pdc),
        "nationalPublicStations": len(national_stations),
        "metropolitanPublicPoints": sum(points.values()),
        "metropolitanPublicStations": sum(len(s) for s in stations.values()),
        "unassignedPublicPoints": unassigned,
        "assignedViaPostalCode": via_postal,
        "assignedViaInseeFallback": via_insee,
        "postalCodeOverrodeInsee": disagree,
    }

    data_dir = os.path.join(ROOT, "src/data")
    os.makedirs(data_dir, exist_ok=True)
    with open(os.path.join(data_dir, "department-stats.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
        f.write("\n")
    with open(os.path.join(data_dir, "department-stats-meta.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)
        f.write("\n")

    stations_payload, details_payload, skipped = build_map_dataset(map_stations, generated)
    irve_dir = os.path.join(ROOT, "data", "irve")
    os.makedirs(irve_dir, exist_ok=True)
    stations_bytes = write_gz_json(os.path.join(irve_dir, "stations.json.gz"), stations_payload)
    details_bytes = write_gz_json(os.path.join(irve_dir, "details.json.gz"), details_payload)
    meta["mapStations"] = len(stations_payload["rows"])
    meta["mapStationsSkippedBadCoordinates"] = skipped
    with open(os.path.join(data_dir, "department-stats-meta.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(json.dumps(meta, indent=2, ensure_ascii=False))
    print(f"stations.json.gz {stations_bytes / 1e6:.2f} MB, details.json.gz {details_bytes / 1e6:.2f} MB")
    if tmp:
        os.unlink(path)


if __name__ == "__main__":
    main()
