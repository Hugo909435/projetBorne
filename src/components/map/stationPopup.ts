import type { Station, StationConnection, StationDetail } from "@/lib/openChargeMap";
import type { ReferenceData } from "@/lib/ocmReference";

/**
 * Builds a station popup as DOM nodes.
 *
 * Everything here goes through `textContent`: titles, addresses and comments
 * are contributor-submitted text from Open Charge Map, and must never reach the
 * page as markup.
 *
 * The popup renders in two passes. The first is instant, from the data the map
 * already holds. The second fills in the detail slot once the per-station
 * request lands, so opening a popup never waits on the network.
 */

export type PopupLabels = {
  powerFast: (kw: number) => string;
  powerAccelerated: (kw: number) => string;
  powerStandard: (kw: number) => string;
  powerUnknown: string;
  connectors: string;
  unknownConnector: string;
  points: (count: number) => string;
  verified: (date: string) => string;
  cost: string;
  accessInfo: string;
  note: string;
  phone: string;
  website: string;
  directions: string;
  detailLoading: string;
  accessTypes: Record<number, string>;
  statusTypes: Record<number, string>;
  currentTypes: Record<number, string>;
};

export type PopupContent = {
  root: HTMLElement;
  /** Node the lazily loaded detail is rendered into. */
  detailSlot: HTMLElement;
  /** Connector list, re-rendered from the richer detail once it arrives. */
  connectorSlot: HTMLElement;
};

/** Connector shape the popup can render, from either the map or detail payload. */
type PopupConnection = StationConnection & { quantity?: number; amps?: number; volts?: number };

const OUT_OF_SERVICE_FALLBACK = [100, 150, 200, 210];
/** Statuses that mean "you probably can't charge right now" without being broken. */
const WARNING_STATUSES = [20, 30, 75];

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  textContent?: string
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (textContent != null) node.textContent = textContent;
  return node;
}

function maxPowerKw(connections: StationConnection[]): number | null {
  return connections.reduce<number | null>((max, c) => {
    if (c.powerKw == null) return max;
    return max == null ? c.powerKw : Math.max(max, c.powerKw);
  }, null);
}

function powerLabel(kw: number | null, labels: PopupLabels): string {
  if (kw == null) return labels.powerUnknown;
  if (kw >= 50) return labels.powerFast(kw);
  if (kw >= 22) return labels.powerAccelerated(kw);
  return labels.powerStandard(kw);
}

function statusTone(statusId: number | undefined, reference: ReferenceData | null): string {
  if (statusId == null) return "";
  const broken = reference?.outOfService.length ? reference.outOfService : OUT_OF_SERVICE_FALLBACK;
  if (broken.includes(statusId)) return " bornes-popup__badge--bad";
  if (WARNING_STATUSES.includes(statusId)) return " bornes-popup__badge--warn";
  return " bornes-popup__badge--good";
}

/** External links come from contributor data: only ever plain http(s). */
function safeUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function externalLink(href: string, text: string, className: string): HTMLAnchorElement {
  const link = el("a", className, text);
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer nofollow";
  return link;
}

function addRow(parent: HTMLElement, label: string, value: string): void {
  const row = el("p", "bornes-popup__row");
  row.appendChild(el("span", "bornes-popup__row-label", label));
  row.appendChild(el("span", undefined, value));
  parent.appendChild(row);
}

/**
 * Fills a connector list. Used twice per popup: first from the map payload,
 * then again from the detail payload, which knows how many of each connector
 * the location has and at what amperage.
 */
function renderConnectors(
  list: HTMLElement,
  connections: PopupConnection[],
  labels: PopupLabels,
  reference: ReferenceData | null
): void {
  list.textContent = "";
  // A station with no connector data at all shouldn't show an empty heading.
  if (list.parentElement) list.parentElement.hidden = connections.length === 0;
  for (const connection of connections) {
    const name =
      (connection.typeId != null ? reference?.connectionTypes[connection.typeId] : undefined) ??
      labels.unknownConnector;

    const item = el("li", "bornes-popup__connector");
    item.appendChild(
      el(
        "span",
        "bornes-popup__connector-name",
        connection.quantity && connection.quantity > 1 ? `${connection.quantity} × ${name}` : name
      )
    );

    const current =
      connection.currentTypeId != null ? labels.currentTypes[connection.currentTypeId] : undefined;
    const amperage =
      connection.amps != null && connection.volts != null
        ? `${connection.volts} V · ${connection.amps} A`
        : undefined;
    const aside = [current, amperage].filter(Boolean).join(" · ");
    if (aside) item.appendChild(el("span", "bornes-popup__connector-current", aside));

    if (connection.powerKw != null) {
      item.appendChild(el("span", "bornes-popup__connector-power", `${connection.powerKw} kW`));
    }
    list.appendChild(item);
  }
}

