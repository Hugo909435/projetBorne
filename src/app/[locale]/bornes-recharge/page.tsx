import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site, languageAlternates } from "@/lib/site";
import { departments } from "@/lib/departments";
import { germanStates, spanishRegions, ukRegions } from "@/lib/regions";
import departmentStatsData from "@/data/department-stats.json";
import type { DepartmentStats } from "@/lib/departmentStats";

const departmentStats = departmentStatsData as Record<string, DepartmentStats>;

const topFrenchDeptSlugs = [
  "nord",
  "paris",
  "gironde",
  "bouches-du-rhone",
  "rhone",
  "seine-et-marne",
  "alpes-maritimes",
  "yvelines",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "DepartmentsIndex" });
  const path = "/bornes-recharge";
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `/${locale}${path}`, languages: languageAlternates(path) },
    openGraph: { url: `${site.url}/${locale}${path}` },
  };
}

export default async function DepartmentsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "DepartmentsIndex" });
  const tNav = await getTranslations({ locale, namespace: "Nav" });

  const sortedDepartments = [...departments].sort((a, b) => a.name.localeCompare(b.name, "fr"));
  const sortedGermanStates = [...germanStates].sort((a, b) => a.name.localeCompare(b.name, "de"));
  const sortedSpanishRegions = [...spanishRegions].sort((a, b) => a.name.localeCompare(b.name, "es"));
  const sortedUkRegions = [...ukRegions].sort((a, b) => a.name.localeCompare(b.name, "en"));

  const topFrenchDepts = topFrenchDeptSlugs
    .map((slug) => departments.find((d) => d.slug === slug))
    .filter((d): d is NonNullable<typeof d> => d !== undefined);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("title"),
    description: t("intro"),
    url: `${site.url}/${locale}/bornes-recharge`,
    inLanguage: locale,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tNav("home"), item: `${site.url}/${locale}` },
      {
        "@type": "ListItem",
        position: 2,
        name: t("title"),
        item: `${site.url}/${locale}/bornes-recharge`,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-ink-400">
        <Link href="/" className="hover:text-green-700">
          {tNav("home")}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-600">{t("title")}</span>
      </nav>

      <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">{t("title")}</h1>
      <p className="mt-4 max-w-2xl text-ink-600">{t("intro")}</p>

      <div className="mt-6 flex flex-wrap gap-2.5">
        <a
          href="#france"
          className="rounded-full border border-line bg-card px-4 py-2 text-sm font-semibold text-ink-900 transition hover:border-green-600 hover:text-green-700"
        >
          {t("franceShort")}
        </a>
        <a
          href="#germany"
          className="rounded-full border border-line bg-card px-4 py-2 text-sm font-semibold text-ink-900 transition hover:border-green-600 hover:text-green-700"
        >
          {t("germanyShort")}
        </a>
        <a
          href="#spain"
          className="rounded-full border border-line bg-card px-4 py-2 text-sm font-semibold text-ink-900 transition hover:border-green-600 hover:text-green-700"
        >
          {t("spainShort")}
        </a>
        <a
          href="#uk"
          className="rounded-full border border-line bg-card px-4 py-2 text-sm font-semibold text-ink-900 transition hover:border-green-600 hover:text-green-700"
        >
          {t("ukShort")}
        </a>
      </div>

      <h2 id="france" className="mt-12 scroll-mt-24 font-display text-xl font-semibold text-ink-900">
        {t("franceHeading")}
      </h2>

      {/* Top equipped departments cards */}
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
          {t("topFranceHeading")}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {topFrenchDepts.map((dept) => {
            const st = departmentStats[dept.slug];
            return (
              <Link
                key={dept.slug}
                href={`/bornes-recharge/${dept.slug}`}
                className="group rounded-2xl border border-line bg-card p-4 transition hover:border-green-600 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-ink-900 group-hover:text-green-700">
                    {dept.name}
                  </span>
                  <span className="rounded-full bg-forest-950/5 px-2 py-0.5 text-xs font-medium text-ink-500">
                    {dept.code}
                  </span>
                </div>
                {st && (
                  <p className="mt-2 text-xs text-ink-500">
                    <strong className="text-green-700">{st.points.toLocaleString(locale)}</strong> {t("pointsLabel")} · {st.stations.toLocaleString(locale)} {t("stationsLabel")}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-ink-400">
        {t("allFranceHeading")}
      </h3>
      <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
        {sortedDepartments.map((dept) => (
          <li key={dept.slug}>
            <Link
              href={`/bornes-recharge/${dept.slug}`}
              className="flex items-baseline gap-1.5 py-1.5 text-sm text-ink-600 hover:text-green-700"
            >
              <span className="font-medium">{dept.name}</span>
              <span className="text-xs text-ink-400">({dept.code})</span>
            </Link>
          </li>
        ))}
      </ul>

      <h2 id="germany" className="mt-12 scroll-mt-24 font-display text-xl font-semibold text-ink-900">
        {t("germanyHeading")}
      </h2>
      <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
        {sortedGermanStates.map((region) => (
          <li key={region.slug}>
            <Link
              href={`/bornes-recharge/de/${region.slug}`}
              className="flex items-baseline gap-1.5 py-1.5 text-sm text-ink-600 hover:text-green-700"
            >
              <span className="font-medium">{region.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      <h2 id="spain" className="mt-12 scroll-mt-24 font-display text-xl font-semibold text-ink-900">
        {t("spainHeading")}
      </h2>
      <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
        {sortedSpanishRegions.map((region) => (
          <li key={region.slug}>
            <Link
              href={`/bornes-recharge/es/${region.slug}`}
              className="flex items-baseline gap-1.5 py-1.5 text-sm text-ink-600 hover:text-green-700"
            >
              <span className="font-medium">{region.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      <h2 id="uk" className="mt-12 scroll-mt-24 font-display text-xl font-semibold text-ink-900">
        {t("ukHeading")}
      </h2>
      <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
        {sortedUkRegions.map((region) => (
          <li key={region.slug}>
            <Link
              href={`/bornes-recharge/gb/${region.slug}`}
              className="flex items-baseline gap-1.5 py-1.5 text-sm text-ink-600 hover:text-green-700"
            >
              <span className="font-medium">{region.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
