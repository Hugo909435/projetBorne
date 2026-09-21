# ma-borne-electrique.com

Site de localisation des bornes de recharge électrique en France, construit
avec Next.js (App Router). Carte interactive alimentée par
[Open Charge Map](https://openchargemap.org), pages villes, guide des
connecteurs, et structure SEO/GEO (sitemap, robots, `llms.txt`, JSON-LD).

## Démarrer en local

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Clé Open Charge Map (obligatoire pour afficher des bornes)

Depuis leur changement de politique d'accès, Open Charge Map exige une clé
API même pour les requêtes en lecture seule. Sans clé, le site fonctionne
normalement mais la carte reste vide (0 borne).

1. Créez une clé gratuite (quelques secondes, sans validation manuelle) sur
   https://openchargemap.org/site/developerinfo
2. Copiez `.env.example` vers `.env.local`
3. Renseignez `OCM_API_KEY=votre_clé`
4. Redémarrez `npm run dev`

En production (Vercel ou autre), ajoutez `OCM_API_KEY` dans les variables
d'environnement du projet.

## Données officielles (France et Allemagne)

Pour la France et l'Allemagne, la carte et les pages régionales n'utilisent pas
Open Charge Map (trop incomplet) mais les registres officiels ouverts :

| Pays | Source | Licence | Commande |
|---|---|---|---|
| France | Base nationale des IRVE (data.gouv.fr / transport.data.gouv.fr) | Licence Ouverte 2.0 | `npm run generate:irve` (~120 Mo) |
| Allemagne | Ladesäulenregister de la Bundesnetzagentur | CC BY 4.0 | `npm run generate:de` (~55 Mo) |

Chaque script Python (bibliothèque standard uniquement) télécharge le registre
et écrit, commités dans le dépôt :

- `src/data/*-stats*.json` : statistiques par département / Bundesland (pages) ;
- `data/irve/` et `data/de/` : toutes les stations en JSON compressé (carte),
  lues par le serveur au premier appel (`src/lib/officialStations.ts`) puis
  gardées en mémoire. Elles sont embarquées dans `.next/standalone` grâce à
  `outputFileTracingIncludes` (`next.config.ts`).

À relancer une fois par mois environ, puis à commiter les fichiers générés.
`src/lib/stationSource.ts` choisit la source : registre officiel pour FR et DE,
Open Charge Map pour tout le reste, et se replie sur Open Charge Map si un
fichier est illisible. Le registre français est une version beta appelée à
remplacer l'ancienne consolidation data.gouv.fr, supprimée le 31/12/2026 : si
l'URL change, mettre à jour `SOURCE_URL` dans `scripts/generate_irve_data.py`.

L'Espagne et le Royaume-Uni restent sur Open Charge Map
(`npm run generate:region-stats`, lancé automatiquement par `prebuild`) : le
registre national espagnol (DGT, DATEX II) recense moins de sites qu'Open Charge
Map, et le registre britannique (NCR) est fermé depuis le 28/11/2024.

## Déploiement

Ce projet a besoin de **Node.js**, pas d'un hébergement statique. Il utilise
des routes API (`/api/stations`, `/api/reference`, `/api/geocode`), un
middleware de langue et du rendu serveur. Un hébergement type « mutualisé
fichiers seuls » (ou GitHub Pages) ne peut pas le faire tourner.

### Hostinger VPS, ou tout serveur Node

```bash
npm ci
npm run build     # produit .next/standalone (output: "standalone")
npm run package   # assemble le dossier deploy/ prêt à téléverser (~285 Mo depuis l'ajout des pages régionales : l'essentiel, ~255 Mo, est le HTML pré-rendu de 720 pages)
```

Téléversez le contenu de `deploy/`, puis sur le serveur :

```bash
cp .env.example .env   # renseignez OCM_API_KEY
node server.js         # écoute sur $PORT, 3000 par défaut
```

`npm run package` existe parce que `output: "standalone"` laisse volontairement
de côté deux dossiers qu'il faut recopier à côté du serveur : `.next/static` et
`public`. Les oublier donne un site qui démarre mais sans CSS ni images. Le
script s'en charge.

Pour que le site survive à un redémarrage, passez par un gestionnaire de
processus (`pm2 start server.js --name bornes`) et mettez Nginx devant pour le
HTTPS et le domaine.

### Mise à jour du site

Il n'y a pas de déploiement automatique : un push sur `main` ne met pas le site
à jour tout seul. Pour publier, faire `npm run build && npm run package` puis
téléverser le contenu de `deploy/` sur le serveur (voir ci-dessus).

Construire sur une machine Linux (ou celle du serveur) plutôt que sous Windows :
`sharp`, qui optimise les images, embarque un binaire propre à chaque système,
et celui de Windows ne se charge pas sur un serveur Linux (le site marche, mais
les images ne sont plus optimisées).

Sur le serveur, le fichier `.env` (avec `OCM_API_KEY`, et `PORT`/`HOSTNAME` si
besoin) reste en place d'un déploiement à l'autre : ne pas le supprimer en
remplaçant les fichiers. Passenger (hPanel) redémarre l'app quand
`tmp/restart.txt` change, ce que `npm run package` écrit à chaque fois.

### Hébergement mutualisé Hostinger (fichiers statiques uniquement)

Non supporté en l'état. Il faudrait basculer en export statique, ce qui
suppose de supprimer les routes API et donc de revoir la façon dont les
données de bornes et la clé Open Charge Map sont servies.

## Structure

- `src/app` : pages (App Router) : accueil, `/villes`, `/villes/[slug]`,
  `/guide`, `/a-propos`, `/contact`, `sitemap.ts`, `robots.ts`
- `src/app/api` : routes serveur qui masquent la clé Open Charge Map côté
  client et proxient la géolocalisation (Nominatim/OpenStreetMap)
- `src/components/map` : carte Leaflet (chargée uniquement côté client,
  clustering des bornes, recherche par ville/adresse)
- `src/lib/cities.ts` : villes couvertes par les pages `/villes/[slug]`
  (ajoutez une entrée pour ouvrir une nouvelle ville)
- `public/llms.txt` : description du site pour les crawlers IA (GEO)

## SEO / GEO

- Métadonnées, Open Graph et JSON-LD (`Organization`, `WebSite`, `Place`,
  `Article`, `BreadcrumbList`) par page
- `sitemap.xml` et `robots.txt` générés dynamiquement, avec autorisation
  explicite des crawlers IA (GPTBot, ClaudeBot, PerplexityBot,
  Google-Extended, CCBot)
- Contenu rendu côté serveur (pas de contenu caché derrière du JS pour les
  moteurs et les IA)
- Pas de schéma `FAQPage` (réservé aux sites gouvernementaux/santé depuis
  août 2023). Le contenu FAQ reste visible mais sans markup dédié
