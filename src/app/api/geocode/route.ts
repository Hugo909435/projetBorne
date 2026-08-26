import { NextRequest, NextResponse } from "next/server";
import { site } from "@/lib/site";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const lang = searchParams.get("lang") || "en";

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const params = new URLSearchParams({
    q,
    format: "jsonv2",
    limit: "5",
    addressdetails: "0",
    "accept-language": lang,
  });

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
      headers: {
        "User-Agent": site.contactUserAgent,
        Accept: "application/json",
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) throw new Error(`Nominatim request failed: ${res.status}`);

    const raw: { display_name: string; lat: string; lon: string }[] = await res.json();
    const results = raw.map((r) => ({
      label: r.display_name,
      lat: Number(r.lat),
      lon: Number(r.lon),
    }));

    return NextResponse.json(
      { results },
      { headers: { "Cache-Control": "public, max-age=3600" } }
    );
  } catch {
    return NextResponse.json({ results: [], error: "Search unavailable right now." }, { status: 502 });
  }
}
