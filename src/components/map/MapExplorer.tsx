"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, ZoomControl, useMap, useMapEvents } from "react-leaflet";
import { useTranslations, useLocale } from "next-intl";
import L from "leaflet";
import Supercluster from "supercluster";
import type { Station } from "@/lib/openChargeMap";
import { StationStore } from "@/lib/stationStore";
import StationSidePanel from "@/components/map/StationSidePanel";
import {
  boxContains,
  countryTile,
  gridTiles,
  normalizeBox,
  overviewTile,
  padBox,
  seedBoxFor,
  tileUrl,
  COUNTRY_MAX_RESULTS,
  OVERVIEW_ZOOM_MIN,
  TILE_ZOOM_MIN,
  type Box,
  type Tile,
} from "@/lib/stationTiles";

const PIN_SVG = (fill: string, ring: string) => `
<svg width="30" height="38" viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg">
  <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 23 15 23s15-12.5 15-23C30 6.7 23.3 0 15 0z" fill="${fill}"/>
  <circle cx="15" cy="15" r="9.5" fill="${ring}"/>
  <path d="M16.6 6.8 8.6 18h5.1l-1.4 9 8.9-11.6h-5.4z" fill="${fill}"/>
</svg>`;

const pinIcon = L.divIcon({
  html: PIN_SVG("#1f5c3a", "#f7f6ef"),
  className: "bornes-pin bornes-appear",
  iconSize: [30, 38],
  iconAnchor: [15, 36],
});

/** Cluster radius in screen pixels: wide enough that neighbouring bubbles never overlap. */
const CLUSTER_RADIUS_PX = 70;
/** Above this zoom every station is drawn on its own. */
const CLUSTER_MAX_ZOOM = 17;
/** Markers are kept this far beyond the visible area, so a pan never shows bare edges. */
const RENDER_PAD = 0.3;
/**
 * After the stations change, wait this long before re-indexing so a burst of
 * arriving tiles costs one rebuild instead of one per tile.
 */
const REINDEX_DELAY_MS = 120;
/** Must match the fade-out duration of `.bornes-leaving` in globals.css. */
const LEAVE_MS = 220;

type StationPoint = { id: number };

function clusterIcon(count: number): L.DivIcon {
  const size = count > 2000 ? 64 : count > 500 ? 56 : count > 50 ? 46 : count > 10 ? 38 : 32;
  const label = count > 999 ? `${Math.round(count / 100) / 10}k` : String(count);
  return L.divIcon({
    html: `<div class="bornes-cluster" style="width:${size}px;height:${size}px">${label}</div>`,
    className: "bornes-appear",
    iconSize: [size, size],
  });
}

/**
 * Stations that share exact coordinates (several operators in one car park)
 * would sit on top of each other and only the top one could be clicked. Each
 * extra one is nudged a few metres along a small spiral, for display only.
 */
function spread(lat: number, lon: number, n: number): [number, number] {
  const ring = Math.ceil(n / 6);
  const angle = (n * 60 * Math.PI) / 180;
  const distance = ring * 0.00003;
  return [lat + distance * Math.sin(angle), lon + (distance * Math.cos(angle)) / Math.cos((lat * Math.PI) / 180)];
}

type Shown = { marker: L.Marker; clusterId?: number };

/**
 * Draws the accumulated stations as clusters and pins.
 *
 * Every station is indexed once (supercluster, a spatial index that answers
 * "what clusters are in this box at this zoom" in about a millisecond). On each
 * move the layer asks for exactly what should be visible and compares it with
 * what is already drawn: markers that are still wanted are left untouched and
 * only the differences are added or removed. That comparison is what keeps the
 * map from blinking: the previous cluster plugin rebuilt the visible layer
 * whenever stations were added, so nearly every pin was destroyed and redrawn
 * on the first pan after new data arrived.
 */
