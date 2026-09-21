import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Self-hosting build (Hostinger VPS / Node.js): emits `.next/standalone`
  // with a server.js and only the dependencies actually reached at runtime,
  // so the upload is a fraction of a full node_modules install.
  output: "standalone",
  images: {
    qualities: [75, 90],
  },
  // The official national station data (data/irve, data/de) is read from disk at runtime, not
  // imported, so Next's file tracing can't see it: without this it would be
  // missing from `.next/standalone` and the map would fall back to Open Charge Map.
  outputFileTracingIncludes: {
    "/api/stations": ["./data/**/*"],
    "/api/stations/[id]": ["./data/**/*"],
  },
  experimental: {
    // Build workers hitting an external API in parallel would multiply past
    // this app's own in-process rate limiting (Open Charge Map 429s and starves
    // pages past their generation budget). Nothing calls it at build time any
    // more (department pages read committed JSON), but keeping generation on
    // effectively one worker preserves that safety margin if a page ever does.
    staticGenerationMinPagesPerWorker: 1000,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
