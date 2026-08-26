import type { Station } from "@/lib/openChargeMap";

/**
 * Mirrors the status classification stationPopup.ts uses for its badges:
 * statuses meaning "broken" are dropped entirely rather than shown as either
 * state, and a missing status is treated as available (the common case -
 * most OCM stations carry no status at all).
 */
const OUT_OF_SERVICE_STATUSES = [100, 150, 200, 210];
const WARNING_STATUSES = [20, 30, 75];

export type NearbyRow = {
  id: number;
  station: Station;
  distanceKm: number;
  powerKw: number | null;
  available: boolean;
};

export function haversineKm(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLon = ((bLon - aLon) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

function maxPowerKw(station: Station): number | null {
  return station.connections.reduce<number | null>((max, c) => {
    if (c.powerKw == null) return max;
    return max == null ? c.powerKw : Math.max(max, c.powerKw);
  }, null);
}

/** The 3 closest in-service stations to `origin`, nearest first. */
export function rankNearby(
  stations: Station[],
  origin: { lat: number; lon: number }
): NearbyRow[] {
  return stations
    .filter((s) => !OUT_OF_SERVICE_STATUSES.includes(s.statusTypeId ?? -1))
    .map((s) => ({
      id: s.id,
      station: s,
      distanceKm: haversineKm(origin.lat, origin.lon, s.lat, s.lon),
      powerKw: maxPowerKw(s),
      available: !WARNING_STATUSES.includes(s.statusTypeId ?? -1),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 3);
}
