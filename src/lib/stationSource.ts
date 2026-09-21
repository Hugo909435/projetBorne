import {
  fetchStationDetail as fetchOcmStationDetail,
  fetchStations as fetchOcmStations,
  ocmCountryIdOf,
  type Station,
  type StationDetail,
  type StationQuery,
} from "@/lib/openChargeMap";
import {
  fetchOfficialDetail,
  fetchOfficialStations,
  isOfficialCountry,
  mayIncludeCountry,
  officialCountryOf,
  type OfficialCountry,
} from "@/lib/officialStations";

/**
 * Where the map's stations come from.
 *
 * France (national IRVE base) and Germany (Bundesnetzagentur register) are
 * served from their official open-data registers, which are far more complete
 * than the crowd-sourced Open Charge Map; every other country stays on Open
 * Charge Map. All sources produce the same `Station` shape, so nothing
 * downstream cares. The rules:
 *
 * - `country` is an official country: that register only.
 * - any other `country`: Open Charge Map only (it filters by country itself).
 * - no country (a free viewport or radius): every official register the area
 *   touches plus Open Charge Map, with Open Charge Map's stations of those
 *   countries dropped so a border view never shows the same charger twice.
 *
 * If an official dataset can't be read, that country falls back to Open Charge
 * Map rather than an empty map.
 */

/** Open Charge Map's own CountryID for each official country. */
const OCM_COUNTRY_ID: Record<OfficialCountry, number> = { FR: 80, DE: 87 };

export async function fetchStations(query: StationQuery): Promise<Station[]> {
  const country = query.countryCode?.toUpperCase();

  if (country && isOfficialCountry(country)) {
    try {
      return await fetchOfficialStations(country, query);
    } catch (err) {
      console.error(`Official ${country} station data unavailable, falling back to Open Charge Map:`, err);
      return fetchOcmStations(query);
    }
  }
  if (country) return fetchOcmStations(query);

  const candidates = (Object.keys(OCM_COUNTRY_ID) as OfficialCountry[]).filter((c) => mayIncludeCountry(c, query));
  if (!candidates.length) return fetchOcmStations(query);

  const settled = await Promise.all(
    candidates.map(async (c) => {
      try {
        return { country: c, stations: await fetchOfficialStations(c, query) };
      } catch (err) {
        console.error(`Official ${c} station data unavailable, using Open Charge Map for it:`, err);
        return null;
      }
    })
  );
  const loaded = settled.filter((r): r is { country: OfficialCountry; stations: Station[] } => r !== null);
  if (!loaded.length) return fetchOcmStations(query);

  const covered = new Set(loaded.map((r) => OCM_COUNTRY_ID[r.country]));
  // An Open Charge Map failure propagates on purpose: the client retries a
  // failed tile, whereas a quietly thinner answer would be kept as a hole.
  const others = (await fetchOcmStations(query)).filter((s) => {
    const id = ocmCountryIdOf(s);
    return id === undefined || !covered.has(id);
  });
  return [...loaded.flatMap((r) => r.stations), ...others];
}

export function fetchStationDetail(id: number): Promise<StationDetail | null> {
  return officialCountryOf(id) ? fetchOfficialDetail(id) : fetchOcmStationDetail(id);
}
