import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site, languageAlternates } from "@/lib/site";
import { departments } from "@/lib/departments";
import { germanStates, spanishRegions } from "@/lib/regions";

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

      <h2 className="mt-12 font-display text-xl font-semibold text-ink-900">{t("franceHeading")}</h2>
      <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
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

      <h2 className="mt-12 font-display text-xl font-semibold text-ink-900">{t("germanyHeading")}</h2>
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

      <h2 className="mt-12 font-display text-xl font-semibold text-ink-900">{t("spainHeading")}</h2>
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
    </div>
  );
}
