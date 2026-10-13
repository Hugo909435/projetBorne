import type { AreaStats, PowerBand, Siting } from "@/lib/departmentStats";
import { networkSlugForBrand, percent, powerBandOrder, type AreaInsights } from "@/lib/areaInsights";
import { Breakdown, KeyFigures, SectionHeading, TownsTable } from "@/components/regions/StatBlocks";

export type Translator = (key: string, values?: Record<string, string | number>) => string;

export const powerBandLabels: Record<PowerBand, string> = {
  upTo7: "bandUpTo7",
  upTo22: "bandUpTo22",
  upTo49: "bandUpTo49",
  upTo149: "bandUpTo149",
  from150: "bandFrom150",
};

const sitingLabels: Record<Siting, string> = {
  street: "sitingStreet",
  publicParking: "sitingPublicParking",
  privateParking: "sitingPrivateParking",
  customerParking: "sitingCustomerParking",
  fastHub: "sitingFastHub",
};

/**
 * The statistics of an area counted in charge points, from an official
 * register: a French department or a German state. Both namespaces carry the
 * same keys, so the wording stays each page's own.
 */
export function PointsAreaSections({
  t,
  locale,
  name,
  stats,
  insights,
  siting,
  dominantSiting,
}: {
  t: Translator;
  locale: string;
  name: string;
  stats: AreaStats;
  insights: AreaInsights;
  /** Only the French base says what kind of site a point is on. */
  siting?: Record<Siting, number>;
  dominantSiting?: { key: Siting; share: number } | null;
}) {
  const formatNumber = (n: number) => new Intl.NumberFormat(locale).format(n);
  const formatDecimal = (n: number) =>
    new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n);
  const share = (part: number) => t("percentValue", { value: percent(part, stats.points) });
  const rank = (value: number) => t("rankOf", { rank: value, total: insights.total });

  const topTown = stats.topTowns[0];
  const topNetwork = stats.networks[0];
  const sitingRows = siting
    ? (Object.entries(siting) as [Siting, number][]).filter(([, count]) => count > 0).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <>
      <KeyFigures
        heading={t("keyFiguresHeading")}
        figures={[
          { label: t("figPoints"), value: formatNumber(stats.points), note: rank(insights.pointsRank) },
          { label: t("figStations"), value: formatNumber(stats.stations) },
          {
            label: t("figDensity"),
            value: formatDecimal(insights.pointsPer100k),
            note: rank(insights.densityRank),
          },
          {
            label: t("figFastShare"),
            value: t("percentValue", { value: insights.fastShare }),
            note: rank(insights.fastShareRank),
          },
          { label: t("figMaxPower"), value: t("kwValue", { value: formatNumber(stats.maxPowerKw) }) },
          { label: t("figArea"), value: formatDecimal(insights.pointsPer100Km2) },
        ]}
      />

      <SectionHeading>{t("analysisHeading", { name })}</SectionHeading>
      <p className="mt-3 text-ink-600">
        {t("analysisDensity", {
          name,
          density: formatDecimal(insights.pointsPer100k),
          rank: insights.densityRank,
          total: insights.total,
          trend: insights.densityTrend,
          national: formatDecimal(insights.nationalPointsPer100k),
        })}{" "}
        {t("analysisVolume", {
          points: formatNumber(stats.points),
          rank: insights.pointsRank,
          total: insights.total,
          population: formatNumber(stats.population),
          area: formatNumber(stats.areaKm2),
          perArea: formatDecimal(insights.pointsPer100Km2),
        })}
      </p>
      <p className="mt-3 text-ink-600">
        {t("analysisFast", {
          share: insights.fastShare,
          trend: insights.fastTrend,
          national: insights.nationalFastShare,
          ultra: insights.ultraFastPoints,
          maxPower: formatNumber(stats.maxPowerKw),
        })}
        {dominantSiting && <> {t("analysisSiting", { siting: dominantSiting.key, share: dominantSiting.share })}</>}
      </p>
      <p className="mt-3 text-ink-600">
        {topTown &&
          t("analysisTopTown", {
            town: topTown.name,
            stations: formatNumber(topTown.count),
            points: formatNumber(topTown.points),
            share: percent(topTown.points, stats.points),
          })}
        {topNetwork && (
          <>
            {" "}
            {t("analysisNetwork", {
              network: topNetwork.name,
              points: formatNumber(topNetwork.points),
              share: percent(topNetwork.points, stats.points),
            })}
          </>
        )}
      </p>

      <Breakdown
        heading={t("powerHeading")}
        rows={powerBandOrder
          .filter((band) => stats.powerBands[band] > 0)
          .map((band) => ({
            key: band,
            label: t(powerBandLabels[band]),
            value: formatNumber(stats.powerBands[band]),
            share: share(stats.powerBands[band]),
          }))}
      />

      <Breakdown
        heading={t("connectorsHeading")}
        note={t("connectorsNote")}
        rows={stats.connectorBreakdown.map((c) => ({ key: c.name, label: c.name, value: formatNumber(c.count) }))}
      />

      <Breakdown
        heading={t("networksHeading")}
        intro={t("networksIntro", { name })}
        rows={stats.networks.map((network) => {
          const slug = networkSlugForBrand(network.name);
          return {
            key: network.name,
            label: network.name,
            href: slug ? `/reseaux/${slug}` : undefined,
            value: formatNumber(network.points),
            share: share(network.points),
          };
        })}
      />

      {siting && (
        <Breakdown
          heading={t("sitingHeading")}
          rows={sitingRows.map(([key, count]) => ({
            key,
            label: t(sitingLabels[key]),
            value: formatNumber(count),
          }))}
        />
      )}

      <TownsTable
        heading={t("townsHeading")}
        columns={[t("colTown"), t("colStations"), t("colPoints"), t("colFast")]}
        rows={stats.topTowns.map((town) => ({
          name: town.name,
          cells: [formatNumber(town.count), formatNumber(town.points), formatNumber(town.fastPoints)],
        }))}
      />
    </>
  );
}
