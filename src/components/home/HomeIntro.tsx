import { useTranslations } from "next-intl";

export default function HomeIntro() {
  const t = useTranslations("HomeIntro");

  return (
    <section className="mx-auto max-w-6xl px-5 py-0">
      <div className="max-w-lg">
        <p className="mb-3 border-l-[3px] border-green-500 pl-3 text-sm font-semibold text-green-700">
          {t("eyebrow")}
        </p>
        <h2 className="text-3xl font-semibold text-ink-900">{t("title")}</h2>
      </div>

      <div className="mt-10 grid gap-8 border-t border-line pt-10 md:grid-cols-2">
        <p className="text-sm leading-relaxed text-ink-600">{t("body1")}</p>
        <p className="text-sm leading-relaxed text-ink-600">{t("body2")}</p>
      </div>
    </section>
  );
}
