import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site, languageAlternates } from "@/lib/site";
import { departments, findDepartmentBySlug } from "@/lib/departments";
import type { DepartmentStats, DepartmentStatsMeta } from "@/lib/departmentStats";
import departmentStatsData from "@/data/department-stats.json";
import departmentStatsMetaData from "@/data/department-stats-meta.json";

const departmentStats = departmentStatsData as Record<string, DepartmentStats>;
const departmentStatsMeta = departmentStatsMetaData as DepartmentStatsMeta;

export async function generateStaticParams() {
  return departments.map((d) => ({ departement: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; departement: string }>;
}): Promise<Metadata> {
  const { locale, departement } = await params;
  const dept = findDepartmentBySlug(departement);
  if (!dept) notFound();

  const t = await getTranslations({ locale, namespace: "DepartmentPage" });
  const path = `/bornes-recharge/${dept.slug}`;

  return {
    title: t("metaTitle", { name: dept.name, code: dept.code }),
    description: t("metaDescription", { name: dept.name, code: dept.code }),
    alternates: { canonical: `/${locale}${path}`, languages: languageAlternates(path) },
    openGraph: { url: `${site.url}/${locale}${path}` },
  };
}

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ locale: string; departement: string }>;
}) {
  const { locale, departement } = await params;
  const dept = findDepartmentBySlug(departement);
  if (!dept) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "DepartmentPage" });
  const tNav = await getTranslations({ locale, namespace: "Nav" });

  // Generated offline from the official national IRVE base by
  // `scripts/generate_irve_data.py` (`npm run generate:irve`),
  // so page generation just reads a local JSON file: fast and deterministic.
  const stats: DepartmentStats | null = departmentStats[dept.slug] ?? null;
  const formatNumber = (n: number) => new Intl.NumberFormat(locale).format(n);
  const dataDate = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    new Date(departmentStatsMeta.generatedAt)
  );

  const path = `/bornes-recharge/${dept.slug}`;

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
      { "@type": "ListItem", position: 3, name: dept.name, item: `${site.url}/${locale}${path}` },
    ],
  };

  const placeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: t("placeName", { name: dept.name, code: dept.code }),
    containedInPlace: { "@type": "AdministrativeArea", name: "France" },
    geo: { "@type": "GeoCoordinates", latitude: dept.lat, longitude: dept.lon },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("faq1Question", { name: dept.name }),
        acceptedAnswer: {
          "@type": "Answer",
          text: `${t("faq1AnswerBefore")}${t("faq1AnswerLink")}${t("faq1AnswerAfter")}`,
        },
      },
      {
        "@type": "Question",
        name: t("faq2Question", { name: dept.name }),
        acceptedAnswer: { "@type": "Answer", text: t("faq2Answer", { name: dept.name }) },
      },
      {
        "@type": "Question",
        name: t("faq3Question"),
        acceptedAnswer: { "@type": "Answer", text: t("faq3Answer") },
      },
    ],
  };

  const mapHref = { pathname: "/", query: { lat: dept.lat, lon: dept.lon, zoom: 9 }, hash: "carte" };

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
        <span className="text-ink-600">{dept.name}</span>
      </nav>

      <p className="mb-3 border-l-[3px] border-green-500 pl-3 text-sm font-semibold text-green-700">
        {t("eyebrow")}
      </p>
      <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">
        {t("title", { name: dept.name, code: dept.code })}
      </h1>

      <p className="mt-4 text-ink-600">
        {stats
          ? t("introWithStats", {
              name: dept.name,
              code: dept.code,
              points: formatNumber(stats.points),
              stations: formatNumber(stats.stations),
              date: dataDate,
            })
          : t("introFallback", { name: dept.name, code: dept.code })}
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
          {t("faq1Question", { name: dept.name })}
        </summary>
        <p className="mt-2 text-ink-600">
          {t("faq1AnswerBefore")}
          <Link href="/blog/cout-recharge-voiture-electrique" className="font-semibold text-green-700 underline">
            {t("faq1AnswerLink")}
          </Link>
          {t("faq1AnswerAfter")}
        </p>
      </details>

      <details className="mt-3 rounded-xl border border-line p-4">
        <summary className="cursor-pointer font-semibold text-ink-900">
          {t("faq2Question", { name: dept.name })}
        </summary>
        <p className="mt-2 text-ink-600">{t("faq2Answer", { name: dept.name })}</p>
      </details>

      <details className="mt-3 rounded-xl border border-line p-4">
        <summary className="cursor-pointer font-semibold text-ink-900">{t("faq3Question")}</summary>
        <p className="mt-2 text-ink-600">{t("faq3Answer")}</p>
      </details>

      <p className="mt-10 text-xs text-ink-400">
        {t("sourceNote", { date: dataDate })}{" "}
        <a
          href={departmentStatsMeta.sourceUrl}
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          data.gouv.fr
        </a>
      </p>

      <Link href="/bornes-recharge" className="mt-2 inline-block text-sm font-semibold text-green-700 underline">
        {t("backToIndex")}
      </Link>
    </article>
  );
}
