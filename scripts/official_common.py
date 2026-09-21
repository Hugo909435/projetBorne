"""
Helpers shared by the generators that turn a national open-data register into
the site's files (`generate_irve_data.py` for France, `generate_de_data.py` for
Germany).

Both build the same two map files, with connector types expressed as Open Charge
Map ids so the existing `/api/reference` labels and popup code keep working.
"""
import gzip
import json
import os
import re
import unicodedata

# Open Charge Map ConnectionType ids (checked against /v3/referencedata).
TYPE1 = 1
CHADEMO = 2
TYPE2_SOCKET = 25
SCHUKO = 28
CCS2 = 33
TYPE2_TETHERED = 1036
# Open Charge Map CurrentType ids.
AC_SINGLE, AC_THREE, DC = 10, 20, 30
# UsageType ids: 1 public, 6 private (customers and visitors only).
USAGE_PUBLIC, USAGE_CUSTOMERS = 1, 6

SMALL_WORDS = {"de", "du", "des", "la", "le", "les", "sur", "sous", "en", "et", "aux", "au", "lès", "lez"}
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}")


def slugify(name: str) -> str:
    s = unicodedata.normalize("NFD", name)
    s = "".join(c for c in s if not unicodedata.combining(c)).lower()
    return re.sub(r"^-+|-+$", "", re.sub(r"[^a-z0-9]+", "-", s))


def fnv1a(text: str) -> int:
    h = 2166136261
    for b in text.encode("utf-8"):
        h = ((h ^ b) * 16777619) & 0xFFFFFFFF
    return h


def squash(value, limit: int) -> str:
    text = re.sub(r"\s+", " ", (value or "")).strip()
    return text[:limit].rstrip()


def title_case(text: str) -> str:
    out = []
    for i, word in enumerate(re.split(r"(\s+|-)", text.lower())):
        if not word or word.isspace() or word == "-":
            out.append(word)
        elif i > 0 and word in SMALL_WORDS:
            out.append(word)
        else:
            # capitalise after an apostrophe too: l'isle -> L'Isle
            out.append(re.sub(r"(^|')([a-zà-ÿ])", lambda m: m.group(1) + m.group(2).upper(), word))
    return "".join(out)


def town_key(town: str) -> str:
    s = unicodedata.normalize("NFD", town)
    s = "".join(c for c in s if not unicodedata.combining(c)).lower()
    s = re.sub(r"\bst\b", "saint", s)
    s = re.sub(r"\bste\b", "sainte", s)
    return re.sub(r"[^a-z0-9]+", " ", s).strip()


def numeric_station_id(key: str, base: int, span: int, taken: set) -> int:
    """Stable id in [base, base + span): the same station keeps its id across data refreshes."""
    n = base + fnv1a(key) % span
    while n in taken:
        n += 1
    taken.add(n)
    return n


def write_gz_json(path: str, payload) -> int:
    raw = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        # mtime=0: an unchanged dataset produces identical bytes, so git sees no diff.
        with gzip.GzipFile(filename="", mode="wb", fileobj=f, mtime=0, compresslevel=9) as gz:
            gz.write(raw)
    return os.path.getsize(path)
