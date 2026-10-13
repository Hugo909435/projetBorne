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
export type PowerBand = "upTo7" | "upTo22" | "upTo49" | "upTo149" | "from150";
export type Siting = "street" | "publicParking" | "privateParking" | "customerParking" | "fastHub";

/** What both official registers (France, Germany) give for an area. */
export type AreaStats = {
  stations: number;
  points: number;
  /** Points delivering at or above `fastThresholdKw`. */
  fastPoints: number;
  connectorBreakdown: { name: string; count: number }[];
  /** `count` is stations. */
  topTowns: { name: string; count: number; points: number; fastPoints: number }[];
  /** Official population and area (INSEE for France, Eurostat for Germany). */
  population: number;
  areaKm2: number;
  maxPowerKw: number;
  /** Points per declared power, in kW. Bands do not overlap. */
  powerBands: Record<PowerBand, number>;
  /** Brands or operators running the chargers, biggest first. */
  networks: { name: string; points: number }[];
};

/** The French base also says what kind of site each point is on. */
export type DepartmentStats = AreaStats & {
  /** Points per kind of site, as declared by the operator. */
  siting: Record<Siting, number>;
};

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
