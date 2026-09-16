import { fetchStations } from "@/lib/openChargeMap";
import { fetchReferenceData } from "@/lib/ocmReference";
import { OUT_OF_SERVICE_STATUSES } from "@/lib/nearbyStations";
import type { Department } from "@/lib/departments";

/**
 * Departments have no single coordinate or clean bounding box in `cities.ts`
 * (only the prefecture's point). A fixed radius around that point is an
 * approximation, not the administrative boundary - the copy that uses this
 * data says "within N km", never "in the department", to stay accurate.
 */
export const DEPARTMENT_RADIUS_KM = 30;

/** DC and at least 50 kW: the common "fast charging" threshold used elsewhere on the site. */
function isFastConnection(c: { currentTypeId?: number; powerKw?: number }): boolean {
  return c.currentTypeId === 30 && (c.powerKw ?? 0) >= 50;
}

export type DepartmentStats = {
  total: number;
  fastCount: number;
  connectorBreakdown: { name: string; count: number }[];
  topTowns: { name: string; count: number }[];
};

export async function fetchDepartmentStats(dept: Department): Promise<DepartmentStats> {
  const [stations, reference] = await Promise.all([
    fetchStations({
      lat: dept.lat,
      lon: dept.lon,
      distanceKm: DEPARTMENT_RADIUS_KM,
      maxResults: 500,
    }),
    fetchReferenceData(),
  ]);

  const inService = stations.filter((s) => !OUT_OF_SERVICE_STATUSES.includes(s.statusTypeId ?? -1));

  let fastCount = 0;
  const connectorCounts = new Map<number, number>();
  const townCounts = new Map<string, number>();

  for (const station of inService) {
    if (station.connections.some(isFastConnection)) fastCount++;

    const seenTypes = new Set<number>();
    for (const connection of station.connections) {
      if (connection.typeId == null || seenTypes.has(connection.typeId)) continue;
      seenTypes.add(connection.typeId);
      connectorCounts.set(connection.typeId, (connectorCounts.get(connection.typeId) ?? 0) + 1);
    }

    if (station.town) {
      townCounts.set(station.town, (townCounts.get(station.town) ?? 0) + 1);
    }
  }

  const connectorBreakdown = [...connectorCounts.entries()]
    .map(([typeId, count]) => ({ name: reference.connectionTypes[typeId] ?? `Type ${typeId}`, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topTowns = [...townCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return { total: inService.length, fastCount, connectorBreakdown, topTowns };
}
