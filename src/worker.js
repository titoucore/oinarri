// Worker d'Oinarri.
// Les pages du site (dossier dist) passent par ce Worker (voir wrangler.jsonc), qui sert aussi /api/*.
//
// Deux modes d'identification, choisis par la variable AUTH_MODE :
//   "access" (par défaut) : Cloudflare Access place un jeton signé (JWT) dans chaque requête.
//                           On vérifie signature, émetteur, audience et expiration avant d'accepter l'e-mail.
//   "compte"              : connexion par e-mail et mot de passe, avec cookie de session (voir api-auth.js).
//                           Toutes les pages, sauf quelques pages publiques, exigent une session.

import { gererAccueil } from './api-accueil.js';
import { gererAuth } from './api-auth.js';
import { gererCompte } from './api-compte.js';
import { gererProgression } from './api-progression.js';
import { gererQuiz } from './api-quiz.js';
import { gererRevisions } from './api-revisions.js';
import { lireSession } from './lib/sessions.js';

// Routes qui exigent un utilisateur identifié : chemin -> gestionnaire.
const ROUTES_UTILISATEUR = new Map([
  ['/api/accueil', gererAccueil],
  ['/api/compte', gererCompte],
  ['/api/compte/export', gererCompte],
  ['/api/progression', gererProgression],
  ['/api/quiz', gererQuiz],
  ['/api/revisions', gererRevisions],
]);

// Pages accessibles sans être connecté (mode "compte").
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

const DUREE_CACHE_CLES = 60 * 60 * 1000; // 1 heure
let cacheCles = { cles: null, expire: 0 };

// ---------- Outils JWT (mode "access") ----------

function base64urlVersOctets(texte) {
  const b64 = texte
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(texte.length / 4) * 4, '=');
  const binaire = atob(b64);
  const octets = new Uint8Array(binaire.length);
  for (let i = 0; i < binaire.length; i++) octets[i] = binaire.charCodeAt(i);
  return octets;
}

function decoderJson(texte) {
  return JSON.parse(new TextDecoder().decode(base64urlVersOctets(texte)));
}

async function obtenirCles(env, forcer = false) {
  const maintenant = Date.now();
  if (!forcer && cacheCles.cles && maintenant < cacheCles.expire) {
    return cacheCles.cles;
  }
  const reponse = await fetch(`https://${env.ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`);
  if (!reponse.ok) throw new Error('Clés Access indisponibles');
  const { keys } = await reponse.json();
  cacheCles = { cles: keys, expire: maintenant + DUREE_CACHE_CLES };
  return keys;
}

async function verifierJeton(jeton, env) {
  const parties = jeton.split('.');
  if (parties.length !== 3) return null;
  const [h, p, s] = parties;

  let entete;
  let charge;
  try {
    entete = decoderJson(h);
    charge = decoderJson(p);
  } catch {
    return null;
  }
  if (entete.alg !== 'RS256') return null;

  let cles = await obtenirCles(env);
  let jwk = cles.find((k) => k.kid === entete.kid);
  if (!jwk) {
    // Les clés ont peut-être changé : on recharge une fois.
    cles = await obtenirCles(env, true);
    jwk = cles.find((k) => k.kid === entete.kid);
    if (!jwk) return null;
  }

  const cle = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );
  const signatureValide = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    cle,
    base64urlVersOctets(s),
    new TextEncoder().encode(`${h}.${p}`),
  );
  if (!signatureValide) return null;

  const maintenant = Math.floor(Date.now() / 1000);
  if (typeof charge.exp !== 'number' || charge.exp <= maintenant) return null;
  if (typeof charge.nbf === 'number' && charge.nbf > maintenant + 60) return null;
  if (charge.iss !== `https://${env.ACCESS_TEAM_DOMAIN}`) return null;

  const audiences = Array.isArray(charge.aud) ? charge.aud : [charge.aud];
  if (!audiences.includes(env.ACCESS_AUD)) return null;

  if (typeof charge.email !== 'string' || !charge.email) return null;
  return charge;
}

