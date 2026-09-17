/**
 * Pre-fetches Open Charge Map station stats for the German Bundesländer and
 * Spanish comunidades autónomas and writes them to `src/data/region-stats.json`.
 *
 * Same rationale as `generate-department-stats.ts`: a sequential pass here
 * avoids hammering Open Charge Map from several of `next build`'s parallel
 * workers at once.
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
import { germanStates, spanishRegions, ukRegions, type Region } from "../src/lib/regions";
import { fetchRegionStats, type StationAggregate } from "../src/lib/regionStats";

async function main() {
  const results: Record<string, StationAggregate> = {};
  let failures = 0;

  const allRegions: Region[] = [...germanStates, ...spanishRegions, ...ukRegions];

  for (const region of allRegions) {
    try {
      results[region.slug] = await fetchRegionStats(region);
      process.stdout.write(`. ${region.slug}\n`);
    } catch (err) {
      failures++;
      process.stdout.write(`x ${region.slug}: ${(err as Error).message}\n`);
    }
  }

  const outPath = path.join(__dirname, "../src/data/region-stats.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2) + "\n");

  console.log(
    `\nWrote ${Object.keys(results).length}/${allRegions.length} region stats to ${outPath}` +
      (failures ? ` (${failures} failed and were left out)` : "")
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
