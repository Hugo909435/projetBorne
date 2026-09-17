import { fetchStations, type Station } from "@/lib/openChargeMap";
import { fetchReferenceData } from "@/lib/ocmReference";
import { OUT_OF_SERVICE_STATUSES } from "@/lib/nearbyStations";
import type { Region } from "@/lib/regions";

/** DC and at least 50 kW: the common "fast charging" threshold used elsewhere on the site. */
function isFastConnection(c: { currentTypeId?: number; powerKw?: number }): boolean {
  return c.currentTypeId === 30 && (c.powerKw ?? 0) >= 50;
}

export type StationAggregate = {
  total: number;
  fastCount: number;
  connectorBreakdown: { name: string; count: number }[];
  topTowns: { name: string; count: number }[];
};

export async function aggregateStations(
  stations: Station[],
  reference: Awaited<ReturnType<typeof fetchReferenceData>>
): Promise<StationAggregate> {
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

/**
 * Unlike a French department (small enough that a point + fixed radius is a
 * fair approximation, see `departmentStats.ts`), a German Bundesland or
 * Spanish comunidad autónoma can span several hundred km - a radius from its
 * capital would only ever see stations near that one city. A bounding box
 * around the region's real (non-rectangular) extent gets much closer to
 * whole-region coverage, at the cost of including a bit of neighbouring
 * territory and, for coastal/island regions, some empty sea.
 */
export async function fetchRegionStats(region: Region): Promise<StationAggregate> {
  const [stations, reference] = await Promise.all([
    fetchStations({ bbox: region.bbox, maxResults: 30000 }),
    fetchReferenceData(),
  ]);

  return aggregateStations(stations, reference);
}
