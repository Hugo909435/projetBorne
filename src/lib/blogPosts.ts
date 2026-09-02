import type { Locale } from "@/i18n/routing";

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] };

export type BlogImageCredit = {
  name: string;
  url: string;
  license: string;
};

export type BlogImage = {
  src: string;
  alt: Record<Locale, string>;
  credit: BlogImageCredit | null;
};

export type FaqItem = { question: string; answer: string };

export type BlogLocaleContent = {
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  body: BlogBlock[];
  faq: FaqItem[];
  ctaBefore: string;
  ctaLinkText: string;
  ctaAfter: string;
};

export type BlogPost = {
  slug: string;
  publishedAt: string;
  /** Set only when the post is meaningfully revised after publishing. */
  updatedAt?: string;
  image: BlogImage;
  content: Record<Locale, BlogLocaleContent>;
};

const LOCALE_TAGS: Record<Locale, string> = {
  fr: "fr-FR",
  en: "en-US",
  de: "de-DE",
  es: "es-ES",
};

export function formatBlogDate(locale: string, isoDate: string): string {
  const tag = LOCALE_TAGS[locale as Locale] ?? "en-US";
  return new Intl.DateTimeFormat(tag, { dateStyle: "long" }).format(new Date(isoDate));
}

const cta: Record<Locale, Pick<BlogLocaleContent, "ctaBefore" | "ctaLinkText" | "ctaAfter">> = {
  fr: {
    ctaBefore: "Envie de repérer une borne près de chez vous ? ",
    ctaLinkText: "Consultez la carte des bornes de recharge",
    ctaAfter: " pour préparer votre prochain trajet.",
  },
  en: {
    ctaBefore: "Want to find a charging station nearby? ",
    ctaLinkText: "Check the charging map",
    ctaAfter: " to plan your next trip.",
  },
  de: {
    ctaBefore: "Möchten Sie eine Ladestation in Ihrer Nähe finden? ",
    ctaLinkText: "Werfen Sie einen Blick auf die Ladekarte",
    ctaAfter: ", um Ihre nächste Fahrt zu planen.",
  },
  es: {
    ctaBefore: "¿Quieres localizar un punto de recarga cerca de ti? ",
    ctaLinkText: "Consulta el mapa de puntos de recarga",
    ctaAfter: " para preparar tu próximo trayecto.",
  },
};

export const blogPosts: BlogPost[] = [
  {
    slug: "droit-a-la-prise-copropriete",
    publishedAt: "2026-07-18",
    image: {
      src: "/blog/droit-a-la-prise-copropriete.jpg",
      alt: {
        fr: "Parking souterrain équipé de plusieurs bornes de recharge pour voitures électriques",
        en: "Underground parking garage equipped with several EV charging stations",
        de: "Tiefgarage mit mehreren Ladestationen für Elektroautos",
        es: "Aparcamiento subterráneo equipado con varios puntos de recarga para coches eléctricos",
      },
      credit: {
        name: "Wolfmann",
        url: "https://commons.wikimedia.org/wiki/File:KLOSTERGARASJEN_bilparkering_d%C3%B8gn%C3%A5pent_parkeringsanlegg_P-hus_plan_E_ladestasjoner_for_elbiler_(24-hour_open_underground_garage_940_parking_spots_charging_stations_for_electrical_cars)_BERGEN_NORWAY_2025-09-25_IMG_2761.jpg",
        license: "CC BY 4.0",
      },
    },
    content: {
      fr: {
        eyebrow: "Copropriété",
        title: "Droit à la prise en copropriété : comment installer sa borne en 2026",
        excerpt:
          "Le droit à la prise permet à tout copropriétaire ou locataire d'installer une borne à ses frais, sans vote en assemblée générale.",
        metaTitle: "Droit à la prise en copropriété 2026 : le guide complet",
        metaDescription:
          "Installer une borne de recharge dans son parking de copropriété : démarches, motifs de refus du syndic et obligations de pré-équipement en 2026.",
        body: [
          {
            type: "p",
            text: "De plus en plus de conducteurs de voitures électriques vivent en habitat collectif, et la question revient souvent : peut-on installer une borne dans son parking de copropriété sans l'accord de tous les autres copropriétaires ? La réponse est oui, grâce à un droit spécifique inscrit dans la loi depuis plusieurs années et précisé au fil des textes.",
          },
          { type: "h2", text: "Un droit inscrit dans la loi" },
          {
            type: "p",
            text: "Le droit à la prise permet à tout copropriétaire ou locataire, qui utilise ou souhaite utiliser un véhicule électrique, de demander l'installation, à ses frais, d'un point de recharge sur son emplacement de stationnement. Aucun vote en assemblée générale n'est nécessaire : le syndic ne peut pas s'y opposer sans motif valable.",
          },
          { type: "h2", text: "Les seuls motifs de refus valables" },
          {
            type: "p",
            text: "Deux motifs seulement permettent de refuser une demande : l'existence d'une infrastructure collective de recharge déjà accessible, ou une impossibilité technique avérée liée à la configuration électrique de l'immeuble. Point important : c'est au syndic, et non au demandeur, de prouver que l'un de ces deux motifs s'applique réellement.",
          },
          { type: "h2", text: "Les immeubles récents déjà équipés" },
          {
            type: "p",
            text: "Les bâtiments construits après le 1er janvier 2012 ont l'obligation de pré-équiper une partie des places de stationnement pour la recharge électrique. De même, dès qu'une copropriété engage des travaux importants sur son parking ou sur son installation électrique, elle doit intégrer ce pré-équipement au projet.",
          },
          { type: "h2", text: "Un sujet obligatoire en assemblée générale" },
          {
            type: "p",
            text: "Chaque copropriété doit désormais inscrire la question de l'installation de bornes de recharge à l'ordre du jour de son assemblée générale annuelle, dans le cadre de l'examen du budget. C'est l'occasion de mutualiser une réflexion sur une infrastructure collective plutôt que d'accumuler les demandes individuelles.",
          },
          { type: "h3", text: "Les étapes concrètes de la demande" },
          {
            type: "ul",
            items: [
              "Envoyer une demande écrite au syndic, accompagnée de la description technique de l'installation envisagée.",
              "Le syndic transmet le dossier au gestionnaire du réseau électrique de l'immeuble et informe les autres copropriétaires.",
              "Sans opposition motivée dans le délai légal, les travaux peuvent démarrer, à la charge financière du demandeur.",
              "En cas de refus injustifié ou de silence prolongé, le copropriétaire peut saisir le tribunal judiciaire.",
            ],
          },
        ],
        faq: [
          { question: "Ai-je besoin de l'accord de l'assemblée générale pour installer une borne de recharge ?", answer: "Non, le droit à la prise permet à tout copropriétaire ou locataire d'installer une borne à ses frais sur son emplacement de stationnement sans vote en assemblée générale." },
          { question: "Le syndic peut-il refuser l'installation d'une borne de recharge ?", answer: "Seulement dans deux cas : une infrastructure collective de recharge déjà accessible, ou une impossibilité technique avérée liée à l'installation électrique de l'immeuble. C'est au syndic de prouver l'un de ces deux motifs, pas au demandeur." },
          { question: "Que faire si le syndic refuse ma demande sans motif valable ?", answer: "En cas de refus injustifié ou de silence prolongé, vous pouvez saisir le tribunal judiciaire pour faire valoir votre droit à la prise." },
          { question: "Les immeubles récents sont-ils déjà équipés pour la recharge électrique ?", answer: "Les bâtiments construits après le 1er janvier 2012 ont l'obligation de pré-équiper une partie de leurs places de stationnement, tout comme les copropriétés qui réalisent des travaux importants sur leur parking ou leur installation électrique." },
        ],
        ...cta.fr,
      },
      en: {
        eyebrow: "Apartment Charging",
        title: "The Right to Charge in France: Installing an EV Charger as a Co-owner in 2026",
        excerpt:
          "In France, the 'droit à la prise' lets any co-owner or tenant install a charging point at their own expense, without a building vote.",
        metaTitle: "Right to Charge in France: Apartment EV Charging Rules 2026",
        metaDescription:
          "In France, any co-owner or tenant can install an EV charger on their parking space without a vote. Here's how the 'droit à la prise' works in 2026.",
        body: [
          {
            type: "p",
            text: "A growing share of EV drivers in France live in apartment buildings, and the same question keeps coming up: can you install a charging point on your co-ownership parking space without every other owner agreeing? The answer is yes, thanks to a specific legal right known as the 'droit à la prise', the right to charge.",
          },
          { type: "h2", text: "A right written into French law" },
          {
            type: "p",
            text: "Any co-owner or tenant using, or planning to use, an electric vehicle can request installation of a charging point on their own parking space, at their own expense. No vote at the general assembly is required, and the building manager (syndic) cannot block the request without a valid reason.",
          },
          { type: "h2", text: "Only two valid grounds for refusal" },
          {
            type: "p",
            text: "There are only two acceptable reasons to refuse: an existing collective charging infrastructure that's already accessible, or a proven technical impossibility tied to the building's electrical setup. Crucially, the burden of proof sits with the syndic, not with the person making the request.",
          },
          { type: "h2", text: "Newer buildings are already required to prepare" },
          {
            type: "p",
            text: "Buildings constructed after January 1, 2012 must pre-equip a share of their parking spaces for EV charging. And whenever a co-ownership undertakes major renovation work on its parking areas or electrical installation, that pre-equipment becomes part of the project by law.",
          },
          { type: "h2", text: "A mandatory item on the annual agenda" },
          {
            type: "p",
            text: "Every co-ownership must now put EV charging installation on the agenda of its annual general assembly, alongside the budget review, making it easier to plan shared infrastructure instead of handling requests one by one.",
          },
          { type: "h3", text: "The practical steps" },
          {
            type: "ul",
            items: [
              "Send a written request to the syndic with the technical details of the planned installation.",
              "The syndic forwards the file to the building's electrical grid manager and informs the other co-owners.",
              "Without a justified objection within the legal deadline, work can begin, at the requester's expense.",
              "If the refusal is unjustified or there's no response, the co-owner can take the case to court.",
            ],
          },
        ],
        faq: [
          { question: "Do I need approval from the general assembly to install a home charger in my building?", answer: "No. The 'droit à la prise' lets any co-owner or tenant install a charging point at their own expense on their parking space without a building-wide vote." },
          { question: "Can the building manager refuse my charging station request?", answer: "Only for two reasons: an existing collective charging system that's already accessible, or a proven technical impossibility tied to the building's electrical setup. The burden of proof is on the manager, not on you." },
          { question: "What can I do if the syndic refuses without a valid reason?", answer: "If the refusal is unjustified or you get no response, you can take the case to court to enforce your right to charge." },
          { question: "Are newer apartment buildings already set up for EV charging?", answer: "Buildings built after January 1, 2012 must pre-equip a share of their parking spaces, and the same applies whenever a co-ownership carries out major work on its parking area or electrical system." },
        ],
        ...cta.en,
      },
      de: {
        eyebrow: "Laden in der Wohnanlage",
        title: "Recht auf eine Ladestation: So installieren Eigentümer in Frankreich 2026 ihre Wallbox",
        excerpt:
          "In Frankreich erlaubt das 'droit à la prise' jedem Miteigentümer oder Mieter, auf eigene Kosten eine Ladestation zu installieren, ganz ohne Beschluss der Eigentümerversammlung.",
        metaTitle: "Ladestation in französischer Eigentumswohnung 2026: Das Recht auf eine Ladestation",
        metaDescription:
          "In Frankreich dürfen Miteigentümer und Mieter ohne Abstimmung auf eigene Kosten eine Ladestation installieren. So funktioniert das 'droit à la prise' 2026.",
        body: [
          {
            type: "p",
            text: "Immer mehr Elektroauto-Fahrer in Frankreich wohnen in Mehrfamilienhäusern, und die Frage stellt sich immer wieder: Darf man auf seinem Stellplatz in der Eigentümergemeinschaft eine Ladestation installieren, ohne dass alle anderen Eigentümer zustimmen? Die Antwort ist ja, dank eines eigenen gesetzlichen Rechts, dem 'droit à la prise'.",
          },
          { type: "h2", text: "Ein gesetzlich verankertes Recht" },
          {
            type: "p",
            text: "Jeder Miteigentümer oder Mieter, der ein Elektrofahrzeug nutzt oder nutzen möchte, kann verlangen, auf eigene Kosten eine Ladestation auf seinem Stellplatz zu installieren. Ein Beschluss der Eigentümerversammlung ist dafür nicht nötig, und die Hausverwaltung kann den Antrag nicht ohne triftigen Grund ablehnen.",
          },
          { type: "h2", text: "Nur zwei zulässige Ablehnungsgründe" },
          {
            type: "p",
            text: "Es gibt nur zwei akzeptierte Gründe für eine Ablehnung: eine bereits vorhandene, zugängliche gemeinschaftliche Ladeinfrastruktur, oder eine nachgewiesene technische Unmöglichkeit aufgrund der Elektroinstallation des Gebäudes. Wichtig: Die Beweislast liegt bei der Hausverwaltung, nicht beim Antragsteller.",
          },
          { type: "h2", text: "Neuere Gebäude sind bereits vorbereitet" },
          {
            type: "p",
            text: "Gebäude, die nach dem 1. Januar 2012 errichtet wurden, müssen einen Teil ihrer Stellplätze für die Elektromobilität vorrüsten. Und sobald eine Eigentümergemeinschaft größere Arbeiten am Parkplatz oder an der Elektroinstallation durchführt, muss diese Vorrüstung Teil des Projekts sein.",
          },
          { type: "h2", text: "Pflichtthema in der Jahresversammlung" },
          {
            type: "p",
            text: "Jede Eigentümergemeinschaft muss das Thema Ladeinfrastruktur inzwischen auf die Tagesordnung ihrer Jahresversammlung setzen, zusammen mit der Budgetprüfung, was eine gemeinsame Planung anstelle vieler Einzelanträge erleichtert.",
          },
          { type: "h3", text: "Die praktischen Schritte" },
          {
            type: "ul",
            items: [
              "Einen schriftlichen Antrag mit den technischen Details der geplanten Installation an die Hausverwaltung senden.",
              "Die Hausverwaltung leitet den Antrag an den Netzbetreiber des Gebäudes weiter und informiert die übrigen Eigentümer.",
              "Ohne begründeten Einspruch innerhalb der gesetzlichen Frist können die Arbeiten beginnen, auf Kosten des Antragstellers.",
              "Bei ungerechtfertigter Ablehnung oder Schweigen kann der Eigentümer den Fall vor Gericht bringen.",
            ],
          },
        ],
        faq: [
          { question: "Brauche ich die Zustimmung der Eigentümerversammlung für eine Ladestation?", answer: "Nein. Das 'droit à la prise' erlaubt jedem Miteigentümer oder Mieter, auf eigene Kosten eine Ladestation auf seinem Stellplatz zu installieren, ohne dass die Versammlung zustimmen muss." },
          { question: "Kann die Hausverwaltung meinen Antrag ablehnen?", answer: "Nur aus zwei Gründen: eine bereits vorhandene, zugängliche gemeinschaftliche Ladeinfrastruktur oder eine nachgewiesene technische Unmöglichkeit aufgrund der Elektroinstallation. Die Beweislast liegt bei der Verwaltung, nicht bei Ihnen." },
          { question: "Was kann ich tun, wenn die Verwaltung ohne triftigen Grund ablehnt?", answer: "Bei einer ungerechtfertigten Ablehnung oder ausbleibender Antwort können Sie den Fall vor Gericht bringen, um Ihr Recht auf eine Ladestation durchzusetzen." },
          { question: "Sind neuere Gebäude bereits auf Elektroladen vorbereitet?", answer: "Gebäude, die nach dem 1. Januar 2012 errichtet wurden, müssen einen Teil ihrer Stellplätze vorrüsten, ebenso wie Eigentümergemeinschaften, die größere Arbeiten am Parkplatz oder an der Elektroinstallation durchführen." },
        ],
        ...cta.de,
      },
      es: {
        eyebrow: "Recarga en comunidad",
        title: "Derecho a la toma en Francia: cómo instalar un punto de recarga en tu comunidad en 2026",
        excerpt:
          "En Francia, el 'droit à la prise' permite a cualquier propietario o inquilino instalar un punto de recarga a su cargo, sin necesidad de votación en junta.",
        metaTitle: "Derecho a la toma en Francia: recarga en comunidades de propietarios 2026",
        metaDescription:
          "En Francia, cualquier propietario o inquilino puede instalar un punto de recarga en su plaza sin votación. Así funciona el 'droit à la prise' en 2026.",
        body: [
          {
            type: "p",
            text: "Cada vez más conductores de coches eléctricos en Francia viven en edificios de pisos, y surge siempre la misma pregunta: ¿se puede instalar un punto de recarga en la plaza de garaje de una comunidad de propietarios sin el acuerdo de todos los demás? La respuesta es sí, gracias a un derecho específico conocido como 'droit à la prise'.",
          },
          { type: "h2", text: "Un derecho recogido en la ley" },
          {
            type: "p",
            text: "Cualquier propietario o inquilino que use, o quiera usar, un vehículo eléctrico puede solicitar la instalación, a su cargo, de un punto de recarga en su propia plaza. No hace falta ninguna votación en junta, y el administrador de la finca no puede oponerse sin un motivo válido.",
          },
          { type: "h2", text: "Solo dos motivos de denegación válidos" },
          {
            type: "p",
            text: "Solo hay dos razones aceptadas para denegar la solicitud: que exista ya una infraestructura colectiva de recarga accesible, o una imposibilidad técnica demostrada relacionada con la instalación eléctrica del edificio. Y es el administrador quien debe demostrar que se da alguno de esos dos motivos, no el solicitante.",
          },
          { type: "h2", text: "Los edificios recientes ya están preparados" },
          {
            type: "p",
            text: "Los edificios construidos después del 1 de enero de 2012 deben preinstalar la infraestructura necesaria en una parte de sus plazas de garaje. Y cuando una comunidad acomete obras importantes en el aparcamiento o en la instalación eléctrica, esa preinstalación pasa a formar parte obligatoria del proyecto.",
          },
          { type: "h2", text: "Un punto obligatorio en la junta anual" },
          {
            type: "p",
            text: "Toda comunidad de propietarios debe incluir ahora la instalación de puntos de recarga en el orden del día de su junta anual, junto con la revisión del presupuesto, lo que facilita planificar una infraestructura compartida en lugar de gestionar solicitudes una a una.",
          },
          { type: "h3", text: "Los pasos concretos" },
          {
            type: "ul",
            items: [
              "Enviar una solicitud por escrito al administrador, con la descripción técnica de la instalación prevista.",
              "El administrador traslada el expediente al gestor de la red eléctrica del edificio e informa al resto de propietarios.",
              "Sin oposición motivada dentro del plazo legal, las obras pueden comenzar, a cargo del solicitante.",
              "Ante una denegación injustificada o el silencio prolongado, el propietario puede acudir a los tribunales.",
            ],
          },
        ],
        faq: [
          { question: "¿Necesito la aprobación de la junta de propietarios para instalar un punto de recarga?", answer: "No. El 'droit à la prise' permite a cualquier propietario o inquilino instalar un punto de recarga a su cargo en su plaza, sin necesidad de votación en junta." },
          { question: "¿Puede el administrador denegar mi solicitud?", answer: "Solo por dos motivos: que ya exista una infraestructura colectiva de recarga accesible, o una imposibilidad técnica demostrada relacionada con la instalación eléctrica del edificio. Es el administrador quien debe demostrarlo, no tú." },
          { question: "¿Qué puedo hacer si el administrador deniega sin motivo válido?", answer: "Ante una denegación injustificada o el silencio prolongado, puedes acudir a los tribunales para hacer valer tu derecho a la toma." },
          { question: "¿Los edificios recientes ya están preparados para la recarga eléctrica?", answer: "Los edificios construidos después del 1 de enero de 2012 deben preinstalar parte de sus plazas, igual que las comunidades que acometen obras importantes en el aparcamiento o la instalación eléctrica." },
        ],
        ...cta.es,
      },
    },
  },
  {
    slug: "leasing-social-2026",
    publishedAt: "2026-07-22",
    image: {
      src: "/blog/leasing-social-2026.jpg",
      alt: {
        fr: "Renault Zoe, un modèle de voiture électrique compacte et abordable",
        en: "A Renault Zoe, a compact and affordable electric car model",
        de: "Ein Renault Zoe, ein kompaktes und erschwingliches Elektroauto",
        es: "Un Renault Zoe, un modelo de coche eléctrico compacto y asequible",
      },
      credit: {
        name: "Mariordo (Geison Cardoso and Mario Duran Ortiz)",
        url: "https://commons.wikimedia.org/wiki/File:Renault_Zoe_Brasilia_03_2015_3010.JPG",
        license: "CC BY-SA 4.0",
      },
    },
    content: {
      fr: {
        eyebrow: "Aides et primes",
        title: "Leasing social 2026 : la voiture électrique de retour dès 94 € par mois",
        excerpt:
          "Le leasing social électrique est de retour depuis le 16 juillet 2026, avec des mensualités à partir de 94 € pour 18 modèles éligibles.",
        metaTitle: "Leasing social 2026 : montants, conditions et voitures éligibles",
        metaDescription:
          "Le leasing social revient le 16 juillet 2026 avec 18 modèles électriques dès 94 €/kWh. Montants d'aide, conditions d'éligibilité et plafond de loyer à jour.",
        body: [
          {
            type: "p",
            text: "Le dispositif est de retour depuis le 16 juillet 2026, pour sa troisième édition après le lancement de 2024 et la reconduction de septembre 2025. Objectif inchangé : permettre aux ménages modestes d'accéder à une voiture électrique neuve pour un loyer mensuel très inférieur au marché.",
          },
          { type: "h2", text: "Un financement qui change de nature" },
          {
            type: "p",
            text: "Contrairement aux éditions précédentes, l'aide n'est plus financée directement par le budget de l'État mais via le mécanisme des certificats d'économies d'énergie (CEE), qui oblige les fournisseurs d'énergie à financer des actions de transition écologique.",
          },
          { type: "h2", text: "Des montants d'aide qui grimpent avec la fabrication européenne" },
          {
            type: "p",
            text: "L'aide de base atteint 6 500 €, portée à 9 000 € si le véhicule et sa batterie sont fabriqués dans l'Espace économique européen, et jusqu'à 9 500 € si le moteur électrique l'est également. Le plafond du loyer mensuel a par ailleurs été relevé de 150 € à 200 €, et les prix démarrent désormais à 94 € par mois sur 18 modèles éligibles.",
          },
          { type: "h2", text: "Qui peut en profiter" },
          {
            type: "p",
            text: "Les ménages ayant déjà bénéficié du leasing social en 2024 ou en 2025 ne sont pas éligibles à cette édition 2026. L'État a mobilisé une enveloppe de 401 millions d'euros, avec pour objectif d'équiper au moins 50 000 foyers supplémentaires.",
          },
          { type: "h3", text: "À retenir" },
          {
            type: "ul",
            items: [
              "Retour du dispositif le 16 juillet 2026, financé par les certificats d'économies d'énergie.",
              "Aide de 6 500 € à 9 500 € selon l'origine de fabrication du véhicule et de la batterie.",
              "Plafond de loyer relevé à 200 € par mois, prix affichés dès 94 €/mois.",
              "18 modèles électriques éligibles, non cumulable pour les bénéficiaires de 2024 ou 2025.",
            ],
          },
        ],
        faq: [
          { question: "Quand le leasing social 2026 a-t-il commencé ?", answer: "Le dispositif est revenu le 16 juillet 2026, pour sa troisième édition après 2024 et 2025." },
          { question: "Combien coûte le leasing social par mois ?", answer: "Les prix démarrent à partir de 94 € par mois, avec un plafond de loyer relevé à 200 € pour 2026." },
          { question: "Puis-je bénéficier du leasing social si j'en ai déjà profité en 2024 ou 2025 ?", answer: "Non, les ménages ayant déjà bénéficié du dispositif en 2024 ou 2025 ne sont pas éligibles à l'édition 2026." },
          { question: "Comment le leasing social est-il financé en 2026 ?", answer: "Il n'est plus financé par le budget de l'État mais par le mécanisme des certificats d'économies d'énergie (CEE), qui oblige les fournisseurs d'énergie à financer des actions de transition écologique." },
        ],
        ...cta.fr,
      },
      en: {
        eyebrow: "Grants & Incentives",
        title: "France's Social Leasing Scheme Returns in 2026: Electric Cars From €94 a Month",
        excerpt:
          "France's social leasing scheme for electric cars is back since July 16, 2026, with 18 models starting at €94 a month.",
        metaTitle: "France Social Leasing 2026: EV Lease Deals From 94 Euros a Month",
        metaDescription:
          "France's subsidized EV leasing program restarted on July 16, 2026, with 18 models from 94 euros a month. Here's how the aid and eligibility rules work.",
        body: [
          {
            type: "p",
            text: "France's subsidized electric-car leasing scheme returned on July 16, 2026, its third edition after the 2024 launch and the September 2025 renewal. The idea stays the same: let lower-income households drive a new electric car for a monthly payment well below market rates.",
          },
          { type: "h2", text: "A new way of funding it" },
          {
            type: "p",
            text: "Unlike previous editions, the aid is no longer financed directly from the state budget. It now runs through the CEE mechanism, energy-savings certificates that require energy suppliers to fund ecological transition actions.",
          },
          { type: "h2", text: "Bigger aid for European-made vehicles" },
          {
            type: "p",
            text: "The base aid is 6,500 euros, rising to 9,000 euros if the vehicle and its battery are made in the European Economic Area, and up to 9,500 euros if the motor is also EEA-made. The monthly rental cap was also raised, from 150 to 200 euros, with prices now starting at 94 euros a month across 18 eligible models.",
          },
          { type: "h2", text: "Who can apply" },
          {
            type: "p",
            text: "Households that already benefited from the scheme in 2024 or 2025 aren't eligible for the 2026 edition. The government has allocated a 401 million euro budget, aiming to equip at least 50,000 more households.",
          },
          { type: "h3", text: "The key numbers" },
          {
            type: "ul",
            items: [
              "The scheme returned on July 16, 2026, funded through energy-savings certificates.",
              "Aid ranges from 6,500 to 9,500 euros depending on where the vehicle and battery are made.",
              "The monthly rental cap rose to 200 euros, with listed prices starting at 94 euros.",
              "18 eligible electric models, not open to 2024 or 2025 beneficiaries.",
            ],
          },
        ],
        faq: [
          { question: "When did France's 2026 social leasing scheme start?", answer: "It returned on July 16, 2026, its third edition after the 2024 and 2025 rounds." },
          { question: "How much does social leasing cost per month?", answer: "Prices start from 94 euros a month, with the monthly rental cap raised to 200 euros for 2026." },
          { question: "Can I get social leasing again if I already used it in 2024 or 2025?", answer: "No, households that already benefited in 2024 or 2025 aren't eligible for the 2026 edition." },
          { question: "How is the 2026 social leasing scheme funded?", answer: "It's no longer financed from the state budget. It now runs through the CEE mechanism, energy-savings certificates that require energy suppliers to fund ecological transition actions." },
        ],
        ...cta.en,
      },
      de: {
        eyebrow: "Förderungen",
        title: "Soziales Leasing 2026 in Frankreich: Elektroautos schon ab 94 Euro im Monat",
        excerpt:
          "In Frankreich ist das soziale Leasing für Elektroautos seit dem 16. Juli 2026 zurück, mit 18 Modellen ab 94 Euro im Monat.",
        metaTitle: "Soziales Leasing Frankreich 2026: E-Auto schon ab 94 Euro im Monat",
        metaDescription:
          "Seit dem 16. Juli 2026 ist das französische Sozialleasing für Elektroautos zurück: 18 Modelle ab 94 Euro im Monat. Förderhöhen und Bedingungen im Überblick.",
        body: [
          {
            type: "p",
            text: "Das französische Sozialleasing für Elektroautos ist seit dem 16. Juli 2026 zurück, in seiner dritten Auflage nach dem Start 2024 und der Verlängerung im September 2025. Die Idee bleibt gleich: einkommensschwächeren Haushalten den Zugang zu einem neuen Elektroauto zu einer deutlich unter Marktniveau liegenden Monatsrate zu ermöglichen.",
          },
          { type: "h2", text: "Eine neue Finanzierungsart" },
          {
            type: "p",
            text: "Anders als in früheren Auflagen wird die Förderung nicht mehr direkt aus dem Staatshaushalt finanziert, sondern über den CEE-Mechanismus, Energieeinsparzertifikate, die Energieversorger zur Finanzierung von Klimaschutzmaßnahmen verpflichten.",
          },
          { type: "h2", text: "Höhere Förderung für europäische Fertigung" },
          {
            type: "p",
            text: "Die Basisförderung liegt bei 6.500 Euro, steigt auf 9.000 Euro, wenn Fahrzeug und Batterie im Europäischen Wirtschaftsraum gefertigt werden, und auf bis zu 9.500 Euro, wenn auch der Elektromotor dort produziert wird. Die monatliche Ratenobergrenze wurde zudem von 150 auf 200 Euro angehoben, die Preise starten nun bei 94 Euro monatlich für 18 förderfähige Modelle.",
          },
          { type: "h2", text: "Wer teilnehmen kann" },
          {
            type: "p",
            text: "Haushalte, die 2024 oder 2025 bereits vom Programm profitiert haben, sind für die Auflage 2026 nicht mehr berechtigt. Der Staat hat ein Budget von 401 Millionen Euro bereitgestellt, mit dem Ziel, mindestens 50.000 weitere Haushalte auszustatten.",
          },
          { type: "h3", text: "Die wichtigsten Zahlen" },
          {
            type: "ul",
            items: [
              "Rückkehr des Programms am 16. Juli 2026, finanziert über Energieeinsparzertifikate.",
              "Förderung zwischen 6.500 und 9.500 Euro, je nach Herkunft von Fahrzeug und Batterie.",
              "Ratenobergrenze auf 200 Euro angehoben, Einstiegspreise ab 94 Euro monatlich.",
              "18 förderfähige Elektromodelle, nicht verfügbar für Begünstigte von 2024 oder 2025.",
            ],
          },
        ],
        faq: [
          { question: "Wann startete das französische Sozialleasing 2026?", answer: "Es kehrte am 16. Juli 2026 zurück, in seiner dritten Auflage nach 2024 und 2025." },
          { question: "Wie viel kostet das Sozialleasing pro Monat?", answer: "Die Preise starten bei 94 Euro im Monat, die monatliche Ratenobergrenze wurde 2026 auf 200 Euro angehoben." },
          { question: "Kann ich erneut teilnehmen, wenn ich schon 2024 oder 2025 profitiert habe?", answer: "Nein, Haushalte, die 2024 oder 2025 bereits teilgenommen haben, sind für die Auflage 2026 nicht berechtigt." },
          { question: "Wie wird das Sozialleasing 2026 finanziert?", answer: "Nicht mehr aus dem Staatshaushalt, sondern über den CEE-Mechanismus, Energieeinsparzertifikate, die Energieversorger zur Finanzierung von Klimaschutzmaßnahmen verpflichten." },
        ],
        ...cta.de,
      },
      es: {
        eyebrow: "Ayudas",
        title: "El leasing social 2026 vuelve en Francia: coches eléctricos desde 94 euros al mes",
        excerpt:
          "El leasing social eléctrico está de vuelta en Francia desde el 16 de julio de 2026, con 18 modelos desde 94 euros al mes.",
        metaTitle: "Leasing social en Francia 2026: eléctricos desde 94 euros al mes",
        metaDescription:
          "El leasing social francés para coches eléctricos volvió el 16 de julio de 2026, con 18 modelos desde 94 euros al mes. Importes de la ayuda y condiciones.",
        body: [
          {
            type: "p",
            text: "El leasing social francés para coches eléctricos está de vuelta desde el 16 de julio de 2026, en su tercera edición tras el lanzamiento de 2024 y la renovación de septiembre de 2025. La idea sigue siendo la misma: que los hogares con menos ingresos puedan conducir un coche eléctrico nuevo por una cuota mensual muy por debajo del mercado.",
          },
          { type: "h2", text: "Una financiación que cambia de naturaleza" },
          {
            type: "p",
            text: "A diferencia de ediciones anteriores, la ayuda ya no se financia directamente con el presupuesto del Estado, sino a través del mecanismo de los certificados de ahorro de energía (CEE), que obliga a los proveedores de energía a financiar acciones de transición ecológica.",
          },
          { type: "h2", text: "Más ayuda para la fabricación europea" },
          {
            type: "p",
            text: "La ayuda base es de 6.500 euros, que sube a 9.000 euros si el vehículo y su batería se fabrican en el Espacio Económico Europeo, y hasta 9.500 euros si el motor también se fabrica allí. El tope de la cuota mensual también subió, de 150 a 200 euros, con precios que ahora parten de 94 euros al mes en 18 modelos elegibles.",
          },
          { type: "h2", text: "Quién puede acceder" },
          {
            type: "p",
            text: "Los hogares que ya se beneficiaron del programa en 2024 o 2025 no son elegibles para la edición de 2026. El gobierno destinó un presupuesto de 401 millones de euros, con el objetivo de equipar al menos a 50.000 hogares adicionales.",
          },
          { type: "h3", text: "Las cifras clave" },
          {
            type: "ul",
            items: [
              "El programa volvió el 16 de julio de 2026, financiado con certificados de ahorro de energía.",
              "La ayuda va de 6.500 a 9.500 euros según el origen de fabricación del vehículo y la batería.",
              "El tope de la cuota mensual subió a 200 euros, con precios desde 94 euros al mes.",
              "18 modelos eléctricos elegibles, no disponible para quienes ya se beneficiaron en 2024 o 2025.",
            ],
          },
        ],
        faq: [
          { question: "¿Cuándo empezó el leasing social 2026 en Francia?", answer: "Volvió el 16 de julio de 2026, en su tercera edición tras 2024 y 2025." },
          { question: "¿Cuánto cuesta el leasing social al mes?", answer: "Los precios parten de 94 euros al mes, con el tope de la cuota mensual subido a 200 euros para 2026." },
          { question: "¿Puedo acceder de nuevo si ya me beneficié en 2024 o 2025?", answer: "No, los hogares que ya se beneficiaron en 2024 o 2025 no son elegibles para la edición de 2026." },
          { question: "¿Cómo se financia el leasing social en 2026?", answer: "Ya no se financia con el presupuesto del Estado, sino mediante el mecanismo de los certificados de ahorro de energía (CEE), que obliga a los proveedores de energía a financiar la transición ecológica." },
        ],
        ...cta.es,
      },
    },
  },
  {
    slug: "bornes-rapides-autoroute-ete-2026",
    publishedAt: "2026-07-25",
    image: {
      src: "/blog/bornes-rapides-autoroute-ete-2026.jpg",
      alt: {
        fr: "Station de recharge rapide Fastned pour voitures électriques",
        en: "A Fastned fast-charging station for electric cars",
        de: "Eine Fastned-Schnellladestation für Elektroautos",
        es: "Una estación de carga rápida Fastned para coches eléctricos",
      },
      credit: {
        name: "Donald Trung Quoc Don",
        url: "https://commons.wikimedia.org/wiki/File:Fastned_electric_vehicle_charging_station,_De_W%C3%A2lden_(2019)_01.jpg",
        license: "CC BY-SA 4.0",
      },
    },
    content: {
      fr: {
        eyebrow: "Bornes publiques",
        title: "Bornes rapides sur autoroute : comment éviter la file d'attente cet été 2026",
        excerpt:
          "Avec plus de 200 000 bornes publiques en France, le réseau autoroutier tient mieux la charge, mais les chassés-croisés d'été restent tendus.",
        metaTitle: "Recharge sur autoroute été 2026 : éviter les files d'attente",
        metaDescription:
          "Le réseau de bornes rapides s'étoffe sur les autoroutes françaises, mais les chassés-croisés de l'été 2026 mettent encore les stations sous tension. Nos conseils.",
        body: [
          {
            type: "p",
            text: "Chaque été, la même question revient pour les conducteurs de voitures électriques : le réseau de recharge autoroutier va-t-il tenir la charge pendant les grands départs ? En 2026, le réseau est plus dense qu'il ne l'a jamais été, mais les pics de trafic restent un vrai test.",
          },
          { type: "h2", text: "Un réseau plus dense qu'il y a un an" },
          {
            type: "p",
            text: "Fin juillet 2026, la France comptait plus de 200 000 points de recharge publics répartis sur environ 55 600 stations. Carrefour, à lui seul, exploite désormais plus de 560 stations représentant 4 400 points de charge, dont 63 % sont des bornes rapides ou très rapides, un bon indicateur de la montée en puissance générale du réseau. Les opérateurs continuent par ailleurs de déployer des bornes ultra-rapides de 300 à 400 kW le long des grands axes.",
          },
          { type: "h2", text: "Les chassés-croisés, moment de vérité" },
          {
            type: "p",
            text: "Malgré cette densification, les week-ends de grands départs et de retours de vacances restent les moments où la pression est la plus forte sur les stations autoroutières, avec des files d'attente qui peuvent s'allonger aux heures de pointe, notamment le samedi matin.",
          },
          { type: "h3", text: "Nos conseils pour limiter l'attente" },
          {
            type: "ul",
            items: [
              "Planifiez vos arrêts de recharge avec une application d'itinéraire avant de partir, plutôt qu'une fois sur la route.",
              "Évitez si possible les créneaux de départ les plus chargés, en particulier le samedi matin.",
              "Gardez toujours une station de secours en tête à proximité de chaque arrêt prévu.",
              "Ne visez pas systématiquement 100 % de charge : s'arrêter plus souvent mais moins longtemps est souvent plus rapide.",
            ],
          },
        ],
        faq: [
          { question: "Le réseau de bornes rapides est-il suffisant pour l'été 2026 ?", answer: "Le réseau s'est nettement densifié, avec plus de 200 000 points de recharge publics fin juillet 2026, mais les week-ends de grands départs restent des moments de forte affluence sur les bornes autoroutières." },
          { question: "Quel est le meilleur moment pour éviter l'attente aux bornes de recharge sur autoroute ?", answer: "Il vaut mieux éviter les créneaux de départ les plus chargés, notamment le samedi matin, et planifier ses arrêts à l'avance avec une application d'itinéraire." },
          { question: "Faut-il toujours recharger jusqu'à 100 % sur autoroute ?", answer: "Non, il est souvent plus rapide de s'arrêter plus souvent mais moins longtemps plutôt que de viser systématiquement une charge complète." },
          { question: "Quelle puissance offrent les bornes les plus récentes sur autoroute ?", answer: "Les opérateurs déploient des bornes ultra-rapides de 300 à 400 kW le long des grands axes autoroutiers." },
        ],
        ...cta.fr,
      },
      en: {
        eyebrow: "Public Charging",
        title: "Fast Chargers on French Motorways: How to Dodge the Queues This Summer 2026",
        excerpt:
          "With more than 200,000 public charging points now installed in France, the motorway network holds up better, but summer getaway weekends remain tight.",
        metaTitle: "Motorway EV Charging in France, Summer 2026: Avoiding Queues",
        metaDescription:
          "France's fast-charging network keeps growing, but summer holiday traffic still strains motorway stations. Here's how to plan around it in 2026.",
        body: [
          {
            type: "p",
            text: "Every summer, EV drivers in France ask the same question: will the motorway charging network hold up during peak holiday travel? In 2026, the network is denser than ever, but traffic peaks still put it to the test.",
          },
          { type: "h2", text: "A denser network than a year ago" },
          {
            type: "p",
            text: "By the end of July 2026, France had more than 200,000 public charging points spread across roughly 55,600 stations. Carrefour alone now operates over 560 stations representing 4,400 charging points, 63% of which are fast or very fast chargers, a good sign of the network's overall progress. Operators also keep adding ultra-fast 300 to 400 kW chargers along major motorways.",
          },
          { type: "h2", text: "Getaway weekends are the real test" },
          {
            type: "p",
            text: "Despite this densification, the busiest holiday departure and return weekends remain the moments of highest pressure on motorway stations, with queues that can stretch out at peak times, especially on Saturday mornings.",
          },
          { type: "h3", text: "Tips to cut your waiting time" },
          {
            type: "ul",
            items: [
              "Plan your charging stops with a route-planning app before leaving, not once you're already on the road.",
              "Avoid the busiest departure slots where possible, Saturday mornings in particular.",
              "Always keep a backup station in mind near each planned stop.",
              "Don't always aim for 100% charge: stopping more often for shorter sessions is often faster overall.",
            ],
          },
        ],
        faq: [
          { question: "Is the fast-charging network ready for summer 2026 in France?", answer: "The network has grown a lot, with over 200,000 public charging points by the end of July 2026, but peak holiday weekends still put real pressure on motorway stations." },
          { question: "What's the best time to avoid queues at motorway chargers?", answer: "It's best to avoid the busiest departure slots, especially Saturday mornings, and plan charging stops ahead of time with a route-planning app." },
          { question: "Should I always charge to 100% on a road trip?", answer: "No, it's often faster overall to stop more frequently for shorter sessions rather than always aiming for a full charge." },
          { question: "How powerful are the newest motorway chargers?", answer: "Operators keep deploying ultra-fast chargers rated at 300 to 400 kW along major French motorways." },
        ],
        ...cta.en,
      },
      de: {
        eyebrow: "Öffentliches Laden",
        title: "Schnellladen auf französischen Autobahnen: So vermeiden Sie Warteschlangen im Sommer 2026",
        excerpt:
          "Mit über 200.000 öffentlichen Ladepunkten in Frankreich ist das Autobahnnetz besser gerüstet, doch an den Reisewochenenden im Sommer wird es weiterhin eng.",
        metaTitle: "Laden auf der Autobahn in Frankreich, Sommer 2026",
        metaDescription:
          "Das französische Schnellladenetz wächst weiter, doch der Sommerreiseverkehr belastet die Autobahnstationen weiterhin. So planen Sie 2026 klug.",
        body: [
          {
            type: "p",
            text: "Jeden Sommer stellt sich für Elektroauto-Fahrer in Frankreich dieselbe Frage: Hält das Ladenetz auf den Autobahnen dem Reiseverkehr stand? 2026 ist das Netz dichter als je zuvor, doch die Verkehrsspitzen bleiben eine echte Belastungsprobe.",
          },
          { type: "h2", text: "Ein dichteres Netz als vor einem Jahr" },
          {
            type: "p",
            text: "Ende Juli 2026 zählte Frankreich mehr als 200.000 öffentliche Ladepunkte auf rund 55.600 Stationen. Allein Carrefour betreibt inzwischen über 560 Stationen mit 4.400 Ladepunkten, 63 Prozent davon Schnell- oder Ultraschnellladepunkte, ein guter Indikator für den allgemeinen Ausbau. Auch entlang der wichtigsten Autobahnen kommen weiterhin Ultraschnelllader mit 300 bis 400 kW hinzu.",
          },
          { type: "h2", text: "Die Reisewochenenden als echter Test" },
          {
            type: "p",
            text: "Trotz dieser Verdichtung bleiben die verkehrsreichsten Wochenenden zu Ferienbeginn und -ende die Momente mit dem höchsten Druck auf die Autobahnstationen, mit Warteschlangen, die sich zu Spitzenzeiten verlängern können, besonders samstagvormittags.",
          },
          { type: "h3", text: "Tipps gegen lange Wartezeiten" },
          {
            type: "ul",
            items: [
              "Planen Sie Ladestopps schon vor der Abfahrt mit einer Routenplaner-App, nicht erst unterwegs.",
              "Meiden Sie nach Möglichkeit die stärksten Abfahrtszeiten, vor allem Samstagvormittage.",
              "Halten Sie für jeden geplanten Stopp eine Ausweichstation im Hinterkopf.",
              "Laden Sie nicht immer bis 100 Prozent: häufigere, kürzere Ladestopps sind insgesamt oft schneller.",
            ],
          },
        ],
        faq: [
          { question: "Ist das Schnellladenetz für den Sommer 2026 in Frankreich bereit?", answer: "Das Netz ist stark gewachsen, mit über 200.000 öffentlichen Ladepunkten Ende Juli 2026, doch an den stärksten Reisewochenenden bleibt der Druck auf Autobahnstationen hoch." },
          { question: "Wann lassen sich Warteschlangen an Autobahnladern am besten vermeiden?", answer: "Am besten meidet man die stärksten Abfahrtszeiten, vor allem Samstagvormittage, und plant Ladestopps vorab mit einer Routenplaner-App." },
          { question: "Sollte man auf einer langen Fahrt immer bis 100 Prozent laden?", answer: "Nein, oft ist es insgesamt schneller, häufiger kurz zu laden, statt immer eine volle Ladung anzustreben." },
          { question: "Wie leistungsstark sind die neuesten Autobahnlader?", answer: "Betreiber installieren entlang wichtiger Autobahnen weiterhin Ultraschnelllader mit 300 bis 400 kW." },
        ],
        ...cta.de,
      },
      es: {
        eyebrow: "Recarga pública",
        title: "Carga rápida en las autopistas francesas: cómo evitar las colas este verano de 2026",
        excerpt:
          "Con más de 200.000 puntos de recarga públicos en Francia, la red de autopistas aguanta mejor, pero los fines de semana de salida siguen siendo tensos.",
        metaTitle: "Recarga en autopistas de Francia, verano 2026: evitar colas",
        metaDescription:
          "La red de carga rápida en Francia sigue creciendo, pero el tráfico vacacional de verano sigue presionando las estaciones de autopista. Consejos para 2026.",
        body: [
          {
            type: "p",
            text: "Cada verano surge la misma pregunta entre los conductores de coches eléctricos en Francia: ¿aguantará la red de recarga de las autopistas el gran tráfico vacacional? En 2026 la red es más densa que nunca, pero los picos de tráfico siguen siendo una prueba de fuego.",
          },
          { type: "h2", text: "Una red más densa que hace un año" },
          {
            type: "p",
            text: "A finales de julio de 2026, Francia contaba con más de 200.000 puntos de recarga públicos repartidos en unas 55.600 estaciones. Carrefour, por sí solo, opera ya más de 560 estaciones con 4.400 puntos de carga, el 63 % de ellos rápidos o muy rápidos, un buen indicador del avance general de la red. Los operadores siguen además instalando cargadores ultrarrápidos de 300 a 400 kW en los principales ejes de autopista.",
          },
          { type: "h2", text: "Los fines de semana de salida, el verdadero examen" },
          {
            type: "p",
            text: "Pese a esta densificación, los fines de semana de salida y regreso vacacional siguen siendo los momentos de mayor presión sobre las estaciones de autopista, con colas que pueden alargarse en las horas punta, sobre todo los sábados por la mañana.",
          },
          { type: "h3", text: "Consejos para reducir la espera" },
          {
            type: "ul",
            items: [
              "Planifica tus paradas de recarga con una aplicación de ruta antes de salir, no ya en la carretera.",
              "Evita en lo posible los horarios de salida más cargados, especialmente los sábados por la mañana.",
              "Ten siempre en mente una estación alternativa cerca de cada parada prevista.",
              "No apuntes siempre al 100 % de carga: parar más veces durante menos tiempo suele ser más rápido en conjunto.",
            ],
          },
        ],
        faq: [
          { question: "¿Está lista la red de carga rápida para el verano de 2026 en Francia?", answer: "La red ha crecido mucho, con más de 200.000 puntos de recarga públicos a finales de julio de 2026, pero los fines de semana de mayor salida siguen presionando las estaciones de autopista." },
          { question: "¿Cuál es el mejor momento para evitar colas en los cargadores de autopista?", answer: "Conviene evitar los horarios de salida más cargados, sobre todo los sábados por la mañana, y planificar las paradas con antelación con una aplicación de ruta." },
          { question: "¿Hay que cargar siempre hasta el 100 % en un viaje largo?", answer: "No, suele ser más rápido en conjunto hacer paradas más frecuentes y más cortas que buscar siempre una carga completa." },
          { question: "¿Qué potencia ofrecen los cargadores más recientes en autopista?", answer: "Los operadores siguen instalando cargadores ultrarrápidos de 300 a 400 kW en los principales ejes de autopista." },
        ],
        ...cta.es,
      },
    },
  },
  {
    slug: "bonus-ecologique-2026",
    publishedAt: "2026-07-29",
    image: {
      src: "/blog/bonus-ecologique-2026.jpg",
      alt: {
        fr: "Peugeot e-208, une voiture électrique neuve éligible aux aides à l'achat",
        en: "A Peugeot e-208, a new electric car eligible for purchase incentives",
        de: "Ein Peugeot e-208, ein neues Elektroauto, das für Kaufprämien infrage kommt",
        es: "Un Peugeot e-208, un coche eléctrico nuevo que puede optar a las ayudas de compra",
      },
      credit: {
        name: "Alexander-93",
        url: "https://commons.wikimedia.org/wiki/File:Peugeot_e-208_facelift_1X7A2502.jpg",
        license: "CC BY-SA 4.0",
      },
    },
    content: {
      fr: {
        eyebrow: "Aides et primes",
        title: "Bonus écologique 2026 : les montants revalorisés pour l'achat d'une voiture électrique",
        excerpt:
          "La prime qui a remplacé le bonus écologique grimpe en 2026, jusqu'à 5 700 € pour les ménages les plus modestes.",
        metaTitle: "Bonus écologique 2026 : montants et conditions à jour",
        metaDescription:
          "Depuis 2025, le bonus écologique a laissé place à la prime Coup de pouce véhicules électriques. Voici les montants 2026, revalorisés après trois baisses successives.",
        body: [
          {
            type: "p",
            text: "Le nom a changé, et beaucoup d'acheteurs s'y perdent encore : depuis le 1er juillet 2025, le bonus écologique pour l'achat d'une voiture particulière neuve électrique a été remplacé par la prime « Coup de pouce véhicules particuliers électriques », financée non plus par le budget de l'État mais par le mécanisme des certificats d'économies d'énergie (CEE).",
          },
          { type: "h2", text: "Une aide qui remonte après trois années de baisse" },
          {
            type: "p",
            text: "Après trois années de baisses successives, les montants ont été revalorisés en 2026. Les ménages en situation de précarité peuvent désormais toucher jusqu'à 5 700 €, contre 4 200 € en 2025. Les ménages modestes non précaires bénéficient de 4 700 €, et les autres foyers de 3 500 €.",
          },
          { type: "h2", text: "Un bonus supplémentaire pour les batteries européennes" },
          {
            type: "p",
            text: "Un surbonus de 1 200 à 2 000 € vient s'ajouter pour les véhicules équipés de batteries fabriquées en Europe, une manière d'orienter la demande vers des chaînes de production plus proches et de soutenir l'industrie européenne de la batterie.",
          },
          { type: "h3", text: "Les montants en un coup d'œil" },
          {
            type: "ul",
            items: [
              "Jusqu'à 5 700 € pour les ménages en situation de précarité.",
              "4 700 € pour les ménages modestes non précaires.",
              "3 500 € pour les autres foyers éligibles.",
              "Un surbonus de 1 200 à 2 000 € pour les batteries fabriquées en Europe.",
            ],
          },
        ],
        faq: [
          { question: "Le bonus écologique existe-t-il toujours en 2026 ?", answer: "Il a été remplacé depuis le 1er juillet 2025 par la prime Coup de pouce véhicules particuliers électriques, financée par les certificats d'économies d'énergie plutôt que par le budget de l'État." },
          { question: "Quel est le montant de l'aide pour un ménage précaire en 2026 ?", answer: "Les ménages en situation de précarité peuvent toucher jusqu'à 5 700 €, contre 4 200 € en 2025." },
          { question: "Quel est le montant de l'aide pour les autres foyers ?", answer: "Les ménages modestes non précaires reçoivent 4 700 €, et les autres foyers éligibles 3 500 €." },
          { question: "Existe-t-il un bonus supplémentaire pour les batteries fabriquées en Europe ?", answer: "Oui, un surbonus de 1 200 à 2 000 € s'ajoute pour les véhicules équipés de batteries fabriquées en Europe." },
        ],
        ...cta.fr,
      },
      en: {
        eyebrow: "Grants & Incentives",
        title: "France's EV Purchase Grant 2026: Higher Amounts After Three Years of Cuts",
        excerpt:
          "The premium that replaced France's old ecological bonus rose in 2026, up to 5,700 euros for the lowest-income households.",
        metaTitle: "France EV Grant 2026: Updated Amounts and Conditions",
        metaDescription:
          "Since 2025, France's ecological bonus for EVs has become the Coup de pouce grant. Here are the 2026 amounts, raised after three years of declines.",
        body: [
          {
            type: "p",
            text: "The name changed, and it still confuses many buyers: since July 1, 2025, France's ecological bonus for buying a new private electric car was replaced by the 'Coup de pouce véhicules particuliers électriques' grant, now financed through energy-savings certificates (CEE) rather than the state budget.",
          },
          { type: "h2", text: "Aid amounts rise again after three years of cuts" },
          {
            type: "p",
            text: "After three consecutive years of declining amounts, the grant was raised again in 2026. Households in precarious situations can now get up to 5,700 euros, up from 4,200 euros in 2025. Modest, non-precarious households get 4,700 euros, and other eligible households get 3,500 euros.",
          },
          { type: "h2", text: "An extra bonus for European-made batteries" },
          {
            type: "p",
            text: "A top-up of 1,200 to 2,000 euros applies to vehicles fitted with batteries manufactured in Europe, a way of steering demand toward closer supply chains and supporting Europe's battery industry.",
          },
          { type: "h3", text: "The amounts at a glance" },
          {
            type: "ul",
            items: [
              "Up to 5,700 euros for households in precarious situations.",
              "4,700 euros for modest, non-precarious households.",
              "3,500 euros for other eligible households.",
              "A 1,200 to 2,000 euro top-up for European-made batteries.",
            ],
          },
        ],
        faq: [
          { question: "Does France's ecological bonus still exist in 2026?", answer: "It was replaced on July 1, 2025 by the 'Coup de pouce véhicules particuliers électriques' grant, funded through energy-savings certificates rather than the state budget." },
          { question: "How much aid can a precarious household get in 2026?", answer: "Households in precarious situations can get up to 5,700 euros, up from 4,200 euros in 2025." },
          { question: "How much aid do other households get?", answer: "Modest, non-precarious households get 4,700 euros, and other eligible households get 3,500 euros." },
          { question: "Is there an extra bonus for European-made batteries?", answer: "Yes, a top-up of 1,200 to 2,000 euros applies to vehicles with batteries manufactured in Europe." },
        ],
        ...cta.en,
      },
      de: {
        eyebrow: "Förderungen",
        title: "Frankreichs E-Auto-Förderung 2026: Höhere Beträge nach drei Jahren Kürzungen",
        excerpt:
          "Die Prämie, die den früheren Umweltbonus in Frankreich ersetzt hat, steigt 2026 auf bis zu 5.700 Euro für die einkommensschwächsten Haushalte.",
        metaTitle: "E-Auto-Förderung Frankreich 2026: aktuelle Beträge und Bedingungen",
        metaDescription:
          "Seit 2025 ist der französische Umweltbonus für Elektroautos zur Coup-de-pouce-Prämie geworden. Hier die 2026er Beträge, nach drei Jahren Rückgang wieder erhöht.",
        body: [
          {
            type: "p",
            text: "Der Name hat sich geändert, und das verwirrt noch immer viele Käufer: Seit dem 1. Juli 2025 wurde der französische Umweltbonus für den Kauf eines neuen privaten Elektroautos durch die Prämie 'Coup de pouce véhicules particuliers électriques' ersetzt, finanziert nicht mehr aus dem Staatshaushalt, sondern über Energieeinsparzertifikate (CEE).",
          },
          { type: "h2", text: "Förderbeträge steigen nach drei Jahren Rückgang wieder" },
          {
            type: "p",
            text: "Nach drei Jahren in Folge sinkender Beträge wurden die Summen 2026 wieder angehoben. Haushalte in prekären Verhältnissen können jetzt bis zu 5.700 Euro erhalten, gegenüber 4.200 Euro im Jahr 2025. Einkommensschwache, aber nicht prekäre Haushalte erhalten 4.700 Euro, andere berechtigte Haushalte 3.500 Euro.",
          },
          { type: "h2", text: "Ein Zusatzbonus für europäische Batterien" },
          {
            type: "p",
            text: "Für Fahrzeuge mit in Europa gefertigten Batterien kommt ein Zusatzbonus von 1.200 bis 2.000 Euro hinzu, ein Anreiz, die Nachfrage auf näher gelegene Lieferketten zu lenken und die europäische Batterieindustrie zu stärken.",
          },
          { type: "h3", text: "Die Beträge auf einen Blick" },
          {
            type: "ul",
            items: [
              "Bis zu 5.700 Euro für Haushalte in prekären Verhältnissen.",
              "4.700 Euro für einkommensschwache, nicht prekäre Haushalte.",
              "3.500 Euro für andere berechtigte Haushalte.",
              "Ein Zusatzbonus von 1.200 bis 2.000 Euro für europäisch gefertigte Batterien.",
            ],
          },
        ],
        faq: [
          { question: "Gibt es den französischen Umweltbonus 2026 noch?", answer: "Er wurde zum 1. Juli 2025 durch die Prämie 'Coup de pouce véhicules particuliers électriques' ersetzt, finanziert über Energieeinsparzertifikate statt aus dem Staatshaushalt." },
          { question: "Wie hoch ist die Förderung für einen Haushalt in prekären Verhältnissen 2026?", answer: "Haushalte in prekären Verhältnissen können bis zu 5.700 Euro erhalten, gegenüber 4.200 Euro im Jahr 2025." },
          { question: "Wie hoch ist die Förderung für andere Haushalte?", answer: "Einkommensschwache, nicht prekäre Haushalte erhalten 4.700 Euro, andere berechtigte Haushalte 3.500 Euro." },
          { question: "Gibt es einen Zusatzbonus für in Europa gefertigte Batterien?", answer: "Ja, für Fahrzeuge mit in Europa gefertigten Batterien gibt es einen Zusatzbonus von 1.200 bis 2.000 Euro." },
        ],
        ...cta.de,
      },
      es: {
        eyebrow: "Ayudas",
        title: "Ayuda a la compra de eléctricos en Francia 2026: importes al alza tras tres años de recortes",
        excerpt:
          "La prima que sustituyó al antiguo bono ecológico francés sube en 2026, hasta 5.700 euros para los hogares con menos recursos.",
        metaTitle: "Ayuda a eléctricos en Francia 2026: importes y condiciones actualizados",
        metaDescription:
          "Desde 2025, el bono ecológico francés para eléctricos se convirtió en la prima Coup de pouce. Estos son los importes de 2026, al alza tras tres años de bajadas.",
        body: [
          {
            type: "p",
            text: "El nombre cambió, y todavía confunde a muchos compradores: desde el 1 de julio de 2025, el bono ecológico francés para la compra de un coche eléctrico nuevo particular fue sustituido por la prima 'Coup de pouce véhicules particuliers électriques', financiada ya no con el presupuesto del Estado sino mediante los certificados de ahorro de energía (CEE).",
          },
          { type: "h2", text: "La ayuda sube tras tres años de bajadas" },
          {
            type: "p",
            text: "Tras tres años consecutivos de importes decrecientes, las cantidades se revalorizaron en 2026. Los hogares en situación de precariedad pueden recibir ahora hasta 5.700 euros, frente a los 4.200 euros de 2025. Los hogares modestos no precarios reciben 4.700 euros, y el resto de hogares elegibles, 3.500 euros.",
          },
          { type: "h2", text: "Un extra para las baterías fabricadas en Europa" },
          {
            type: "p",
            text: "Se añade un extra de entre 1.200 y 2.000 euros para los vehículos equipados con baterías fabricadas en Europa, una forma de orientar la demanda hacia cadenas de producción más cercanas y apoyar la industria europea de baterías.",
          },
          { type: "h3", text: "Los importes de un vistazo" },
          {
            type: "ul",
            items: [
              "Hasta 5.700 euros para hogares en situación de precariedad.",
              "4.700 euros para hogares modestos no precarios.",
              "3.500 euros para el resto de hogares elegibles.",
              "Un extra de 1.200 a 2.000 euros para baterías fabricadas en Europa.",
            ],
          },
        ],
        faq: [
          { question: "¿Sigue existiendo el bono ecológico francés en 2026?", answer: "Fue sustituido el 1 de julio de 2025 por la prima 'Coup de pouce véhicules particuliers électriques', financiada mediante certificados de ahorro de energía en lugar del presupuesto del Estado." },
          { question: "¿Cuánta ayuda puede recibir un hogar en situación de precariedad en 2026?", answer: "Los hogares en situación de precariedad pueden recibir hasta 5.700 euros, frente a los 4.200 euros de 2025." },
          { question: "¿Cuánta ayuda reciben el resto de hogares?", answer: "Los hogares modestos no precarios reciben 4.700 euros, y el resto de hogares elegibles, 3.500 euros." },
          { question: "¿Existe un extra para las baterías fabricadas en Europa?", answer: "Sí, se añade un extra de entre 1.200 y 2.000 euros para los vehículos con baterías fabricadas en Europa." },
        ],
        ...cta.es,
      },
    },
  },
  {
    slug: "vehicle-to-grid-v2g",
    publishedAt: "2026-07-31",
    image: {
      src: "/blog/vehicle-to-grid-v2g.jpg",
      alt: {
        fr: "Une Nissan Leaf en charge, un modèle compatible avec la technologie V2G",
        en: "A Nissan Leaf charging, a model compatible with V2G technology",
        de: "Ein ladender Nissan Leaf, ein mit V2G-Technologie kompatibles Modell",
        es: "Un Nissan Leaf cargando, un modelo compatible con la tecnología V2G",
      },
      credit: {
        name: "Bouchecl",
        url: "https://commons.wikimedia.org/wiki/File:Nissan_Leaf_Charging_(cropped).jpg",
        license: "CC BY-SA 4.0",
      },
    },
    content: {
      fr: {
        eyebrow: "Technologie",
        title: "Vehicle-to-Grid (V2G) : quand la voiture électrique devient batterie de secours",
        excerpt:
          "La recharge bidirectionnelle, qui permet à une voiture électrique d'alimenter la maison ou le réseau, reste une technologie émergente en France en 2026.",
        metaTitle: "V2G en France 2026 : la recharge bidirectionnelle, où en est-on",
        metaDescription:
          "Le vehicle-to-grid permet à la batterie d'une voiture électrique d'alimenter la maison ou le réseau électrique. Panorama de cette technologie encore naissante en France.",
        body: [
          {
            type: "p",
            text: "Et si votre voiture électrique pouvait aussi alimenter votre maison pendant une coupure de courant, ou revendre de l'énergie au réseau au bon moment ? C'est la promesse du vehicle-to-grid, ou V2G, une technologie encore naissante mais suivie de près en France en 2026.",
          },
          { type: "h2", text: "Comment fonctionne la recharge bidirectionnelle" },
          {
            type: "p",
            text: "Contrairement à une recharge classique, à sens unique, le V2G permet à l'énergie de circuler dans les deux sens entre la batterie du véhicule et le logement ou le réseau électrique. Cela suppose un véhicule compatible et une borne capable de gérer cette recharge bidirectionnelle, généralement basée sur le standard ISO 15118.",
          },
          { type: "h2", text: "Pourquoi le sujet prend de l'ampleur en 2026" },
          {
            type: "p",
            text: "L'intérêt des fournisseurs d'électricité pour ces technologies grandit, en partie parce que l'optimisation des heures de consommation devient plus accessible : depuis août 2026, l'option heures creuses/heures pleines s'ouvre désormais aux abonnements de 3 kVA, alors qu'elle était auparavant réservée aux puissances de 6 kVA et plus. Un contexte qui rend le pilotage intelligent de la recharge, et par extension le V2G, pertinent pour davantage de foyers.",
          },
          { type: "h2", text: "Des bénéfices prometteurs, mais encore peu de modèles compatibles" },
          {
            type: "p",
            text: "Les bénéfices attendus sont réels : alimentation de secours en cas de coupure, participation à l'équilibrage du réseau électrique, et à terme des revenus liés à des offres de recharge intelligente. Mais peu de modèles compatibles sont aujourd'hui disponibles sur le marché français, et l'équipement nécessaire reste coûteux. Le V2G est un sujet à suivre de près, pas encore une solution prête pour le grand public.",
          },
        ],
        faq: [
          { question: "Qu'est-ce que le vehicle-to-grid (V2G) ?", answer: "C'est une technologie de recharge bidirectionnelle qui permet à la batterie d'une voiture électrique d'alimenter la maison ou le réseau électrique, et pas seulement de se recharger." },
          { question: "Quel équipement faut-il pour utiliser le V2G ?", answer: "Il faut un véhicule compatible et une borne capable de gérer la recharge bidirectionnelle, généralement basée sur le standard ISO 15118." },
          { question: "Le V2G est-il déjà répandu en France en 2026 ?", answer: "Non, c'est encore une technologie émergente : peu de modèles compatibles sont disponibles et l'équipement reste coûteux." },
          { question: "Quels sont les bénéfices attendus du V2G ?", answer: "Il promet une alimentation de secours en cas de coupure, une participation à l'équilibrage du réseau électrique, et à terme des revenus liés à des offres de recharge intelligente." },
        ],
        ...cta.fr,
      },
      en: {
        eyebrow: "Technology",
        title: "Vehicle-to-Grid (V2G): When Your Electric Car Becomes a Backup Battery",
        excerpt:
          "Bidirectional charging, which lets an electric car power a home or feed the grid, remains an emerging technology in France in 2026.",
        metaTitle: "V2G in France 2026: Bidirectional EV Charging Explained",
        metaDescription:
          "Vehicle-to-grid lets an EV's battery power a home or the electricity grid. Here's where this still-emerging technology stands in France.",
        body: [
          {
            type: "p",
            text: "What if your electric car could also power your home during a blackout, or sell energy back to the grid at just the right moment? That's the promise of vehicle-to-grid, or V2G, a technology that's still emerging but being watched closely in France in 2026.",
          },
          { type: "h2", text: "How bidirectional charging works" },
          {
            type: "p",
            text: "Unlike standard one-way charging, V2G lets energy flow both ways between the vehicle's battery and the home or the grid. It requires a compatible vehicle and a charger capable of handling bidirectional flow, generally built around the ISO 15118 standard.",
          },
          { type: "h2", text: "Why it's gaining traction in 2026" },
          {
            type: "p",
            text: "Utility interest in these technologies is growing, partly because optimizing when you consume electricity is becoming more accessible: since August 2026, the off-peak/peak-hours option in France is now open to 3kVA subscriptions, previously reserved for 6kVA and above. That makes smart charging, and by extension V2G, more relevant to more households.",
          },
          { type: "h2", text: "Promising benefits, but still few compatible models" },
          {
            type: "p",
            text: "The expected benefits are real: backup power during outages, helping balance the electricity grid, and eventually revenue from smart-charging offers. But few compatible vehicle models are currently available on the French market, and the required equipment remains expensive. V2G is worth watching closely, not yet a mass-market solution.",
          },
        ],
        faq: [
          { question: "What is vehicle-to-grid (V2G)?", answer: "It's a bidirectional charging technology that lets an EV's battery power a home or the electricity grid, not just get charged itself." },
          { question: "What equipment do I need to use V2G?", answer: "You need a compatible vehicle and a charger capable of handling bidirectional charging, generally built around the ISO 15118 standard." },
          { question: "Is V2G already widespread in France in 2026?", answer: "No, it's still an emerging technology: few compatible models are available and the equipment remains expensive." },
          { question: "What benefits does V2G offer?", answer: "It promises backup power during outages, help balancing the electricity grid, and eventually revenue from smart-charging offers." },
        ],
        ...cta.en,
      },
      de: {
        eyebrow: "Technologie",
        title: "Vehicle-to-Grid (V2G): Wenn das Elektroauto zur Notstrombatterie wird",
        excerpt:
          "Bidirektionales Laden, mit dem ein Elektroauto ein Haus versorgen oder Strom ins Netz einspeisen kann, ist in Frankreich 2026 noch eine aufkommende Technologie.",
        metaTitle: "V2G in Frankreich 2026: Bidirektionales Laden erklärt",
        metaDescription:
          "Vehicle-to-Grid lässt die Batterie eines Elektroautos ein Haus oder das Stromnetz versorgen. Ein Überblick über diese noch junge Technologie in Frankreich.",
        body: [
          {
            type: "p",
            text: "Was, wenn Ihr Elektroauto bei einem Stromausfall auch Ihr Haus versorgen oder zum richtigen Zeitpunkt Energie ans Netz zurückverkaufen könnte? Das verspricht Vehicle-to-Grid, kurz V2G, eine Technologie, die in Frankreich 2026 noch jung ist, aber aufmerksam beobachtet wird.",
          },
          { type: "h2", text: "Wie bidirektionales Laden funktioniert" },
          {
            type: "p",
            text: "Anders als beim klassischen, einseitigen Laden fließt bei V2G Energie in beide Richtungen zwischen der Fahrzeugbatterie und dem Haus oder dem Stromnetz. Nötig sind ein kompatibles Fahrzeug und eine Ladestation, die diesen bidirektionalen Ladevorgang beherrscht, meist auf Basis des ISO-15118-Standards.",
          },
          { type: "h2", text: "Warum das Thema 2026 an Fahrt gewinnt" },
          {
            type: "p",
            text: "Das Interesse der Energieversorger an diesen Technologien wächst, auch weil die Optimierung der Verbrauchszeiten zugänglicher wird: Seit August 2026 steht die Nebenzeit-/Hauptzeit-Option in Frankreich auch Anschlüssen mit 3 kVA offen, zuvor war sie Anschlüssen ab 6 kVA vorbehalten. Das macht intelligentes Laden, und damit auch V2G, für mehr Haushalte relevant.",
          },
          { type: "h2", text: "Vielversprechende Vorteile, aber noch wenige kompatible Modelle" },
          {
            type: "p",
            text: "Die erwarteten Vorteile sind real: Notstrom bei Stromausfällen, ein Beitrag zur Netzstabilität und langfristig mögliche Einnahmen durch intelligente Ladeangebote. Doch auf dem französischen Markt sind bislang nur wenige kompatible Fahrzeugmodelle erhältlich, und die nötige Ausrüstung bleibt teuer. V2G ist ein Thema, das man im Auge behalten sollte, aber noch keine massentaugliche Lösung.",
          },
        ],
        faq: [
          { question: "Was ist Vehicle-to-Grid (V2G)?", answer: "Eine bidirektionale Ladetechnologie, bei der die Batterie eines Elektroautos ein Haus oder das Stromnetz versorgen kann, nicht nur selbst geladen wird." },
          { question: "Welche Ausrüstung braucht man für V2G?", answer: "Man braucht ein kompatibles Fahrzeug und eine Ladestation, die bidirektionales Laden beherrscht, meist basierend auf dem ISO-15118-Standard." },
          { question: "Ist V2G in Frankreich 2026 schon weit verbreitet?", answer: "Nein, es ist noch eine aufkommende Technologie: Es gibt wenige kompatible Modelle und die Ausrüstung bleibt teuer." },
          { question: "Welche Vorteile bietet V2G?", answer: "Es verspricht Notstrom bei Ausfällen, Unterstützung bei der Netzstabilität und langfristig Einnahmen durch intelligente Ladeangebote." },
        ],
        ...cta.de,
      },
      es: {
        eyebrow: "Tecnología",
        title: "Vehicle-to-Grid (V2G): cuando el coche eléctrico se convierte en batería de emergencia",
        excerpt:
          "La carga bidireccional, que permite a un coche eléctrico alimentar una vivienda o la red, sigue siendo una tecnología emergente en Francia en 2026.",
        metaTitle: "V2G en Francia 2026: la carga bidireccional explicada",
        metaDescription:
          "El vehicle-to-grid permite que la batería de un coche eléctrico alimente una vivienda o la red eléctrica. Un repaso a esta tecnología aún incipiente en Francia.",
        body: [
          {
            type: "p",
            text: "¿Y si tu coche eléctrico pudiera también alimentar tu casa durante un corte de luz, o revender energía a la red en el momento adecuado? Esa es la promesa del vehicle-to-grid, o V2G, una tecnología todavía incipiente pero muy vigilada en Francia en 2026.",
          },
          { type: "h2", text: "Cómo funciona la carga bidireccional" },
          {
            type: "p",
            text: "A diferencia de la carga clásica, de un solo sentido, el V2G permite que la energía circule en ambas direcciones entre la batería del vehículo y la vivienda o la red eléctrica. Para ello hace falta un vehículo compatible y un cargador capaz de gestionar esa carga bidireccional, normalmente basado en el estándar ISO 15118.",
          },
          { type: "h2", text: "Por qué gana peso en 2026" },
          {
            type: "p",
            text: "El interés de las compañías eléctricas por estas tecnologías crece, en parte porque optimizar las horas de consumo resulta cada vez más accesible: desde agosto de 2026, la opción de horas punta y horas valle en Francia se abre también a los contratos de 3 kVA, antes reservada a potencias de 6 kVA o superiores. Esto hace que la carga inteligente, y por extensión el V2G, sea relevante para más hogares.",
          },
          { type: "h2", text: "Beneficios prometedores, pero todavía pocos modelos compatibles" },
          {
            type: "p",
            text: "Los beneficios esperados son reales: alimentación de emergencia ante cortes de luz, contribución al equilibrio de la red eléctrica y, a futuro, posibles ingresos gracias a ofertas de carga inteligente. Pero hoy hay pocos modelos compatibles disponibles en el mercado francés, y el equipo necesario sigue siendo caro. El V2G es un tema a seguir de cerca, todavía no una solución lista para el gran público.",
          },
        ],
        faq: [
          { question: "¿Qué es el vehicle-to-grid (V2G)?", answer: "Es una tecnología de carga bidireccional que permite que la batería de un coche eléctrico alimente una vivienda o la red eléctrica, no solo cargarse a sí misma." },
          { question: "¿Qué equipo hace falta para usar el V2G?", answer: "Se necesita un vehículo compatible y un cargador capaz de gestionar la carga bidireccional, normalmente basado en el estándar ISO 15118." },
          { question: "¿Está ya muy extendido el V2G en Francia en 2026?", answer: "No, todavía es una tecnología emergente: hay pocos modelos compatibles disponibles y el equipo sigue siendo caro." },
          { question: "¿Qué beneficios ofrece el V2G?", answer: "Promete alimentación de emergencia ante cortes de luz, ayuda para equilibrar la red eléctrica y, a futuro, ingresos gracias a ofertas de carga inteligente." },
        ],
        ...cta.es,
      },
    },
  },
  {
    slug: "cap-200000-bornes-recharge-france",
    publishedAt: "2026-08-03",
    image: {
      src: "/blog/cap-200000-bornes-recharge-france.jpg",
      alt: {
        fr: "Borne de recharge pour voiture électrique dans une rue de Paris",
        en: "An EV charging station on a street in Paris",
        de: "Eine Ladestation für Elektroautos in einer Straße in Paris",
        es: "Un punto de recarga para coches eléctricos en una calle de París",
      },
      credit: {
        name: "Dietmar Rabich",
        url: "https://commons.wikimedia.org/wiki/File:Paris,_Ladestation_--_2014_--_1664.jpg",
        license: "CC BY-SA 4.0",
      },
    },
    content: {
      fr: {
        eyebrow: "Bornes publiques",
        title: "La France franchit le cap des 200 000 bornes de recharge publiques",
        excerpt:
          "Fin juillet 2026, le réseau public de recharge a dépassé les 200 000 points de charge, à mi-chemin de l'objectif fixé pour 2030.",
        metaTitle: "200 000 bornes de recharge en France : le cap est franchi",
        metaDescription:
          "Au 31 juillet 2026, la France compte 200 045 bornes de recharge publiques réparties sur 55 600 stations. Retour sur un cap symbolique atteint plus vite que prévu.",
        body: [
          {
            type: "p",
            text: "C'est un nouveau cap symbolique pour le réseau français de recharge : au 31 juillet 2026, la France comptait 200 045 points de charge ouverts au public, répartis sur près de 55 600 stations.",
          },
          { type: "h2", text: "Un rythme de déploiement qui s'accélère" },
          {
            type: "p",
            text: "Ce seuil des 200 000 points est atteint un peu plus de trois ans après le passage des 100 000 bornes en mai 2023. Autrement dit, la France a mis moins de temps à ajouter les 100 000 points suivants qu'à atteindre les 100 000 premiers, un signe que le rythme de déploiement s'accélère plutôt qu'il ne ralentit.",
          },
          { type: "h2", text: "Où en est la France par rapport à ses objectifs" },
          {
            type: "p",
            text: "Avec ces 200 045 points de charge, la France se situe désormais à mi-chemin de l'objectif fixé pour 2030 en matière de déploiement de bornes publiques. Un jalon encourageant, même si la densité et la fiabilité du réseau restent des sujets suivis de près par les conducteurs au quotidien.",
          },
          { type: "h3", text: "Les chiffres clés" },
          {
            type: "ul",
            items: [
              "200 045 points de charge publics au 31 juillet 2026.",
              "Environ 55 600 stations de recharge sur le territoire.",
              "Le cap des 100 000 bornes avait été franchi en mai 2023.",
              "La France est désormais à mi-chemin de son objectif 2030.",
            ],
          },
        ],
        faq: [
          { question: "Combien de bornes de recharge publiques y a-t-il en France en 2026 ?", answer: "La France comptait 200 045 points de recharge publics au 31 juillet 2026, répartis sur environ 55 600 stations." },
          { question: "Quand la France avait-elle atteint 100 000 bornes ?", answer: "Le cap des 100 000 bornes avait été franchi en mai 2023, un peu plus de trois ans avant celui des 200 000." },
          { question: "La France est-elle en avance ou en retard sur ses objectifs de recharge ?", answer: "Avec 200 045 points de charge, la France se situe désormais à mi-chemin de son objectif fixé pour 2030." },
          { question: "Le rythme de déploiement des bornes s'accélère-t-il ?", answer: "Oui, il a fallu moins de temps pour ajouter les 100 000 points suivants que pour atteindre les 100 000 premiers." },
        ],
        ...cta.fr,
      },
      en: {
        eyebrow: "Public Charging",
        title: "France Passes 200,000 Public Charging Points",
        excerpt:
          "By the end of July 2026, France's public charging network passed 200,000 charge points, putting it halfway to its 2030 target.",
        metaTitle: "France Hits 200,000 EV Charging Points",
        metaDescription:
          "As of July 31, 2026, France counts 200,045 public charging points across 55,600 stations. Here's what this symbolic milestone means.",
        body: [
          {
            type: "p",
            text: "France's charging network just passed a new symbolic milestone: as of July 31, 2026, the country counted 200,045 public charging points, spread across nearly 55,600 stations.",
          },
          { type: "h2", text: "A pace of deployment that keeps speeding up" },
          {
            type: "p",
            text: "This 200,000 threshold was reached a little over three years after France crossed 100,000 charging points in May 2023. In other words, it took less time to add the second 100,000 than it did to reach the first, a sign that the pace of rollout is accelerating rather than slowing down.",
          },
          { type: "h2", text: "Where France stands on its targets" },
          {
            type: "p",
            text: "With 200,045 charging points, France is now halfway to its 2030 target for public charging infrastructure. It's an encouraging milestone, even though network density and reliability remain issues drivers watch closely day to day.",
          },
          { type: "h3", text: "The key figures" },
          {
            type: "ul",
            items: [
              "200,045 public charging points as of July 31, 2026.",
              "Roughly 55,600 charging stations nationwide.",
              "The 100,000-point mark was reached in May 2023.",
              "France is now halfway to its 2030 target.",
            ],
          },
        ],
        faq: [
          { question: "How many public EV charging points does France have in 2026?", answer: "France counted 200,045 public charging points as of July 31, 2026, spread across roughly 55,600 stations." },
          { question: "When did France reach 100,000 charging points?", answer: "The 100,000-point mark was reached in May 2023, a little over three years before the 200,000 mark." },
          { question: "Is France ahead or behind on its charging targets?", answer: "With 200,045 charging points, France is now halfway to its target for 2030." },
          { question: "Is the pace of charger deployment speeding up?", answer: "Yes, it took less time to add the second 100,000 points than it did to reach the first 100,000." },
        ],
        ...cta.en,
      },
      de: {
        eyebrow: "Öffentliches Laden",
        title: "Frankreich knackt die Marke von 200.000 öffentlichen Ladepunkten",
        excerpt:
          "Ende Juli 2026 überschritt Frankreichs öffentliches Ladenetz die Marke von 200.000 Ladepunkten, damit ist die Hälfte des Ziels für 2030 erreicht.",
        metaTitle: "Frankreich erreicht 200.000 Ladepunkte",
        metaDescription:
          "Zum 31. Juli 2026 zählt Frankreich 200.045 öffentliche Ladepunkte auf 55.600 Stationen. Was dieser symbolische Meilenstein bedeutet.",
        body: [
          {
            type: "p",
            text: "Frankreichs Ladenetz hat einen neuen symbolischen Meilenstein erreicht: Zum 31. Juli 2026 zählte das Land 200.045 öffentliche Ladepunkte, verteilt auf knapp 55.600 Stationen.",
          },
          { type: "h2", text: "Ein Ausbautempo, das weiter zunimmt" },
          {
            type: "p",
            text: "Die Marke von 200.000 Punkten wurde gut drei Jahre nach dem Überschreiten von 100.000 Ladepunkten im Mai 2023 erreicht. Anders gesagt: Für die zweiten 100.000 Punkte brauchte es weniger Zeit als für die ersten, ein Zeichen dafür, dass sich das Ausbautempo eher beschleunigt als verlangsamt.",
          },
          { type: "h2", text: "Wo Frankreich bei seinen Zielen steht" },
          {
            type: "p",
            text: "Mit 200.045 Ladepunkten hat Frankreich nun die Hälfte seines Ziels für 2030 beim Ausbau der öffentlichen Ladeinfrastruktur erreicht. Ein ermutigender Meilenstein, auch wenn Dichte und Zuverlässigkeit des Netzes für Fahrerinnen und Fahrer im Alltag weiterhin wichtige Themen bleiben.",
          },
          { type: "h3", text: "Die wichtigsten Zahlen" },
          {
            type: "ul",
            items: [
              "200.045 öffentliche Ladepunkte zum 31. Juli 2026.",
              "Rund 55.600 Ladestationen landesweit.",
              "Die Marke von 100.000 Ladepunkten wurde im Mai 2023 erreicht.",
              "Frankreich hat nun die Hälfte seines Ziels für 2030 erreicht.",
            ],
          },
        ],
        faq: [
          { question: "Wie viele öffentliche Ladepunkte gibt es 2026 in Frankreich?", answer: "Frankreich zählte zum 31. Juli 2026 200.045 öffentliche Ladepunkte auf rund 55.600 Stationen." },
          { question: "Wann erreichte Frankreich 100.000 Ladepunkte?", answer: "Die Marke von 100.000 Ladepunkten wurde im Mai 2023 erreicht, gut drei Jahre vor der Marke von 200.000." },
          { question: "Liegt Frankreich vor oder hinter seinen Ausbauzielen?", answer: "Mit 200.045 Ladepunkten hat Frankreich nun die Hälfte seines Ziels für 2030 erreicht." },
          { question: "Beschleunigt sich das Tempo beim Ausbau der Ladepunkte?", answer: "Ja, für die zweiten 100.000 Punkte brauchte es weniger Zeit als für die ersten 100.000." },
        ],
        ...cta.de,
      },
      es: {
        eyebrow: "Recarga pública",
        title: "Francia supera los 200.000 puntos de recarga públicos",
        excerpt:
          "A finales de julio de 2026, la red pública de recarga de Francia superó los 200.000 puntos de carga, a mitad de camino de su objetivo para 2030.",
        metaTitle: "Francia alcanza los 200.000 puntos de recarga",
        metaDescription:
          "A 31 de julio de 2026, Francia cuenta con 200.045 puntos de recarga públicos en 55.600 estaciones. Qué significa este hito simbólico.",
        body: [
          {
            type: "p",
            text: "La red de recarga francesa acaba de superar un nuevo hito simbólico: a 31 de julio de 2026, el país contaba con 200.045 puntos de recarga públicos, repartidos en casi 55.600 estaciones.",
          },
          { type: "h2", text: "Un ritmo de despliegue que sigue acelerando" },
          {
            type: "p",
            text: "Este umbral de 200.000 puntos se alcanzó poco más de tres años después de superar los 100.000 puntos en mayo de 2023. Es decir, se ha tardado menos en sumar los segundos 100.000 que en alcanzar los primeros, señal de que el ritmo de despliegue se acelera en lugar de frenarse.",
          },
          { type: "h2", text: "Dónde está Francia respecto a sus objetivos" },
          {
            type: "p",
            text: "Con 200.045 puntos de recarga, Francia se sitúa ya a mitad de camino de su objetivo para 2030 en infraestructura pública de recarga. Un hito alentador, aunque la densidad y la fiabilidad de la red siguen siendo aspectos que los conductores vigilan de cerca en el día a día.",
          },
          { type: "h3", text: "Las cifras clave" },
          {
            type: "ul",
            items: [
              "200.045 puntos de recarga públicos a 31 de julio de 2026.",
              "Unas 55.600 estaciones de recarga en todo el país.",
              "El umbral de 100.000 puntos se alcanzó en mayo de 2023.",
              "Francia está ahora a mitad de camino de su objetivo para 2030.",
            ],
          },
        ],
        faq: [
          { question: "¿Cuántos puntos de recarga públicos tiene Francia en 2026?", answer: "Francia contaba con 200.045 puntos de recarga públicos a 31 de julio de 2026, repartidos en unas 55.600 estaciones." },
          { question: "¿Cuándo alcanzó Francia los 100.000 puntos de recarga?", answer: "El umbral de 100.000 puntos se alcanzó en mayo de 2023, poco más de tres años antes que el de 200.000." },
          { question: "¿Va Francia por delante o por detrás de sus objetivos de recarga?", answer: "Con 200.045 puntos de recarga, Francia está ahora a mitad de camino de su objetivo para 2030." },
          { question: "¿Se está acelerando el ritmo de despliegue de puntos de recarga?", answer: "Sí, se tardó menos en sumar los segundos 100.000 puntos que en alcanzar los primeros 100.000." },
        ],
        ...cta.es,
      },
    },
  },
  {
    slug: "carrefour-prix-recharge-bornes",
    publishedAt: "2026-08-05",
    image: {
      src: "/blog/carrefour-prix-recharge-bornes.jpg",
      alt: {
        fr: "Façade d'un magasin Carrefour en France",
        en: "The front of a Carrefour store in France",
        de: "Die Fassade eines Carrefour-Geschäfts in Frankreich",
        es: "La fachada de una tienda Carrefour en Francia",
      },
      credit: {
        name: "Emilius123",
        url: "https://commons.wikimedia.org/wiki/File:Carrefour_Scheibenhard.jpg",
        license: "CC BY-SA 4.0",
      },
    },
    content: {
      fr: {
        eyebrow: "Tarifs",
        title: "Carrefour baisse de 30 % le prix de la recharge sur ses bornes 22 kW",
        excerpt:
          "Depuis le 1er août 2026, Carrefour applique un tarif de 0,23 € TTC/kWh sur l'ensemble de ses bornes 22 kW, une baisse de 30 %.",
        metaTitle: "Carrefour recharge 2026 : tarif à 0,23 €/kWh sur les bornes 22 kW",
        metaDescription:
          "Carrefour baisse de 30 % le prix de la recharge sur ses bornes 22 kW depuis août 2026, un signal fort dans la guerre des prix entre réseaux de recharge.",
        body: [
          {
            type: "p",
            text: "Bonne nouvelle pour les clients qui rechargent en faisant leurs courses : depuis le 1er août 2026, Carrefour a revu à la baisse le tarif de ses bornes de recharge 22 kW, avec une réduction de 30 % sur ce segment.",
          },
          { type: "h2", text: "Un tarif unique sur tout le réseau" },
          {
            type: "p",
            text: "Le nouveau prix s'établit à 0,23 € TTC par kWh sur l'ensemble des bornes 22 kW de l'enseigne. Carrefour exploite aujourd'hui plus de 560 stations, représentant 4 400 points de charge, dont 63 % sont des bornes rapides ou très rapides.",
          },
          { type: "h2", text: "Une bataille des prix qui s'intensifie" },
          {
            type: "p",
            text: "Ce mouvement s'inscrit dans une tendance plus large : les réseaux de recharge installés dans les zones commerciales cherchent de plus en plus à attirer les automobilistes électriques pendant leurs courses, avec des tarifs de plus en plus compétitifs sur les puissances intermédiaires comme le 22 kW.",
          },
        ],
        faq: [
          { question: "Quel est le nouveau tarif de recharge chez Carrefour ?", answer: "Depuis le 1er août 2026, Carrefour facture 0,23 € TTC par kWh sur l'ensemble de ses bornes 22 kW." },
          { question: "De combien Carrefour a-t-il baissé ses prix de recharge ?", answer: "La baisse représente 30 % par rapport au tarif précédent sur les bornes 22 kW." },
          { question: "Combien de bornes Carrefour exploite-t-il ?", answer: "Carrefour exploite plus de 560 stations, représentant 4 400 points de charge, dont 63 % sont des bornes rapides ou très rapides." },
          { question: "Ce nouveau tarif s'applique-t-il à toutes les bornes Carrefour ?", answer: "Le tarif de 0,23 € le kWh s'applique à l'ensemble des bornes 22 kW de l'enseigne." },
        ],
        ...cta.fr,
      },
      en: {
        eyebrow: "Pricing",
        title: "Carrefour Cuts EV Charging Prices by 30% on Its 22kW Stations",
        excerpt:
          "Since August 1, 2026, French retailer Carrefour has applied a rate of 0.23 euros per kWh across all its 22kW charging stations, a 30% cut.",
        metaTitle: "Carrefour EV Charging 2026: 0.23 Euros/kWh on 22kW Stations",
        metaDescription:
          "Carrefour cut EV charging prices by 30% on its 22kW stations from August 2026, a strong signal in the price war between French charging networks.",
        body: [
          {
            type: "p",
            text: "Good news for customers who charge while doing their grocery shopping in France: since August 1, 2026, retailer Carrefour lowered the price of its 22kW charging stations, cutting rates by 30% on that segment.",
          },
          { type: "h2", text: "One flat rate across the whole network" },
          {
            type: "p",
            text: "The new price is 0.23 euros including tax per kWh across all of the chain's 22kW stations. Carrefour now operates over 560 stations, representing 4,400 charging points, 63% of which are fast or very fast chargers.",
          },
          { type: "h2", text: "A pricing battle that keeps intensifying" },
          {
            type: "p",
            text: "This move fits a broader trend: charging networks installed at retail sites increasingly compete to attract EV-driving shoppers, pushing prices down on mid-power segments like 22kW.",
          },
        ],
        faq: [
          { question: "What's Carrefour's new EV charging rate?", answer: "Since August 1, 2026, Carrefour charges 0.23 euros including tax per kWh across all its 22kW charging stations." },
          { question: "How much did Carrefour cut its charging prices?", answer: "The cut represents a 30% reduction compared to the previous rate on 22kW stations." },
          { question: "How many charging stations does Carrefour operate?", answer: "Carrefour operates over 560 stations, representing 4,400 charging points, 63% of which are fast or very fast chargers." },
          { question: "Does the new rate apply to all Carrefour charging stations?", answer: "The 0.23 euro per kWh rate applies across all of the chain's 22kW stations." },
        ],
        ...cta.en,
      },
      de: {
        eyebrow: "Preise",
        title: "Carrefour senkt die Ladepreise an seinen 22-kW-Stationen um 30 Prozent",
        excerpt:
          "Seit dem 1. August 2026 verlangt die französische Handelskette Carrefour an allen 22-kW-Ladestationen 0,23 Euro pro kWh, ein Preisnachlass von 30 Prozent.",
        metaTitle: "Carrefour Laden 2026: 0,23 Euro/kWh an 22-kW-Stationen",
        metaDescription:
          "Carrefour senkt die Ladepreise an seinen 22-kW-Stationen ab August 2026 um 30 Prozent, ein starkes Signal im Preiskampf der französischen Ladenetze.",
        body: [
          {
            type: "p",
            text: "Gute Nachrichten für alle, die beim Einkaufen in Frankreich laden: Seit dem 1. August 2026 hat die Handelskette Carrefour den Preis ihrer 22-kW-Ladestationen gesenkt, mit einem Nachlass von 30 Prozent auf diesem Segment.",
          },
          { type: "h2", text: "Ein einheitlicher Preis im gesamten Netz" },
          {
            type: "p",
            text: "Der neue Preis liegt bei 0,23 Euro brutto pro kWh an allen 22-kW-Stationen der Kette. Carrefour betreibt inzwischen über 560 Stationen mit 4.400 Ladepunkten, davon 63 Prozent Schnell- oder Ultraschnelllader.",
          },
          { type: "h2", text: "Ein Preiskampf, der sich weiter zuspitzt" },
          {
            type: "p",
            text: "Dieser Schritt fügt sich in einen größeren Trend ein: Ladenetze an Einzelhandelsstandorten konkurrieren zunehmend darum, Elektroauto-Fahrer während ihres Einkaufs anzuziehen, und senken dafür die Preise gerade bei mittleren Leistungsklassen wie 22 kW.",
          },
        ],
        faq: [
          { question: "Wie hoch ist der neue Ladepreis bei Carrefour?", answer: "Seit dem 1. August 2026 berechnet Carrefour 0,23 Euro brutto pro kWh an allen seinen 22-kW-Ladestationen." },
          { question: "Um wie viel hat Carrefour die Ladepreise gesenkt?", answer: "Die Senkung entspricht 30 Prozent gegenüber dem vorherigen Tarif an 22-kW-Stationen." },
          { question: "Wie viele Ladestationen betreibt Carrefour?", answer: "Carrefour betreibt über 560 Stationen mit 4.400 Ladepunkten, davon 63 Prozent Schnell- oder Ultraschnelllader." },
          { question: "Gilt der neue Tarif für alle Carrefour-Ladestationen?", answer: "Der Preis von 0,23 Euro pro kWh gilt für alle 22-kW-Stationen der Kette." },
        ],
        ...cta.de,
      },
      es: {
        eyebrow: "Precios",
        title: "Carrefour baja un 30 % el precio de la recarga en sus puntos de 22 kW",
        excerpt:
          "Desde el 1 de agosto de 2026, la cadena francesa Carrefour aplica una tarifa de 0,23 euros por kWh en todos sus puntos de 22 kW, un 30 % menos.",
        metaTitle: "Recarga en Carrefour 2026: 0,23 euros/kWh en puntos de 22 kW",
        metaDescription:
          "Carrefour bajó un 30 % el precio de la recarga en sus puntos de 22 kW desde agosto de 2026, una señal fuerte en la guerra de precios entre redes francesas.",
        body: [
          {
            type: "p",
            text: "Buena noticia para quienes recargan mientras hacen la compra en Francia: desde el 1 de agosto de 2026, la cadena Carrefour bajó el precio de sus puntos de recarga de 22 kW, con una rebaja del 30 % en ese segmento.",
          },
          { type: "h2", text: "Una tarifa única en toda la red" },
          {
            type: "p",
            text: "El nuevo precio es de 0,23 euros con impuestos incluidos por kWh en todos los puntos de 22 kW de la cadena. Carrefour opera ya más de 560 estaciones, con 4.400 puntos de carga, el 63 % de ellos rápidos o muy rápidos.",
          },
          { type: "h2", text: "Una guerra de precios que se intensifica" },
          {
            type: "p",
            text: "Este movimiento encaja en una tendencia más amplia: las redes de recarga instaladas en zonas comerciales compiten cada vez más por atraer a los conductores eléctricos durante sus compras, con tarifas cada vez más competitivas en potencias intermedias como los 22 kW.",
          },
        ],
        faq: [
          { question: "¿Cuál es la nueva tarifa de recarga de Carrefour?", answer: "Desde el 1 de agosto de 2026, Carrefour cobra 0,23 euros con impuestos por kWh en todos sus puntos de 22 kW." },
          { question: "¿Cuánto ha bajado Carrefour el precio de la recarga?", answer: "La rebaja supone un 30 % respecto a la tarifa anterior en los puntos de 22 kW." },
          { question: "¿Cuántos puntos de recarga opera Carrefour?", answer: "Carrefour opera más de 560 estaciones, con 4.400 puntos de carga, el 63 % de ellos rápidos o muy rápidos." },
          { question: "¿La nueva tarifa se aplica a todos los puntos de Carrefour?", answer: "El precio de 0,23 euros por kWh se aplica a todos los puntos de 22 kW de la cadena." },
        ],
        ...cta.es,
      },
    },
  },
  {
    slug: "tarif-electricite-aout-2026-recharge",
    publishedAt: "2026-08-06",
    image: {
      src: "/blog/tarif-electricite-aout-2026-recharge.jpg",
      alt: {
        fr: "Compteur électrique Linky installé sur une façade",
        en: "A Linky smart electricity meter mounted on a wall",
        de: "Ein Linky-Stromzähler an einer Hauswand",
        es: "Un contador eléctrico Linky instalado en una fachada",
      },
      credit: null,
    },
    content: {
      fr: {
        eyebrow: "Recharge à domicile",
        title: "Électricité : ce que la hausse du tarif réglementé change pour la recharge à domicile",
        excerpt:
          "Le tarif bleu d'EDF a augmenté de 2,5 % au 1er août 2026, mais l'option heures creuses s'ouvre enfin aux petits compteurs de 3 kVA.",
        metaTitle: "Tarif électricité août 2026 : impact sur la recharge à domicile",
        metaDescription:
          "Le tarif réglementé de l'électricité a augmenté de 2,5 % le 1er août 2026. Voici ce que cela change concrètement pour le coût de la recharge d'une voiture électrique à domicile.",
        body: [
          {
            type: "p",
            text: "Le tarif réglementé de l'électricité, le fameux tarif bleu d'EDF, a augmenté en moyenne de 2,5 % TTC au 1er août 2026. Une hausse qui concerne directement les propriétaires de voitures électriques, puisque la recharge à domicile reste la solution la plus économique au quotidien.",
          },
          { type: "h2", text: "Les nouveaux tarifs au 1er août 2026" },
          {
            type: "p",
            text: "En option Base, le kWh s'établit désormais à 0,2001 €. En option heures creuses/heures pleines, il faut compter 0,1589 € le kWh en heures creuses, contre 0,2142 € en heures pleines : l'écart entre les deux reste donc significatif pour qui recharge la nuit.",
          },
          { type: "h2", text: "Une bonne nouvelle pour les petits compteurs" },
          {
            type: "p",
            text: "L'option heures creuses/heures pleines s'ouvre désormais aux abonnements de 3 kVA, alors qu'elle était auparavant réservée aux puissances de 6 kVA et plus. Concrètement, davantage de foyers, y compris de petits logements, peuvent désormais profiter de la recharge nocturne à tarif réduit.",
          },
          { type: "h2", text: "Une offre dédiée aux propriétaires de voiture électrique" },
          {
            type: "p",
            text: "EDF propose par ailleurs une offre baptisée « Vert Électrique Auto », destinée aux propriétaires de véhicules électriques ou hybrides vivant en maison individuelle, avec des heures creuses pensées pour rendre la recharge nocturne particulièrement avantageuse.",
          },
        ],
        faq: [
          { question: "Quel est le tarif heures creuses de l'électricité depuis août 2026 ?", answer: "Le kWh en heures creuses s'établit à 0,1589 € depuis le 1er août 2026, contre 0,2142 € en heures pleines." },
          { question: "L'option heures creuses est-elle accessible avec un compteur de 3 kVA ?", answer: "Oui, depuis août 2026, l'option heures creuses/heures pleines est ouverte aux abonnements de 3 kVA, alors qu'elle était réservée aux puissances de 6 kVA et plus." },
          { question: "De combien le tarif réglementé de l'électricité a-t-il augmenté en août 2026 ?", answer: "Le tarif bleu d'EDF a augmenté en moyenne de 2,5 % TTC au 1er août 2026." },
          { question: "Existe-t-il une offre EDF dédiée aux voitures électriques ?", answer: "Oui, l'offre Vert Électrique Auto d'EDF cible les propriétaires de véhicules électriques ou hybrides en maison individuelle avec des heures creuses avantageuses pour la recharge nocturne." },
        ],
        ...cta.fr,
      },
      en: {
        eyebrow: "Home Charging",
        title: "Electricity Prices: What the Regulated Tariff Hike Means for Home EV Charging in France",
        excerpt:
          "France's regulated electricity tariff rose 2.5% on August 1, 2026, but the off-peak option finally opened up to smaller 3kVA subscriptions.",
        metaTitle: "France Electricity Tariff August 2026: Impact on Home EV Charging",
        metaDescription:
          "France's regulated electricity tariff rose 2.5% on August 1, 2026. Here's what that means in practice for the cost of charging an EV at home.",
        body: [
          {
            type: "p",
            text: "France's regulated electricity tariff, the well-known 'tarif bleu' from EDF, rose by an average of 2.5% including tax on August 1, 2026. That hike directly affects EV owners, since home charging remains the most economical option day to day.",
          },
          { type: "h2", text: "The new rates as of August 1, 2026" },
          {
            type: "p",
            text: "On the Base option, the price per kWh now stands at 0.2001 euros. On the off-peak/peak option, off-peak hours cost 0.1589 euros per kWh, against 0.2142 euros during peak hours, still a meaningful gap for anyone charging overnight.",
          },
          { type: "h2", text: "Good news for smaller subscriptions" },
          {
            type: "p",
            text: "The off-peak/peak option is now open to 3kVA subscriptions, previously reserved for 6kVA and above. In practice, more households, including smaller homes, can now access discounted overnight charging.",
          },
          { type: "h2", text: "A dedicated offer for EV owners" },
          {
            type: "p",
            text: "EDF also offers a plan called 'Vert Électrique Auto', aimed at electric or hybrid vehicle owners living in houses, with off-peak hours designed to make overnight charging particularly attractive.",
          },
        ],
        faq: [
          { question: "What is France's off-peak electricity rate since August 2026?", answer: "The off-peak rate is 0.1589 euros per kWh since August 1, 2026, compared to 0.2142 euros at peak hours." },
          { question: "Is the off-peak option available with a 3kVA meter?", answer: "Yes, since August 2026 the off-peak/peak option is open to 3kVA subscriptions, which was previously reserved for 6kVA and above." },
          { question: "How much did France's regulated electricity tariff rise in August 2026?", answer: "EDF's regulated tariff rose by an average of 2.5% including tax on August 1, 2026." },
          { question: "Is there an EDF plan specifically for electric cars?", answer: "Yes, EDF's 'Vert Électrique Auto' plan targets EV or hybrid owners living in houses, with off-peak hours designed for cheap overnight charging." },
        ],
        ...cta.en,
      },
      de: {
        eyebrow: "Laden zu Hause",
        title: "Strompreise: Was die Erhöhung des regulierten Tarifs für das Laden zu Hause in Frankreich bedeutet",
        excerpt:
          "Frankreichs regulierter Stromtarif stieg am 1. August 2026 um 2,5 Prozent, doch die Nebenzeit-Option steht nun auch kleineren 3-kVA-Anschlüssen offen.",
        metaTitle: "Stromtarif Frankreich August 2026: Auswirkung auf das Laden zu Hause",
        metaDescription:
          "Frankreichs regulierter Stromtarif stieg am 1. August 2026 um 2,5 Prozent. Was das konkret für die Kosten des Ladens eines Elektroautos zu Hause bedeutet.",
        body: [
          {
            type: "p",
            text: "Frankreichs regulierter Stromtarif, der bekannte 'tarif bleu' von EDF, stieg zum 1. August 2026 im Schnitt um 2,5 Prozent brutto. Diese Erhöhung betrifft Besitzer von Elektroautos direkt, da das Laden zu Hause im Alltag weiterhin die günstigste Option bleibt.",
          },
          { type: "h2", text: "Die neuen Tarife zum 1. August 2026" },
          {
            type: "p",
            text: "In der Grundoption liegt der Preis pro kWh nun bei 0,2001 Euro. Bei der Nebenzeit-/Hauptzeit-Option kostet die kWh in der Nebenzeit 0,1589 Euro, in der Hauptzeit 0,2142 Euro, ein weiterhin spürbarer Unterschied für alle, die nachts laden.",
          },
          { type: "h2", text: "Gute Nachrichten für kleinere Anschlüsse" },
          {
            type: "p",
            text: "Die Nebenzeit-/Hauptzeit-Option steht nun auch Anschlüssen mit 3 kVA offen, zuvor war sie Anschlüssen ab 6 kVA vorbehalten. In der Praxis können damit mehr Haushalte, auch kleinere Wohnungen, von vergünstigtem nächtlichen Laden profitieren.",
          },
          { type: "h2", text: "Ein eigenes Angebot für E-Auto-Besitzer" },
          {
            type: "p",
            text: "EDF bietet zudem einen Tarif namens 'Vert Électrique Auto' an, der sich an Besitzer von Elektro- oder Hybridfahrzeugen in Einfamilienhäusern richtet, mit Nebenzeiten, die das nächtliche Laden besonders attraktiv machen sollen.",
          },
        ],
        faq: [
          { question: "Wie hoch ist der französische Nebenzeittarif seit August 2026?", answer: "Der Nebenzeittarif liegt seit dem 1. August 2026 bei 0,1589 Euro pro kWh, gegenüber 0,2142 Euro in der Hauptzeit." },
          { question: "Ist die Nebenzeit-Option mit einem 3-kVA-Zähler verfügbar?", answer: "Ja, seit August 2026 steht die Nebenzeit-/Hauptzeit-Option auch 3-kVA-Anschlüssen offen, zuvor war sie ab 6 kVA vorbehalten." },
          { question: "Um wie viel stieg der regulierte Stromtarif in Frankreich im August 2026?", answer: "Der regulierte Tarif von EDF stieg zum 1. August 2026 im Schnitt um 2,5 Prozent brutto." },
          { question: "Gibt es einen speziellen EDF-Tarif für Elektroautos?", answer: "Ja, der Tarif 'Vert Électrique Auto' von EDF richtet sich an Besitzer von Elektro- oder Hybridfahrzeugen in Einfamilienhäusern, mit günstigen Nebenzeiten fürs nächtliche Laden." },
        ],
        ...cta.de,
      },
      es: {
        eyebrow: "Recarga en casa",
        title: "Electricidad: qué cambia la subida de la tarifa regulada para la recarga en casa en Francia",
        excerpt:
          "La tarifa regulada de electricidad en Francia subió un 2,5 % el 1 de agosto de 2026, pero la opción de horas valle se abre por fin a contratos de 3 kVA.",
        metaTitle: "Tarifa eléctrica en Francia, agosto de 2026: impacto en la recarga en casa",
        metaDescription:
          "La tarifa regulada de electricidad en Francia subió un 2,5 % el 1 de agosto de 2026. Qué significa esto en la práctica para el coste de recargar un eléctrico en casa.",
        body: [
          {
            type: "p",
            text: "La tarifa regulada de electricidad en Francia, la conocida 'tarif bleu' de EDF, subió de media un 2,5 % con impuestos incluidos el 1 de agosto de 2026. Una subida que afecta directamente a los propietarios de coches eléctricos, ya que la recarga en casa sigue siendo la opción más económica en el día a día.",
          },
          { type: "h2", text: "Las nuevas tarifas desde el 1 de agosto de 2026" },
          {
            type: "p",
            text: "En la opción Base, el precio del kWh se sitúa ahora en 0,2001 euros. En la opción de horas punta y horas valle, el kWh cuesta 0,1589 euros en horas valle, frente a 0,2142 euros en horas punta: una diferencia que sigue siendo notable para quien recarga por la noche.",
          },
          { type: "h2", text: "Una buena noticia para los contratos más pequeños" },
          {
            type: "p",
            text: "La opción de horas punta y horas valle se abre ahora también a los contratos de 3 kVA, antes reservada a potencias de 6 kVA o superiores. En la práctica, más hogares, incluidas viviendas más pequeñas, pueden acceder ya a la recarga nocturna con tarifa reducida.",
          },
          { type: "h2", text: "Una oferta pensada para propietarios de eléctricos" },
          {
            type: "p",
            text: "EDF ofrece además una tarifa llamada 'Vert Électrique Auto', dirigida a propietarios de vehículos eléctricos o híbridos que viven en una vivienda unifamiliar, con horas valle pensadas para hacer especialmente ventajosa la recarga nocturna.",
          },
        ],
        faq: [
          { question: "¿Cuál es la tarifa valle de la electricidad en Francia desde agosto de 2026?", answer: "La tarifa valle es de 0,1589 euros por kWh desde el 1 de agosto de 2026, frente a 0,2142 euros en horas punta." },
          { question: "¿Está disponible la opción de horas valle con un contador de 3 kVA?", answer: "Sí, desde agosto de 2026 la opción de horas punta y valle está abierta a contratos de 3 kVA, antes reservada a 6 kVA o más." },
          { question: "¿Cuánto subió la tarifa regulada de electricidad en Francia en agosto de 2026?", answer: "La tarifa regulada de EDF subió de media un 2,5 % con impuestos incluidos el 1 de agosto de 2026." },
          { question: "¿Existe una tarifa de EDF específica para coches eléctricos?", answer: "Sí, la tarifa 'Vert Électrique Auto' de EDF está dirigida a propietarios de eléctricos o híbridos en vivienda unifamiliar, con horas valle pensadas para la recarga nocturna barata." },
        ],
        ...cta.es,
      },
    },
  },
  {
    slug: "comparatif-abonnements-recharge",
    publishedAt: "2026-08-08",
    image: {
      src: "/blog/comparatif-abonnements-recharge.jpg",
      alt: {
        fr: "Deux types de connecteurs de recharge pour voiture électrique côte à côte",
        en: "Two electric car charging connector types shown side by side",
        de: "Zwei Ladesteckertypen für Elektroautos nebeneinander",
        es: "Dos tipos de conectores de recarga para coches eléctricos uno junto al otro",
      },
      credit: null,
    },
    content: {
      fr: {
        eyebrow: "Tarifs",
        title: "Abonnements de recharge : comparatif des tarifs en France en 2026",
        excerpt:
          "Domicile, borne publique 22 kW ou recharge rapide sur autoroute : les écarts de prix sont importants, voici comment choisir la bonne formule.",
        metaTitle: "Comparatif des abonnements de recharge électrique en 2026",
        metaDescription:
          "Recharge à domicile, bornes publiques 22 kW, recharge rapide sur autoroute : comparatif des tarifs de recharge en France en 2026 et conseils pour choisir son abonnement.",
        body: [
          {
            type: "p",
            text: "Recharger une voiture électrique peut coûter très différemment selon l'endroit où l'on branche son véhicule. En 2026, l'écart entre la recharge la moins chère et la plus chère reste important, ce qui rend le choix d'un abonnement d'autant plus utile.",
          },
          { type: "h2", text: "La recharge à domicile, la moins chère" },
          {
            type: "p",
            text: "Avec un tarif heures creuses à 0,1589 € le kWh depuis août 2026, désormais accessible même aux abonnements de 3 kVA, la recharge à domicile la nuit reste de loin l'option la plus économique pour un usage quotidien.",
          },
          { type: "h2", text: "La recharge publique 22 kW, un tarif intermédiaire" },
          {
            type: "p",
            text: "Sur les bornes publiques de 22 kW, comme celles de Carrefour facturées 0,23 € le kWh depuis le 1er août 2026, le coût reste raisonnable pour une recharge d'appoint pendant les courses, mais dépasse déjà largement le tarif heures creuses à domicile.",
          },
          { type: "h2", text: "La recharge rapide sur autoroute, la plus chère" },
          {
            type: "p",
            text: "Sur les bornes rapides et ultra-rapides des autoroutes, les tarifs grimpent nettement, surtout en paiement à l'acte sans abonnement. Un abonnement auprès d'un réseau ou d'un agrégateur de plusieurs réseaux permet généralement de réduire le prix au kWh pour les conducteurs qui rechargent souvent en itinérance.",
          },
          { type: "h3", text: "Comment choisir son abonnement" },
          {
            type: "ul",
            items: [
              "Conducteur qui recharge surtout à domicile : privilégiez d'abord un contrat électrique avec heures creuses adaptées.",
              "Conducteur régulier sur autoroute : un abonnement à une carte multi-réseaux limite les mauvaises surprises sur les tarifs sans abonnement.",
              "Usage mixte : combinez un tarif domicile optimisé et un abonnement de recharge rapide réservé aux longs trajets.",
            ],
          },
        ],
        faq: [
          { question: "Quelle est la solution de recharge la moins chère au quotidien ?", answer: "La recharge à domicile en heures creuses, à 0,1589 € le kWh depuis août 2026, reste de loin l'option la moins chère." },
          { question: "Combien coûte 100 km avec une recharge à domicile en heures creuses ?", answer: "Pour une citadine consommant environ 16 kWh aux 100 km, cela revient à environ 2,54 € à domicile en heures creuses." },
          { question: "Combien coûte 100 km sur une borne publique 22 kW ?", answer: "Sur une borne publique 22 kW facturée 0,23 € le kWh, comptez environ 3,68 € pour 100 km." },
          { question: "La recharge rapide sur autoroute coûte-t-elle plus cher que la recharge à domicile ?", answer: "Oui, sans abonnement, elle peut coûter deux à trois fois plus cher que la recharge à domicile en heures creuses." },
        ],
        ...cta.fr,
      },
      en: {
        eyebrow: "Pricing",
        title: "EV Charging Subscriptions: Comparing the Real Cost of Charging in France in 2026",
        excerpt:
          "Home charging, public 22kW stations, or fast charging on the motorway: the price gaps are significant, here's how to pick the right plan.",
        metaTitle: "EV Charging Subscriptions Compared: France 2026",
        metaDescription:
          "Home charging, public 22kW stations, motorway fast charging: comparing EV charging costs in France in 2026 and how to pick a subscription.",
        body: [
          {
            type: "p",
            text: "Charging an electric car in France can cost very different amounts depending on where you plug in. In 2026, the gap between the cheapest and the most expensive option remains significant, which makes picking the right subscription worthwhile.",
          },
          { type: "h2", text: "Home charging is still the cheapest" },
          {
            type: "p",
            text: "With an off-peak rate of 0.1589 euros per kWh as of August 2026, now accessible even to 3kVA subscriptions, charging at home overnight remains by far the most economical option for everyday use.",
          },
          { type: "h2", text: "Public 22kW charging sits in the middle" },
          {
            type: "p",
            text: "On public 22kW stations, such as Carrefour's at 0.23 euros per kWh since August 1, 2026, the cost stays reasonable for a top-up while shopping, but already comfortably exceeds the home off-peak rate.",
          },
          { type: "h2", text: "Motorway fast charging is the most expensive" },
          {
            type: "p",
            text: "On fast and ultra-fast motorway chargers, prices climb noticeably, especially with pay-as-you-go pricing and no subscription. A plan with a single network or a multi-network pass generally lowers the per-kWh cost for drivers who charge on the road often.",
          },
          { type: "h3", text: "How to choose a subscription" },
          {
            type: "ul",
            items: [
              "Mostly home charging: prioritize an electricity plan with off-peak hours that fit your routine.",
              "Frequent motorway driving: a multi-network pass avoids the worst surprises of pay-as-you-go pricing.",
              "Mixed use: combine an optimized home tariff with a fast-charging subscription reserved for long trips.",
            ],
          },
        ],
        faq: [
          { question: "What's the cheapest way to charge an EV day to day?", answer: "Home charging on an off-peak tariff, at 0.1589 euros per kWh since August 2026, remains by far the cheapest option." },
          { question: "How much does 100km cost charging at home off-peak?", answer: "For a compact EV using about 16 kWh per 100km, that works out to roughly 2.54 euros at home on the off-peak rate." },
          { question: "How much does 100km cost on a public 22kW station?", answer: "On a public 22kW station priced at 0.23 euros per kWh, expect around 3.68 euros per 100km." },
          { question: "Is motorway fast charging more expensive than charging at home?", answer: "Yes, without a subscription it can cost two to three times more than charging at home on an off-peak tariff." },
        ],
        ...cta.en,
      },
      de: {
        eyebrow: "Preise",
        title: "Lade-Abonnements im Vergleich: Was Laden in Frankreich 2026 wirklich kostet",
        excerpt:
          "Laden zu Hause, öffentliche 22-kW-Stationen oder Schnellladen auf der Autobahn: die Preisunterschiede sind erheblich, so finden Sie den passenden Tarif.",
        metaTitle: "Lade-Abonnements im Vergleich: Frankreich 2026",
        metaDescription:
          "Laden zu Hause, öffentliche 22-kW-Stationen, Schnellladen auf der Autobahn: ein Kostenvergleich für Frankreich 2026 und Tipps zur Tarifwahl.",
        body: [
          {
            type: "p",
            text: "Das Laden eines Elektroautos in Frankreich kann je nach Ladeort sehr unterschiedlich teuer sein. 2026 bleibt der Abstand zwischen der günstigsten und der teuersten Option erheblich, weshalb sich die Wahl des richtigen Abonnements lohnt.",
          },
          { type: "h2", text: "Laden zu Hause bleibt am günstigsten" },
          {
            type: "p",
            text: "Mit einem Nebenzeittarif von 0,1589 Euro pro kWh seit August 2026, inzwischen auch für 3-kVA-Anschlüsse zugänglich, bleibt das nächtliche Laden zu Hause für den Alltag mit Abstand die günstigste Option.",
          },
          { type: "h2", text: "Öffentliches 22-kW-Laden liegt im Mittelfeld" },
          {
            type: "p",
            text: "An öffentlichen 22-kW-Stationen, wie denen von Carrefour zu 0,23 Euro pro kWh seit dem 1. August 2026, bleiben die Kosten für eine Ladeauffrischung beim Einkauf vertretbar, liegen aber schon deutlich über dem heimischen Nebenzeittarif.",
          },
          { type: "h2", text: "Schnellladen auf der Autobahn ist am teuersten" },
          {
            type: "p",
            text: "An Schnell- und Ultraschnellladern auf Autobahnen steigen die Preise spürbar, vor allem bei spontanem Laden ohne Abonnement. Ein Tarif bei einem einzelnen Netz oder eine netzübergreifende Ladekarte senkt in der Regel den Preis pro kWh für Vielfahrer.",
          },
          { type: "h3", text: "Wie Sie das passende Abonnement finden" },
          {
            type: "ul",
            items: [
              "Vorwiegend Laden zu Hause: zuerst einen Stromtarif mit passenden Nebenzeiten wählen.",
              "Häufiges Fahren auf der Autobahn: eine netzübergreifende Ladekarte vermeidet unangenehme Überraschungen bei Spontanpreisen.",
              "Gemischte Nutzung: einen optimierten Heimtarif mit einem Schnelllade-Abonnement für lange Fahrten kombinieren.",
            ],
          },
        ],
        faq: [
          { question: "Was ist die günstigste Lademöglichkeit im Alltag?", answer: "Das Laden zu Hause im Nebenzeittarif, zu 0,1589 Euro pro kWh seit August 2026, bleibt mit Abstand die günstigste Option." },
          { question: "Wie viel kosten 100 km beim Laden zu Hause in der Nebenzeit?", answer: "Für ein kompaktes Elektroauto mit etwa 16 kWh Verbrauch pro 100 km sind das zu Hause in der Nebenzeit rund 2,54 Euro." },
          { question: "Wie viel kosten 100 km an einer öffentlichen 22-kW-Station?", answer: "An einer öffentlichen 22-kW-Station zu 0,23 Euro pro kWh sind es rund 3,68 Euro pro 100 km." },
          { question: "Ist Schnellladen auf der Autobahn teurer als Laden zu Hause?", answer: "Ja, ohne Abonnement kann es zwei- bis dreimal so teuer sein wie das Laden zu Hause im Nebenzeittarif." },
        ],
        ...cta.de,
      },
      es: {
        eyebrow: "Precios",
        title: "Abonos de recarga comparados: lo que cuesta realmente cargar en Francia en 2026",
        excerpt:
          "Recarga en casa, puntos públicos de 22 kW o carga rápida en autopista: las diferencias de precio son notables, así se elige el abono adecuado.",
        metaTitle: "Abonos de recarga comparados: Francia 2026",
        metaDescription:
          "Recarga en casa, puntos públicos de 22 kW, carga rápida en autopista: comparativa de precios de recarga en Francia en 2026 y cómo elegir abono.",
        body: [
          {
            type: "p",
            text: "Recargar un coche eléctrico en Francia puede salir muy caro o muy barato según dónde lo enchufes. En 2026, la diferencia entre la opción más barata y la más cara sigue siendo notable, lo que hace que elegir bien el abono merezca la pena.",
          },
          { type: "h2", text: "La recarga en casa sigue siendo la más barata" },
          {
            type: "p",
            text: "Con una tarifa de horas valle de 0,1589 euros por kWh desde agosto de 2026, ya accesible incluso para contratos de 3 kVA, cargar en casa por la noche sigue siendo, con diferencia, la opción más económica para el día a día.",
          },
          { type: "h2", text: "La recarga pública de 22 kW, en un término medio" },
          {
            type: "p",
            text: "En los puntos públicos de 22 kW, como los de Carrefour a 0,23 euros por kWh desde el 1 de agosto de 2026, el coste sigue siendo razonable para una recarga de apoyo mientras se hace la compra, aunque ya supera con claridad la tarifa valle del hogar.",
          },
          { type: "h2", text: "La carga rápida en autopista, la más cara" },
          {
            type: "p",
            text: "En los cargadores rápidos y ultrarrápidos de autopista, los precios suben claramente, sobre todo pagando por uso sin abono. Un abono con una red o una tarjeta multirred suele reducir el precio por kWh para quien recarga a menudo de viaje.",
          },
          { type: "h3", text: "Cómo elegir tu abono" },
          {
            type: "ul",
            items: [
              "Recarga principalmente en casa: prioriza un contrato eléctrico con horas valle que encajen con tu rutina.",
              "Uso frecuente de autopista: una tarjeta multirred evita sorpresas con las tarifas sin abono.",
              "Uso mixto: combina una tarifa doméstica optimizada con un abono de carga rápida reservado para los trayectos largos.",
            ],
          },
        ],
        faq: [
          { question: "¿Cuál es la forma más barata de recargar un eléctrico en el día a día?", answer: "La recarga en casa con tarifa valle, a 0,1589 euros por kWh desde agosto de 2026, sigue siendo la opción más barata con diferencia." },
          { question: "¿Cuánto cuestan 100 km recargando en casa en horas valle?", answer: "Para un eléctrico compacto que consume unos 16 kWh cada 100 km, eso supone unos 2,54 euros en casa en horas valle." },
          { question: "¿Cuánto cuestan 100 km en un punto público de 22 kW?", answer: "En un punto público de 22 kW a 0,23 euros por kWh, cuenta con unos 3,68 euros cada 100 km." },
          { question: "¿Es la carga rápida en autopista más cara que cargar en casa?", answer: "Sí, sin abono puede costar de dos a tres veces más que cargar en casa con tarifa valle." },
        ],
        ...cta.es,
      },
    },
  },
  {
    slug: "malus-ecologique-2026-voitures-electriques",
    publishedAt: "2026-08-10",
    image: {
      src: "/blog/malus-ecologique-2026-voitures-electriques.jpg",
      alt: {
        fr: "BMW iX, un SUV électrique de grand gabarit",
        en: "A BMW iX, a large electric SUV",
        de: "Ein BMW iX, ein großes Elektro-SUV",
        es: "Un BMW iX, un SUV eléctrico de gran tamaño",
      },
      credit: {
        name: "Alexander Migl",
        url: "https://commons.wikimedia.org/wiki/File:BMW_iX_IAA_2021_1X7A0204.jpg",
        license: "CC BY-SA 4.0",
      },
    },
    content: {
      fr: {
        eyebrow: "Réglementation",
        title: "Malus écologique 2026 : les voitures électriques ne sont plus toutes épargnées",
        excerpt:
          "Le malus au poids peut désormais s'appliquer à certaines voitures électriques dépourvues d'éco-score, une première depuis la création de ce dispositif.",
        metaTitle: "Malus écologique 2026 : le malus au poids touche les électriques",
        metaDescription:
          "Le malus CO2 continue d'épargner les voitures électriques, mais le malus au poids peut désormais s'appliquer à certains modèles sans éco-score depuis juillet 2026.",
        body: [
          {
            type: "p",
            text: "Les voitures électriques ont longtemps été à l'abri de tout malus écologique. Ce n'est plus tout à fait le cas depuis 2026, où une partie d'entre elles peut désormais être concernée par le malus au poids.",
          },
          { type: "h2", text: "Le malus CO2, toujours sans effet sur les électriques" },
          {
            type: "p",
            text: "Le malus écologique classique, basé sur les émissions de CO2, s'applique aux voitures neuves qui dépassent 108 g de CO2 par kilomètre en cycle WLTP, et peut atteindre jusqu'à 80 000 € pour les véhicules les plus polluants, au-delà de 191 g/km. Les voitures électriques, qui n'émettent aucun CO2 à l'usage, restent exemptées de ce volet.",
          },
          { type: "h2", text: "Le malus au poids, un nouveau risque pour certains modèles" },
          {
            type: "p",
            text: "Le seuil de déclenchement du malus au poids a été abaissé en 2026, passant de 1 600 à 1 500 kg, avec un barème progressif de 10 à 30 € par kilogramme selon les tranches.",
          },
          { type: "h2", text: "La fin d'une exemption totale" },
          {
            type: "p",
            text: "Depuis le 1er juillet 2026, les voitures électriques qui ne disposent pas d'un éco-score peuvent devenir redevables de ce malus au poids, après un abattement forfaitaire de 600 kg destiné à tenir compte du poids de la batterie. Concrètement, ce sont surtout les modèles électriques les plus lourds ou importés, dépourvus d'éco-score, qui perdent l'exemption totale dont ils bénéficiaient jusque-là.",
          },
        ],
        faq: [
          { question: "Les voitures électriques paient-elles le malus écologique CO2 ?", answer: "Non, le malus CO2 s'applique aux véhicules émettant plus de 108 g de CO2/km, et les voitures électriques, qui n'émettent aucun CO2, en restent exemptées." },
          { question: "Les voitures électriques peuvent-elles être concernées par le malus au poids ?", answer: "Oui, depuis le 1er juillet 2026, les voitures électriques sans éco-score peuvent être soumises au malus au poids, après un abattement forfaitaire de 600 kg." },
          { question: "Quel est le seuil du malus au poids en 2026 ?", answer: "Le seuil a été abaissé de 1 600 à 1 500 kg, avec un barème progressif de 10 à 30 € par kilogramme selon les tranches." },
          { question: "Toutes les voitures électriques sont-elles concernées par le malus au poids ?", answer: "Ce sont surtout les modèles électriques les plus lourds ou importés, dépourvus d'éco-score, qui perdent l'exemption totale dont ils bénéficiaient jusque-là." },
        ],
        ...cta.fr,
      },
      en: {
        eyebrow: "Regulation",
        title: "France's 2026 Eco-Malus: Electric Cars Are No Longer Entirely Exempt",
        excerpt:
          "The weight-based malus can now apply to certain electric cars without an eco-score, a first since the mechanism was created.",
        metaTitle: "France's 2026 Ecological Malus: Weight Penalty Now Hits Some EVs",
        metaDescription:
          "France's CO2 malus still exempts electric cars, but the weight-based malus can now apply to some models lacking an eco-score since July 2026.",
        body: [
          {
            type: "p",
            text: "Electric cars in France have long been shielded from every ecological penalty. That's no longer entirely true as of 2026, when some of them became subject to the weight-based malus for the first time.",
          },
          { type: "h2", text: "The CO2 malus still doesn't affect electric cars" },
          {
            type: "p",
            text: "The classic ecological malus, based on CO2 emissions, applies to new cars emitting more than 108g of CO2 per kilometer under the WLTP cycle, and can reach up to 80,000 euros for the most polluting vehicles, above 191g/km. Electric cars, which emit no CO2 while driving, remain exempt from this part of the system.",
          },
          { type: "h2", text: "The weight-based malus is now a real risk for some models" },
          {
            type: "p",
            text: "The threshold that triggers the weight-based malus was lowered in 2026, from 1,600 to 1,500 kg, with a progressive scale of 10 to 30 euros per kilogram depending on the bracket.",
          },
          { type: "h2", text: "The end of a blanket exemption" },
          {
            type: "p",
            text: "Since July 1, 2026, electric cars that don't hold an eco-score qualification can become liable for this weight-based malus, after a flat 600kg abatement meant to account for battery weight. In practice, it's mainly the heaviest or imported electric models without an eco-score that lose the full exemption they previously enjoyed.",
          },
        ],
        faq: [
          { question: "Do electric cars pay the CO2 ecological malus?", answer: "No, the CO2 malus applies to vehicles emitting more than 108g of CO2/km, and electric cars, which emit no CO2, remain exempt." },
          { question: "Can electric cars be subject to the weight-based malus?", answer: "Yes, since July 1, 2026, electric cars without an eco-score can become liable for the weight-based malus, after a flat 600kg abatement." },
          { question: "What's the weight-malus threshold in 2026?", answer: "The threshold was lowered from 1,600 to 1,500 kg, with a progressive scale of 10 to 30 euros per kilogram depending on the bracket." },
          { question: "Are all electric cars affected by the weight malus?", answer: "Mainly the heaviest or imported electric models without an eco-score are the ones losing the full exemption they previously had." },
        ],
        ...cta.en,
      },
      de: {
        eyebrow: "Regulierung",
        title: "Frankreichs Öko-Malus 2026: Elektroautos sind nicht mehr vollständig ausgenommen",
        excerpt:
          "Der gewichtsbasierte Malus kann jetzt auch bestimmte Elektroautos ohne Öko-Score treffen, ein Novum seit Einführung dieses Instruments.",
        metaTitle: "Frankreichs Öko-Malus 2026: Gewichtsstrafe trifft nun auch E-Autos",
        metaDescription:
          "Der CO2-Malus in Frankreich befreit Elektroautos weiterhin, doch der Gewichtsmalus kann seit Juli 2026 einige Modelle ohne Öko-Score treffen.",
        body: [
          {
            type: "p",
            text: "Elektroautos in Frankreich waren lange vor jeder Öko-Strafe geschützt. Das gilt seit 2026 nicht mehr uneingeschränkt, denn ein Teil von ihnen kann nun erstmals vom gewichtsbasierten Malus betroffen sein.",
          },
          { type: "h2", text: "Der CO2-Malus trifft Elektroautos weiterhin nicht" },
          {
            type: "p",
            text: "Der klassische Öko-Malus, der auf CO2-Emissionen basiert, gilt für Neuwagen mit mehr als 108 Gramm CO2 pro Kilometer nach WLTP-Zyklus und kann für die umweltschädlichsten Fahrzeuge, über 191 g/km, bis zu 80.000 Euro betragen. Elektroautos, die im Betrieb kein CO2 ausstoßen, bleiben von diesem Teil weiterhin befreit.",
          },
          { type: "h2", text: "Der Gewichtsmalus wird für manche Modelle zum echten Risiko" },
          {
            type: "p",
            text: "Die Schwelle für den gewichtsbasierten Malus wurde 2026 gesenkt, von 1.600 auf 1.500 kg, mit einer progressiven Staffel von 10 bis 30 Euro pro Kilogramm je nach Gewichtsklasse.",
          },
          { type: "h2", text: "Das Ende einer vollständigen Befreiung" },
          {
            type: "p",
            text: "Seit dem 1. Juli 2026 können Elektroautos ohne Öko-Score-Zertifizierung diesem Gewichtsmalus unterliegen, nach einem pauschalen Abzug von 600 kg zur Berücksichtigung des Batteriegewichts. In der Praxis verlieren vor allem die schwersten oder importierten Elektromodelle ohne Öko-Score die bisherige vollständige Befreiung.",
          },
        ],
        faq: [
          { question: "Zahlen Elektroautos den CO2-Öko-Malus?", answer: "Nein, der CO2-Malus gilt für Fahrzeuge mit mehr als 108 Gramm CO2 pro km, und Elektroautos, die kein CO2 ausstoßen, bleiben davon befreit." },
          { question: "Können Elektroautos vom Gewichtsmalus betroffen sein?", answer: "Ja, seit dem 1. Juli 2026 können Elektroautos ohne Öko-Score dem Gewichtsmalus unterliegen, nach einem pauschalen Abzug von 600 kg." },
          { question: "Wo liegt die Schwelle für den Gewichtsmalus 2026?", answer: "Die Schwelle wurde von 1.600 auf 1.500 kg gesenkt, mit einer progressiven Staffel von 10 bis 30 Euro pro Kilogramm je nach Gewichtsklasse." },
          { question: "Betrifft der Gewichtsmalus alle Elektroautos?", answer: "Vor allem die schwersten oder importierten Elektromodelle ohne Öko-Score verlieren die bisherige vollständige Befreiung." },
        ],
        ...cta.de,
      },
      es: {
        eyebrow: "Regulación",
        title: "Impuesto ecológico en Francia 2026: los coches eléctricos ya no están del todo exentos",
        excerpt:
          "El recargo por peso puede aplicarse ahora a ciertos coches eléctricos sin eco-score, una novedad desde que existe este mecanismo.",
        metaTitle: "Impuesto ecológico en Francia 2026: el recargo por peso llega a algunos eléctricos",
        metaDescription:
          "El recargo por CO2 en Francia sigue sin afectar a los coches eléctricos, pero el recargo por peso ya puede aplicarse a algunos modelos sin eco-score desde julio de 2026.",
        body: [
          {
            type: "p",
            text: "Los coches eléctricos en Francia llevaban mucho tiempo a salvo de cualquier recargo ecológico. Eso ya no es del todo cierto desde 2026, cuando algunos de ellos quedaron sujetos por primera vez al recargo por peso.",
          },
          { type: "h2", text: "El recargo por CO2 sigue sin afectar a los eléctricos" },
          {
            type: "p",
            text: "El recargo ecológico clásico, basado en las emisiones de CO2, se aplica a los coches nuevos que superan los 108 g de CO2 por kilómetro en ciclo WLTP, y puede llegar hasta 80.000 euros para los vehículos más contaminantes, por encima de 191 g/km. Los coches eléctricos, que no emiten CO2 en uso, siguen exentos de esta parte.",
          },
          { type: "h2", text: "El recargo por peso, un nuevo riesgo para algunos modelos" },
          {
            type: "p",
            text: "El umbral que activa el recargo por peso se rebajó en 2026, de 1.600 a 1.500 kg, con una escala progresiva de 10 a 30 euros por kilo según el tramo.",
          },
          { type: "h2", text: "El fin de una exención total" },
          {
            type: "p",
            text: "Desde el 1 de julio de 2026, los coches eléctricos que no cuentan con la certificación eco-score pueden quedar sujetos a este recargo por peso, tras aplicar una deducción fija de 600 kg que tiene en cuenta el peso de la batería. En la práctica, son sobre todo los modelos eléctricos más pesados o importados sin eco-score los que pierden la exención total de la que disfrutaban hasta ahora.",
          },
        ],
        faq: [
          { question: "¿Pagan los coches eléctricos el recargo ecológico por CO2?", answer: "No, el recargo por CO2 se aplica a los vehículos que emiten más de 108 g de CO2/km, y los coches eléctricos, que no emiten CO2, siguen exentos." },
          { question: "¿Pueden los coches eléctricos verse afectados por el recargo por peso?", answer: "Sí, desde el 1 de julio de 2026, los coches eléctricos sin eco-score pueden quedar sujetos al recargo por peso, tras una deducción fija de 600 kg." },
          { question: "¿Cuál es el umbral del recargo por peso en 2026?", answer: "El umbral se rebajó de 1.600 a 1.500 kg, con una escala progresiva de 10 a 30 euros por kilo según el tramo." },
          { question: "¿Afecta el recargo por peso a todos los coches eléctricos?", answer: "Sobre todo a los modelos eléctricos más pesados o importados sin eco-score, que pierden la exención total de la que disfrutaban antes." },
        ],
        ...cta.es,
      },
    },
  },
  {
    slug: "voitures-electriques-chinoises-france",
    publishedAt: "2026-08-11",
    image: {
      src: "/blog/voitures-electriques-chinoises-france.jpg",
      alt: {
        fr: "MG4, un modèle électrique compact de la marque chinoise MG exposé en salon automobile",
        en: "An MG4, a compact electric car from the Chinese brand MG, shown at a motor show",
        de: "Ein MG4, ein kompaktes Elektroauto der chinesischen Marke MG, auf einer Automesse",
        es: "Un MG4, un coche eléctrico compacto de la marca china MG, expuesto en un salón del automóvil",
      },
      credit: {
        name: "Alexander Migl",
        url: "https://commons.wikimedia.org/wiki/File:MG4_EV_Automesse_Ludwigsburg_2022_1X7A5873.jpg",
        license: "CC BY-SA 4.0",
      },
    },
    content: {
      fr: {
        eyebrow: "Marché",
        title: "Voitures électriques chinoises : la percée se confirme sur le marché français",
        excerpt:
          "Les marques chinoises approchent 8 % du marché automobile français, avec près d'une voiture électrique vendue sur quatre en 2025-2026.",
        metaTitle: "Voitures électriques chinoises en France 2026 : le point",
        metaDescription:
          "BYD, MG, Leapmotor : les marques chinoises approchent 8 % du marché automobile français en 2026 et pèsent de plus en plus lourd parmi les électriques vendues.",
        body: [
          {
            type: "p",
            text: "Impossible d'ignorer la montée en puissance des constructeurs chinois sur les routes françaises. En 2026, leur poids dans les ventes de voitures électriques neuves atteint un niveau inédit.",
          },
          { type: "h2", text: "Une part de marché qui grimpe" },
          {
            type: "p",
            text: "Les marques chinoises approchent désormais 8 % du marché automobile global en France, tous types de motorisation confondus, au mois de juillet 2026. Sur le seul segment électrique, environ une voiture sur quatre vendue en France en 2025-2026 pourrait être une marque chinoise.",
          },
          { type: "h2", text: "BYD et MG en tête de file" },
          {
            type: "p",
            text: "BYD s'impose comme le leader incontesté des marques chinoises en France, fort de son statut de numéro un mondial du véhicule électrique depuis 2023. MG Motor reste la marque chinoise la plus implantée dans l'Hexagone, avec plus de 200 points de vente, sa MG4 s'étant imposée comme l'une des électriques compactes les plus vendues d'Europe en 2023 et 2024. Leapmotor et Xpeng gagnent également du terrain.",
          },
          { type: "h2", text: "Des droits de douane qui n'ont pas cassé la dynamique" },
          {
            type: "p",
            text: "Depuis fin 2024, l'Union européenne applique des surtaxes douanières sur les véhicules électriques fabriqués en Chine, variables selon les constructeurs : 17 % pour BYD, 35,3 % pour SAIC, la maison mère de MG. Ces surtaxes pèsent sur les prix, mais n'ont pas encore effacé l'avantage compétitif de ces marques en matière de tarifs, d'équipements et d'autonomie.",
          },
        ],
        faq: [
          { question: "Quelle part du marché automobile français les marques chinoises occupent-elles ?", answer: "Les marques chinoises approchent 8 % du marché automobile global en France en juillet 2026, tous types de motorisation confondus." },
          { question: "Quelle proportion des voitures électriques vendues en France est chinoise ?", answer: "Environ une voiture électrique sur quatre vendue en France en 2025-2026 pourrait être une marque chinoise." },
          { question: "Quelle est la marque chinoise leader en France ?", answer: "BYD s'impose comme le leader incontesté des marques chinoises en France, fort de son statut de numéro un mondial du véhicule électrique depuis 2023." },
          { question: "Les surtaxes douanières européennes ont-elles freiné les marques chinoises ?", answer: "Les surtaxes de 17 % pour BYD et 35,3 % pour SAIC, la maison mère de MG, pèsent sur les prix mais n'ont pas encore effacé leur avantage compétitif." },
        ],
        ...cta.fr,
      },
      en: {
        eyebrow: "Market",
        title: "Chinese Electric Cars Keep Gaining Ground in France",
        excerpt:
          "Chinese brands are approaching 8% of the French car market, with roughly one in four electric cars sold in France in 2025-2026 being Chinese.",
        metaTitle: "Chinese EVs in France 2026: Where Things Stand",
        metaDescription:
          "BYD, MG, Leapmotor: Chinese brands are approaching 8% of the French car market in 2026 and account for a growing share of electric car sales.",
        body: [
          {
            type: "p",
            text: "It's hard to ignore the rise of Chinese automakers on French roads. In 2026, their share of new electric car sales in France has reached an unprecedented level.",
          },
          { type: "h2", text: "A growing market share" },
          {
            type: "p",
            text: "Chinese brands are now approaching 8% of the overall French car market, across all powertrains, as of July 2026. On the electric segment alone, roughly one in four electric cars sold in France in 2025-2026 could carry a Chinese brand.",
          },
          { type: "h2", text: "BYD and MG lead the pack" },
          {
            type: "p",
            text: "BYD stands out as the clear leader among Chinese brands in France, backed by its status as the world's top electric-vehicle seller since 2023. MG Motor remains the most established Chinese brand in the country, with over 200 points of sale, and its MG4 has been among Europe's best-selling compact electric cars in 2023 and 2024. Leapmotor and Xpeng are also gaining ground.",
          },
          { type: "h2", text: "EU tariffs haven't broken the momentum" },
          {
            type: "p",
            text: "Since late 2024, the European Union has applied extra tariffs on electric vehicles made in China, varying by manufacturer: 17% for BYD, 35.3% for SAIC, MG's parent company. These tariffs weigh on prices, but they haven't yet erased these brands' competitive edge on pricing, equipment, and range.",
          },
        ],
        faq: [
          { question: "What share of the French car market do Chinese brands hold?", answer: "Chinese brands are approaching 8% of the overall French car market as of July 2026, across all powertrains." },
          { question: "What proportion of electric cars sold in France are Chinese?", answer: "Roughly one in four electric cars sold in France in 2025-2026 could carry a Chinese brand." },
          { question: "Which Chinese brand leads in France?", answer: "BYD stands out as the clear leader among Chinese brands in France, backed by its status as the world's top electric-vehicle seller since 2023." },
          { question: "Have EU tariffs slowed down Chinese brands?", answer: "Tariffs of 17% for BYD and 35.3% for SAIC, MG's parent company, weigh on prices but haven't yet erased their competitive edge." },
        ],
        ...cta.en,
      },
      de: {
        eyebrow: "Markt",
        title: "Chinesische Elektroautos gewinnen in Frankreich weiter an Boden",
        excerpt:
          "Chinesische Marken nähern sich 8 Prozent des französischen Automarkts, mit etwa jedem vierten in Frankreich 2025-2026 verkauften Elektroauto aus China.",
        metaTitle: "Chinesische Elektroautos in Frankreich 2026: Der Stand der Dinge",
        metaDescription:
          "BYD, MG, Leapmotor: Chinesische Marken nähern sich 2026 acht Prozent des französischen Automarkts und gewinnen bei Elektroautos weiter an Gewicht.",
        body: [
          {
            type: "p",
            text: "Der Aufstieg chinesischer Autohersteller auf Frankreichs Straßen lässt sich kaum übersehen. 2026 erreicht ihr Anteil an den Neuzulassungen von Elektroautos in Frankreich ein bislang unerreichtes Niveau.",
          },
          { type: "h2", text: "Ein wachsender Marktanteil" },
          {
            type: "p",
            text: "Chinesische Marken nähern sich mittlerweile, über alle Antriebsarten hinweg, acht Prozent des gesamten französischen Automarkts, Stand Juli 2026. Allein im Elektrosegment könnte etwa jedes vierte in Frankreich 2025-2026 verkaufte Elektroauto von einer chinesischen Marke stammen.",
          },
          { type: "h2", text: "BYD und MG an der Spitze" },
          {
            type: "p",
            text: "BYD gilt als klarer Marktführer unter den chinesischen Marken in Frankreich, gestützt auf seinen Status als weltweit führender Elektroauto-Verkäufer seit 2023. MG Motor bleibt die am stärksten etablierte chinesische Marke im Land, mit über 200 Verkaufsstellen, sein MG4 zählte 2023 und 2024 zu den meistverkauften kompakten Elektroautos Europas. Auch Leapmotor und Xpeng gewinnen an Boden.",
          },
          { type: "h2", text: "EU-Zölle haben die Dynamik nicht gebrochen" },
          {
            type: "p",
            text: "Seit Ende 2024 erhebt die Europäische Union zusätzliche Zölle auf in China gefertigte Elektrofahrzeuge, je nach Hersteller unterschiedlich: 17 Prozent für BYD, 35,3 Prozent für SAIC, die Muttergesellschaft von MG. Diese Zölle belasten die Preise, haben den Preis-, Ausstattungs- und Reichweitenvorteil dieser Marken aber bislang nicht zunichte gemacht.",
          },
        ],
        faq: [
          { question: "Welchen Anteil am französischen Automarkt haben chinesische Marken?", answer: "Chinesische Marken nähern sich zum Juli 2026 acht Prozent des gesamten französischen Automarkts, über alle Antriebsarten hinweg." },
          { question: "Welcher Anteil der in Frankreich verkauften Elektroautos ist chinesisch?", answer: "Etwa jedes vierte in Frankreich 2025-2026 verkaufte Elektroauto könnte von einer chinesischen Marke stammen." },
          { question: "Welche chinesische Marke führt in Frankreich?", answer: "BYD gilt als klarer Marktführer unter den chinesischen Marken in Frankreich, gestützt auf seinen Status als weltweit führender Elektroauto-Verkäufer seit 2023." },
          { question: "Haben die EU-Zölle die chinesischen Marken gebremst?", answer: "Zölle von 17 Prozent für BYD und 35,3 Prozent für SAIC, die Muttergesellschaft von MG, belasten die Preise, haben ihren Wettbewerbsvorteil aber bisher nicht zunichtegemacht." },
        ],
        ...cta.de,
      },
      es: {
        eyebrow: "Mercado",
        title: "Los coches eléctricos chinos siguen ganando terreno en Francia",
        excerpt:
          "Las marcas chinas se acercan al 8 % del mercado automovilístico francés, con cerca de uno de cada cuatro eléctricos vendidos en Francia en 2025-2026.",
        metaTitle: "Coches eléctricos chinos en Francia 2026: el estado de la cuestión",
        metaDescription:
          "BYD, MG, Leapmotor: las marcas chinas se acercan al 8 % del mercado francés en 2026 y ganan peso entre los coches eléctricos vendidos.",
        body: [
          {
            type: "p",
            text: "Es imposible ignorar el ascenso de los fabricantes chinos en las carreteras francesas. En 2026, su peso en las ventas de coches eléctricos nuevos en Francia alcanza un nivel sin precedentes.",
          },
          { type: "h2", text: "Una cuota de mercado en aumento" },
          {
            type: "p",
            text: "Las marcas chinas se acercan ya al 8 % del mercado automovilístico global en Francia, con todo tipo de motorización incluida, a fecha de julio de 2026. Solo en el segmento eléctrico, cerca de uno de cada cuatro coches vendidos en Francia en 2025-2026 podría ser de una marca china.",
          },
          { type: "h2", text: "BYD y MG a la cabeza" },
          {
            type: "p",
            text: "BYD se impone como líder indiscutible entre las marcas chinas en Francia, respaldado por su condición de mayor vendedor mundial de vehículos eléctricos desde 2023. MG Motor sigue siendo la marca china más implantada en el país, con más de 200 puntos de venta, y su MG4 ha sido uno de los eléctricos compactos más vendidos de Europa en 2023 y 2024. Leapmotor y Xpeng también ganan terreno.",
          },
          { type: "h2", text: "Los aranceles de la UE no han frenado el impulso" },
          {
            type: "p",
            text: "Desde finales de 2024, la Unión Europea aplica aranceles adicionales a los vehículos eléctricos fabricados en China, que varían según el fabricante: un 17 % para BYD, un 35,3 % para SAIC, la matriz de MG. Estos aranceles presionan los precios, pero todavía no han borrado la ventaja competitiva de estas marcas en precio, equipamiento y autonomía.",
          },
        ],
        faq: [
          { question: "¿Qué cuota del mercado automovilístico francés tienen las marcas chinas?", answer: "Las marcas chinas se acercan al 8 % del mercado automovilístico global en Francia en julio de 2026, con todo tipo de motorización incluida." },
          { question: "¿Qué proporción de los coches eléctricos vendidos en Francia es china?", answer: "Cerca de uno de cada cuatro coches eléctricos vendidos en Francia en 2025-2026 podría ser de una marca china." },
          { question: "¿Cuál es la marca china líder en Francia?", answer: "BYD se impone como líder indiscutible entre las marcas chinas en Francia, respaldado por su condición de mayor vendedor mundial de vehículos eléctricos desde 2023." },
          { question: "¿Han frenado los aranceles europeos a las marcas chinas?", answer: "Los aranceles del 17 % para BYD y del 35,3 % para SAIC, la matriz de MG, presionan los precios pero todavía no han borrado su ventaja competitiva." },
        ],
        ...cta.es,
      },
    },
  },
  {
    slug: "zfe-2026-vehicules-electriques",
    publishedAt: "2026-08-14",
    image: {
      src: "/blog/zfe-2026-vehicules-electriques.png",
      alt: {
        fr: "La vignette Crit'Air verte réservée aux véhicules électriques et hydrogène",
        en: "The green Crit'Air sticker reserved for electric and hydrogen vehicles in France",
        de: "Die grüne Crit'Air-Plakette für Elektro- und Wasserstofffahrzeuge in Frankreich",
        es: "La pegatina Crit'Air verde reservada a los vehículos eléctricos y de hidrógeno en Francia",
      },
      credit: {
        name: "PBrieux",
        url: "https://commons.wikimedia.org/wiki/File:Vignette_Crit%27Air_pour_v%C3%A9hicules_%C3%A9lectriques_et_hydrog%C3%A8nes.svg",
        license: "CC BY-SA 4.0",
      },
    },
    content: {
      fr: {
        eyebrow: "Réglementation",
        title: "ZFE en 2026 : où en est-on après la décision du Conseil constitutionnel",
        excerpt:
          "Les zones à faibles émissions ne sont pas supprimées : leur abrogation, votée en avril 2026, a été jugée inconstitutionnelle en mai.",
        metaTitle: "ZFE 2026 en France : calendrier et véhicules concernés",
        metaDescription:
          "Les ZFE restent en vigueur en France après la décision du Conseil constitutionnel de mai 2026. Calendrier, villes concernées et place de la voiture électrique.",
        body: [
          {
            type: "p",
            text: "Le sujet des zones à faibles émissions (ZFE) a connu un rebondissement en 2026. Après un vote pour leur suppression, elles restent finalement bien en vigueur, et entrent même dans une phase plus stricte.",
          },
          { type: "h2", text: "Une abrogation votée, puis annulée" },
          {
            type: "p",
            text: "En avril 2026, l'Assemblée nationale avait voté la suppression des ZFE. Mais le Conseil constitutionnel a jugé cette abrogation inconstitutionnelle en mai 2026, ce qui a maintenu le dispositif en vigueur sur l'ensemble du territoire concerné.",
          },
          { type: "h2", text: "Une phase plus stricte en 2026" },
          {
            type: "p",
            text: "Loin de s'assouplir, 2026 marque au contraire un durcissement progressif : de plus en plus de villes étendent leurs restrictions aux véhicules classés Crit'Air 4, et parfois même Crit'Air 3. Environ 42 agglomérations françaises disposent formellement d'une ZFE, mais une douzaine seulement appliquent aujourd'hui des restrictions réelles. Paris et Grenoble ciblent déjà les Crit'Air 3, et Lyon applique cette même restriction depuis juillet 2026.",
          },
          { type: "h2", text: "Des contrôles encore progressifs" },
          {
            type: "p",
            text: "Jusqu'au 31 décembre 2026, les contrôles restent, dans de nombreuses zones, sporadiques et à visée essentiellement pédagogique plutôt que systématiquement verbalisés.",
          },
          { type: "h2", text: "La voiture électrique, à l'abri des restrictions" },
          {
            type: "p",
            text: "Dans ce contexte mouvant, les voitures électriques bénéficient d'une vignette Crit'Air non concernée par les restrictions, quel que soit le lieu de résidence ou de déplacement habituel du conducteur, un argument de poids face à des règles appelées à se durcir encore dans les années qui viennent.",
          },
        ],
        faq: [
          { question: "Les ZFE ont-elles été supprimées en France en 2026 ?", answer: "Non, leur abrogation votée par l'Assemblée nationale en avril 2026 a été jugée inconstitutionnelle par le Conseil constitutionnel en mai 2026 : les ZFE restent en vigueur." },
          { question: "Combien de villes appliquent réellement des restrictions ZFE ?", answer: "Environ 42 agglomérations disposent formellement d'une ZFE, mais une douzaine seulement appliquent aujourd'hui des restrictions réelles." },
          { question: "Quelles villes ciblent déjà les véhicules Crit'Air 3 ?", answer: "Paris et Grenoble ciblent déjà les Crit'Air 3, et Lyon applique cette même restriction depuis juillet 2026." },
          { question: "Les voitures électriques sont-elles concernées par les restrictions ZFE ?", answer: "Non, les voitures électriques bénéficient d'une vignette Crit'Air non concernée par les restrictions, quel que soit le lieu de résidence du conducteur." },
        ],
        ...cta.fr,
      },
      en: {
        eyebrow: "Regulation",
        title: "Low-Emission Zones in France 2026: Where Things Stand After the Constitutional Council's Ruling",
        excerpt:
          "France's low-emission zones haven't been abolished: their repeal, voted in April 2026, was ruled unconstitutional in May.",
        metaTitle: "France's Low-Emission Zones (ZFE) 2026: Timeline and Vehicles Affected",
        metaDescription:
          "France's low-emission zones remain in force after the Constitutional Council's May 2026 ruling. Timeline, cities affected, and where electric cars stand.",
        body: [
          {
            type: "p",
            text: "France's low-emission zones, known as ZFE, took an unexpected turn in 2026. After a vote to abolish them, they remain firmly in place, and are even entering a stricter phase.",
          },
          { type: "h2", text: "A repeal voted, then struck down" },
          {
            type: "p",
            text: "In April 2026, the National Assembly voted to abolish France's low-emission zones. But the Constitutional Council ruled that repeal unconstitutional in May 2026, keeping the system in force across the areas it applies to.",
          },
          { type: "h2", text: "A stricter phase in 2026" },
          {
            type: "p",
            text: "Far from easing up, 2026 actually marks a gradual tightening: more and more cities are extending restrictions to Crit'Air 4 vehicles, and in some cases even Crit'Air 3. Roughly 42 French metro areas formally have a low-emission zone, but only around a dozen currently enforce real restrictions. Paris and Grenoble already target Crit'Air 3 vehicles, and Lyon has applied the same restriction since July 2026.",
          },
          { type: "h2", text: "Enforcement remains gradual" },
          {
            type: "p",
            text: "Through December 31, 2026, checks in many zones remain sporadic and mostly educational rather than systematically fined.",
          },
          { type: "h2", text: "Electric cars sit outside the restrictions" },
          {
            type: "p",
            text: "In this shifting landscape, electric cars carry a Crit'Air sticker that isn't affected by these restrictions, regardless of where the driver lives or usually travels, a strong argument as the rules are expected to keep tightening in the years ahead.",
          },
        ],
        faq: [
          { question: "Were France's low-emission zones abolished in 2026?", answer: "No, their repeal voted by the National Assembly in April 2026 was ruled unconstitutional by the Constitutional Council in May 2026, so the zones remain in force." },
          { question: "How many cities actually enforce ZFE restrictions?", answer: "About 42 metro areas formally have a low-emission zone, but only around a dozen currently enforce real restrictions." },
          { question: "Which cities already target Crit'Air 3 vehicles?", answer: "Paris and Grenoble already target Crit'Air 3 vehicles, and Lyon has applied the same restriction since July 2026." },
          { question: "Are electric cars affected by ZFE restrictions?", answer: "No, electric cars carry a Crit'Air sticker that isn't affected by these restrictions, regardless of where the driver lives." },
        ],
        ...cta.en,
      },
      de: {
        eyebrow: "Regulierung",
        title: "Umweltzonen in Frankreich 2026: Der Stand nach dem Urteil des Verfassungsrats",
        excerpt:
          "Frankreichs Umweltzonen (ZFE) wurden nicht abgeschafft: Ihre im April 2026 beschlossene Abschaffung wurde im Mai für verfassungswidrig erklärt.",
        metaTitle: "Frankreichs Umweltzonen (ZFE) 2026: Zeitplan und betroffene Fahrzeuge",
        metaDescription:
          "Frankreichs Umweltzonen bleiben nach dem Urteil des Verfassungsrats vom Mai 2026 in Kraft. Zeitplan, betroffene Städte und die Rolle von Elektroautos.",
        body: [
          {
            type: "p",
            text: "Das Thema Umweltzonen (ZFE) in Frankreich nahm 2026 eine unerwartete Wendung. Nach einer Abstimmung für ihre Abschaffung bleiben sie letztlich in Kraft, und treten sogar in eine strengere Phase ein.",
          },
          { type: "h2", text: "Eine beschlossene, dann gekippte Abschaffung" },
          {
            type: "p",
            text: "Im April 2026 stimmte die Nationalversammlung für die Abschaffung der französischen Umweltzonen. Doch der Verfassungsrat erklärte diese Abschaffung im Mai 2026 für verfassungswidrig, sodass das System in den betroffenen Gebieten in Kraft blieb.",
          },
          { type: "h2", text: "Eine strengere Phase im Jahr 2026" },
          {
            type: "p",
            text: "Statt sich zu lockern, verschärft sich die Lage 2026 sogar schrittweise: Immer mehr Städte weiten ihre Beschränkungen auf Fahrzeuge der Kategorie Crit'Air 4 aus, teilweise sogar auf Crit'Air 3. Rund 42 französische Ballungsräume verfügen formal über eine Umweltzone, doch nur etwa ein Dutzend setzt derzeit tatsächliche Beschränkungen durch. Paris und Grenoble richten sich bereits gegen Crit'Air-3-Fahrzeuge, Lyon wendet dieselbe Beschränkung seit Juli 2026 an.",
          },
          { type: "h2", text: "Kontrollen bleiben schrittweise" },
          {
            type: "p",
            text: "Bis zum 31. Dezember 2026 bleiben die Kontrollen in vielen Zonen eher sporadisch und vorwiegend aufklärend statt systematisch mit Bußgeldern verbunden.",
          },
          { type: "h2", text: "Elektroautos bleiben von den Beschränkungen verschont" },
          {
            type: "p",
            text: "In diesem sich wandelnden Umfeld tragen Elektroautos eine Crit'Air-Plakette, die von diesen Beschränkungen nicht betroffen ist, unabhängig davon, wo der Fahrer wohnt oder üblicherweise unterwegs ist, ein starkes Argument angesichts weiter verschärfter Regeln in den kommenden Jahren.",
          },
        ],
        faq: [
          { question: "Wurden Frankreichs Umweltzonen 2026 abgeschafft?", answer: "Nein, ihre im April 2026 von der Nationalversammlung beschlossene Abschaffung wurde im Mai 2026 vom Verfassungsrat für verfassungswidrig erklärt, die Zonen bleiben also in Kraft." },
          { question: "Wie viele Städte setzen tatsächlich ZFE-Beschränkungen durch?", answer: "Rund 42 Ballungsräume verfügen formal über eine Umweltzone, doch nur etwa ein Dutzend setzt derzeit tatsächliche Beschränkungen durch." },
          { question: "Welche Städte richten sich bereits gegen Crit'Air-3-Fahrzeuge?", answer: "Paris und Grenoble richten sich bereits gegen Crit'Air-3-Fahrzeuge, Lyon wendet dieselbe Beschränkung seit Juli 2026 an." },
          { question: "Sind Elektroautos von den ZFE-Beschränkungen betroffen?", answer: "Nein, Elektroautos tragen eine Crit'Air-Plakette, die von diesen Beschränkungen nicht betroffen ist, unabhängig davon, wo der Fahrer wohnt." },
        ],
        ...cta.de,
      },
      es: {
        eyebrow: "Regulación",
        title: "Zonas de bajas emisiones en Francia 2026: la situación tras el fallo del Consejo Constitucional",
        excerpt:
          "Las zonas de bajas emisiones en Francia no han desaparecido: su derogación, votada en abril de 2026, fue declarada inconstitucional en mayo.",
        metaTitle: "Zonas de bajas emisiones (ZFE) en Francia 2026: calendario y vehículos afectados",
        metaDescription:
          "Las zonas de bajas emisiones siguen vigentes en Francia tras el fallo del Consejo Constitucional de mayo de 2026. Calendario, ciudades afectadas y el papel del eléctrico.",
        body: [
          {
            type: "p",
            text: "El asunto de las zonas de bajas emisiones (ZFE) en Francia dio un giro inesperado en 2026. Tras una votación para suprimirlas, siguen plenamente vigentes, y entran incluso en una fase más estricta.",
          },
          { type: "h2", text: "Una derogación votada, y luego anulada" },
          {
            type: "p",
            text: "En abril de 2026, la Asamblea Nacional votó a favor de suprimir las zonas de bajas emisiones francesas. Pero el Consejo Constitucional declaró esa derogación inconstitucional en mayo de 2026, manteniendo el sistema vigente en las zonas donde se aplica.",
          },
          { type: "h2", text: "Una fase más estricta en 2026" },
          {
            type: "p",
            text: "Lejos de relajarse, 2026 marca en realidad un endurecimiento progresivo: cada vez más ciudades amplían sus restricciones a los vehículos Crit'Air 4, e incluso a los Crit'Air 3 en algunos casos. Unas 42 áreas metropolitanas francesas cuentan formalmente con una zona de bajas emisiones, pero solo una decena aplica hoy restricciones reales. París y Grenoble ya se dirigen a los vehículos Crit'Air 3, y Lyon aplica esa misma restricción desde julio de 2026.",
          },
          { type: "h2", text: "Los controles siguen siendo progresivos" },
          {
            type: "p",
            text: "Hasta el 31 de diciembre de 2026, los controles en muchas zonas siguen siendo esporádicos y principalmente informativos, más que sistemáticamente sancionadores.",
          },
          { type: "h2", text: "El coche eléctrico, al margen de las restricciones" },
          {
            type: "p",
            text: "En este contexto cambiante, los coches eléctricos llevan una etiqueta Crit'Air que no se ve afectada por estas restricciones, sea cual sea el lugar de residencia o los desplazamientos habituales del conductor, un argumento de peso ante unas normas que se espera sigan endureciéndose en los próximos años.",
          },
        ],
        faq: [
          { question: "¿Se abolieron las zonas de bajas emisiones en Francia en 2026?", answer: "No, su derogación votada por la Asamblea Nacional en abril de 2026 fue declarada inconstitucional por el Consejo Constitucional en mayo de 2026, así que las zonas siguen vigentes." },
          { question: "¿Cuántas ciudades aplican realmente restricciones ZFE?", answer: "Unas 42 áreas metropolitanas cuentan formalmente con una zona de bajas emisiones, pero solo una decena aplica hoy restricciones reales." },
          { question: "¿Qué ciudades ya se dirigen a los vehículos Crit'Air 3?", answer: "París y Grenoble ya se dirigen a los vehículos Crit'Air 3, y Lyon aplica esa misma restricción desde julio de 2026." },
          { question: "¿Afectan las restricciones ZFE a los coches eléctricos?", answer: "No, los coches eléctricos llevan una etiqueta Crit'Air que no se ve afectada por estas restricciones, sea cual sea el lugar de residencia del conductor." },
        ],
        ...cta.es,
      },
    },
  },
  {
    slug: "recharge-gratuite-carte-2026",
    publishedAt: "2026-08-17",
    image: {
      src: "/blog/recharge-gratuite-carte-2026.jpg",
      alt: {
        fr: "Point de recharge public pour voiture électrique sur un parking",
        en: "A public EV charging point in a car park",
        de: "Ein öffentlicher Ladepunkt für Elektroautos auf einem Parkplatz",
        es: "Un punto de recarga público para coches eléctricos en un aparcamiento",
      },
      credit: {
        name: "CEphoto, Uwe Aranas",
        url: "https://commons.wikimedia.org/wiki/File:Cologne_Germany_Electric-Car-Charging-Point-at-TUV-Rheinland-01.jpg",
        license: "CC BY-SA 3.0",
      },
    },
    content: {
      fr: {
        eyebrow: "Bornes publiques",
        title: "Recharge gratuite en France : une carte qui se réduit en 2026",
        excerpt:
          "Seuls 3 % des points de recharge publics restent gratuits en France, un chiffre en baisse à mesure que le réseau se professionnalise.",
        metaTitle: "Recharge gratuite en France 2026 : où la trouver encore",
        metaDescription:
          "Seuls 6 233 des 200 045 points de recharge publics sont gratuits en France en 2026. Où trouver encore de la recharge gratuite ou bon marché.",
        body: [
          {
            type: "p",
            text: "Recharger gratuitement sa voiture électrique en France devient de plus en plus rare. À mesure que le réseau public se densifie et se professionnalise, la part de bornes gratuites continue de fondre.",
          },
          { type: "h2", text: "Une part de marché en baisse" },
          {
            type: "p",
            text: "Sur les 200 045 points de recharge publics recensés en France, seuls 6 233 restent gratuits, soit environ 3 % du réseau. Une proportion appelée à baisser encore, à mesure que les opérateurs monétisent davantage leurs installations.",
          },
          { type: "h2", text: "Les derniers refuges de la gratuité" },
          {
            type: "p",
            text: "Carrefour, quelques Intermarché indépendants et certains hôtels, pour leurs clients, figurent parmi les derniers réseaux à proposer encore de la recharge gratuite. À noter que même Carrefour n'est plus gratuit partout : ses bornes 22 kW sont désormais facturées 0,23 € le kWh depuis août 2026, un tarif bon marché mais qui n'est plus gratuit.",
          },
          { type: "h3", text: "Où chercher encore de la recharge accessible" },
          {
            type: "ul",
            items: [
              "Les parkings de supermarchés, pendant vos courses, restent la piste la plus fiable.",
              "Les bornes d'hôtels, réservées en général à la clientèle logeant sur place, pour une recharge de nuit.",
              "Quelques points de recharge municipaux lents, encore proposés gratuitement dans certaines communes.",
            ],
          },
          {
            type: "p",
            text: "En résumé, la recharge gratuite reste une catégorie en recul plutôt qu'en expansion : mieux vaut la considérer comme un bonus occasionnel que comme une stratégie de recharge à part entière.",
          },
        ],
        faq: [
          { question: "Quelle part du réseau de recharge public est encore gratuite en France ?", answer: "Seuls 6 233 des 200 045 points de recharge publics restent gratuits, soit environ 3 % du réseau." },
          { question: "Où trouve-t-on encore de la recharge gratuite ?", answer: "Carrefour, quelques Intermarché indépendants et certains hôtels pour leurs clients figurent parmi les derniers réseaux à proposer encore de la recharge gratuite." },
          { question: "Carrefour propose-t-il toujours de la recharge gratuite ?", answer: "Non, même Carrefour n'est plus gratuit partout : ses bornes 22 kW sont facturées 0,23 € le kWh depuis août 2026." },
          { question: "La recharge gratuite va-t-elle se développer en France ?", answer: "Non, c'est une catégorie en recul plutôt qu'en expansion, à mesure que les opérateurs monétisent davantage leurs installations." },
        ],
        ...cta.fr,
      },
      en: {
        eyebrow: "Public Charging",
        title: "Free EV Charging in France Is Becoming Rarer in 2026",
        excerpt:
          "Only about 3% of public charging points remain free in France, a share that keeps shrinking as the network turns more commercial.",
        metaTitle: "Free EV Charging in France 2026: Where It Still Exists",
        metaDescription:
          "Only 6,233 of France's 200,045 public charging points are free in 2026. Here's where you can still find free or cheap charging.",
        body: [
          {
            type: "p",
            text: "Charging an electric car for free in France is becoming increasingly rare. As the public network grows denser and more commercial, the share of free charging points keeps shrinking.",
          },
          { type: "h2", text: "A shrinking share of the network" },
          {
            type: "p",
            text: "Out of the 200,045 public charging points counted in France, only 6,233 remain free, about 3% of the network, a share expected to keep falling as operators monetize their installations further.",
          },
          { type: "h2", text: "The last refuges of free charging" },
          {
            type: "p",
            text: "Carrefour, a few independent Intermarché stores, and some hotels for their guests are among the last networks still offering free charging. Even Carrefour isn't fully free anymore: its 22kW stations have been priced at 0.23 euros per kWh since August 2026, cheap, but no longer free.",
          },
          { type: "h3", text: "Where to still find accessible charging" },
          {
            type: "ul",
            items: [
              "Supermarket parking lots, while you shop, remain the most reliable option.",
              "Hotel chargers, generally reserved for overnight guests, for charging while you sleep.",
              "A handful of free, slow municipal charging points, still offered in some towns.",
            ],
          },
          {
            type: "p",
            text: "In short, free charging is a shrinking category rather than a growing one: better to treat it as an occasional bonus than as a full charging strategy.",
          },
        ],
        faq: [
          { question: "What share of France's public charging network is still free?", answer: "Only 6,233 of the 200,045 public charging points remain free, about 3% of the network." },
          { question: "Where can you still find free EV charging in France?", answer: "Carrefour, a few independent Intermarché stores, and some hotels for their guests are among the last networks still offering free charging." },
          { question: "Does Carrefour still offer free charging?", answer: "No, even Carrefour isn't free everywhere anymore: its 22kW stations have been priced at 0.23 euros per kWh since August 2026." },
          { question: "Is free charging likely to grow in France?", answer: "No, it's a shrinking category rather than a growing one, as operators increasingly monetize their charging installations." },
        ],
        ...cta.en,
      },
      de: {
        eyebrow: "Öffentliches Laden",
        title: "Kostenloses Laden in Frankreich wird 2026 immer seltener",
        excerpt:
          "Nur noch rund 3 Prozent der öffentlichen Ladepunkte in Frankreich sind kostenlos, ein Anteil, der weiter schrumpft, je kommerzieller das Netz wird.",
        metaTitle: "Kostenloses Laden in Frankreich 2026: Wo es das noch gibt",
        metaDescription:
          "Nur 6.233 von 200.045 öffentlichen Ladepunkten in Frankreich sind 2026 kostenlos. Wo Sie noch kostenlos oder günstig laden können.",
        body: [
          {
            type: "p",
            text: "Ein Elektroauto in Frankreich kostenlos zu laden, wird immer seltener. Je dichter und kommerzieller das öffentliche Netz wird, desto weiter schrumpft der Anteil kostenloser Ladepunkte.",
          },
          { type: "h2", text: "Ein schrumpfender Anteil des Netzes" },
          {
            type: "p",
            text: "Von den in Frankreich gezählten 200.045 öffentlichen Ladepunkten sind nur noch 6.233 kostenlos, etwa 3 Prozent des Netzes, ein Anteil, der weiter sinken dürfte, je mehr Betreiber ihre Anlagen kommerzialisieren.",
          },
          { type: "h2", text: "Die letzten Zufluchtsorte kostenlosen Ladens" },
          {
            type: "p",
            text: "Carrefour, einige unabhängige Intermarché-Filialen und manche Hotels für ihre Gäste zählen zu den letzten Netzen, die noch kostenloses Laden anbieten. Selbst Carrefour ist nicht mehr überall kostenlos: An seinen 22-kW-Stationen werden seit August 2026 0,23 Euro pro kWh berechnet, günstig, aber nicht mehr gratis.",
          },
          { type: "h3", text: "Wo Sie noch zugängliches Laden finden" },
          {
            type: "ul",
            items: [
              "Supermarktparkplätze während des Einkaufs bleiben die zuverlässigste Option.",
              "Hotelladestationen, meist nur für übernachtende Gäste, für das Laden über Nacht.",
              "Einige kostenlose, langsame kommunale Ladepunkte, die es in manchen Gemeinden noch gibt.",
            ],
          },
          {
            type: "p",
            text: "Kurz gesagt: Kostenloses Laden ist eher eine schrumpfende als eine wachsende Kategorie, besser als gelegentlichen Bonus betrachten statt als vollwertige Ladestrategie.",
          },
        ],
        faq: [
          { question: "Welcher Anteil des öffentlichen Ladenetzes in Frankreich ist noch kostenlos?", answer: "Nur 6.233 der 200.045 öffentlichen Ladepunkte sind noch kostenlos, etwa 3 Prozent des Netzes." },
          { question: "Wo findet man in Frankreich noch kostenloses Laden?", answer: "Carrefour, einige unabhängige Intermarché-Filialen und manche Hotels für ihre Gäste zählen zu den letzten Netzen mit kostenlosem Laden." },
          { question: "Bietet Carrefour noch kostenloses Laden an?", answer: "Nein, selbst Carrefour ist nicht mehr überall kostenlos: An seinen 22-kW-Stationen werden seit August 2026 0,23 Euro pro kWh berechnet." },
          { question: "Wird kostenloses Laden in Frankreich zunehmen?", answer: "Nein, es handelt sich um eine schrumpfende statt wachsende Kategorie, da Betreiber ihre Ladeanlagen zunehmend kommerzialisieren." },
        ],
        ...cta.de,
      },
      es: {
        eyebrow: "Recarga pública",
        title: "La recarga gratuita en Francia se vuelve cada vez más escasa en 2026",
        excerpt:
          "Solo alrededor del 3 % de los puntos de recarga públicos siguen siendo gratuitos en Francia, una proporción que sigue reduciéndose.",
        metaTitle: "Recarga gratuita en Francia 2026: dónde encontrarla todavía",
        metaDescription:
          "Solo 6.233 de los 200.045 puntos de recarga públicos de Francia son gratuitos en 2026. Dónde todavía se puede recargar gratis o barato.",
        body: [
          {
            type: "p",
            text: "Recargar un coche eléctrico gratis en Francia es cada vez más difícil. A medida que la red pública se densifica y se vuelve más comercial, la proporción de puntos gratuitos sigue reduciéndose.",
          },
          { type: "h2", text: "Una proporción a la baja" },
          {
            type: "p",
            text: "De los 200.045 puntos de recarga públicos contabilizados en Francia, solo 6.233 siguen siendo gratuitos, en torno al 3 % de la red, una cifra que se espera siga bajando a medida que los operadores monetizan más sus instalaciones.",
          },
          { type: "h2", text: "Los últimos refugios de la recarga gratuita" },
          {
            type: "p",
            text: "Carrefour, algunos Intermarché independientes y ciertos hoteles, para sus clientes, están entre las últimas redes que todavía ofrecen recarga gratuita. Ni siquiera Carrefour es ya gratis en todas partes: sus puntos de 22 kW cuestan 0,23 euros por kWh desde agosto de 2026, barato, pero ya no gratuito.",
          },
          { type: "h3", text: "Dónde buscar todavía recarga accesible" },
          {
            type: "ul",
            items: [
              "Los aparcamientos de supermercados, mientras haces la compra, siguen siendo la opción más fiable.",
              "Los cargadores de hoteles, normalmente reservados a los huéspedes, para recargar por la noche.",
              "Algunos puntos municipales de recarga lenta, todavía gratuitos en algunos municipios.",
            ],
          },
          {
            type: "p",
            text: "En resumen, la recarga gratuita es una categoría a la baja, no al alza: mejor considerarla un extra ocasional que una estrategia de recarga en sí misma.",
          },
        ],
        faq: [
          { question: "¿Qué parte de la red de recarga pública en Francia sigue siendo gratuita?", answer: "Solo 6.233 de los 200.045 puntos de recarga públicos siguen siendo gratuitos, en torno al 3 % de la red." },
          { question: "¿Dónde se puede encontrar todavía recarga gratuita en Francia?", answer: "Carrefour, algunos Intermarché independientes y ciertos hoteles para sus clientes están entre las últimas redes que aún ofrecen recarga gratuita." },
          { question: "¿Sigue ofreciendo Carrefour recarga gratuita?", answer: "No, ni siquiera Carrefour es ya gratis en todas partes: sus puntos de 22 kW cuestan 0,23 euros por kWh desde agosto de 2026." },
          { question: "¿Va a crecer la recarga gratuita en Francia?", answer: "No, es una categoría a la baja y no al alza, a medida que los operadores monetizan cada vez más sus instalaciones." },
        ],
        ...cta.es,
      },
    },
  },
  {
    slug: "autonomie-hiver-voiture-electrique",
    publishedAt: "2026-08-21",
    image: {
      src: "/blog/autonomie-hiver-voiture-electrique.jpg",
      alt: {
        fr: "Borne de recharge rapide pour voiture électrique sous la neige",
        en: "A fast-charging station for electric cars covered in snow",
        de: "Eine Schnellladestation für Elektroautos im Schnee",
        es: "Una estación de carga rápida para coches eléctricos cubierta de nieve",
      },
      credit: null,
    },
    content: {
      fr: {
        eyebrow: "Conseils pratiques",
        title: "Autonomie en hiver : les bons réflexes à adopter avant l'arrivée du froid",
        excerpt:
          "Le froid réduit l'autonomie d'une voiture électrique : voici pourquoi, et comment limiter la perte avant que l'hiver n'arrive.",
        metaTitle: "Autonomie d'une voiture électrique en hiver : conseils pratiques",
        metaDescription:
          "Chimie de la batterie, chauffage, pneus : pourquoi l'autonomie chute en hiver et comment limiter la perte. Les bons réflexes à adopter avant le froid.",
        body: [
          {
            type: "p",
            text: "L'été touche à sa fin, et c'est le bon moment pour anticiper l'hiver : la baisse des températures a un effet bien réel sur l'autonomie d'une voiture électrique. Autant s'y préparer avant que le froid ne s'installe.",
          },
          { type: "h2", text: "Pourquoi le froid réduit l'autonomie" },
          {
            type: "p",
            text: "Plusieurs effets se cumulent en hiver : la chimie de la batterie est moins efficace à basse température, le chauffage de l'habitacle consomme une part importante d'énergie puisqu'une voiture électrique ne dispose pas de la chaleur perdue d'un moteur thermique à récupérer, la résistance au roulement des pneus augmente par temps froid, et le préconditionnement de la batterie consomme lui aussi de l'énergie.",
          },
          { type: "h2", text: "Une perte qui peut être significative" },
          {
            type: "p",
            text: "La baisse d'autonomie est généralement bien perceptible, et peut atteindre, par grand froid, environ un tiers d'autonomie en moins par rapport aux conditions habituelles, selon ce que rapportent couramment les conducteurs.",
          },
          { type: "h3", text: "Les bons réflexes à adopter" },
          {
            type: "ul",
            items: [
              "Préconditionner la batterie et l'habitacle pendant que la voiture est encore branchée, avant le départ.",
              "Privilégier les sièges et le volant chauffants plutôt que de pousser le chauffage de l'habitacle au maximum.",
              "Modérer la vitesse sur autoroute, la résistance de l'air pesant lourd dans la consommation à haute vitesse.",
              "Vérifier régulièrement la pression des pneus, qui baisse naturellement avec le froid.",
              "Prévoir des arrêts de recharge plus fréquents en hiver.",
              "Activer le mode éco ou autonomie du véhicule lorsque les conditions l'exigent.",
            ],
          },
        ],
        faq: [
          { question: "Pourquoi une voiture électrique perd-elle en autonomie l'hiver ?", answer: "Le froid combine plusieurs effets : une chimie de batterie moins efficace, une consommation accrue pour le chauffage de l'habitacle, une résistance au roulement des pneus plus élevée et l'énergie utilisée pour le préconditionnement de la batterie." },
          { question: "Quelle perte d'autonomie peut-on observer par grand froid ?", answer: "Selon ce que rapportent couramment les conducteurs, la perte peut atteindre environ un tiers d'autonomie en moins par rapport aux conditions habituelles." },
          { question: "Comment limiter la perte d'autonomie en hiver ?", answer: "Préconditionner la batterie et l'habitacle pendant que la voiture est encore branchée, privilégier les sièges chauffants plutôt que le chauffage de l'habitacle, et modérer la vitesse sur autoroute permettent de limiter la perte." },
          { question: "Faut-il prévoir plus d'arrêts de recharge en hiver ?", answer: "Oui, il est recommandé de prévoir des arrêts de recharge plus fréquents en hiver et de vérifier régulièrement la pression des pneus, qui baisse avec le froid." },
        ],
        ...cta.fr,
      },
      en: {
        eyebrow: "Practical Tips",
        title: "Winter EV Range: Getting Ready Before the Cold Sets In",
        excerpt:
          "Cold weather reduces an electric car's range, here's why, and how to limit the loss before winter actually arrives.",
        metaTitle: "Electric Car Range in Winter: Practical Tips",
        metaDescription:
          "Battery chemistry, heating, tires: why EV range drops in winter and how to limit the loss. The right habits to adopt before the cold arrives.",
        body: [
          {
            type: "p",
            text: "Summer is winding down, and it's a good time to get ahead of winter: colder temperatures have a very real effect on an electric car's range. Better to prepare before the cold actually settles in.",
          },
          { type: "h2", text: "Why cold weather cuts into range" },
          {
            type: "p",
            text: "Several effects add up in winter: battery chemistry becomes less efficient at low temperatures, cabin heating draws a significant amount of power since an electric car has no waste engine heat to reuse, tire rolling resistance increases in cold conditions, and battery preconditioning also uses energy.",
          },
          { type: "h2", text: "A loss that can be substantial" },
          {
            type: "p",
            text: "The drop in range is usually quite noticeable, and can reach, in the coldest conditions, roughly a third less range than usual, based on what drivers commonly report.",
          },
          { type: "h3", text: "Habits worth adopting" },
          {
            type: "ul",
            items: [
              "Precondition the battery and cabin while the car is still plugged in, before you leave.",
              "Prefer heated seats and steering wheel over cranking up the cabin heater.",
              "Moderate your highway speed, since air resistance weighs heavily on consumption at high speed.",
              "Check tire pressure regularly, since it naturally drops in cold weather.",
              "Plan for more frequent charging stops in winter.",
              "Switch on the car's eco or range mode when conditions call for it.",
            ],
          },
        ],
        faq: [
          { question: "Why does an electric car lose range in winter?", answer: "Cold weather combines several effects: less efficient battery chemistry, more power used for cabin heating, higher tire rolling resistance, and energy spent on battery preconditioning." },
          { question: "How much range can be lost in very cold weather?", answer: "Based on what drivers commonly report, the loss can reach roughly a third less range than usual." },
          { question: "How can I limit range loss in winter?", answer: "Preconditioning the battery and cabin while still plugged in, preferring heated seats over cabin heating, and moderating highway speed all help limit the loss." },
          { question: "Should I plan more charging stops in winter?", answer: "Yes, it's worth planning more frequent charging stops in winter and checking tire pressure regularly, since it drops in cold weather." },
        ],
        ...cta.en,
      },
      de: {
        eyebrow: "Praktische Tipps",
        title: "Reichweite im Winter: So bereiten Sie sich vor der Kälte vor",
        excerpt:
          "Kälte verringert die Reichweite eines Elektroautos, hier erfahren Sie, warum, und wie Sie den Verlust vor dem Winter begrenzen.",
        metaTitle: "Reichweite eines Elektroautos im Winter: praktische Tipps",
        metaDescription:
          "Batteriechemie, Heizung, Reifen: Warum die Reichweite im Winter sinkt und wie Sie den Verlust begrenzen. Die richtigen Gewohnheiten vor der Kälte.",
        body: [
          {
            type: "p",
            text: "Der Sommer neigt sich dem Ende zu, ein guter Zeitpunkt, um sich auf den Winter vorzubereiten: sinkende Temperaturen wirken sich spürbar auf die Reichweite eines Elektroautos aus. Am besten bereitet man sich vor, bevor die Kälte tatsächlich einsetzt.",
          },
          { type: "h2", text: "Warum Kälte die Reichweite verringert" },
          {
            type: "p",
            text: "Im Winter summieren sich mehrere Effekte: Die Batteriechemie arbeitet bei niedrigen Temperaturen weniger effizient, die Heizung des Innenraums verbraucht einen erheblichen Teil der Energie, da einem Elektroauto die Abwärme eines Verbrennungsmotors fehlt, der Rollwiderstand der Reifen steigt bei Kälte, und auch die Vorkonditionierung der Batterie kostet Energie.",
          },
          { type: "h2", text: "Ein Verlust, der erheblich ausfallen kann" },
          {
            type: "p",
            text: "Der Reichweitenverlust ist meist deutlich spürbar und kann bei starker Kälte, nach häufigen Erfahrungsberichten von Fahrern, etwa ein Drittel weniger Reichweite als gewohnt bedeuten.",
          },
          { type: "h3", text: "Diese Gewohnheiten lohnen sich" },
          {
            type: "ul",
            items: [
              "Batterie und Innenraum vorkonditionieren, solange das Auto noch am Ladekabel hängt, vor der Abfahrt.",
              "Sitz- und Lenkradheizung bevorzugen, statt die Innenraumheizung voll aufzudrehen.",
              "Die Geschwindigkeit auf der Autobahn moderat halten, da der Luftwiderstand bei hohem Tempo stark ins Gewicht fällt.",
              "Regelmäßig den Reifendruck prüfen, der bei Kälte natürlicherweise sinkt.",
              "Im Winter häufigere Ladestopps einplanen.",
              "Den Eco- oder Reichweitenmodus des Fahrzeugs aktivieren, wenn die Bedingungen es erfordern.",
            ],
          },
        ],
        faq: [
          { question: "Warum verliert ein Elektroauto im Winter an Reichweite?", answer: "Kälte kombiniert mehrere Effekte: weniger effiziente Batteriechemie, mehr Energieverbrauch für die Innenraumheizung, höherer Rollwiderstand der Reifen und Energieaufwand für die Vorkonditionierung der Batterie." },
          { question: "Wie viel Reichweite kann bei starker Kälte verloren gehen?", answer: "Nach häufigen Erfahrungsberichten von Fahrern kann der Verlust etwa ein Drittel weniger Reichweite als gewohnt bedeuten." },
          { question: "Wie lässt sich der Reichweitenverlust im Winter begrenzen?", answer: "Batterie und Innenraum vorzukonditionieren, solange das Auto noch angeschlossen ist, Sitzheizung statt Innenraumheizung zu bevorzugen und die Geschwindigkeit auf der Autobahn zu moderieren helfen, den Verlust zu begrenzen." },
          { question: "Sollte man im Winter mehr Ladestopps einplanen?", answer: "Ja, es lohnt sich, im Winter häufigere Ladestopps einzuplanen und regelmäßig den Reifendruck zu prüfen, der bei Kälte sinkt." },
        ],
        ...cta.de,
      },
      es: {
        eyebrow: "Consejos prácticos",
        title: "Autonomía en invierno: cómo prepararse antes de que llegue el frío",
        excerpt:
          "El frío reduce la autonomía de un coche eléctrico: te contamos por qué, y cómo limitar la pérdida antes de que llegue el invierno.",
        metaTitle: "Autonomía de un coche eléctrico en invierno: consejos prácticos",
        metaDescription:
          "Química de la batería, calefacción, neumáticos: por qué baja la autonomía en invierno y cómo limitar la pérdida. Los hábitos a adoptar antes del frío.",
        body: [
          {
            type: "p",
            text: "El verano toca a su fin, y es un buen momento para anticiparse al invierno: la bajada de las temperaturas tiene un efecto muy real sobre la autonomía de un coche eléctrico. Mejor prepararse antes de que llegue el frío de verdad.",
          },
          { type: "h2", text: "Por qué el frío reduce la autonomía" },
          {
            type: "p",
            text: "En invierno se suman varios efectos: la química de la batería es menos eficiente a bajas temperaturas, la calefacción del habitáculo consume una parte importante de energía porque un coche eléctrico no tiene calor residual de motor que aprovechar, la resistencia a la rodadura de los neumáticos aumenta con el frío, y el precondicionamiento de la batería también consume energía.",
          },
          { type: "h2", text: "Una pérdida que puede ser considerable" },
          {
            type: "p",
            text: "La caída de autonomía suele notarse claramente, y puede llegar, con mucho frío, a alrededor de un tercio menos de autonomía de lo habitual, según lo que suelen reportar los conductores.",
          },
          { type: "h3", text: "Los hábitos que conviene adoptar" },
          {
            type: "ul",
            items: [
              "Precondicionar la batería y el habitáculo mientras el coche sigue enchufado, antes de salir.",
              "Priorizar los asientos y el volante calefactados en lugar de subir al máximo la calefacción del habitáculo.",
              "Moderar la velocidad en autopista, ya que la resistencia del aire pesa mucho en el consumo a alta velocidad.",
              "Revisar regularmente la presión de los neumáticos, que baja de forma natural con el frío.",
              "Prever paradas de recarga más frecuentes en invierno.",
              "Activar el modo eco o de autonomía del vehículo cuando las condiciones lo requieran.",
            ],
          },
        ],
        faq: [
          { question: "¿Por qué pierde autonomía un coche eléctrico en invierno?", answer: "El frío combina varios efectos: una química de batería menos eficiente, más consumo por la calefacción del habitáculo, mayor resistencia a la rodadura de los neumáticos y energía usada en el precondicionamiento de la batería." },
          { question: "¿Cuánta autonomía se puede perder con mucho frío?", answer: "Según lo que suelen reportar los conductores, la pérdida puede llegar a alrededor de un tercio menos de autonomía de lo habitual." },
          { question: "¿Cómo se puede limitar la pérdida de autonomía en invierno?", answer: "Precondicionar la batería y el habitáculo mientras el coche sigue enchufado, priorizar los asientos calefactados frente a la calefacción del habitáculo, y moderar la velocidad en autopista ayudan a limitar la pérdida." },
          { question: "¿Hay que prever más paradas de recarga en invierno?", answer: "Sí, conviene prever paradas de recarga más frecuentes en invierno y revisar regularmente la presión de los neumáticos, que baja con el frío." },
        ],
        ...cta.es,
      },
    },
  },
  {
    slug: "vol-cables-recharge-electrique",
    publishedAt: "2026-08-24",
    image: {
      src: "/blog/vol-cables-recharge-electrique.jpg",
      alt: {
        fr: "Gros plan sur un câble de recharge de type 2 pour voiture électrique",
        en: "Close-up of a Type 2 charging cable for an electric car",
        de: "Nahaufnahme eines Typ-2-Ladekabels für ein Elektroauto",
        es: "Primer plano de un cable de recarga tipo 2 para coche eléctrico",
      },
      credit: null,
    },
    content: {
      fr: {
        eyebrow: "Sécurité",
        title: "Vol de câbles de recharge : le cuivre attise la convoitise",
        excerpt:
          "427 plaintes déposées depuis janvier 2026 pour près de 9 millions d'euros de préjudice : le vol de câbles explose sur le réseau français.",
        metaTitle: "Vol de câbles de recharge électrique en France : le point en 2026",
        metaDescription:
          "Charge France recense 427 plaintes pour vol de câbles depuis janvier 2026, pour près de 9 millions d'euros de préjudice. Causes et zones les plus touchées.",
        body: [
          {
            type: "p",
            text: "Le développement rapide du réseau de recharge français s'accompagne d'un effet secondaire indésirable : la multiplication des vols de câbles, un phénomène qui prend de l'ampleur en 2026.",
          },
          { type: "h2", text: "Un phénomène en forte hausse" },
          {
            type: "p",
            text: "Selon Charge France, l'organisation professionnelle des opérateurs de recharge, 427 plaintes ont été déposées sur le territoire depuis janvier 2026, pour un préjudice cumulé de près de 9 millions d'euros. Les aires d'autoroutes, les parkings commerciaux et les zones périurbaines sont particulièrement exposés.",
          },
          { type: "h2", text: "Le cuivre, cible privilégiée" },
          {
            type: "p",
            text: "Le phénomène s'explique directement par la flambée du cours du cuivre, qui évolue autour de 9 000 € la tonne sur les marchés internationaux, un niveau historiquement élevé qui transforme les câbles de recharge en cibles de choix. Il suffit de 5 à 10 secondes avec une simple scie pour couper l'équipement.",
          },
          { type: "h2", text: "Des conséquences qui dépassent la valeur du métal" },
          {
            type: "p",
            text: "Pour les opérateurs, les pertes ne se limitent pas à la valeur du cuivre dérobé : réparations, interruption du service pendant parfois plusieurs jours et dépenses de sécurisation alourdissent la facture, sans compter les recettes de recharge perdues pendant l'immobilisation de l'équipement.",
          },
          { type: "h2", text: "Une croissance du réseau qui complique la prévention" },
          {
            type: "p",
            text: "Ce phénomène se produit alors même que le réseau français continue de croître rapidement, avec plus de 200 000 points de recharge publics recensés au 31 juillet 2026 sur environ 55 600 stations, ce qui rend la sécurisation de l'ensemble du parc un défi opérationnel de plus en plus lourd pour les exploitants.",
          },
        ],
        faq: [
          { question: "Combien de vols de câbles de recharge ont été signalés en France en 2026 ?", answer: "Selon Charge France, 427 plaintes ont été déposées depuis janvier 2026, pour un préjudice cumulé de près de 9 millions d'euros." },
          { question: "Pourquoi les câbles de recharge sont-ils autant volés ?", answer: "Le phénomène s'explique par la flambée du cours du cuivre, qui évolue autour de 9 000 € la tonne, un niveau historiquement élevé qui transforme les câbles en cibles de choix." },
          { question: "Combien de temps faut-il pour voler un câble de recharge ?", answer: "Il suffit de 5 à 10 secondes avec une simple scie pour couper l'équipement." },
          { question: "Quelles zones sont les plus touchées par le vol de câbles ?", answer: "Les aires d'autoroutes, les parkings commerciaux et les zones périurbaines sont particulièrement exposés." },
        ],
        ...cta.fr,
      },
      en: {
        eyebrow: "Security",
        title: "Cable Theft Hits France's Charging Network as Copper Prices Surge",
        excerpt:
          "427 complaints filed since January 2026 for nearly 9 million euros in damage: cable theft is surging across France's charging network.",
        metaTitle: "EV Charging Cable Theft in France: The 2026 Picture",
        metaDescription:
          "Charge France reports 427 cable-theft complaints since January 2026, worth nearly 9 million euros in damage. Causes and the areas hit hardest.",
        body: [
          {
            type: "p",
            text: "The rapid growth of France's charging network comes with an unwelcome side effect: a surge in cable theft, a phenomenon that has picked up noticeably in 2026.",
          },
          { type: "h2", text: "A sharply rising problem" },
          {
            type: "p",
            text: "According to Charge France, the industry body representing charging operators, 427 complaints have been filed nationwide since January 2026, for cumulative damage of nearly 9 million euros. Motorway rest areas, commercial parking lots, and peri-urban areas are especially exposed.",
          },
          { type: "h2", text: "Copper, a prime target" },
          {
            type: "p",
            text: "The trend is directly linked to the surge in copper prices, trading around 9,000 euros a tonne on international markets, a historically high level that turns charging cables into attractive targets. It reportedly takes just 5 to 10 seconds with a simple saw to cut through the equipment.",
          },
          { type: "h2", text: "Consequences beyond the value of the metal" },
          {
            type: "p",
            text: "For operators, the losses go beyond the value of the stolen copper: repairs, service interruptions that can last several days, and increased security spending all add to the bill, on top of lost charging revenue while the equipment is out of service.",
          },
          { type: "h2", text: "A growing network makes prevention harder" },
          {
            type: "p",
            text: "This is happening even as France's network keeps growing fast, with more than 200,000 public charging points counted as of July 31, 2026 across roughly 55,600 stations, which makes securing the entire fleet of equipment an increasingly heavy operational challenge for operators.",
          },
        ],
        faq: [
          { question: "How many charging cable thefts have been reported in France in 2026?", answer: "According to Charge France, 427 complaints have been filed since January 2026, for cumulative damage of nearly 9 million euros." },
          { question: "Why are charging cables being stolen so often?", answer: "The trend is linked to the surge in copper prices, trading around 9,000 euros a tonne, a historically high level that makes charging cables an attractive target." },
          { question: "How long does it take to steal a charging cable?", answer: "It reportedly takes just 5 to 10 seconds with a simple saw to cut through the equipment." },
          { question: "Which areas are most affected by cable theft?", answer: "Motorway rest areas, commercial parking lots, and peri-urban areas are especially exposed." },
        ],
        ...cta.en,
      },
      de: {
        eyebrow: "Sicherheit",
        title: "Kabeldiebstahl trifft Frankreichs Ladenetz, während die Kupferpreise steigen",
        excerpt:
          "427 Anzeigen seit Januar 2026 mit einem Schaden von fast 9 Millionen Euro: Kabeldiebstahl nimmt im französischen Ladenetz stark zu.",
        metaTitle: "Kabeldiebstahl an Ladestationen in Frankreich: Der Stand 2026",
        metaDescription:
          "Charge France meldet 427 Anzeigen wegen Kabeldiebstahls seit Januar 2026, mit fast 9 Millionen Euro Schaden. Ursachen und besonders betroffene Gebiete.",
        body: [
          {
            type: "p",
            text: "Das schnelle Wachstum von Frankreichs Ladenetz bringt einen unerwünschten Nebeneffekt mit sich: eine Zunahme von Kabeldiebstählen, ein Phänomen, das 2026 spürbar zugenommen hat.",
          },
          { type: "h2", text: "Ein stark zunehmendes Problem" },
          {
            type: "p",
            text: "Laut Charge France, dem Branchenverband der Ladebetreiber, wurden seit Januar 2026 landesweit 427 Anzeigen erstattet, mit einem kumulierten Schaden von fast 9 Millionen Euro. Besonders betroffen sind Autobahnrastplätze, Einzelhandelsparkplätze und stadtnahe Gebiete.",
          },
          { type: "h2", text: "Kupfer als bevorzugtes Ziel" },
          {
            type: "p",
            text: "Der Trend hängt direkt mit dem Anstieg der Kupferpreise zusammen, die an internationalen Märkten bei rund 9.000 Euro pro Tonne liegen, ein historisch hohes Niveau, das Ladekabel zu attraktiven Zielen macht. Mit einer einfachen Säge reichen Berichten zufolge 5 bis 10 Sekunden, um das Kabel zu durchtrennen.",
          },
          { type: "h2", text: "Folgen, die über den Materialwert hinausgehen" },
          {
            type: "p",
            text: "Für die Betreiber gehen die Verluste über den Wert des gestohlenen Kupfers hinaus: Reparaturen, teils mehrtägige Serviceunterbrechungen und erhöhte Sicherheitsausgaben treiben die Kosten in die Höhe, zusätzlich zu entgangenen Ladeeinnahmen während der Ausfallzeit.",
          },
          { type: "h2", text: "Ein wachsendes Netz erschwert die Prävention" },
          {
            type: "p",
            text: "Das geschieht ausgerechnet während Frankreichs Netz weiter schnell wächst, mit mehr als 200.000 öffentlichen Ladepunkten zum 31. Juli 2026 auf rund 55.600 Stationen, was die Absicherung des gesamten Bestands für Betreiber zu einer immer größeren betrieblichen Herausforderung macht.",
          },
        ],
        faq: [
          { question: "Wie viele Kabeldiebstähle an Ladestationen wurden 2026 in Frankreich gemeldet?", answer: "Laut Charge France wurden seit Januar 2026 427 Anzeigen erstattet, mit einem kumulierten Schaden von fast 9 Millionen Euro." },
          { question: "Warum werden Ladekabel so häufig gestohlen?", answer: "Der Trend hängt mit dem Anstieg der Kupferpreise zusammen, die bei rund 9.000 Euro pro Tonne liegen, ein historisch hohes Niveau, das Ladekabel zu attraktiven Zielen macht." },
          { question: "Wie lange dauert es, ein Ladekabel zu stehlen?", answer: "Berichten zufolge reichen 5 bis 10 Sekunden mit einer einfachen Säge, um das Kabel zu durchtrennen." },
          { question: "Welche Gebiete sind am stärksten vom Kabeldiebstahl betroffen?", answer: "Autobahnrastplätze, Einzelhandelsparkplätze und stadtnahe Gebiete sind besonders betroffen." },
        ],
        ...cta.de,
      },
      es: {
        eyebrow: "Seguridad",
        title: "El robo de cables golpea la red de recarga francesa mientras sube el precio del cobre",
        excerpt:
          "427 denuncias presentadas desde enero de 2026 por casi 9 millones de euros en daños: el robo de cables se dispara en la red francesa.",
        metaTitle: "Robo de cables de recarga eléctrica en Francia: el panorama en 2026",
        metaDescription:
          "Charge France registra 427 denuncias por robo de cables desde enero de 2026, por casi 9 millones de euros en daños. Causas y zonas más afectadas.",
        body: [
          {
            type: "p",
            text: "El rápido crecimiento de la red de recarga francesa trae consigo un efecto secundario indeseado: un aumento del robo de cables, un fenómeno que ha crecido notablemente en 2026.",
          },
          { type: "h2", text: "Un fenómeno claramente al alza" },
          {
            type: "p",
            text: "Según Charge France, la organización que representa a los operadores de recarga, se han presentado 427 denuncias en todo el país desde enero de 2026, por un daño acumulado de casi 9 millones de euros. Las áreas de descanso de autopista, los aparcamientos comerciales y las zonas periurbanas son especialmente vulnerables.",
          },
          { type: "h2", text: "El cobre, un objetivo preferido" },
          {
            type: "p",
            text: "El fenómeno está directamente relacionado con la subida del precio del cobre, que ronda los 9.000 euros la tonelada en los mercados internacionales, un nivel históricamente alto que convierte los cables de recarga en un blanco atractivo. Basta con 5 a 10 segundos con una simple sierra para cortar el equipo, según se ha reportado.",
          },
          { type: "h2", text: "Consecuencias que van más allá del valor del metal" },
          {
            type: "p",
            text: "Para los operadores, las pérdidas no se limitan al valor del cobre robado: las reparaciones, las interrupciones del servicio que a veces duran varios días y el aumento del gasto en seguridad encarecen la factura, sin contar los ingresos de recarga perdidos mientras el equipo está fuera de servicio.",
          },
          { type: "h2", text: "Una red en crecimiento complica la prevención" },
          {
            type: "p",
            text: "Esto ocurre precisamente mientras la red francesa sigue creciendo con rapidez, con más de 200.000 puntos de recarga públicos contabilizados a 31 de julio de 2026 en unas 55.600 estaciones, lo que convierte la protección de todo el parque en un desafío operativo cada vez mayor para los operadores.",
          },
        ],
        faq: [
          { question: "¿Cuántos robos de cables de recarga se han denunciado en Francia en 2026?", answer: "Según Charge France, se han presentado 427 denuncias desde enero de 2026, por un daño acumulado de casi 9 millones de euros." },
          { question: "¿Por qué se roban tanto los cables de recarga?", answer: "La tendencia está ligada a la subida del precio del cobre, que ronda los 9.000 euros la tonelada, un nivel históricamente alto que convierte los cables en un blanco atractivo." },
          { question: "¿Cuánto se tarda en robar un cable de recarga?", answer: "Según se ha reportado, bastan de 5 a 10 segundos con una simple sierra para cortar el equipo." },
          { question: "¿Qué zonas son las más afectadas por el robo de cables?", answer: "Las áreas de descanso de autopista, los aparcamientos comerciales y las zonas periurbanas son especialmente vulnerables." },
        ],
        ...cta.es,
      },
    },
  },
  {
    slug: "cout-recharge-voiture-electrique",
    publishedAt: "2026-08-27",
    image: {
      src: "/blog/cout-recharge-voiture-electrique.jpg",
      alt: {
        fr: "Gros plan sur une voiture électrique branchée à une borne de recharge",
        en: "Close-up of an electric car plugged into a charging station",
        de: "Nahaufnahme eines an eine Ladestation angeschlossenen Elektroautos",
        es: "Primer plano de un coche eléctrico enchufado a un punto de recarga",
      },
      credit: {
        name: "Ivan Radic",
        url: "https://commons.wikimedia.org/wiki/File:Close-up_of_an_electric_car_charging_station_with_a_car_plugged_in.jpg",
        license: "CC BY 2.0",
      },
    },
    content: {
      fr: {
        eyebrow: "Tarifs",
        title: "Combien coûte vraiment la recharge d'une voiture électrique en France ?",
        excerpt:
          "Du branchement à domicile à la borne rapide d'autoroute, le prix du kWh varie du simple au triple. Voici comment s'y retrouver.",
        metaTitle: "Coût de la recharge d'une voiture électrique en France en 2026",
        metaDescription:
          "Tarif heures creuses, bornes publiques 22 kW, recharge rapide sur autoroute : comparatif chiffré du coût de la recharge d'une voiture électrique en France en 2026.",
        body: [
          {
            type: "p",
            text: "Le prix d'une recharge peut varier énormément selon l'endroit où l'on branche sa voiture électrique. Pour s'y retrouver, rien ne vaut quelques chiffres concrets à comparer.",
          },
          { type: "h2", text: "Le tarif de l'électricité à domicile en 2026" },
          {
            type: "p",
            text: "Depuis août 2026, le tarif réglementé s'établit à 0,2001 € le kWh en option Base, 0,1589 € en heures creuses et 0,2142 € en heures pleines. L'option heures creuses/heures pleines est désormais accessible dès 3 kVA, et EDF propose une offre dédiée, « Vert Électrique Auto », pour les propriétaires de véhicules électriques ou hybrides en maison individuelle.",
          },
          { type: "h2", text: "La recharge publique, un cran au-dessus" },
          {
            type: "p",
            text: "Sur les bornes publiques de 22 kW, comme celles de Carrefour facturées 0,23 € TTC le kWh depuis le 1er août 2026 (une baisse de 30 % sur ce tarif), le coût reste correct pour une recharge d'appoint, mais dépasse déjà nettement le tarif heures creuses à domicile.",
          },
          { type: "h2", text: "La recharge rapide sur autoroute, nettement plus chère" },
          {
            type: "p",
            text: "Sur les bornes rapides et ultra-rapides du réseau autoroutier, le tarif au kWh grimpe sensiblement, surtout en paiement à l'acte sans abonnement, où il peut facilement atteindre deux à trois fois le tarif heures creuses pratiqué à domicile.",
          },
          { type: "h2", text: "Un exemple chiffré pour se rendre compte" },
          {
            type: "p",
            text: "Prenons une citadine électrique consommant environ 16 kWh aux 100 km. À domicile en heures creuses, le plein de 100 km revient à environ 2,54 €. Sur une borne publique 22 kW facturée 0,23 € le kWh, comptez plutôt environ 3,68 €. Sur une borne rapide d'autoroute sans abonnement, la facture peut être deux à trois fois supérieure à celle de la recharge à domicile, ce qui change nettement le calcul sur un long trajet.",
          },
          { type: "h3", text: "Ce qu'il faut retenir" },
          {
            type: "ul",
            items: [
              "La recharge à domicile en heures creuses reste, de très loin, l'option la moins chère au quotidien.",
              "La recharge publique en 22 kW convient pour un appoint, mais coûte plus cher que le tarif heures creuses.",
              "La recharge rapide sur autoroute est la plus onéreuse, surtout sans abonnement.",
              "Optimiser son contrat électrique à domicile a plus d'impact sur la facture qu'optimiser ses recharges en itinérance.",
            ],
          },
        ],
        faq: [
          { question: "Combien coûte le kWh en heures creuses à domicile en 2026 ?", answer: "Le tarif heures creuses s'établit à 0,1589 € le kWh depuis août 2026, contre 0,2142 € en heures pleines." },
          { question: "Combien coûte une recharge sur une borne publique 22 kW ?", answer: "Sur les bornes 22 kW de Carrefour, le tarif est de 0,23 € TTC le kWh depuis le 1er août 2026, une baisse de 30 %." },
          { question: "Combien coûtent 100 km avec une voiture électrique ?", answer: "Pour une citadine consommant environ 16 kWh aux 100 km, cela revient à environ 2,54 € à domicile en heures creuses, contre environ 3,68 € sur une borne publique 22 kW." },
          { question: "La recharge rapide sur autoroute coûte-t-elle beaucoup plus cher ?", answer: "Oui, sans abonnement, elle peut coûter deux à trois fois plus cher que la recharge à domicile en heures creuses." },
        ],
        ...cta.fr,
      },
      en: {
        eyebrow: "Pricing",
        title: "How Much Does It Really Cost to Charge an Electric Car in France?",
        excerpt:
          "From a home outlet to a fast charger on the motorway, the price per kWh can triple. Here's how to make sense of it.",
        metaTitle: "The Real Cost of Charging an EV in France in 2026",
        metaDescription:
          "Off-peak home tariffs, public 22kW stations, motorway fast charging: a cost comparison for charging an electric car in France in 2026.",
        body: [
          {
            type: "p",
            text: "The price of a charge can vary enormously depending on where you plug in your electric car in France. A few concrete figures make the comparison much clearer.",
          },
          { type: "h2", text: "Home electricity rates in 2026" },
          {
            type: "p",
            text: "As of August 2026, France's regulated tariff stands at 0.2001 euros per kWh on the Base option, 0.1589 euros during off-peak hours, and 0.2142 euros at peak hours. The off-peak/peak option is now available from 3kVA subscriptions, and EDF offers a dedicated plan, 'Vert Électrique Auto', for EV or hybrid owners living in houses.",
          },
          { type: "h2", text: "Public charging costs a bit more" },
          {
            type: "p",
            text: "On public 22kW stations, such as Carrefour's, priced at 0.23 euros including tax per kWh since August 1, 2026 (a 30% cut), the cost remains reasonable for a top-up, but already clearly exceeds the home off-peak rate.",
          },
          { type: "h2", text: "Motorway fast charging costs noticeably more" },
          {
            type: "p",
            text: "On fast and ultra-fast motorway chargers, the price per kWh climbs significantly, especially with pay-as-you-go pricing and no subscription, where it can easily reach two to three times the home off-peak rate.",
          },
          { type: "h2", text: "A concrete example" },
          {
            type: "p",
            text: "Take a compact EV using roughly 16 kWh per 100km. At home on an off-peak tariff, that's about 2.54 euros. On a public 22kW station at 0.23 euros per kWh, it's closer to 3.68 euros. On a motorway fast charger without a subscription, the bill can run two to three times higher than charging at home, a real factor to weigh on a long trip.",
          },
          { type: "h3", text: "The key takeaways" },
          {
            type: "ul",
            items: [
              "Home charging on an off-peak tariff is, by far, the cheapest everyday option.",
              "Public 22kW charging works for a top-up but costs more than the home off-peak rate.",
              "Motorway fast charging is the most expensive, especially without a subscription.",
              "Optimizing your home electricity plan matters more for your bill than optimizing charging on the road.",
            ],
          },
        ],
        faq: [
          { question: "How much does off-peak home electricity cost per kWh in 2026?", answer: "The off-peak rate is 0.1589 euros per kWh since August 2026, compared to 0.2142 euros at peak hours." },
          { question: "How much does charging cost on a public 22kW station?", answer: "On Carrefour's 22kW stations, the rate is 0.23 euros including tax per kWh since August 1, 2026, a 30% cut." },
          { question: "How much does 100km cost in an electric car?", answer: "For a compact EV using about 16 kWh per 100km, that's roughly 2.54 euros at home on the off-peak rate, versus about 3.68 euros on a public 22kW station." },
          { question: "Is motorway fast charging a lot more expensive?", answer: "Yes, without a subscription it can cost two to three times more than charging at home on an off-peak tariff." },
        ],
        ...cta.en,
      },
      de: {
        eyebrow: "Preise",
        title: "Was kostet das Laden eines Elektroautos in Frankreich wirklich?",
        excerpt:
          "Von der Haussteckdose bis zum Schnelllader auf der Autobahn kann sich der Preis pro kWh verdreifachen. So behalten Sie den Überblick.",
        metaTitle: "Die tatsächlichen Ladekosten eines Elektroautos in Frankreich 2026",
        metaDescription:
          "Nebenzeittarif zu Hause, öffentliche 22-kW-Stationen, Schnellladen auf der Autobahn: ein Kostenvergleich für das Laden eines Elektroautos in Frankreich 2026.",
        body: [
          {
            type: "p",
            text: "Der Preis einer Ladung kann in Frankreich je nach Ladeort stark schwanken. Ein paar konkrete Zahlen machen den Vergleich deutlich klarer.",
          },
          { type: "h2", text: "Stromtarife zu Hause im Jahr 2026" },
          {
            type: "p",
            text: "Seit August 2026 liegt der regulierte Tarif in der Grundoption bei 0,2001 Euro pro kWh, in der Nebenzeit bei 0,1589 Euro und in der Hauptzeit bei 0,2142 Euro. Die Nebenzeit-/Hauptzeit-Option steht nun bereits ab 3 kVA zur Verfügung, und EDF bietet mit 'Vert Électrique Auto' einen eigenen Tarif für Besitzer von Elektro- oder Hybridfahrzeugen in Einfamilienhäusern.",
          },
          { type: "h2", text: "Öffentliches Laden kostet etwas mehr" },
          {
            type: "p",
            text: "An öffentlichen 22-kW-Stationen, etwa von Carrefour, die seit dem 1. August 2026 0,23 Euro brutto pro kWh berechnen (ein Nachlass von 30 Prozent), bleiben die Kosten für eine Ladeauffrischung vertretbar, liegen aber bereits klar über dem heimischen Nebenzeittarif.",
          },
          { type: "h2", text: "Schnellladen auf der Autobahn kostet spürbar mehr" },
          {
            type: "p",
            text: "An Schnell- und Ultraschnellladern auf Autobahnen steigt der Preis pro kWh deutlich, besonders bei spontanem Laden ohne Abonnement, wo er leicht das Zwei- bis Dreifache des heimischen Nebenzeittarifs erreichen kann.",
          },
          { type: "h2", text: "Ein konkretes Beispiel" },
          {
            type: "p",
            text: "Nehmen wir ein kompaktes Elektroauto mit einem Verbrauch von etwa 16 kWh pro 100 km. Zu Hause in der Nebenzeit kostet das rund 2,54 Euro. An einer öffentlichen 22-kW-Station zu 0,23 Euro pro kWh sind es eher 3,68 Euro. An einem Autobahn-Schnelllader ohne Abonnement kann die Rechnung zwei- bis dreimal höher ausfallen als beim Laden zu Hause, ein Faktor, der auf langen Fahrten spürbar ins Gewicht fällt.",
          },
          { type: "h3", text: "Die wichtigsten Erkenntnisse" },
          {
            type: "ul",
            items: [
              "Laden zu Hause im Nebenzeittarif ist mit Abstand die günstigste Option im Alltag.",
              "Öffentliches 22-kW-Laden eignet sich für eine Auffrischung, kostet aber mehr als der heimische Nebenzeittarif.",
              "Schnellladen auf der Autobahn ist am teuersten, besonders ohne Abonnement.",
              "Die Optimierung des heimischen Stromtarifs wirkt sich stärker auf die Rechnung aus als die Optimierung des Ladens unterwegs.",
            ],
          },
        ],
        faq: [
          { question: "Wie viel kostet der Nebenzeittarif zu Hause pro kWh 2026?", answer: "Der Nebenzeittarif liegt seit August 2026 bei 0,1589 Euro pro kWh, gegenüber 0,2142 Euro in der Hauptzeit." },
          { question: "Wie viel kostet Laden an einer öffentlichen 22-kW-Station?", answer: "An den 22-kW-Stationen von Carrefour liegt der Preis seit dem 1. August 2026 bei 0,23 Euro brutto pro kWh, ein Nachlass von 30 Prozent." },
          { question: "Wie viel kosten 100 km mit einem Elektroauto?", answer: "Für ein kompaktes Elektroauto mit etwa 16 kWh Verbrauch pro 100 km sind das zu Hause in der Nebenzeit rund 2,54 Euro, gegenüber etwa 3,68 Euro an einer öffentlichen 22-kW-Station." },
          { question: "Ist Schnellladen auf der Autobahn deutlich teurer?", answer: "Ja, ohne Abonnement kann es zwei- bis dreimal so teuer sein wie das Laden zu Hause im Nebenzeittarif." },
        ],
        ...cta.de,
      },
      es: {
        eyebrow: "Precios",
        title: "¿Cuánto cuesta realmente recargar un coche eléctrico en Francia?",
        excerpt:
          "Desde el enchufe de casa hasta un cargador rápido de autopista, el precio del kWh puede triplicarse. Así se entiende la diferencia.",
        metaTitle: "El coste real de recargar un eléctrico en Francia en 2026",
        metaDescription:
          "Tarifa valle en casa, puntos públicos de 22 kW, carga rápida en autopista: comparativa de costes de recarga de un coche eléctrico en Francia en 2026.",
        body: [
          {
            type: "p",
            text: "El precio de una recarga puede variar muchísimo según dónde enchufes tu coche eléctrico en Francia. Unas cuantas cifras concretas ayudan a ver la diferencia con claridad.",
          },
          { type: "h2", text: "Las tarifas eléctricas en casa en 2026" },
          {
            type: "p",
            text: "Desde agosto de 2026, la tarifa regulada francesa es de 0,2001 euros por kWh en la opción Base, 0,1589 euros en horas valle y 0,2142 euros en horas punta. La opción de horas punta y valle ya está disponible desde contratos de 3 kVA, y EDF ofrece una tarifa específica, 'Vert Électrique Auto', para propietarios de vehículos eléctricos o híbridos que viven en una vivienda unifamiliar.",
          },
          { type: "h2", text: "La recarga pública cuesta un poco más" },
          {
            type: "p",
            text: "En los puntos públicos de 22 kW, como los de Carrefour, que cobran 0,23 euros con impuestos por kWh desde el 1 de agosto de 2026 (una rebaja del 30 %), el coste sigue siendo razonable para una recarga de apoyo, pero ya supera claramente la tarifa valle del hogar.",
          },
          { type: "h2", text: "La carga rápida en autopista cuesta notablemente más" },
          {
            type: "p",
            text: "En los cargadores rápidos y ultrarrápidos de autopista, el precio por kWh sube de forma clara, sobre todo pagando por uso sin abono, donde puede alcanzar fácilmente entre dos y tres veces la tarifa valle del hogar.",
          },
          { type: "h2", text: "Un ejemplo concreto" },
          {
            type: "p",
            text: "Tomemos un eléctrico compacto con un consumo de unos 16 kWh cada 100 km. En casa, en horas valle, eso cuesta unos 2,54 euros. En un punto público de 22 kW a 0,23 euros por kWh, ronda más bien los 3,68 euros. En un cargador rápido de autopista sin abono, la factura puede ser de dos a tres veces mayor que en casa, un factor que pesa bastante en un trayecto largo.",
          },
          { type: "h3", text: "Lo que hay que recordar" },
          {
            type: "ul",
            items: [
              "La recarga en casa con tarifa valle sigue siendo, con diferencia, la opción más barata del día a día.",
              "La recarga pública de 22 kW sirve para un apoyo, pero cuesta más que la tarifa valle del hogar.",
              "La carga rápida en autopista es la más cara, sobre todo sin abono.",
              "Optimizar el contrato eléctrico de casa pesa más en la factura que optimizar las recargas de viaje.",
            ],
          },
        ],
        faq: [
          { question: "¿Cuánto cuesta la electricidad en horas valle en casa en 2026?", answer: "La tarifa valle es de 0,1589 euros por kWh desde agosto de 2026, frente a 0,2142 euros en horas punta." },
          { question: "¿Cuánto cuesta recargar en un punto público de 22 kW?", answer: "En los puntos de 22 kW de Carrefour, la tarifa es de 0,23 euros con impuestos por kWh desde el 1 de agosto de 2026, una rebaja del 30 %." },
          { question: "¿Cuánto cuestan 100 km con un coche eléctrico?", answer: "Para un eléctrico compacto que consume unos 16 kWh cada 100 km, son unos 2,54 euros en casa en horas valle, frente a unos 3,68 euros en un punto público de 22 kW." },
          { question: "¿Es mucho más cara la carga rápida en autopista?", answer: "Sí, sin abono puede costar de dos a tres veces más que cargar en casa con tarifa valle." },
        ],
        ...cta.es,
      },
    },
  },
  {
    slug: "temps-de-recharge-voiture-electrique",
    publishedAt: "2026-08-29",
    image: {
      src: "/blog/temps-de-recharge-voiture-electrique.jpg",
      alt: {
        fr: "Borne de recharge pour véhicule électrique équipée de plusieurs câbles",
        en: "An EV charging unit fitted with several cables",
        de: "Eine Ladestation für Elektrofahrzeuge mit mehreren Kabeln",
        es: "Un punto de recarga para vehículos eléctricos equipado con varios cables",
      },
      credit: {
        name: "Solomon203",
        url: "https://commons.wikimedia.org/wiki/File:Delta_Electronics_EVPT3215MWE_20190601.jpg",
        license: "CC BY-SA 4.0",
      },
    },
    content: {
      fr: {
        eyebrow: "Conseils pratiques",
        title: "Combien de temps pour recharger une voiture électrique ? Le guide par puissance",
        excerpt:
          "Prise domestique, wallbox, borne publique ou recharge ultra-rapide : le temps de charge varie de plusieurs jours à quelques minutes.",
        metaTitle: "Temps de recharge d'une voiture électrique par puissance en 2026",
        metaDescription:
          "2,3 kW, 7,4 kW, 22 kW, 150 kW : combien de temps faut-il vraiment pour recharger une voiture électrique ? Le guide complet par niveau de puissance.",
        body: [
          {
            type: "p",
            text: "Le temps nécessaire pour recharger une voiture électrique dépend de deux facteurs principaux : la puissance délivrée par la borne, exprimée en kW, et la capacité de la batterie du véhicule, exprimée en kWh, ainsi que sa courbe de charge propre.",
          },
          { type: "h2", text: "La prise domestique classique : à éviter au quotidien" },
          {
            type: "p",
            text: "Une prise domestique standard ne délivre qu'environ 2,3 kW, ce qui peut représenter bien plus de 24 heures pour une charge complète sur une batterie de taille moyenne ou grande. Cette solution reste utile en dépannage ponctuel, mais n'est pas recommandée comme mode de recharge régulier.",
          },
          { type: "h2", text: "La wallbox à domicile : la solution du quotidien" },
          {
            type: "p",
            text: "Une borne murale installée à domicile délivre généralement 7,4 kW en monophasé, ou 11 à 22 kW en triphasé selon l'installation électrique du logement. De quoi recharger une batterie classique en quelques heures, une solution idéale pour une charge de nuit.",
          },
          { type: "h2", text: "Les bornes publiques de 22 kW" },
          {
            type: "p",
            text: "Les bornes publiques en courant alternatif, souvent en 22 kW, offrent des temps de charge comparables à une wallbox triphasée à domicile. Elles conviennent bien à une recharge d'appoint pendant les courses ou un rendez-vous.",
          },
          { type: "h2", text: "La recharge rapide et ultra-rapide" },
          {
            type: "p",
            text: "Les bornes à courant continu vont d'environ 50 kW jusqu'à 150 voire 350 kW sur les stations les plus récentes. Sur un véhicule compatible, cela permet de passer de 10 % à 80 % de charge en une vingtaine à une trentaine de minutes, parfois moins.",
          },
          { type: "h3", text: "Pourquoi s'arrêter à 80 % est souvent plus malin" },
          {
            type: "p",
            text: "La courbe de charge ralentit nettement au-delà d'environ 80 % d'état de charge, afin de protéger la batterie. Sur un long trajet, il est donc souvent plus rapide, au global, de multiplier les arrêts courts jusqu'à 80 % plutôt que d'attendre une charge complète à 100 % sur chaque arrêt.",
          },
          {
            type: "p",
            text: "Pour aller plus loin sur les différents types de prises et les puissances associées à chaque connecteur, notre guide sur les types de bornes électriques détaille point par point les standards utilisés en France et en Europe.",
          },
        ],
        faq: [
          { question: "Combien de temps faut-il pour recharger sur une prise domestique classique ?", answer: "Une prise domestique standard ne délivre qu'environ 2,3 kW, ce qui peut représenter bien plus de 24 heures pour une charge complète sur une grande batterie." },
          { question: "Combien de temps faut-il avec une wallbox à domicile ?", answer: "Une wallbox délivre généralement 7,4 kW en monophasé ou 11 à 22 kW en triphasé, de quoi recharger une batterie classique en quelques heures." },
          { question: "Combien de temps prend une recharge rapide sur autoroute ?", answer: "Sur une borne rapide de 50 à 350 kW, un véhicule compatible peut passer de 10 % à 80 % de charge en une vingtaine à une trentaine de minutes." },
          { question: "Pourquoi vaut-il mieux s'arrêter à 80 % plutôt que d'attendre 100 % ?", answer: "La courbe de charge ralentit nettement au-delà de 80 % pour protéger la batterie, donc multiplier les arrêts courts est souvent plus rapide au global qu'attendre une charge complète." },
        ],
        ...cta.fr,
      },
      en: {
        eyebrow: "Practical Tips",
        title: "How Long Does It Take to Charge an Electric Car? A Guide by Power Level",
        excerpt:
          "Household outlet, home wallbox, public station, or ultra-fast charger: charging time ranges from several days to a few minutes.",
        metaTitle: "EV Charging Times by Power Level in 2026",
        metaDescription:
          "2.3kW, 7.4kW, 22kW, 150kW: how long does it actually take to charge an electric car? A complete guide by power level.",
        body: [
          {
            type: "p",
            text: "How long it takes to charge an electric car depends mainly on two things: the power delivered by the charger, measured in kW, and the vehicle battery's capacity in kWh, along with its own charging curve.",
          },
          { type: "h2", text: "A standard household outlet: not for everyday use" },
          {
            type: "p",
            text: "A standard household socket delivers only about 2.3kW, which can mean well over 24 hours for a full charge on a medium or large battery. It's useful for occasional emergency top-ups, but not recommended as a regular charging method.",
          },
          { type: "h2", text: "A home wallbox: the everyday solution" },
          {
            type: "p",
            text: "A home wallbox typically delivers 7.4kW on a single-phase connection, or 11 to 22kW on three-phase, depending on the home's electrical setup. That's enough to charge a typical battery in a few hours, ideal for overnight charging.",
          },
          { type: "h2", text: "Public 22kW stations" },
          {
            type: "p",
            text: "Public AC stations, often rated at 22kW, offer charging times comparable to a three-phase home wallbox. They work well for a top-up while running errands or during an appointment.",
          },
          { type: "h2", text: "Fast and ultra-fast charging" },
          {
            type: "p",
            text: "DC fast chargers range from roughly 50kW up to 150 or even 350kW on the newest ultra-fast stations. On a compatible vehicle, that can take the battery from 10% to 80% in around 20 to 30 minutes, sometimes less.",
          },
          { type: "h3", text: "Why stopping at 80% is often the smarter move" },
          {
            type: "p",
            text: "The charging curve slows down markedly above roughly 80% state of charge, to protect the battery. On a long trip, it's often faster overall to make several short stops up to 80% rather than waiting for a full 100% charge at each stop.",
          },
          {
            type: "p",
            text: "For more detail on connector types and the power ratings tied to each one, our guide on charging connector types walks through the standards used across France and Europe.",
          },
        ],
        faq: [
          { question: "How long does charging take on a standard household outlet?", answer: "A standard household socket delivers only about 2.3kW, which can mean well over 24 hours for a full charge on a large battery." },
          { question: "How long does charging take with a home wallbox?", answer: "A wallbox typically delivers 7.4kW on single-phase or 11 to 22kW on three-phase, enough to charge a typical battery in a few hours." },
          { question: "How long does fast charging take on the motorway?", answer: "On a 50 to 350kW fast charger, a compatible vehicle can go from 10% to 80% charge in around 20 to 30 minutes." },
          { question: "Why is it better to stop at 80% instead of waiting for 100%?", answer: "The charging curve slows down markedly above 80% to protect the battery, so making several short stops is often faster overall than waiting for a full charge." },
        ],
        ...cta.en,
      },
      de: {
        eyebrow: "Praktische Tipps",
        title: "Wie lange dauert das Laden eines Elektroautos? Der Leitfaden nach Ladeleistung",
        excerpt:
          "Haushaltssteckdose, heimische Wallbox, öffentliche Station oder Ultraschnelllader: Die Ladezeit reicht von mehreren Tagen bis zu wenigen Minuten.",
        metaTitle: "Ladezeiten von Elektroautos nach Ladeleistung 2026",
        metaDescription:
          "2,3 kW, 7,4 kW, 22 kW, 150 kW: Wie lange dauert das Laden eines Elektroautos wirklich? Der vollständige Leitfaden nach Ladeleistung.",
        body: [
          {
            type: "p",
            text: "Wie lange das Laden eines Elektroautos dauert, hängt vor allem von zwei Dingen ab: der Ladeleistung des Ladepunkts in kW und der Batteriekapazität des Fahrzeugs in kWh, zusammen mit dessen eigener Ladekurve.",
          },
          { type: "h2", text: "Die normale Haushaltssteckdose: nicht für den Alltag geeignet" },
          {
            type: "p",
            text: "Eine gewöhnliche Haushaltssteckdose liefert nur etwa 2,3 kW, was bei einer mittelgroßen oder großen Batterie deutlich mehr als 24 Stunden für eine volle Ladung bedeuten kann. Sie eignet sich für gelegentliche Notladungen, aber nicht als regelmäßige Lademethode.",
          },
          { type: "h2", text: "Die Wallbox zu Hause: die Lösung für den Alltag" },
          {
            type: "p",
            text: "Eine heimische Wallbox liefert je nach Elektroinstallation typischerweise 7,4 kW einphasig oder 11 bis 22 kW dreiphasig. Das reicht, um eine übliche Batterie in wenigen Stunden zu laden, ideal für das Laden über Nacht.",
          },
          { type: "h2", text: "Öffentliche 22-kW-Stationen" },
          {
            type: "p",
            text: "Öffentliche Wechselstrom-Stationen, oft mit 22 kW, bieten Ladezeiten, die einer dreiphasigen Wallbox zu Hause entsprechen. Sie eignen sich gut für eine Auffrischung beim Einkaufen oder während eines Termins.",
          },
          { type: "h2", text: "Schnell- und Ultraschnellladen" },
          {
            type: "p",
            text: "Gleichstrom-Schnelllader reichen von etwa 50 kW bis zu 150 oder sogar 350 kW an den neuesten Ultraschnellstationen. Bei einem kompatiblen Fahrzeug lässt sich damit die Batterie in rund 20 bis 30 Minuten, manchmal weniger, von 10 auf 80 Prozent laden.",
          },
          { type: "h3", text: "Warum ein Stopp bei 80 Prozent oft klüger ist" },
          {
            type: "p",
            text: "Die Ladekurve verlangsamt sich oberhalb von etwa 80 Prozent Ladestand deutlich, um die Batterie zu schonen. Auf einer langen Fahrt ist es daher oft insgesamt schneller, mehrere kurze Stopps bis 80 Prozent einzulegen, statt bei jedem Halt auf volle 100 Prozent zu warten.",
          },
          {
            type: "p",
            text: "Mehr Details zu den verschiedenen Steckertypen und den zugehörigen Ladeleistungen bietet unser Leitfaden zu den Ladestecker-Typen, der die in Frankreich und Europa gängigen Standards Schritt für Schritt erklärt.",
          },
        ],
        faq: [
          { question: "Wie lange dauert das Laden an einer normalen Haushaltssteckdose?", answer: "Eine gewöhnliche Haushaltssteckdose liefert nur etwa 2,3 kW, was bei einer großen Batterie deutlich mehr als 24 Stunden für eine volle Ladung bedeuten kann." },
          { question: "Wie lange dauert das Laden mit einer heimischen Wallbox?", answer: "Eine Wallbox liefert typischerweise 7,4 kW einphasig oder 11 bis 22 kW dreiphasig, genug, um eine übliche Batterie in wenigen Stunden zu laden." },
          { question: "Wie lange dauert Schnellladen auf der Autobahn?", answer: "An einem Schnelllader mit 50 bis 350 kW kann ein kompatibles Fahrzeug in rund 20 bis 30 Minuten von 10 auf 80 Prozent laden." },
          { question: "Warum ist es besser, bei 80 Prozent zu stoppen statt auf 100 Prozent zu warten?", answer: "Die Ladekurve verlangsamt sich oberhalb von 80 Prozent deutlich, um die Batterie zu schonen, weshalb mehrere kurze Stopps insgesamt oft schneller sind als das Warten auf eine volle Ladung." },
        ],
        ...cta.de,
      },
      es: {
        eyebrow: "Consejos prácticos",
        title: "¿Cuánto se tarda en recargar un coche eléctrico? La guía por nivel de potencia",
        excerpt:
          "Enchufe doméstico, wallbox en casa, punto público o carga ultrarrápida: el tiempo de carga va de varios días a unos pocos minutos.",
        metaTitle: "Tiempos de recarga de un eléctrico por potencia en 2026",
        metaDescription:
          "2,3 kW, 7,4 kW, 22 kW, 150 kW: ¿cuánto se tarda realmente en recargar un coche eléctrico? La guía completa por nivel de potencia.",
        body: [
          {
            type: "p",
            text: "El tiempo necesario para recargar un coche eléctrico depende sobre todo de dos factores: la potencia que entrega el punto de carga, en kW, y la capacidad de la batería del vehículo, en kWh, junto con su propia curva de carga.",
          },
          { type: "h2", text: "El enchufe doméstico clásico: no apto para el día a día" },
          {
            type: "p",
            text: "Un enchufe doméstico estándar entrega solo unos 2,3 kW, lo que puede suponer bastante más de 24 horas para una carga completa en una batería mediana o grande. Es útil para una recarga puntual de emergencia, pero no se recomienda como método habitual.",
          },
          { type: "h2", text: "La wallbox en casa: la solución del día a día" },
          {
            type: "p",
            text: "Una wallbox instalada en casa suele entregar 7,4 kW en monofásico, o entre 11 y 22 kW en trifásico, según la instalación eléctrica de la vivienda. Suficiente para cargar una batería habitual en pocas horas, ideal para recargar por la noche.",
          },
          { type: "h2", text: "Los puntos públicos de 22 kW" },
          {
            type: "p",
            text: "Los puntos públicos de corriente alterna, a menudo de 22 kW, ofrecen tiempos de carga similares a los de una wallbox trifásica en casa. Son útiles para una recarga de apoyo mientras se hacen recados o durante una cita.",
          },
          { type: "h2", text: "La carga rápida y ultrarrápida" },
          {
            type: "p",
            text: "Los cargadores de corriente continua van desde unos 50 kW hasta 150 o incluso 350 kW en las estaciones ultrarrápidas más recientes. En un vehículo compatible, esto permite pasar del 10 % al 80 % de carga en unos 20 a 30 minutos, a veces menos.",
          },
          { type: "h3", text: "Por qué suele ser más inteligente parar en el 80 %" },
          {
            type: "p",
            text: "La curva de carga se ralentiza claramente por encima de un 80 % de nivel de batería, para proteger la celda. En un trayecto largo, suele ser más rápido en conjunto hacer varias paradas cortas hasta el 80 % que esperar una carga completa al 100 % en cada parada.",
          },
          {
            type: "p",
            text: "Para más detalle sobre los tipos de conectores y las potencias asociadas a cada uno, nuestra guía sobre los tipos de puntos de recarga repasa punto por punto los estándares usados en Francia y Europa.",
          },
        ],
        faq: [
          { question: "¿Cuánto se tarda en cargar en un enchufe doméstico normal?", answer: "Un enchufe doméstico estándar entrega solo unos 2,3 kW, lo que puede suponer bastante más de 24 horas para una carga completa en una batería grande." },
          { question: "¿Cuánto se tarda en cargar con una wallbox en casa?", answer: "Una wallbox suele entregar 7,4 kW en monofásico o entre 11 y 22 kW en trifásico, suficiente para cargar una batería habitual en pocas horas." },
          { question: "¿Cuánto tarda la carga rápida en autopista?", answer: "En un cargador rápido de 50 a 350 kW, un vehículo compatible puede pasar del 10 % al 80 % de carga en unos 20 a 30 minutos." },
          { question: "¿Por qué es mejor parar en el 80 % en lugar de esperar al 100 %?", answer: "La curva de carga se ralentiza claramente por encima del 80 % para proteger la batería, así que hacer varias paradas cortas suele ser más rápido en conjunto que esperar una carga completa." },
        ],
        ...cta.es,
      },
    },
  },
  {
    slug: "installer-borne-recharge-maison",
    publishedAt: "2026-09-01",
    image: {
      src: "/blog/installer-borne-recharge-maison.jpg",
      alt: {
        fr: "Voiture électrique en charge devant une maison grâce à une installation domestique",
        en: "An electric car charging outside a house using a home charging setup",
        de: "Ein Elektroauto lädt vor einem Haus über eine private Ladeeinrichtung",
        es: "Un coche eléctrico cargando frente a una casa gracias a una instalación doméstica",
      },
      credit: {
        name: "4300streetcar",
        url: "https://commons.wikimedia.org/wiki/File:Tesla_Model_S_home_charging_in_Dorchester,_Boston_November_2025.jpg",
        license: "CC BY 4.0",
      },
    },
    content: {
      fr: {
        eyebrow: "Recharge à domicile",
        title: "Installer une borne de recharge chez soi : le guide étape par étape",
        excerpt:
          "Installateur certifié IRVE, bonne puissance, TVA à 5,5 % : ce qu'il faut savoir avant d'installer sa borne à domicile en 2026.",
        metaTitle: "Installer une borne de recharge à domicile en 2026 : le guide",
        metaDescription:
          "Installateur IRVE, choix de la puissance, fiscalité : le crédit d'impôt a pris fin en 2025, la TVA à 5,5 % reste le principal avantage en 2026. Le guide complet.",
        body: [
          {
            type: "p",
            text: "Installer une borne de recharge chez soi simplifie considérablement le quotidien d'un conducteur de voiture électrique. Voici les étapes à suivre et ce qui a changé côté fiscalité en 2026.",
          },
          { type: "h2", text: "Faire appel à un installateur certifié IRVE" },
          {
            type: "p",
            text: "L'installation d'une borne de recharge doit être confiée à un installateur certifié IRVE (Infrastructures de Recharge pour Véhicules Électriques). Cette certification garantit une installation conforme aux normes de sécurité électrique, et conditionne aussi l'accès à certains avantages financiers.",
          },
          { type: "h3", text: "Les étapes de l'installation" },
          {
            type: "ul",
            items: [
              "Faire évaluer l'installation électrique du logement et la puissance disponible.",
              "Choisir la puissance adaptée à son véhicule et à son usage, généralement entre 3,7 et 22 kW.",
              "Demander plusieurs devis à des installateurs certifiés IRVE.",
              "Faire réaliser l'installation par le professionnel retenu.",
              "Envisager de basculer vers un contrat d'électricité en option heures creuses/heures pleines pour recharger la nuit au tarif le plus avantageux.",
            ],
          },
          { type: "h2", text: "Une fiscalité qui a changé en 2026" },
          {
            type: "p",
            text: "Le crédit d'impôt pour l'installation d'une borne de recharge, qui couvrait 75 % des dépenses dans la limite de 500 €, a pris fin le 31 décembre 2025. Il ne s'applique plus aux installations réalisées à partir de 2026 : seuls les travaux achevés avant cette date restent éligibles, à déclarer sur la déclaration de revenus 2026.",
          },
          { type: "h2", text: "Ce qui reste disponible en 2026" },
          {
            type: "p",
            text: "Pour un particulier propriétaire de sa maison, le principal avantage restant est la TVA réduite à 5,5 % sur le matériel et la pose, à condition de passer par un professionnel qualifié. Les copropriétés et les entreprises peuvent quant à elles continuer à solliciter la prime Advenir pour leurs projets d'infrastructure de recharge collective.",
          },
          { type: "h2", text: "Quel budget prévoir" },
          {
            type: "p",
            text: "Le coût total dépend fortement de la distance entre le tableau électrique et l'emplacement de la borne, ainsi que de la nécessité ou non de renforcer l'installation électrique existante. Mieux vaut donc comparer plusieurs devis détaillés plutôt que de se fier à un prix moyen.",
          },
        ],
        faq: [
          { question: "Qui peut installer une borne de recharge à domicile ?", answer: "L'installation doit être confiée à un installateur certifié IRVE, une certification qui garantit le respect des normes de sécurité électrique et conditionne l'accès à certains avantages financiers." },
          { question: "Le crédit d'impôt pour l'installation d'une borne existe-t-il encore en 2026 ?", answer: "Non, ce crédit d'impôt de 75 % des dépenses dans la limite de 500 € a pris fin le 31 décembre 2025 et ne s'applique plus aux installations réalisées à partir de 2026." },
          { question: "Quel avantage fiscal reste-t-il en 2026 pour installer une borne ?", answer: "Le principal avantage restant est la TVA réduite à 5,5 % sur le matériel et la pose, à condition de passer par un professionnel qualifié." },
          { question: "Les copropriétés peuvent-elles encore obtenir une aide pour une borne collective ?", answer: "Oui, les copropriétés et les entreprises peuvent continuer à solliciter la prime Advenir pour leurs projets d'infrastructure de recharge collective." },
        ],
        ...cta.fr,
      },
      en: {
        eyebrow: "Home Charging",
        title: "Installing a Home EV Charger in France: A Step-by-Step Guide",
        excerpt:
          "A certified IRVE installer, the right power level, 5.5% VAT: what to know before installing a home charger in France in 2026.",
        metaTitle: "Installing a Home EV Charger in France in 2026: The Guide",
        metaDescription:
          "Certified installers, choosing the power level, tax rules: France's tax credit ended in 2025, reduced VAT remains the main benefit in 2026.",
        body: [
          {
            type: "p",
            text: "Installing a home charger makes daily life considerably easier for an EV driver in France. Here are the steps to follow, and what changed on the tax side in 2026.",
          },
          { type: "h2", text: "Use an IRVE-certified installer" },
          {
            type: "p",
            text: "In France, installing a home charging station must be done by an IRVE-certified installer (Infrastructures de Recharge pour Véhicules Électriques). That certification ensures the installation meets electrical safety standards, and it's also required to access certain financial benefits.",
          },
          { type: "h3", text: "The installation steps" },
          {
            type: "ul",
            items: [
              "Have your home's electrical installation and available capacity assessed.",
              "Choose the right power level for your vehicle and usage, generally between 3.7 and 22kW.",
              "Get several quotes from IRVE-certified installers.",
              "Have the installation carried out by the chosen professional.",
              "Consider switching to an off-peak/peak electricity plan to charge overnight at the cheaper rate.",
            ],
          },
          { type: "h2", text: "The tax situation changed in 2026" },
          {
            type: "p",
            text: "France's tax credit for installing a home charging station, which covered 75% of expenses up to a 500 euro cap, ended on December 31, 2025. It no longer applies to installations from 2026 onward: only work completed before that date still qualifies, to be declared on the 2026 income tax return.",
          },
          { type: "h2", text: "What's still available in 2026" },
          {
            type: "p",
            text: "For an individual homeowner, the main remaining benefit is the reduced 5.5% VAT rate on equipment and installation, provided the work is done by a qualified professional. Co-ownerships and businesses can still apply for the Prime Advenir grant for collective charging infrastructure projects.",
          },
          { type: "h2", text: "What budget to plan for" },
          {
            type: "p",
            text: "The total cost depends heavily on the distance between the electrical panel and the charger's location, as well as whether the existing electrical installation needs upgrading. It's worth comparing several detailed quotes rather than relying on an average price.",
          },
        ],
        faq: [
          { question: "Who can install a home EV charger in France?", answer: "The installation must be carried out by an IRVE-certified installer, a certification that ensures electrical safety compliance and is required to access certain financial benefits." },
          { question: "Does the home charger tax credit still exist in 2026?", answer: "No, that tax credit, covering 75% of expenses up to a 500 euro cap, ended on December 31, 2025 and no longer applies to installations from 2026 onward." },
          { question: "What tax benefit remains for installing a charger in 2026?", answer: "The main remaining benefit is the reduced 5.5% VAT rate on equipment and installation, provided the work is done by a qualified professional." },
          { question: "Can co-ownerships still get aid for a shared charging station?", answer: "Yes, co-ownerships and businesses can still apply for the Prime Advenir grant for collective charging infrastructure projects." },
        ],
        ...cta.en,
      },
      de: {
        eyebrow: "Laden zu Hause",
        title: "Eine Ladestation zu Hause installieren: Der Schritt-für-Schritt-Leitfaden für Frankreich",
        excerpt:
          "Zertifizierter IRVE-Installateur, passende Ladeleistung, 5,5 Prozent Mehrwertsteuer: Was Sie 2026 vor der Installation einer Wallbox wissen sollten.",
        metaTitle: "Eine Wallbox zu Hause installieren in Frankreich 2026: Der Leitfaden",
        metaDescription:
          "Zertifizierte Installateure, passende Leistung, Steuerregeln: Frankreichs Steuergutschrift endete 2025, die reduzierte Mehrwertsteuer bleibt 2026 der Hauptvorteil.",
        body: [
          {
            type: "p",
            text: "Eine Ladestation zu Hause erleichtert den Alltag eines Elektroauto-Fahrers in Frankreich erheblich. Hier sind die nötigen Schritte, und was sich 2026 steuerlich geändert hat.",
          },
          { type: "h2", text: "Einen IRVE-zertifizierten Installateur beauftragen" },
          {
            type: "p",
            text: "Die Installation einer Ladestation in Frankreich muss von einem IRVE-zertifizierten Installateur durchgeführt werden (Infrastructures de Recharge pour Véhicules Électriques). Diese Zertifizierung garantiert eine Installation nach elektrischen Sicherheitsstandards und ist zudem Voraussetzung für bestimmte finanzielle Vorteile.",
          },
          { type: "h3", text: "Die Schritte der Installation" },
          {
            type: "ul",
            items: [
              "Die Elektroinstallation des Hauses und die verfügbare Leistung prüfen lassen.",
              "Die passende Leistung für Fahrzeug und Nutzung wählen, meist zwischen 3,7 und 22 kW.",
              "Mehrere Angebote von IRVE-zertifizierten Installateuren einholen.",
              "Die Installation vom beauftragten Fachbetrieb durchführen lassen.",
              "Einen Wechsel zu einem Nebenzeit-/Hauptzeit-Stromtarif in Betracht ziehen, um nachts zum günstigeren Tarif zu laden.",
            ],
          },
          { type: "h2", text: "Die steuerliche Lage hat sich 2026 geändert" },
          {
            type: "p",
            text: "Frankreichs Steuergutschrift für die Installation einer Ladestation, die 75 Prozent der Kosten bis zu einer Obergrenze von 500 Euro abdeckte, endete zum 31. Dezember 2025. Sie gilt nicht mehr für Installationen ab 2026: Nur bis zu diesem Datum abgeschlossene Arbeiten bleiben förderfähig, anzugeben in der Einkommensteuererklärung 2026.",
          },
          { type: "h2", text: "Was 2026 weiterhin verfügbar bleibt" },
          {
            type: "p",
            text: "Für private Hauseigentümer bleibt als Hauptvorteil die ermäßigte Mehrwertsteuer von 5,5 Prozent auf Material und Installation, sofern die Arbeiten von einem qualifizierten Fachbetrieb durchgeführt werden. Eigentümergemeinschaften und Unternehmen können weiterhin die Prime Advenir für gemeinschaftliche Ladeinfrastruktur beantragen.",
          },
          { type: "h2", text: "Welches Budget einzuplanen ist" },
          {
            type: "p",
            text: "Die Gesamtkosten hängen stark von der Entfernung zwischen Zählerschrank und Ladestation ab, sowie davon, ob die bestehende Elektroinstallation verstärkt werden muss. Es lohnt sich, mehrere detaillierte Angebote zu vergleichen, statt sich auf einen Durchschnittspreis zu verlassen.",
          },
        ],
        faq: [
          { question: "Wer darf eine Ladestation zu Hause installieren?", answer: "Die Installation muss von einem IRVE-zertifizierten Installateur durchgeführt werden, eine Zertifizierung, die die Einhaltung der elektrischen Sicherheitsstandards gewährleistet und für bestimmte finanzielle Vorteile erforderlich ist." },
          { question: "Gibt es die Steuergutschrift für Ladestationen 2026 noch?", answer: "Nein, diese Steuergutschrift von 75 Prozent der Kosten bis zu 500 Euro endete am 31. Dezember 2025 und gilt nicht mehr für Installationen ab 2026." },
          { question: "Welcher Steuervorteil bleibt 2026 für die Installation einer Ladestation?", answer: "Der wichtigste verbleibende Vorteil ist die ermäßigte Mehrwertsteuer von 5,5 Prozent auf Material und Installation, sofern ein qualifizierter Fachbetrieb beauftragt wird." },
          { question: "Können Eigentümergemeinschaften noch Förderung für eine gemeinsame Ladestation erhalten?", answer: "Ja, Eigentümergemeinschaften und Unternehmen können weiterhin die Prime Advenir für gemeinschaftliche Ladeinfrastruktur beantragen." },
        ],
        ...cta.de,
      },
      es: {
        eyebrow: "Recarga en casa",
        title: "Instalar un punto de recarga en casa: la guía paso a paso para Francia",
        excerpt:
          "Instalador certificado IRVE, potencia adecuada, IVA al 5,5 %: lo que hay que saber antes de instalar un punto de recarga en casa en 2026.",
        metaTitle: "Instalar un punto de recarga en casa en Francia en 2026: la guía",
        metaDescription:
          "Instaladores certificados, elección de potencia, fiscalidad: el crédito fiscal francés terminó en 2025, el IVA reducido sigue siendo la ventaja principal en 2026.",
        body: [
          {
            type: "p",
            text: "Instalar un punto de recarga en casa facilita mucho el día a día de quien conduce un coche eléctrico en Francia. Estos son los pasos a seguir, y lo que cambió a nivel fiscal en 2026.",
          },
          { type: "h2", text: "Recurrir a un instalador certificado IRVE" },
          {
            type: "p",
            text: "En Francia, la instalación de un punto de recarga doméstico debe encargarse a un instalador certificado IRVE (Infrastructures de Recharge pour Véhicules Électriques). Esta certificación garantiza una instalación conforme a las normas de seguridad eléctrica, y también es necesaria para acceder a ciertas ayudas económicas.",
          },
          { type: "h3", text: "Los pasos de la instalación" },
          {
            type: "ul",
            items: [
              "Evaluar la instalación eléctrica de la vivienda y la potencia disponible.",
              "Elegir la potencia adecuada según el vehículo y el uso, generalmente entre 3,7 y 22 kW.",
              "Pedir varios presupuestos a instaladores certificados IRVE.",
              "Encargar la instalación al profesional elegido.",
              "Valorar cambiar a un contrato eléctrico con horas punta y valle para recargar por la noche a la tarifa más ventajosa.",
            ],
          },
          { type: "h2", text: "Una fiscalidad que cambió en 2026" },
          {
            type: "p",
            text: "El crédito fiscal francés para instalar un punto de recarga, que cubría el 75 % del gasto hasta un tope de 500 euros, terminó el 31 de diciembre de 2025. Ya no se aplica a instalaciones realizadas a partir de 2026: solo las obras finalizadas antes de esa fecha siguen siendo elegibles, declarables en la renta de 2026.",
          },
          { type: "h2", text: "Lo que sigue disponible en 2026" },
          {
            type: "p",
            text: "Para un propietario particular, la ventaja principal que queda es el IVA reducido al 5,5 % sobre el material y la instalación, siempre que la realice un profesional cualificado. Las comunidades de propietarios y las empresas pueden seguir solicitando la Prime Advenir para proyectos de infraestructura de recarga colectiva.",
          },
          { type: "h2", text: "Qué presupuesto prever" },
          {
            type: "p",
            text: "El coste total depende mucho de la distancia entre el cuadro eléctrico y la ubicación del punto de recarga, así como de si hace falta reforzar la instalación eléctrica existente. Conviene comparar varios presupuestos detallados en lugar de fiarse de un precio medio.",
          },
        ],
        faq: [
          { question: "¿Quién puede instalar un punto de recarga en casa en Francia?", answer: "La instalación debe encargarse a un instalador certificado IRVE, una certificación que garantiza el cumplimiento de las normas de seguridad eléctrica y es necesaria para acceder a ciertas ayudas económicas." },
          { question: "¿Sigue existiendo el crédito fiscal para instalar un punto de recarga en 2026?", answer: "No, ese crédito fiscal del 75 % del gasto hasta un tope de 500 euros terminó el 31 de diciembre de 2025 y ya no se aplica a instalaciones a partir de 2026." },
          { question: "¿Qué ventaja fiscal queda en 2026 para instalar un punto de recarga?", answer: "La principal ventaja que queda es el IVA reducido al 5,5 % sobre el material y la instalación, siempre que la realice un profesional cualificado." },
          { question: "¿Pueden las comunidades de propietarios seguir recibiendo ayuda para un punto colectivo?", answer: "Sí, las comunidades y las empresas pueden seguir solicitando la Prime Advenir para proyectos de infraestructura de recarga colectiva." },
        ],
        ...cta.es,
      },
    },
  },
  {
    slug: "idees-recues-voiture-electrique",
    publishedAt: "2026-09-03",
    image: {
      src: "/blog/idees-recues-voiture-electrique.jpg",
      alt: {
        fr: "Renault Mégane E-Tech, une voiture électrique présentée en salon automobile",
        en: "A Renault Mégane E-Tech, an electric car shown at a motor show",
        de: "Ein Renault Mégane E-Tech, ein auf einer Automesse gezeigtes Elektroauto",
        es: "Un Renault Mégane E-Tech, un coche eléctrico presentado en un salón del automóvil",
      },
      credit: {
        name: "Alexander Migl",
        url: "https://commons.wikimedia.org/wiki/File:Renault_Megane_E-Tech_IAA_2021_1X7A0083.jpg",
        license: "CC BY-SA 4.0",
      },
    },
    content: {
      fr: {
        eyebrow: "Idées reçues",
        title: "Voiture électrique : 6 idées reçues qui ont la vie dure",
        excerpt:
          "Pas assez de bornes, batteries fragiles, recharge aussi chère que l'essence : on démêle le vrai du faux en 2026.",
        metaTitle: "Idées reçues sur la voiture électrique : le vrai du faux en 2026",
        metaDescription:
          "Bornes insuffisantes, batterie fragile, recharge chère, autonomie hiver, risque d'incendie, copropriété : 6 idées reçues sur la voiture électrique passées au crible.",
        body: [
          {
            type: "p",
            text: "La voiture électrique traîne encore avec elle son lot d'idées reçues, certaines dépassées, d'autres partiellement vraies. Voici six affirmations courantes, remises à plat avec les faits disponibles en 2026.",
          },
          { type: "h3", text: "Idée reçue n°1 : il n'y a pas assez de bornes en France" },
          {
            type: "p",
            text: "C'était vrai il y a quelques années, ça l'est beaucoup moins aujourd'hui. La France a franchi le cap des 200 000 points de charge publics au 31 juillet 2026, répartis sur environ 55 600 stations, soit déjà la moitié de l'objectif fixé pour 2030.",
          },
          { type: "h3", text: "Idée reçue n°2 : recharger coûte aussi cher que faire le plein" },
          {
            type: "p",
            text: "Pas si l'on recharge principalement à domicile. Avec un tarif heures creuses à 0,1589 € le kWh depuis août 2026, le coût au kilomètre reste très inférieur à celui de l'essence ou du diesel. C'est surtout la recharge rapide en itinérance qui réduit cet écart.",
          },
          { type: "h3", text: "Idée reçue n°3 : la batterie va vite lâcher et coûter une fortune à remplacer" },
          {
            type: "p",
            text: "Les constructeurs garantissent généralement leurs batteries autour de 8 ans ou 160 000 km, et dans des conditions d'usage normales, elles conservent une large part de leur capacité bien au-delà de cette durée. Un remplacement prématuré reste un cas rare, pas la norme.",
          },
          { type: "h3", text: "Idée reçue n°4 : l'autonomie s'effondre en hiver et rend la voiture inutilisable" },
          {
            type: "p",
            text: "Le froid réduit bel et bien l'autonomie, entre chimie de la batterie, chauffage de l'habitacle et résistance des pneus, mais il ne rend pas la voiture inutilisable pour autant. Un bon préconditionnement et une planification des trajets compensent une grande partie de cette perte, un sujet que nous détaillons dans notre article dédié à l'autonomie en hiver.",
          },
          { type: "h3", text: "Idée reçue n°5 : les voitures électriques prennent feu plus souvent" },
          {
            type: "p",
            text: "Les données disponibles et les études des assureurs ne montrent généralement pas de fréquence d'incendie plus élevée pour les voitures électriques que pour les véhicules thermiques. En revanche, un incendie de batterie peut se comporter différemment et s'avérer plus difficile à éteindre, ce qui explique en partie la persistance de cette idée reçue.",
          },
          { type: "h3", text: "Idée reçue n°6 : impossible de recharger chez soi en copropriété" },
          {
            type: "p",
            text: "Le droit à la prise permet à tout copropriétaire ou locataire d'installer une borne de recharge à ses frais sur son emplacement de stationnement, sans avoir besoin de l'accord de l'assemblée générale. Nous détaillons toute la procédure dans notre guide sur le droit à la prise en copropriété.",
          },
        ],
        faq: [
          { question: "Est-il vrai qu'il n'y a pas assez de bornes de recharge en France ?", answer: "Non, c'était vrai il y a quelques années, mais la France a dépassé les 200 000 points de charge publics en juillet 2026." },
          { question: "La recharge coûte-t-elle aussi cher que l'essence ?", answer: "Non, pas si l'on recharge principalement à domicile : avec un tarif heures creuses à 0,1589 € le kWh, le coût au kilomètre reste très inférieur à celui du carburant." },
          { question: "La batterie d'une voiture électrique s'use-t-elle rapidement ?", answer: "Non, les constructeurs garantissent généralement leurs batteries autour de 8 ans ou 160 000 km, et elles conservent une large part de leur capacité bien au-delà de cette durée." },
          { question: "Les voitures électriques prennent-elles feu plus souvent que les voitures thermiques ?", answer: "Les données disponibles et les études des assureurs ne montrent généralement pas de fréquence d'incendie plus élevée, même si un incendie de batterie peut se comporter différemment et être plus difficile à éteindre." },
        ],
        ...cta.fr,
      },
      en: {
        eyebrow: "Myths",
        title: "Electric Cars: 6 Persistent Myths, Fact-Checked",
        excerpt:
          "Not enough charging stations, fragile batteries, charging as expensive as fuel: separating fact from fiction in France in 2026.",
        metaTitle: "Electric Car Myths: What's True and False in 2026",
        metaDescription:
          "Not enough stations, fragile batteries, expensive charging, winter range, fire risk, apartment charging: 6 common EV myths checked against the facts.",
        body: [
          {
            type: "p",
            text: "Electric cars still carry a fair share of misconceptions in France, some outdated, others only partly true. Here are six common claims, checked against the facts available in 2026.",
          },
          { type: "h3", text: "Myth 1: there aren't enough charging stations in France" },
          {
            type: "p",
            text: "That used to be true a few years ago, much less so today. France crossed 200,000 public charging points as of July 31, 2026, spread across roughly 55,600 stations, already halfway to the 2030 target.",
          },
          { type: "h3", text: "Myth 2: charging costs about as much as filling up with fuel" },
          {
            type: "p",
            text: "Not if you mostly charge at home. With an off-peak rate of 0.1589 euros per kWh as of August 2026, the cost per kilometer stays well below petrol or diesel. It's mainly fast charging on the road that narrows that gap.",
          },
          { type: "h3", text: "Myth 3: the battery will wear out fast and be expensive to replace" },
          {
            type: "p",
            text: "Manufacturers typically warrant their batteries for around 8 years or 160,000km, and under normal use, batteries generally retain a large majority of their capacity well beyond that. A premature replacement remains rare, not the norm.",
          },
          { type: "h3", text: "Myth 4: range collapses in winter and makes the car unusable" },
          {
            type: "p",
            text: "Cold weather does reduce range, through battery chemistry, cabin heating, and tire resistance, but it doesn't make the car unusable. Good preconditioning and route planning offset much of that loss, a topic we cover in more detail in our dedicated article on winter range.",
          },
          { type: "h3", text: "Myth 5: electric cars catch fire more often" },
          {
            type: "p",
            text: "Available data and insurer studies generally don't show a higher fire frequency for electric cars compared to combustion vehicles. That said, a battery fire can behave differently and be harder to extinguish, which partly explains why this myth persists.",
          },
          { type: "h3", text: "Myth 6: you can't charge at home if you live in a co-owned building" },
          {
            type: "p",
            text: "The 'droit à la prise' lets any co-owner or tenant install a charging point at their own expense on their parking space, without needing the general assembly's approval. We cover the full process in our guide to the right to charge in co-ownerships.",
          },
        ],
        faq: [
          { question: "Is it true there aren't enough charging stations in France?", answer: "No, that was true a few years ago, but France crossed 200,000 public charging points in July 2026." },
          { question: "Does charging cost as much as buying fuel?", answer: "No, not if you mostly charge at home: with an off-peak rate of 0.1589 euros per kWh, the cost per kilometer stays well below fuel." },
          { question: "Does an electric car's battery wear out quickly?", answer: "No, manufacturers typically warrant their batteries for around 8 years or 160,000km, and they retain a large majority of their capacity well beyond that." },
          { question: "Do electric cars catch fire more often than combustion cars?", answer: "Available data and insurer studies generally don't show a higher fire frequency, though a battery fire can behave differently and be harder to extinguish." },
        ],
        ...cta.en,
      },
      de: {
        eyebrow: "Mythen",
        title: "Elektroautos: 6 hartnäckige Mythen im Faktencheck",
        excerpt:
          "Zu wenige Ladestationen, empfindliche Batterien, Laden so teuer wie Tanken: Wir trennen 2026 Fakten von Fiktion für Frankreich.",
        metaTitle: "Mythen über Elektroautos: Was 2026 stimmt und was nicht",
        metaDescription:
          "Zu wenige Stationen, empfindliche Batterien, teures Laden, Winterreichweite, Brandrisiko, Laden in der Eigentumswohnung: 6 gängige Mythen im Faktencheck.",
        body: [
          {
            type: "p",
            text: "Elektroautos schleppen in Frankreich immer noch einige Missverständnisse mit sich herum, manche veraltet, andere nur teilweise wahr. Hier sind sechs gängige Behauptungen, überprüft anhand der 2026 verfügbaren Fakten.",
          },
          { type: "h3", text: "Mythos 1: Es gibt nicht genug Ladestationen in Frankreich" },
          {
            type: "p",
            text: "Das stimmte vor einigen Jahren noch, heute deutlich weniger. Frankreich überschritt zum 31. Juli 2026 die Marke von 200.000 öffentlichen Ladepunkten auf rund 55.600 Stationen, bereits die Hälfte des Ziels für 2030.",
          },
          { type: "h3", text: "Mythos 2: Laden kostet etwa so viel wie Tanken" },
          {
            type: "p",
            text: "Nicht, wenn man vorwiegend zu Hause lädt. Mit einem Nebenzeittarif von 0,1589 Euro pro kWh seit August 2026 bleiben die Kosten pro Kilometer deutlich unter denen von Benzin oder Diesel. Vor allem Schnellladen unterwegs verringert diesen Abstand.",
          },
          { type: "h3", text: "Mythos 3: Die Batterie verschleißt schnell und ist teuer im Austausch" },
          {
            type: "p",
            text: "Hersteller gewähren üblicherweise Garantien von rund 8 Jahren oder 160.000 km, und unter normaler Nutzung behalten Batterien den Großteil ihrer Kapazität auch deutlich darüber hinaus. Ein vorzeitiger Austausch bleibt die Ausnahme, nicht die Regel.",
          },
          { type: "h3", text: "Mythos 4: Die Reichweite bricht im Winter ein und macht das Auto unbrauchbar" },
          {
            type: "p",
            text: "Kälte verringert tatsächlich die Reichweite, durch Batteriechemie, Innenraumheizung und Reifenwiderstand, macht das Auto aber nicht unbrauchbar. Gute Vorkonditionierung und Routenplanung gleichen einen Großteil davon aus, ein Thema, das wir in unserem eigenen Artikel zur Winterreichweite ausführlicher behandeln.",
          },
          { type: "h3", text: "Mythos 5: Elektroautos brennen häufiger" },
          {
            type: "p",
            text: "Verfügbare Daten und Versicherungsstudien zeigen in der Regel keine höhere Brandhäufigkeit bei Elektroautos im Vergleich zu Verbrennern. Allerdings kann ein Batteriebrand anders verlaufen und schwerer zu löschen sein, was teilweise erklärt, warum sich dieser Mythos hält.",
          },
          { type: "h3", text: "Mythos 6: In der Eigentumswohnung kann man zu Hause nicht laden" },
          {
            type: "p",
            text: "Das 'droit à la prise' erlaubt es jedem Miteigentümer oder Mieter, auf eigene Kosten eine Ladestation auf seinem Stellplatz zu installieren, ohne dass die Eigentümerversammlung zustimmen muss. Den gesamten Ablauf erklären wir in unserem Leitfaden zum Recht auf eine Ladestation in Eigentümergemeinschaften.",
          },
        ],
        faq: [
          { question: "Stimmt es, dass es in Frankreich nicht genug Ladestationen gibt?", answer: "Nein, das stimmte vor einigen Jahren, aber Frankreich überschritt im Juli 2026 die Marke von 200.000 öffentlichen Ladepunkten." },
          { question: "Kostet Laden genauso viel wie Tanken?", answer: "Nein, nicht wenn man vorwiegend zu Hause lädt: Mit einem Nebenzeittarif von 0,1589 Euro pro kWh bleiben die Kosten pro Kilometer deutlich unter denen von Kraftstoff." },
          { question: "Verschleißt die Batterie eines Elektroautos schnell?", answer: "Nein, Hersteller gewähren üblicherweise Garantien von rund 8 Jahren oder 160.000 km, und die Batterien behalten auch danach noch den Großteil ihrer Kapazität." },
          { question: "Brennen Elektroautos häufiger als Verbrenner?", answer: "Verfügbare Daten und Versicherungsstudien zeigen in der Regel keine höhere Brandhäufigkeit, auch wenn ein Batteriebrand anders verlaufen und schwerer zu löschen sein kann." },
        ],
        ...cta.de,
      },
      es: {
        eyebrow: "Mitos",
        title: "Coche eléctrico: 6 mitos persistentes, comprobados",
        excerpt:
          "Pocos puntos de recarga, baterías frágiles, recargar tan caro como repostar: separamos lo real de lo falso en Francia en 2026.",
        metaTitle: "Mitos sobre el coche eléctrico: qué es verdad y qué no en 2026",
        metaDescription:
          "Pocos puntos, baterías frágiles, recarga cara, autonomía en invierno, riesgo de incendio, recarga en comunidad: 6 mitos comprobados con los hechos.",
        body: [
          {
            type: "p",
            text: "El coche eléctrico todavía arrastra en Francia bastantes ideas equivocadas, algunas desfasadas, otras solo parcialmente ciertas. Aquí van seis afirmaciones habituales, contrastadas con los hechos disponibles en 2026.",
          },
          { type: "h3", text: "Mito 1: no hay suficientes puntos de recarga en Francia" },
          {
            type: "p",
            text: "Eso era cierto hace unos años, hoy mucho menos. Francia superó los 200.000 puntos de recarga públicos a 31 de julio de 2026, repartidos en unas 55.600 estaciones, ya a mitad de camino del objetivo para 2030.",
          },
          { type: "h3", text: "Mito 2: recargar cuesta casi lo mismo que repostar" },
          {
            type: "p",
            text: "No si recargas principalmente en casa. Con una tarifa valle de 0,1589 euros por kWh desde agosto de 2026, el coste por kilómetro sigue siendo mucho menor que el de la gasolina o el diésel. Es sobre todo la carga rápida de viaje la que reduce esa diferencia.",
          },
          { type: "h3", text: "Mito 3: la batería se estropeará pronto y costará una fortuna cambiarla" },
          {
            type: "p",
            text: "Los fabricantes suelen garantizar sus baterías alrededor de 8 años o 160.000 km, y en condiciones normales de uso conservan la gran mayoría de su capacidad mucho más allá de ese plazo. Un reemplazo prematuro sigue siendo la excepción, no la norma.",
          },
          { type: "h3", text: "Mito 4: la autonomía se desploma en invierno y hace inservible el coche" },
          {
            type: "p",
            text: "El frío sí reduce la autonomía, por la química de la batería, la calefacción del habitáculo y la resistencia de los neumáticos, pero no hace inservible el coche. Un buen precondicionamiento y la planificación de rutas compensan buena parte de esa pérdida, un tema que tratamos con más detalle en nuestro artículo sobre la autonomía en invierno.",
          },
          { type: "h3", text: "Mito 5: los coches eléctricos se incendian más a menudo" },
          {
            type: "p",
            text: "Los datos disponibles y los estudios de las aseguradoras generalmente no muestran una mayor frecuencia de incendios en coches eléctricos frente a los de combustión. Eso sí, un incendio de batería puede comportarse de forma distinta y ser más difícil de apagar, lo que explica en parte que este mito persista.",
          },
          { type: "h3", text: "Mito 6: no se puede recargar en casa si vives en un piso" },
          {
            type: "p",
            text: "El 'droit à la prise' permite a cualquier propietario o inquilino instalar un punto de recarga a su cargo en su plaza de garaje, sin necesitar la aprobación de la junta de propietarios. Explicamos todo el proceso en nuestra guía sobre el derecho a la toma en comunidades de propietarios.",
          },
        ],
        faq: [
          { question: "¿Es cierto que no hay suficientes puntos de recarga en Francia?", answer: "No, eso era cierto hace unos años, pero Francia superó los 200.000 puntos de recarga públicos en julio de 2026." },
          { question: "¿Cuesta recargar tanto como repostar?", answer: "No, no si recargas principalmente en casa: con una tarifa valle de 0,1589 euros por kWh, el coste por kilómetro sigue siendo mucho menor que el del combustible." },
          { question: "¿Se desgasta rápido la batería de un coche eléctrico?", answer: "No, los fabricantes suelen garantizar sus baterías durante unos 8 años o 160.000 km, y conservan la gran mayoría de su capacidad mucho más allá de ese plazo." },
          { question: "¿Se incendian los coches eléctricos más a menudo que los de combustión?", answer: "Los datos disponibles y los estudios de las aseguradoras generalmente no muestran una mayor frecuencia de incendios, aunque un incendio de batería puede comportarse de forma distinta y ser más difícil de apagar." },
        ],
        ...cta.es,
      },
    },
  },
  {
    slug: "acheter-voiture-electrique-occasion",
    publishedAt: "2026-09-05",
    image: {
      src: "/blog/acheter-voiture-electrique-occasion.jpg",
      alt: {
        fr: "Rangée de voitures d'occasion garées chez un concessionnaire",
        en: "A row of used cars parked at a dealership lot",
        de: "Eine Reihe gebrauchter Autos auf einem Händlerparkplatz",
        es: "Una fila de coches de segunda mano aparcados en un concesionario",
      },
      credit: {
        name: "Tyler A. McNeil",
        url: "https://commons.wikimedia.org/wiki/File:Used_car_lot_in_Lansingburgh,_New_York.jpg",
        license: "CC BY-SA 4.0",
      },
    },
    content: {
      fr: {
        eyebrow: "Occasion",
        title: "Acheter une voiture électrique d'occasion : les points à vérifier avant de vous décider",
        excerpt:
          "État de la batterie, garantie restante, habitudes de recharge : les vérifications essentielles avant d'acheter une électrique d'occasion en 2026.",
        metaTitle: "Acheter une voiture électrique d'occasion en 2026 : le guide",
        metaDescription:
          "State of Health de la batterie, garantie, habitudes de recharge rapide : les points essentiels à vérifier avant d'acheter une voiture électrique d'occasion en 2026.",
        body: [
          {
            type: "p",
            text: "Le marché de l'occasion électrique se développe rapidement en France, mais acheter une voiture électrique d'occasion demande quelques vérifications spécifiques, en plus des points de contrôle habituels d'un achat automobile.",
          },
          { type: "h2", text: "L'état de santé de la batterie, la vérification numéro un" },
          {
            type: "p",
            text: "Le State of Health, ou SoH, mesure la capacité restante de la batterie par rapport à son état neuf. De nombreux concessionnaires et garages indépendants peuvent réaliser un diagnostic pour le mesurer : il est vivement conseillé de le demander avant tout achat, plutôt que de se fier à une simple estimation visuelle.",
          },
          { type: "h2", text: "La garantie batterie, à vérifier en détail" },
          {
            type: "p",
            text: "La plupart des constructeurs garantissent leurs batteries autour de 8 ans ou 160 000 km, selon la première limite atteinte. Vérifiez combien il reste de cette garantie, si elle est transférable au nouveau propriétaire, et demandez les documents qui l'attestent.",
          },
          { type: "h2", text: "Les habitudes de recharge du précédent propriétaire" },
          {
            type: "p",
            text: "Des recharges rapides en courant continu très fréquentes peuvent accélérer un peu l'usure de la batterie, même si les systèmes de gestion modernes limitent cet effet. Renseignez-vous si possible sur les habitudes de recharge du précédent propriétaire, même si cette information n'est pas toujours disponible.",
          },
          { type: "h2", text: "Des vérifications pratiques avant de signer" },
          {
            type: "ul",
            items: [
              "Testez que le véhicule recharge correctement en courant alternatif et en courant continu avant de finaliser l'achat.",
              "Vérifiez l'historique des mises à jour logicielles du véhicule.",
              "Assurez-vous de ce qui est inclus dans la vente : câble de recharge, éventuelle borne murale associée au véhicule.",
              "Vérifiez que le type de connecteur correspond bien à votre installation à domicile et aux réseaux publics que vous utiliserez le plus.",
            ],
          },
          { type: "h2", text: "Occasion et aides publiques : attention aux calculs" },
          {
            type: "p",
            text: "Le bonus écologique et le leasing social ne s'appliquent qu'aux véhicules neufs, jamais à l'occasion. Il faut donc en tenir compte dans votre comparaison entre neuf et occasion, plutôt que de partir du principe qu'une électrique d'occasion revient forcément moins cher une fois les aides prises en compte.",
          },
        ],
        faq: [
          { question: "Quel est le point le plus important à vérifier avant d'acheter une électrique d'occasion ?", answer: "L'état de santé de la batterie, ou State of Health (SoH), qui mesure sa capacité restante par rapport à son état neuf : demandez un diagnostic avant l'achat." },
          { question: "La garantie batterie est-elle transférable à l'acheteur d'une voiture d'occasion ?", answer: "Cela dépend du constructeur : vérifiez combien il reste de la garantie, généralement autour de 8 ans ou 160 000 km, et si elle est transférable au nouveau propriétaire." },
          { question: "Les recharges rapides fréquentes abîment-elles la batterie ?", answer: "Elles peuvent accélérer un peu son usure, même si les systèmes de gestion modernes limitent cet effet." },
          { question: "Peut-on bénéficier du bonus écologique ou du leasing social pour une voiture d'occasion ?", answer: "Non, ces aides ne s'appliquent qu'aux véhicules neufs, jamais à l'occasion, il faut en tenir compte dans le calcul entre neuf et occasion." },
        ],
        ...cta.fr,
      },
      en: {
        eyebrow: "Used Cars",
        title: "Buying a Used Electric Car in France: What to Check Before You Commit",
        excerpt:
          "Battery health, remaining warranty, past charging habits: the essential checks before buying a used EV in France in 2026.",
        metaTitle: "Buying a Used Electric Car in France in 2026: The Guide",
        metaDescription:
          "Battery State of Health, warranty, fast-charging habits: the key checks before buying a used electric car in France in 2026.",
        body: [
          {
            type: "p",
            text: "France's used-EV market is growing fast, but buying a used electric car calls for a few specific checks on top of the usual used-car inspection.",
          },
          { type: "h2", text: "Battery State of Health: check number one" },
          {
            type: "p",
            text: "State of Health, or SoH, measures the battery's remaining capacity compared to when it was new. Many dealers and independent garages can run a diagnostic to measure it, and it's strongly worth asking for this before buying, rather than relying on a rough visual guess.",
          },
          { type: "h2", text: "The battery warranty deserves a close look" },
          {
            type: "p",
            text: "Most manufacturers warrant their batteries for around 8 years or 160,000km, whichever comes first. Check how much of that warranty remains, whether it transfers to a new owner, and ask for the documentation proving it.",
          },
          { type: "h2", text: "The previous owner's charging habits" },
          {
            type: "p",
            text: "Very frequent DC fast charging can somewhat accelerate battery wear, though modern battery management systems limit that effect. Ask about the previous owner's charging habits if you can, even though that information isn't always available.",
          },
          { type: "h2", text: "Practical checks before signing" },
          {
            type: "ul",
            items: [
              "Test that the car charges correctly on both AC and DC before finalizing the purchase.",
              "Check the vehicle's software and firmware update history.",
              "Confirm what's included in the sale: charging cable, any home wallbox tied to the vehicle.",
              "Check that the connector type matches your home setup and the public networks you'll rely on most.",
            ],
          },
          { type: "h2", text: "Used cars and government incentives: watch the math" },
          {
            type: "p",
            text: "France's ecological bonus and social leasing scheme only apply to new vehicles, never to used ones. Factor that into your new-versus-used comparison, rather than assuming a used EV is automatically cheaper once incentives are taken into account.",
          },
        ],
        faq: [
          { question: "What's the most important thing to check before buying a used EV?", answer: "The battery's State of Health (SoH), which measures its remaining capacity compared to new: ask for a diagnostic before buying." },
          { question: "Is the battery warranty transferable to a used car buyer?", answer: "It depends on the manufacturer: check how much of the warranty remains, typically around 8 years or 160,000km, and whether it transfers to a new owner." },
          { question: "Does frequent fast charging damage the battery?", answer: "It can somewhat accelerate wear, though modern battery management systems limit that effect." },
          { question: "Can I get France's ecological bonus or social leasing for a used EV?", answer: "No, those incentives only apply to new vehicles, never to used ones, so factor that into your new-versus-used comparison." },
        ],
        ...cta.en,
      },
      de: {
        eyebrow: "Gebrauchtwagen",
        title: "Ein gebrauchtes Elektroauto in Frankreich kaufen: Was Sie vorher prüfen sollten",
        excerpt:
          "Batteriezustand, verbleibende Garantie, bisherige Ladegewohnheiten: die wichtigsten Prüfpunkte vor dem Kauf eines gebrauchten E-Autos in Frankreich 2026.",
        metaTitle: "Gebrauchtes Elektroauto kaufen in Frankreich 2026: Der Leitfaden",
        metaDescription:
          "State of Health der Batterie, Garantie, Schnellladegewohnheiten: die wichtigsten Prüfpunkte vor dem Kauf eines gebrauchten Elektroautos in Frankreich 2026.",
        body: [
          {
            type: "p",
            text: "Der Gebrauchtwagenmarkt für Elektroautos wächst in Frankreich schnell, doch der Kauf eines gebrauchten Elektroautos erfordert zusätzlich zur üblichen Gebrauchtwagenprüfung einige besondere Kontrollen.",
          },
          { type: "h2", text: "Der Batteriezustand: die wichtigste Prüfung" },
          {
            type: "p",
            text: "Der State of Health, kurz SoH, misst die verbleibende Kapazität der Batterie im Vergleich zum Neuzustand. Viele Händler und freie Werkstätten können dazu eine Diagnose durchführen, es lohnt sich unbedingt, diese vor dem Kauf zu verlangen, statt sich auf eine grobe Schätzung zu verlassen.",
          },
          { type: "h2", text: "Die Batteriegarantie genau prüfen" },
          {
            type: "p",
            text: "Die meisten Hersteller gewähren Garantien von rund 8 Jahren oder 160.000 km, je nachdem, was zuerst eintritt. Prüfen Sie, wie viel davon noch übrig ist, ob sie auf einen neuen Eigentümer übertragbar ist, und lassen Sie sich die entsprechenden Unterlagen zeigen.",
          },
          { type: "h2", text: "Die Ladegewohnheiten des Vorbesitzers" },
          {
            type: "p",
            text: "Sehr häufiges Gleichstrom-Schnellladen kann den Batterieverschleiß etwas beschleunigen, auch wenn moderne Batteriemanagementsysteme diesen Effekt begrenzen. Fragen Sie nach Möglichkeit nach den Ladegewohnheiten des Vorbesitzers, auch wenn diese Information nicht immer verfügbar ist.",
          },
          { type: "h2", text: "Praktische Prüfungen vor der Unterschrift" },
          {
            type: "ul",
            items: [
              "Testen Sie vor dem Kaufabschluss, ob das Auto korrekt sowohl mit Wechsel- als auch mit Gleichstrom lädt.",
              "Prüfen Sie die Historie der Software- und Firmware-Updates des Fahrzeugs.",
              "Klären Sie, was im Kauf enthalten ist: Ladekabel, eine dem Fahrzeug zugeordnete Wallbox.",
              "Prüfen Sie, ob der Steckertyp zu Ihrer Installation zu Hause und den öffentlichen Netzen passt, die Sie am häufigsten nutzen werden.",
            ],
          },
          { type: "h2", text: "Gebrauchtwagen und staatliche Förderung: Vorsicht bei der Rechnung" },
          {
            type: "p",
            text: "Frankreichs Umweltbonus und das soziale Leasing gelten nur für Neuwagen, niemals für Gebrauchtwagen. Berücksichtigen Sie das beim Vergleich zwischen Neu- und Gebrauchtwagen, statt automatisch davon auszugehen, dass ein gebrauchtes Elektroauto unter Berücksichtigung von Förderungen günstiger ausfällt.",
          },
        ],
        faq: [
          { question: "Was ist beim Kauf eines gebrauchten Elektroautos am wichtigsten zu prüfen?", answer: "Der Batteriezustand, State of Health (SoH) genannt, der die verbleibende Kapazität im Vergleich zum Neuzustand misst: Verlangen Sie vor dem Kauf eine Diagnose." },
          { question: "Ist die Batteriegarantie auf den Käufer eines Gebrauchtwagens übertragbar?", answer: "Das hängt vom Hersteller ab: Prüfen Sie, wie viel von der Garantie übrig ist, meist rund 8 Jahre oder 160.000 km, und ob sie auf einen neuen Besitzer übertragbar ist." },
          { question: "Schadet häufiges Schnellladen der Batterie?", answer: "Es kann den Verschleiß etwas beschleunigen, auch wenn moderne Batteriemanagementsysteme diesen Effekt begrenzen." },
          { question: "Kann ich für ein gebrauchtes Elektroauto den Umweltbonus oder das Sozialleasing erhalten?", answer: "Nein, diese Förderungen gelten nur für Neuwagen, niemals für Gebrauchtwagen, das sollte man beim Vergleich zwischen neu und gebraucht berücksichtigen." },
        ],
        ...cta.de,
      },
      es: {
        eyebrow: "Coches de segunda mano",
        title: "Comprar un coche eléctrico de segunda mano en Francia: qué revisar antes de decidirte",
        excerpt:
          "Estado de la batería, garantía restante, hábitos de recarga previos: las revisiones esenciales antes de comprar un eléctrico de segunda mano en 2026.",
        metaTitle: "Comprar un coche eléctrico de segunda mano en Francia en 2026: la guía",
        metaDescription:
          "State of Health de la batería, garantía, hábitos de carga rápida: los puntos clave a revisar antes de comprar un eléctrico de segunda mano en Francia en 2026.",
        body: [
          {
            type: "p",
            text: "El mercado de eléctricos de segunda mano crece rápido en Francia, pero comprar uno exige algunas comprobaciones específicas, además de las habituales en cualquier compra de coche de ocasión.",
          },
          { type: "h2", text: "El estado de salud de la batería, la revisión número uno" },
          {
            type: "p",
            text: "El State of Health, o SoH, mide la capacidad restante de la batería respecto a su estado de nueva. Muchos concesionarios y talleres independientes pueden hacer un diagnóstico para medirlo: conviene pedirlo antes de comprar, en lugar de fiarse de una estimación aproximada.",
          },
          { type: "h2", text: "La garantía de la batería, a revisar en detalle" },
          {
            type: "p",
            text: "La mayoría de los fabricantes garantizan sus baterías durante unos 8 años o 160.000 km, lo que ocurra primero. Comprueba cuánto queda de esa garantía, si es transferible al nuevo propietario, y pide la documentación que lo acredite.",
          },
          { type: "h2", text: "Los hábitos de carga del propietario anterior" },
          {
            type: "p",
            text: "Las recargas rápidas en corriente continua muy frecuentes pueden acelerar algo el desgaste de la batería, aunque los sistemas modernos de gestión lo limitan. Pregunta si es posible por los hábitos de carga del propietario anterior, aunque esa información no siempre está disponible.",
          },
          { type: "h2", text: "Comprobaciones prácticas antes de firmar" },
          {
            type: "ul",
            items: [
              "Comprueba que el coche recarga correctamente tanto en corriente alterna como continua antes de cerrar la compra.",
              "Revisa el historial de actualizaciones de software y firmware del vehículo.",
              "Confirma qué se incluye en la venta: cable de recarga, cualquier wallbox asociada al vehículo.",
              "Verifica que el tipo de conector coincide con tu instalación en casa y con las redes públicas que más vayas a usar.",
            ],
          },
          { type: "h2", text: "Segunda mano y ayudas públicas: cuidado con los cálculos" },
          {
            type: "p",
            text: "El bono ecológico y el leasing social franceses solo se aplican a vehículos nuevos, nunca a los de segunda mano. Tenlo en cuenta en tu comparación entre nuevo y usado, en lugar de asumir que un eléctrico de segunda mano sale automáticamente más barato una vez consideradas las ayudas.",
          },
        ],
        faq: [
          { question: "¿Qué es lo más importante que hay que revisar antes de comprar un eléctrico de segunda mano?", answer: "El estado de salud de la batería, o State of Health (SoH), que mide la capacidad restante respecto a su estado de nueva: pide un diagnóstico antes de comprar." },
          { question: "¿Es transferible la garantía de la batería al comprador de un coche de segunda mano?", answer: "Depende del fabricante: comprueba cuánto queda de la garantía, normalmente unos 8 años o 160.000 km, y si es transferible al nuevo propietario." },
          { question: "¿Perjudica la batería recargar rápido con frecuencia?", answer: "Puede acelerar algo su desgaste, aunque los sistemas modernos de gestión limitan ese efecto." },
          { question: "¿Puedo acceder al bono ecológico o al leasing social con un eléctrico de segunda mano?", answer: "No, esas ayudas solo se aplican a vehículos nuevos, nunca a los de segunda mano, hay que tenerlo en cuenta al comparar nuevo frente a usado." },
        ],
        ...cta.es,
      },
    },
  },
  {
    slug: "road-trip-france-recharge-voiture-electrique",
    publishedAt: "2026-09-08",
    image: {
      src: "/blog/road-trip-france-recharge-voiture-electrique.jpg",
      alt: {
        fr: "Trois bornes de recharge rapide sur une aire de service en bord de route en France",
        en: "Three fast-charging stations at a roadside service area in France",
        de: "Drei Schnellladesäulen an einer Raststätte entlang einer Straße in Frankreich",
        es: "Tres puntos de recarga rápida en un área de servicio junto a una carretera en Francia",
      },
      credit: {
        name: "Bibounette clochette",
        url: "https://commons.wikimedia.org/wiki/File:Borne_%C3%A9lectrique_hyperchargeur_du_Mans.jpg",
        license: "CC BY-SA 4.0",
      },
    },
    content: {
      fr: {
        eyebrow: "Voyage",
        title: "Road trip en France : bien recharger sa voiture électrique sans mauvaise surprise",
        excerpt:
          "Type de prise, paiement sans abonnement, applications utiles : ce qu'il faut savoir pour recharger sereinement sa voiture électrique pendant un road trip en France.",
        metaTitle: "Road trip en France en voiture électrique : guide de recharge 2026",
        metaDescription:
          "Bornes rapides sur autoroute, paiement sans abonnement, applications indispensables et types de prises : le guide complet pour recharger sa voiture électrique en road trip en France.",
        body: [
          {
            type: "p",
            text: "De plus en plus de conducteurs, français comme étrangers, parcourent la France en voiture électrique le temps d'un été ou d'un long week-end. Le réseau de recharge s'est beaucoup développé ces dernières années, mais quelques repères simples suffisent pour partir sans stress.",
          },
          { type: "h2", text: "Un réseau de recharge rapide prêt pour la route" },
          {
            type: "p",
            text: "La quasi-totalité des aires d'autoroute françaises sont aujourd'hui équipées de bornes rapides ou très rapides, exploitées par plusieurs opérateurs comme Ionity, Fastned, Atlante, TotalEnergies ou Electra. Les puissances vont généralement de 150 à 400 kW, de quoi retrouver 20 à 30 minutes suffisantes pour la plupart des arrêts d'un trajet.",
          },
          { type: "h2", text: "Quel type de prise pour recharger en France ?" },
          {
            type: "p",
            text: "La France utilise le même standard que le reste de l'Europe : la prise Type 2 en courant alternatif pour la recharge normale, et le connecteur Combo CCS2 pour la recharge rapide en courant continu. La plupart des véhicules européens n'ont donc besoin d'aucun adaptateur. Les rares exceptions concernent certains modèles plus anciens équipés d'un connecteur CHAdeMO, à vérifier avant de partir si votre véhicule ne date pas d'hier.",
          },
          { type: "h2", text: "Recharger sans abonnement, la norme en France" },
          {
            type: "p",
            text: "Contrairement à certains pays où un abonnement ou une carte RFID reste indispensable, les opérateurs de bornes rapides en France ont l'obligation de proposer un paiement direct par carte bancaire, sans abonnement ni application, généralement via un terminal sans contact intégré à la borne. Pratique pour un road trip ponctuel : inutile de créer un compte avant de partir.",
          },
          { type: "h2", text: "Les applications qui simplifient le trajet" },
          {
            type: "p",
            text: "Même avec un paiement par carte, une application facilite grandement la préparation de l'itinéraire : Chargemap pour repérer les bornes et lire les avis, PlugShare pour la communauté internationale, ou A Better Route Planner pour calculer automatiquement les arrêts nécessaires selon votre véhicule et la météo. La carte de ma-borne-electrique.com permet ensuite de repérer une borne disponible en temps réel juste avant de dévier de sa route.",
          },
          { type: "h3", text: "Nos conseils pour un road trip sans accroc" },
          {
            type: "ul",
            items: [
              "Rechargez idéalement entre 20 % et 80 % : la vitesse de charge ralentit nettement au-delà de ce seuil.",
              "Prévoyez une marge d'autonomie plus large en cas de forte chaleur ou de grand froid.",
              "Vérifiez la disponibilité en temps réel d'une borne avant de faire un détour pour l'atteindre.",
              "En haute saison, privilégiez les aires équipées de plusieurs bornes pour limiter l'attente.",
            ],
          },
          { type: "h2", text: "Des tarifs qui varient selon l'opérateur et l'heure" },
          {
            type: "p",
            text: "Le prix au kWh varie sensiblement d'un opérateur à l'autre, et parfois selon l'heure de la journée. Sur autoroute, la recharge rapide reste en général plus chère qu'à domicile ou sur une borne de ville, ce qui reflète la puissance délivrée. Pour un trajet ponctuel, le paiement à la carte reste la solution la plus simple, même s'il est un peu plus cher qu'un tarif d'abonné.",
          },
        ],
        faq: [
          { question: "Ai-je besoin d'un abonnement pour recharger ma voiture électrique en France ?", answer: "Non, la loi impose aux opérateurs de bornes rapides de proposer un paiement direct par carte bancaire sans abonnement ni application obligatoire." },
          { question: "Quel type de connecteur est utilisé pour recharger en France ?", answer: "La prise Type 2 en courant alternatif pour la recharge normale, et le connecteur Combo CCS2 en courant continu pour la recharge rapide : le même standard que dans le reste de l'Europe." },
          { question: "Le réseau de bornes rapides couvre-t-il bien les autoroutes françaises ?", answer: "Oui, la quasi-totalité des aires d'autoroute françaises sont désormais équipées de bornes rapides ou très rapides, avec des puissances allant généralement de 150 à 400 kW." },
          { question: "Quelles applications utiliser pour planifier un road trip en voiture électrique en France ?", answer: "Chargemap, PlugShare et A Better Route Planner, complétées par la carte de ma-borne-electrique.com pour repérer une borne disponible en temps réel." },
        ],
        ...cta.fr,
      },
      en: {
        eyebrow: "Road Trip",
        title: "Road-Tripping Through France: How to Charge Your EV Without the Stress",
        excerpt:
          "Connector types, paying without a subscription, useful apps: what you need to know to charge your EV with confidence during a road trip through France.",
        metaTitle: "EV Road Trip in France, 2026: The Complete Charging Guide",
        metaDescription:
          "Fast chargers on French motorways, subscription-free payment, must-have apps and connector types: the complete guide to charging your EV on a road trip through France.",
        body: [
          {
            type: "p",
            text: "More and more drivers, French and foreign alike, cross France by electric car for a summer trip or a long weekend. The charging network has grown a lot in recent years, but a few simple pointers are enough to set off without stress.",
          },
          { type: "h2", text: "A fast-charging network ready for the road" },
          {
            type: "p",
            text: "Nearly every French motorway service area is now equipped with fast or ultra-fast chargers, run by several operators such as Ionity, Fastned, Atlante, TotalEnergies or Electra. Power output generally ranges from 150 to 400 kW, enough for a 20 to 30 minute stop to cover most legs of a trip.",
          },
          { type: "h2", text: "What connector do you need to charge in France?" },
          {
            type: "p",
            text: "France uses the same standard as the rest of Europe: the Type 2 connector for AC charging, and the CCS2 combo connector for DC fast charging. Most European vehicles need no adapter at all. The rare exceptions are some older models fitted with a CHAdeMO connector, worth checking before you leave if your car isn't a recent one.",
          },
          { type: "h2", text: "Charging without a subscription is the norm in France" },
          {
            type: "p",
            text: "Unlike some countries where a subscription or an RFID card is still required, fast-charging operators in France must offer direct payment by bank card, with no subscription or app required, usually via a contactless terminal built into the charger. Handy for a one-off road trip: no need to create an account before you leave.",
          },
          { type: "h2", text: "The apps that make the trip easier" },
          {
            type: "p",
            text: "Even with card payment available, an app makes route planning much easier: Chargemap to locate chargers and read reviews, PlugShare for its international community, or A Better Route Planner to automatically calculate the stops your specific car needs based on the weather. The map on ma-borne-electrique.com then lets you spot an available charger in real time right before you'd need to detour to reach it.",
          },
          { type: "h3", text: "Tips for a smooth road trip" },
          {
            type: "ul",
            items: [
              "Aim to charge between 20% and 80%: charging speed drops noticeably beyond that point.",
              "Plan for a wider safety margin on range in very hot or very cold weather.",
              "Check a charger's real-time availability before detouring to reach it.",
              "During peak season, favor service areas with several chargers to cut down on waiting.",
            ],
          },
          { type: "h2", text: "Prices vary by operator and time of day" },
          {
            type: "p",
            text: "The price per kWh varies noticeably between operators, and sometimes by time of day too. On motorways, fast charging is generally more expensive than charging at home or at a city charger, which reflects the power being delivered. For a one-off trip, paying by card remains the simplest option, even if it costs a little more than a subscriber rate.",
          },
        ],
        faq: [
          { question: "Do I need a subscription to charge my EV in France?", answer: "No, French law requires fast-charging operators to offer direct payment by bank card, with no subscription or app required." },
          { question: "What connector type is used to charge in France?", answer: "The Type 2 connector for AC charging, and the CCS2 combo connector for DC fast charging: the same standard used across the rest of Europe." },
          { question: "Does the fast-charging network cover French motorways well?", answer: "Yes, nearly every French motorway service area is now equipped with fast or ultra-fast chargers, generally rated from 150 to 400 kW." },
          { question: "Which apps are useful for planning an EV road trip in France?", answer: "Chargemap, PlugShare and A Better Route Planner, complemented by the map on ma-borne-electrique.com to spot an available charger in real time." },
        ],
        ...cta.en,
      },
      de: {
        eyebrow: "Reise",
        title: "Roadtrip durch Frankreich: Ihr Elektroauto stressfrei unterwegs laden",
        excerpt:
          "Steckertyp, Bezahlen ohne Abo, nützliche Apps: Was Sie wissen müssen, um Ihr Elektroauto während eines Roadtrips durch Frankreich sorgenfrei zu laden.",
        metaTitle: "Elektroauto-Roadtrip durch Frankreich 2026: Der Ladeleitfaden",
        metaDescription:
          "Schnellladesäulen auf französischen Autobahnen, Bezahlen ohne Abo, unverzichtbare Apps und Steckertypen: der komplette Leitfaden zum Laden Ihres Elektroautos auf einem Roadtrip durch Frankreich.",
        body: [
          {
            type: "p",
            text: "Immer mehr Fahrerinnen und Fahrer, Franzosen wie Ausländer, durchqueren Frankreich für einen Sommerurlaub oder ein langes Wochenende mit dem Elektroauto. Das Ladenetz ist in den letzten Jahren stark gewachsen, doch ein paar einfache Anhaltspunkte reichen, um stressfrei loszufahren.",
          },
          { type: "h2", text: "Ein Schnellladenetz, das für die Reise bereit ist" },
          {
            type: "p",
            text: "Fast jede französische Autobahnraststätte ist heute mit Schnell- oder Ultraschnellladern ausgestattet, betrieben von mehreren Anbietern wie Ionity, Fastned, Atlante, TotalEnergies oder Electra. Die Leistung liegt meist zwischen 150 und 400 kW, sodass ein Stopp von 20 bis 30 Minuten für die meisten Etappen ausreicht.",
          },
          { type: "h2", text: "Welcher Stecker wird zum Laden in Frankreich benötigt?" },
          {
            type: "p",
            text: "Frankreich nutzt denselben Standard wie der Rest Europas: den Typ-2-Stecker für Wechselstromladen und den CCS2-Combo-Stecker für das Schnellladen mit Gleichstrom. Die meisten europäischen Fahrzeuge brauchen daher keinen Adapter. Die seltenen Ausnahmen sind ältere Modelle mit CHAdeMO-Anschluss, das sollten Sie vor der Abfahrt prüfen, falls Ihr Auto nicht ganz neu ist.",
          },
          { type: "h2", text: "Laden ohne Abo ist in Frankreich der Standard" },
          {
            type: "p",
            text: "Anders als in manchen Ländern, in denen weiterhin ein Abo oder eine RFID-Karte nötig ist, müssen Schnellladeanbieter in Frankreich eine direkte Bezahlung per Bankkarte anbieten, ohne Abo oder App, meist über ein kontaktloses Terminal direkt an der Ladesäule. Praktisch für einen einmaligen Roadtrip: Sie müssen vor der Abfahrt kein Konto anlegen.",
          },
          { type: "h2", text: "Die Apps, die die Fahrt erleichtern" },
          {
            type: "p",
            text: "Auch wenn Sie mit Karte bezahlen können, erleichtert eine App die Routenplanung deutlich: Chargemap, um Ladesäulen zu finden und Bewertungen zu lesen, PlugShare mit seiner internationalen Community, oder A Better Route Planner, das automatisch die nötigen Stopps für Ihr Fahrzeug je nach Wetter berechnet. Die Karte von ma-borne-electrique.com zeigt Ihnen dann kurzfristig eine verfügbare Ladesäule, bevor Sie für einen Umweg von Ihrer Route abweichen müssten.",
          },
          { type: "h3", text: "Tipps für einen reibungslosen Roadtrip" },
          {
            type: "ul",
            items: [
              "Laden Sie idealerweise zwischen 20 % und 80 %: darüber hinaus sinkt die Ladegeschwindigkeit spürbar.",
              "Planen Sie bei großer Hitze oder Kälte eine größere Reichweitenreserve ein.",
              "Prüfen Sie die Echtzeit-Verfügbarkeit einer Ladesäule, bevor Sie einen Umweg dorthin machen.",
              "Bevorzugen Sie in der Hochsaison Raststätten mit mehreren Ladesäulen, um Wartezeiten zu vermeiden.",
            ],
          },
          { type: "h2", text: "Die Preise unterscheiden sich je nach Anbieter und Uhrzeit" },
          {
            type: "p",
            text: "Der Preis pro kWh unterscheidet sich spürbar zwischen den Anbietern und teils auch nach Tageszeit. Auf der Autobahn ist Schnellladen in der Regel teurer als zu Hause oder an einer städtischen Ladesäule, was die gelieferte Leistung widerspiegelt. Für eine einmalige Fahrt bleibt die Kartenzahlung die einfachste Lösung, auch wenn sie etwas teurer ist als ein Abo-Tarif.",
          },
        ],
        faq: [
          { question: "Brauche ich ein Abo, um mein Elektroauto in Frankreich zu laden?", answer: "Nein, das französische Recht verpflichtet Schnellladeanbieter zu einer direkten Bezahlung per Bankkarte, ohne Abo oder App." },
          { question: "Welcher Steckertyp wird zum Laden in Frankreich verwendet?", answer: "Der Typ-2-Stecker für Wechselstromladen und der CCS2-Combo-Stecker für Schnellladen mit Gleichstrom, derselbe Standard wie im übrigen Europa." },
          { question: "Deckt das Schnellladenetz die französischen Autobahnen gut ab?", answer: "Ja, fast jede französische Autobahnraststätte ist inzwischen mit Schnell- oder Ultraschnellladern ausgestattet, meist mit 150 bis 400 kW Leistung." },
          { question: "Welche Apps sind für die Planung eines Elektroauto-Roadtrips in Frankreich nützlich?", answer: "Chargemap, PlugShare und A Better Route Planner, ergänzt durch die Karte von ma-borne-electrique.com, um in Echtzeit eine verfügbare Ladesäule zu finden." },
        ],
        ...cta.de,
      },
      es: {
        eyebrow: "Viaje",
        title: "Road trip por Francia: cómo recargar tu coche eléctrico sin sorpresas",
        excerpt:
          "Tipo de conector, pago sin abono, aplicaciones útiles: lo que hay que saber para recargar tu coche eléctrico con tranquilidad durante un road trip por Francia.",
        metaTitle: "Road trip en coche eléctrico por Francia 2026: guía de recarga",
        metaDescription:
          "Cargadores rápidos en autopistas francesas, pago sin abono, aplicaciones imprescindibles y tipos de conector: la guía completa para recargar tu coche eléctrico en un road trip por Francia.",
        body: [
          {
            type: "p",
            text: "Cada vez más conductores, franceses y extranjeros, recorren Francia en coche eléctrico durante un verano o un fin de semana largo. La red de recarga ha crecido mucho en los últimos años, pero basta con conocer unos pocos puntos clave para salir sin estrés.",
          },
          { type: "h2", text: "Una red de carga rápida lista para la carretera" },
          {
            type: "p",
            text: "Casi todas las áreas de servicio de las autopistas francesas cuentan ya con cargadores rápidos o ultrarrápidos, operados por varias empresas como Ionity, Fastned, Atlante, TotalEnergies o Electra. La potencia suele oscilar entre 150 y 400 kW, suficiente para que una parada de 20 a 30 minutos cubra la mayoría de los tramos de un viaje.",
          },
          { type: "h2", text: "¿Qué conector necesitas para recargar en Francia?" },
          {
            type: "p",
            text: "Francia utiliza el mismo estándar que el resto de Europa: el conector Tipo 2 para la carga en corriente alterna, y el conector combinado CCS2 para la carga rápida en corriente continua. La mayoría de los vehículos europeos no necesitan ningún adaptador. Las escasas excepciones son algunos modelos más antiguos con conector CHAdeMO, conviene comprobarlo antes de salir si tu coche no es muy reciente.",
          },
          { type: "h2", text: "Recargar sin abono es la norma en Francia" },
          {
            type: "p",
            text: "A diferencia de otros países donde sigue siendo necesario un abono o una tarjeta RFID, los operadores de carga rápida en Francia están obligados a ofrecer el pago directo con tarjeta bancaria, sin abono ni aplicación obligatoria, normalmente mediante un terminal sin contacto integrado en el propio cargador. Muy práctico para un road trip puntual: no hace falta crear ninguna cuenta antes de salir.",
          },
          { type: "h2", text: "Las aplicaciones que facilitan el trayecto" },
          {
            type: "p",
            text: "Aunque puedas pagar con tarjeta, una aplicación facilita mucho la planificación de la ruta: Chargemap para localizar cargadores y leer opiniones, PlugShare por su comunidad internacional, o A Better Route Planner para calcular automáticamente las paradas que necesita tu vehículo según el clima. El mapa de ma-borne-electrique.com te permite después localizar un cargador disponible en tiempo real justo antes de desviarte de tu ruta.",
          },
          { type: "h3", text: "Consejos para un road trip sin contratiempos" },
          {
            type: "ul",
            items: [
              "Recarga idealmente entre el 20 % y el 80 %: la velocidad de carga se reduce notablemente por encima de ese umbral.",
              "Prevé un margen de autonomía mayor si hace mucho calor o mucho frío.",
              "Comprueba la disponibilidad en tiempo real de un cargador antes de desviarte para llegar hasta él.",
              "En temporada alta, elige áreas de servicio con varios cargadores para reducir la espera.",
            ],
          },
          { type: "h2", text: "Los precios varían según el operador y la hora" },
          {
            type: "p",
            text: "El precio por kWh varía notablemente de un operador a otro, y a veces también según la hora del día. En autopista, la carga rápida suele ser más cara que en casa o en un cargador urbano, lo que refleja la potencia entregada. Para un trayecto puntual, pagar con tarjeta sigue siendo la opción más sencilla, aunque sea algo más cara que una tarifa de abonado.",
          },
        ],
        faq: [
          { question: "¿Necesito un abono para recargar mi coche eléctrico en Francia?", answer: "No, la ley francesa obliga a los operadores de carga rápida a ofrecer el pago directo con tarjeta bancaria, sin abono ni aplicación obligatoria." },
          { question: "¿Qué tipo de conector se usa para recargar en Francia?", answer: "El conector Tipo 2 para la carga en corriente alterna, y el conector combinado CCS2 para la carga rápida en corriente continua: el mismo estándar que en el resto de Europa." },
          { question: "¿La red de carga rápida cubre bien las autopistas francesas?", answer: "Sí, casi todas las áreas de servicio de las autopistas francesas cuentan ya con cargadores rápidos o ultrarrápidos, generalmente entre 150 y 400 kW." },
          { question: "¿Qué aplicaciones son útiles para planificar un road trip en coche eléctrico por Francia?", answer: "Chargemap, PlugShare y A Better Route Planner, junto con el mapa de ma-borne-electrique.com para localizar un cargador disponible en tiempo real." },
        ],
        ...cta.es,
      },
    },
  },
  {
    slug: "prolonger-duree-vie-batterie-voiture-electrique",
    publishedAt: "2026-09-10",
    image: {
      src: "/blog/prolonger-duree-vie-batterie-voiture-electrique.jpg",
      alt: {
        fr: "Câble de recharge branché sur la prise d'une voiture électrique",
        en: "A charging cable plugged into an electric car's charging port",
        de: "Ein Ladekabel, das an der Ladebuchse eines Elektroautos angeschlossen ist",
        es: "Un cable de recarga conectado a la toma de un coche eléctrico",
      },
      credit: {
        name: "Pamsimhaho",
        url: "https://commons.wikimedia.org/wiki/File:EV_Type2_Charging_Cable.jpg",
        license: "CC0",
      },
    },
    content: {
      fr: {
        eyebrow: "Conseils pratiques",
        title: "Batterie de voiture électrique : les bons réflexes pour la faire durer",
        excerpt:
          "Charge quotidienne, recharge rapide, températures extrêmes : les habitudes qui font une vraie différence sur la durée de vie d'une batterie.",
        metaTitle: "Faire durer la batterie de sa voiture électrique : le guide",
        metaDescription:
          "Niveau de charge quotidien, recharge rapide, stockage longue durée, températures extrêmes : les bons réflexes pour ralentir l'usure d'une batterie de voiture électrique.",
        body: [
          {
            type: "p",
            text: "Comme toute batterie lithium-ion, celle d'une voiture électrique s'use naturellement avec le temps et les cycles de charge. Cette usure est inévitable, mais quelques habitudes simples permettent de la ralentir sensiblement sur plusieurs années d'utilisation.",
          },
          { type: "h2", text: "Éviter les charges à 100 % au quotidien" },
          {
            type: "p",
            text: "La plupart des véhicules et de leurs applications permettent de plafonner la charge, souvent entre 80 et 90 %. Réserver les 100 % aux longs trajets, plutôt que d'en faire une habitude quotidienne, limite le temps passé par la batterie dans sa zone de tension la plus contraignante.",
          },
          { type: "h2", text: "Ne pas laisser la batterie immobilisée à un niveau extrême" },
          {
            type: "p",
            text: "Si le véhicule doit rester à l'arrêt plusieurs semaines, mieux vaut le laisser autour de 50 à 60 % de charge plutôt qu'à 0 % ou 100 %. Un niveau intermédiaire limite le stress chimique sur la batterie pendant une immobilisation prolongée.",
          },
          { type: "h2", text: "Limiter les recharges rapides répétées" },
          {
            type: "p",
            text: "La recharge rapide en courant continu génère plus de chaleur que la recharge lente à domicile, ce qui accélère un peu l'usure sur le long terme. Un usage occasionnel, en trajet, n'a pas d'impact significatif : c'est surtout un usage exclusif et répété au quotidien qui pèse sur la durée de vie de la batterie.",
          },
          { type: "h2", text: "Protéger la batterie des températures extrêmes" },
          {
            type: "p",
            text: "Le grand froid comme la forte chaleur sollicitent davantage la batterie. Se garer à l'ombre ou au garage lorsque c'est possible, et activer le préconditionnement avant une recharge rapide par temps froid, aide à limiter cet effet sur la durée.",
          },
          { type: "h3", text: "Les bons réflexes en résumé" },
          {
            type: "ul",
            items: [
              "Plafonner la charge quotidienne autour de 80-90 %, réserver 100 % aux longs trajets.",
              "Éviter de laisser le véhicule immobilisé longtemps proche de 0 % ou 100 %.",
              "Privilégier la recharge lente pour l'usage courant, réserver la recharge rapide aux déplacements.",
              "Garer si possible à l'abri des températures extrêmes.",
              "Activer le préconditionnement avant une recharge rapide par temps froid.",
            ],
          },
          { type: "h2", text: "Une dégradation lente, déjà anticipée par les constructeurs" },
          {
            type: "p",
            text: "Ces habitudes restent des optimisations, pas des obligations : les systèmes de gestion de batterie modernes et les garanties constructeur, généralement autour de 8 ans ou 160 000 km, sont conçus pour une large marge d'usage réel, y compris sans habitudes parfaites.",
          },
        ],
        faq: [
          { question: "Faut-il éviter de recharger sa voiture électrique à 100 % tous les jours ?", answer: "Idéalement oui : mieux vaut plafonner la charge quotidienne autour de 80-90 % et réserver les 100 % aux longs trajets." },
          { question: "La recharge rapide abîme-t-elle la batterie ?", answer: "Un peu plus que la recharge lente sur le long terme, mais un usage occasionnel en trajet n'a pas d'impact significatif : c'est l'usage exclusif et répété qui pèse le plus." },
          { question: "Comment bien conserver la batterie si la voiture reste longtemps à l'arrêt ?", answer: "Il vaut mieux la stocker autour de 50 à 60 % de charge plutôt qu'à 0 % ou 100 % pour limiter le stress chimique pendant l'immobilisation." },
          { question: "Les températures extrêmes affectent-elles la durée de vie de la batterie ?", answer: "Oui, une exposition prolongée au grand froid ou à la forte chaleur peut accélérer l'usure : se garer à l'abri et préconditionner la batterie avant une recharge rapide par temps froid limitent cet effet." },
        ],
        ...cta.fr,
      },
      en: {
        eyebrow: "Practical Tips",
        title: "EV Battery Care: Habits That Actually Make It Last Longer",
        excerpt:
          "Daily charge limits, fast charging, extreme temperatures: the habits that make a real difference to how long an EV battery lasts.",
        metaTitle: "How to Make Your EV Battery Last Longer: The Guide",
        metaDescription:
          "Daily charge level, fast charging, long-term storage, extreme temperatures: the habits that slow down wear on an electric car's battery over time.",
        body: [
          {
            type: "p",
            text: "Like any lithium-ion battery, an EV's battery wears down naturally with time and charge cycles. That wear is unavoidable, but a few simple habits can noticeably slow it down over years of use.",
          },
          { type: "h2", text: "Avoid charging to 100% every day" },
          {
            type: "p",
            text: "Most vehicles and their apps let you cap charging, often between 80% and 90%. Saving 100% for long trips, rather than making it a daily habit, limits the time the battery spends in its most demanding voltage range.",
          },
          { type: "h2", text: "Don't leave the battery parked at an extreme level" },
          {
            type: "p",
            text: "If the car will sit unused for several weeks, it's better to leave it around 50% to 60% charge rather than at 0% or 100%. A mid-range level reduces chemical stress on the battery during extended downtime.",
          },
          { type: "h2", text: "Limit repeated fast charging" },
          {
            type: "p",
            text: "DC fast charging generates more heat than slow charging at home, which speeds up wear slightly over the long run. Occasional use on a trip has no meaningful impact: it's mainly exclusive, repeated daily use that weighs on battery lifespan.",
          },
          { type: "h2", text: "Protect the battery from extreme temperatures" },
          {
            type: "p",
            text: "Both severe cold and intense heat put extra strain on the battery. Parking in the shade or in a garage when possible, and turning on preconditioning before a fast charge in cold weather, helps limit that effect over time.",
          },
          { type: "h3", text: "The key habits, at a glance" },
          {
            type: "ul",
            items: [
              "Cap daily charging around 80-90%, and save 100% for long trips.",
              "Avoid leaving the car parked for long stretches near 0% or 100%.",
              "Favor slow charging for everyday use, and save fast charging for trips.",
              "Park out of extreme heat or cold whenever possible.",
              "Turn on preconditioning before a fast charge in cold weather.",
            ],
          },
          { type: "h2", text: "Slow degradation, already accounted for by manufacturers" },
          {
            type: "p",
            text: "These habits are optimizations, not requirements: modern battery management systems and manufacturer warranties, typically around 8 years or 160,000km, are designed with a wide margin for real-world use, even without perfect habits.",
          },
        ],
        faq: [
          { question: "Should I avoid charging my EV to 100% every day?", answer: "Ideally yes: it's better to cap daily charging around 80-90% and save 100% for long trips." },
          { question: "Does fast charging damage the battery?", answer: "A little more than slow charging over the long run, but occasional use on a trip has no meaningful impact: it's exclusive, repeated use that weighs the most." },
          { question: "How should I store the battery if the car sits unused for a long time?", answer: "It's best to store it around 50% to 60% charge rather than at 0% or 100%, to limit chemical stress during the downtime." },
          { question: "Do extreme temperatures affect battery lifespan?", answer: "Yes, prolonged exposure to severe cold or heat can speed up wear: parking out of extreme temperatures and preconditioning before a fast charge in cold weather help limit that effect." },
        ],
        ...cta.en,
      },
      de: {
        eyebrow: "Praktische Tipps",
        title: "Elektroauto-Batterie schonen: Diese Gewohnheiten machen wirklich einen Unterschied",
        excerpt:
          "Tägliches Ladelimit, Schnellladen, extreme Temperaturen: die Gewohnheiten, die wirklich einen Unterschied für die Lebensdauer einer Elektroauto-Batterie machen.",
        metaTitle: "Elektroauto-Batterie länger halten lassen: Der Leitfaden",
        metaDescription:
          "Tägliches Ladelevel, Schnellladen, Langzeitlagerung, extreme Temperaturen: die Gewohnheiten, die den Verschleiß einer Elektroauto-Batterie im Lauf der Zeit verlangsamen.",
        body: [
          {
            type: "p",
            text: "Wie jede Lithium-Ionen-Batterie verschleißt auch die eines Elektroautos mit der Zeit und den Ladezyklen ganz natürlich. Dieser Verschleiß lässt sich nicht vermeiden, doch ein paar einfache Gewohnheiten können ihn über Jahre der Nutzung spürbar verlangsamen.",
          },
          { type: "h2", text: "Nicht jeden Tag auf 100 % laden" },
          {
            type: "p",
            text: "Bei den meisten Fahrzeugen und ihren Apps lässt sich die Ladung begrenzen, oft auf 80 bis 90 Prozent. Wenn Sie 100 Prozent langen Fahrten vorbehalten, statt es zur täglichen Gewohnheit zu machen, verbringt die Batterie weniger Zeit in ihrem anspruchsvollsten Spannungsbereich.",
          },
          { type: "h2", text: "Die Batterie nicht dauerhaft auf einem Extremniveau stehen lassen" },
          {
            type: "p",
            text: "Steht das Auto mehrere Wochen ungenutzt, ist es besser, es bei etwa 50 bis 60 Prozent Ladung stehen zu lassen statt bei 0 oder 100 Prozent. Ein mittlerer Ladestand reduziert die chemische Belastung der Batterie während der längeren Standzeit.",
          },
          { type: "h2", text: "Wiederholtes Schnellladen begrenzen" },
          {
            type: "p",
            text: "Schnellladen mit Gleichstrom erzeugt mehr Wärme als langsames Laden zu Hause, was den Verschleiß langfristig etwas beschleunigt. Gelegentliches Laden unterwegs hat keine spürbare Auswirkung: Vor allem der ausschließliche, wiederholte tägliche Einsatz belastet die Lebensdauer der Batterie.",
          },
          { type: "h2", text: "Die Batterie vor extremen Temperaturen schützen" },
          {
            type: "p",
            text: "Sowohl starke Kälte als auch große Hitze belasten die Batterie zusätzlich. Wenn möglich im Schatten oder in der Garage parken und vor einer Schnellladung bei kaltem Wetter das Vorkonditionieren aktivieren, hilft, diesen Effekt langfristig zu begrenzen.",
          },
          { type: "h3", text: "Die wichtigsten Gewohnheiten im Überblick" },
          {
            type: "ul",
            items: [
              "Die tägliche Ladung auf etwa 80-90 % begrenzen, 100 % langen Fahrten vorbehalten.",
              "Das Auto nicht lange bei nahezu 0 % oder 100 % stehen lassen.",
              "Für den Alltag langsames Laden bevorzugen, Schnellladen für Fahrten aufheben.",
              "Wenn möglich vor extremer Hitze oder Kälte geschützt parken.",
              "Vor einer Schnellladung bei kaltem Wetter das Vorkonditionieren aktivieren.",
            ],
          },
          { type: "h2", text: "Ein langsamer Verschleiß, den Hersteller bereits einplanen" },
          {
            type: "p",
            text: "Diese Gewohnheiten sind Optimierungen, keine Pflicht: Moderne Batteriemanagementsysteme und Herstellergarantien, meist rund 8 Jahre oder 160.000 km, sind mit einem großzügigen Spielraum für den realen Alltag ausgelegt, auch ohne perfekte Gewohnheiten.",
          },
        ],
        faq: [
          { question: "Sollte ich mein Elektroauto nicht jeden Tag auf 100 % laden?", answer: "Idealerweise ja: Besser ist es, die tägliche Ladung auf etwa 80-90 % zu begrenzen und 100 % langen Fahrten vorzubehalten." },
          { question: "Schadet Schnellladen der Batterie?", answer: "Etwas mehr als langsames Laden auf lange Sicht, aber gelegentliches Laden unterwegs hat keine spürbare Auswirkung: Vor allem ausschließliche, wiederholte Nutzung belastet am meisten." },
          { question: "Wie lagere ich die Batterie am besten, wenn das Auto lange ungenutzt steht?", answer: "Am besten bei etwa 50 bis 60 % Ladung statt bei 0 oder 100 %, um die chemische Belastung während der Standzeit zu begrenzen." },
          { question: "Beeinflussen extreme Temperaturen die Lebensdauer der Batterie?", answer: "Ja, anhaltende starke Kälte oder Hitze kann den Verschleiß beschleunigen: geschützt parken und vor einer Schnellladung bei Kälte vorkonditionieren begrenzen diesen Effekt." },
        ],
        ...cta.de,
      },
      es: {
        eyebrow: "Consejos prácticos",
        title: "Batería del coche eléctrico: los hábitos que realmente alargan su vida",
        excerpt:
          "Límite de carga diario, carga rápida, temperaturas extremas: los hábitos que marcan una diferencia real en la duración de la batería.",
        metaTitle: "Cómo alargar la vida de la batería de tu coche eléctrico: la guía",
        metaDescription:
          "Nivel de carga diario, carga rápida, almacenamiento prolongado, temperaturas extremas: los hábitos que ralentizan el desgaste de la batería de un coche eléctrico.",
        body: [
          {
            type: "p",
            text: "Como cualquier batería de iones de litio, la de un coche eléctrico se desgasta de forma natural con el tiempo y los ciclos de carga. Ese desgaste es inevitable, pero unos pocos hábitos sencillos pueden ralentizarlo notablemente a lo largo de años de uso.",
          },
          { type: "h2", text: "Evitar cargar al 100 % todos los días" },
          {
            type: "p",
            text: "La mayoría de los vehículos y sus aplicaciones permiten limitar la carga, a menudo entre el 80 % y el 90 %. Reservar el 100 % para los trayectos largos, en lugar de convertirlo en un hábito diario, reduce el tiempo que la batería pasa en su rango de tensión más exigente.",
          },
          { type: "h2", text: "No dejar la batería parada en un nivel extremo" },
          {
            type: "p",
            text: "Si el coche va a estar varias semanas sin usarse, conviene dejarlo con un 50-60 % de carga en lugar de al 0 % o al 100 %. Un nivel intermedio reduce el estrés químico de la batería durante una parada prolongada.",
          },
          { type: "h2", text: "Limitar las recargas rápidas repetidas" },
          {
            type: "p",
            text: "La carga rápida en corriente continua genera más calor que la carga lenta en casa, lo que acelera algo el desgaste a largo plazo. Un uso ocasional durante un viaje no tiene un impacto significativo: es sobre todo el uso exclusivo y repetido a diario lo que más pesa en la vida útil de la batería.",
          },
          { type: "h2", text: "Proteger la batería de las temperaturas extremas" },
          {
            type: "p",
            text: "Tanto el frío intenso como el calor fuerte exigen más a la batería. Aparcar a la sombra o en garaje cuando sea posible, y activar el precondicionamiento antes de una carga rápida con frío, ayuda a limitar este efecto con el tiempo.",
          },
          { type: "h3", text: "Los hábitos clave, de un vistazo" },
          {
            type: "ul",
            items: [
              "Limita la carga diaria a un 80-90 % aproximadamente, y reserva el 100 % para trayectos largos.",
              "Evita dejar el coche parado mucho tiempo cerca del 0 % o del 100 %.",
              "Prioriza la carga lenta para el uso diario y reserva la carga rápida para los viajes.",
              "Aparca a resguardo de temperaturas extremas siempre que puedas.",
              "Activa el precondicionamiento antes de una carga rápida con frío.",
            ],
          },
          { type: "h2", text: "Un desgaste lento, ya previsto por los fabricantes" },
          {
            type: "p",
            text: "Estos hábitos son optimizaciones, no obligaciones: los sistemas modernos de gestión de batería y las garantías de los fabricantes, normalmente en torno a 8 años o 160.000 km, están pensados con un amplio margen para el uso real, incluso sin hábitos perfectos.",
          },
        ],
        faq: [
          { question: "¿Debo evitar cargar mi coche eléctrico al 100 % todos los días?", answer: "Idealmente sí: es mejor limitar la carga diaria a un 80-90 % aproximadamente y reservar el 100 % para los trayectos largos." },
          { question: "¿La carga rápida daña la batería?", answer: "Un poco más que la carga lenta a largo plazo, pero un uso ocasional durante un viaje no tiene un impacto significativo: lo que más pesa es el uso exclusivo y repetido." },
          { question: "¿Cómo conservar bien la batería si el coche va a estar mucho tiempo parado?", answer: "Es mejor guardarlo con un 50-60 % de carga en lugar de al 0 % o al 100 %, para limitar el estrés químico durante la parada." },
          { question: "¿Afectan las temperaturas extremas a la vida útil de la batería?", answer: "Sí, una exposición prolongada a mucho frío o calor puede acelerar el desgaste: aparcar a resguardo y precondicionar la batería antes de una carga rápida con frío ayudan a limitar ese efecto." },
        ],
        ...cta.es,
      },
    },
  },
];
