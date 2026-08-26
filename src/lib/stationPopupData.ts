"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { StationDetail } from "@/lib/openChargeMap";
import type { ReferenceData } from "@/lib/ocmReference";
import type { PopupLabels } from "@/components/map/stationPopup";

/** Open Charge Map enumeration ids the popup has wording for. */
const ACCESS_TYPE_IDS = [1, 2, 3, 4, 5, 6, 7];
const STATUS_TYPE_IDS = [10, 20, 30, 50, 75, 100, 150, 210, 200];
const CURRENT_TYPE_IDS = [10, 20, 30];

function idLabels(ids: number[], translate: (id: number) => string): Record<number, string> {
  const map: Record<number, string> = {};
  for (const id of ids) map[id] = translate(id);
  return map;
}

/**
 * Connector and operator names, fetched once per visitor and shared by every
 * popup on the page (map markers and the hero board alike).
 */
let referencePromise: Promise<ReferenceData | null> | null = null;

export function loadReference(): Promise<ReferenceData | null> {
  referencePromise ??= fetch("/api/reference")
    .then((res) => (res.ok ? (res.json() as Promise<ReferenceData>) : null))
    .catch(() => null)
    .then((data) => {
      // A failure shouldn't be cached forever: the next popup can try again.
      if (!data) referencePromise = null;
      return data;
    });
  return referencePromise;
}

/** Per-station detail, loaded once and remembered for the rest of the visit. */
const detailCache = new Map<number, Promise<StationDetail | null>>();

export function loadDetail(id: number): Promise<StationDetail | null> {
  const existing = detailCache.get(id);
  if (existing) return existing;

  const pending = fetch(`/api/stations/${id}`)
    .then((res) => (res.ok ? (res.json() as Promise<StationDetail>) : null))
    .catch(() => null)
    .then((data) => {
      if (!data) detailCache.delete(id);
      return data;
    });
  detailCache.set(id, pending);
  return pending;
}

/** Builds the same `PopupLabels` the map markers use, from the current locale. */
export function usePopupLabels(): PopupLabels {
  const t = useTranslations("Map");
  const locale = useLocale();
  // Open Charge Map gives a plain calendar date. Formatting it in the viewer's
  // own timezone would shift it a day backwards west of Greenwich, so it is
  // read and rendered as UTC throughout.
  const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" });

  return {
    powerFast: (kw) => t("popupPowerFast", { kw }),
    powerAccelerated: (kw) => t("popupPowerAccelerated", { kw }),
    powerStandard: (kw) => t("popupPowerStandard", { kw }),
    powerUnknown: t("popupPowerUnknown"),
    connectors: t("popupConnectors"),
    unknownConnector: t("popupUnknownConnector"),
    points: (count) => t("popupPoints", { count }),
    verified: (date) => t("popupVerified", { date: dateFormat.format(new Date(`${date}T00:00:00Z`)) }),
    cost: t("popupCost"),
    accessInfo: t("popupAccessInfo"),
    note: t("popupNote"),
    phone: t("popupPhone"),
    website: t("popupWebsite"),
    directions: t("popupDirections"),
    detailLoading: t("popupDetailLoading"),
    accessTypes: idLabels(ACCESS_TYPE_IDS, (id) => t(`accessTypes.${id}`)),
    statusTypes: idLabels(STATUS_TYPE_IDS, (id) => t(`statusTypes.${id}`)),
    currentTypes: idLabels(CURRENT_TYPE_IDS, (id) => t(`currentTypes.${id}`)),
  };
}

/** Reference data, re-rendering the caller once it resolves. */
export function useReferenceData(): ReferenceData | null {
  const [data, setData] = useState<ReferenceData | null>(null);
  useEffect(() => {
    let cancelled = false;
    loadReference().then((result) => {
      if (!cancelled) setData(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return data;
}
