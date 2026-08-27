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
        checked ? "bg-lime-300" : "bg-cream/15"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-cream shadow-sm transition-transform ${
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
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (!bannerOpen) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t("title")}
      className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-3xl border-t border-cream/10 bg-forest-950 text-cream shadow-[0_-12px_30px_rgba(12,31,21,0.35)] sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-sm sm:rounded-3xl sm:border sm:shadow-2xl"
    >
      <div className="grain relative px-6 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:px-7 sm:py-7">
        <div className="flex items-start gap-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream/10 text-lime-300">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
              <path
                d="M12 3c-.8 1.6-2.6 2.2-4 1.2-.3 1.7-1.8 2.9-3.5 2.6C3.6 8.4 3 10.1 3 12c0 5 4 9 9 9s9-4 9-9c0-1-.2-2-.5-2.9-1.6.3-3.1-.9-3-2.6-1.5.3-3-.7-3.2-2.2C13.6 3.5 12.9 3.1 12 3Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <circle cx="9.5" cy="12" r="1" fill="currentColor" />
              <circle cx="13.5" cy="15" r="1" fill="currentColor" />
              <circle cx="14.5" cy="10.5" r="1" fill="currentColor" />
              <circle cx="10" cy="16" r="1" fill="currentColor" />
            </svg>
          </span>
          <p className="pt-1.5 font-display text-lg font-semibold leading-tight text-cream">{t("title")}</p>
        </div>

        {detailsOpen ? (
          <div className="mt-5 divide-y divide-cream/10 border-y border-cream/10">
            <div className="flex items-start justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-cream">{t("essentialTitle")}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-cream/50">{t("essentialBody")}</p>
              </div>
              <span className="mt-0.5 shrink-0 rounded-full bg-cream/10 px-2.5 py-1 text-[11px] font-semibold text-cream/60">
                {t("alwaysActive")}
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-cream">{t("analyticsTitle")}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-cream/50">{t("analyticsBody")}</p>
              </div>
              <Toggle checked={analyticsEnabled} onChange={setAnalyticsEnabled} label={t("analyticsTitle")} />
            </div>
          </div>
        ) : (
          <p className="mt-3 text-[13px] leading-relaxed text-cream/60">
            {t("body")}{" "}
            <button
              type="button"
              onClick={() => setDetailsOpen(true)}
              className="font-semibold text-lime-300 underline-offset-2 hover:underline"
            >
              {t("customize")}
            </button>
          </p>
        )}

        <div className="mt-6 flex items-center gap-2.5">
          <button
            type="button"
            onClick={detailsOpen ? () => savePreferences(analyticsEnabled) : acceptAll}
            className="flex-1 rounded-full bg-lime-300 px-5 py-2.5 text-sm font-semibold text-forest-950 transition hover:bg-lime-400"
          >
            {detailsOpen ? t("save") : t("accept")}
          </button>
          <button
            type="button"
            onClick={rejectAll}
            className="flex-1 rounded-full border border-cream/20 px-5 py-2.5 text-sm font-semibold text-cream transition hover:border-cream/40"
          >
            {t("reject")}
          </button>
        </div>
      </div>
    </div>
  );
}
