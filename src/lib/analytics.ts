export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/** Matches the key read by the inline consent-default script in GoogleAnalytics.tsx. */
export const CONSENT_STORAGE_KEY = "cookie-consent-v1";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function updateAnalyticsConsent(analytics: boolean) {
  window.gtag?.("consent", "update", {
    analytics_storage: analytics ? "granted" : "denied",
  });
}
