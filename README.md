# Oinarri

Formation en ligne pour adultes sur le bâtiment, la promotion immobilière et le logement social,
en partant de zéro. Publiée sur oinarri.etika.eus.

## Stack

- **Astro 6** (site statique) : pages, cours en Markdown, quiz en YAML.
- **Cloudflare Worker** (`src/worker.js`) : sert le site (`dist/`) et l'API (`/api/*`).
- **D1** (`oinarri-db`, liaison `DB_OINARRI`) : comptes, sessions, progression, quiz, révisions.
- **Resend** : e-mails du service (création et réinitialisation du mot de passe, changement d'adresse).

## Organisation du code

| Dossier | Rôle |
|---|---|
| `src/content/<parcours>/` | Cours en Markdown (`01-qui-intervient.md`) |
| `src/content/quiz/<parcours>/` | Mini-quiz YAML, même nom de fichier que le cours |
| `src/data/` | Plan du parcours (`ba-ba.js`), niveaux, informations légales (`legal.js`) |
| `src/pages/` | Pages du site |
| `src/scripts/` | Code exécuté dans le navigateur |
| `src/lib/` | Code du Worker : sécurité, sessions, limitation des tentatives, e-mails ; et `cartes.js` (build) |
| `src/api-*.js` | Routes de l'API, une par fichier |

## Ajouter un chapitre

1. Écrire `src/content/ba-ba/NN-titre.md` (même structure que le chapitre 1 : Essentiel, Approfondir, Expert).
2. Écrire `src/content/quiz/ba-ba/NN-titre.yaml` (qcm, vf, ouverte ; 2 points par question).
3. Ajouter `href` et `cours` au chapitre dans `src/data/ba-ba.js`.

**Cartes de révision.** Chaque question de quiz devient une carte identifiée par sa position dans le
fichier YAML (`cours#niveau#numéro`). Ajouter les nouvelles questions à la fin de leur niveau et ne
jamais réordonner celles qui existent, sous peine de fausser l'historique de révision.

## Connexion

Connexion par e-mail et mot de passe (`src/api-auth.js`, `src/lib/`).

- Mots de passe : PBKDF2-SHA256 à 100 000 itérations (plafond de Cloudflare) après un pré-hachage
  avec le secret `PEPPER`. Minimum 12 caractères.
- Sessions : jeton aléatoire, seule son empreinte est en base. Cookie `__Host-oinarri`
  (HttpOnly, Secure, SameSite=Lax). 30 jours d'inactivité maximum, 90 jours au total.
- Tentatives limitées par IP et par adresse (table `limites`).
- Le Worker refuse par défaut : toute page absente de `PAGES_PUBLIQUES` (`src/worker.js`) exige
  une session.
- Pas d'inscription publique pour l'instant. Un compte existe dès qu'une ligne est créée dans
  `utilisateurs` ; son mot de passe se crée via « Mot de passe oublié ».

### Secrets (tableau de bord Cloudflare, jamais dans le dépôt)

| Nom | Contenu |
|---|---|
| `PEPPER` | Chaîne aléatoire de 32 caractères minimum |
| `RESEND_API_KEY` | Clé d'API Resend |

Les variables non secrètes sont dans `wrangler.jsonc`. **Ne créer dans le tableau de bord aucun secret
ni aucune variable du même nom qu'une variable de ce fichier** : il masquerait la valeur du dépôt.

## Base de données

Tables : `utilisateurs`, `sessions`, `jetons` (liens à usage unique), `limites` (tentatives),
`progression`, `resultats_quiz`, `revisions`.

## Build et déploiement (Workers Builds)

- Commande de build : `npm run build`
- Commande de déploiement : `npx wrangler deploy`
- Version de Node : voir `.nvmrc`
- Chaque commit sur `main` déclenche un déploiement.

## Vérifier le Worker

`/api/sante` renvoie `{ "app": "oinarri", "ok": true, ... }`.

## À faire avant d'ouvrir le service à d'autres personnes

- Créer la boîte qui reçoit les demandes de droits (`CONTACT_EMAIL` dans `src/data/legal.js`).
- Faire relire la page de confidentialité et la question de l'identité du responsable du traitement.
- Fixer une durée de conservation des comptes inactifs.
- Héberger la police Space Grotesk sur le site (Google Fonts transmet l'adresse IP à Google).
- Construire l'inscription (avec vérification de l'adresse e-mail) et la limiter.
