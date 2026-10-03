// Worker d'Oinarri.
// Les pages du site (dossier dist) passent par ce Worker (voir wrangler.jsonc), qui sert aussi /api/*.
//
// Identification : connexion par e-mail et mot de passe, avec cookie de session (voir api-auth.js).
// Il n'existe qu'un seul mode, et il refuse par défaut : toute page qui n'est pas explicitement
// publique, et toute route de données, exige une session valide.

import { gererAccueil } from './api-accueil.js';
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
import { lireSession } from './lib/sessions.js';

// Routes de données : elles exigent une session. Chemin -> gestionnaire.
const ROUTES_UTILISATEUR = new Map([
  ['/api/accueil', gererAccueil],
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

const PRENOM_VALIDE = /^[\p{L}\p{M}'’ .-]{1,40}$/u;

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
  return r;
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
      return reponseJson({ email: utilisateur.email, prenom, prenom_requis: false });
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
  }

  return avecEntetes(await env.ASSETS.fetch(request));
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
