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
  experimental: {
    // The ~500 statically generated pages include 384 department pages that
    // each call the Open Charge Map API. Multiple build workers hitting it
    // in parallel multiply past this app's own in-process rate limiting and
    // OCM starts 429-ing, which can starve individual pages past their
    // generation budget. Keeping generation on effectively one worker lets
    // that in-process pacing actually govern the request rate.
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
