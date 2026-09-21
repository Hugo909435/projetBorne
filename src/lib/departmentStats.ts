/**
 * Per-department charging statistics, generated from the official French
 * national IRVE base by `scripts/generate_irve_data.py` and read
 * from `src/data/department-stats.json` at build time.
 *
 * "Points" are individual plugs that can serve one car; a station groups
 * several points. Only points open to the public are counted, and the
 * department is the real administrative one (from the station's postal code),
 * not a radius around the prefecture.
 */
export type DepartmentStats = {
  stations: number;
  points: number;
  /** Points delivering DC power at or above `fastThresholdKw`. */
  fastPoints: number;
  connectorBreakdown: { name: string; count: number }[];
  topTowns: { name: string; count: number }[];
};

/** Same statistics shape for the German states, from the Bundesnetzagentur register. */
export type AreaStats = DepartmentStats;

export type GermanStatsMeta = {
  source: string;
  sourceUrl: string;
  license: string;
  attribution: string;
  /** ISO date of the register release the statistics come from. */
  registerDate: string;
  generatedAt: string;
  fastThresholdKw: number;
  nationalPoints: number;
  nationalLocations: number;
};

export type DepartmentStatsMeta = {
  source: string;
  sourceUrl: string;
  license: string;
  /** ISO date the statistics were generated, shown on each page. */
  generatedAt: string;
  fastThresholdKw: number;
  nationalPublicPoints: number;
  nationalPublicStations: number;
};
