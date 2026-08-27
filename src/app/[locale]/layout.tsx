import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "../GoogleAnalytics";
import { CookieConsentProvider } from "@/components/cookies/CookieConsentContext";
import CookieConsentBanner from "@/components/cookies/CookieConsentBanner";
import CookieFloatingButton from "@/components/cookies/CookieFloatingButton";
import { routing, type Locale } from "@/i18n/routing";
import { site, ogLocales, languageAlternates } from "@/lib/site";
import "../globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  const title = `${site.name} - ${t("homeTagline")}`;

  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: `%s - ${site.shortName}` },
    description: t("description"),
    alternates: { canonical: `/${locale}`, languages: languageAlternates("/") },
    openGraph: {
      type: "website",
      locale: ogLocales[locale] ?? "en_US",
      siteName: site.shortName,
      url: `${site.url}/${locale}`,
      title,
      description: t("description"),
    },
    twitter: {
      card: "summary_large_image",
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${fraunces.variable} ${jakarta.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-cream font-body text-ink-900 antialiased">
        <NextIntlClientProvider locale={locale}>
          <CookieConsentProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CookieConsentBanner />
            <CookieFloatingButton />
          </CookieConsentProvider>
        </NextIntlClientProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
