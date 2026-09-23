import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site, languageAlternates, author, publisherJsonLd } from "@/lib/site";
import { countryByCode } from "@/lib/countries";
import type { ReliabilityFile } from "@/lib/reliability";
import reliabilityData from "@/data/reliability-stats.json";

const reliability = reliabilityData as ReliabilityFile;
const PATH = "/fiabilite-bornes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ReliabilityPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription", { countries: reliability.countries.length }),
    alternates: { canonical: `/${locale}${PATH}`, languages: languageAlternates(PATH) },
    openGraph: { url: `${site.url}/${locale}${PATH}`, type: "article" },
  };
}

export default async function ReliabilityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "ReliabilityPage" });
  const tNav = await getTranslations({ locale, namespace: "Nav" });
  const tCountries = await getTranslations({ locale, namespace: "Countries" });

  const nf = new Intl.NumberFormat(locale);
  const num = (n: number) => nf.format(n);
  const pf = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  const dataDate = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    new Date(reliability.generatedAt)
  );

  const countryName = (code: string) => {
    const def = countryByCode(code);
    return def ? tCountries(def.countryKey) : code;
  };

  // Worst rate first: the ranking is the story, and burying it under
  // alphabetical order would waste the one thing this page has that nothing
  // else publishes.
  const ranked = [...reliability.countries].sort((a, b) => b.outOfServiceRate - a.outOfServiceRate);
  const worst = ranked[0];
  const best = ranked[ranked.length - 1];
  const totalSample = reliability.countries.reduce((sum, c) => sum + c.sample, 0);
  const totalOut = reliability.countries.reduce((sum, c) => sum + c.outOfService, 0);
  const overallRate = totalSample ? Math.round((totalOut / totalSample) * 1000) / 10 : 0;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tNav("home"), item: `${site.url}/${locale}` },
      { "@type": "ListItem", position: 2, name: t("title"), item: `${site.url}/${locale}${PATH}` },
    ],
  };

  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: t("title"),
    description: t("metaDescription", { countries: reliability.countries.length }),
    url: `${site.url}/${locale}${PATH}`,
    dateModified: reliability.generatedAt,
    creator: publisherJsonLd,
    isBasedOn: reliability.sourceUrl,
    spatialCoverage: reliability.countries.map((c) => ({
      "@type": "Country",
      name: countryName(c.countryCode),
    })),
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t("title"),
    description: t("metaDescription", { countries: reliability.countries.length }),
    dateModified: reliability.generatedAt,
    author: { "@type": "Person", name: author.name, url: author.url },
    publisher: publisherJsonLd,
    mainEntityOfPage: `${site.url}/${locale}${PATH}`,
  };

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-ink-400">
        <Link href="/" className="hover:text-green-700">
          {tNav("home")}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-600">{t("title")}</span>
      </nav>

      <p className="mb-3 border-l-[3px] border-green-500 pl-3 text-sm font-semibold text-green-700">
        {t("eyebrow", { date: dataDate })}
      </p>
      <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">{t("title")}</h1>

      <p className="mt-4 text-ink-600">
        {t("intro", {
          sample: num(totalSample),
          countries: reliability.countries.length,
          rate: pf.format(overallRate),
        })}
      </p>

      <p className="mt-3 text-ink-600">
        {t("headline", {
          worst: countryName(worst.countryCode),
          worstRate: pf.format(worst.outOfServiceRate),
          best: countryName(best.countryCode),
          bestRate: pf.format(best.outOfServiceRate),
        })}
      </p>

      <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">
        {t("rankingHeading")}
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-ink-400">
              <th scope="col" className="py-2 font-medium">
                {t("tableCountry")}
              </th>
              <th scope="col" className="py-2 font-medium">
                {t("tableRate")}
              </th>
              <th scope="col" className="py-2 font-medium">
                {t("tableOut")}
              </th>
              <th scope="col" className="py-2 font-medium">
                {t("tableSample")}
              </th>
              <th scope="col" className="py-2 font-medium">
                {t("tableVerified")}
              </th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((row) => (
              <tr key={row.countryCode} className="border-b border-line">
                <td className="py-2 text-ink-600">{countryName(row.countryCode)}</td>
                <td className="py-2 font-semibold text-ink-900">
                  {pf.format(row.outOfServiceRate)} %
                </td>
                <td className="py-2 text-ink-600">{num(row.outOfService)}</td>
                <td className="py-2 text-ink-600">
                  {row.capped ? `${num(row.sample)}+` : num(row.sample)}
                </td>
                <td className="py-2 text-ink-600">
                  {row.sample ? Math.round((row.recentlyVerified / row.sample) * 100) : 0} %
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 rounded-xl border border-line bg-card p-4 text-sm text-ink-600">
        {t("verifiedWarning")}
      </p>

      <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">
        {t("readingHeading")}
      </h2>
      <p className="mt-3 text-ink-600">{t("readingBody1")}</p>
      <p className="mt-3 text-ink-600">{t("readingBody2")}</p>

      <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">
        {t("methodHeading")}
      </h2>
      <ul className="mt-3 space-y-2 text-ink-600">
        <li className="border-b border-line pb-2">{t("method1")}</li>
        <li className="border-b border-line pb-2">{t("method2")}</li>
        <li className="border-b border-line pb-2">{t("method3")}</li>
        <li className="border-b border-line pb-2">{t("method4")}</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">
        {t("limitsHeading")}
      </h2>
      <p className="mt-3 text-ink-600">{t("limitsBody1")}</p>
      <p className="mt-3 text-ink-600">{t("limitsBody2")}</p>

      <div className="mt-8 rounded-2xl border border-line bg-card p-6">
        <p className="text-ink-600">{t("mapCtaNote")}</p>
        <Link
          href={{ pathname: "/", hash: "carte" }}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-forest-950 transition hover:bg-lime-300"
        >
          {t("mapCta")}
        </Link>
      </div>

      <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">{t("nextHeading")}</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        <li>
          <Link
            href="/reseaux"
            className="block rounded-xl border border-line p-3 text-sm font-semibold text-ink-900 transition hover:border-green-500"
          >
            {t("nextNetworks")}
          </Link>
        </li>
        <li>
          <Link
            href="/blog/bornes-rapides-autoroute-ete-2026"
            className="block rounded-xl border border-line p-3 text-sm font-semibold text-ink-900 transition hover:border-green-500"
          >
            {t("nextMotorway")}
          </Link>
        </li>
      </ul>

      <p className="mt-10 text-xs text-ink-400">
        {t("sourceNote", { date: dataDate })}{" "}
        <a
          href={reliability.sourceUrl}
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {reliability.source}
        </a>
      </p>
    </article>
  );
}
