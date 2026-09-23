/**
 * Builds the two data files the network pages and the reliability barometer
 * read:
 *
 *   src/data/network-stats.json      per-network, per-country station figures
 *   src/data/reliability-stats.json  reported out-of-service rate for rapid
 *                                    chargers, per country
 *
 * Both come from Open Charge Map, deliberately: France and Germany have far
 * better official registers, but those registers carry no status field at all,
 * so a barometer built on them could only cover the other four countries. One
 * source applied identically to all six is what makes the comparison fair.
 *
 * The requests are narrow rather than country-wide dumps: the network pass
 * filters by operator id, the barometer pass by level 3 (rapid). That keeps
 * this to a few hundred small requests instead of downloading every charger in
 * western Europe, and `ocmRequest` already rate-limits and retries.
 *
 * Usage:
 *   npm run generate:networks
 *
 * Needs OCM_API_KEY in .env.local. As with the region stats, a network or
 * country that cannot be refreshed keeps the value already committed rather
 * than being wiped.
 */
try {
  process.loadEnvFile(".env.local");
} catch {
  /* no .env.local (e.g. CI with real env vars already set) */
}
try {
  process.loadEnvFile(".env");
} catch {
  /* no .env either */
}

import fs from "node:fs";
import path from "node:path";
import { ocmRequest } from "../src/lib/openChargeMap";
import { fetchReferenceData } from "../src/lib/ocmReference";
import { chargingNetworks } from "../src/lib/chargingNetworks";
import type { NetworkStats, NetworkStatsFile, NetworkCountryStats } from "../src/lib/chargingNetworks";
import { RELIABILITY_COUNTRIES } from "../src/lib/reliability";
import type { ReliabilityCountry, ReliabilityFile } from "../src/lib/reliability";

const OCM_BASE = "https://api.openchargemap.io/v3/poi/";
const SOURCE = "Open Charge Map";
const SOURCE_URL = "https://openchargemap.org/";

/** DC and at least 50 kW: the same "fast charging" threshold the rest of the site uses. */
const FAST_KW = 50;
const DC_CURRENT_TYPE = 30;
/** Open Charge Map level 3 is its own definition of rapid charging. */
const RAPID_LEVEL_ID = 3;

/** Per-request ceiling. A country's rapid fleet fits well under this everywhere today. */
const NETWORK_MAX = 5000;
const RELIABILITY_MAX = 25000;

/** Statuses Open Charge Map treats as a temporary warning rather than a fault. */
const WARNING_STATUSES = [20, 30, 75];

type RawConnection = {
  ConnectionTypeID?: number | null;
  PowerKW?: number | null;
  CurrentTypeID?: number | null;
};

type RawPoi = {
  ID: number;
  StatusTypeID?: number | null;
  DateLastVerified?: string | null;
  Connections?: RawConnection[] | null;
};

function poiParams(extra: Record<string, string>, maxResults: number): URLSearchParams {
  return new URLSearchParams({
    output: "json",
    compact: "true",
    verbose: "false",
    maxresults: String(maxResults),
    ...extra,
  });
}

function isFast(c: RawConnection): boolean {
  return c.CurrentTypeID === DC_CURRENT_TYPE && (c.PowerKW ?? 0) >= FAST_KW;
}

function maxPower(pois: RawPoi[]): number | null {
  let best = 0;
  for (const poi of pois) {
    for (const c of poi.Connections ?? []) {
      if (typeof c.PowerKW === "number" && c.PowerKW > best) best = c.PowerKW;
    }
  }
  return best > 0 ? Math.round(best) : null;
}

async function fetchNetworkCountry(
  operatorIds: number[],
  countryCode: string
): Promise<{ stats: NetworkCountryStats; connectorIds: Map<number, number> } | null> {
  const pois = await ocmRequest<RawPoi[]>(
    OCM_BASE,
    poiParams({ operatorid: operatorIds.join(","), countrycode: countryCode }, NETWORK_MAX)
  );
  if (!pois.length) return null;

  let fastStations = 0;
  const connectorIds = new Map<number, number>();
  for (const poi of pois) {
    const connections = poi.Connections ?? [];
    if (connections.some(isFast)) fastStations++;
    const seen = new Set<number>();
    for (const c of connections) {
      const id = c.ConnectionTypeID;
      if (id == null || seen.has(id)) continue;
      seen.add(id);
      connectorIds.set(id, (connectorIds.get(id) ?? 0) + 1);
    }
  }

  return {
    stats: {
      stations: pois.length,
      fastStations,
      maxPowerKw: maxPower(pois),
      ...(pois.length >= NETWORK_MAX ? { capped: true } : {}),
    },
    connectorIds,
  };
}

