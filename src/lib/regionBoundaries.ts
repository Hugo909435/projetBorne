import type { RegionBbox } from "@/lib/regions";

/**
 * Real region borders, for the countries whose station data carries no usable
 * region field (Open Charge Map: Spain and the UK).
 *
 * A bounding box is a poor stand-in for a region: the box around Castilla y
 * León contains Madrid, the one around Wales contains Liverpool. Counting
 * stations by box credits each region with its neighbours' biggest cities.
 * `data/geo/region-boundaries.json` holds the actual outlines, written by
 * `scripts/generate-region-boundaries.ts` from Eurostat GISCO.
 */

/** GeoJSON MultiPolygon coordinates: polygons > rings > [lon, lat]. The first ring is the outline, the rest are holes. */
export type MultiPolygon = number[][][][];

export type RegionBoundariesFile = {
  source: string;
  sourceUrl: string;
  attribution: string;
  generatedAt: string;
  regions: Record<string, MultiPolygon>;
};

function inRing(ring: number[][], lon: number, lat: number): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export function containsPoint(shape: MultiPolygon, lon: number, lat: number): boolean {
  return shape.some(
    ([outline, ...holes]) => inRing(outline, lon, lat) && !holes.some((hole) => inRing(hole, lon, lat))
  );
}

export function bboxOf(shape: MultiPolygon): RegionBbox {
  const bbox = { south: 90, west: 180, north: -90, east: -180 };
  for (const polygon of shape) {
    for (const [lon, lat] of polygon[0]) {
      bbox.south = Math.min(bbox.south, lat);
      bbox.north = Math.max(bbox.north, lat);
      bbox.west = Math.min(bbox.west, lon);
      bbox.east = Math.max(bbox.east, lon);
    }
  }
  return bbox;
}

/** Rough distance in km from a point to the nearest vertex of the outline: enough to pick the closest region. */
export function distanceToOutlineKm(shape: MultiPolygon, lon: number, lat: number): number {
  const lonScale = Math.cos((lat * Math.PI) / 180);
  let best = Infinity;
  for (const polygon of shape) {
    for (const [x, y] of polygon[0]) {
      const d = ((x - lon) * lonScale) ** 2 + (y - lat) ** 2;
      if (d < best) best = d;
    }
  }
  return Math.sqrt(best) * 111.32;
}

/**
 * A charger on a pier or a harbour wall falls just outside a simplified
 * coastline. Up to this distance it still belongs to the nearest region.
 */
const COAST_TOLERANCE_KM = 5;

/** Slug of the region a point belongs to, among the given ones. */
export function regionOfPoint(
  regions: Record<string, MultiPolygon>,
  slugs: string[],
  lon: number,
  lat: number
): string | undefined {
  const inside = slugs.find((slug) => containsPoint(regions[slug], lon, lat));
  if (inside) return inside;

  let nearest: string | undefined;
  let nearestKm = COAST_TOLERANCE_KM;
  for (const slug of slugs) {
    const km = distanceToOutlineKm(regions[slug], lon, lat);
    if (km < nearestKm) {
      nearestKm = km;
      nearest = slug;
    }
  }
  return nearest;
}
