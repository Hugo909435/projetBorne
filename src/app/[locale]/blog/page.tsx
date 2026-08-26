import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site, languageAlternates } from "@/lib/site";
import { blogPosts, formatBlogDate } from "@/lib/blogPosts";
import type { Locale } from "@/i18n/routing";

const POSTS_PER_PAGE = 15;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { page } = await searchParams;
  const t = await getTranslations({ locale, namespace: "Meta" });
  const pageNumber = Number(page) || 1;
  const canonical = pageNumber > 1 ? `/${locale}/blog?page=${pageNumber}` : `/${locale}/blog`;
  return {
    title: t("blogTitle"),
    description: t("blogDescription"),
    alternates: { canonical, languages: languageAlternates("/blog") },
    openGraph: { url: `${site.url}${canonical}` },
  };
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "BlogPage" });

  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const totalPages = Math.max(1, Math.ceil(sortedPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);
  const pagePosts = sortedPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const pageHref = (n: number) => (n === 1 ? "/blog" : { pathname: "/blog", query: { page: n } });

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">{t("title")}</h1>
      <p className="mt-4 text-ink-600">{t("intro")}</p>

      <div className="mt-10 divide-y divide-line border-t border-line">
        {currentPage === 1 && (
          <>
            <Link href="/blog/voiture-electrique" className="group flex items-start gap-4 py-6">
              <Image
                src="/blog/voiture-electrique.jpg"
                alt={t("article2Title")}
                width={160}
                height={160}
                quality={90}
                className="h-16 w-16 shrink-0 rounded-xl object-cover sm:h-20 sm:w-20"
              />
              <div className="flex flex-col gap-1">
                <h2 className="font-display text-xl font-semibold text-ink-900 group-hover:text-green-700">
                  {t("article2Title")}
                </h2>
                <p className="text-sm text-ink-600">{t("article2Excerpt")}</p>
              </div>
            </Link>
            <Link
              href="/blog/types-de-bornes-electriques"
              className="group flex items-start gap-4 py-6"
            >
              <Image
                src="/blog/types-de-bornes-electriques.jpg"
                alt={t("article1Title")}
                width={160}
                height={160}
                quality={90}
                className="h-16 w-16 shrink-0 rounded-xl object-cover sm:h-20 sm:w-20"
              />
              <div className="flex flex-col gap-1">
                <h2 className="font-display text-xl font-semibold text-ink-900 group-hover:text-green-700">
                  {t("article1Title")}
                </h2>
                <p className="text-sm text-ink-600">{t("article1Excerpt")}</p>
              </div>
            </Link>
          </>
        )}
        {pagePosts.map((post) => {
          const content = post.content[locale as Locale];
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex items-start gap-4 py-6"
            >
              {post.image.src && (
                <Image
                  src={post.image.src}
                  alt={post.image.alt[locale as Locale]}
                  width={160}
                  height={160}
                  quality={90}
                  className="h-16 w-16 shrink-0 rounded-xl object-cover sm:h-20 sm:w-20"
                />
              )}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-ink-400">{formatBlogDate(locale, post.publishedAt)}</span>
                <h2 className="font-display text-xl font-semibold text-ink-900 group-hover:text-green-700">
                  {content.title}
                </h2>
                <p className="text-sm text-ink-600">{content.excerpt}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-10 flex items-center justify-between">
          {currentPage > 1 ? (
            <Link
              href={pageHref(currentPage - 1)}
              className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-900 hover:border-green-600 hover:text-green-700"
            >
              {t("previous")}
            </Link>
          ) : (
            <span />
          )}
          <span className="text-sm text-ink-400">
            {t("pageOf", { current: currentPage, total: totalPages })}
          </span>
          {currentPage < totalPages ? (
            <Link
              href={pageHref(currentPage + 1)}
              className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-900 hover:border-green-600 hover:text-green-700"
            >
              {t("next")}
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}
