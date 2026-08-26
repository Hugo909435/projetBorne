/**
 * Assembles a ready-to-upload folder for a Node.js host (Hostinger VPS, or any
 * plain Node server).
 *
 * `output: "standalone"` emits a server plus only the dependencies actually
 * reached at runtime, but deliberately leaves out two directories that Next
 * expects to find next to it at runtime. Copying them by hand is the classic
 * missed step, and it produces a site that boots but serves no CSS, no JS and
 * no images. This does it for you.
 *
 *   npm run build && npm run package
 *
 * Then upload the whole `deploy/` folder and run `node server.js` inside it.
 */
import { cp, rm, mkdir, writeFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const standalone = path.join(root, ".next", "standalone");
const out = path.join(root, "deploy");

if (!existsSync(standalone)) {
  console.error(
    'No .next/standalone found. Run "npm run build" first, with output: "standalone" in next.config.ts.'
  );
  process.exit(1);
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

// The server and its pruned dependency tree.
await cp(standalone, out, { recursive: true });

// Hashed client assets: served at /_next/static, not bundled by standalone.
await cp(path.join(root, ".next", "static"), path.join(out, ".next", "static"), {
  recursive: true,
});

// Favicon, images, robots and friends.
if (existsSync(path.join(root, "public"))) {
  await cp(path.join(root, "public"), path.join(out, "public"), { recursive: true });
}

// The host sets PORT itself; this is only a hint for a bare `node server.js`.
await writeFile(
  path.join(out, ".env.example"),
  [
    "# Copy to .env and fill in before starting the server.",
    "# Free key: https://openchargemap.org/site/developerinfo",
    "OCM_API_KEY=",
    "",
    "# Optional. Defaults to 3000.",
    "PORT=3000",
    "HOSTNAME=0.0.0.0",
    "",
  ].join("\n")
);

// Passenger (Hostinger's hPanel Node.js apps) restarts the app when this
// file's mtime changes. Content must differ on every build, otherwise a
// deploy tool that skips unchanged files won't re-upload it and the running
// server keeps serving the old build.
await mkdir(path.join(out, "tmp"), { recursive: true });
await writeFile(path.join(out, "tmp", "restart.txt"), `${new Date().toISOString()}\n`);

async function dirSize(dir) {
  const { readdir } = await import("node:fs/promises");
  let total = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    total += entry.isDirectory() ? await dirSize(full) : (await stat(full)).size;
  }
  return total;
}

const mb = (await dirSize(out)) / 1024 / 1024;
console.log(`deploy/ ready: ${mb.toFixed(1)} MB`);
console.log("Upload the folder, then inside it: node server.js");
