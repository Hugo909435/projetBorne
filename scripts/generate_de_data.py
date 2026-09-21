"""
Builds everything the site takes from the official German charging register
(Ladesaeulenregister of the Bundesnetzagentur), published as open data under
CC BY 4.0 (attribution: "Bundesnetzagentur.de").

Writes:
  src/data/de-state-stats.json       per-Bundesland statistics (German state pages)
  src/data/de-state-stats-meta.json  source, license, register date, national totals
  data/de/stations.json.gz           every charging location, as the map needs it
  data/de/details.json.gz            per-station detail, loaded lazily when a popup opens

Usage:
  python scripts/generate_de_data.py            # finds and downloads the latest register (~55 MB)
  python scripts/generate_de_data.py file.csv   # reuses a local copy

The register lists charging devices ("Ladeeinrichtungen"), several per address.
Devices sharing the same coordinates are merged into one location, which is what
the map shows as a station. A "point" is one plug that can serve one car, as in
the French data. The Bundesnetzagentur itself notes that operators who have not
finished the reporting procedure are missing, so the real number is higher.
"""
import collections
import csv
import datetime
import io
import json
import os
import re
import sys
import tempfile
import urllib.parse
import urllib.request

from official_common import (
    AC_SINGLE, AC_THREE, CCS2, CHADEMO, DATE_RE, DC, SCHUKO, TYPE1, TYPE2_SOCKET, TYPE2_TETHERED,
    USAGE_CUSTOMERS, USAGE_PUBLIC, numeric_station_id, slugify, squash, title_case, town_key, write_gz_json,
)

PAGE_URL = "https://www.bundesnetzagentur.de/DE/Fachthemen/ElektrizitaetundGas/E-Mobilitaet/Ladesaeulenkarte/start.html"
LICENSE = "CC BY 4.0"
ATTRIBUTION = "Bundesnetzagentur.de"
FAST_KW = 50
STATION_ID_BASE = 3_100_000_000  # after the French range; Open Charge Map ids stay far below
STATION_ID_SPAN = 900_000_000
# South, north, west, east: rejects (0, 0), swapped or foreign coordinates.
GERMANY_BOX = (47.2, 55.1, 5.8, 15.1)
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")

# Plug wording in the register -> (Open Charge Map connector type id, label used in the state statistics)
PLUGS = {
    "AC Typ 2 Steckdose": (TYPE2_SOCKET, "Type 2"),
    "AC Typ 2 Fahrzeugkupplung": (TYPE2_TETHERED, "Type 2"),
    "DC Fahrzeugkupplung Typ Combo 2 (CCS)": (CCS2, "CCS Combo"),
    "DC CHAdeMO": (CHADEMO, "CHAdeMO"),
    "AC Schuko": (SCHUKO, "Type E/F (Schuko)"),
    "AC Typ 1 Steckdose": (TYPE1, "Type 1"),
}


def load_states() -> dict:
    """slug -> state name, from the Bundeslaender in src/lib/regions.ts."""
    text = open(os.path.join(ROOT, "src/lib/regions.ts"), encoding="utf-8").read()
    start = text.index("export const germanStates")
    end = text.index("];", start)
    names = re.findall(r'makeRegion\("([^"]+)"', text[start:end])
    if len(names) != 16:
        sys.exit(f"expected 16 Bundeslaender in regions.ts, found {len(names)}")
    return {slugify(n): n for n in names}


def discover_url() -> str:
    req = urllib.request.Request(PAGE_URL, headers={"User-Agent": "ma-borne-electrique-stats/1.0"})
    html = urllib.request.urlopen(req, timeout=60).read().decode("utf-8", "replace")
    links = re.findall(r'href="([^"]*Ladesaeulenregister_BNetzA_[\d-]+\.csv)"', html)
    if not links:
        sys.exit("could not find the register CSV link on the Bundesnetzagentur page; pass a local file instead")
    return urllib.parse.urljoin(PAGE_URL, sorted(set(links))[-1])


