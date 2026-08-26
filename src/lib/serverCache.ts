/**
 * Small in-process stale-while-revalidate cache.
 *
 * Country/region-wide payloads regularly exceed the platform's fetch-cache
 * entry size limit, so Next's built-in data cache can't hold them. This lives
 * for the lifetime of the server process/instance instead, which is enough to
 * turn a slow, multi-second Open Charge Map call into an instant repeat for the
 * same query - most visibly the default "all of France" load that every visitor
 * triggers.
 */

type CacheEntry<T> = { data: T; fetchedAt: number };

export type CacheOptions = {
  /** Serve straight from cache below this age. */
  freshMs: number;
  /** Serve stale and refresh in the background below this age. */
  staleMs: number;
};

const store = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

export function cached<T>(
  key: string,
  load: () => Promise<T>,
  { freshMs, staleMs }: CacheOptions
): Promise<T> {
  const entry = store.get(key) as CacheEntry<T> | undefined;
  const age = entry ? Date.now() - entry.fetchedAt : Infinity;

  if (entry && age < freshMs) return Promise.resolve(entry.data);

  const revalidate = (): Promise<T> => {
    const pending = inflight.get(key) as Promise<T> | undefined;
    if (pending) return pending;
    const next = load()
      .then((data) => {
        store.set(key, { data, fetchedAt: Date.now() });
        inflight.delete(key);
        return data;
      })
      .catch((err) => {
        inflight.delete(key);
        throw err;
      });
    inflight.set(key, next);
    return next;
  };

  if (entry && age < staleMs) {
    // Serve the stale copy immediately; refresh in the background so the *next*
    // request is fresh, instead of making this one wait on the upstream API.
    revalidate().catch(() => {});
    return Promise.resolve(entry.data);
  }

  // No usable entry: this request has to wait, but on failure fall back to
  // whatever stale data we still have rather than propagating the error.
  return revalidate().catch((err) => {
    if (entry) return entry.data;
    throw err;
  });
}
