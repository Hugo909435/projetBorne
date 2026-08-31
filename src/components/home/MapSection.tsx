"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import LocationFilters from "@/components/home/LocationFilters";
import MapExplorerLoader, { MapSkeleton } from "@/components/map/MapExplorerLoader";
import type { FlyTarget, StationSource } from "@/components/map/MapExplorer";
import type { CityEntry } from "@/lib/cities";
import { countryByCode, localeToCountryCode } from "@/lib/countries";

/**
 * The Leaflet/react-leaflet/leaflet.markercluster bundle is ~200KB of JS
 * (before gzip) - fetching, parsing and running it right on mount was
 * dominating Total Blocking Time even though the map sits just below the
 * fold on mobile (a few px past the initial viewport). Deferring the mount
 * (and therefore the chunk fetch) until the map is actually on screen keeps
 * that cost out of the initial load and out of the Lighthouse/CrUX
 * measurement window, which doesn't scroll the page. A generous rootMargin
 * here would defeat the point, since it's already only a few px offscreen -
 * so this only fires once the map is genuinely visible, not pre-scroll.
 */
const ROOT_MARGIN = "0px";

function useDeferredMount(skip: boolean) {
  const [mounted, setMounted] = useState(skip);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mounted) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setMounted(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: ROOT_MARGIN }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted]);

  return { ref, mounted };
}

export default function MapSection({
  center,
  zoom,
  hasTarget,
}: {
  center: [number, number];
  zoom: number;
  hasTarget: boolean;
}) {
  const locale = useLocale();
  const defaultCountryCode = localeToCountryCode[locale] ?? "FR";

  // A deep link with ?lat&lon (e.g. a shared search result) means the visitor
  // came specifically to see that spot on the map - mount it immediately
  // rather than waiting for scroll. Everyone else gets the deferred load.
  const { ref: mapWrapRef, mounted: mapMounted } = useDeferredMount(hasTarget);

  // The map always shows exactly one country's stations - the one matching
  // the site's current language by default - never a mix of countries.
  const [country, setCountry] = useState(defaultCountryCode);

  // Selecting a city (or a country) only moves the camera on the
  // already-mounted map: it never navigates, so the map (and everything it
  // has already loaded) never gets torn down and rebuilt.
  const [flyTarget, setFlyTarget] = useState<FlyTarget | null>(null);

  function handleSelectCountry(code: string) {
    setCountry(code);
    const def = countryByCode(code);
    if (def) setFlyTarget({ lat: def.center[0], lon: def.center[1], zoom: def.zoom });
  }

  function handleSelectCity(city: CityEntry) {
    setFlyTarget({ lat: city.lat, lon: city.lon, zoom: 13 });
    const url = new URL(window.location.href);
    url.searchParams.set("lat", String(city.lat));
    url.searchParams.set("lon", String(city.lon));
    window.history.replaceState(null, "", url);
  }

  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  function handleLocateMe(lat: number, lon: number) {
    setUserLocation({ lat, lon });
    setFlyTarget({ lat, lon, zoom: 13 });
    const url = new URL(window.location.href);
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lon));
    window.history.replaceState(null, "", url);
  }

  const source: StationSource = { kind: "viewport", countryCode: country };

  const initialCountry = countryByCode(defaultCountryCode);
  const initialCenter = hasTarget ? center : (initialCountry?.center ?? center);
  const initialZoom = hasTarget ? zoom : (initialCountry?.zoom ?? zoom);

  return (
    <>
      <LocationFilters
        country={country}
        onSelectCountry={handleSelectCountry}
        onSelectCity={handleSelectCity}
        onLocateMe={handleLocateMe}
      />
      <div ref={mapWrapRef} className="h-[460px] md:h-[600px]">
        {mapMounted ? (
          <MapExplorerLoader
            center={initialCenter}
            zoom={initialZoom}
            source={source}
            showSearch
            flyTo={flyTarget}
            userLocation={userLocation}
          />
        ) : (
          <MapSkeleton />
        )}
      </div>
    </>
  );
}
