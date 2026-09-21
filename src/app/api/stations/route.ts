import { NextRequest, NextResponse } from "next/server";
import { promisify } from "node:util";
import { gzip } from "node:zlib";
import { fetchStations } from "@/lib/stationSource";
import { cached } from "@/lib/serverCache";
import { countryByCode } from "@/lib/countries";
import { COUNTRY_MAX_RESULTS } from "@/lib/stationTiles";

export const revalidate = 3600;

const gzipAsync = promisify(gzip);
/** Below this a response is already tiny; compressing it costs more than it saves. */
const MIN_COMPRESS_BYTES = 8 * 1024;
const CACHE_CONTROL = "public, max-age=1800, stale-while-revalidate=3600";

type Encoded = { plain: Buffer; gzipped: Buffer | null };

async function encode(stations: unknown): Promise<Encoded> {
  const plain = Buffer.from(JSON.stringify({ stations }));
  // Next only compresses rendered pages, not route handler output, and the
  // whole-country answer is several MB of JSON.
  const gzipped = plain.length >= MIN_COMPRESS_BYTES ? await gzipAsync(plain) : null;
  return { plain, gzipped };
}

function respond(req: NextRequest, { plain, gzipped }: Encoded): Response {
  const acceptsGzip = /\bgzip\b/.test(req.headers.get("accept-encoding") ?? "");
  const useGzip = acceptsGzip && gzipped !== null;
  return new Response(new Uint8Array(useGzip ? gzipped : plain), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": CACHE_CONTROL,
      Vary: "Accept-Encoding",
      ...(useGzip ? { "Content-Encoding": "gzip" } : {}),
    },
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const distance = searchParams.get("distance");
  const bbox = searchParams.get("bbox");
  const country = searchParams.get("country");
  const maxResults = searchParams.get("maxResults");

  const requested = maxResults ? Number(maxResults) : 1000;
  const cappedMaxResults = Math.min(Math.max(requested, 1), 30000);

  let bboxQuery: { south: number; west: number; north: number; east: number } | undefined;
  if (bbox) {
    const parts = bbox.split(",").map(Number);
    if (parts.length === 4 && parts.every((n) => Number.isFinite(n))) {
      const [south, west, north, east] = parts;
      bboxQuery = { south, west, north, east };
    }
  }

  const load = async () =>
    encode(
      await fetchStations({
        lat: lat ? Number(lat) : undefined,
        lon: lon ? Number(lon) : undefined,
        distanceKm: distance ? Number(distance) : undefined,
        bbox: bboxQuery,
        countryCode: country || undefined,
        maxResults: cappedMaxResults,
      })
    );

  // The whole-country seed is identical for every visitor and by far the
  // biggest answer, so its compressed form is kept for the cache window.
  // Tiles are small and numerous: those are encoded per request. Only the
  // exact request the map sends for a supported country is cached, so an
  // arbitrary query string can't grow the cache.
  const isCountrySeed =
    Boolean(country) &&
    countryByCode(country!.toUpperCase()) !== undefined &&
    !bboxQuery &&
    !lat &&
    !lon &&
    cappedMaxResults === COUNTRY_MAX_RESULTS;

  try {
    const encoded = isCountrySeed
      ? await cached(`seed:${country!.toUpperCase()}`, load, {
          freshMs: 30 * 60 * 1000,
          staleMs: 60 * 60 * 1000,
        })
      : await load();
    return respond(req, encoded);
  } catch {
    return NextResponse.json(
      { stations: [], error: "Unable to fetch stations right now." },
      { status: 502 }
    );
  }
}
