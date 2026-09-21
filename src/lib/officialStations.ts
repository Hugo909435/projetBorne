import { readFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { gunzip } from "node:zlib";
import type { Station, StationConnection, StationDetail, StationQuery } from "@/lib/openChargeMap";

/**
 * Charging stations from national open-data registers: France's IRVE base and
 * Germany's Bundesnetzagentur register.
 *
 * `scripts/generate_irve_data.py` and `scripts/generate_de_data.py` turn each
 * register into two gzipped JSON files under `data/<dir>/`. This module loads
 * them lazily, once per server process, and answers the same queries the map
 * already sends to Open Charge Map (a bounding box, a radius, or the whole
 * country), returning the same `Station` shape. Each dataset is 45,000 to
 * 75,000 stations, so a query is a linear scan of in-memory arrays: well under
 * a millisecond, no index and no network needed.
 *
 * Rows are stored sorted by 0.05-degree latitude band, then longitude. That
 * order is what makes thinning cheap and fair: taking every n-th match of an
 * over-full answer leaves an evenly spread sample instead of one that is dense
 * in whichever region the file happens to list first.
 */

export type OfficialCountry = "FR" | "DE";

type Envelope = [south: number, north: number, west: number, east: number];

type DatasetConfig = {
  /** Folder under `data/`. */
  dir: string;
  /** First station id of the range; Open Charge Map ids stay far below 1e9. */
  idBase: number;
  idSpan: number;
  /**
   * Rough envelope(s) of the country and its territories. Only used to decide
   * whether a query is worth running against the dataset at all, so a request
   * over the Pacific doesn't load megabytes for nothing.
   */
  envelopes: Envelope[];
};

/** Id ranges must match `STATION_ID_BASE` / `STATION_ID_SPAN` in the generator scripts. */
const DATASETS: Record<OfficialCountry, DatasetConfig> = {
  FR: {
    dir: "irve",
    idBase: 1_000_000_000,
    idSpan: 2_000_000_000,
    envelopes: [
      [41.0, 51.5, -5.6, 10.0],
      [14.0, 19.0, -64.0, -60.0],
      [1.5, 6.0, -55.0, -51.0],
      [-22.0, -20.0, 55.0, 56.0],
      [-14.0, -12.0, 44.5, 46.0],
      [46.5, 47.5, -57.0, -55.5],
      [-23.5, -19.0, 163.0, 169.0],
      [-28.0, -7.0, -155.0, -134.0],
      [-15.0, -13.0, -179.0, -175.0],
    ],
  },
  DE: {
    dir: "de",
    idBase: 3_100_000_000,
    idSpan: 900_000_000,
    envelopes: [[47.2, 55.1, 5.8, 15.1]],
  },
};

export function isOfficialCountry(code: string): code is OfficialCountry {
  return code in DATASETS;
}

export function officialCountryOf(id: number): OfficialCountry | null {
  for (const [code, { idBase, idSpan }] of Object.entries(DATASETS)) {
    if (id >= idBase && id < idBase + idSpan) return code as OfficialCountry;
  }
  return null;
}

type StationRow = [
  id: number,
  lat: number,
  lon: number,
  title: string,
  address: string,
  town: string,
  postcode: string,
  points: number,
  verifiedOn: string,
  /** Flat triples: connector type id, kW (or null), current type id (or null). */
  connections: (number | null)[],
  /** Open Charge Map UsageType id: 1 public, 6 customers and visitors only. */
  usageTypeId: number,
];

type DetailRow = [
  usageCost: string,
  accessComments: string,
  comments: string,
  phone: string,
  /** Flat quadruples: connector type id, kW, current type id, quantity. */
  connections: (number | null)[],
];

type Store = {
  rows: StationRow[];
  lat: Float64Array;
  lon: Float64Array;
};

const gunzipAsync = promisify(gunzip);

async function readGzJson<T>(country: OfficialCountry, file: string): Promise<T> {
  const compressed = await readFile(path.join(process.cwd(), "data", DATASETS[country].dir, file));
  return JSON.parse((await gunzipAsync(compressed)).toString("utf8")) as T;
}

const stores = new Map<OfficialCountry, Promise<Store>>();
const detailStores = new Map<OfficialCountry, Promise<Record<string, DetailRow>>>();

/** Memoises a loader, but forgets a failure so the next request tries again. */
function memo<T>(cache: Map<OfficialCountry, Promise<T>>, country: OfficialCountry, load: () => Promise<T>) {
  let promise = cache.get(country);
  if (!promise) {
    promise = load().catch((err) => {
      cache.delete(country);
      throw err;
    });
    cache.set(country, promise);
  }
  return promise;
}

function loadStore(country: OfficialCountry): Promise<Store> {
  return memo(stores, country, async () => {
    const { rows } = await readGzJson<{ rows: StationRow[] }>(country, "stations.json.gz");
    const lat = new Float64Array(rows.length);
    const lon = new Float64Array(rows.length);
    rows.forEach((row, i) => {
      lat[i] = row[1];
      lon[i] = row[2];
    });
    return { rows, lat, lon };
  });
}

function loadDetails(country: OfficialCountry) {
  return memo(detailStores, country, async () => {
    const { details } = await readGzJson<{ details: Record<string, DetailRow> }>(country, "details.json.gz");
    return details;
  });
}

function queryBox(query: StationQuery): { south: number; west: number; north: number; east: number } | null {
  if (query.bbox) return query.bbox;
  if (query.lat != null && query.lon != null) {
    const km = query.distanceKm ?? 15;
    const dLat = km / 111.32;
    const dLon = km / (111.32 * Math.max(0.05, Math.cos((query.lat * Math.PI) / 180)));
    return { south: query.lat - dLat, north: query.lat + dLat, west: query.lon - dLon, east: query.lon + dLon };
  }
  return null;
}

/** False only when the query area certainly holds no station of that country. */
export function mayIncludeCountry(country: OfficialCountry, query: StationQuery): boolean {
  const box = queryBox(query);
  if (!box) return true;
  return DATASETS[country].envelopes.some(
    ([s, n, w, e]) => box.south <= n && box.north >= s && box.west <= e && box.east >= w
  );
}

function haversineKm(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const rad = Math.PI / 180;
  const dLat = (bLat - aLat) * rad;
  const dLon = (bLon - aLon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * rad) * Math.cos(bLat * rad) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function toStation(row: StationRow): Station {
  const [id, lat, lon, title, address, town, postcode, points, verifiedOn, flat, usageTypeId] = row;
  const connections: StationConnection[] = [];
  for (let i = 0; i + 2 < flat.length; i += 3) {
    const typeId = flat[i];
    const powerKw = flat[i + 1];
    const currentTypeId = flat[i + 2];
    connections.push({
      ...(typeId != null ? { typeId } : {}),
      ...(powerKw != null ? { powerKw } : {}),
      ...(currentTypeId != null ? { currentTypeId } : {}),
    });
  }
  return {
    id,
    title,
    lat,
    lon,
    ...(address ? { address } : {}),
    ...(town ? { town } : {}),
    ...(postcode ? { postcode } : {}),
    ...(usageTypeId ? { usageTypeId } : {}),
    ...(points ? { points } : {}),
    ...(verifiedOn ? { verifiedOn } : {}),
    connections,
  };
}

/**
 * Stations of one country matching the query, capped at `maxResults`.
 *
 * A capped area or country answer is thinned evenly across space; a radius
 * answer keeps the nearest stations, which is what a "near this city" list
 * wants. The client relies on a country answer that comes back exactly on its
 * cap being treated as truncated (see TileLoader in MapExplorer).
 */
export async function fetchOfficialStations(country: OfficialCountry, query: StationQuery): Promise<Station[]> {
  const { rows, lat, lon } = await loadStore(country);
  const max = Math.max(1, query.maxResults ?? 250);
  const box = queryBox(query);
  const radial = !query.bbox && query.lat != null && query.lon != null;

  const matches: number[] = [];
  const distances = radial ? new Map<number, number>() : null;

  for (let i = 0; i < rows.length; i++) {
    if (box && (lat[i] < box.south || lat[i] > box.north || lon[i] < box.west || lon[i] > box.east)) continue;
    if (radial) {
      const km = haversineKm(query.lat!, query.lon!, lat[i], lon[i]);
      if (km > (query.distanceKm ?? 15)) continue;
      distances!.set(i, km);
    }
    matches.push(i);
  }

  let picked = matches;
  if (matches.length > max) {
    if (radial) {
      picked = matches.sort((a, b) => distances!.get(a)! - distances!.get(b)!).slice(0, max);
    } else {
      const step = matches.length / max;
      picked = Array.from({ length: max }, (_, n) => matches[Math.floor(n * step)]);
    }
  }
  return picked.map((i) => toStation(rows[i]));
}

/** Per-station extras, loaded when a popup opens. Null when the station has none. */
export async function fetchOfficialDetail(id: number): Promise<StationDetail | null> {
  const country = officialCountryOf(id);
  if (!country) return null;
  const row = (await loadDetails(country))[String(id)];
  if (!row) return null;
  const [usageCost, accessComments, comments, phone, flat] = row;
  const connections: StationDetail["connections"] = [];
  for (let i = 0; i + 3 < flat.length; i += 4) {
    const typeId = flat[i];
    const powerKw = flat[i + 1];
    const currentTypeId = flat[i + 2];
    const quantity = flat[i + 3];
    connections.push({
      ...(typeId != null ? { typeId } : {}),
      ...(powerKw != null ? { powerKw } : {}),
      ...(currentTypeId != null ? { currentTypeId } : {}),
      ...(quantity ? { quantity } : {}),
    });
  }
  return {
    id,
    ...(usageCost ? { usageCost } : {}),
    ...(accessComments ? { accessComments } : {}),
    ...(comments ? { comments } : {}),
    ...(phone ? { phone } : {}),
    connections,
  };
}
