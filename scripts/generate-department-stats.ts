/**
 * Pre-fetches Open Charge Map station stats for all 96 French departments
 * and writes them to `src/data/department-stats.json`.
 *
 * This runs as a single sequential pass (npm `prebuild`), not inside
 * `next build`'s own page generation: that step spawns several parallel
 * worker processes, and 384 department x locale pages each hitting Open
 * Charge Map from independent processes overwhelmed its rate limit badly
 * enough that a random ~15% of pages silently failed to prerender (a
 * different random subset every run - see the department page for the full
 * story). Pre-aggregating here means page generation just reads a local
 * JSON file: fast, deterministic, and immune to a slow API day.
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
import { departments } from "../src/lib/departments";
import { fetchDepartmentStats, type DepartmentStats } from "../src/lib/departmentStats";

async function main() {
  const results: Record<string, DepartmentStats> = {};
  let failures = 0;

  for (const dept of departments) {
    try {
      results[dept.slug] = await fetchDepartmentStats(dept);
      process.stdout.write(`. ${dept.slug}\n`);
    } catch (err) {
      failures++;
      process.stdout.write(`x ${dept.slug}: ${(err as Error).message}\n`);
    }
  }

  const outPath = path.join(__dirname, "../src/data/department-stats.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2) + "\n");

  console.log(
    `\nWrote ${Object.keys(results).length}/${departments.length} department stats to ${outPath}` +
      (failures ? ` (${failures} failed and were left out)` : "")
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
