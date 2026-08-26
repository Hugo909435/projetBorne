"use client";

import { useTranslations } from "next-intl";
import { useCookieConsent } from "./CookieConsentContext";

export default function CookieFloatingButton() {
  const t = useTranslations("Footer");
  const { floatingVisible, openPreferences } = useCookieConsent();

  if (!floatingVisible) return null;

  return (
    <button
      type="button"
      onClick={openPreferences}
      aria-label={t("cookieSettingsLink")}
      title={t("cookieSettingsLink")}
      className="fixed bottom-5 left-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-forest-950 text-lime-300 shadow-[0_8px_20px_rgba(12,31,21,0.35)] transition hover:bg-forest-800"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
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
    </button>
  );
}
