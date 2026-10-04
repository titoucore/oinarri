// Worker d'Oinarri.
// Les pages du site (dossier dist) passent par ce Worker (voir wrangler.jsonc), qui sert aussi /api/*.
//
// Identification : connexion par e-mail et mot de passe, avec cookie de session (voir api-auth.js).
// Il n'existe qu'un seul mode, et il refuse par défaut : toute page qui n'est pas explicitement
// publique, et toute route de données, exige une session valide.
// L'administration (/admin/ et /api/admin/*) exige en plus le rôle « admin ».

import { gererAccueil } from './api-accueil.js';
import { gererAdmin } from './api-admin.js';
import { gererAuth } from './api-auth.js';
import { gererCompte } from './api-compte.js';
import { gererExpliquer } from './api-expliquer.js';
import { gererNotes } from './api-notes.js';
import { gererProgression } from './api-progression.js';
import { gererQuiz } from './api-quiz.js';
import { gererRevisions } from './api-revisions.js';
import { gererScenarios } from './api-scenarios.js';
import { gererTermes } from './api-termes.js';
import { reponseIcone } from './lib/icones.js';
import { jetonAleatoire } from './lib/securite.js';
import { lireSession } from './lib/sessions.js';

// Routes de données : elles exigent une session. Chemin -> gestionnaire.
const ROUTES_UTILISATEUR = new Map([
  ['/api/accueil', gererAccueil],
  ['/api/admin/utilisateurs', gererAdmin],
  ['/api/admin/inviter', gererAdmin],
  ['/api/admin/lien', gererAdmin],
  ['/api/admin/parcours', gererAdmin],
  ['/api/admin/supprimer', gererAdmin],
  ['/api/compte', gererCompte],
  ['/api/compte/export', gererCompte],
  ['/api/expliquer', gererExpliquer],
  ['/api/notes', gererNotes],
  ['/api/progression', gererProgression],
  ['/api/quiz', gererQuiz],
  ['/api/revisions', gererRevisions],
  ['/api/scenarios', gererScenarios],
  ['/api/termes', gererTermes],
]);

// Pages accessibles sans être connecté. Tout le reste exige une session.
const PAGES_PUBLIQUES = [
  '/connexion/',
  '/mot-de-passe-oublie/',
  '/reinitialiser/',
  '/confirmer-email/',
  '/confidentialite/',
  '/favicon.svg',
];

function cheminPublic(chemin) {
  const avecSlash = chemin.endsWith('/') ? chemin : `${chemin}/`;
  return (
    chemin.startsWith('/_astro/') || PAGES_PUBLIQUES.includes(chemin) || PAGES_PUBLIQUES.includes(avecSlash)
  );
}

// Pages réservées aux administrateurs.
function cheminAdmin(chemin) {
  return chemin === '/admin' || chemin.startsWith('/admin/');
}

const PRENOM_VALIDE = /^[\p{L}\p{M}'’ .-]{1,40}$/u;

// ---------- Politique de sécurité du contenu (CSP) ----------
//
// La CSP dit au navigateur d'où une page a le droit de charger ses scripts, images, polices, etc.
// Même si du code malveillant se glissait dans une page, le navigateur refuserait de l'exécuter.
//
// Phase d'observation : tant que CSP_BLOQUANTE vaut false, le navigateur ne bloque rien, il signale
// seulement ce qu'il aurait bloqué (table rapports_csp). Passer à true une fois les signalements
// éteints.
//
// Chaque page reçoit un jeton à usage unique (« nonce ») : seuls les scripts qui le portent
// sont exécutés. Les pages ne sont donc pas mises en cache par le navigateur.
const CSP_BLOQUANTE = false;

function politiqueCsp(nonce) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    // Les styles écrits dans les pages par Astro exigent 'unsafe-inline' ; risque faible comparé aux scripts.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'report-uri /api/csp-rapport',
  ].join('; ');
}

// Reçoit les signalements du navigateur. Réservé aux utilisateurs connectés, plafonné à 300 lignes.
async function gererRapportCsp(request, env) {
  if (request.method !== 'POST') return new Response(null, { status: 405 });
  try {
    const utilisateur = await lireSession(request, env);
    if (!utilisateur) return new Response(null, { status: 204 });

    const texte = (await request.text()).slice(0, 4000);
    let rapport = {};
    try {
      const json = JSON.parse(texte);
      rapport = json['csp-report'] ?? json;
    } catch {
      // corps illisible : on enregistre quand même un signalement vide
    }
    const court = (valeur, max) => (typeof valeur === 'string' ? valeur.slice(0, max) : null);

    await env.DB_OINARRI.prepare(
      `INSERT INTO rapports_csp (directive, bloque, page, extrait, cree_le)
       SELECT ?, ?, ?, ?, datetime('now')
       WHERE (SELECT COUNT(*) FROM rapports_csp) < 300`,
    )
      .bind(
        court(rapport['effective-directive'] ?? rapport['violated-directive'], 80),
        court(rapport['blocked-uri'], 200),
        court(rapport['document-uri'], 200),
        court(rapport['script-sample'], 120),
      )
      .run();
  } catch (erreur) {
    console.error('Signalement CSP non enregistré', erreur);
  }
  return new Response(null, { status: 204 });
}

// ---------- Réponses ----------

function reponseJson(donnees, statut = 200) {
  return Response.json(donnees, {
    status: statut,
    headers: { 'Cache-Control': 'no-store' },
  });
}

