import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site, languageAlternates } from "@/lib/site";
import { regionCenter, regionsByCountry, type Region } from "@/lib/regions";
import type { StationAggregate } from "@/lib/regionStats";
import { getRegionInsights, nearestPlaces, networkSlugForBrand, percent, powerBandOrder } from "@/lib/areaInsights";
import { powerBandLabels } from "@/components/regions/PointsAreaSections";
import {
  Breakdown,
  FaqItem,
  KeyFigures,
  NearbyLinks,
  SectionHeading,
  TownsTable,
} from "@/components/regions/StatBlocks";
import regionStatsData from "@/data/region-stats.json";

/**
 * The page of a Spanish comunidad autónoma or a UK region. Both read the same
 * Open Charge Map statistics (`scripts/generate-region-stats.ts`) and differ
 * only in their wording, which lives in each country's own namespace.
 */

const regionStats = regionStatsData as Record<string, StationAggregate>;

const countries = {
  es: { namespace: "SpainRegionPage", schemaName: "Spain" },
  gb: { namespace: "UKRegionPage", schemaName: "United Kingdom" },
} as const;

export type OcmCountry = keyof typeof countries;

export async function ocmRegionMetadata(locale: string, country: OcmCountry, region: Region): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: countries[country].namespace });
  const path = `/bornes-recharge/${country}/${region.slug}`;
  const stats: StationAggregate | null = regionStats[region.slug] ?? null;
  const formatNumber = (n: number) => new Intl.NumberFormat(locale).format(n);

  // The figures go in the title and description so that no two regions share a snippet.
  const title = stats
    ? t("metaTitleWithStats", { name: region.name, total: formatNumber(stats.total) })
    : t("metaTitle", { name: region.name });
  const description = stats
    ? t("metaDescriptionWithStats", {
        name: region.name,
        total: formatNumber(stats.total),
        share: percent(stats.fastCount, stats.total),
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

export async function OcmRegionPage({
  locale,
  country,
  region,
}: {
  locale: string;
  country: OcmCountry;
  region: Region;
}) {
  const t = await getTranslations({ locale, namespace: countries[country].namespace });
  const tNav = await getTranslations({ locale, namespace: "Nav" });

  const siblings = regionsByCountry[country];
  const stats: StationAggregate | null = regionStats[region.slug] ?? null;
  const insights = stats
    ? getRegionInsights(
        regionStats,
        siblings.map((r) => r.slug),
        region.slug
      )
    : null;
  const formatNumber = (n: number) => new Intl.NumberFormat(locale).format(n);
  const listFormat = new Intl.ListFormat(locale, { style: "long", type: "conjunction" });
  const share = (part: number, whole: number) => t("percentValue", { value: percent(part, whole) });

  const path = `/bornes-recharge/${country}/${region.slug}`;
  const center = regionCenter(region);
  const nearby = nearestPlaces(
    siblings.map((r) => ({ ...r, ...regionCenter(r) })),
    { ...region, ...center },
    5
  ).filter((other) => regionStats[other.slug]?.total);

  const topTown = stats?.topTowns[0];
  // In Ceuta or Melilla the "leading" operator runs a single station: not worth a sentence.
  const topOperator = stats?.operators.find((operator) => operator.count >= 5);
  const topConnector = stats?.connectorBreakdown[0];
  const withPower = stats ? powerBandOrder.reduce((sum, band) => sum + stats.powerBands[band], 0) : 0;

  // Answered from the region's own figures whenever they exist.
  const faq2Answer =
    stats && insights?.fastestTown
      ? t("faq2AnswerWithStats", {
          name: region.name,
          fastCount: formatNumber(stats.fastCount),
          ultra: formatNumber(insights.ultraFastStations),
          town: insights.fastestTown.name,
          townFast: formatNumber(insights.fastestTown.fastCount),
        })
      : t("faq2Answer", { name: region.name });
  const faq4Answer =
    stats && stats.operators.length > 1
      ? t("faq4Answer", { name: region.name, operators: listFormat.format(stats.operators.map((o) => o.name)) })
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
    containedInPlace: { "@type": "Country", name: countries[country].schemaName },
    geo: { "@type": "GeoCoordinates", latitude: center.lat, longitude: center.lon },
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
        acceptedAnswer: { "@type": "Answer", text: faq2Answer },
      },
      ...(faq4Answer
        ? [
            {
              "@type": "Question",
              name: t("faq4Question", { name: region.name }),
              acceptedAnswer: { "@type": "Answer", text: faq4Answer },
            },
          ]
        : []),
      {
        "@type": "Question",
        name: t("faq3Question"),
        acceptedAnswer: { "@type": "Answer", text: t("faq3Answer", { name: region.name }) },
      },
    ],
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
          ? t("introWithStats", { name: region.name, total: formatNumber(stats.total) })
          : t("introFallback", { name: region.name })}
      </p>

      {stats && stats.fastCount > 0 && (
        <p className="mt-2 text-ink-600">
          {t("fastCountLabel", { fastCount: formatNumber(stats.fastCount) })}
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
        <>
          <KeyFigures
            heading={t("keyFiguresHeading")}
            figures={[
              {
                label: t("figTotal"),
                value: formatNumber(stats.total),
                note: t("rankOf", { rank: insights.totalRank, total: insights.count }),
              },
              { label: t("figCountryShare"), value: t("percentValue", { value: insights.countryShare }) },
              { label: t("figFast"), value: formatNumber(stats.fastCount) },
              {
                label: t("figFastShare"),
                value: t("percentValue", { value: insights.fastShare }),
                note: t("rankOf", { rank: insights.fastShareRank, total: insights.count }),
              },
              ...(stats.maxPowerKw > 0
                ? [{ label: t("figMaxPower"), value: t("kwValue", { value: formatNumber(stats.maxPowerKw) }) }]
                : []),
            ]}
          />

          <SectionHeading>{t("analysisHeading", { name: region.name })}</SectionHeading>
          <p className="mt-3 text-ink-600">
            {t("analysisVolume", {
              name: region.name,
              total: formatNumber(stats.total),
              share: insights.countryShare,
              countryTotal: formatNumber(insights.countryTotal),
              rank: insights.totalRank,
              count: insights.count,
            })}
          </p>
          {stats.maxPowerKw > 0 && (
            <p className="mt-3 text-ink-600">
              {t("analysisFast", {
                share: insights.fastShare,
                trend: insights.fastTrend,
                national: insights.countryFastShare,
                ultra: insights.ultraFastStations,
                maxPower: formatNumber(stats.maxPowerKw),
              })}
            </p>
          )}
          <p className="mt-3 text-ink-600">
            {topTown &&
              t("analysisTopTown", {
                town: topTown.name,
                count: formatNumber(topTown.count),
                share: percent(topTown.count, stats.total),
              })}
            {topOperator && (
              <>
                {" "}
                {t("analysisOperator", {
                  operator: topOperator.name,
                  count: formatNumber(topOperator.count),
                  share: percent(topOperator.count, stats.operatorKnown),
                })}
              </>
            )}
            {topConnector && (
              <>
                {" "}
                {t("analysisConnector", {
                  connector: topConnector.name,
                  share: percent(topConnector.count, stats.total),
                })}
              </>
            )}
          </p>

          <Breakdown
            heading={t("powerHeading")}
            note={t("powerNote", { unknown: formatNumber(stats.total - withPower) })}
            rows={powerBandOrder
              .filter((band) => stats.powerBands[band] > 0)
              .map((band) => ({
                key: band,
                label: t(powerBandLabels[band]),
                value: formatNumber(stats.powerBands[band]),
                share: share(stats.powerBands[band], withPower),
              }))}
          />
        </>
      )}

      {stats && (
        <>
          <Breakdown
            heading={t("connectorsHeading")}
            note={t("connectorsNote")}
            rows={stats.connectorBreakdown.map((c) => ({
              key: c.name,
              label: c.name,
              value: formatNumber(c.count),
            }))}
          />

          <Breakdown
            heading={t("operatorsHeading")}
            intro={t("operatorsIntro", {
              name: region.name,
              known: percent(stats.operatorKnown, stats.total),
            })}
            rows={stats.operators.map((operator) => {
              const slug = networkSlugForBrand(operator.name);
              return {
                key: operator.name,
                label: operator.name,
                href: slug ? `/reseaux/${slug}` : undefined,
                value: formatNumber(operator.count),
                share: share(operator.count, stats.operatorKnown),
              };
            })}
          />

          <TownsTable
            heading={t("townsHeading")}
            columns={[t("colTown"), t("colStations"), t("colFast")]}
            rows={stats.topTowns.map((town) => ({
              name: town.name,
              cells: [formatNumber(town.count), formatNumber(town.fastCount)],
            }))}
          />
        </>
      )}

      <NearbyLinks
        heading={t("nearbyHeading")}
        items={nearby.map((other) => {
          const otherStats = regionStats[other.slug];
          return {
            href: `/bornes-recharge/${country}/${other.slug}`,
            label: other.name,
            note: t("nearbyItem", {
              total: formatNumber(otherStats.total),
              share: percent(otherStats.fastCount, otherStats.total),
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

      <p className="mt-10 text-xs text-ink-400">{t("sourceNote")}</p>

      <Link href="/bornes-recharge" className="mt-2 inline-block text-sm font-semibold text-green-700 underline">
        {t("backToIndex")}
      </Link>
    </article>
  );
}