function ClusterLayer({
  stations,
  onSelect,
}: {
  stations: Station[];
  onSelect: (station: Station) => void;
}) {
  const map = useMap();
  // Read inside long-lived closures via a ref, so a marker created in an earlier
  // render always calls the latest callback.
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  });

  const indexRef = useRef<Supercluster<StationPoint> | null>(null);
  const stationsRef = useRef(new Map<number, Station>());
  const layerRef = useRef<L.LayerGroup | null>(null);
  const shownRef = useRef(new Map<string, Shown>());
  const frameRef = useRef<number | null>(null);

  const render = useCallback(() => {
    const index = indexRef.current;
    const layer = layerRef.current;
    if (!index || !layer) return;

    const bounds = map.getBounds().pad(RENDER_PAD);
    const zoom = Math.max(0, Math.min(Math.round(map.getZoom()), CLUSTER_MAX_ZOOM + 1));
    const features = index.getClusters(
      [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
      zoom
    );

    const shown = shownRef.current;
    const wanted = new Set<string>();

    for (const feature of features) {
      const [lon, lat] = feature.geometry.coordinates;
      const props = feature.properties;

      if ("cluster" in props && props.cluster) {
        // Position and size identify a cluster, so the same group of stations
        // keeps its marker even though the index numbers its clusters afresh
        // every time it is rebuilt.
        const key = `c:${lat.toFixed(4)}:${lon.toFixed(4)}:${props.point_count}`;
        wanted.add(key);
        const existing = shown.get(key);
        if (existing) {
          existing.clusterId = props.cluster_id;
          continue;
        }
        const marker = L.marker([lat, lon], { icon: clusterIcon(props.point_count) });
        const entry: Shown = { marker, clusterId: props.cluster_id };
        marker.on("click", () => {
          let target = map.getZoom() + 2;
          try {
            if (entry.clusterId != null) target = indexRef.current!.getClusterExpansionZoom(entry.clusterId);
          } catch {
            /* the index was rebuilt since: a two-level zoom is a fine fallback */
          }
          map.setView([lat, lon], Math.min(target, map.getMaxZoom()));
        });
        layer.addLayer(marker);
        shown.set(key, entry);
      } else {
        const key = `p:${props.id}`;
        wanted.add(key);
        if (shown.has(key)) continue;
        const marker = L.marker([lat, lon], { icon: pinIcon });
        marker.on("click", () => {
          const station = stationsRef.current.get(props.id);
          if (station) onSelectRef.current(station);
        });
        layer.addLayer(marker);
        shown.set(key, { marker });
      }
    }

    for (const [key, entry] of shown) {
      if (wanted.has(key)) continue;
      shown.delete(key);
      // Fade out instead of vanishing: when a cluster is replaced by finer ones
      // (or by the same area's complete data) the two overlap for a moment, so
      // the swap reads as a cross-fade rather than a blink.
      const element = entry.marker.getElement();
      if (element) {
        element.classList.add("bornes-leaving");
        setTimeout(() => layer.removeLayer(entry.marker), LEAVE_MS);
      } else {
        layer.removeLayer(entry.marker);
      }
    }
  }, [map]);

  // Throttled to one pass per frame: moving the map fires `move` continuously.
  const schedule = useCallback(() => {
    if (frameRef.current != null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      render();
    });
  }, [render]);

  useEffect(() => {
    const layer = L.layerGroup().addTo(map);
    layerRef.current = layer;
    const shown = shownRef.current;
    map.on("move zoomend", schedule);
    schedule();

    return () => {
      map.off("move zoomend", schedule);
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      map.removeLayer(layer);
      layerRef.current = null;
      shown.clear();
    };
  }, [map, schedule]);

  useEffect(() => {
    const rebuild = () => {
      const byId = new Map<number, Station>();
      const seen = new Map<string, number>();
      const points: GeoJSON.Feature<GeoJSON.Point, StationPoint>[] = [];
      for (const station of stations) {
        byId.set(station.id, station);
        const spot = `${station.lat}:${station.lon}`;
        const n = seen.get(spot) ?? 0;
        seen.set(spot, n + 1);
        const [lat, lon] = n === 0 ? [station.lat, station.lon] : spread(station.lat, station.lon, n);
        points.push({
          type: "Feature",
          properties: { id: station.id },
          geometry: { type: "Point", coordinates: [lon, lat] },
        });
      }
      const index = new Supercluster<StationPoint>({
        radius: CLUSTER_RADIUS_PX,
        maxZoom: CLUSTER_MAX_ZOOM,
        minPoints: 2,
      });
      index.load(points);
      indexRef.current = index;
      stationsRef.current = byId;
      render();
    };

    // The first build shows something straight away; later ones batch up.
    const timer = setTimeout(rebuild, indexRef.current ? REINDEX_DELAY_MS : 0);
    return () => clearTimeout(timer);
  }, [stations, render]);

  return null;
}

