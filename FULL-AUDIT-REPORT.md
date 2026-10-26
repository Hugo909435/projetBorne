# Rapport d'Audit SEO Complet — ma-borne-electrique.com

- **Site audité** : `https://ma-borne-electrique.com`
- **Date de l'audit** : 26 Octobre 2026
- **Score Global** : **84/100** (Rating: *Good*, Potentiel de croissance: *Élevé*)
- **Score de Confiance** : **Élevé** (Données Search Console réelles, crawl du site en production, analyse du code source Next.js)
- **Dashboard Interactif généré** : [`SEO-REPORT.html`](./SEO-REPORT.html)

---

## 1. Résumé Exécutif & Diagnostic du Plafond de Trafic

Le site **ma-borne-electrique.com** possède une excellente base technique (Next.js App Router, SSR rapide, design épuré, `llms.txt` parfait à 100/100, données officielles IRVE France et BNetzA Allemagne).

Cependant, le trafic stagne actuellement sur un palier (quelques dizaines de clics par mois malgré des milliers d'impressions) pour **trois raisons fondamentales** :

1. **Le Piège Programmatiquue & Indexation bloquée (80 % du site est fantôme)** :
   - Le sitemap compte **844 URLs** (136 articles, 576 pages régionales, 52 pages modèles, 56 pages réseaux, 4 langues).
   - Plus de **90 % des pages régionales/départementales ne génèrent aucune impression** dans Google Search Console. Google détecte un template statistique répété (thin content perçu) et refuse d'indexer la longue traîne sans signaux de valeur ajoutée locale unique.
2. **Déficit d'Autorité de Domaine (PageRank ~0)** :
   - Les articles du blog se positionnent entre la **position 30 et 80** sur des requêtes à fort volume ("elektro ladestationen frankreich", "e auto reichweite winter", "abonnement borne de recharge").
   - Sans backlinks d'autorité éditoriale (presse spécialisée, blogs auto, institutions), Google hésite à pousser le site dans le Top 10.
3. **Fuite de PageRank et Maillage Interne Défaillant** :
   - Redirection temporaire 307 de la racine `/` vers `/en` ou `/fr` (dilution du PageRank externe).
   - Plus de **184 pages quasi-orphelines** identifiées par l'audit technique.
   - Le footer n'intègre même pas le lien vers l'annuaire `/bornes-recharge` ni vers le hub des véhicules `/recharge`.
   - Aucun maillage contextuel entre les articles de blog voyage/coût et les départements ou réseaux associés.

---

## 2. Tableau Récapitulatif des Scores

| Domaine d'Audit | Poids | Score | Statut | Commentaire |
| :--- | :---: | :---: | :---: | :--- |
| **Technique & Infrastructure** | 25% | **88/100** | ✅ Bon | Rapide, SSR propre, HTTPS, mais HSTS manquant et 307 sur `/`. |
| **Maillage Interne & Architecture** | 15% | **60/100** | ⚠️ Alerte | 184 pages orphelines, footer incomplet, manque de hubs pays. |
| **Contenu & Indexabilité Programmatiquue**| 20% | **65/100** | ⚠️ Alerte | Bon blog (32 posts), mais 572 pages régionales sous-indexées. |
| **Données Structurées (Schema.org)** | 15% | **90/100** | ✅ Bon | Schema complet (Organization, Breadcrumbs, WebApp). |
| **SEO On-Page & Balisage** | 10% | **85/100** | ✅ Bon | Balises H1/H2 présentes, titres OG/Twitter parfois trop longs. |
| **Recherche IA & GEO (AEO)** | 10% | **95/100** | 🚀 Excellent | `llms.txt` exemplaire (100/100), bots IA bien autorisés. |
| **Profil de Liens & Autorité** | 5% | **30/100** | 🔴 Critique | Manque crucial de domaines référents légitimes. |

---

## 3. Matrice Détaillée des Constats et Preuves

### A. Architecture Technique & Crawl

| Sévérité | Confiance | Constat | Preuve / Éléments observés | Impact SEO | Correction Requise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 🔴 **Critique** | **Confirmé** | Redirection temporaire HTTP 307 sur la racine | `https://ma-borne-electrique.com` renvoie un 307 vers `/en` ou `/fr` selon l'en-tête `Accept-Language`. Googlebot crawl depuis les USA et est routé vers `/en`. | Perte de transfert de PageRank pour les liens pointant vers la racine. Confusion d'indexation pour Googlebot. | Configurer `localeDetection: false` ou forcer une redirection permanente 308/301, ou servir une page d'accueil pivot. |
| ⚠️ **Warning** | **Confirmé** | En-tête HSTS manquant | `Strict-Transport-Security` absent dans `next.config.ts`. Score Headers: 80/100. | Légère pénalité de confiance navigateur et signal technique de sécurité. | Ajouter `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` dans `headers()` de `next.config.ts`. |
| ⚠️ **Warning** | **Confirmé** | Robots IA non explicitement déclarés | `robots_checker.py` signale que `Applebot-Extended`, `Bytespider`, `FacebookBot`, `Amazonbot` ne sont pas explicités dans `robots.ts`. | Perte potentielle de citation dans les moteurs IA émergents (Apple Intelligence, etc.). | Ajouter les entrées `allow: "/"` pour ces User-Agents dans `src/app/robots.ts`. |
| ⚠️ **Warning** | **Confirmé** | Titres Open Graph & Twitter trop longs | `og:title` et `twitter:title` dépassent 79 caractères sur la page d'accueil (limite recommandée : 60-70). | Troncature dans les snippets sociaux et prévisualisations. | Réduire le format du titre global à max 60 caractères (ex: `MaBorneÉlectrique : Carte & Bornes de Recharge en France`). |

### B. Indexation & Pages Programmatiquues (Le Levier N°1)

| Sévérité | Confiance | Constat | Preuve / Éléments observés | Impact SEO | Correction Requise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 🔴 **Critique** | **Confirmé** | 572 pages géographiques non indexées ou sans trafic | 11/11 URLs départementales testées dans GSC sont "Inconnues de Google" ou sans clics. Word count moyen : ~500-670 mots de données agrégées. | 68 % du sitemap est ignoré par Google. Dilution inutile du budget de crawl. | **Plan d'attaque régional** : créer 4 hubs pays (`/fr/bornes-recharge/france`, `/allemagne`, etc.), enrichir massivement les 30 plus gros départements avec des POI réels, autoroutes, et conseils locaux. Mettre les micro-départements en `noindex` temporaire si Google refuse de les crawler. |
| ⚠️ **Warning** | **Confirmé** | Maillage interne plat sans hiérarchie de clusters | `/bornes-recharge` liste 170+ liens bruts à la suite. Aucun lien contextuel depuis les articles de blog ou la page d'accueil. | Google ne comprend pas la hiérarchie thématique et disperse la puissance de lien. | Structurer en silos : Blog Voyage France ↔ Hub France ↔ Top Départements (75, 13, 69, 59, 33) ↔ Réseaux (Ionity, Tesla, Total). |
| ⚠️ **Warning** | **Confirmé** | 184 pages orphelines ou sous-liées | Analyse du graphe interne : de nombreuses pages n'ont qu'un seul lien entrant (souvent le sitemap). | Les robots de crawl délaissent ces pages. | Ajouter un "Mega Footer" SEO catégorisé (Top départements, Guides indispensables, Modèles populaires). |

### C. Contenu, Intention de Recherche & Mots-Clés

| Sévérité | Confiance | Constat | Preuve / Éléments observés | Impact SEO | Correction Requise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| ⚠️ **Warning** | **Confirmé** | Positions 30 à 80 sur les requêtes phares | GSC : "elektro ladestationen frankreich" (pos 59-76), "e auto reichweite winter" (pos 28-32), "abonnement borne de recharge" (pos 42). | Fort potentiel d'impressions mais CTR < 2 % car le site est en 3e ou 4e page. | Réoptimiser les balises Title, les H2, ajouter des tableaux synthétiques et des données chiffrées "Quick Answers" pour viser le Top 5 et les Featured Snippets. |
| ℹ️ **Opportunité** | **Élevé** | Absence de comparatif interactif de badges/cartes de recharge | Les requêtes "meilleure carte recharge electrique", "comparatif badge recharge" ont un volume d'intention d'achat maximal. | Manque à gagner énorme en trafic qualifié et en affiliation (Ulys, Chargemap, Shell). | Publier un grand comparateur interactif de cartes/badges avec simulateur de coût d'abonnement selon les km parcourus. |
| ℹ️ **Opportunité** | **Élevé** | Pages modèles EV (`/recharge/[model]`) sous-exploitées | 13 modèles créés (Peugeot e-208, Tesla Model 3, Renault Zoe, etc.). | Les conducteurs cherchent spécifiquement : "Temps de recharge [Modèle] sur prise domestique vs borne rapide". | Ajouter un tableau calculé automatique : temps et coût d'une recharge 20-80% selon la borne (domestique 2.3kW, Green'up 3.7kW, Wallbox 7.4kW, DC 50kW, Ultra-rapide 150kW+). |

