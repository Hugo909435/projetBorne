# Plan d'Action SEO Priorisé — Faire Décoller ma-borne-electrique.com

Ce plan détaille la feuille de route chronologique pour débloquer l'indexation, faire passer les positions moyennes de la page 4 au Top 3, et multiplier par 20 le trafic organique du site.

---

## Phase 1 : Quick Wins Techniques & Architecture (Semaine 1 — 48h)

Objectif : Sécuriser la santé technique, stopper la fuite de PageRank et corriger le maillage de base.

### 1. Corriger la Redirection de la Racine (Priorité 🔴 Haute — 30 min)
- **Problème** : `https://ma-borne-electrique.com/` renvoie un code **307 (Temporary Redirect)** vers `/en` ou `/fr` selon l'en-tête de langue du visiteur. Pour Googlebot (qui crawle depuis les USA sans cookies), cela crée une instabilité d'indexation et dissipe le jus de lien entrant.
- **Action** : 
  - Dans `src/i18n/routing.ts`, désactiver la détection de langue automatique pour les bots ou utiliser `localeDetection: false`, ou forcer une redirection permanente 308 vers la version par défaut `/fr`.
  - Vérifier avec `curl -I https://ma-borne-electrique.com/` qu'un code 308 (permanent) est retourné.

### 2. Ajouter l'En-tête HSTS (Priorité ⚠️ Moyenne — 15 min)
- **Problème** : L'en-tête `Strict-Transport-Security` est absent de `next.config.ts`.
- **Action** : 
  - Dans `next.config.ts`, ajouter dans la liste des headers :
    ```typescript
    {
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    }
    ```

### 3. Compléter `robots.ts` pour Tous les Crawlers IA (Priorité ⚠️ Moyenne — 15 min)
- **Problème** : `Applebot-Extended`, `Bytespider`, `FacebookBot`, `Amazonbot` ne sont pas explicitement déclarés.
- **Action** : 
  - Dans `src/app/robots.ts`, ajouter les entrées `allow: "/"` pour ces 4 bots afin de maximiser la visibilité sur Apple Intelligence et les nouveaux assistants.

### 4. Déployer un "Mega Footer SEO" Thématique (Priorité 🔴 Haute — 1h)
- **Problème** : 184 pages sont quasi-orphelines. Le footer actuel ne contient AUCUN lien vers `/bornes-recharge` ni vers les pages modèles `/recharge`.
- **Action** : 
  - Enrichir `src/components/Footer.tsx` avec des colonnes de liens explicites :
    - **Top Départements** : Paris (75), Bouches-du-Rhône (13), Rhône (69), Nord (59), Gironde (33), Haute-Garonne (31), Loire-Atlantique (44), etc.
    - **Top Réseaux** : Superchargeurs Tesla, Ionity, TotalEnergies, Fastned, Electra.
    - **Modèles Électriques** : Peugeot e-208, Tesla Model 3, Tesla Model Y, Renault Zoe, MG4, Dacia Spring.
    - **Guides Pratiques** : Guide connecteurs Type 2/CCS, Coût de la recharge, Droit à la prise en copropriété.

---

## Phase 2 : Déblocage de l'Indexation & Structuration en Silos (Semaines 2 à 4)

Objectif : Rendre les 572 pages régionales indexables par Google et concentrer la puissance thématique.

### 5. Créer des Hubs Pays Dédiés (Priorité 🔴 Haute)
- **Problème** : `/bornes-recharge` regroupe en vrac la France, l'Allemagne, l'Espagne et le Royaume-Uni dans une seule page de 170+ liens.
- **Action** :
  - Créer des pages hubs intermédiaires :
    - `/fr/bornes-recharge` -> Page d'aiguillage France avec carte des régions et top départements.
    - `/de/bornes-recharge` (ou `/de/ladesaeulen`) -> Hub Allemagne ciblant les requêtes fortes en DE.
  - Cela crée une hiérarchie claire : `Accueil > Pays > Région/Département > Station/Commune`.

### 6. Enrichir le Contenu des 25 Plus Gros Départements (Priorité 🔴 Haute)
- **Problème** : Les pages départementales ne contiennent aujourd'hui que des compteurs statistiques (~500 mots). Google refuse de les indexer en masse.
- **Action** :
  - Pour les 25 départements concentrant 80% du trafic EV (Paris, 13, 69, 59, 33, 31, 06, 44, 78, 92...) :
    1. **Axes autoroutiers majeurs** : lister les aires équipées de recharge ultra-rapide (ex: A1, A6, A7, A10, A13).
    2. **Réseaux prédominants et tarifs moyens constatés** (ex: réseau métropolitain Bélib à Paris, Izivia, etc.).
    3. **Conseils locaux** : stationnement gratuit pendant la charge, zones ZFE concernées.
    4. **FAQ locale schema-ready** : "Où trouver une borne rapide à Paris ?", "Combien coûte la recharge dans le Rhône ?".

