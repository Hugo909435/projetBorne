/**
 * Geometry for the map's tiled station loading.
 *
 * The map used to refetch its exact viewport on every pan and replace the whole
 * station list with the response. Two things went wrong with that: a bounding
 * box that is never the same twice can't be cached (client or server), and a
 * capped response for a wide view is unevenly spread, so stations that were on
 * screen a second ago vanished as soon as the new answer landed.
 *
 * Instead the viewport is covered by tiles snapped to a fixed grid. The same
 * area always produces the same tile keys, so a tile is fetched once and then
 * reused forever, and results accumulate rather than replace each other.
 */

export type Box = { south: number; west: number; north: number; east: number };

export type Tile = {
  key: string;
  /** Bounding box to request; absent for a whole-country request. */
  box?: Box;
  /** ISO country code, for the one-shot seed request of the initial view. */
  country?: string;
  maxResults: number;
};

const LAT_LIMIT = 85;
const LON_LIMIT = 180;

/** Below this zoom the grid would need far too many tiles: one wide box instead. */
export const TILE_ZOOM_MIN = 8;
/** Below this zoom nothing is fetched at all (whatever is loaded stays visible). */
export const OVERVIEW_ZOOM_MIN = 4;

/**
 * Per-request cap. It only bites in dense metro areas: elsewhere the response
 * is simply as big as the area is dense, so a generous cap costs nothing.
 */
const TILE_MAX_RESULTS = 5000;
/** Wide views are cluster-level anyway, so completeness matters less than even spread. */
const OVERVIEW_MAX_RESULTS = 10000;
export const COUNTRY_MAX_RESULTS = 20000;

/** Grid step in degrees. Powers of two keep the snapping free of float drift. */
const GRID_STEPS = [0.25, 0.5, 1, 2, 4] as const;
/** How many parallel tile requests a single view may trigger. */
const MAX_TILES_PER_VIEW = 16;
/** Wide views snap to a coarse step so small pans don't trigger a new request. */
const OVERVIEW_STEP = 4;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function normalizeBox(box: Box): Box {
  return {
    south: clamp(Math.min(box.south, box.north), -LAT_LIMIT, LAT_LIMIT),
    north: clamp(Math.max(box.south, box.north), -LAT_LIMIT, LAT_LIMIT),
    west: clamp(Math.min(box.west, box.east), -LON_LIMIT, LON_LIMIT),
    east: clamp(Math.max(box.west, box.east), -LON_LIMIT, LON_LIMIT),
  };
}

/** Grows a box by `ratio` of its own size on each side (prefetch margin). */
export function padBox(box: Box, ratio: number): Box {
  const latPad = (box.north - box.south) * ratio;
  const lonPad = (box.east - box.west) * ratio;
  return normalizeBox({
    south: box.south - latPad,
    north: box.north + latPad,
    west: box.west - lonPad,
    east: box.east + lonPad,
  });
}

function stepForZoom(zoom: number): number {
  if (zoom >= 12) return 0.25;
  if (zoom >= 10) return 0.5;
  return 1;
}

function buildGrid(box: Box, step: number, country?: string): Tile[] {
  // The -epsilon keeps a box whose edge lands exactly on a grid line from
  // pulling in a whole extra row/column of tiles.
  const firstX = Math.floor(box.west / step);
  const lastX = Math.floor((box.east - 1e-9) / step);
  const firstY = Math.floor(box.south / step);
  const lastY = Math.floor((box.north - 1e-9) / step);

  const tiles: Tile[] = [];
  for (let ix = firstX; ix <= lastX; ix++) {
    for (let iy = firstY; iy <= lastY; iy++) {
      // The country suffix keeps a tile fetched while filtering to one
      // country from being mistaken for (or reused as) the same box fetched
      // without a filter, or filtered to a different country.
      tiles.push({
        key: country ? `g${step}:${ix}:${iy}:${country}` : `g${step}:${ix}:${iy}`,
        box: normalizeBox({
          west: ix * step,
          east: (ix + 1) * step,
          south: iy * step,
          north: (iy + 1) * step,
        }),
        country,
        maxResults: TILE_MAX_RESULTS,
      });
    }
  }
  return tiles;
}

