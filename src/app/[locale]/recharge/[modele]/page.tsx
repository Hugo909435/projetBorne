import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site, languageAlternates } from "@/lib/site";
import {
  evModels,
  findEvModelBySlug,
  evModelFullName,
  acChargeMinutes,
  dcChargeMinutes,
  isCarLimited,
  kmPerTenMinutes,
  fastChargeKwh,
  fullChargeKwh,
  chargeCost,
  effectiveAcKw,
  AC_STATION_POWERS,
  DC_STATION_POWERS,
  type EvModel,
} from "@/lib/evModels";

/**
 * Price levels the cost table is worked out at.
 *
 * These are price *levels*, not any country's tariff: the site covers six
 * countries whose prices differ, and quoting one of them here would favour it
 * and go stale within months. The three levels bracket what a driver actually
 * meets (home overnight, public AC, public rapid), and the page says plainly
 * that they are assumptions.
 */
const PRICE_LEVELS = [0.2, 0.4, 0.59];

export async function generateStaticParams() {
  return evModels.map((m) => ({ modele: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; modele: string }>;
}): Promise<Metadata> {
  const { locale, modele } = await params;
  const model = findEvModelBySlug(modele);
  if (!model) notFound();

  const t = await getTranslations({ locale, namespace: "EvModelPage" });
  const path = `/recharge/${model.slug}`;
  const name = evModelFullName(model);

  return {
    title: t("metaTitle", { name }),
    description: t("metaDescription", {
      name,
      minutes: model.fastChargeMin,
      power: model.dcKw,
    }),
    alternates: { canonical: `/${locale}${path}`, languages: languageAlternates(path) },
    openGraph: { url: `${site.url}/${locale}${path}` },
  };
}

export default async function EvModelPage({
  params,
}: {
  params: Promise<{ locale: string; modele: string }>;
}) {
  const { locale, modele } = await params;
  const model = findEvModelBySlug(modele);
  if (!model) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "EvModelPage" });
  const tNav = await getTranslations({ locale, namespace: "Nav" });

  const name = evModelFullName(model);
  const path = `/recharge/${model.slug}`;
  const nf = new Intl.NumberFormat(locale);
  const cf = new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" });
  const num = (n: number) => nf.format(n);

  const fastKwh = fastChargeKwh(model);
  const fullKwh = fullChargeKwh(model);
  /** kWh needed for 100 km: Wh/km x 100, expressed in kWh. */
  const kwhPer100 = Math.round(model.consumptionWhKm) / 10;

  // Four other models to send the reader to, kept adjacent on DC power so the
  // suggestion is a real comparison rather than a random list.
  const related = evModels
    .filter((m) => m.slug !== model.slug)
    .sort((a, b) => Math.abs(a.dcKw - model.dcKw) - Math.abs(b.dcKw - model.dcKw))
    .slice(0, 4);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tNav("home"), item: `${site.url}/${locale}` },
      {
        "@type": "ListItem",
        position: 2,
        name: tNav("models"),
        item: `${site.url}/${locale}/recharge`,
      },
      { "@type": "ListItem", position: 3, name, item: `${site.url}/${locale}${path}` },
    ],
  };

  const vehicleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name,
    brand: { "@type": "Brand", name: model.brand },
    model: model.name,
    vehicleConfiguration: model.variant,
    fuelType: "Electric",
    vehicleEngine: { "@type": "EngineSpecification", fuelType: "Electric" },
    emissionsCO2: 0,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("faq1Question", { name }),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq1Answer", { name, minutes: model.fastChargeMin, power: model.dcKw }),
        },
      },
      {
        "@type": "Question",
        name: t("faq2Question", { name }),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq2Answer", {
            name,
            hours: Math.round((acChargeMinutes(model, 7.4) / 60) * 10) / 10,
            power: effectiveAcKw(model, 7.4),
          }),
        },
      },
      {
        "@type": "Question",
        name: t("faq3Question", { name }),
        acceptedAnswer: { "@type": "Answer", text: t("faq3Answer", { name }) },
      },
    ],
  };

  const mapHref = { pathname: "/", hash: "carte" };

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleJsonLd) }}
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
        <Link href="/recharge" className="hover:text-green-700">
          {tNav("models")}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-600">{name}</span>
      </nav>

      <p className="mb-3 border-l-[3px] border-green-500 pl-3 text-sm font-semibold text-green-700">
        {t("eyebrow")}
      </p>
      <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">{t("title", { name })}</h1>
      <p className="mt-2 text-sm text-ink-400">{t("variantLabel", { variant: model.variant })}</p>

      <p className="mt-4 text-ink-600">
        {t("intro", {
          name,
          battery: num(model.batteryKwh),
          range: num(model.wltpKm),
          power: num(model.dcKw),
          minutes: model.fastChargeMin,
        })}
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: t("specBattery"), value: `${num(model.batteryKwh)} kWh` },
          { label: t("specRange"), value: `${num(model.wltpKm)} km` },
          { label: t("specPeak"), value: `${num(model.dcKw)} kW` },
          { label: t("specFastCharge"), value: `${model.fastChargeMin} min` },
        ].map((spec) => (
          <div key={spec.label} className="rounded-xl border border-line bg-card p-4">
            <dt className="text-xs text-ink-400">{spec.label}</dt>
            <dd className="mt-1 text-lg font-semibold text-ink-900">{spec.value}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">{t("dcHeading")}</h2>
      <p className="mt-3 text-ink-600">
        {t("dcIntro", { name, power: num(model.dcKw), minutes: model.fastChargeMin })}
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-ink-400">
              <th scope="col" className="py-2 font-medium">
                {t("tableStation")}
              </th>
              <th scope="col" className="py-2 font-medium">
                {t("tableTime")}
              </th>
              <th scope="col" className="py-2 font-medium">
                {t("tableKm")}
              </th>
            </tr>
          </thead>
          <tbody>
            {DC_STATION_POWERS.map((kw) => {
              const limited = isCarLimited(model, kw);
              return (
                <tr key={kw} className="border-b border-line">
                  <td className="py-2 text-ink-600">{num(kw)} kW</td>
                  <td className="py-2 font-semibold text-ink-900">
                    {dcChargeMinutes(model, kw)} min
                    {limited && (
                      <span className="ml-2 text-xs font-normal text-ink-400">
                        {t("dcCarLimited")}
                      </span>
                    )}
                  </td>
                  <td className="py-2 text-ink-600">
                    {num(kmPerTenMinutes(model, kw, true))} km
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-ink-400">{t("dcNote", { power: num(model.dcKw) })}</p>

      <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">{t("acHeading")}</h2>
      <p className="mt-3 text-ink-600">{t("acIntro", { name, power: num(model.acKw) })}</p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-ink-400">
              <th scope="col" className="py-2 font-medium">
                {t("tableStation")}
              </th>
              <th scope="col" className="py-2 font-medium">
                {t("tableTimeFull")}
              </th>
              <th scope="col" className="py-2 font-medium">
                {t("tableKm")}
              </th>
            </tr>
          </thead>
          <tbody>
            {AC_STATION_POWERS.map((kw) => {
              const minutes = acChargeMinutes(model, kw);
              const capped = kw > model.acKw;
              return (
                <tr key={kw} className="border-b border-line">
                  <td className="py-2 text-ink-600">{num(kw)} kW</td>
                  <td className="py-2 font-semibold text-ink-900">
                    {Math.floor(minutes / 60)} h {String(minutes % 60).padStart(2, "0")}
                    {capped && (
                      <span className="ml-2 text-xs font-normal text-ink-400">
                        {t("acCapped", { power: num(model.acKw) })}
                      </span>
                    )}
                  </td>
                  <td className="py-2 text-ink-600">
                    {num(kmPerTenMinutes(model, kw, false))} km
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {model.acKwOptional && (
        <p className="mt-3 text-sm text-ink-400">
          {t("acOptionalNote", { power: num(model.acKwOptional) })}
        </p>
      )}

      <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">
        {t("connectorsHeading")}
      </h2>
      <p className="mt-3 text-ink-600">
        {t("connectorsBody", { name, ac: model.acConnector, dc: model.dcConnector })}
      </p>
      <p className="mt-3 text-ink-600">
        <Link
          href="/blog/types-de-bornes-electriques"
          className="font-semibold text-green-700 underline"
        >
          {t("connectorsLink")}
        </Link>
      </p>

      <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">{t("costHeading")}</h2>
      <p className="mt-3 text-ink-600">
        {t("costIntro", { name, fastKwh: num(fastKwh), fullKwh: num(fullKwh) })}
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-ink-400">
              <th scope="col" className="py-2 font-medium">
                {t("tablePrice")}
              </th>
              <th scope="col" className="py-2 font-medium">
                {t("tableCostFull")}
              </th>
              <th scope="col" className="py-2 font-medium">
                {t("tableCostFast")}
              </th>
              <th scope="col" className="py-2 font-medium">
                {t("tableCost100")}
              </th>
            </tr>
          </thead>
          <tbody>
            {PRICE_LEVELS.map((price) => (
              <tr key={price} className="border-b border-line">
                <td className="py-2 text-ink-600">{cf.format(price)} / kWh</td>
                <td className="py-2 font-semibold text-ink-900">
                  {cf.format(chargeCost(fullKwh, price))}
                </td>
                <td className="py-2 text-ink-600">{cf.format(chargeCost(fastKwh, price))}</td>
                <td className="py-2 text-ink-600">
                  {cf.format(chargeCost(kwhPer100, price))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-ink-400">
        {t("costNote")}{" "}
        <Link href="/blog/cout-recharge-voiture-electrique" className="underline">
          {t("costLink")}
        </Link>
      </p>

      <div className="mt-8 rounded-2xl border border-line bg-card p-6">
        <p className="text-ink-600">{t("mapCtaNote", { dc: model.dcConnector })}</p>
        <Link
          href={mapHref}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-forest-950 transition hover:bg-lime-300"
        >
          {t("mapCta")}
        </Link>
      </div>

      <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">{t("faqHeading")}</h2>

      <details className="mt-3 rounded-xl border border-line p-4">
        <summary className="cursor-pointer font-semibold text-ink-900">
          {t("faq1Question", { name })}
        </summary>
        <p className="mt-2 text-ink-600">
          {t("faq1Answer", { name, minutes: model.fastChargeMin, power: num(model.dcKw) })}
        </p>
      </details>

      <details className="mt-3 rounded-xl border border-line p-4">
        <summary className="cursor-pointer font-semibold text-ink-900">
          {t("faq2Question", { name })}
        </summary>
        <p className="mt-2 text-ink-600">
          {t("faq2Answer", {
            name,
            hours: nf.format(Math.round((acChargeMinutes(model, 7.4) / 60) * 10) / 10),
            power: num(effectiveAcKw(model, 7.4)),
          })}
        </p>
      </details>

      <details className="mt-3 rounded-xl border border-line p-4">
        <summary className="cursor-pointer font-semibold text-ink-900">
          {t("faq3Question", { name })}
        </summary>
        <p className="mt-2 text-ink-600">{t("faq3Answer", { name })}</p>
      </details>

      <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">
        {t("methodHeading")}
      </h2>
      <p className="mt-3 text-sm text-ink-600">{t("methodBody")}</p>

      <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">
        {t("relatedHeading")}
      </h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {related.map((other: EvModel) => (
          <li key={other.slug}>
            <Link
              href={`/recharge/${other.slug}`}
              className="flex items-center justify-between rounded-xl border border-line p-3 text-sm transition hover:border-green-500"
            >
              <span className="font-semibold text-ink-900">{evModelFullName(other)}</span>
              <span className="text-ink-400">{num(other.dcKw)} kW</span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-xs text-ink-400">
        {t("sourceNote")}{" "}
        <a href={model.sourceUrl} className="underline" target="_blank" rel="noopener noreferrer">
          EV Database
        </a>
      </p>

      <Link href="/recharge" className="mt-2 inline-block text-sm font-semibold text-green-700 underline">
        {t("backToIndex")}
      </Link>
    </article>
  );
}