// En-têtes de sécurité ajoutés aux pages.
function avecEntetes(reponse) {
  const r = new Response(reponse.body, reponse);
  r.headers.set('X-Content-Type-Options', 'nosniff');
  r.headers.set('X-Frame-Options', 'DENY');
  // Aucun lien (ni jeton présent dans une adresse) n'est transmis à un autre site.
  r.headers.set('Referrer-Policy', 'same-origin');
  // Le navigateur n'utilisera plus que HTTPS pour ce site pendant 6 mois (sans les sous-domaines).
  r.headers.set('Strict-Transport-Security', 'max-age=15552000');

  // La CSP ne concerne que les pages HTML.
  const type = r.headers.get('Content-Type') || '';
  if (!type.includes('text/html') || !r.body) return r;

  const nonce = jetonAleatoire(16);
  r.headers.set(
    CSP_BLOQUANTE ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only',
    politiqueCsp(nonce),
  );
  // Le jeton change à chaque réponse : la page ne doit être ni validée ni réutilisée depuis le cache.
  r.headers.delete('ETag');
  r.headers.delete('Last-Modified');
  r.headers.delete('Content-Length');
  r.headers.set('Cache-Control', 'private, no-cache');

  return new HTMLRewriter()
    .on('script', {
      element(element) {
        element.setAttribute('nonce', nonce);
      },
    })
    .transform(r);
}

// ---------- Routes ----------

async function router(request, env, ctx) {
  const url = new URL(request.url);

  // Icônes de l'application : publiques (iOS les télécharge sans session).
  const icone = reponseIcone(url.pathname, request.method);
  if (icone) return icone;

  if (url.pathname === '/api/sante') {
    return reponseJson({ app: 'oinarri', ok: true, date: new Date().toISOString() });
  }

  if (url.pathname === '/api/csp-rapport') {
    return gererRapportCsp(request, env);
  }

  // Connexion, mot de passe oublié, etc. : routes publiques qui font elles-mêmes leurs contrôles.
  if (url.pathname.startsWith('/api/auth/')) {
    return gererAuth(request, env, ctx, url);
  }

  if (url.pathname === '/api/moi') {
    const utilisateur = await lireSession(request, env);
    if (!utilisateur) return reponseJson({ erreur: 'Non authentifié' }, 401);

    if (request.method === 'GET') {
      return reponseJson({
        email: utilisateur.email,
        prenom: utilisateur.prenom,
        prenom_requis: !utilisateur.prenom,
        admin: utilisateur.role === 'admin',
      });
    }

    if (request.method === 'PUT') {
      // Protection contre les requêtes venues d'un autre site.
      const origine = request.headers.get('Origin');
      if (origine && origine !== url.origin) {
        return reponseJson({ erreur: 'Origine refusée' }, 403);
      }

      let corps;
      try {
        corps = await request.json();
      } catch {
        return reponseJson({ erreur: 'Requête invalide' }, 400);
      }

      const prenom = typeof corps?.prenom === 'string' ? corps.prenom.trim() : '';
      if (!PRENOM_VALIDE.test(prenom)) {
        return reponseJson(
          { erreur: 'Prénom invalide : 1 à 40 caractères, lettres, espaces, tirets ou apostrophes.' },
          400,
        );
      }

      await env.DB_OINARRI.prepare('UPDATE utilisateurs SET prenom = ? WHERE id = ?')
        .bind(prenom, utilisateur.id)
        .run();
      return reponseJson({
        email: utilisateur.email,
        prenom,
        prenom_requis: false,
        admin: utilisateur.role === 'admin',
      });
    }

    return reponseJson({ erreur: 'Méthode non autorisée' }, 405);
  }

  const gestionnaire = ROUTES_UTILISATEUR.get(url.pathname);
  if (gestionnaire) {
    const utilisateur = await lireSession(request, env);
    if (!utilisateur) return reponseJson({ erreur: 'Non authentifié' }, 401);
    return gestionnaire(request, env, utilisateur, url);
  }

  if (url.pathname.startsWith('/api/')) {
    return reponseJson({ erreur: 'Route inconnue' }, 404);
  }

  // Pages : toute page non publique exige une session.
  if (!cheminPublic(url.pathname)) {
    const session = await lireSession(request, env);
    if (!session) {
      if (request.method === 'GET' || request.method === 'HEAD') {
        const retour = encodeURIComponent(url.pathname + url.search);
        return new Response(null, {
          status: 302,
          headers: { Location: `/connexion/?retour=${retour}`, 'Cache-Control': 'no-store' },
        });
      }
      return new Response('Non authentifié', { status: 401 });
    }
    // L'administration est invisible pour les autres comptes : même réponse qu'une page inexistante.
    if (cheminAdmin(url.pathname) && session.role !== 'admin') {
      return new Response('Page introuvable', {
        status: 404,
        headers: { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }
  }

  // Hors fichiers /_astro/ (nommés par empreinte), on retire les validateurs du navigateur :
  // une page HTML reçoit un jeton CSP neuf à chaque fois, elle ne doit jamais être servie en « 304 ».
  let demande = request;
  if (!url.pathname.startsWith('/_astro/')) {
    demande = new Request(request);
    demande.headers.delete('If-None-Match');
    demande.headers.delete('If-Modified-Since');
  }
  return avecEntetes(await env.ASSETS.fetch(demande));
}

export default {
  async fetch(request, env, ctx) {
    try {
      return await router(request, env, ctx);
    } catch (erreur) {
      // Toute panne inattendue (base indisponible, secret manquant, etc.) devient une réponse
      // claire, et le détail reste dans les journaux du Worker (Observability).
      console.error('Erreur Worker', request.method, new URL(request.url).pathname, erreur);
      return reponseJson({ erreur: 'Service temporairement indisponible. Réessaie dans un instant.' }, 503);
    }
  },
};
