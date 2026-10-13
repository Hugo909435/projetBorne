import type { AreaStats, DepartmentStats, PowerBand, Siting } from "@/lib/departmentStats";
import type { StationAggregate } from "@/lib/regionStats";
import { chargingNetworks } from "@/lib/chargingNetworks";

/**
 * What a location page says beyond the raw counts: where the area stands among
 * its peers. Everything here is derived from the generated statistics files,
 * so the sentences built on it cannot drift from the tables beside them.
 */

export const powerBandOrder: PowerBand[] = ["upTo7", "upTo22", "upTo49", "upTo149", "from150"];

/** Within this many percent of the reference figure, an area is "close to" it. */
const CLOSE_PERCENT = 5;

export type Trend = "above" | "below" | "close";

export const percent = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 100) : 0);

function trend(value: number, reference: number): Trend {
  if (reference <= 0) return "close";
  const gap = ((value - reference) / reference) * 100;
  if (Math.abs(gap) <= CLOSE_PERCENT) return "close";
  return gap > 0 ? "above" : "below";
}

function rankOf<T>(all: T[], own: T, metric: (item: T) => number): number {
  const value = metric(own);
  return 1 + all.filter((other) => metric(other) > value).length;
}

function distanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

/** The `count` places closest to `self`, nearest first. */
export function nearestPlaces<T extends { slug: string; lat: number; lon: number }>(
  places: T[],
  self: T,
  count: number
): T[] {
  return places
    .filter((other) => other.slug !== self.slug)
    .map((other) => ({ other, km: distanceKm(self, other) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, count)
    .map(({ other }) => other);
}

// ---------------------------------------------------------------------------
// Official registers (France, Germany): counted in charge points.
// ---------------------------------------------------------------------------

export type AreaInsights = {
  /** Number of areas ranked: every rank below is out of this. */
  total: number;
  pointsRank: number;
  pointsPer100k: number;
  nationalPointsPer100k: number;
  densityRank: number;
  densityTrend: Trend;
  pointsPer100Km2: number;
  /** Shares are whole percents. */
  fastShare: number;
  nationalFastShare: number;
  fastShareRank: number;
  fastTrend: Trend;
  ultraFastPoints: number;
  /** Among the best-equipped towns, the one with the most fast points. */
  fastestTown: { name: string; fastPoints: number } | null;
};

const per100k = (s: AreaStats) => (s.points / s.population) * 100_000;
const fastRatio = (s: AreaStats) => (s.points > 0 ? s.fastPoints / s.points : 0);

export function getAreaInsights(all: Record<string, AreaStats>, slug: string): AreaInsights | null {
  const own = all[slug];
  if (!own || own.points === 0 || !own.population) return null;

  const peers = Object.values(all);
  const nationalPoints = peers.reduce((sum, s) => sum + s.points, 0);
  const nationalFastPoints = peers.reduce((sum, s) => sum + s.fastPoints, 0);
  const nationalPopulation = peers.reduce((sum, s) => sum + s.population, 0);
  const nationalPointsPer100k = (nationalPoints / nationalPopulation) * 100_000;
  const nationalFastRatio = nationalPoints > 0 ? nationalFastPoints / nationalPoints : 0;

  const fastestTown = own.topTowns.reduce<AreaStats["topTowns"][number] | null>(
    (best, town) => (town.fastPoints > (best?.fastPoints ?? 0) ? town : best),
    null
  );

  return {
    total: peers.length,
    pointsRank: rankOf(peers, own, (s) => s.points),
    pointsPer100k: per100k(own),
    nationalPointsPer100k,
    densityRank: rankOf(peers, own, per100k),
    densityTrend: trend(per100k(own), nationalPointsPer100k),
    pointsPer100Km2: own.areaKm2 > 0 ? (own.points / own.areaKm2) * 100 : 0,
    fastShare: percent(own.fastPoints, own.points),
    nationalFastShare: Math.round(nationalFastRatio * 100),
    fastShareRank: rankOf(peers, own, fastRatio),
    fastTrend: trend(fastRatio(own), nationalFastRatio),
    ultraFastPoints: own.powerBands.from150,
    fastestTown: fastestTown ? { name: fastestTown.name, fastPoints: fastestTown.fastPoints } : null,
  };
}

/** The kind of site most points of a department are on, with its share of the points that declare one. */
export function dominantSiting(stats: DepartmentStats): { key: Siting; share: number } | null {
  const entries = Object.entries(stats.siting) as [Siting, number][];
  const total = entries.reduce((sum, [, count]) => sum + count, 0);
  if (total === 0) return null;
  const [key, count] = entries.reduce((best, entry) => (entry[1] > best[1] ? entry : best));
  return { key, share: percent(count, total) };
}

// ---------------------------------------------------------------------------
// Open Charge Map (Spain, UK): counted in stations, the only unit it has for
// every entry. No population-based figure: a collaborative base is not
// complete enough to carry a "per inhabitant" comparison.
// ---------------------------------------------------------------------------

export type RegionInsights = {
  /** Number of regions of the country: every rank below is out of this. */
  count: number;
  totalRank: number;
  /** Whole percent of the country's listed stations that are in this region. */
  countryShare: number;
  countryTotal: number;
  fastShare: number;
  countryFastShare: number;
  fastShareRank: number;
  fastTrend: Trend;
  ultraFastStations: number;
  fastestTown: { name: string; fastCount: number } | null;
};

const stationFastRatio = (s: StationAggregate) => (s.total > 0 ? s.fastCount / s.total : 0);

export function getRegionInsights(
  all: Record<string, StationAggregate>,
  countrySlugs: string[],
  slug: string
): RegionInsights | null {
  const own = all[slug];
  if (!own || own.total === 0) return null;

  const peers = countrySlugs.map((s) => all[s]).filter(Boolean);
  const countryTotal = peers.reduce((sum, s) => sum + s.total, 0);
  const countryFast = peers.reduce((sum, s) => sum + s.fastCount, 0);
  const countryFastRatio = countryTotal > 0 ? countryFast / countryTotal : 0;

  const fastestTown = own.topTowns.reduce<StationAggregate["topTowns"][number] | null>(
    (best, town) => (town.fastCount > (best?.fastCount ?? 0) ? town : best),
    null
  );

  return {
    count: peers.length,
    totalRank: rankOf(peers, own, (s) => s.total),
    countryShare: percent(own.total, countryTotal),
    countryTotal,
    fastShare: percent(own.fastCount, own.total),
    countryFastShare: Math.round(countryFastRatio * 100),
    fastShareRank: rankOf(peers, own, stationFastRatio),
    fastTrend: trend(stationFastRatio(own), countryFastRatio),
    ultraFastStations: own.powerBands.from150,
    fastestTown: fastestTown ? { name: fastestTown.name, fastCount: fastestTown.fastCount } : null,
  };
}

const firstWord = (text: string) => text.trim().split(/\s+/)[0].toLowerCase();

/** Slug of the network page matching a brand or operator name, when there is one. */
export function networkSlugForBrand(brand: string): string | undefined {
  return chargingNetworks.find((network) => firstWord(network.name) === firstWord(brand))?.slug;
}
