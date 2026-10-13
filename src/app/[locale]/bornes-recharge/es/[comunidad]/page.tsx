import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { spanishRegions, findRegionBySlug } from "@/lib/regions";
import { OcmRegionPage, ocmRegionMetadata } from "@/components/regions/OcmRegionPage";

export async function generateStaticParams() {
  return spanishRegions.map((r) => ({ comunidad: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; comunidad: string }>;
}): Promise<Metadata> {
  const { locale, comunidad } = await params;
  const region = findRegionBySlug("es", comunidad);
  if (!region) notFound();
  return ocmRegionMetadata(locale, "es", region);
}

export default async function SpainRegionPage({
  params,
}: {
  params: Promise<{ locale: string; comunidad: string }>;
}) {
  const { locale, comunidad } = await params;
  const region = findRegionBySlug("es", comunidad);
  if (!region) notFound();
  setRequestLocale(locale);

  return <OcmRegionPage locale={locale} country="es" region={region} />;
}
