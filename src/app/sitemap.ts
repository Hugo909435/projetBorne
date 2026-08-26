import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { site, languageAlternates } from "@/lib/site";
import { blogPosts } from "@/lib/blogPosts";

const staticPaths = [
  { path: "/", changeFrequency: "daily" as const, priority: 1 },
  { path: "/blog", changeFrequency: "weekly" as const, priority: 0.7 },
  { path: "/blog/types-de-bornes-electriques", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/blog/voiture-electrique", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/a-propos", changeFrequency: "yearly" as const, priority: 0.4 },
  { path: "/contact", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/mentions-legales", changeFrequency: "yearly" as const, priority: 0.1 },
  { path: "/politique-de-confidentialite", changeFrequency: "yearly" as const, priority: 0.1 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = staticPaths.flatMap(({ path, changeFrequency, priority }) =>
    routing.locales.map((locale) => ({
      url: `${site.url}/${locale}${path === "/" ? "" : path}`,
      changeFrequency,
      priority,
      alternates: { languages: languageAlternates(path) },
    }))
  );

  const blogEntries = blogPosts.flatMap((post) =>
    routing.locales.map((locale) => ({
      url: `${site.url}/${locale}/blog/${post.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      lastModified: post.publishedAt,
      alternates: { languages: languageAlternates(`/blog/${post.slug}`) },
    }))
  );

  return [...staticEntries, ...blogEntries];
}
