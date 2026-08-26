import type { Station } from "./openChargeMap";

/**
 * Accumulating store behind the map.
 *
 * Every tile the user has visited is kept, so panning back or zooming out never
 * makes stations disappear and never costs a second request. Growth is bounded
 * by evicting whole tiles least-recently-used first, which keeps the "have I
 * loaded this area?" bookkeeping honest: a tile is either fully present or
 * fully gone and therefore refetchable.
 */

const MAX_TILES = 120;
const MAX_STATIONS = 45000;

type Entry = { stations: Station[]; usedAt: number };

export class StationStore {
  private tiles = new Map<string, Entry>();
  private union = new Map<number, Station>();
  private pinned = new Set<string>();
  private snapshot: Station[] | null = null;
  private clock = 0;

  has(key: string): boolean {
    return this.tiles.has(key);
  }

  /** Marks a tile as recently used so eviction passes it over. */
  touch(key: string): void {
    const entry = this.tiles.get(key);
    if (entry) entry.usedAt = ++this.clock;
  }

  /** Never evict this tile (the initial seed, a city page's fixed radius). */
  pin(key: string): void {
    this.pinned.add(key);
  }

  /** Drops everything, pinned tiles included - used when switching to a different country. */
  reset(): void {
    this.tiles.clear();
    this.union.clear();
    this.pinned.clear();
    this.snapshot = null;
    this.clock = 0;
  }

  put(key: string, stations: Station[]): void {
    this.tiles.set(key, { stations, usedAt: ++this.clock });
    for (const station of stations) this.union.set(station.id, station);
    this.snapshot = null;
  }

  /**
   * Drops least-recently-used tiles until back under the caps. Tiles in `keep`
   * (the current view) and pinned tiles are never dropped. Returns true when
   * something was evicted, which means the caller has to rebuild its marker
   * layer from `list()` instead of just appending to it.
   */
  prune(keep: Set<string>): boolean {
    let stationCount = 0;
    for (const entry of this.tiles.values()) stationCount += entry.stations.length;
    if (this.tiles.size <= MAX_TILES && stationCount <= MAX_STATIONS) return false;

    const candidates = Array.from(this.tiles.entries())
      .filter(([key]) => !keep.has(key) && !this.pinned.has(key))
      .sort((a, b) => a[1].usedAt - b[1].usedAt);

    let evicted = false;
    for (const [key, entry] of candidates) {
      if (this.tiles.size <= MAX_TILES && stationCount <= MAX_STATIONS) break;
      this.tiles.delete(key);
      stationCount -= entry.stations.length;
      evicted = true;
    }
    if (!evicted) return false;

    this.union.clear();
    for (const entry of this.tiles.values()) {
      for (const station of entry.stations) this.union.set(station.id, station);
    }
    this.snapshot = null;
    return true;
  }

  /** Every loaded station, deduplicated across overlapping tiles. */
  list(): Station[] {
    if (!this.snapshot) this.snapshot = Array.from(this.union.values());
    return this.snapshot;
  }
}
