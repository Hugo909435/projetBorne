import type { Locale } from "@/i18n/routing";

export const site = {
  name: "ma-borne-electrique.com",
  shortName: "ma-borne-électrique",
  url: "https://ma-borne-electrique.com",
  email: "contact@ma-borne-electrique.com",
  contactUserAgent: "ma-borne-electrique.com/1.0 (contact@ma-borne-electrique.com)",
};

export const ogLocales: Record<string, string> = {
  fr: "fr_FR",
  en: "en_US",
  de: "de_DE",
  es: "es_ES",
};

export const author = {
  name: "Hugo Beignon",
  url: site.url,
  photo: "/images/authors/hugo-beignon.jpg",
  linkedin: "https://www.linkedin.com/in/hugo-beignon-3ab500366/",
  role: {
    fr: "Fondateur de ma-borne-electrique.com",
    en: "Founder of ma-borne-electrique.com",
    de: "Gründer von ma-borne-electrique.com",
    es: "Fundador de ma-borne-electrique.com",
  } as Record<Locale, string>,
  bio: {
    fr: "Développeur d'applications le jour, toujours à l'affût des nouveautés sur la recharge électrique le soir. Je traque les meilleures bornes et partage mes astuces pour rouler électrique sans prise de tête.",
    en: "App developer by day, always keeping an eye on what's new in EV charging by night. I track down the best charging stations and share tips to make electric driving simple.",
    de: "Tagsüber App-Entwickler, abends immer auf dem Laufenden, was sich bei E-Ladestationen tut. Ich spüre die besten Ladestationen auf und teile Tipps für entspanntes Elektrofahren.",
    es: "Desarrollador de aplicaciones de día, siempre atento a las novedades de la recarga eléctrica por la noche. Rastreo los mejores puntos de recarga y comparto consejos para conducir eléctrico sin complicaciones.",
  } as Record<Locale, string>,
};

export const byLabel: Record<Locale, string> = {
  fr: "Par",
  en: "By",
  de: "Von",
  es: "Por",
};

export function localePath(locale: string, path: string = "/"): string {
  return `${site.url}/${locale}${path === "/" ? "" : path}`;
}

/** Builds the `alternates.languages` map for hreflang tags. */
export function languageAlternates(path: string = "/"): Record<string, string> {
  return {
    fr: localePath("fr", path),
    en: localePath("en", path),
    de: localePath("de", path),
    es: localePath("es", path),
    "x-default": localePath("fr", path),
  };
}
