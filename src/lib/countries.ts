export type CountryDef = {
  /** ISO 3166-1 alpha-2 code, as used by the Open Charge Map API. */
  code: string;
  /** Matches both messages.Countries.<key> and cityGroups[].countryKey. */
  countryKey: string;
  center: [number, number];
  zoom: number;
};

/**
 * The map only ever loads one of these countries at a time (see
 * stationTiles.ts SEED_BOXES, which this list stays in sync with) - every
 * other country in messages.Countries / cities.ts has no seed box yet and
 * isn't offered in the country picker.
 */
export const countries: CountryDef[] = [
  { code: "FR", countryKey: "france", center: [46.7, 2.5], zoom: 6 },
  { code: "DE", countryKey: "germany", center: [51.1657, 10.4515], zoom: 6 },
  { code: "CH", countryKey: "switzerland", center: [46.8182, 8.2275], zoom: 7 },
  { code: "ES", countryKey: "spain", center: [40.4637, -3.7492], zoom: 6 },
  { code: "GB", countryKey: "unitedKingdom", center: [54.5, -3.5], zoom: 6 },
  { code: "BE", countryKey: "belgium", center: [50.5039, 4.4699], zoom: 8 },
];

/** Default country loaded for each site locale. */
export const localeToCountryCode: Record<string, string> = {
  fr: "FR",
  de: "DE",
  es: "ES",
  en: "GB",
};

export function countryByCode(code: string): CountryDef | undefined {
  return countries.find((c) => c.code === code);
}