/**
 * Tiles covering `bounds` at the grid step appropriate for `zoom`, falling back
 * to one wide request when even the coarsest grid would need too many.
 *
 * `country`, when set, is attached to every tile so the request stays scoped
 * to that country even when `bounds` spans past its borders (a wide overview,
 * or a pan near the edge of its mainland) - otherwise a plain bbox request
 * would pull in whichever neighbouring country's stations happen to fall
 * inside the same box.
 */
export function gridTiles(bounds: Box, zoom: number, country?: string): Tile[] {
  const box = normalizeBox(bounds);
  const coarsest = GRID_STEPS[GRID_STEPS.length - 1];
  let step = stepForZoom(zoom);
  let tiles = buildGrid(box, step, country);
  // A wide screen (or the extra-wide margin used on first load) can straddle
  // many cells. Rather than firing a request per cell, step up to a coarser
  // grid until the count is reasonable.
  while (tiles.length > MAX_TILES_PER_VIEW && step < coarsest) {
    step *= 2;
    tiles = buildGrid(box, step, country);
  }
  // Still over budget at the coarsest step: the area is overview-sized even if
  // the zoom level says otherwise (a mis-measured container can report bounds
  // like that). One wide request beats dozens of narrow ones.
  if (tiles.length > MAX_TILES_PER_VIEW) return [overviewTile(box, country)];
  return tiles;
}

/** Single wide request for country/continent zooms, snapped so panning reuses it. */
export function overviewTile(bounds: Box, country?: string): Tile {
  const box = normalizeBox(bounds);
  const snapped = normalizeBox({
    south: Math.floor(box.south / OVERVIEW_STEP) * OVERVIEW_STEP,
    west: Math.floor(box.west / OVERVIEW_STEP) * OVERVIEW_STEP,
    north: Math.ceil(box.north / OVERVIEW_STEP) * OVERVIEW_STEP,
    east: Math.ceil(box.east / OVERVIEW_STEP) * OVERVIEW_STEP,
  });
  const key = `o:${snapped.south}:${snapped.west}:${snapped.north}:${snapped.east}`;
  return {
    key: country ? `${key}:${country}` : key,
    box: snapped,
    country,
    maxResults: OVERVIEW_MAX_RESULTS,
  };
}

export function countryTile(code: string): Tile {
  return { key: `c:${code}`, country: code, maxResults: COUNTRY_MAX_RESULTS };
}

/**
 * Area a country seed request is known to cover completely.
 *
 * A `countrycode` request returns the whole country in one call, so any view
 * that stays inside these bounds is already fully loaded and needs no further
 * request at all - however far the user pans or zooms. Mainland only: a country
 * with overseas territories would otherwise claim to cover half the planet.
 */
const SEED_BOXES: Record<string, Box> = {
  FR: { south: 41.2, west: -5.4, north: 51.3, east: 9.8 },
  DE: { south: 47.2, west: 5.8, north: 55.1, east: 15.1 },
  CH: { south: 45.8, west: 5.9, north: 47.9, east: 10.5 },
  ES: { south: 35.9, west: -9.4, north: 43.9, east: 4.4 },
  GB: { south: 49.8, west: -8.7, north: 61.0, east: 1.8 },
  BE: { south: 49.4, west: 2.5, north: 51.6, east: 6.5 },
};

export function seedBoxFor(code: string): Box | null {
  return SEED_BOXES[code] ?? null;
}

export function boxContains(outer: Box, inner: Box): boolean {
  return (
    inner.south >= outer.south &&
    inner.north <= outer.north &&
    inner.west >= outer.west &&
    inner.east <= outer.east
  );
}

export function tileUrl(tile: Tile): string {
  const params = new URLSearchParams({ maxResults: String(tile.maxResults) });
  if (tile.box) {
    const { south, west, north, east } = tile.box;
    params.set("bbox", `${south},${west},${north},${east}`);
  }
  if (tile.country) {
    params.set("country", tile.country);
  }
  return `/api/stations?${params.toString()}`;
}