export function buildPopupContent(
  station: Station,
  labels: PopupLabels,
  reference: ReferenceData | null
): PopupContent {
  const root = el("div", "bornes-popup");

  root.appendChild(el("p", "bornes-popup__title", station.title));

  const address = [station.address, station.postcode, station.town].filter(Boolean).join(", ");
  if (address) root.appendChild(el("p", "bornes-popup__address", address));

  const badges = el("div", "bornes-popup__badges");
  badges.appendChild(
    el(
      "span",
      "bornes-popup__badge bornes-popup__badge--power",
      powerLabel(maxPowerKw(station.connections), labels)
    )
  );

  const status = station.statusTypeId != null ? labels.statusTypes[station.statusTypeId] : undefined;
  if (status) {
    badges.appendChild(
      el("span", `bornes-popup__badge${statusTone(station.statusTypeId, reference)}`, status)
    );
  }

  const access = station.usageTypeId != null ? labels.accessTypes[station.usageTypeId] : undefined;
  if (access) badges.appendChild(el("span", "bornes-popup__badge", access));

  root.appendChild(badges);

  const connectorSection = el("div", "bornes-popup__section");
  connectorSection.appendChild(el("p", "bornes-popup__heading", labels.connectors));
  const connectorSlot = el("ul", "bornes-popup__connectors");
  connectorSection.appendChild(connectorSlot);
  // Appended even when empty: the detail pass may still turn up connectors,
  // and renderConnectors hides the section for as long as there are none.
  root.appendChild(connectorSection);
  renderConnectors(connectorSlot, station.connections, labels, reference);

  const meta = el("div", "bornes-popup__meta");
  if (station.points != null) {
    meta.appendChild(el("p", "bornes-popup__row", labels.points(station.points)));
  }

  if (station.verifiedOn) {
    meta.appendChild(el("p", "bornes-popup__row bornes-popup__muted", labels.verified(station.verifiedOn)));
  }
  if (meta.childElementCount) root.appendChild(meta);

  const detailSlot = el("div", "bornes-popup__detail");
  root.appendChild(detailSlot);

  const actions = el("div", "bornes-popup__actions");
  actions.appendChild(
    externalLink(
      `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lon}`,
      labels.directions,
      "bornes-popup__action"
    )
  );
  root.appendChild(actions);

  return { root, detailSlot, connectorSlot };
}

/** Placeholder shown only if the detail request is slow enough to be noticed. */
export function detailPlaceholder(labels: PopupLabels): HTMLElement {
  return el("p", "bornes-popup__muted", labels.detailLoading);
}

/** Second pass: fills the slots left by `buildPopupContent`. */
export function renderDetail(
  content: PopupContent,
  detail: StationDetail | null,
  labels: PopupLabels,
  reference: ReferenceData | null
): void {
  const slot = content.detailSlot;
  slot.textContent = "";
  if (!detail) return;

  // The detail payload knows how many of each connector there are and at what
  // amperage, so it replaces the list built from the lighter map payload.
  if (detail.connections.length) {
    renderConnectors(content.connectorSlot, detail.connections, labels, reference);
  }

  if (detail.usageCost) addRow(slot, labels.cost, detail.usageCost);
  if (detail.accessComments) addRow(slot, labels.accessInfo, detail.accessComments);
  if (detail.comments) addRow(slot, labels.note, detail.comments);
  if (detail.phone) addRow(slot, labels.phone, detail.phone);

  const url = safeUrl(detail.url);
  if (url) {
    const row = el("p", "bornes-popup__row");
    row.appendChild(externalLink(url, labels.website, "bornes-popup__link"));
    slot.appendChild(row);
  }
}
