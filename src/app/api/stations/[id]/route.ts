import { NextRequest, NextResponse } from "next/server";
import { fetchStationDetail } from "@/lib/openChargeMap";

export const revalidate = 3600;

/** Extra detail for one station, loaded when its popup is opened. */
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const stationId = Number(id);
  if (!Number.isInteger(stationId) || stationId <= 0) {
    return NextResponse.json({ error: "Invalid station id." }, { status: 400 });
  }

  try {
    const detail = await fetchStationDetail(stationId);
    if (!detail) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json(detail, {
      headers: { "Cache-Control": "public, max-age=1800, stale-while-revalidate=3600" },
    });
  } catch {
    return NextResponse.json({ error: "Unable to fetch station detail." }, { status: 502 });
  }
}
