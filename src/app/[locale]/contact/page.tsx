import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { languageAlternates, localePath } from "@/lib/site";
import ContactForm from "@/components/ContactForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: t("contactTitle"),
    description: t("contactDescription"),
    alternates: { canonical: `/${locale}/contact`, languages: languageAlternates("/contact") },
    openGraph: { url: localePath(locale, "/contact") },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "ContactPage" });

  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">{t("title")}</h1>
      <p className="mt-4 leading-relaxed text-ink-600">{t("body")}</p>

      <ContactForm />
    </div>
  );
}
