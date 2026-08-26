import { NextResponse } from "next/server";
import { fetchReferenceData } from "@/lib/ocmReference";

export const revalidate = 86400;

/** Connector and operator names, fetched once per visitor and cached hard. */
export async function GET() {
  try {
    const reference = await fetchReferenceData();
    return NextResponse.json(reference, {
      headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" },
    });
  } catch {
    return NextResponse.json(
      { connectionTypes: {}, operators: {}, outOfService: [] },
      { status: 502 }
    );
  }
}
