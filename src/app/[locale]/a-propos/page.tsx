import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site, languageAlternates, localePath } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: t("aproposTitle"),
    description: t("aproposDescription"),
    alternates: { canonical: `/${locale}/a-propos`, languages: languageAlternates("/a-propos") },
    openGraph: { url: localePath(locale, "/a-propos") },
  };
}

export default async function AProposPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "AProposPage" });
  const tMeta = await getTranslations({ locale, namespace: "Meta" });

  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <p className="mb-3 border-l-[3px] border-green-500 pl-3 text-sm font-semibold text-green-700">
        {tMeta("aproposTitle")}
      </p>
      <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">{t("title")}</h1>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink-900">{t("missionHeading")}</h2>
      <div className="mt-3 space-y-4 leading-relaxed text-ink-600">
        <p>{t("missionP1")}</p>
        <p>{t("missionP2")}</p>
      </div>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink-900">{t("coverageHeading")}</h2>
      <p className="mt-3 leading-relaxed text-ink-600">{t("coverageIntro")}</p>
      <ul className="mt-3 space-y-2 text-ink-600">
        <li>
          <strong className="text-ink-900">{t("coverage1Lead")}</strong> {t("coverage1Body")}
        </li>
        <li>
          <strong className="text-ink-900">{t("coverage2Lead")}</strong> {t("coverage2Body")}
        </li>
      </ul>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink-900">{t("engagementHeading")}</h2>
      <div className="mt-3 space-y-4 leading-relaxed text-ink-600">
        <p>
          {t.rich("engagementP1", {
            ocm: (chunks) => (
              <a href="https://openchargemap.org" className="underline text-green-700">
                {chunks}
              </a>
            ),
            osm: (chunks) => (
              <a href="https://www.openstreetmap.org/copyright" className="underline text-green-700">
                {chunks}
              </a>
            ),
          })}
        </p>
        <p>{t("engagementP2")}</p>
      </div>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink-900">{t("whoHeading")}</h2>
      <p className="mt-3 leading-relaxed text-ink-600">{t("whoBody")}</p>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink-900">{t("seoHeading")}</h2>
      <div className="mt-3 space-y-4 leading-relaxed text-ink-600">
        <p>{t("seoP1")}</p>
        <p>
          {t.rich("seoP2", {
            link: (chunks) => (
              <Link
                href="/blog/types-de-bornes-electriques"
                className="font-semibold text-green-700 underline"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink-900">{t("contactHeading")}</h2>
      <div className="mt-3 space-y-4 leading-relaxed text-ink-600">
        <p>
          {t.rich("contactP1", {
            link: (chunks) => (
              <Link href="/contact" className="font-semibold text-green-700 underline">
                {chunks}
              </Link>
            ),
          })}
        </p>
        <p>{t("contactP2")}</p>
      </div>

      <a
        href={`mailto:${site.email}`}
        className="mt-8 inline-block font-semibold text-green-700 underline decoration-green-500/40 underline-offset-4"
      >
        {site.email}
      </a>
    </div>
  );
}
