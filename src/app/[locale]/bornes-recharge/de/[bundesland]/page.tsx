import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site, languageAlternates } from "@/lib/site";
import { germanStates, findRegionBySlug } from "@/lib/regions";
import type { AreaStats, GermanStatsMeta } from "@/lib/departmentStats";
import stateStatsData from "@/data/de-state-stats.json";
import stateStatsMetaData from "@/data/de-state-stats-meta.json";

const stateStats = stateStatsData as Record<string, AreaStats>;
const stateStatsMeta = stateStatsMetaData as GermanStatsMeta;

export async function generateStaticParams() {
  return germanStates.map((r) => ({ bundesland: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; bundesland: string }>;
}): Promise<Metadata> {
  const { locale, bundesland } = await params;
  const region = findRegionBySlug("de", bundesland);
  if (!region) notFound();

  const t = await getTranslations({ locale, namespace: "GermanyRegionPage" });
  const path = `/bornes-recharge/de/${region.slug}`;

  return {
    title: t("metaTitle", { name: region.name }),
    description: t("metaDescription", { name: region.name }),
    alternates: { canonical: `/${locale}${path}`, languages: languageAlternates(path) },
    openGraph: { url: `${site.url}/${locale}${path}` },
  };
}

export default async function GermanyRegionPage({
  params,
}: {
  params: Promise<{ locale: string; bundesland: string }>;
}) {
  const { locale, bundesland } = await params;
  const region = findRegionBySlug("de", bundesland);
  if (!region) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "GermanyRegionPage" });
  const tNav = await getTranslations({ locale, namespace: "Nav" });

  // Generated offline from the Bundesnetzagentur register by
  // `scripts/generate_de_data.py` (`npm run generate:de`).
  const stats: AreaStats | null = stateStats[region.slug] ?? null;
  const formatNumber = (n: number) => new Intl.NumberFormat(locale).format(n);
  const dataDate = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    new Date(stateStatsMeta.registerDate)
  );
  const path = `/bornes-recharge/de/${region.slug}`;
  const centerLat = (region.bbox.south + region.bbox.north) / 2;
  const centerLon = (region.bbox.west + region.bbox.east) / 2;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tNav("home"), item: `${site.url}/${locale}` },
      {
        "@type": "ListItem",
        position: 2,
        name: tNav("departments"),
        item: `${site.url}/${locale}/bornes-recharge`,
      },
      { "@type": "ListItem", position: 3, name: region.name, item: `${site.url}/${locale}${path}` },
    ],
  };

  const placeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: t("placeName", { name: region.name }),
    containedInPlace: { "@type": "Country", name: "Germany" },
    geo: { "@type": "GeoCoordinates", latitude: centerLat, longitude: centerLon },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("faq1Question", { name: region.name }),
        acceptedAnswer: { "@type": "Answer", text: t("faq1Answer", { name: region.name }) },
      },
      {
        "@type": "Question",
        name: t("faq2Question", { name: region.name }),
        acceptedAnswer: { "@type": "Answer", text: t("faq2Answer", { name: region.name }) },
      },
      {
        "@type": "Question",
        name: t("faq3Question"),
        acceptedAnswer: { "@type": "Answer", text: t("faq3Answer", { name: region.name }) },
      },
    ],
  };

  const mapHref = { pathname: "/", query: { lat: centerLat, lon: centerLon, zoom: 7 }, hash: "carte" };

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-ink-400">
        <Link href="/" className="hover:text-green-700">
          {tNav("home")}
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/bornes-recharge" className="hover:text-green-700">
          {tNav("departments")}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-600">{region.name}</span>
      </nav>

      <p className="mb-3 border-l-[3px] border-green-500 pl-3 text-sm font-semibold text-green-700">
        {t("eyebrow")}
      </p>
      <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">
        {t("title", { name: region.name })}
      </h1>

      <p className="mt-4 text-ink-600">
        {stats
          ? t("introWithStats", {
              name: region.name,
              points: formatNumber(stats.points),
              stations: formatNumber(stats.stations),
              date: dataDate,
            })
          : t("introFallback", { name: region.name })}
      </p>

      {stats && stats.fastPoints > 0 && (
        <p className="mt-2 text-ink-600">
          {t("fastCountLabel", {
            fastCount: formatNumber(stats.fastPoints),
            share: Math.round((stats.fastPoints / stats.points) * 100),
          })}
        </p>
      )}

      <div className="mt-6 rounded-2xl border border-line bg-card p-6">
        <Link
          href={mapHref}
          className="inline-flex items-center justify-center rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-forest-950 transition hover:bg-lime-300"
        >
          {t("mapCta")}
        </Link>
      </div>

      {stats && stats.connectorBreakdown.length > 0 && (
        <>
          <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">
            {t("connectorsHeading")}
          </h2>
          <ul className="mt-3 space-y-2 text-ink-600">
            {stats.connectorBreakdown.map((c) => (
              <li key={c.name} className="flex items-center justify-between border-b border-line pb-2">
                <span>{c.name}</span>
                <span className="font-semibold text-ink-900">{c.count}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {stats && stats.topTowns.length > 0 && (
        <>
          <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">{t("townsHeading")}</h2>
          <ul className="mt-3 space-y-2 text-ink-600">
            {stats.topTowns.map((town) => (
              <li key={town.name} className="flex items-center justify-between border-b border-line pb-2">
                <span>{town.name}</span>
                <span className="font-semibold text-ink-900">{town.count}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">{t("faqHeading")}</h2>

      <details className="mt-3 rounded-xl border border-line p-4">
        <summary className="cursor-pointer font-semibold text-ink-900">
          {t("faq1Question", { name: region.name })}
        </summary>
        <p className="mt-2 text-ink-600">{t("faq1Answer", { name: region.name })}</p>
      </details>

      <details className="mt-3 rounded-xl border border-line p-4">
        <summary className="cursor-pointer font-semibold text-ink-900">
          {t("faq2Question", { name: region.name })}
        </summary>
        <p className="mt-2 text-ink-600">{t("faq2Answer", { name: region.name })}</p>
      </details>

      <details className="mt-3 rounded-xl border border-line p-4">
        <summary className="cursor-pointer font-semibold text-ink-900">{t("faq3Question")}</summary>
        <p className="mt-2 text-ink-600">{t("faq3Answer", { name: region.name })}</p>
      </details>

      <p className="mt-10 text-xs text-ink-400">
        {t("sourceNote", { date: dataDate })}{" "}
        <a
          href={stateStatsMeta.sourceUrl}
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Bundesnetzagentur.de
        </a>
      </p>

      <Link href="/bornes-recharge" className="mt-2 inline-block text-sm font-semibold text-green-700 underline">
        {t("backToIndex")}
      </Link>
    </article>
  );
}
