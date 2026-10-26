import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site, languageAlternates } from "@/lib/site";
import { germanStates, findRegionBySlug, regionCenter } from "@/lib/regions";
import type { AreaStats, GermanStatsMeta } from "@/lib/departmentStats";
import { getAreaInsights, nearestPlaces, percent } from "@/lib/areaInsights";
import { PointsAreaSections } from "@/components/regions/PointsAreaSections";
import { FaqItem, NearbyLinks, SectionHeading } from "@/components/regions/StatBlocks";
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
  const stats: AreaStats | null = stateStats[region.slug] ?? null;
  const formatNumber = (n: number) => new Intl.NumberFormat(locale).format(n);

  // The figures go in the title and description so that no two states share a snippet.
  const title = stats
    ? t("metaTitleWithStats", { name: region.name, points: formatNumber(stats.points) })
    : t("metaTitle", { name: region.name });
  const description = stats
    ? t("metaDescriptionWithStats", {
        name: region.name,
        points: formatNumber(stats.points),
        stations: formatNumber(stats.stations),
        share: percent(stats.fastPoints, stats.points),
        towns: stats.topTowns
          .slice(0, 3)
          .map((town) => town.name)
          .join(", "),
      })
    : t("metaDescription", { name: region.name });

  return {
    title,
    description,
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
  const insights = stats ? getAreaInsights(stateStats, region.slug) : null;
  const formatNumber = (n: number) => new Intl.NumberFormat(locale).format(n);
  const listFormat = new Intl.ListFormat(locale, { style: "long", type: "conjunction" });
  const dataDate = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    new Date(stateStatsMeta.registerDate)
  );
  const path = `/bornes-recharge/de/${region.slug}`;
  const center = regionCenter(region);
  const nearby = nearestPlaces(
    germanStates.map((r) => ({ ...r, ...regionCenter(r) })),
    { ...region, ...center },
    5
  ).filter((other) => stateStats[other.slug]);

  // Answered from the state's own figures whenever they exist.
  const faq2Answer =
    stats && insights?.fastestTown
      ? t("faq2AnswerWithStats", {
          name: region.name,
          fastCount: formatNumber(stats.fastPoints),
          ultra: formatNumber(insights.ultraFastPoints),
          town: insights.fastestTown.name,
          townFast: formatNumber(insights.fastestTown.fastPoints),
        })
      : t("faq2Answer", { name: region.name });
  const faq4Answer =
    stats && stats.networks.length > 0
      ? t("faq4Answer", { name: region.name, networks: listFormat.format(stats.networks.map((n) => n.name)) })
      : null;

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
    geo: { "@type": "GeoCoordinates", latitude: center.lat, longitude: center.lon },
  };

  
  const mapHref = { pathname: "/", query: { lat: center.lat, lon: center.lon, zoom: 7 }, hash: "carte" };

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
            share: percent(stats.fastPoints, stats.points),
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

      {stats && insights && (
        <PointsAreaSections t={t} locale={locale} name={region.name} stats={stats} insights={insights} />
      )}

      <NearbyLinks
        heading={t("nearbyHeading")}
        items={nearby.map((other) => {
          const otherStats = stateStats[other.slug];
          return {
            href: `/bornes-recharge/de/${other.slug}`,
            label: other.name,
            note: t("nearbyItem", {
              points: formatNumber(otherStats.points),
              share: percent(otherStats.fastPoints, otherStats.points),
            }),
          };
        })}
      />

      <SectionHeading>{t("faqHeading")}</SectionHeading>

      <FaqItem question={t("faq1Question", { name: region.name })}>
        {t("faq1Answer", { name: region.name })}
      </FaqItem>
      <FaqItem question={t("faq2Question", { name: region.name })}>{faq2Answer}</FaqItem>
      {faq4Answer && <FaqItem question={t("faq4Question", { name: region.name })}>{faq4Answer}</FaqItem>}
      <FaqItem question={t("faq3Question")}>{t("faq3Answer", { name: region.name })}</FaqItem>

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
