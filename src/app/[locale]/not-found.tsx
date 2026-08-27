import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NotFoundPage");
  return { title: t("metaTitle") };
}

export default async function NotFound() {
  const t = await getTranslations("NotFoundPage");

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-24 text-center sm:py-32">
      <p className="mb-3 border-l-[3px] border-green-500 pl-3 text-sm font-semibold text-green-700">
        {t("eyebrow")}
      </p>
      <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-4 leading-relaxed text-ink-600">{t("body")}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-forest-950 transition hover:bg-lime-300"
        >
          {t("ctaHome")}
        </Link>
        <Link
          href="/blog"
          className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink-900 transition hover:bg-sand-200"
        >
          {t("ctaBlog")}
        </Link>
      </div>
    </div>
  );
}