async function buildNetworkStats(
  connectorNames: Record<string, string>,
  previous: NetworkStatsFile | null
): Promise<{ networks: Record<string, NetworkStats>; failures: number }> {
  const networks: Record<string, NetworkStats> = {};
  let failures = 0;

  for (const network of chargingNetworks) {
    const countries: Record<string, NetworkCountryStats> = {};
    const connectorIds = new Map<number, number>();
    let failed = false;

    for (const countryCode of RELIABILITY_COUNTRIES) {
      try {
        const result = await fetchNetworkCountry(network.operatorIds, countryCode);
        if (!result) continue;
        countries[countryCode] = result.stats;
        for (const [id, count] of result.connectorIds) {
          connectorIds.set(id, (connectorIds.get(id) ?? 0) + count);
        }
      } catch (err) {
        failed = true;
        process.stdout.write(`x ${network.slug}/${countryCode}: ${(err as Error).message}\n`);
      }
    }

    if (failed && previous?.networks[network.slug]) {
      failures++;
      networks[network.slug] = previous.networks[network.slug];
      process.stdout.write(`. ${network.slug} (kept previous value)\n`);
      continue;
    }

    const total = Object.values(countries).reduce((sum, c) => sum + c.stations, 0);
    const totalFast = Object.values(countries).reduce((sum, c) => sum + c.fastStations, 0);
    const connectors = [...connectorIds.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([id]) => connectorNames[id] ?? `Type ${id}`);

    networks[network.slug] = { countries, connectors, total, totalFast };
    process.stdout.write(
      `. ${network.slug}: ${total} stations in ${Object.keys(countries).length} countries\n`
    );
  }

  return { networks, failures };
}

async function buildReliability(
  outOfServiceIds: number[],
  previous: ReliabilityFile | null
): Promise<{ countries: ReliabilityCountry[]; failures: number }> {
  const countries: ReliabilityCountry[] = [];
  let failures = 0;

  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);

  for (const countryCode of RELIABILITY_COUNTRIES) {
    try {
      const pois = await ocmRequest<RawPoi[]>(
        OCM_BASE,
        poiParams({ countrycode: countryCode, levelid: String(RAPID_LEVEL_ID) }, RELIABILITY_MAX)
      );

      let outOfService = 0;
      let warning = 0;
      let recentlyVerified = 0;
      for (const poi of pois) {
        const status = poi.StatusTypeID ?? -1;
        if (outOfServiceIds.includes(status)) outOfService++;
        else if (WARNING_STATUSES.includes(status)) warning++;
        if (poi.DateLastVerified && new Date(poi.DateLastVerified) >= twelveMonthsAgo) {
          recentlyVerified++;
        }
      }

      countries.push({
        countryCode,
        sample: pois.length,
        outOfService,
        warning,
        outOfServiceRate: pois.length
          ? Math.round((outOfService / pois.length) * 1000) / 10
          : 0,
        recentlyVerified,
        capped: pois.length >= RELIABILITY_MAX,
      });
      process.stdout.write(
        `. ${countryCode}: ${pois.length} rapid chargers, ${outOfService} reported out of service\n`
      );
    } catch (err) {
      failures++;
      const kept = previous?.countries.find((c) => c.countryCode === countryCode);
      if (kept) countries.push(kept);
      process.stdout.write(
        `x ${countryCode}: ${(err as Error).message}${kept ? " (kept previous value)" : ""}\n`
      );
    }
  }

  return { countries, failures };
}

function readPrevious<T>(filePath: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
  } catch {
    return null;
  }
}

async function main() {
  const dataDir = path.join(__dirname, "../src/data");
  const networksPath = path.join(dataDir, "network-stats.json");
  const reliabilityPath = path.join(dataDir, "reliability-stats.json");

  const reference = await fetchReferenceData();
  const generatedAt = new Date().toISOString().slice(0, 10);

  process.stdout.write("Networks\n");
  const { networks, failures: networkFailures } = await buildNetworkStats(
    reference.connectionTypes,
    readPrevious<NetworkStatsFile>(networksPath)
  );

  process.stdout.write("\nReliability\n");
  const { countries, failures: reliabilityFailures } = await buildReliability(
    reference.outOfService,
    readPrevious<ReliabilityFile>(reliabilityPath)
  );

  fs.mkdirSync(dataDir, { recursive: true });

  const networkFile: NetworkStatsFile = {
    generatedAt,
    source: SOURCE,
    sourceUrl: SOURCE_URL,
    networks,
  };
  fs.writeFileSync(networksPath, JSON.stringify(networkFile, null, 2) + "\n");

  const reliabilityFile: ReliabilityFile = {
    generatedAt,
    source: SOURCE,
    sourceUrl: SOURCE_URL,
    levelId: RAPID_LEVEL_ID,
    countries,
  };
  fs.writeFileSync(reliabilityPath, JSON.stringify(reliabilityFile, null, 2) + "\n");

  console.log(
    `\nWrote ${Object.keys(networks).length} networks and ${countries.length} countries` +
      (networkFailures || reliabilityFailures
        ? ` (${networkFailures + reliabilityFailures} could not be refreshed)`
        : "")
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
