"use client";

import { useRef } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LANGUAGE_FLAGS: Record<string, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
  de: "🇩🇪",
  es: "🇪🇸",
};

const LANGUAGE_NAMES: Record<string, string> = {
  fr: "Français",
  en: "English",
  de: "Deutsch",
  es: "Español",
};

export default function LanguageSwitcher({
  className = "",
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const variantClasses =
    variant === "dark"
      ? "border-white/20 text-white hover:border-lime-300"
      : "border-line text-ink-900 hover:border-green-500";

  const menuClasses =
    variant === "dark"
      ? "border-white/10 bg-forest-900 text-white"
      : "border-line bg-card text-ink-900";

  const itemHoverClasses = variant === "dark" ? "hover:bg-white/10" : "hover:bg-sand-200";

  return (
    <details ref={detailsRef} className={`relative ${className}`}>
      <summary
        aria-label="Language"
        className={`flex cursor-pointer list-none items-center gap-1.5 rounded-full border bg-transparent px-3 py-1.5 text-sm font-medium outline-none transition ${variantClasses}`}
      >
        <span aria-hidden="true">{LANGUAGE_FLAGS[locale]}</span>
        <span className="uppercase">{locale}</span>
      </summary>
      <div
        className={`absolute right-0 top-11 z-10 flex w-40 flex-col gap-0.5 rounded-2xl border p-1.5 shadow-xl shadow-forest-950/10 ${menuClasses}`}
      >
        {routing.locales.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => {
              router.replace(pathname, { locale: code });
              detailsRef.current?.removeAttribute("open");
            }}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium transition ${itemHoverClasses} ${
              code === locale ? "" : "opacity-80"
            }`}
          >
            <span aria-hidden="true">{LANGUAGE_FLAGS[code]}</span>
            {LANGUAGE_NAMES[code]}
          </button>
        ))}
      </div>
    </details>
  );
}
