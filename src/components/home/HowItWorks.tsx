import { useTranslations } from "next-intl";

export default function HowItWorks() {
  const t = useTranslations("HowItWorks");
  const steps = [
    { n: "01", title: t("step1Title"), body: t("step1Body") },
    { n: "02", title: t("step2Title"), body: t("step2Body") },
    { n: "03", title: t("step3Title"), body: t("step3Body") },
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 pt-8 pb-0 md:pt-12">
      <div className="max-w-lg">
        <p className="mb-3 border-l-[3px] border-green-500 pl-3 text-sm font-semibold text-green-700">
          {t("eyebrow")}
        </p>
        <h2 className="text-3xl font-semibold text-ink-900">{t("title")}</h2>
      </div>

      <div className="mt-10 grid gap-8 border-t border-line pt-10 md:grid-cols-3">
        {steps.map((step) => (
          <div key={step.n}>
            <span className="font-display text-3xl font-medium text-lime-400" style={{ WebkitTextStroke: "1px var(--forest-900)" }}>
              {step.n}
            </span>
            <h3 className="mt-3 text-lg font-semibold text-ink-900">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
