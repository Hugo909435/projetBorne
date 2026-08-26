"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCookieConsent } from "./CookieConsentContext";

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-lime-300" : "bg-cream/20"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-cream transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function CookieConsentBanner() {
  const t = useTranslations("CookieConsent");
  const { bannerOpen, choice, acceptAll, rejectAll, savePreferences } = useCookieConsent();
  const [analyticsEnabled, setAnalyticsEnabled] = useState(choice === true);

  if (!bannerOpen) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t("title")}
      className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto bg-forest-950 text-cream shadow-[0_-12px_28px_rgba(12,31,21,0.25)]"
    >
      <div className="mx-auto max-w-3xl px-5 py-6">
        <p className="font-display text-lg font-semibold text-lime-300">{t("title")}</p>

        <div className="mt-4 space-y-3">
          <div className="rounded-2xl border border-cream/15 p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="font-semibold">{t("essentialTitle")}</p>
              <span className="shrink-0 rounded-full bg-cream/10 px-3 py-1 text-xs font-semibold text-cream/70">
                {t("alwaysActive")}
              </span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-cream/60">{t("essentialBody")}</p>
          </div>

          <div className="rounded-2xl border border-cream/15 p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="font-semibold">{t("analyticsTitle")}</p>
              <Toggle checked={analyticsEnabled} onChange={setAnalyticsEnabled} label={t("analyticsTitle")} />
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-cream/60">{t("analyticsBody")}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={rejectAll}
            className="rounded-full border border-cream/30 px-5 py-2.5 text-sm font-semibold text-cream hover:border-cream/60"
          >
            {t("reject")}
          </button>
          <button
            type="button"
            onClick={() => savePreferences(analyticsEnabled)}
            className="rounded-full border border-cream/30 px-5 py-2.5 text-sm font-semibold text-cream hover:border-cream/60"
          >
            {t("save")}
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="rounded-full bg-lime-300 px-5 py-2.5 text-sm font-semibold text-forest-950 hover:bg-lime-400"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
