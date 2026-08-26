import { site } from "@/lib/site";
import { cached } from "@/lib/serverCache";

const OCM_BASE = "https://api.openchargemap.io/v3/poi/";

/**
 * A station as the map needs it.
 *
 * Reference data (connector names, operators, access and status wording) is
 * carried as Open Charge Map ids rather than text: the same few hundred labels
 * would otherwise be repeated across tens of thousands of stations. The client
 * resolves them once against `/api/reference`. Fields the source didn't provide
 * are omitted entirely, which is worth a lot at country scale - an operator is
 * known for only about 40% of stations, a point count for a quarter of them.
 */
export type StationConnection = {
  /** Open Charge Map ConnectionType id (Type 2, CCS, CHAdeMO...). */
  typeId?: number;
  powerKw?: number;
  /** CurrentType id: 10 AC single-phase, 20 AC three-phase, 30 DC. */
  currentTypeId?: number;
};

export type Station = {
  id: number;
  title: string;
  lat: number;
  lon: number;
  address?: string;
  town?: string;
  postcode?: string;
  operatorId?: number;
  /** UsageType id: public, membership required, private... */
  usageTypeId?: number;
  /** StatusType id: operational, in use, out of service... */
  statusTypeId?: number;
  /** Number of charging points at the location. */
  points?: number;
  /** Date part only (YYYY-MM-DD) of the last verification. */
  verifiedOn?: string;
  connections: StationConnection[];
};

/** Extra detail, loaded lazily when a station's popup is opened. */
export type StationDetail = {
  id: number;
  usageCost?: string;
  /** How to get in: barrier codes, opening hours, floor level... */
  accessComments?: string;
  comments?: string;
  phone?: string;
  url?: string;
  /** Richer per-connector detail than the map payload carries. */
  connections: (StationConnection & { quantity?: number; amps?: number; volts?: number })[];
};

// A country-wide payload is tens of thousands of stations, so every field and
// every digit is paid for on the wire. Five decimals is metre-level precision:
// far more than a map pin needs, and it shortens most coordinates by half.
function round5(value: number): number {
  return Math.round(value * 1e5) / 1e5;
}

