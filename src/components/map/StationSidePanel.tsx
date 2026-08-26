"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import type { Station } from "@/lib/openChargeMap";
import StationPopupContent from "@/components/map/StationPopupContent";

export default function StationSidePanel({
  station,
  onClose,
}: {
  station: Station;
  onClose: () => void;
}) {
  const t = useTranslations("Hero");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="panel-slide-in absolute inset-y-0 right-0 z-[600] w-full max-w-sm overflow-y-auto rounded-[28px] bg-card p-5 pr-10 text-ink-900 shadow-2xl shadow-forest-950/30 md:static md:z-auto md:w-80 md:max-w-none md:shrink-0">
      <button
        type="button"
        onClick={onClose}
        aria-label={t("popupClose")}
        className="absolute right-3 top-3 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-ink-400 transition hover:bg-sand-200 hover:text-ink-900"
      >
        &times;
      </button>
      <StationPopupContent station={station} />
    </div>
  );
}
