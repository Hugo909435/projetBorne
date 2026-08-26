import Script from "next/script";
import { CONSENT_STORAGE_KEY, GA_MEASUREMENT_ID } from "@/lib/analytics";

/**
 * Loads GA4 under Google Consent Mode v2: analytics_storage defaults to the
 * visitor's last stored choice (denied if none yet), read before gtag.js runs
 * so no analytics cookie is set ahead of consent.
 */
export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script id="ga-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){ window.dataLayer.push(arguments); }
          window.gtag = window.gtag || gtag;
          var granted = false;
          try {
            var raw = window.localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)});
            if (raw) granted = !!JSON.parse(raw).analytics;
          } catch (e) {}
          gtag('consent', 'default', {
            analytics_storage: granted ? 'granted' : 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });
        `}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.gtag('js', new Date());
          window.gtag('config', ${JSON.stringify(GA_MEASUREMENT_ID)});
        `}
      </Script>
    </>
  );
}
