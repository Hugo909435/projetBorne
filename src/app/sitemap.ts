import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { site, languageAlternates } from "@/lib/site";
import { blogPosts } from "@/lib/blogPosts";

const staticPaths = [
  { path: "/", changeFrequency: "daily" as const, priority: 1, lastModified: "2026-08-27" },
  { path: "/blog", changeFrequency: "weekly" as const, priority: 0.7, lastModified: "2026-08-26" },
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

  return [...staticEntries, ...blogEntries];
}
