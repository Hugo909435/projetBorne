import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";
import CookieSettingsLink from "@/components/cookies/CookieSettingsLink";

export default function Footer() {
  const t = useTranslations("Footer");
  const tMeta = useTranslations("Meta");

  return (
    <footer className="grain bg-forest-950 text-cream">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="" width={81} height={96} className="h-8 w-auto" />
              <p className="font-display text-lg font-semibold text-lime-300">
                ma-borne-électrique
              </p>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/70">
              {tMeta("description")}
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-4 inline-block text-sm font-medium text-lime-300 underline decoration-lime-300/40 underline-offset-4 hover:decoration-lime-300"
            >
              {site.email}
            </a>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-cream/50">
              {t("resourcesHeading")}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-cream/80 hover:text-lime-300">
                  {t("blogLink")}
                </Link>
              </li>
              <li>
                <Link href="/blog/voiture-electrique" className="text-cream/80 hover:text-lime-300">
                  {t("carsLink")}
                </Link>
              </li>
              <li>
                <Link href="/blog/types-de-bornes-electriques" className="text-cream/80 hover:text-lime-300">
                  {t("connectorsLink")}
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-cream/80 hover:text-lime-300">
                  {t("aboutLink")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-cream/50">
              {t("informationHeading")}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-cream/80 hover:text-lime-300">
                  {t("contactLink")}
                </Link>
              </li>
              <li>
                <CookieSettingsLink className="text-cream/80 hover:text-lime-300" />
              </li>
              <li>
                <Link href="/mentions-legales" className="text-cream/80 hover:text-lime-300">
                  {t("legalLink")}
                </Link>
              </li>
              <li>
                <Link href="/politique-de-confidentialite" className="text-cream/80 hover:text-lime-300">
                  {t("privacyLink")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-cream/10 pt-6 text-xs text-cream/50 md:flex-row md:items-center md:justify-between">
          <p>{t("rights", { year: new Date().getFullYear() })}</p>
          <p>
            {t.rich("attribution", {
              ocm: (chunks) => (
                <a href="https://openchargemap.org" className="underline hover:text-lime-300">
                  {chunks}
                </a>
              ),
              osm: (chunks) => (
                <a
                  href="https://www.openstreetmap.org/copyright"
                  className="underline hover:text-lime-300"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </div>
      </div>
    </footer>
  );
}
