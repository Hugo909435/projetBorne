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

## Déploiement

Ce projet a besoin de **Node.js**, pas d'un hébergement statique. Il utilise
des routes API (`/api/stations`, `/api/reference`, `/api/geocode`), un
middleware de langue et du rendu serveur. Un hébergement type « mutualisé
fichiers seuls » (ou GitHub Pages) ne peut pas le faire tourner.

### Hostinger VPS, ou tout serveur Node

```bash
npm ci
npm run build     # produit .next/standalone (output: "standalone")
npm run package   # assemble le dossier deploy/ prêt à téléverser (~21 Mo)
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

### Déploiement automatique (GitHub Actions → FTP → hPanel Node.js)

Un push sur `main` déclenche `.github/workflows/deploy.yml` :

1. `npm ci && npm run build && npm run package` (même étapes qu'en manuel).
2. Le contenu de `deploy/` est envoyé en FTP vers le dossier de l'app Node.js
   configurée dans hPanel (action
   [`SamKirkland/FTP-Deploy-Action`](https://github.com/SamKirkland/FTP-Deploy-Action)).
   Le `.env` du serveur n'est jamais écrasé.
3. `npm run package` écrit `deploy/tmp/restart.txt` avec un horodatage à
   chaque build : Passenger (le process manager derrière les apps Node.js
   hPanel) surveille ce fichier et redémarre l'app dès que son contenu change.

**Mise en place initiale (une seule fois) :**

- Dans hPanel, créez l'app Node.js (fichier de démarrage `server.js`,
  version Node 20), notez le dossier racine qu'elle attend.
- Sur le serveur, dans ce dossier racine, créez un `.env` avec `OCM_API_KEY`
  (et `PORT`/`HOSTNAME` si besoin) — CI ne le touche jamais.
- Dans GitHub, *Settings → Secrets and variables → Actions*, ajoutez :
  - `FTP_SERVER` : hôte FTP (ex. `ftp://xxx.xxx.xxx.xxx` ou celui fourni par hPanel)
  - `FTP_USERNAME` / `FTP_PASSWORD` : identifiants FTP hPanel
  - `FTP_SERVER_DIR` : chemin absolu du dossier racine de l'app Node.js sur le serveur (avec un `/` final, ex. `/home/user/domains/ma-borne-electrique.com/app/`)

Pour déclencher un déploiement sans push, utilisez l'onglet *Actions* du repo
GitHub et lancez le workflow manuellement (`workflow_dispatch`).

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