function num(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function text(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

/** Same connector listed several times adds nothing to the popup. */
function dedupeConnections(connections: StationConnection[]): StationConnection[] {
  const seen = new Set<string>();
  return connections.filter((c) => {
    const key = `${c.typeId}|${c.powerKw}|${c.currentTypeId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

type OcmRawConnection = {
  ConnectionTypeID?: number;
  PowerKW?: number;
  CurrentTypeID?: number;
  LevelID?: number;
  Amps?: number;
  Voltage?: number;
  Quantity?: number;
};

type OcmRawPoi = {
  ID: number;
  AddressInfo?: {
    Title?: string;
    AddressLine1?: string;
    Town?: string;
    Postcode?: string;
    Latitude?: number;
    Longitude?: number;
    ContactTelephone1?: string;
    AccessComments?: string;
    RelatedURL?: string;
  };
  OperatorID?: number;
  UsageTypeID?: number;
  StatusTypeID?: number;
  NumberOfPoints?: number;
  UsageCost?: string;
  GeneralComments?: string;
  DateLastVerified?: string;
  Connections?: OcmRawConnection[];
};

function mapConnection(c: OcmRawConnection): StationConnection {
  return {
    ...(num(c.ConnectionTypeID) != null ? { typeId: c.ConnectionTypeID } : {}),
    ...(num(c.PowerKW) != null ? { powerKw: c.PowerKW } : {}),
    ...(num(c.CurrentTypeID) != null ? { currentTypeId: c.CurrentTypeID } : {}),
  };
}

function mapPoi(poi: OcmRawPoi): Station | null {
  const lat = num(poi.AddressInfo?.Latitude);
  const lon = num(poi.AddressInfo?.Longitude);
  if (lat == null || lon == null) return null;

  // Id 0 means "unknown" in both enumerations, which is the same as absent.
  const usageTypeId = num(poi.UsageTypeID);
  const statusTypeId = num(poi.StatusTypeID);

  return {
    id: poi.ID,
    title: text(poi.AddressInfo?.Title) ?? "Charging point",
    lat: round5(lat),
    lon: round5(lon),
    ...(text(poi.AddressInfo?.AddressLine1) ? { address: text(poi.AddressInfo?.AddressLine1) } : {}),
    ...(text(poi.AddressInfo?.Town) ? { town: text(poi.AddressInfo?.Town) } : {}),
    ...(text(poi.AddressInfo?.Postcode) ? { postcode: text(poi.AddressInfo?.Postcode) } : {}),
    ...(num(poi.OperatorID) ? { operatorId: poi.OperatorID } : {}),
    ...(usageTypeId ? { usageTypeId } : {}),
    ...(statusTypeId ? { statusTypeId } : {}),
    ...(num(poi.NumberOfPoints) ? { points: poi.NumberOfPoints } : {}),
    ...(poi.DateLastVerified ? { verifiedOn: poi.DateLastVerified.slice(0, 10) } : {}),
    connections: dedupeConnections((poi.Connections || []).map(mapConnection)),
  };
}

function mapDetail(poi: OcmRawPoi): StationDetail {
  return {
    id: poi.ID,
    ...(text(poi.UsageCost) ? { usageCost: text(poi.UsageCost) } : {}),
    ...(text(poi.AddressInfo?.AccessComments)
      ? { accessComments: text(poi.AddressInfo?.AccessComments) }
      : {}),
    ...(text(poi.GeneralComments) ? { comments: text(poi.GeneralComments) } : {}),
    ...(text(poi.AddressInfo?.ContactTelephone1)
      ? { phone: text(poi.AddressInfo?.ContactTelephone1) }
      : {}),
    ...(text(poi.AddressInfo?.RelatedURL) ? { url: text(poi.AddressInfo?.RelatedURL) } : {}),
    connections: (poi.Connections || []).map((c) => ({
      ...mapConnection(c),
      ...(num(c.Amps) ? { amps: c.Amps } : {}),
      ...(num(c.Voltage) ? { volts: c.Voltage } : {}),
      ...(num(c.Quantity) ? { quantity: c.Quantity } : {}),
    })),
  };
}

export type StationQuery = {
  lat?: number;
  lon?: number;
  distanceKm?: number;
  bbox?: { south: number; west: number; north: number; east: number };
  maxResults?: number;
  countryCode?: string;
};

const STATION_CACHE = { freshMs: 30 * 60 * 1000, staleMs: 60 * 60 * 1000 };

/**
 * A wide viewport tiles into up to 16 parallel sub-requests (see
 * `fetchTiledBbox` below), and several such tiles can be in flight at once
 * from the client's own concurrency budget - the default zoomed-out home
 * page view alone is one overview tile that fans out to 16. Open Charge Map
 * rate-limits by request rate, not just by how many are in flight at once, so
 * capping concurrency isn't enough: requests still have to be paced. A failed
 * country seed request is also never retried by the client (it believes the
 * country is already covered), so a burst that 429s leaves permanent holes in
 * the map unless it's retried here.
 *
 * `nextSlotAt` paces every outbound call to a fixed minimum spacing
 * regardless of how many arrive at once; on top of that, an individual 429 is
 * retried a few times with backoff (honoring `Retry-After` when present).
 */
const OCM_MIN_INTERVAL_MS = 150;
let nextSlotAt = 0;

function scheduleOcmSlot(): Promise<void> {
  const now = Date.now();
  const runAt = Math.max(now, nextSlotAt);
  nextSlotAt = runAt + OCM_MIN_INTERVAL_MS;
  const delay = runAt - now;
  return delay > 0 ? sleep(delay) : Promise.resolve();
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const OCM_MAX_RETRIES = 3;

class OcmHttpError extends Error {
  constructor(
    public status: number,
    public retryAfterMs: number | null
  ) {
    super(`OCM request failed with ${status}`);
  }
}

function parseRetryAfter(header: string | null): number | null {
  if (!header) return null;
  const seconds = Number(header);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const date = Date.parse(header);
  return Number.isFinite(date) ? Math.max(0, date - Date.now()) : null;
}

async function fetchOnce<T>(path: string, params: URLSearchParams, apiKey: string | undefined): Promise<T> {
  const res = await fetch(`${path}?${params.toString()}`, {
    headers: {
      "User-Agent": site.contactUserAgent,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 403 && !apiKey) {
      console.error(
        "Open Charge Map a renvoyé 403 : une clé API est requise. Définissez OCM_API_KEY (clé gratuite sur https://openchargemap.org/site/developerinfo)."
      );
    } else {
      console.error(`Open Charge Map a renvoyé ${res.status}.`);
    }
    throw new OcmHttpError(res.status, parseRetryAfter(res.headers.get("retry-after")));
  }

  return (await res.json()) as T;
}

export async function ocmRequest<T>(path: string, params: URLSearchParams): Promise<T> {
  const apiKey = process.env.OCM_API_KEY;
  if (apiKey) params.set("key", apiKey);

  for (let attempt = 0; ; attempt++) {
    await scheduleOcmSlot();
    try {
      return await fetchOnce<T>(path, params, apiKey);
    } catch (err) {
      const isRateLimited = err instanceof OcmHttpError && err.status === 429;
      if (isRateLimited && attempt < OCM_MAX_RETRIES) {
        await sleep(err.retryAfterMs ?? 500 * (attempt + 1));
        continue;
      }
      throw err;
    }
  }
}

async function fetchFromOcm(params: URLSearchParams): Promise<Station[]> {
  const raw = await ocmRequest<OcmRawPoi[]>(OCM_BASE, params);
  return raw.map(mapPoi).filter((s): s is Station => s !== null);
}

/** Everything a popup shows beyond what the map payload already carries. */
export function fetchStationDetail(id: number): Promise<StationDetail | null> {
  return cached(
    `detail:${id}`,
    async () => {
      const params = new URLSearchParams({
        output: "json",
        compact: "true",
        verbose: "false",
        chargepointid: String(id),
      });
      const raw = await ocmRequest<OcmRawPoi[]>(OCM_BASE, params);
      return raw.length ? mapDetail(raw[0]) : null;
    },
    STATION_CACHE
  );
}

/** Single, untiled Open Charge Map request for one bbox/country/point query. */
function fetchSingle(query: StationQuery, maxResults: number): Promise<Station[]> {
  const params = new URLSearchParams({
    output: "json",
    compact: "true",
    verbose: "false",
    maxresults: String(maxResults),
  });

  if (query.countryCode) params.set("countrycode", query.countryCode);

  if (query.bbox) {
    const { south, west, north, east } = query.bbox;
    params.set("boundingbox", `(${south},${west}),(${north},${east})`);
  } else if (query.lat != null && query.lon != null) {
    params.set("latitude", String(query.lat));
    params.set("longitude", String(query.lon));
    params.set("distance", String(query.distanceKm ?? 15));
    params.set("distanceunit", "KM");
  }

  // Keyed before the API key is appended, so rotating the key doesn't
  // invalidate a warm cache.
  const cacheKey = params.toString();
  // Failures deliberately propagate: the map treats a failed tile as "not
  // loaded yet" and retries it, whereas an empty result would be cached as a
  // permanent hole in the coverage.
  return cached(cacheKey, () => fetchFromOcm(params), STATION_CACHE);
}

// Open Charge Map doesn't return bbox results in a geographically even
// order, so a single capped request over a wide viewport (several
// countries) ends up dense in whichever region its database happens to
// list first and empty everywhere else - e.g. only France, or only its
// neighbours, never both. Splitting a wide bbox into a grid and giving
// each cell its own share of the results budget fixes that: every region
// in view is guaranteed some of the cap instead of the whole cap going to
// one. Small bboxes (city/metro-level panning, the common case) are well
// under TILE_DEG and skip this entirely, going through the fast single-
// request path unchanged.
const TILE_DEG = 4;
const MAX_TILES_PER_AXIS = 4;

function tilesForSpan(spanDeg: number): number {
  return Math.min(MAX_TILES_PER_AXIS, Math.max(1, Math.ceil(spanDeg / TILE_DEG)));
}

async function fetchTiledBbox(
  bbox: { south: number; west: number; north: number; east: number },
  query: StationQuery,
  maxResults: number
): Promise<Station[]> {
  const tilesX = tilesForSpan(bbox.east - bbox.west);
  const tilesY = tilesForSpan(bbox.north - bbox.south);

  if (tilesX === 1 && tilesY === 1) {
    return fetchSingle({ ...query, bbox }, maxResults);
  }

  const tileCount = tilesX * tilesY;
  // Floor the per-cell budget rather than dividing all the way down: a cell
  // starved to a couple of hundred results is what left whole regions looking
  // empty next to a well-covered neighbour.
  const perTileMax = Math.max(800, Math.floor(maxResults / tileCount));
  const lonStep = (bbox.east - bbox.west) / tilesX;
  const latStep = (bbox.north - bbox.south) / tilesY;

  const tileRequests: Promise<Station[]>[] = [];
  for (let ix = 0; ix < tilesX; ix++) {
    for (let iy = 0; iy < tilesY; iy++) {
      const west = bbox.west + ix * lonStep;
      const east = ix === tilesX - 1 ? bbox.east : west + lonStep;
      const south = bbox.south + iy * latStep;
      const north = iy === tilesY - 1 ? bbox.north : south + latStep;
      tileRequests.push(fetchSingle({ ...query, bbox: { south, west, north, east } }, perTileMax));
    }
  }

  // One flaky cell shouldn't sink a whole continent-wide view; the result is
  // then a bit thinner in one corner, which is the same kind of incompleteness
  // the per-cell caps already impose at this zoom. All cells failing is a real
  // failure and propagates.
  const settled = await Promise.allSettled(tileRequests);
  const fulfilled = settled.filter(
    (r): r is PromiseFulfilledResult<Station[]> => r.status === "fulfilled"
  );
  if (!fulfilled.length) throw new Error("every bbox tile request failed");

  const byId = new Map<number, Station>();
  for (const result of fulfilled) {
    for (const station of result.value) byId.set(station.id, station);
  }
  return Array.from(byId.values());
}

export async function fetchStations(query: StationQuery): Promise<Station[]> {
  const maxResults = query.maxResults ?? 250;
  if (query.bbox) return fetchTiledBbox(query.bbox, query, maxResults);
  return fetchSingle(query, maxResults);
}
