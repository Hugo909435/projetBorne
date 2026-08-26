import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function GuideTeaser({
  namespace = "GuideTeaser",
  href = "/blog/types-de-bornes-electriques",
  image = "/blog/types-de-bornes-electriques.jpg",
}: {
  namespace?: "GuideTeaser" | "CarGuideTeaser";
  href?: string;
  image?: string;
}) {
  const t = useTranslations(namespace);

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <div className="grid items-center gap-8 rounded-[28px] border border-line bg-card p-8 md:grid-cols-[auto_1fr_auto] md:p-12">
        <Image
          src={image}
          alt={t("title")}
          width={220}
          height={220}
          className="h-40 w-full rounded-2xl object-cover md:h-32 md:w-48"
        />
        <div className="max-w-xl">
          <p className="mb-3 border-l-[3px] border-green-500 pl-3 text-sm font-semibold text-green-700">
            {t("eyebrow")}
          </p>
          <h2 className="text-2xl font-semibold text-ink-900 md:text-3xl">{t("title")}</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-600 md:text-base">{t("body")}</p>
        </div>
        <Link
          href={href}
          className="whitespace-nowrap rounded-full bg-forest-900 px-6 py-3 text-sm font-semibold text-lime-300 transition hover:bg-forest-800"
        >
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}