### D. Autorité Externe & Netlinking (Le Facteur Bloquant)

| Sévérité | Confiance | Constat | Preuve / Éléments observés | Impact SEO | Correction Requise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 🔴 **Critique** | **Confirmé** | Aucun backlink éditorial légitime | Profil de liens externe : uniquement quelques liens de scrapers/spam détectés dans GSC. Zéro lien de presse, zéro blog auto. | Sans autorité, Google refuse de faire passer les articles de la page 4 à la page 1. | **Campagne Digital PR** : exploiter les données officielles IRVE pour créer le "Baromètre National de la Recharge" avec infographie téléchargeable, envoyé aux journalistes (Automobile Propre, Frandroid, presse locale). |

---

## 4. Ce qui est Déjà Excellent sur le Site (Les Forces)

1. **Recherche IA / LLMs (Score 100/100)** : Le fichier `/llms.txt` est remarquablement rédigé, bien indexé et parfaitement conforme. Le site est idéalement paré pour Perplexity, ChatGPT Search et Claude.
2. **Données Officielles Embarquées** : Utiliser la base nationale IRVE (data.gouv.fr) et le registre allemand de la Bundesnetzagentur donne un avantage de données massif par rapport aux sites concurrents basés sur des données incomplètes.
3. **Qualité Rédactionnelle du Blog** : Les articles (32 articles) sont longs, documentés, sans jargon superflu et répondent à de vraies questions d'utilisateurs.
4. **Performance Next.js** : Codebase moderne, rendu serveur rapide, polices optimisées, absence de trackers lourds.

---

## 5. Synthèse & Prochaines Étapes

Pour faire décoller le site de **100 clics/mois à 5 000+ clics/mois**, l'enjeu ne réside pas dans la rédaction de 100 articles supplémentaires dans le vide, mais dans :
1. **Le désengorgement et la valorisation du maillage interne** (sortir les pages régionales et modèles de l'ombre).
2. **La réoptimisation chirurgicale des pages déjà positionnées en 2e/3e page**.
3. **L'acquisition de 10 à 20 liens d'autorité** grâce à des études chiffrées basées sur vos données IRVE.

Consultez le plan d'action opérationnel immédiat dans [`ACTION-PLAN.md`](./ACTION-PLAN.md).
