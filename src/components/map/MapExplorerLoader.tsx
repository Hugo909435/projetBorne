"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { MapExplorerProps } from "./MapExplorer";

const MapExplorer = dynamic(() => import("./MapExplorer"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

export function MapSkeleton() {
  const t = useTranslations("Map");
  return (
    <div className="flex h-full w-full animate-pulse items-center justify-center rounded-[28px] bg-sand-200">
      <span className="text-sm font-medium text-green-700">{t("loadingStations")}</span>
    </div>
  );
}

export default function MapExplorerLoader(props: MapExplorerProps) {
  return <MapExplorer {...props} />;
}
