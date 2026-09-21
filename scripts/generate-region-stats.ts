/**
 * Pre-fetches Open Charge Map station stats for the Spanish comunidades
 * autónomas and UK regions and writes them to `src/data/region-stats.json`.
 *
 * France and Germany no longer come from here: their pages read statistics
 * generated from the official registers (`generate_irve_data.py`,
 * `generate_de_data.py`). A sequential pass avoids hammering Open Charge Map
 * from several of `next build`'s parallel workers at once.
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
import { spanishRegions, ukRegions, type Region } from "../src/lib/regions";
import { fetchRegionStats, type StationAggregate } from "../src/lib/regionStats";

async function main() {
  const outPath = path.join(__dirname, "../src/data/region-stats.json");
  const allRegions: Region[] = [...spanishRegions, ...ukRegions];

  // Start from what is already committed: CI has no Open Charge Map key, so
  // every request there fails, and writing back only the successes would wipe
  // the pages' figures. A region that can't be refreshed keeps its last value.
  let previous: Record<string, StationAggregate> = {};
  try {
    previous = JSON.parse(fs.readFileSync(outPath, "utf8"));
  } catch {
    /* first run: nothing to keep */
  }
  const results: Record<string, StationAggregate> = {};
  let failures = 0;

  for (const region of allRegions) {
    try {
      results[region.slug] = await fetchRegionStats(region);
      process.stdout.write(`. ${region.slug}
`);
    } catch (err) {
      failures++;
      if (previous[region.slug]) results[region.slug] = previous[region.slug];
      process.stdout.write(
        `x ${region.slug}: ${(err as Error).message}${previous[region.slug] ? " (kept previous value)" : ""}
`
      );
    }
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2) + "\n");

  console.log(
    `\nWrote ${Object.keys(results).length}/${allRegions.length} region stats to ${outPath}` +
      (failures ? ` (${failures} could not be refreshed)` : "")
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
