"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LANGUAGE_FLAGS: Record<string, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
  de: "🇩🇪",
  es: "🇪🇸",
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

  const variantClasses =
    variant === "dark"
      ? "border-white/20 text-white hover:border-lime-300"
      : "border-line text-ink-900 hover:border-green-500";

  return (
    <select
      aria-label="Language"
      value={locale}
      onChange={(e) => router.replace(pathname, { locale: e.target.value })}
      className={`cursor-pointer rounded-full border bg-transparent px-3 py-1.5 text-base font-medium outline-none transition ${variantClasses} ${className}`}
    >
      {routing.locales.map((code) => (
        <option key={code} value={code}>
          {LANGUAGE_FLAGS[code]}
        </option>
      ))}
    </select>
  );
}
