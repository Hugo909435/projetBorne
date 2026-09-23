import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { site, languageAlternates } from "@/lib/site";
import { blogPosts } from "@/lib/blogPosts";
import { departments } from "@/lib/departments";
import { germanStates, spanishRegions, ukRegions } from "@/lib/regions";
import { evModels } from "@/lib/evModels";
import { chargingNetworks } from "@/lib/chargingNetworks";
import reliabilityData from "@/data/reliability-stats.json";

const staticPaths = [
  { path: "/", changeFrequency: "daily" as const, priority: 1, lastModified: "2026-08-27" },
  { path: "/blog", changeFrequency: "weekly" as const, priority: 0.7, lastModified: "2026-08-26" },
  {
    path: "/bornes-recharge",
    changeFrequency: "weekly" as const,
    priority: 0.7,
    lastModified: "2026-09-16",
  },
  {
    path: "/blog/types-de-bornes-electriques",
    changeFrequency: "monthly" as const,
    priority: 0.7,
    lastModified: "2026-08-26",
  },
  {
    path: "/blog/voiture-electrique",
    changeFrequency: "monthly" as const,
    priority: 0.7,
    lastModified: "2026-08-26",
  },
  { path: "/a-propos", changeFrequency: "yearly" as const, priority: 0.4, lastModified: "2026-08-26" },
  { path: "/contact", changeFrequency: "yearly" as const, priority: 0.3, lastModified: "2026-08-26" },
  {
    path: "/mentions-legales",
    changeFrequency: "yearly" as const,
    priority: 0.1,
    lastModified: "2026-08-26",
  },
  {
    path: "/politique-de-confidentialite",
    changeFrequency: "yearly" as const,
    priority: 0.1,
    lastModified: "2026-08-26",
  },
  { path: "/recharge", changeFrequency: "monthly" as const, priority: 0.7, lastModified: "2026-09-23" },
  {
    path: "/reseaux",
    changeFrequency: "monthly" as const,
    priority: 0.7,
    lastModified: reliabilityData.generatedAt,
  },
  {
    // The barometer is only worth crawling as often as it is refreshed, and
    // its lastModified is the reading date rather than a hand-kept constant.
    path: "/fiabilite-bornes",
    changeFrequency: "monthly" as const,
    priority: 0.8,
    lastModified: reliabilityData.generatedAt,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = staticPaths.flatMap(({ path, changeFrequency, priority, lastModified }) =>
    routing.locales.map((locale) => ({
      url: `${site.url}/${locale}${path === "/" ? "" : path}`,
      changeFrequency,
      priority,
      lastModified,
      alternates: { languages: languageAlternates(path) },
    }))
  );

  const now = Date.now();
  const blogEntries = blogPosts.flatMap((post) => {
    const raw = new Date(post.updatedAt ?? post.publishedAt).getTime();
    const lastModified = new Date(Math.min(raw, now)).toISOString().slice(0, 10);
    return routing.locales.map((locale) => ({
      url: `${site.url}/${locale}/blog/${post.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      lastModified,
      alternates: { languages: languageAlternates(`/blog/${post.slug}`) },
    }));
  });

  const departmentEntries = departments.flatMap((dept) =>
    routing.locales.map((locale) => ({
      url: `${site.url}/${locale}/bornes-recharge/${dept.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
      lastModified: "2026-09-16",
      alternates: { languages: languageAlternates(`/bornes-recharge/${dept.slug}`) },
    }))
  );

  const germanRegionEntries = germanStates.flatMap((region) =>
    routing.locales.map((locale) => ({
      url: `${site.url}/${locale}/bornes-recharge/de/${region.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
      lastModified: "2026-09-17",
      alternates: { languages: languageAlternates(`/bornes-recharge/de/${region.slug}`) },
    }))
  );

  const spanishRegionEntries = spanishRegions.flatMap((region) =>
    routing.locales.map((locale) => ({
      url: `${site.url}/${locale}/bornes-recharge/es/${region.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
      lastModified: "2026-09-17",
      alternates: { languages: languageAlternates(`/bornes-recharge/es/${region.slug}`) },
    }))
  );

  const ukRegionEntries = ukRegions.flatMap((region) =>
    routing.locales.map((locale) => ({
      url: `${site.url}/${locale}/bornes-recharge/gb/${region.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
      lastModified: "2026-09-17",
      alternates: { languages: languageAlternates(`/bornes-recharge/gb/${region.slug}`) },
    }))
  );

  const evModelEntries = evModels.flatMap((model) =>
    routing.locales.map((locale) => ({
      url: `${site.url}/${locale}/recharge/${model.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      lastModified: "2026-09-23",
      alternates: { languages: languageAlternates(`/recharge/${model.slug}`) },
    }))
  );

  const networkEntries = chargingNetworks.flatMap((network) =>
    routing.locales.map((locale) => ({
      url: `${site.url}/${locale}/reseaux/${network.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      lastModified: reliabilityData.generatedAt,
      alternates: { languages: languageAlternates(`/reseaux/${network.slug}`) },
    }))
  );

  return [
    ...staticEntries,
    ...blogEntries,
    ...departmentEntries,
    ...germanRegionEntries,
    ...spanishRegionEntries,
    ...ukRegionEntries,
    ...evModelEntries,
    ...networkEntries,
  ];
}
