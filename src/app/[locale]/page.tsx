import { getTranslations, setRequestLocale } from "next-intl/server";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import HomeIntro from "@/components/home/HomeIntro";
import GuideTeaser from "@/components/home/GuideTeaser";
import Faq from "@/components/home/Faq";
import MapSection from "@/components/home/MapSection";
import { site, author, organizationLogo } from "@/lib/site";

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ lat?: string; lon?: string }>;
}) {
  const { locale } = await params;
  const { lat, lon } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Meta" });

  const parsedLat = lat ? Number(lat) : null;
  const parsedLon = lon ? Number(lon) : null;
  const hasTarget =
    parsedLat != null && parsedLon != null && Number.isFinite(parsedLat) && Number.isFinite(parsedLon);

  const center: [number, number] = hasTarget ? [parsedLat!, parsedLon!] : [46.7, 2.5];
  const zoom = hasTarget ? 12 : 6;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: site.shortName,
        url: site.url,
        email: site.email,
        logo: organizationLogo,
        description: t("description"),
        sameAs: [author.linkedin, site.facebook],
        founder: { "@type": "Person", name: author.name, url: author.url, sameAs: [author.linkedin] },
      },
      {
        "@type": "WebSite",
        name: site.shortName,
        url: site.url,
        description: t("description"),
        inLanguage: locale,
      },
      {
        "@type": "WebApplication",
        name: site.shortName,
        url: `${site.url}/${locale}#carte`,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any (web-based)",
        description: t("description"),
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />

      <section id="carte" className="mx-auto max-w-6xl scroll-mt-20 px-5 pb-4">
        <MapSection center={center} zoom={zoom} hasTarget={hasTarget} />
      </section>

      <HowItWorks />
      <GuideTeaser
        namespace="CarGuideTeaser"
        href="/blog/voiture-electrique"
        image="/blog/voiture-electrique.jpg"
      />
      <HomeIntro />
      <GuideTeaser />
      <Faq />
    </>
  );
}
