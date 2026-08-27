import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { site } from "@/lib/site";

export default function Header() {
  const t = useTranslations("Nav");

  const navLinks = [
    { href: "/#carte", label: t("map") },
    { href: "/blog", label: t("blog") },
    { href: "/a-propos", label: t("about") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-forest-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="" width={81} height={96} className="h-11 w-auto" priority />
          <span className="font-display text-[1.05rem] font-semibold text-white">
            MaBorne<em className="text-lime-300">Electrique</em>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white transition hover:text-lime-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={site.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:text-lime-300"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
            </svg>
          </a>
          <Link
            href="/contact"
            className="rounded-full bg-lime-400 px-4 py-2 text-sm font-semibold text-forest-950 transition hover:bg-lime-300"
          >
            {t("contact")}
          </Link>
          <LanguageSwitcher />
        </div>

        <details className="relative md:hidden">
          <summary
            className="flex cursor-pointer list-none items-center gap-1 rounded-full border border-white/20 px-3 py-1.5 text-sm font-medium text-white"
            aria-label={t("menu")}
          >
            {t("menu")}
          </summary>
          <nav
            className="absolute right-0 top-11 flex w-64 flex-col gap-1 rounded-2xl border border-line bg-card p-2 shadow-xl shadow-forest-950/10"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center gap-2.5 border-b border-line px-3 pb-3 pt-2">
              <Image src="/logo.png" alt="" width={81} height={96} className="h-14 w-auto" />
              <span className="font-display text-base font-semibold text-ink-900">
                MaBorne<em className="text-lime-500">Electrique</em>
              </span>
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2 text-sm font-medium text-ink-900 hover:bg-sand-200"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="rounded-xl px-3 py-2 text-sm font-medium text-ink-900 hover:bg-sand-200"
            >
              {t("contact")}
            </Link>
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="ml-3 flex h-8 w-8 items-center justify-center rounded-full text-ink-900 transition hover:text-lime-500"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
              </svg>
            </a>
            <div className="mt-1 border-t border-line pt-2">
              <LanguageSwitcher className="w-full" variant="light" />
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
