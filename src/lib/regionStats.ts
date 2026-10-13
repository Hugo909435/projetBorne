import { fetchStations, type Station } from "@/lib/openChargeMap";
import { fetchReferenceData } from "@/lib/ocmReference";
import { OUT_OF_SERVICE_STATUSES } from "@/lib/nearbyStations";
import type { RegionBbox } from "@/lib/regions";
import type { PowerBand } from "@/lib/departmentStats";

/** DC and at least 50 kW: the common "fast charging" threshold used elsewhere on the site. */
function isFastConnection(c: { currentTypeId?: number; powerKw?: number }): boolean {
  return c.currentTypeId === 30 && (c.powerKw ?? 0) >= 50;
}

/** Above this a declared power is a typo, not a charger: it is kept out of "maximum power". */
const MAX_PLAUSIBLE_KW = 600;

function powerBand(kw: number): PowerBand {
  if (kw <= 7.4) return "upTo7";
  if (kw <= 22.1) return "upTo22";
  if (kw < 50) return "upTo49";
  return kw < 150 ? "upTo149" : "from150";
}

/** Counts are stations: Open Charge Map knows the number of points for only a quarter of them. */
export type StationAggregate = {
  total: number;
  fastCount: number;
  connectorBreakdown: { name: string; count: number }[];
  topTowns: { name: string; count: number; fastCount: number }[];
  /** Stations by their most powerful connector. Those with no declared power are left out. */
  powerBands: Record<PowerBand, number>;
  maxPowerKw: number;
  /** Named operators, biggest first. */
  operators: { name: string; count: number }[];
  /** Stations whose operator is named at all: the shares above only mean something next to it. */
  operatorKnown: number;
};

export async function aggregateStations(
  stations: Station[],
  reference: Awaited<ReturnType<typeof fetchReferenceData>>
): Promise<StationAggregate> {
  const inService = stations.filter((s) => !OUT_OF_SERVICE_STATUSES.includes(s.statusTypeId ?? -1));

  let fastCount = 0;
  let maxPowerKw = 0;
  let operatorKnown = 0;
  const connectorCounts = new Map<number, number>();
  const townCounts = new Map<string, { count: number; fastCount: number }>();
  const operatorCounts = new Map<string, number>();
  const powerBands: Record<PowerBand, number> = { upTo7: 0, upTo22: 0, upTo49: 0, upTo149: 0, from150: 0 };

  for (const station of inService) {
    const isFast = station.connections.some(isFastConnection);
    if (isFast) fastCount++;

    const stationKw = Math.max(0, ...station.connections.map((c) => c.powerKw ?? 0));
    if (stationKw > 0) {
      powerBands[powerBand(stationKw)]++;
      if (stationKw <= MAX_PLAUSIBLE_KW) maxPowerKw = Math.max(maxPowerKw, stationKw);
    }

    // Open Charge Map files its placeholders ("(Unknown Operator)", "(Business
    // Owner at Location)") in brackets: they are not networks.
    const operator = station.operatorId != null ? reference.operators[station.operatorId]?.name : undefined;
    if (operator && !operator.startsWith("(")) {
      // "POD Point (UK)", "Zunder (ES)": the country suffix tells a reader of a regional page nothing.
      const name = operator.replace(/\s*\((?:[A-Z]{2}|Spain)\)$/, "");
      operatorKnown++;
      operatorCounts.set(name, (operatorCounts.get(name) ?? 0) + 1);
    }

    const seenTypes = new Set<number>();
    for (const connection of station.connections) {
      if (connection.typeId == null || seenTypes.has(connection.typeId)) continue;
      seenTypes.add(connection.typeId);
      connectorCounts.set(connection.typeId, (connectorCounts.get(connection.typeId) ?? 0) + 1);
    }

    if (station.town) {
      const town = townCounts.get(station.town) ?? { count: 0, fastCount: 0 };
      town.count++;
      if (isFast) town.fastCount++;
      townCounts.set(station.town, town);
    }
  }

  const connectorBreakdown = [...connectorCounts.entries()]
    .map(([typeId, count]) => ({ name: reference.connectionTypes[typeId] ?? `Type ${typeId}`, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topTowns = [...townCounts.entries()]
    .map(([name, town]) => ({ name, ...town }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const operators = [...operatorCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, 5);

  return {
    total: inService.length,
    fastCount,
    connectorBreakdown,
    topTowns,
    powerBands,
    maxPowerKw,
    operators,
    operatorKnown,
  };
}

/**
 * Statistics for one region, from the stations Open Charge Map returns for the
 * rectangle around it. The rectangle also covers parts of its neighbours
 * (Madrid sits inside the one around Castilla y León), so `belongs` decides,
 * from the region's real outline, which stations to keep. `countryCode` keeps
 * the neighbouring country out before that.
 */
export async function fetchRegionStats(
  bbox: RegionBbox,
  countryCode: string,
  belongs: (station: Station) => boolean
): Promise<StationAggregate> {
  const [stations, reference] = await Promise.all([
    fetchStations({ bbox, countryCode, maxResults: 30000 }),
    fetchReferenceData(),
  ]);

  return aggregateStations(stations.filter(belongs), reference);
}
