import { NextRequest, NextResponse } from "next/server";
import { fetchStations } from "@/lib/openChargeMap";

export const revalidate = 3600;

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

  try {
    const stations = await fetchStations({
      lat: lat ? Number(lat) : undefined,
      lon: lon ? Number(lon) : undefined,
      distanceKm: distance ? Number(distance) : undefined,
      bbox: bboxQuery,
      countryCode: country || undefined,
      maxResults: cappedMaxResults,
    });
    return NextResponse.json(
      { stations },
      { headers: { "Cache-Control": "public, max-age=1800, stale-while-revalidate=3600" } }
    );
  } catch {
    return NextResponse.json(
      { stations: [], error: "Unable to fetch stations right now." },
      { status: 502 }
    );
  }
}
