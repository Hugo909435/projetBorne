import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { site, languageAlternates, localePath } from "@/lib/site";
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
  const tNav = await getTranslations({ locale, namespace: "Nav" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: t("title"),
    url: `${site.url}/${locale}/contact`,
    inLanguage: locale,
    mainEntity: {
      "@type": "Organization",
      name: site.shortName,
      url: site.url,
      contactPoint: { "@type": "ContactPoint", email: site.email, contactType: "customer support" },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tNav("home"), item: `${site.url}/${locale}` },
      { "@type": "ListItem", position: 2, name: t("title"), item: `${site.url}/${locale}/contact` },
    ],
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">{t("title")}</h1>
      <p className="mt-4 leading-relaxed text-ink-600">{t("body")}</p>

      <ContactForm />
    </div>
  );
}
