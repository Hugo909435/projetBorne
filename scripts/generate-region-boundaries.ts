/**
 * Writes `data/geo/region-boundaries.json`: the real outline of each Spanish
 * comunidad autónoma and UK region, which `generate-region-stats.ts` uses to
 * decide which region an Open Charge Map station is in.
 *
 * The outlines come from Eurostat GISCO (NUTS 2021, 1:3 million). Spain's
 * comunidades are its NUTS 2 regions; the nine English regions, Scotland,
 * Wales and Northern Ireland are the UK's NUTS 1 regions. Borders move about
 * once a decade, so this is run by hand, not on every build:
 *
 *   npm run generate:boundaries
 */
import fs from "node:fs";
import path from "node:path";
import { spanishRegions, ukRegions } from "../src/lib/regions";
import type { MultiPolygon, RegionBoundariesFile } from "../src/lib/regionBoundaries";

const GISCO = "https://gisco-services.ec.europa.eu/distribution/v2/nuts/geojson";
const SOURCE_URL = "https://ec.europa.eu/eurostat/web/gisco/geodata/statistical-units/territorial-units-statistics";

/** Region slug -> NUTS code, per NUTS level. */
const NUTS: Record<1 | 2, Record<string, string>> = {
  1: {
    "north-east-england": "UKC",
    "north-west-england": "UKD",
    "yorkshire-and-the-humber": "UKE",
    "east-midlands": "UKF",
    "west-midlands": "UKG",
    "east-of-england": "UKH",
    london: "UKI",
    "south-east-england": "UKJ",
    "south-west-england": "UKK",
    wales: "UKL",
    scotland: "UKM",
    "northern-ireland": "UKN",
  },
  2: {
    galicia: "ES11",
    asturias: "ES12",
    cantabria: "ES13",
    "pais-vasco": "ES21",
    navarra: "ES22",
    "la-rioja": "ES23",
    aragon: "ES24",
    madrid: "ES30",
    "castilla-y-leon": "ES41",
    "castilla-la-mancha": "ES42",
    extremadura: "ES43",
    cataluna: "ES51",
    "comunidad-valenciana": "ES52",
    "islas-baleares": "ES53",
    andalucia: "ES61",
    murcia: "ES62",
    ceuta: "ES63",
    melilla: "ES64",
    canarias: "ES70",
  },
};

type Feature = {
  properties: { NUTS_ID: string };
  geometry: { type: "Polygon"; coordinates: number[][][] } | { type: "MultiPolygon"; coordinates: MultiPolygon };
};

/** Four decimals is about ten metres: far finer than a 1:3 million outline. */
const round = (value: number) => Math.round(value * 1e4) / 1e4;

async function loadLevel(level: 1 | 2): Promise<Record<string, MultiPolygon>> {
  const url = `${GISCO}/NUTS_RG_03M_2021_4326_LEVL_${level}.geojson`;
  console.log("Downloading", url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GISCO answered ${res.status} for ${url}`);
  const { features } = (await res.json()) as { features: Feature[] };

  const out: Record<string, MultiPolygon> = {};
  for (const [slug, code] of Object.entries(NUTS[level])) {
    const feature = features.find((f) => f.properties.NUTS_ID === code);
    if (!feature) throw new Error(`no NUTS ${level} outline for ${code} (${slug})`);
    const polygons =
      feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates;
    out[slug] = polygons.map((rings) => rings.map((ring) => ring.map(([lon, lat]) => [round(lon), round(lat)])));
  }
  return out;
}

async function main() {
  const regions = { ...(await loadLevel(2)), ...(await loadLevel(1)) };

  const expected = [...spanishRegions, ...ukRegions].map((r) => r.slug);
  const missing = expected.filter((slug) => !regions[slug]);
  if (missing.length) throw new Error(`regions.ts has regions with no outline: ${missing.join(", ")}`);

  const file: RegionBoundariesFile = {
    source: "Eurostat GISCO, NUTS 2021, 1:3 million",
    sourceUrl: SOURCE_URL,
    attribution: "© EuroGeographics for the administrative boundaries",
    generatedAt: new Date().toISOString().slice(0, 10),
    regions: Object.fromEntries(expected.map((slug) => [slug, regions[slug]])),
  };

  const outPath = path.join(__dirname, "../data/geo/region-boundaries.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(file) + "\n");
  console.log(`Wrote ${expected.length} outlines to ${outPath} (${(fs.statSync(outPath).size / 1e3).toFixed(0)} kB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
