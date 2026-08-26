"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { countries, countryByCode } from "@/lib/countries";
import { cityGroups, type CityEntry } from "@/lib/cities";

/** How long the panel stays open after the mouse leaves, so a slightly
 *  imprecise path down to an item doesn't close it first. */
const CLOSE_DELAY_MS = 250;

/** Trigger + panel that opens on hover (desktop) or a tap (touch/keyboard). */
function HoverMenu({
  label,
  ariaLabel,
  children,
  panelClassName = "w-56",
}: {
  label: string;
  ariaLabel: string;
  children: React.ReactNode;
  /** Overrides the panel's width (and any other layout classes) - the
   *  default single-column width is too narrow for a multi-column list. */
  panelClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearCloseTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function openNow() {
    clearCloseTimer();
    setOpen(true);
  }

  function closeSoon() {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }

  useEffect(() => clearCloseTimer, []);

  return (
    <div className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => (open ? setOpen(false) : openNow())}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-line bg-card px-4 py-2 text-sm font-semibold text-ink-900 outline-none transition hover:border-green-500 focus-visible:border-green-500"
      >
        {label}
        <svg aria-hidden="true" viewBox="0 0 12 8" className="h-2 w-3 shrink-0">
          <path
            d="M1 1l5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {/* top-full + pt-2 (instead of a margin) keeps the gap above the
          visible card part of this same hoverable box, so crossing it on the
          way down from the button never counts as leaving the menu. */}
      <div
        className={`absolute left-0 top-full z-20 pt-2 transition ${panelClassName} ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div
          role="menu"
          onClick={() => setOpen(false)}
          className="max-h-[70vh] overflow-y-auto rounded-2xl border border-line bg-card p-2 shadow-xl shadow-forest-950/10"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function MenuItem({
  active,
  onSelect,
  children,
}: {
  active?: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onSelect}
      className={`flex w-full items-baseline justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
        active ? "bg-sand-200 text-ink-900" : "text-ink-600 hover:bg-sand-200 hover:text-ink-900"
      }`}
    >
      {children}
    </button>
  );
}

/** Number of columns for a city list of this size: short lists stay in one
 *  simple column, longer ones (e.g. France's 96 departments) spread out. */
function columnsFor(count: number): number {
  if (count <= 8) return 1;
  if (count <= 20) return 3;
  return 4;
}

export default function LocationFilters({
  country,
  onSelectCountry,
  onSelectCity,
  onLocateMe,
}: {
  country: string;
  onSelectCountry: (code: string) => void;
  onSelectCity: (city: CityEntry) => void;
  onLocateMe: (lat: number, lon: number) => void;
}) {
  const t = useTranslations("LocationFilters");
  const tCountries = useTranslations("Countries");

  const [cityName, setCityName] = useState<string | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "error">("idle");

  const activeCountry = countryByCode(country);
  const cities = cityGroups.find((g) => g.countryKey === activeCountry?.countryKey)?.cities ?? [];
  const cityColumns = columnsFor(cities.length);

  function handleSelectCountry(code: string) {
    setCityName(null);
    onSelectCountry(code);
  }

  function handleSelectCity(city: CityEntry) {
    setCityName(city.name);
    onSelectCity(city);
  }

  function handleLocateMe() {
    if (!navigator.geolocation) {
      setGeoStatus("error");
      return;
    }
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoStatus("idle");
        setCityName(null);
        onLocateMe(position.coords.latitude, position.coords.longitude);
      },
      () => setGeoStatus("error"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div className="mb-3 flex flex-wrap items-center gap-3">
      <span className="text-sm font-semibold text-ink-900">{t("title")}</span>

      <button
        type="button"
        onClick={handleLocateMe}
        disabled={geoStatus === "loading"}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-line bg-card px-4 py-2 text-sm font-semibold text-ink-900 outline-none transition hover:border-green-500 focus-visible:border-green-500 disabled:cursor-wait disabled:opacity-60"
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0">
          <circle cx="10" cy="10" r="2.5" fill="currentColor" />
          <path
            d="M10 1v3M10 16v3M1 10h3M16 10h3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
        {geoStatus === "loading" ? t("nearMeLoading") : t("nearMe")}
      </button>
      {geoStatus === "error" && (
        <span role="alert" className="text-xs font-medium text-red-700">
          {t("nearMeError")}
        </span>
      )}

      <HoverMenu
        label={`${t("countryLabel")} : ${activeCountry ? tCountries(activeCountry.countryKey) : "?"}`}
        ariaLabel={t("countryLabel")}
      >
        {countries.map((c) => (
          <MenuItem key={c.code} active={c.code === country} onSelect={() => handleSelectCountry(c.code)}>
            {tCountries(c.countryKey)}
          </MenuItem>
        ))}
      </HoverMenu>

      <HoverMenu
        label={`${t("cityLabel")} : ${cityName ?? t("cityPlaceholder")}`}
        ariaLabel={t("cityLabel")}
        panelClassName={cityColumns > 1 ? "w-[min(90vw,44rem)]" : "w-56"}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cityColumns}, minmax(0, 1fr))`,
            gridAutoFlow: "column",
            gridTemplateRows: `repeat(${Math.ceil(cities.length / cityColumns)}, auto)`,
          }}
          className="gap-x-2"
        >
          {cities.map((city) => (
            <MenuItem key={city.name} active={city.name === cityName} onSelect={() => handleSelectCity(city)}>
              <span>{city.name}</span>
              {city.code && <span className="shrink-0 text-xs text-ink-400">{city.code}</span>}
            </MenuItem>
          ))}
        </div>
      </HoverMenu>
    </div>
  );
}
