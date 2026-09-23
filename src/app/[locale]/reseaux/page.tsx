import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site, languageAlternates } from "@/lib/site";
import { countryByCode } from "@/lib/countries";
import { chargingNetworks, type NetworkStatsFile } from "@/lib/chargingNetworks";
import { RELIABILITY_COUNTRIES } from "@/lib/reliability";
import networkStatsData from "@/data/network-stats.json";

const networkStats = networkStatsData as NetworkStatsFile;
const PATH = "/reseaux";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "NetworksIndex" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription", { count: chargingNetworks.length }),
    alternates: { canonical: `/${locale}${PATH}`, languages: languageAlternates(PATH) },
    openGraph: { url: `${site.url}/${locale}${PATH}` },
  };
}

export default async function NetworksIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "NetworksIndex" });
  const tNav = await getTranslations({ locale, namespace: "Nav" });
  const tCountries = await getTranslations({ locale, namespace: "Countries" });

  const nf = new Intl.NumberFormat(locale);
  const num = (n: number) => nf.format(n);
  const dataDate = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    new Date(networkStats.generatedAt)
  );

  const countryName = (code: string) => {
    const def = countryByCode(code);
    return def ? tCountries(def.countryKey) : code;
  };

  const rows = chargingNetworks
    .map((network) => {
      const stats = networkStats.networks[network.slug];
      const countries = stats
        ? RELIABILITY_COUNTRIES.filter((code) => stats.countries[code])
        : [];
      return { network, stats, countries };
    })
    // Widest footprint first, then size: the reader scanning for "which card
    // covers my trip" wants the multi-country networks at the top.
    .sort((a, b) => b.countries.length - a.countries.length || (b.stats?.total ?? 0) - (a.stats?.total ?? 0));

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tNav("home"), item: `${site.url}/${locale}` },
      {
        "@type": "ListItem",
        position: 2,
        name: tNav("networks"),
        item: `${site.url}/${locale}${PATH}`,
      },
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: rows.map((row, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: row.network.name,
      url: `${site.url}/${locale}${PATH}/${row.network.slug}`,
    })),
  };

  return (
    <article className="mx-auto max-w-4xl px-5 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-ink-400">
        <Link href="/" className="hover:text-green-700">
          {tNav("home")}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-600">{tNav("networks")}</span>
      </nav>

      <p className="mb-3 border-l-[3px] border-green-500 pl-3 text-sm font-semibold text-green-700">
        {t("eyebrow")}
      </p>
      <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">{t("title")}</h1>
      <p className="mt-4 text-ink-600">{t("intro", { count: chargingNetworks.length })}</p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {rows.map(({ network, stats, countries }) => (
          <li key={network.slug}>
            <Link
              href={`/reseaux/${network.slug}`}
              className="block h-full rounded-2xl border border-line bg-card p-5 transition hover:border-green-500"
            >
              <p className="font-display text-lg font-semibold text-ink-900">{network.name}</p>
              {stats ? (
                <>
                  <p className="mt-1 text-sm text-ink-600">
                    {t("cardStations", { stations: num(stats.total), fast: num(stats.totalFast) })}
                  </p>
                  <p className="mt-2 text-xs text-ink-400">
                    {countries.map(countryName).join(" · ")}
                  </p>
                </>
              ) : (
                <p className="mt-1 text-sm text-ink-400">{t("cardNoData")}</p>
              )}
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">
        {t("methodHeading")}
      </h2>
      <p className="mt-3 text-ink-600">{t("methodBody")}</p>

      <p className="mt-6 text-ink-600">
        <Link href="/fiabilite-bornes" className="font-semibold text-green-700 underline">
          {t("reliabilityLink")}
        </Link>
      </p>

      <p className="mt-10 text-xs text-ink-400">
        {t("sourceNote", { date: dataDate })}{" "}
        <a
          href={networkStats.sourceUrl}
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {networkStats.source}
        </a>
      </p>
    </article>
  );
}
