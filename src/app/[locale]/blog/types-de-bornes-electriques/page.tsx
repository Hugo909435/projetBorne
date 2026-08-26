import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site, languageAlternates, author, byLabel } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

const FAQ_HEADING: Record<Locale, string> = {
  fr: "Questions fréquentes",
  en: "Frequently asked questions",
  de: "Häufig gestellte Fragen",
  es: "Preguntas frecuentes",
};

const HERO_IMAGE = {
  src: "/blog/types-de-bornes-electriques.jpg",
  credit: {
    name: "Danilo Bargen",
    url: "https://commons.wikimedia.org/wiki/File:CCS_(Type2_Combo)_Charging_Plug_Side_VIew.jpg",
    license: "CC BY-SA 4.0",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: t("connectorGuideTitle"),
    description: t("connectorGuideDescription"),
    alternates: {
      canonical: `/${locale}/blog/types-de-bornes-electriques`,
      languages: languageAlternates("/blog/types-de-bornes-electriques"),
    },
    openGraph: {
      url: `${site.url}/${locale}/blog/types-de-bornes-electriques`,
      images: [`${site.url}${HERO_IMAGE.src}`],
    },
  };
}

export default async function ConnectorGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "ConnectorGuide" });
  const tNav = await getTranslations({ locale, namespace: "Nav" });

  const rawT = t as unknown as (key: string) => string;
  const connectors = [1, 2, 3, 4].map((i) => ({
    name: rawT(`connector${i}Name`),
    power: rawT(`connector${i}Power`),
    usage: rawT(`connector${i}Usage`),
    time: rawT(`connector${i}Time`),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t("title"),
    description: t("intro"),
    author: { "@type": "Person", name: author.name, url: author.url },
    publisher: { "@type": "Organization", name: site.shortName },
    mainEntityOfPage: `${site.url}/${locale}/blog/types-de-bornes-electriques`,
    inLanguage: locale,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [1, 2, 3, 4].map((i) => ({
      "@type": "Question",
      name: t(`faq${i}Q`),
      acceptedAnswer: { "@type": "Answer", text: t(`faq${i}A`) },
    })),
  };

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
        <Link href="/blog" className="hover:text-green-700">
          {tNav("blog")}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-600">{t("breadcrumb")}</span>
      </nav>

      <Image
        src={HERO_IMAGE.src}
        alt={t("imageAlt")}
        width={1200}
        height={675}
        className="mt-2 w-full rounded-2xl object-cover"
      />
      <p className="mt-2 text-xs text-ink-400">
        Photo:{" "}
        <a
          href={HERO_IMAGE.credit.url}
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {HERO_IMAGE.credit.name}
        </a>{" "}
        ({HERO_IMAGE.credit.license})
      </p>

      <p className="mb-3 mt-6 border-l-[3px] border-green-500 pl-3 text-sm font-semibold text-green-700">
        {t("eyebrow")}
      </p>
      <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">{t("title")}</h1>
      <p className="mt-3 text-sm text-ink-400">
        {byLabel[locale as Locale]} {author.name}, {author.role[locale as Locale]}
      </p>
      <p className="mt-4 text-ink-600">{t("intro")}</p>

      <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">{t("acDcHeading")}</h2>
      <p className="mt-3 leading-relaxed text-ink-600">{t("acDcBody")}</p>

      <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">
        {t("comparisonHeading")}
      </h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="bg-sand-200 text-left">
              <th className="px-4 py-3 font-semibold text-ink-900">{t("tableConnector")}</th>
              <th className="px-4 py-3 font-semibold text-ink-900">{t("tablePower")}</th>
              <th className="px-4 py-3 font-semibold text-ink-900">{t("tableUsage")}</th>
              <th className="px-4 py-3 font-semibold text-ink-900">{t("tableTime")}</th>
            </tr>
          </thead>
          <tbody>
            {connectors.map((c) => (
              <tr key={c.name} className="border-t border-line">
                <td className="px-4 py-3 font-medium text-ink-900">{c.name}</td>
                <td className="px-4 py-3 text-ink-600">{c.power}</td>
                <td className="px-4 py-3 text-ink-600">{c.usage}</td>
                <td className="px-4 py-3 text-ink-600">{c.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-ink-400">{t("tableFootnote")}</p>

      <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">{t("chooseHeading")}</h2>
      <ul className="mt-3 space-y-2 text-ink-600">
        <li>
          <strong className="text-ink-900">{t("choose1Lead")}</strong> {t("choose1Body")}
        </li>
        <li>
          <strong className="text-ink-900">{t("choose2Lead")}</strong> {t("choose2Body")}
        </li>
        <li>
          <strong className="text-ink-900">{t("choose3Lead")}</strong> {t("choose3Body")}
        </li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">
        {t("homeChargingHeading")}
      </h2>
      <p className="mt-3 leading-relaxed text-ink-600">{t("homeChargingBody")}</p>

      <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">{t("costHeading")}</h2>
      <p className="mt-3 leading-relaxed text-ink-600">{t("costBody")}</p>

      <p className="mt-6 text-sm text-ink-600">
        {t.rich("relatedGuideBox", {
          link: (chunks) => (
            <Link href="/blog/voiture-electrique" className="font-semibold text-green-700 underline">
              {chunks}
            </Link>
          ),
        })}
      </p>

      <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">
        {FAQ_HEADING[locale as Locale]}
      </h2>
      {[1, 2, 3, 4].map((i) => (
        <details key={i} className="mt-3 rounded-xl border border-line p-4">
          <summary className="cursor-pointer font-semibold text-ink-900">{t(`faq${i}Q`)}</summary>
          <p className="mt-2 text-ink-600">{t(`faq${i}A`)}</p>
        </details>
      ))}

      <div className="mt-10 rounded-2xl border border-line bg-card p-6">
        <p className="text-sm text-ink-600">
          {t.rich("ctaBox", {
            link: (chunks) => (
              <Link href="/#carte" className="font-semibold text-green-700 underline">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>

      <div className="mt-10 flex items-start gap-4 rounded-2xl border border-line bg-card p-6">
        <Image
          src={author.photo}
          alt={author.name}
          width={64}
          height={64}
          className="h-16 w-16 shrink-0 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-ink-900">{author.name}</p>
          <p className="text-sm text-ink-400">{author.role[locale as Locale]}</p>
          <p className="mt-2 text-sm text-ink-600">{author.bio[locale as Locale]}</p>
          <a
            href={author.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="mt-2 inline-flex text-green-700 hover:text-green-800"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}
