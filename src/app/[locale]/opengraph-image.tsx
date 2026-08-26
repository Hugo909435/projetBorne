import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { site } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

export const alt = site.shortName;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          background: "#0c1f15",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 140,
            height: 140,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 32,
            background: "#123a22",
          }}
        >
          <svg width="76" height="76" viewBox="0 0 24 24" fill="none">
            <path
              d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"
              fill="#6bf29a"
              stroke="#6bf29a"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div style={{ display: "flex", fontSize: 56, fontWeight: 700, color: "#f7f6ef" }}>
          {site.name}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#6bf29a" }}>
          {t("homeTagline")}
        </div>
      </div>
    ),
    { ...size }
  );
}
