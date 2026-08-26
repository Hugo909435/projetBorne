import { useTranslations } from "next-intl";

export default function Faq() {
  const t = useTranslations("Faq");
  const faqs = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
    { q: t("q5"), a: t("a5") },
  ];

  return (
    <section className="mx-auto max-w-3xl px-5 py-0">
      <p className="mb-3 border-l-[3px] border-green-500 pl-3 text-sm font-semibold text-green-700">
        {t("eyebrow")}
      </p>
      <h2 className="text-3xl font-semibold text-ink-900">{t("title")}</h2>

      <div className="mt-8 divide-y divide-line border-t border-line">
        {faqs.map((item) => (
          <details key={item.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-ink-900">
              {item.q}
              <span className="shrink-0 text-lg text-green-600 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
