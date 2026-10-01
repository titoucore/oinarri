# Oinarri

Web app d'apprentissage sur le bâtiment, la promotion immobilière et les bailleurs sociaux.

## Stack

- Astro (site statique) : pages, cours en Markdown, glossaire
- Cloudflare Workers : sert le site (`dist/`) et l'API (`src/worker.js`, routes `/api/*`)
- À venir : D1 (comptes, progression), Resend (liens de connexion)

## Build et déploiement (Workers Builds)

- Commande de build : `npm run build`
- Commande de déploiement : `npx wrangler deploy`
- Version de Node : voir `.nvmrc`

## Vérifier le Worker

Une fois déployé, `/api/sante` renvoie un petit JSON `{ "app": "oinarri", "ok": true, ... }`.
