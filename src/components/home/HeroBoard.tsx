"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Station } from "@/lib/openChargeMap";
import { rankNearby, type NearbyRow } from "@/lib/nearbyStations";
import StationPopupContent from "@/components/map/StationPopupContent";

const RADIUS_KM = 8;
const EDGE_MARGIN_PX = 16;
const FALLBACK_HEADER_HEIGHT_PX = 64;

type BoardState =
  | { status: "locked" } // no geolocation permission yet - needs the user to opt in
  | { status: "loading" } // permission granted, fixing position / fetching stations
  | { status: "ready"; rows: NearbyRow[] }
  | { status: "empty" }; // permission granted but the stations request failed

function getPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 10 * 60 * 1000,
    });
  });
}

async function loadNearby(lat: number, lon: number): Promise<NearbyRow[]> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    distance: String(RADIUS_KM),
    maxResults: "60",
  });
  const res = await fetch(`/api/stations?${params.toString()}`);
  if (!res.ok) throw new Error(`stations request failed with ${res.status}`);
  const { stations } = (await res.json()) as { stations: Station[] };
  return rankNearby(stations, { lat, lon });
}

function PinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default function HeroBoard() {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const [state, setState] = useState<BoardState>({ status: "locked" });
  const [bubble, setBubble] = useState<{ index: number; center: number } | null>(null);
  // Extra vertical nudge applied after the bubble is measured, so it never
  // renders under the sticky header (or off the bottom of the viewport).
  const [edgeShift, setEdgeShift] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  const locate = () => {
    setState({ status: "loading" });
    getPosition()
      .then(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const rows = await loadNearby(latitude, longitude);
          setState(rows.length ? { status: "ready", rows } : { status: "empty" });
        } catch {
          setState({ status: "empty" });
        }
      })
      .catch(() => setState({ status: "locked" }));
  };

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.permissions?.query) return;
    let cancelled = false;

    navigator.permissions
      .query({ name: "geolocation" })
      .then((result) => {
        if (cancelled) return;
        // Already granted (a previous visit, or the browser remembers the
        // choice): skip the message and load straight away. Anything else
        // ("prompt" or "denied") stays locked until the user clicks through.
        if (result.state === "granted") locate();
        result.addEventListener("change", () => {
          if (result.state === "granted") locate();
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!bubble) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBubble(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [bubble]);

  function toggleBubble(index: number, e: React.MouseEvent<HTMLButtonElement>) {
    if (bubble?.index === index) {
      setBubble(null);
      return;
    }
    const container = containerRef.current;
    if (!container) return;
    const rowRect = e.currentTarget.getBoundingClientRect();
    const rowCenter = rowRect.top + rowRect.height / 2 - container.getBoundingClientRect().top;
    setEdgeShift(0);
    setBubble({ index, center: rowCenter });
  }

  // Runs synchronously after the bubble paints its natural (centred-on-row)
  // position, so a correction - if any - lands before the browser shows a frame.
  useLayoutEffect(() => {
    if (!bubble || !bubbleRef.current) return;
    const rect = bubbleRef.current.getBoundingClientRect();
    const headerHeight =
      document.querySelector("header")?.getBoundingClientRect().height ?? FALLBACK_HEADER_HEIGHT_PX;
    const minTop = headerHeight + EDGE_MARGIN_PX;
    const maxBottom = window.innerHeight - EDGE_MARGIN_PX;

    if (rect.top < minTop) setEdgeShift(minTop - rect.top);
    else if (rect.bottom > maxBottom) setEdgeShift(maxBottom - rect.bottom);
  }, [bubble]);

  const distanceFormat = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  const bubbleRow = state.status === "ready" && bubble ? state.rows[bubble.index] : null;

  return (
    <div className="relative hidden md:block" ref={containerRef}>
      <div className="grain relative overflow-hidden rounded-[26px] bg-forest-950 p-5 text-white shadow-[0_20px_50px_-20px_rgba(12,31,21,0.55)]">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-white/50">
            {t("boardTitle")}
          </span>
          {state.status === "ready" && (
            <span className="flex items-center gap-1.5 text-[0.7rem] text-lime-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-400" />
              {t("boardUpdated")}
            </span>
          )}
        </div>

        {state.status === "locked" && (
          <div className="flex flex-col items-center gap-3 py-7 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lime-300">
              <PinIcon />
            </span>
            <p className="max-w-[15rem] text-sm text-white/60">{t("boardEnableMessage")}</p>
            <button
              type="button"
              onClick={locate}
              className="cursor-pointer rounded-full bg-lime-400 px-4 py-2 text-xs font-semibold text-forest-950 transition hover:bg-lime-300"
            >
              {t("boardEnableCta")}
            </button>
          </div>
        )}

        {state.status === "loading" && (
          <ul>
            {[0, 1, 2].map((i) => (
              <li key={i} className="flex items-center gap-3 border-b border-white/10 py-3 last:border-0">
                <span className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-white/10" />
                <span className="flex-1 space-y-1.5">
                  <span className="block h-3 w-16 animate-pulse rounded bg-white/10" />
                  <span className="block h-2.5 w-10 animate-pulse rounded bg-white/10" />
                </span>
                <span className="h-5 w-16 animate-pulse rounded-full bg-white/10" />
              </li>
            ))}
          </ul>
        )}

        {state.status === "empty" && (
          <p className="py-6 text-center text-sm text-white/50">{t("boardUnavailable")}</p>
        )}

        {state.status === "ready" && (
          <ul className="divide-y divide-white/10">
            {state.rows.map((row, i) => (
              <li key={row.id}>
                <button
                  type="button"
                  onClick={(e) => toggleBubble(i, e)}
                  aria-expanded={bubble?.index === i}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-lg py-3 text-left transition hover:bg-white/5 focus-visible:bg-white/5 focus-visible:outline-none"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 font-display text-sm text-white/70">
                    {i + 1}
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {distanceFormat.format(row.distanceKm)} km
                      </span>
                      <span className="text-[0.7rem] font-semibold text-lime-300">
                        {t("boardSeeMore")} &rarr;
                      </span>
                    </span>
                    <span className="block text-[0.72rem] text-white/45">
                      {row.powerKw != null ? `${row.powerKw} kW` : "—"}
                    </span>
                  </span>
                  <span
                    className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold ${
                      row.available ? "bg-lime-400/15 text-lime-300" : "bg-white/10 text-white/40"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        row.available ? "bg-lime-400" : "bg-white/30"
                      }`}
                    />
                    {row.available ? t("statusAvailable") : t("statusBusy")}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {bubbleRow && bubble && (
        <>
          <div aria-hidden="true" onClick={() => setBubble(null)} className="fixed inset-0 z-30" />
          <div
            ref={bubbleRef}
            className="fade-in absolute z-40 w-[26rem] max-w-[calc(100vw-2.5rem)] rounded-2xl bg-card p-5 pr-10 text-ink-900 shadow-2xl shadow-forest-950/30"
            style={{
              top: bubble.center,
              right: "calc(100% + 14px)",
              transform: `translateY(calc(-50% + ${edgeShift}px))`,
            }}
          >
            <span className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 bg-card" />
            <button
              type="button"
              onClick={() => setBubble(null)}
              aria-label={t("popupClose")}
              className="absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-ink-400 transition hover:bg-sand-200 hover:text-ink-900"
            >
              &times;
            </button>
            <StationPopupContent station={bubbleRow.station} />
          </div>
        </>
      )}
    </div>
  );
}
