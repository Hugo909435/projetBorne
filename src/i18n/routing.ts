import { defineRouting } from "next-intl/routing";

export const locales = ["fr", "en", "de", "es"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "fr",
  localePrefix: "always",
  localeDetection: false,
  // Every page already declares its hreflang alternates in its own metadata.
  // The middleware's `Link` header repeated them with a different x-default
  // (the unprefixed URL, which redirects), so search engines got two answers.
  alternateLinks: false,
});
