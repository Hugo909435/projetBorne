import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";

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
          <Image src="/logo.png" alt="" width={81} height={96} className="h-8 w-auto" priority />
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
            className="absolute right-0 top-11 flex w-52 flex-col gap-1 rounded-2xl border border-line bg-card p-2 shadow-xl shadow-forest-950/10"
            aria-label="Mobile navigation"
          >
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
            <div className="mt-1 border-t border-line pt-2">
              <LanguageSwitcher className="w-full" variant="light" />
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
