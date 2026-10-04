// Sessions de connexion.
//
// À la connexion, on génère un jeton aléatoire envoyé dans un cookie. En base, on ne garde
// que son empreinte : une fuite de la base ne donne donc aucune session utilisable.
//
// Durée : 30 jours d'inactivité maximum (glissants), et 90 jours au total quoi qu'il arrive.
// Le cookie porte le préfixe __Host- : il exige Secure, Path=/ et interdit l'attribut Domain.

import { jetonAleatoire, sha256Hex } from './securite.js';

export const NOM_COOKIE = '__Host-oinarri';

const DUREE_INACTIVITE = 30 * 24 * 3600;
const DUREE_MAX = 90 * 24 * 3600;
const SEUIL_RAFRAICHISSEMENT = 10 * 60; // on ne réécrit l'activité qu'au bout de 10 minutes

const maintenant = () => Math.floor(Date.now() / 1000);

export function cookieSession(jeton) {
  return `${NOM_COOKIE}=${jeton}; Path=/; Max-Age=${DUREE_MAX}; HttpOnly; Secure; SameSite=Lax`;
}

export function cookieEffacement() {
  return `${NOM_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}

function lireJetonCookie(request) {
  const cookies = request.headers.get('Cookie') || '';
  const trouve = cookies.match(/(?:^|;\s*)__Host-oinarri=([A-Za-z0-9_-]{20,100})/);
  return trouve ? trouve[1] : null;
}

export async function creerSession(env, utilisateurId) {
  const jeton = jetonAleatoire(32);
  const t = maintenant();
  await env.DB_OINARRI.prepare(
    `INSERT INTO sessions (id_hash, utilisateur_id, cree_le, expire_le, derniere_activite)
     VALUES (?, ?, ?, ?, ?)`,
  )
    .bind(await sha256Hex(jeton), utilisateurId, t, t + DUREE_INACTIVITE, t)
    .run();
  return jeton;
}

// Renvoie { id, email, prenom, role, sessionHash } si la session est valide, sinon null.
export async function lireSession(request, env) {
  const jeton = lireJetonCookie(request);
  if (!jeton) return null;

  const idHash = await sha256Hex(jeton);
  const t = maintenant();
  const session = await env.DB_OINARRI.prepare(
    `SELECT s.cree_le, s.expire_le, s.derniere_activite, u.id, u.email, u.prenom, u.role
     FROM sessions s
     JOIN utilisateurs u ON u.id = s.utilisateur_id
     WHERE s.id_hash = ?`,
  )
    .bind(idHash)
    .first();

  if (!session || session.expire_le <= t || session.cree_le + DUREE_MAX <= t) return null;

  // Prolongation glissante, sans écrire à chaque requête.
  if (t - session.derniere_activite > SEUIL_RAFRAICHISSEMENT) {
    const nouvelleExpiration = Math.min(t + DUREE_INACTIVITE, session.cree_le + DUREE_MAX);
    try {
      await env.DB_OINARRI.batch([
        env.DB_OINARRI.prepare(
          'UPDATE sessions SET derniere_activite = ?, expire_le = ? WHERE id_hash = ?',
        ).bind(t, nouvelleExpiration, idHash),
        env.DB_OINARRI.prepare(
          `UPDATE utilisateurs SET derniere_visite = datetime('now') WHERE id = ?`,
        ).bind(session.id),
      ]);
    } catch (erreur) {
      // La prolongation est secondaire : son échec ne doit pas déconnecter l'utilisateur.
      console.error('Prolongation de session impossible', erreur);
    }
  }

  return {
    id: session.id,
    email: session.email,
    prenom: session.prenom,
    role: session.role,
    sessionHash: idHash,
  };
}

// Supprime la session de la requête en cours (déconnexion de cet appareil).
export async function supprimerSession(request, env) {
  const jeton = lireJetonCookie(request);
  if (!jeton) return;
  await env.DB_OINARRI.prepare('DELETE FROM sessions WHERE id_hash = ?')
    .bind(await sha256Hex(jeton))
    .run();
}

// Supprime les sessions d'un utilisateur, en conservant éventuellement celle qui est en cours.
export async function revoquerSessions(env, utilisateurId, sauf = null) {
  if (sauf) {
    await env.DB_OINARRI.prepare('DELETE FROM sessions WHERE utilisateur_id = ? AND id_hash != ?')
      .bind(utilisateurId, sauf)
      .run();
  } else {
    await env.DB_OINARRI.prepare('DELETE FROM sessions WHERE utilisateur_id = ?')
      .bind(utilisateurId)
      .run();
  }
}

// Ménage opportuniste des sessions expirées.
export async function nettoyerSessions(env) {
  await env.DB_OINARRI.prepare('DELETE FROM sessions WHERE expire_le < ?').bind(maintenant()).run();
}
