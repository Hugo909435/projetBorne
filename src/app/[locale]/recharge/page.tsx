import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site, languageAlternates } from "@/lib/site";
import { evModels, evModelFullName } from "@/lib/evModels";

const PATH = "/recharge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "EvModelsIndex" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription", { count: evModels.length }),
    alternates: { canonical: `/${locale}${PATH}`, languages: languageAlternates(PATH) },
    openGraph: { url: `${site.url}/${locale}${PATH}` },
  };
}

export default async function EvModelsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "EvModelsIndex" });
  const tNav = await getTranslations({ locale, namespace: "Nav" });
  const nf = new Intl.NumberFormat(locale);

  // Fastest first: DC peak is what a reader comparing models actually scans for.
  const sorted = [...evModels].sort((a, b) => b.dcKw - a.dcKw);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tNav("home"), item: `${site.url}/${locale}` },
      {
        "@type": "ListItem",
        position: 2,
        name: tNav("models"),
        item: `${site.url}/${locale}${PATH}`,
      },
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: sorted.map((model, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: evModelFullName(model),
      url: `${site.url}/${locale}${PATH}/${model.slug}`,
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
        <span className="text-ink-600">{tNav("models")}</span>
      </nav>

      <p className="mb-3 border-l-[3px] border-green-500 pl-3 text-sm font-semibold text-green-700">
        {t("eyebrow")}
      </p>
      <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">{t("title")}</h1>
      <p className="mt-4 text-ink-600">{t("intro", { count: evModels.length })}</p>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-ink-400">
              <th scope="col" className="py-2 font-medium">
                {t("tableModel")}
              </th>
              <th scope="col" className="py-2 font-medium">
                {t("tableBattery")}
              </th>
              <th scope="col" className="py-2 font-medium">
                {t("tablePeak")}
              </th>
              <th scope="col" className="py-2 font-medium">
                {t("tableFastCharge")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((model) => (
              <tr key={model.slug} className="border-b border-line">
                <td className="py-2.5">
                  <Link
                    href={`/recharge/${model.slug}`}
                    className="font-semibold text-green-700 underline"
                  >
                    {evModelFullName(model)}
                  </Link>
                </td>
                <td className="py-2.5 text-ink-600">{nf.format(model.batteryKwh)} kWh</td>
                <td className="py-2.5 text-ink-600">{nf.format(model.dcKw)} kW</td>
                <td className="py-2.5 font-semibold text-ink-900">{model.fastChargeMin} min</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">{t("readHeading")}</h2>
      <p className="mt-3 text-ink-600">{t("readBody")}</p>

      <div className="mt-8 rounded-2xl border border-line bg-card p-6">
        <p className="text-ink-600">{t("mapCtaNote")}</p>
        <Link
          href={{ pathname: "/", hash: "carte" }}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-forest-950 transition hover:bg-lime-300"
        >
          {t("mapCta")}
        </Link>
      </div>

      <p className="mt-10 text-xs text-ink-400">{t("sourceNote")}</p>
    </article>
  );
}
