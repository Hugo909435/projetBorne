import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ukRegions, findRegionBySlug } from "@/lib/regions";
import { OcmRegionPage, ocmRegionMetadata } from "@/components/regions/OcmRegionPage";

export async function generateStaticParams() {
  return ukRegions.map((r) => ({ region: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; region: string }>;
}): Promise<Metadata> {
  const { locale, region: slug } = await params;
  const region = findRegionBySlug("gb", slug);
  if (!region) notFound();
  return ocmRegionMetadata(locale, "gb", region);
}

export default async function UKRegionPage({
  params,
}: {
  params: Promise<{ locale: string; region: string }>;
}) {
  const { locale, region: slug } = await params;
  const region = findRegionBySlug("gb", slug);
  if (!region) notFound();
  setRequestLocale(locale);

  return <OcmRegionPage locale={locale} country="gb" region={region} />;
}