function lireJeton(request) {
  const entete = request.headers.get('Cf-Access-Jwt-Assertion');
  if (entete) return entete;
  const cookies = request.headers.get('Cookie') || '';
  const trouve = cookies.match(/(?:^|;\s*)CF_Authorization=([^;]+)/);
  return trouve ? trouve[1] : null;
}

async function authentifier(request, env) {
  // Sans ces deux variables, on refuse tout : mieux vaut bloquer que laisser passer.
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) return null;
  const jeton = lireJeton(request);
  if (!jeton) return null;
  try {
    return await verifierJeton(jeton, env);
  } catch {
    return null;
  }
}

// ---------- Utilisateurs ----------

// Mode "access". Une visite n'est enregistrée que si la précédente date de plus de 10 minutes :
// la plupart des requêtes ne font ainsi qu'une lecture, sans écriture en base.
async function utilisateurAccess(request, env) {
  const charge = await authentifier(request, env);
  if (!charge) return null;
  const email = charge.email.trim().toLowerCase();

  const existant = await env.DB_OINARRI.prepare(
    `SELECT id, email, prenom,
            (derniere_visite IS NULL OR derniere_visite < datetime('now', '-10 minutes')) AS a_rafraichir
     FROM utilisateurs
     WHERE email = ?`,
  )
    .bind(email)
    .first();

  if (existant) {
    if (existant.a_rafraichir) {
      try {
        await env.DB_OINARRI.prepare(
          `UPDATE utilisateurs SET derniere_visite = datetime('now') WHERE id = ?`,
        )
          .bind(existant.id)
          .run();
      } catch (erreur) {
        // La date de visite est secondaire : son échec ne doit pas faire échouer la requête.
        console.error('Mise à jour de la dernière visite impossible', erreur);
      }
    }
    return { id: existant.id, email: existant.email, prenom: existant.prenom };
  }

  // Première visite : création du compte (ON CONFLICT couvre deux premières requêtes simultanées).
  return await env.DB_OINARRI.prepare(
    `INSERT INTO utilisateurs (email, derniere_visite)
     VALUES (?, datetime('now'))
     ON CONFLICT(email) DO UPDATE SET derniere_visite = datetime('now')
     RETURNING id, email, prenom`,
  )
    .bind(email)
    .first();
}

// Utilisateur de la requête selon le mode choisi.
async function utilisateurCourant(request, env) {
  if (env.AUTH_MODE === 'compte') return await lireSession(request, env);
  return await utilisateurAccess(request, env);
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

  if (url.pathname === '/api/sante') {
    // Diagnostic temporaire : mode actif et présence des secrets (oui/non, jamais leur valeur).
    return reponseJson({
      app: 'oinarri',
      ok: true,
      date: new Date().toISOString(),
      version: 'diag-2026-10-02',
      mode: env.AUTH_MODE ?? null,
      secret_pepper: Boolean(env.PEPPER),
      secret_resend: Boolean(env.RESEND_API_KEY),
    });
  }

  if (url.pathname.startsWith('/api/auth/')) {
    if (env.AUTH_MODE !== 'compte') return reponseJson({ erreur: 'Route inconnue' }, 404);
    return gererAuth(request, env, ctx, url);
  }

  if (url.pathname === '/api/moi') {
    const utilisateur = await utilisateurCourant(request, env);
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
    const utilisateur = await utilisateurCourant(request, env);
    if (!utilisateur) return reponseJson({ erreur: 'Non authentifié' }, 401);
    return gestionnaire(request, env, utilisateur, url);
  }

  if (url.pathname.startsWith('/api/')) {
    return reponseJson({ erreur: 'Route inconnue' }, 404);
  }

  // Pages : en mode "compte", toute page non publique exige une session.
  if (env.AUTH_MODE === 'compte' && !cheminPublic(url.pathname)) {
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
