import { cached } from "@/lib/serverCache";
import { ocmRequest } from "@/lib/openChargeMap";

const OCM_REFERENCE = "https://api.openchargemap.io/v3/referencedata/";

/**
 * Open Charge Map's lookup tables, trimmed to what the map actually renders.
 *
 * Station payloads carry bare ids; this is the dictionary that turns them into
 * names. Sending it separately means the ~1000 operator names and 43 connector
 * names travel once per visitor instead of once per station. It is near-static
 * data, so it is cached hard on both sides.
 */
export type ReferenceOperator = {
  name: string;
  website?: string;
  phone?: string;
};

export type ReferenceData = {
  /** Connector names ("CCS (Type 2)", "CHAdeMO"): product names, not translated. */
  connectionTypes: Record<string, string>;
  operators: Record<string, ReferenceOperator>;
  /** Ids whose StatusType is flagged as not operational. */
  outOfService: number[];
};

type RawReference = {
  ConnectionTypes?: { ID: number; Title?: string }[];
  Operators?: {
    ID: number;
    Title?: string;
    WebsiteURL?: string | null;
    PhonePrimaryContact?: string | null;
  }[];
  StatusTypes?: { ID: number; Title?: string; IsOperational?: boolean | null }[];
};

function clean(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

function normalizeUrl(value: unknown): string | undefined {
  const raw = clean(value);
  if (!raw) return undefined;
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withScheme);
    // Only ever hand the browser a plain web link.
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

function shape(raw: RawReference): ReferenceData {
  const connectionTypes: Record<string, string> = {};
  for (const entry of raw.ConnectionTypes ?? []) {
    const title = clean(entry.Title);
    // Id 0 is Open Charge Map's own "Unknown" placeholder: the UI has its own
    // wording for a missing connector, so leaving it out keeps them consistent.
    if (title && entry.ID) connectionTypes[entry.ID] = title;
  }

  const operators: Record<string, ReferenceOperator> = {};
  for (const entry of raw.Operators ?? []) {
    const name = clean(entry.Title);
    if (!name || !entry.ID) continue;
    const website = normalizeUrl(entry.WebsiteURL);
    const phone = clean(entry.PhonePrimaryContact);
    operators[entry.ID] = { name, ...(website ? { website } : {}), ...(phone ? { phone } : {}) };
  }

  const outOfService = (raw.StatusTypes ?? [])
    .filter((entry) => entry.IsOperational === false)
    .map((entry) => entry.ID);

  return { connectionTypes, operators, outOfService };
}

export function fetchReferenceData(): Promise<ReferenceData> {
  return cached(
    "referencedata",
    async () => shape(await ocmRequest<RawReference>(OCM_REFERENCE, new URLSearchParams())),
    { freshMs: 24 * 60 * 60 * 1000, staleMs: 7 * 24 * 60 * 60 * 1000 }
  );
}
