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
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-lime-300" : "bg-cream/20"
      }`}
    >
      <span
        className={`inline-block h-3 w-3 transform rounded-full bg-cream transition-transform ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function CookieConsentBanner() {
  const t = useTranslations("CookieConsent");
  const { bannerOpen, choice, acceptAll, rejectAll, savePreferences } = useCookieConsent();
  const [analyticsEnabled, setAnalyticsEnabled] = useState(choice === true);
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (!bannerOpen) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t("title")}
      className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto bg-forest-950 text-cream shadow-[0_-8px_20px_rgba(12,31,21,0.25)] sm:inset-x-auto sm:bottom-4 sm:right-4 sm:max-w-xs sm:rounded-2xl sm:border sm:border-cream/15"
    >
      <div className="px-4 py-3">
        <p className="text-sm leading-snug text-cream/80">{t("title")}</p>

        {detailsOpen && (
          <div className="mt-3 space-y-2">
            <div className="rounded-xl border border-cream/15 px-3 py-2">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold">{t("essentialTitle")}</p>
                <span className="shrink-0 rounded-full bg-cream/10 px-2 py-0.5 text-[10px] font-semibold text-cream/70">
                  {t("alwaysActive")}
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-snug text-cream/50">{t("essentialBody")}</p>
            </div>
            <div className="rounded-xl border border-cream/15 px-3 py-2">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold">{t("analyticsTitle")}</p>
                <Toggle checked={analyticsEnabled} onChange={setAnalyticsEnabled} label={t("analyticsTitle")} />
              </div>
              <p className="mt-1 text-[11px] leading-snug text-cream/50">{t("analyticsBody")}</p>
            </div>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setDetailsOpen((open) => !open)}
            className="text-xs font-semibold text-cream/60 underline-offset-2 hover:text-cream hover:underline"
          >
            {t("customize")}
          </button>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={rejectAll}
              className="rounded-full border border-cream/30 px-3 py-1.5 text-xs font-semibold text-cream hover:border-cream/60"
            >
              {t("reject")}
            </button>
            {detailsOpen && (
              <button
                type="button"
                onClick={() => savePreferences(analyticsEnabled)}
                className="rounded-full border border-cream/30 px-3 py-1.5 text-xs font-semibold text-cream hover:border-cream/60"
              >
                {t("save")}
              </button>
            )}
            <button
              type="button"
              onClick={acceptAll}
              className="rounded-full bg-lime-300 px-3 py-1.5 text-xs font-semibold text-forest-950 hover:bg-lime-400"
            >
              {t("accept")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