### 7. Maillage Croisé Blog ↔ Départements ↔ Véhicules (Priorité ⚠️ Moyenne)
- Dans les articles phares :
  - L'article `road-trip-france-recharge-voiture-electrique` doit lier vers les départements traversés (A10 -> Gironde, Indre-et-Loire ; A7 -> Rhône, Drôme, Vaucluse, Bouches-du-Rhône).
  - L'article `comparatif-abonnements-recharge` doit lier vers les pages réseaux (`/reseaux/ionity`, `/reseaux/tesla-superchargers`).
  - Les pages modèles (`/recharge/tesla-model-3`) doivent lier vers le guide du connecteur CCS et le réseau Tesla.

---

## Phase 3 : Conquête des Requêtes à Fort Volume & "Strike Distance" (Mois 2)

Objectif : Passer les pages de la position 15-30 au Top 3 sur Google.

### 8. Optimiser les "Quick Wins" de la Search Console
D'après l'analyse des requêtes GSC réelles :
- **Requête** : `quel est le meilleur abonnement à une borne de recharge électrique ?` (Position actuelle : ~42)
  - **Action** : Transformer l'article `/blog/comparatif-abonnements-recharge` en guide 2026 complet avec tableau comparatif en haut de page (prix au kWh avec et sans abonnement, rentabilité selon les km mensuels).
- **Requête** : `e auto reichweite winter` & `elektroauto reichweite winter` (Position actuelle : ~28-32, fort volume DE)
  - **Action** : Mettre à jour l'article allemand `/de/blog/autonomie-hiver-voiture-electrique` avec un tableau par modèle de perte d'autonomie constatée (-15% à -30%) et des conseils de préconditionnement batterie.
- **Requête** : `elektro ladestationen frankreich` & `elektrisches laden in frankreich` (Position actuelle : ~21-59)
  - **Action** : Optimiser l'article `/de/blog/electric-car-in-france-charging-guide` : ajouter une section sur les péages autoroutiers, les badges recommandés pour un Allemand en France (EnBW mobility+ vs Chargemap), et un lien direct vers la carte interactive avec filtre allemand.

### 9. Lancer un Grand Comparateur Interactif de Badges de Recharge
- Créer un outil interactif simple : *"Quel badge de recharge choisir pour votre profil ?"*
  - Profil 1 : Charge 90% à domicile, vacances 2 fois par an -> Badges sans abonnement (Ulys, Chargemap, Shell).
  - Profil 2 : Gros rouleur autoroute (> 20 000 km/an) -> Pass Ionity Passport ou Tesla Abonnement.
- **Impact** : Extrêmement recherché, fort taux de clic, conversion affiliation immédiate, fort potentiel de partages.

---

## Phase 4 : Stratégie de Backlinks & Autorité (Digital PR) (Mois 2 à 3)

Objectif : Obtenir 15 à 30 backlinks éditoriaux légitimes pour lever le frein de l'autorité de domaine.

### 10. Publier le "Baromètre Trimestriel de la Recharge en France"
- **L'actif exclusif** : Vous disposez déjà de la base officielle IRVE complète (~120 Mo de données) mise à jour régulièrement dans votre dépôt.
- **L'action** :
  1. Extraire 5 statistiques percutantes que personne ne publie sous cet angle :
     - Le top 10 des départements les mieux équipés en bornes ultra-rapides (>150 kW).
     - Le ratio de bornes par millier d'habitants ou par km d'autoroute.
     - L'évolution trimestrielle du déploiement.
  2. Rédiger une page d'étude / communiqué de presse avec infographies et chiffres clés ouverts.
  3. Contacter par email personnalisé les journalistes et rédacteurs spécialisés :
     - *Automobile Propre*, *Frandroid*, *Numerama*, *Clubic*, *L'Argus*, *Cleanrider*.
     - La presse régionale des départements en tête ou en queue de classement (*Ouest-France*, *Le Progrès*, *Sud-Ouest*).
- **Résultat attendu** : 5 à 15 backlinks de très haute autorité (DR 70-90) qui feront monter l'ensemble du domaine dans les SERPs.

---

## Calendrier d'Exécution Synthétique

```
Semaine 1 : Fix redirection 307 + HSTS + Robots IA + Mega Footer SEO
Semaine 2 : Refonte structurelle /bornes-recharge en hubs pays + Maillage blog/départements
Semaine 3 : Enrichissement approfondi des 25 départements clés (A1, A6, A7, réseaux)
Semaine 4 : Optimisation des articles "Strike-Distance" (Abonnements, Hiver, Guide France en DE)
Mois 2    : Lancement du Baromètre IRVE 2026 (Campagne RP / Backlinks) + Simulateur badges
```
