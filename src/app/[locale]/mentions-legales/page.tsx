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
    title: t("mentionsLegalesTitle"),
    description: t("mentionsLegalesDescription"),
    alternates: {
      canonical: `/${locale}/mentions-legales`,
      languages: languageAlternates("/mentions-legales"),
    },
    openGraph: { url: localePath(locale, "/mentions-legales") },
  };
}

export default async function MentionsLegalesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "MentionsLegalesPage" });

  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <p className="mb-3 border-l-[3px] border-green-500 pl-3 text-sm font-semibold text-green-700">
        {t("title")}
      </p>
      <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">{t("title")}</h1>
      <p className="mt-3 text-sm text-ink-400">{t("updated")}</p>

      <div className="mt-8 space-y-8 leading-relaxed text-ink-600">
        <section>
          <h2 className="font-display text-xl font-semibold text-ink-900">{t("editorHeading")}</h2>
          <p className="mt-3">{t("editorBody")}</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink-900">{t("publisherHeading")}</h2>
          <p className="mt-3">
            {t.rich("publisherBody", {
              linkedin: (chunks) => (
                <a
                  href="https://www.linkedin.com/in/hugo-beignon-3ab500366/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-green-700 underline"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
          <p className="mt-1">{t("publisherContact")}</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink-900">{t("hostHeading")}</h2>
          <p className="mt-3">{t("hostIntro")}</p>
          <p className="mt-1 font-medium text-ink-900">{t("hostName")}</p>
          <p>{t("hostAddress")}</p>
          <p>{t("hostWebsite")}</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink-900">{t("ipHeading")}</h2>
          <div className="mt-3 space-y-3">
            <p>{t("ipBody1")}</p>
            <p>{t("ipBody2")}</p>
            <p>{t("ipBody3")}</p>
            <p>{t("ipBody4")}</p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink-900">{t("linksHeading")}</h2>
          <p className="mt-3">{t("linksBody")}</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink-900">{t("liabilityHeading")}</h2>
          <p className="mt-3">{t("liabilityBody")}</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink-900">{t("dataHeading")}</h2>
          <p className="mt-3">
            {t.rich("dataBody", {
              link: (chunks) => (
                <Link href="/politique-de-confidentialite" className="font-semibold text-green-700 underline">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink-900">{t("cookiesHeading")}</h2>
          <p className="mt-3">
            {t.rich("cookiesBody", {
              link: (chunks) => (
                <Link href="/politique-de-confidentialite" className="font-semibold text-green-700 underline">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink-900">{t("lawHeading")}</h2>
          <p className="mt-3">{t("lawBody")}</p>
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
