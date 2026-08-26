"use client";

import { useEffect, useRef } from "react";
import type { Station } from "@/lib/openChargeMap";
import { buildPopupContent, detailPlaceholder, renderDetail } from "@/components/map/stationPopup";
import { loadDetail, usePopupLabels, useReferenceData } from "@/lib/stationPopupData";

/** Long enough that a cached detail response never flashes a loading line. */
const DETAIL_PLACEHOLDER_DELAY_MS = 400;

/** Mounts the same station detail (badges, connectors, directions...) used everywhere a station is shown. */
export default function StationPopupContent({ station }: { station: Station }) {
  const labels = usePopupLabels();
  const reference = useReferenceData();
  const labelsRef = useRef(labels);
  useEffect(() => {
    labelsRef.current = labels;
  });

  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const content = buildPopupContent(station, labelsRef.current, reference);
    mount.appendChild(content.root);

    let cancelled = false;
    const placeholder = setTimeout(() => {
      if (cancelled || content.detailSlot.childElementCount) return;
      content.detailSlot.appendChild(detailPlaceholder(labelsRef.current));
    }, DETAIL_PLACEHOLDER_DELAY_MS);

    loadDetail(station.id).then((detail) => {
      clearTimeout(placeholder);
      if (cancelled) return;
      renderDetail(content, detail, labelsRef.current, reference);
    });

    return () => {
      cancelled = true;
      clearTimeout(placeholder);
      content.root.remove();
    };
  }, [station, reference]);

  return <div ref={mountRef} />;
}
