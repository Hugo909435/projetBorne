import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site, languageAlternates } from "@/lib/site";
import { countryByCode } from "@/lib/countries";
import {
  chargingNetworks,
  findNetworkBySlug,
  type NetworkStatsFile,
} from "@/lib/chargingNetworks";
import { RELIABILITY_COUNTRIES } from "@/lib/reliability";
import networkStatsData from "@/data/network-stats.json";

const networkStats = networkStatsData as NetworkStatsFile;
const PATH = "/reseaux";

export async function generateStaticParams() {
  return chargingNetworks.map((n) => ({ reseau: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; reseau: string }>;
}): Promise<Metadata> {
  const { locale, reseau } = await params;
  const network = findNetworkBySlug(reseau);
  if (!network) notFound();

  const t = await getTranslations({ locale, namespace: "NetworkPage" });
  const stats = networkStats.networks[network.slug];
  const path = `${PATH}/${network.slug}`;

  return {
    title: t("metaTitle", { name: network.name }),
    description: t("metaDescription", {
      name: network.name,
      countries: stats ? Object.keys(stats.countries).length : 0,
    }),
    alternates: { canonical: `/${locale}${path}`, languages: languageAlternates(path) },
    openGraph: { url: `${site.url}/${locale}${path}` },
  };
}

export default async function NetworkPage({
  params,
}: {
  params: Promise<{ locale: string; reseau: string }>;
}) {
  const { locale, reseau } = await params;
  const network = findNetworkBySlug(reseau);
  if (!network) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "NetworkPage" });
  const tNav = await getTranslations({ locale, namespace: "Nav" });
  const tCountries = await getTranslations({ locale, namespace: "Countries" });

  const nf = new Intl.NumberFormat(locale);
  const num = (n: number) => nf.format(n);
  const stats = networkStats.networks[network.slug] ?? null;
  const path = `${PATH}/${network.slug}`;
  const dataDate = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    new Date(networkStats.generatedAt)
  );

  const countryName = (code: string) => {
    const def = countryByCode(code);
    return def ? tCountries(def.countryKey) : code;
  };

  // Countries kept in the map's own order so every network page reads the same
  // way, rather than reordering by whichever country the network happens to be
  // biggest in.
  const rows = RELIABILITY_COUNTRIES.filter((code) => stats?.countries[code]).map((code) => ({
    code,
    name: countryName(code),
    ...stats!.countries[code],
  }));

  const maxPower = rows.reduce<number | null>(
    (best, row) => (row.maxPowerKw != null && row.maxPowerKw > (best ?? 0) ? row.maxPowerKw : best),
    null
  );
  const anyCapped = rows.some((row) => row.capped);

  // Other networks present in at least one of the same countries: the useful
  // comparison for a reader deciding which card to carry.
  const alternatives = chargingNetworks
    .filter((other) => {
      if (other.slug === network.slug) return false;
      const otherStats = networkStats.networks[other.slug];
      if (!otherStats) return false;
      return rows.some((row) => otherStats.countries[row.code]);
    })
    .slice(0, 6);

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
      { "@type": "ListItem", position: 3, name: network.name, item: `${site.url}/${locale}${path}` },
    ],
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: network.name,
    url: network.website,
    areaServed: rows.map((row) => ({ "@type": "Country", name: row.name })),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("faq1Question", { name: network.name }),
        acceptedAnswer: {
          "@type": "Answer",
          text: rows.length
            ? t("faq1Answer", {
                name: network.name,
                countries: rows.map((row) => row.name).join(", "),
              })
            : t("faq1AnswerEmpty", { name: network.name }),
        },
      },
      {
        "@type": "Question",
        name: t("faq2Question", { name: network.name }),
        acceptedAnswer: { "@type": "Answer", text: t("faq2Answer", { name: network.name }) },
      },
      {
        "@type": "Question",
        name: t("faq3Question", { name: network.name }),
        acceptedAnswer: { "@type": "Answer", text: t("faq3Answer", { name: network.name }) },
      },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
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
        <Link href="/reseaux" className="hover:text-green-700">
          {tNav("networks")}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-600">{network.name}</span>
      </nav>

      <p className="mb-3 border-l-[3px] border-green-500 pl-3 text-sm font-semibold text-green-700">
        {t("eyebrow")}
      </p>
      <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">
        {t("title", { name: network.name })}
      </h1>

      <p className="mt-4 text-ink-600">
        {stats && rows.length
          ? t("intro", {
              name: network.name,
              stations: num(stats.total),
              countries: rows.length,
              fast: num(stats.totalFast),
            })
          : t("introFallback", { name: network.name })}
      </p>

      {stats && rows.length > 0 && (
        <>
          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-line bg-card p-4">
              <dt className="text-xs text-ink-400">{t("statStations")}</dt>
              <dd className="mt-1 text-lg font-semibold text-ink-900">{num(stats.total)}</dd>
            </div>
            <div className="rounded-xl border border-line bg-card p-4">
              <dt className="text-xs text-ink-400">{t("statFast")}</dt>
              <dd className="mt-1 text-lg font-semibold text-ink-900">{num(stats.totalFast)}</dd>
            </div>
            <div className="rounded-xl border border-line bg-card p-4">
              <dt className="text-xs text-ink-400">{t("statMaxPower")}</dt>
              <dd className="mt-1 text-lg font-semibold text-ink-900">
                {maxPower != null ? `${num(maxPower)} kW` : t("unknown")}
              </dd>
            </div>
          </dl>

          <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">
            {t("countriesHeading", { name: network.name })}
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-ink-400">
                  <th scope="col" className="py-2 font-medium">
                    {t("tableCountry")}
                  </th>
                  <th scope="col" className="py-2 font-medium">
                    {t("tableStations")}
                  </th>
                  <th scope="col" className="py-2 font-medium">
                    {t("tableFast")}
                  </th>
                  <th scope="col" className="py-2 font-medium">
                    {t("tableMaxPower")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.code} className="border-b border-line">
                    <td className="py-2 text-ink-600">{row.name}</td>
                    <td className="py-2 font-semibold text-ink-900">
                      {row.capped ? `${num(row.stations)}+` : num(row.stations)}
                    </td>
                    <td className="py-2 text-ink-600">{num(row.fastStations)}</td>
                    <td className="py-2 text-ink-600">
                      {row.maxPowerKw != null ? `${num(row.maxPowerKw)} kW` : t("unknown")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {anyCapped && <p className="mt-3 text-sm text-ink-400">{t("cappedNote")}</p>}

          {stats.connectors.length > 0 && (
            <>
              <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">
                {t("connectorsHeading")}
              </h2>
              <p className="mt-3 text-ink-600">
                {t("connectorsBody", {
                  name: network.name,
                  connectors: stats.connectors.join(", "),
                })}
              </p>
              <p className="mt-3 text-ink-600">
                <Link
                  href="/blog/types-de-bornes-electriques"
                  className="font-semibold text-green-700 underline"
                >
                  {t("connectorsLink")}
                </Link>
              </p>
            </>
          )}
        </>
      )}

      <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">{t("priceHeading")}</h2>
      <p className="mt-3 text-ink-600">{t("priceBody", { name: network.name })}</p>
      <p className="mt-4 flex flex-wrap gap-3">
        <a
          href={network.pricingUrl}
          className="inline-flex items-center rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-900 transition hover:border-green-500"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("priceCta", { name: network.name })}
        </a>
        <Link
          href="/blog/comparatif-abonnements-recharge"
          className="inline-flex items-center rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-900 transition hover:border-green-500"
        >
          {t("subscriptionsCta")}
        </Link>
      </p>

      <div className="mt-8 rounded-2xl border border-line bg-card p-6">
        <p className="text-ink-600">{t("mapCtaNote", { name: network.name })}</p>
        <Link
          href={{ pathname: "/", hash: "carte" }}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-forest-950 transition hover:bg-lime-300"
        >
          {t("mapCta")}
        </Link>
      </div>

      <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">{t("faqHeading")}</h2>

      <details className="mt-3 rounded-xl border border-line p-4">
        <summary className="cursor-pointer font-semibold text-ink-900">
          {t("faq1Question", { name: network.name })}
        </summary>
        <p className="mt-2 text-ink-600">
          {rows.length
            ? t("faq1Answer", {
                name: network.name,
                countries: rows.map((row) => row.name).join(", "),
              })
            : t("faq1AnswerEmpty", { name: network.name })}
        </p>
      </details>

      <details className="mt-3 rounded-xl border border-line p-4">
        <summary className="cursor-pointer font-semibold text-ink-900">
          {t("faq2Question", { name: network.name })}
        </summary>
        <p className="mt-2 text-ink-600">{t("faq2Answer", { name: network.name })}</p>
      </details>

      <details className="mt-3 rounded-xl border border-line p-4">
        <summary className="cursor-pointer font-semibold text-ink-900">
          {t("faq3Question", { name: network.name })}
        </summary>
        <p className="mt-2 text-ink-600">{t("faq3Answer", { name: network.name })}</p>
      </details>

      {alternatives.length > 0 && (
        <>
          <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">
            {t("alternativesHeading", { name: network.name })}
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {alternatives.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/reseaux/${other.slug}`}
                  className="flex items-center justify-between rounded-xl border border-line p-3 text-sm transition hover:border-green-500"
                >
                  <span className="font-semibold text-ink-900">{other.name}</span>
                  <span className="text-ink-400">
                    {num(networkStats.networks[other.slug].total)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

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

      <Link href="/reseaux" className="mt-2 inline-block text-sm font-semibold text-green-700 underline">
        {t("backToIndex")}
      </Link>
    </article>
  );
}
