"use client";

import { useTranslations } from "next-intl";
import { useCookieConsent } from "./CookieConsentContext";

export default function CookieSettingsLink({ className }: { className?: string }) {
  const t = useTranslations("Footer");
  const { openPreferences } = useCookieConsent();

  return (
    <button type="button" onClick={openPreferences} className={className}>
      {t("cookieSettingsLink")}
    </button>
  );
}
