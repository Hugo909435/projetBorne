/**
 * Types for the rapid-charger reliability barometer.
 *
 * What the barometer measures, and what it does not:
 *
 * It counts, among the rapid chargers (Open Charge Map level 3) each country
 * lists, how many carry a status that is not operational. That status is
 * reported by operators and by drivers through Open Charge Map, so it is a
 * picture of *reported* reliability, not live telemetry from the chargers. A
 * network that reports its own faults diligently will look worse than one that
 * never updates anything, and the page has to say so.
 *
 * It is still the only figure of its kind published per country on a
 * consistent basis, which is the point: one source and one method applied
 * identically to all six countries, so the comparison between them is fair
 * even where the absolute level is uncertain.
 *
 * `capped` marks a country whose station list hit the request ceiling. The
 * rates stay usable (they come from a large sample) but the totals are a floor,
 * and the page labels them as such.
 */

export type ReliabilityCountry = {
  countryCode: string;
  /** Rapid chargers seen for this country. */
  sample: number;
  /** Of those, the ones whose status is flagged as not operational. */
  outOfService: number;
  /** Of those, the ones whose status is a temporary warning (in use, planned). */
  warning: number;
  /** Share of the sample that is out of service, in percent, one decimal. */
  outOfServiceRate: number;
  /** Stations carrying a verification date within the last 12 months. */
  recentlyVerified: number;
  /** True when the sample hit the request ceiling, so totals are a floor. */
  capped: boolean;
};

export type ReliabilityFile = {
  generatedAt: string;
  source: string;
  sourceUrl: string;
  /** The Open Charge Map level used to define "rapid". */
  levelId: number;
  countries: ReliabilityCountry[];
};

/** Countries in the barometer, in the order the page lists them. */
export const RELIABILITY_COUNTRIES = ["FR", "DE", "ES", "GB", "BE", "CH"] as const;
