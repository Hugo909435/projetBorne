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
        {/* Brand overview row */}
        <div className="mb-12 flex flex-col gap-4 border-b border-cream/10 pb-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="" width={81} height={96} className="h-11 w-auto" />
              <p className="font-display text-lg font-semibold text-lime-300">
                ma-borne-électrique
              </p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-cream/70">
              {tMeta("description")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`mailto:${site.email}`}
              className="text-sm font-medium text-lime-300 underline decoration-lime-300/40 underline-offset-4 hover:decoration-lime-300"
            >
              {site.email}
            </a>
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 text-cream/80 transition hover:border-lime-300 hover:text-lime-300"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
              </svg>
            </a>
          </div>
        </div>

        {/* 4-column SEO navigation grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Bornes par région */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-cream/50">
              {t("departmentsHeading")}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/bornes-recharge" className="font-medium text-lime-300 hover:underline">
                  {t("allDepartmentsLink")} →
                </Link>
              </li>
              <li>
                <Link href="/bornes-recharge/paris" className="text-cream/80 hover:text-lime-300">
                  Paris (75)
                </Link>
              </li>
              <li>
                <Link href="/bornes-recharge/bouches-du-rhone" className="text-cream/80 hover:text-lime-300">
                  Bouches-du-Rhône (13)
                </Link>
              </li>
              <li>
                <Link href="/bornes-recharge/rhone" className="text-cream/80 hover:text-lime-300">
                  Rhône (69)
                </Link>
              </li>
              <li>
                <Link href="/bornes-recharge/nord" className="text-cream/80 hover:text-lime-300">
                  Nord (59)
                </Link>
              </li>
              <li>
                <Link href="/bornes-recharge/gironde" className="text-cream/80 hover:text-lime-300">
                  Gironde (33)
                </Link>
              </li>
              <li>
                <Link href="/bornes-recharge/haute-garonne" className="text-cream/80 hover:text-lime-300">
                  Haute-Garonne (31)
                </Link>
              </li>
              <li>
                <Link href="/bornes-recharge/loire-atlantique" className="text-cream/80 hover:text-lime-300">
                  Loire-Atlantique (44)
                </Link>
              </li>
              <li>
                <Link href="/bornes-recharge/alpes-maritimes" className="text-cream/80 hover:text-lime-300">
                  Alpes-Maritimes (06)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Véhicules et modèles */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-cream/50">
              {t("modelsHeading")}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/recharge" className="font-medium text-lime-300 hover:underline">
                  {t("allModelsLink")} →
                </Link>
              </li>
              <li>
                <Link href="/recharge/tesla-model-y" className="text-cream/80 hover:text-lime-300">
                  Tesla Model Y
                </Link>
              </li>
              <li>
                <Link href="/recharge/tesla-model-3" className="text-cream/80 hover:text-lime-300">
                  Tesla Model 3
                </Link>
              </li>
              <li>
                <Link href="/recharge/renault-5-e-tech" className="text-cream/80 hover:text-lime-300">
                  Renault 5 E-Tech
                </Link>
              </li>
              <li>
                <Link href="/recharge/peugeot-e-208" className="text-cream/80 hover:text-lime-300">
                  Peugeot e-208
                </Link>
              </li>
              <li>
                <Link href="/recharge/renault-megane-e-tech" className="text-cream/80 hover:text-lime-300">
                  Renault Megane E-Tech
                </Link>
              </li>
              <li>
                <Link href="/recharge/dacia-spring" className="text-cream/80 hover:text-lime-300">
                  Dacia Spring
                </Link>
              </li>
              <li>
                <Link href="/recharge/volkswagen-id3" className="text-cream/80 hover:text-lime-300">
                  Volkswagen ID.3
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Réseaux & Fiabilité */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-cream/50">
              {t("networksHeading")}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/reseaux" className="font-medium text-lime-300 hover:underline">
                  {t("allNetworksLink")} →
                </Link>
              </li>
              <li>
                <Link href="/reseaux/tesla-supercharger" className="text-cream/80 hover:text-lime-300">
                  Tesla Supercharger
                </Link>
              </li>
              <li>
                <Link href="/reseaux/ionity" className="text-cream/80 hover:text-lime-300">
                  Ionity
                </Link>
              </li>
              <li>
                <Link href="/reseaux/totalenergies" className="text-cream/80 hover:text-lime-300">
                  TotalEnergies
                </Link>
              </li>
              <li>
                <Link href="/reseaux/fastned" className="text-cream/80 hover:text-lime-300">
                  Fastned
                </Link>
              </li>
              <li>
                <Link href="/reseaux/electra" className="text-cream/80 hover:text-lime-300">
                  Electra
                </Link>
              </li>
              <li>
                <Link href="/fiabilite-bornes" className="font-medium text-lime-300 hover:underline">
                  {t("reliabilityLink")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Guides & Informations légales */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-cream/50">
              {t("guidesHeading")}
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
              irve: (chunks) => (
                <a
                  href="https://www.data.gouv.fr/datasets/beta-bases-nationales-des-points-de-recharge-pour-vehicules-electriques-en-france-irve"
                  className="underline hover:text-lime-300"
                >
                  {chunks}
                </a>
              ),
              bnetza: (chunks) => (
                <a
                  href="https://www.bundesnetzagentur.de/DE/Fachthemen/ElektrizitaetundGas/E-Mobilitaet/Ladesaeulenkarte/start.html"
                  className="underline hover:text-lime-300"
                >
                  {chunks}
                </a>
              ),
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
