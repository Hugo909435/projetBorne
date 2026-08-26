"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import LocationFilters from "@/components/home/LocationFilters";
import MapExplorerLoader from "@/components/map/MapExplorerLoader";
import type { FlyTarget, StationSource } from "@/components/map/MapExplorer";
import type { CityEntry } from "@/lib/cities";
import { countryByCode, localeToCountryCode } from "@/lib/countries";

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
      <div className="h-[460px] md:h-[600px]">
        <MapExplorerLoader
          center={initialCenter}
          zoom={initialZoom}
          source={source}
          showSearch
          flyTo={flyTarget}
          userLocation={userLocation}
        />
      </div>
    </>
  );
}
