/**
 * The charging networks that get their own page.
 *
 * Thirteen networks: seven that run across most of the map (Ionity, Fastned,
 * Tesla, Electra, Allego, TotalEnergies, Shell Recharge) and one national
 * operator for each of the six countries the map covers, so no single country
 * is over-represented.
 *
 * Only stable facts are hard-coded here: the display name, the Open Charge Map
 * operator ids, and the two official links. Everything a page actually states
 * about a network - which countries it covers, how many stations, how fast,
 * which connectors - is computed from station data by
 * `scripts/generate-network-stats.ts`, so nothing on the page is an assertion
 * that can quietly go stale.
 *
 * A network is often filed under several Open Charge Map operator ids, one per
 * country subsidiary, which is why `operatorIds` is a list.
 */

export type ChargingNetwork = {
  slug: string;
  name: string;
  /** Open Charge Map Operator ids, from its reference data. */
  operatorIds: number[];
  website: string;
  /** Where the network publishes its own tariffs. */
  pricingUrl: string;
  /** Set for a network that mainly serves one country, for the index grouping. */
  homeCountry?: string;
};

export const chargingNetworks: ChargingNetwork[] = [
  {
    slug: "ionity",
    name: "Ionity",
    operatorIds: [3299],
    website: "https://ionity.eu/",
    pricingUrl: "https://ionity.eu/prices",
  },
  {
    slug: "fastned",
    name: "Fastned",
    operatorIds: [74],
    website: "https://fastnedcharging.com/",
    pricingUrl: "https://fastnedcharging.com/en/pricing",
  },
  {
    slug: "tesla-supercharger",
    name: "Tesla Supercharger",
    operatorIds: [23, 3534],
    website: "https://www.tesla.com/supercharger",
    pricingUrl: "https://www.tesla.com/support/charging",
  },
  {
    slug: "electra",
    name: "Electra",
    operatorIds: [3489],
    website: "https://www.go-electra.com/",
    pricingUrl: "https://www.go-electra.com/tarifs",
  },
  {
    slug: "allego",
    name: "Allego",
    operatorIds: [103],
    website: "https://www.allego.eu/",
    pricingUrl: "https://www.allego.eu/charging-rates",
  },
  {
    slug: "totalenergies",
    name: "TotalEnergies",
    operatorIds: [3447, 3571, 25],
    website: "https://chargingservices.totalenergies.com/",
    pricingUrl: "https://chargingservices.totalenergies.com/",
  },
  {
    slug: "shell-recharge",
    name: "Shell Recharge",
    operatorIds: [3709, 156, 3508, 3392, 157],
    website: "https://shellrecharge.com/",
    pricingUrl: "https://shellrecharge.com/",
  },
  {
    slug: "izivia",
    name: "Izivia",
    operatorIds: [213],
    website: "https://www.izivia.com/",
    pricingUrl: "https://www.izivia.com/le-reseau-izivia",
    homeCountry: "FR",
  },
  {
    slug: "enbw",
    name: "EnBW mobility+",
    operatorIds: [86],
    website: "https://www.enbw.com/elektromobilitaet/",
    pricingUrl: "https://www.enbw.com/elektromobilitaet/produkte/ladetarife",
    homeCountry: "DE",
  },
  {
    slug: "zunder",
    name: "Zunder",
    operatorIds: [3324],
    website: "https://www.zunder.com/",
    pricingUrl: "https://www.zunder.com/en/prices/",
    homeCountry: "ES",
  },
  {
    slug: "instavolt",
    name: "InstaVolt",
    operatorIds: [3296],
    website: "https://instavolt.co.uk/",
    pricingUrl: "https://instavolt.co.uk/ev-drivers/",
    homeCountry: "GB",
  },
  {
    slug: "blue-corner",
    name: "Blue Corner",
    operatorIds: [36],
    website: "https://www.bluecorner.be/",
    pricingUrl: "https://www.bluecorner.be/",
    homeCountry: "BE",
  },
  {
    slug: "move",
    name: "MOVE",
    operatorIds: [3274],
    website: "https://www.move.ch/",
    pricingUrl: "https://www.move.ch/de/tarife",
    homeCountry: "CH",
  },
];

export function findNetworkBySlug(slug: string): ChargingNetwork | undefined {
  return chargingNetworks.find((n) => n.slug === slug);
}

/** Per-country figures for one network, as the generator writes them. */
export type NetworkCountryStats = {
  /** Stations Open Charge Map lists for this network in this country. */
  stations: number;
  /** Of those, the ones with at least one DC connector at 50 kW or more. */
  fastStations: number;
  /** Highest connector power seen, in kW. */
  maxPowerKw: number | null;
  /** True when the count hit the request ceiling, so it is a floor, not a total. */
  capped?: boolean;
};

export type NetworkStats = {
  /** Country code -> figures, only for countries where the network appears. */
  countries: Record<string, NetworkCountryStats>;
  /** Connector names, most common first. */
  connectors: string[];
  total: number;
  totalFast: number;
};

export type NetworkStatsFile = {
  generatedAt: string;
  source: string;
  sourceUrl: string;
  networks: Record<string, NetworkStats>;
};
