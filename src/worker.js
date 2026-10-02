// Worker d'Oinarri.
// Les pages du site (dossier dist) sont servies directement par Cloudflare.
// Ce Worker n'est appelé en premier que pour les routes /api/* (voir wrangler.jsonc).
//
// Identification : Cloudflare Access place un jeton signé (JWT) dans chaque requête.
// On ne se fie jamais à un simple en-tête : on vérifie la signature, l'émetteur,
// l'audience et la date d'expiration avant d'accepter l'e-mail qu'il contient.

import { gererProgression } from './api-progression.js';
import { gererQuiz } from './api-quiz.js';

// Routes qui exigent un utilisateur identifié : chemin -> gestionnaire.
const ROUTES_UTILISATEUR = new Map([
  ['/api/progression', gererProgression],
  ['/api/quiz', gererQuiz],
]);

const DUREE_CACHE_CLES = 60 * 60 * 1000; // 1 heure
let cacheCles = { cles: null, expire: 0 };

// ---------- Outils JWT ----------

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

async function utilisateurCourant(request, env) {
  const charge = await authentifier(request, env);
  if (!charge) return null;
  const email = charge.email.trim().toLowerCase();
  return await env.DB_OINARRI.prepare(
    `INSERT INTO utilisateurs (email, derniere_visite)
     VALUES (?, datetime('now'))
     ON CONFLICT(email) DO UPDATE SET derniere_visite = datetime('now')
     RETURNING id, email, prenom`,
  )
    .bind(email)
    .first();
}

const PRENOM_VALIDE = /^[\p{L}\p{M}'’ .-]{1,40}$/u;

// ---------- Réponses ----------

function reponseJson(donnees, statut = 200) {
  return Response.json(donnees, {
    status: statut,
    headers: { 'Cache-Control': 'no-store' },
  });
}

// ---------- Routes ----------

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/sante') {
      return reponseJson({ app: 'oinarri', ok: true, date: new Date().toISOString() });
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

    return env.ASSETS.fetch(request);
  },
};
