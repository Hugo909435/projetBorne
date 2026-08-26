import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { languageAlternates, localePath } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: t("confidentialiteTitle"),
    description: t("confidentialiteDescription"),
    alternates: {
      canonical: `/${locale}/politique-de-confidentialite`,
      languages: languageAlternates("/politique-de-confidentialite"),
    },
    openGraph: { url: localePath(locale, "/politique-de-confidentialite") },
  };
}

export default async function ConfidentialitePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "ConfidentialitePage" });

  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <p className="mb-3 border-l-[3px] border-green-500 pl-3 text-sm font-semibold text-green-700">
        {t("title")}
      </p>
      <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">{t("title")}</h1>
      <p className="mt-3 text-sm text-ink-400">{t("updated")}</p>
      <p className="mt-6 leading-relaxed text-ink-600">{t("intro")}</p>

      <div className="mt-8 space-y-8 leading-relaxed text-ink-600">
        <section>
          <h2 className="font-display text-xl font-semibold text-ink-900">{t("controllerHeading")}</h2>
          <p className="mt-3">{t("controllerBody")}</p>
          <p className="mt-1">{t("controllerContact")}</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink-900">{t("dataHeading")}</h2>
          <p className="mt-3">{t("dataIntro")}</p>

          <h3 className="mt-4 font-semibold text-ink-900">{t("dataFormHeading")}</h3>
          <p className="mt-2">{t("dataFormBody1")}</p>
          <p className="mt-2 text-sm">{t("dataFormLegal")}</p>

          <h3 className="mt-4 font-semibold text-ink-900">{t("dataAnalyticsHeading")}</h3>
          <p className="mt-2">{t("dataAnalyticsBody")}</p>
          <p className="mt-2 text-sm">{t("dataAnalyticsLegal")}</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink-900">{t("purposeHeading")}</h2>
          <p className="mt-3">{t("purposeIntro")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>{t("purpose1")}</li>
            <li>{t("purpose2")}</li>
            <li>{t("purpose3")}</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink-900">{t("retentionHeading")}</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>{t("retention1")}</li>
            <li>{t("retention2")}</li>
            <li>{t("retention3")}</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink-900">{t("recipientsHeading")}</h2>
          <p className="mt-3">{t("recipientsBody")}</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink-900">{t("rightsHeading")}</h2>
          <p className="mt-3">{t("rightsIntro")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>{t("right1")}</li>
            <li>{t("right2")}</li>
            <li>{t("right3")}</li>
            <li>{t("right4")}</li>
            <li>{t("right5")}</li>
            <li>{t("right6")}</li>
            <li>{t("right7")}</li>
          </ul>
          <p className="mt-3">
            {t.rich("rightsExercise", {
              link: (chunks) => (
                <Link href="/contact" className="font-semibold text-green-700 underline">
                  {chunks}
                </Link>
              ),
            })}
          </p>
          <p className="mt-3">{t("rightsCnil")}</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink-900">{t("securityHeading")}</h2>
          <p className="mt-3">{t("securityBody")}</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink-900">{t("cookiesHeading")}</h2>
          <p className="mt-3">{t("cookiesIntro")}</p>

          <h3 className="mt-4 font-semibold text-ink-900">{t("cookiesEssentialHeading")}</h3>
          <p className="mt-2">{t("cookiesEssentialIntro")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>{t("cookieEssential1")}</li>
          </ul>

          <h3 className="mt-4 font-semibold text-ink-900">{t("cookiesAnalyticsHeading")}</h3>
          <p className="mt-2">{t("cookiesAnalyticsIntro")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>{t("cookieAnalytics1")}</li>
            <li>{t("cookieAnalytics2")}</li>
            <li>{t("cookieAnalytics3")}</li>
          </ul>
          <p className="mt-2 text-sm">{t("cookiesFootnote")}</p>

          <p className="mt-4">{t("cookiesPreferences")}</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink-900">{t("changesHeading")}</h2>
          <p className="mt-3">{t("changesBody")}</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink-900">{t("contactHeading")}</h2>
          <p className="mt-3">
            {t.rich("contactBody", {
              link: (chunks) => (
                <Link href="/contact" className="font-semibold text-green-700 underline">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </section>
      </div>
    </div>
  );
}