def download(dest: str) -> None:
    url = discover_url()
    print("Downloading", url)
    req = urllib.request.Request(url, headers={"User-Agent": "ma-borne-electrique-stats/1.0"})
    with urllib.request.urlopen(req, timeout=300) as resp, open(dest, "wb") as out:
        while chunk := resp.read(1 << 20):
            out.write(chunk)


def num(raw):
    try:
        return float((raw or "").replace(",", "."))
    except ValueError:
        return None


def parse_kw(raw):
    kw = num(raw)
    return round(kw, 1) if kw and kw > 0 else None


def clean_town(raw: str):
    town = re.sub(r"\s*\(.*?\)\s*", " ", raw or "").strip(" ,;-.")
    if len(town) < 2:
        return None
    return title_case(town) if town.isupper() or town.islower() else town


def open_hours(row: dict) -> str:
    code = row["Öffnungszeiten"]
    if code == "247":
        return "24/7"
    if code == "Eingeschränkt":
        days = squash(row["Öffnungszeiten: Wochentage"], 60)
        times = squash(row["Öffnungszeiten: Tageszeiten"], 60)
        return squash(f"Eingeschränkt: {days} {times}", 120)
    return ""


def main() -> None:
    states = load_states()
    path = sys.argv[1] if len(sys.argv) > 1 else None
    tmp = None
    if not path:
        tmp = tempfile.NamedTemporaryFile(suffix=".csv", delete=False)
        tmp.close()
        path = tmp.name
        download(path)

    text = open(path, encoding="utf-8-sig", newline="").read()
    lines = text.split("\n")
    header_at = next(i for i, l in enumerate(lines) if l.startswith("Ladeeinrichtungs-ID"))
    updated = re.search(r"Letzte Aktualisierung vom:\s*(\d{2})\.(\d{2})\.(\d{4})", text)
    register_date = f"{updated.group(3)}-{updated.group(2)}-{updated.group(1)}" if updated else ""
    reader = csv.DictReader(io.StringIO("\n".join(lines[header_at:])), delimiter=";", quotechar='"')

    stations = {}
    state_points = collections.Counter()
    state_fast = collections.Counter()
    state_plugs = {s: collections.Counter() for s in states}
    state_locations = {s: set() for s in states}
    state_towns = {s: collections.defaultdict(lambda: [set(), collections.Counter()]) for s in states}
    devices = kept = skipped_status = skipped_coords = skipped_state = 0

    for row in reader:
        devices += 1
        if not row.get("Ladeeinrichtungs-ID"):
            continue
        if row["Status"] != "In Betrieb":
            skipped_status += 1
            continue
        lat, lon = num(row["Breitengrad"]), num(row["Längengrad"])
        south, north, west, east = GERMANY_BOX
        if lat is None or lon is None or not (south <= lat <= north and west <= lon <= east):
            skipped_coords += 1
            continue
        slug = slugify(row["Bundesland"])
        if slug not in states:
            skipped_state += 1
            continue
        kept += 1

        points = int(num(row["Anzahl Ladepunkte"]) or 1)
        device_kw = num(row["Nennleistung Ladeeinrichtung [kW]"]) or 0
        key = f"{lat:.5f},{lon:.5f}"
        st = stations.get(key)
        if st is None:
            number = "" if row["Hausnummer"].strip() in ("0", "-") else row["Hausnummer"]  # placeholders in the register
            street = squash(f'{row["Straße"]} {number} {row["Adresszusatz"]}', 160)
            st = stations[key] = {
                "lat": lat, "lon": lon, "slug": slug,
                "title": squash(row["Anzeigename (Karte)"] or row["Standortbezeichnung"] or row["Betreiber"], 120),
                "street": street, "town": clean_town(row["Ort"]) or "", "postal": squash(row["Postleitzahl"], 8),
                "points": 0, "plugs": collections.Counter(), "hours": "", "payments": set(),
                "restricted": True,
            }
        st["points"] += points
        st["hours"] = st["hours"] or open_hours(row)
        st["payments"].update(p.strip() for p in row["Bezahlsysteme"].split(";") if p.strip())
        if "kunden" not in row["Informationen zum Parkraum"].lower():
            st["restricted"] = False

        state_points[slug] += points
        if device_kw >= FAST_KW:
            state_fast[slug] += points
        state_locations[slug].add(key)
        if st["town"]:
            entry = state_towns[slug][town_key(st["town"])]
            entry[0].add(key)
            entry[1][st["town"]] += 1

        for k in range(1, 7):
            kw = parse_kw(row[f"Nennleistung Stecker{k}"])
            for wording in (w.strip() for w in row[f"Steckertypen{k}"].split(";")):
                mapped = PLUGS.get(wording)
                if not mapped:
                    continue
                type_id = mapped[0]
                if wording.startswith("DC"):
                    current = DC
                elif kw is None:
                    current = None
                else:
                    current = AC_THREE if kw > 7.4 else AC_SINGLE
                st["plugs"][(type_id, kw, current)] += 1
                state_plugs[slug][mapped[1]] += 1

    generated = datetime.date.today().isoformat()

    # ---- state statistics (pages)
    result = {}
    for slug in states:
        towns = sorted(
            ((max(v[1], key=v[1].get), len(v[0])) for v in state_towns[slug].values()),
            key=lambda t: (-t[1], t[0]),
        )[:6]
        result[slug] = {
            "stations": len(state_locations[slug]),
            "points": state_points[slug],
            "fastPoints": state_fast[slug],
            "connectorBreakdown": [{"name": n, "count": c} for n, c in state_plugs[slug].most_common(4)],
            "topTowns": [{"name": n, "count": c} for n, c in towns],
        }

    # ---- map dataset
    taken = set()
    rows, details = [], {}
    for key in sorted(stations):
        st = stations[key]
        numeric = numeric_station_id(key, STATION_ID_BASE, STATION_ID_SPAN, taken)
        ordered = sorted(st["plugs"].items(), key=lambda kv: (-(kv[0][1] or 0), kv[0][0], kv[0][2] or 0))
        conns, conns_detail = [], []
        for (type_id, kw, current), quantity in ordered:
            conns += [type_id, kw, current]
            conns_detail += [type_id, kw, current, quantity]
        rows.append([
            numeric, round(st["lat"], 5), round(st["lon"], 5), st["title"] or "Ladestation", st["street"],
            st["town"], st["postal"], st["points"], register_date, conns,
            USAGE_CUSTOMERS if st["restricted"] else USAGE_PUBLIC,
        ])
        payments = squash("; ".join(sorted(st["payments"])), 160)
        comments = f"Bezahlsysteme: {payments}" if payments else ""
        if st["hours"] or comments or conns_detail:
            details[str(numeric)] = ["", st["hours"], comments, "", conns_detail]
    rows.sort(key=lambda row: (int(row[1] * 20), row[2], row[0]))

    out_dir = os.path.join(ROOT, "data", "de")
    stations_bytes = write_gz_json(os.path.join(out_dir, "stations.json.gz"), {"generatedAt": generated, "rows": rows})
    details_bytes = write_gz_json(os.path.join(out_dir, "details.json.gz"), {"generatedAt": generated, "details": details})

    meta = {
        "source": "Ladesaeulenregister der Bundesnetzagentur",
        "sourceUrl": PAGE_URL,
        "license": LICENSE,
        "attribution": ATTRIBUTION,
        "registerDate": register_date,
        "generatedAt": generated,
        "fastThresholdKw": FAST_KW,
        "devices": devices,
        "devicesKept": kept,
        "nationalPoints": sum(state_points.values()),
        "nationalLocations": len(stations),
        "skippedNotInOperation": skipped_status,
        "skippedBadCoordinates": skipped_coords,
        "skippedUnknownState": skipped_state,
    }
    data_dir = os.path.join(ROOT, "src", "data")
    os.makedirs(data_dir, exist_ok=True)
    with open(os.path.join(data_dir, "de-state-stats.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
        f.write("\n")
    with open(os.path.join(data_dir, "de-state-stats-meta.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(json.dumps(meta, indent=2, ensure_ascii=False))
    print(f"stations.json.gz {stations_bytes / 1e6:.2f} MB, details.json.gz {details_bytes / 1e6:.2f} MB")
    if tmp:
        os.unlink(path)


if __name__ == "__main__":
    main()