type SearchResult = { label: string; lat: number; lon: number };

function SearchControl({
  locale,
  onLocate,
}: {
  locale: string;
  onLocate: (lat: number, lon: number) => void;
}) {
  const t = useTranslations("Map");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length < 2) return;
    setStatus("loading");
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}&lang=${locale}`);
      const data: { results: SearchResult[] } = await res.json();
      if (data.results?.length) {
        const first = data.results[0];
        onLocate(first.lat, first.lon);
        setStatus("idle");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-[19rem] items-center gap-1.5 rounded-full border border-line bg-card p-1 shadow-lg shadow-forest-950/5 sm:max-w-md sm:gap-2 sm:p-1.5"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("searchPlaceholder")}
        aria-label={t("searchPlaceholder")}
        className="min-w-0 flex-1 rounded-full bg-transparent px-3 py-1.5 text-sm text-ink-900 outline-none placeholder:text-ink-400 sm:px-3.5 sm:py-2"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="shrink-0 rounded-full bg-forest-900 px-3.5 py-1.5 text-sm font-semibold text-lime-300 transition hover:bg-forest-800 disabled:opacity-60 sm:px-4 sm:py-2"
      >
        {status === "loading" ? t("searchButtonLoading") : t("searchButton")}
      </button>
      {status === "error" && (
        <span className="absolute mt-14 text-xs font-medium text-red-700">{t("searchError")}</span>
      )}
    </form>
  );
}

function FlyTo({ target }: { target: { lat: number; lon: number; zoom: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lon], target.zoom, { duration: 1.1 });
  }, [target, map]);
  return null;
}

const userLocationIcon = L.divIcon({
  html: `
    <span class="relative flex h-4 w-4">
      <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-60"></span>
      <span class="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-sky-500 shadow"></span>
    </span>`,
  className: "",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function UserLocationMarker({ location }: { location: { lat: number; lon: number } | null }) {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!location) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }
    if (!markerRef.current) {
      markerRef.current = L.marker([location.lat, location.lon], {
        icon: userLocationIcon,
        zIndexOffset: 1000,
        interactive: false,
      }).addTo(map);
    } else {
      markerRef.current.setLatLng([location.lat, location.lon]);
    }
  }, [location, map]);

  useEffect(
    () => () => {
      markerRef.current?.remove();
      markerRef.current = null;
    },
    []
  );

  return null;
}

function boundsToBox(bounds: L.LatLngBounds): Box {
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  return normalizeBox({ south: sw.lat, west: sw.lng, north: ne.lat, east: ne.lng });
}

/** Wait after the map settles before asking for tiles, so a drag is one request. */
const MOVE_DEBOUNCE_MS = 300;
/** Parallel tile requests. Open Charge Map is slow; more than this just queues. */
const REQUEST_CONCURRENCY = 4;
/** Prefetch a margin around the viewport so a small pan needs nothing new. */
const VIEW_PAD = 0.3;
/**
 * The first load deliberately reaches much further than the visible area. It
 * costs a few extra seconds up front and buys a map that is already complete
 * when the user starts panning, instead of one that fills in under them. Wide
 * views keep the normal margin: their boxes are already enormous, and using the
 * same margin every time means returning to a zoom level reuses its request.
 */
const INITIAL_TILE_PAD = 0.9;

type LoadState = { loading: boolean; tooFarOut: boolean };

/**
 * Keeps the store fed with the tiles covering the current view. Everything it
 * fetches is added to what is already there; nothing is ever removed because
 * the user moved.
 */
function TileLoader({
  store,
  onChange,
  onLoadState,
  countryCode,
}: {
  store: StationStore;
  onChange: (rebuilt: boolean) => void;
  onLoadState: (state: LoadState) => void;
  /** Only one country's stations are ever loaded at a time; changing this
   *  drops everything loaded so far and reseeds from scratch. */
  countryCode?: string;
}) {
  const keepRef = useRef<Set<string>>(new Set());
  const queueRef = useRef<Tile[]>([]);
  const activeRef = useRef<Set<string>>(new Set());
  const controllersRef = useRef<Set<AbortController>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aliveRef = useRef(true);
  const firstRunRef = useRef(true);
  // The one pre-loaded country, if any: lets any view inside its box skip
  // loading entirely.
  const seedRef = useRef<{ tile: Tile; box: Box | null; sampled: boolean } | null>(null);

  function schedule() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => refresh(), MOVE_DEBOUNCE_MS);
  }

  const map = useMapEvents({
    moveend: schedule,
    // Also covers the container being measured after mount: the very first
    // getBounds() can predate the real layout, and resize is how Leaflet says
    // the visible area actually changed.
    resize: schedule,
  });

  function report() {
    onLoadState({
      loading: activeRef.current.size > 0 || queueRef.current.length > 0,
      tooFarOut: map.getZoom() < OVERVIEW_ZOOM_MIN,
    });
  }

  function run(tile: Tile) {
    activeRef.current.add(tile.key);
    const controller = new AbortController();
    controllersRef.current.add(controller);

    fetch(tileUrl(tile), { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: { stations?: Station[] }) => {
        if (!aliveRef.current) return;
        const stations = data.stations ?? [];
        const seed = seedRef.current;
        // A seed that came back on its cap was truncated, so it can't be
        // trusted to cover its country: stop suppressing tile requests inside
        // it and let the normal grid fill in the detail.
        if (seed && seed.tile.key === tile.key && stations.length >= COUNTRY_MAX_RESULTS) {
          seed.box = null;
          // ...but the answer is thinned evenly across the whole country, which
          // is all an overview zoom needs (see `refresh`).
          seed.sampled = true;
        }
        store.put(tile.key, stations);
        onChange(store.prune(keepRef.current));
      })
      .catch(() => {
        // A failed tile is simply left unrecorded, so revisiting the area
        // retries it instead of showing a permanent hole.
      })
      .finally(() => {
        controllersRef.current.delete(controller);
        activeRef.current.delete(tile.key);
        if (aliveRef.current) pump();
      });
  }

  function pump() {
    while (activeRef.current.size < REQUEST_CONCURRENCY && queueRef.current.length) {
      run(queueRef.current.shift()!);
    }
    report();
  }

  function refresh() {
    const zoom = map.getZoom();
    if (zoom < OVERVIEW_ZOOM_MIN) {
      // Too far out for a request to mean anything. Nothing is cleared: the
      // stations already loaded stay on screen as clusters.
      queueRef.current = [];
      report();
      return;
    }

    const tiled = zoom >= TILE_ZOOM_MIN;
    const first = firstRunRef.current;
    firstRunRef.current = false;
    const pad = first && tiled ? INITIAL_TILE_PAD : VIEW_PAD;
    const view = padBox(boundsToBox(map.getBounds()), pad);

    const seed = seedRef.current;
    // Inside the seeded country's mainland box everything is already loaded
    // from its single country request, so panning and zooming there costs
    // nothing at all.
    const insideSeed = seed?.box != null && boxContains(seed.box, view);
    // Outside that box (a wide overview, a border, or a seed that came back
    // truncated) any further request still carries the country code, so it
    // never pulls in a neighbouring country's stations while one is selected.
    // A country with more stations than the seed's cap (France, Germany) gets a
    // thinned but evenly spread sample of everything. At overview zooms that is
    // exactly enough: clusters look the same and panning costs nothing. Asking
    // for a fresh multi-thousand-station "overview" tile on every pan instead
    // re-downloads megabytes and re-clusters them, freezing the map for up to a
    // second per move. Detail is fetched by the tile grid once zoomed in.
    // Until the seed has arrived, wait for it rather than firing a second,
    // overlapping request for the same stations.
    const seedCoversOverview =
      !tiled && seed != null && (seed.sampled || !store.has(seed.tile.key));
    const wanted = insideSeed || seedCoversOverview
      ? [seed!.tile]
      : tiled
        ? gridTiles(view, zoom, seed?.tile.country)
        : [overviewTile(view, seed?.tile.country)];

    keepRef.current = new Set(wanted.map((tile) => tile.key));
    // Whatever was still queued belongs to a view the user has already left.
    queueRef.current = wanted.filter((tile) => {
      if (store.has(tile.key)) {
        store.touch(tile.key);
        return false;
      }
      return !activeRef.current.has(tile.key);
    });
    pump();
  }

  useEffect(() => {
    aliveRef.current = true;
    firstRunRef.current = true;
    const controllers = controllersRef.current;
    const active = activeRef.current;

    // A country switch (or the very first mount) starts from a clean slate:
    // exactly one country's stations are ever loaded at a time, so whatever a
    // previous country left behind is dropped before the new one is seeded.
    store.reset();
    seedRef.current = null;

    // One request for the whole country, returned in a single, heavily
    // cached call. It gives the view complete national coverage that a
    // bounding box can't guarantee, and it is what later lets any view
    // inside that country skip loading entirely.
    if (countryCode) {
      const seed = { tile: countryTile(countryCode), box: seedBoxFor(countryCode), sampled: false };
      seedRef.current = seed;
      store.pin(seed.tile.key);
    }

    // Tell the cluster layer to drop the previous country's markers even
    // though nothing has streamed in for the new one yet.
    onChange(true);

    refresh();

    const seed = seedRef.current;
    if (
      seed &&
      !store.has(seed.tile.key) &&
      !activeRef.current.has(seed.tile.key) &&
      !queueRef.current.some((t) => t.key === seed.tile.key)
    ) {
      keepRef.current.add(seed.tile.key);
      queueRef.current.push(seed.tile);
    }
    pump();

    return () => {
      aliveRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      for (const controller of controllers) controller.abort();
      controllers.clear();
      queueRef.current = [];
      active.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryCode]);

  return null;
}

export type StationSource =
  | { kind: "viewport"; countryCode?: string }
  | { kind: "point"; lat: number; lon: number; radiusKm: number };

function pointSourceUrl(source: { lat: number; lon: number; radiusKm: number }): string {
  return `/api/stations?lat=${source.lat}&lon=${source.lon}&distance=${source.radiusKm}&maxResults=5000`;
}

export type FlyTarget = { lat: number; lon: number; zoom?: number };

export type MapExplorerProps = {
  center: [number, number];
  zoom: number;
  source: StationSource;
  showSearch?: boolean;
  /**
   * Set by a sibling control (e.g. the city picker) to move the camera
   * without remounting the map. Pass a new object each time, even for the
   * same coordinates, so re-selecting the same city still flies.
   */
  flyTo?: FlyTarget | null;
  /** Marks the user's own position on the map, e.g. after a "near me" lookup. */
  userLocation?: { lat: number; lon: number } | null;
};

export default function MapExplorer({
  center,
  zoom,
  source,
  showSearch = true,
  flyTo,
  userLocation = null,
}: MapExplorerProps) {
  const t = useTranslations("Map");
  const locale = useLocale();

  // One store per mounted map, kept across renders; everything loaded during
  // the session accumulates in it.
  const [store] = useState(() => new StationStore());

  const [stations, setStations] = useState<Station[]>([]);
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lon: number; zoom: number } | null>(null);
  const [viewportLoading, setViewportLoading] = useState(true);
  const [tooFarOut, setTooFarOut] = useState(false);

  const pointKey = source.kind === "point" ? `${source.lat}:${source.lon}:${source.radiusKm}` : "";
  // A point source resolves exactly once per key, so "still loading" is simply
  // "the settled key isn't the current one" - no extra state to keep in sync.
  const [settledPointKey, setSettledPointKey] = useState<string | null>(null);
  const loading = source.kind === "point" ? settledPointKey !== pointKey : viewportLoading;
  const [selected, setSelected] = useState<Station | null>(null);

  // The cluster layer re-indexes whenever the list changes, so it does not
  // matter whether tiles were only added or some were evicted.
  const handleChange = useCallback(() => {
    setStations(store.list());
  }, [store]);

  const handleLoadState = useCallback((state: LoadState) => {
    setViewportLoading(state.loading);
    setTooFarOut(state.tooFarOut);
  }, []);

  useEffect(() => {
    if (source.kind !== "point") return;
    const controller = new AbortController();
    const key = `p:${pointKey}`;
    fetch(pointSourceUrl(source), { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: { stations?: Station[] }) => {
        store.pin(key);
        store.put(key, data.stations ?? []);
        handleChange();
      })
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setSettledPointKey(pointKey);
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointKey]);

  function handleLocate(lat: number, lon: number) {
    setFlyTarget({ lat, lon, zoom: 13 });
  }

  // Adjust state during render (per React's "adjusting state when a prop
  // changes" pattern) rather than in an effect, so a new flyTo prop takes
  // effect in the same render instead of triggering an extra one.
  const [prevFlyTo, setPrevFlyTo] = useState(flyTo);
  if (flyTo && flyTo !== prevFlyTo) {
    setPrevFlyTo(flyTo);
    setFlyTarget({ lat: flyTo.lat, lon: flyTo.lon, zoom: flyTo.zoom ?? 13 });
  }

  const countLabel = loading
    ? stations.length
      ? t("stationsShownLoading", { count: stations.length })
      : t("loadingStations")
    : tooFarOut && stations.length === 0
      ? t("zoomHint")
      : t("stationsShown", { count: stations.length });

  const attribution = `&copy; <a href="https://www.openstreetmap.org/copyright">${t(
    "attributionOsmLabel"
  )}</a> | ${t("attributionStationsLabel")} © <a href="https://www.data.gouv.fr/datasets/beta-bases-nationales-des-points-de-recharge-pour-vehicules-electriques-en-france-irve">IRVE (data.gouv.fr)</a>, <a href="https://www.bundesnetzagentur.de/DE/Fachthemen/ElektrizitaetundGas/E-Mobilitaet/Ladesaeulenkarte/start.html">Bundesnetzagentur</a>, <a href="https://openchargemap.org">Open Charge Map</a>`;

  return (
    <div className="relative flex h-full w-full gap-3">
      <div className="relative isolate h-full min-w-0 flex-1 overflow-hidden rounded-[28px]">
        {showSearch && (
          <div className="pointer-events-none absolute inset-x-0 top-4 z-[500] flex justify-center px-4">
            <div className="pointer-events-auto">
              <SearchControl locale={locale} onLocate={handleLocate} />
            </div>
          </div>
        )}
        <div className="pointer-events-none absolute bottom-4 left-4 z-[500] flex items-center gap-2 rounded-full bg-forest-900/90 px-3.5 py-1.5 text-xs font-semibold text-lime-300 shadow-lg backdrop-blur">
          {loading && (
            <span
              aria-hidden
              className="h-3 w-3 animate-spin rounded-full border-2 border-lime-300/30 border-t-lime-300"
            />
          )}
          <span aria-live="polite">{countLabel}</span>
        </div>
        <MapContainer
          center={center}
          zoom={zoom}
          minZoom={3}
          scrollWheelZoom
          className="h-full w-full"
          attributionControl
          zoomControl={false}
        >
          <TileLayer
            attribution={attribution}
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* moved off the default top-left so it never fights the search bar
              for space on narrow screens */}
          <ZoomControl position="bottomright" />
          <ClusterLayer stations={stations} onSelect={setSelected} />
          <FlyTo target={flyTarget} />
          <UserLocationMarker location={userLocation} />
          {source.kind === "viewport" && (
            <TileLoader
              store={store}
              onChange={handleChange}
              onLoadState={handleLoadState}
              countryCode={source.countryCode}
            />
          )}
        </MapContainer>
      </div>

      {selected && <StationSidePanel station={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
