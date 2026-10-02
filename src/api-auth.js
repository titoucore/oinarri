// Routes /api/auth/* : connexion par e-mail et mot de passe.
// Actives seulement quand AUTH_MODE vaut "compte" (voir worker.js).
//
// POST /api/auth/connexion            { email, mot_de_passe }
// POST /api/auth/deconnexion          (cet appareil)
// POST /api/auth/deconnexion-globale  (tous les appareils)
// POST /api/auth/mot-de-passe-oublie  { email }                 envoie un lien par e-mail
// POST /api/auth/reinitialiser        { jeton, mot_de_passe }   crée ou réinitialise le mot de passe
// POST /api/auth/mot-de-passe         { actuel, nouveau }       (connecté)
// POST /api/auth/email                { mot_de_passe, nouvel_email }  (connecté) demande de changement
// POST /api/auth/confirmer-email      { jeton }                 confirme le changement d'e-mail
//
// Principes : réponses identiques que l'e-mail existe ou non, tentatives limitées,
// jetons à usage unique stockés sous forme d'empreinte, e-mails envoyés en arrière-plan.

import {
  controlerMotDePasse,
  hacherMotDePasse,
  hmacHex,
  jetonAleatoire,
  normaliserEmail,
  obtenirPoivre,
  sha256Hex,
  verifierFactice,
  verifierMotDePasse,
} from './lib/securite.js';
import {
  cookieEffacement,
  cookieSession,
  creerSession,
  lireSession,
  nettoyerSessions,
  revoquerSessions,
  supprimerSession,
} from './lib/sessions.js';
import { nettoyerLimitesEtJetons, oublierLimite, verifierLimite } from './lib/limites.js';
import {
  courrielConfirmationEmail,
  courrielEmailModifie,
  courrielMotDePasseModifie,
  courrielReinitialisation,
  envoyerCourriel,
} from './lib/courriel.js';

const DUREE_JETON = 3600; // 1 heure
const FORMAT_JETON = /^[A-Za-z0-9_-]{20,100}$/;
const LIEN_INVALIDE = "Ce lien est invalide ou a expiré. Demande-en un nouveau.";

const maintenant = () => Math.floor(Date.now() / 1000);

function reponseJson(donnees, statut = 200, entetes = {}) {
  return Response.json(donnees, {
    status: statut,
    headers: { 'Cache-Control': 'no-store', ...entetes },
  });
}

function tropDeTentatives(limite) {
  return reponseJson(
    { erreur: 'Trop de tentatives. Réessaie dans quelques minutes.' },
    429,
    { 'Retry-After': String(limite.reessayerDans || 60) },
  );
}

// Clé de limitation fondée sur l'adresse IP, sous forme d'empreinte (jamais l'IP en clair).
async function cleIp(request, poivre, prefixe) {
  const ip = request.headers.get('CF-Connecting-IP') || 'inconnue';
  return `${prefixe}:ip:${await hmacHex(poivre, ip)}`;
}

// L'envoi d'un e-mail se fait après la réponse : le délai ne révèle pas si le compte existe.
function envoyerEnArrierePlan(env, ctx, destinataire, message) {
  ctx.waitUntil(
    envoyerCourriel(env, { a: destinataire, ...message }).catch((erreur) =>
      console.error("Envoi d'e-mail impossible :", erreur.message),
    ),
  );
}

async function creerJeton(env, utilisateurId, type, emailCible = null) {
  const jeton = jetonAleatoire(32);
  const t = maintenant();
  await env.DB_OINARRI.batch([
    // Un seul jeton en attente par type et par utilisateur.
    env.DB_OINARRI.prepare('DELETE FROM jetons WHERE utilisateur_id = ? AND type = ?').bind(
      utilisateurId,
      type,
    ),
    env.DB_OINARRI.prepare(
      `INSERT INTO jetons (id_hash, utilisateur_id, type, email_cible, expire_le, utilise_le)
       VALUES (?, ?, ?, ?, ?, NULL)`,
    ).bind(await sha256Hex(jeton), utilisateurId, type, emailCible, t + DUREE_JETON),
  ]);
  return jeton;
}

// Consomme un jeton de façon atomique : un seul appel peut réussir, même si deux arrivent ensemble.
async function consommerJeton(env, jeton, type) {
  const t = maintenant();
  const resultat = await env.DB_OINARRI.prepare(
    `UPDATE jetons SET utilise_le = ?
     WHERE id_hash = ? AND type = ? AND utilise_le IS NULL AND expire_le > ?`,
  )
    .bind(t, await sha256Hex(jeton), type, t)
    .run();
  return resultat.meta.changes === 1;
}

// Lit un jeton encore valable sans le consommer.
async function lireJeton(env, jeton, type) {
  return await env.DB_OINARRI.prepare(
    `SELECT utilisateur_id, email_cible FROM jetons
     WHERE id_hash = ? AND type = ? AND utilise_le IS NULL AND expire_le > ?`,
  )
    .bind(await sha256Hex(jeton), type, maintenant())
    .first();
}

// ---------- Actions ----------

async function connexion(request, env, ctx, corps, poivre) {
  const email = normaliserEmail(corps.email);
  const motDePasse = typeof corps.mot_de_passe === 'string' ? corps.mot_de_passe : '';
  if (!email || !motDePasse || motDePasse.length > 512) {
    return reponseJson({ erreur: 'Renseigne ton adresse e-mail et ton mot de passe.' }, 400);
  }

  const cleMail = `conn:mail:${await hmacHex(poivre, email)}`;
  const parIp = await verifierLimite(env, await cleIp(request, poivre, 'conn'), 30, 900);
  const parMail = await verifierLimite(env, cleMail, 10, 900);
  if (!parIp.autorise) return tropDeTentatives(parIp);
  if (!parMail.autorise) return tropDeTentatives(parMail);

  const utilisateur = await env.DB_OINARRI.prepare(
    'SELECT id, mot_de_passe_hash FROM utilisateurs WHERE email = ?',
  )
    .bind(email)
    .first();

  let valide = false;
  if (utilisateur?.mot_de_passe_hash) {
    valide = await verifierMotDePasse(motDePasse, utilisateur.mot_de_passe_hash, poivre);
  } else {
    await verifierFactice(motDePasse, poivre); // même durée de calcul si le compte n'existe pas
  }
  if (!valide) {
    return reponseJson({ erreur: 'Adresse e-mail ou mot de passe incorrect.' }, 401);
  }

  await oublierLimite(env, cleMail);
  const jeton = await creerSession(env, utilisateur.id);

  // Ménage occasionnel des données périmées, après la réponse.
  if (Math.random() < 0.05) {
    ctx.waitUntil(
      Promise.all([nettoyerSessions(env), nettoyerLimitesEtJetons(env)]).catch((e) =>
        console.error('Ménage impossible', e),
      ),
    );
  }

  return reponseJson({ ok: true }, 200, { 'Set-Cookie': cookieSession(jeton) });
}

async function deconnexion(request, env) {
  await supprimerSession(request, env);
  return reponseJson({ ok: true }, 200, { 'Set-Cookie': cookieEffacement() });
}

async function deconnexionGlobale(request, env) {
  const session = await lireSession(request, env);
  if (!session) return reponseJson({ erreur: 'Non connecté' }, 401);
  await revoquerSessions(env, session.id);
  return reponseJson({ ok: true }, 200, { 'Set-Cookie': cookieEffacement() });
}

async function motDePasseOublie(request, env, ctx, url, corps, poivre) {
  const email = normaliserEmail(corps.email);
  if (!email) return reponseJson({ erreur: 'Adresse e-mail invalide.' }, 400);

  const message =
    "Si un compte existe pour cette adresse, un e-mail vient d'être envoyé. Le lien est valable 1 heure.";

  const parIp = await verifierLimite(env, await cleIp(request, poivre, 'oubli'), 10, 3600);
  if (!parIp.autorise) return tropDeTentatives(parIp);
  const parMail = await verifierLimite(
    env,
    `oubli:mail:${await hmacHex(poivre, email)}`,
    3,
    3600,
  );
  // Au-delà de la limite par adresse, on répond comme d'habitude mais on n'envoie rien.
  if (!parMail.autorise) return reponseJson({ ok: true, message });

  const utilisateur = await env.DB_OINARRI.prepare('SELECT id FROM utilisateurs WHERE email = ?')
    .bind(email)
    .first();
  if (utilisateur) {
    const jeton = await creerJeton(env, utilisateur.id, 'reinitialisation');
    envoyerEnArrierePlan(
      env,
      ctx,
      email,
      courrielReinitialisation(`${url.origin}/reinitialiser/?jeton=${jeton}`),
    );
  }
  return reponseJson({ ok: true, message });
}

async function reinitialiser(request, env, ctx, corps, poivre) {
  const jeton = typeof corps.jeton === 'string' ? corps.jeton : '';
  if (!FORMAT_JETON.test(jeton)) return reponseJson({ erreur: LIEN_INVALIDE }, 400);

  const parIp = await verifierLimite(env, await cleIp(request, poivre, 'reinit'), 20, 3600);
  if (!parIp.autorise) return tropDeTentatives(parIp);

  const ligne = await lireJeton(env, jeton, 'reinitialisation');
  if (!ligne) return reponseJson({ erreur: LIEN_INVALIDE }, 400);
  const utilisateur = await env.DB_OINARRI.prepare('SELECT id, email FROM utilisateurs WHERE id = ?')
    .bind(ligne.utilisateur_id)
    .first();
  if (!utilisateur) return reponseJson({ erreur: LIEN_INVALIDE }, 400);

  // On contrôle le mot de passe AVANT de consommer le jeton : un mot de passe trop court
  // ne doit pas « brûler » le lien.
  const erreurMotDePasse = controlerMotDePasse(corps.mot_de_passe, utilisateur.email);
  if (erreurMotDePasse) return reponseJson({ erreur: erreurMotDePasse }, 400);

  const empreinte = await hacherMotDePasse(corps.mot_de_passe, poivre);
  if (!(await consommerJeton(env, jeton, 'reinitialisation'))) {
    return reponseJson({ erreur: LIEN_INVALIDE }, 400);
  }

  // Le lien reçu par e-mail prouve aussi la propriété de l'adresse.
  await env.DB_OINARRI.batch([
    env.DB_OINARRI.prepare(
      `UPDATE utilisateurs
       SET mot_de_passe_hash = ?, email_verifie_le = COALESCE(email_verifie_le, datetime('now'))
       WHERE id = ?`,
    ).bind(empreinte, utilisateur.id),
    env.DB_OINARRI.prepare('DELETE FROM sessions WHERE utilisateur_id = ?').bind(utilisateur.id),
  ]);
  envoyerEnArrierePlan(env, ctx, utilisateur.email, courrielMotDePasseModifie());
  return reponseJson({ ok: true });
}

async function changerMotDePasse(request, env, ctx, corps, poivre) {
  const session = await lireSession(request, env);
  if (!session) return reponseJson({ erreur: 'Non connecté' }, 401);

  const limite = await verifierLimite(env, `chgmdp:${session.id}`, 10, 900);
  if (!limite.autorise) return tropDeTentatives(limite);

  const compte = await env.DB_OINARRI.prepare(
    'SELECT mot_de_passe_hash FROM utilisateurs WHERE id = ?',
  )
    .bind(session.id)
    .first();
  const actuel = typeof corps.actuel === 'string' ? corps.actuel : '';
  if (
    !compte?.mot_de_passe_hash ||
    !actuel ||
    !(await verifierMotDePasse(actuel, compte.mot_de_passe_hash, poivre))
  ) {
    return reponseJson({ erreur: 'Mot de passe actuel incorrect.' }, 403);
  }

  const erreurMotDePasse = controlerMotDePasse(corps.nouveau, session.email);
  if (erreurMotDePasse) return reponseJson({ erreur: erreurMotDePasse }, 400);

  const empreinte = await hacherMotDePasse(corps.nouveau, poivre);
  await env.DB_OINARRI.prepare('UPDATE utilisateurs SET mot_de_passe_hash = ? WHERE id = ?')
    .bind(empreinte, session.id)
    .run();
  // Les autres appareils sont déconnectés ; celui-ci reste connecté.
  await revoquerSessions(env, session.id, session.sessionHash);
  envoyerEnArrierePlan(env, ctx, session.email, courrielMotDePasseModifie());
  return reponseJson({ ok: true });
}

async function demanderChangementEmail(request, env, ctx, url, corps, poivre) {
  const session = await lireSession(request, env);
  if (!session) return reponseJson({ erreur: 'Non connecté' }, 401);

  const limite = await verifierLimite(env, `chgmail:${session.id}`, 5, 3600);
  if (!limite.autorise) return tropDeTentatives(limite);

  const compte = await env.DB_OINARRI.prepare(
    'SELECT mot_de_passe_hash FROM utilisateurs WHERE id = ?',
  )
    .bind(session.id)
    .first();
  const motDePasse = typeof corps.mot_de_passe === 'string' ? corps.mot_de_passe : '';
  if (
    !compte?.mot_de_passe_hash ||
    !motDePasse ||
    !(await verifierMotDePasse(motDePasse, compte.mot_de_passe_hash, poivre))
  ) {
    return reponseJson({ erreur: 'Mot de passe incorrect.' }, 403);
  }

  const nouvelle = normaliserEmail(corps.nouvel_email);
  if (!nouvelle) return reponseJson({ erreur: 'Adresse e-mail invalide.' }, 400);
  if (nouvelle === session.email) {
    return reponseJson({ erreur: "C'est déjà l'adresse de ton compte." }, 400);
  }

  // Même réponse que l'adresse soit libre ou déjà prise : on ne révèle pas quels comptes existent.
  const prise = await env.DB_OINARRI.prepare('SELECT id FROM utilisateurs WHERE email = ?')
    .bind(nouvelle)
    .first();
  if (!prise) {
    const jeton = await creerJeton(env, session.id, 'changement_email', nouvelle);
    envoyerEnArrierePlan(
      env,
      ctx,
      nouvelle,
      courrielConfirmationEmail(`${url.origin}/confirmer-email/?jeton=${jeton}`),
    );
  }
  return reponseJson({
    ok: true,
    message:
      "Un e-mail de confirmation vient d'être envoyé à la nouvelle adresse (lien valable 1 heure). " +
      "L'adresse actuelle reste valable tant que tu n'as pas confirmé.",
  });
}

async function confirmerEmail(request, env, ctx, corps, poivre) {
  const jeton = typeof corps.jeton === 'string' ? corps.jeton : '';
  if (!FORMAT_JETON.test(jeton)) return reponseJson({ erreur: LIEN_INVALIDE }, 400);

  const parIp = await verifierLimite(env, await cleIp(request, poivre, 'confmail'), 20, 3600);
  if (!parIp.autorise) return tropDeTentatives(parIp);

  const ligne = await lireJeton(env, jeton, 'changement_email');
  if (!ligne || !ligne.email_cible) return reponseJson({ erreur: LIEN_INVALIDE }, 400);
  const ancien = await env.DB_OINARRI.prepare('SELECT email FROM utilisateurs WHERE id = ?')
    .bind(ligne.utilisateur_id)
    .first();
  if (!ancien) return reponseJson({ erreur: LIEN_INVALIDE }, 400);

  if (!(await consommerJeton(env, jeton, 'changement_email'))) {
    return reponseJson({ erreur: LIEN_INVALIDE }, 400);
  }

  try {
    await env.DB_OINARRI.prepare(
      `UPDATE utilisateurs SET email = ?, email_verifie_le = datetime('now') WHERE id = ?`,
    )
      .bind(ligne.email_cible, ligne.utilisateur_id)
      .run();
  } catch {
    // L'adresse a été prise entre la demande et la confirmation.
    return reponseJson({ erreur: 'Cette adresse est déjà utilisée par un autre compte.' }, 409);
  }

  // L'adresse est l'identifiant de connexion : on ferme toutes les sessions.
  await revoquerSessions(env, ligne.utilisateur_id);
  envoyerEnArrierePlan(env, ctx, ancien.email, courrielEmailModifie(ligne.email_cible));
  return reponseJson({ ok: true }, 200, { 'Set-Cookie': cookieEffacement() });
}

// ---------- Point d'entrée ----------

export async function gererAuth(request, env, ctx, url) {
  if (request.method !== 'POST') return reponseJson({ erreur: 'Méthode non autorisée' }, 405);

  // Protection contre les requêtes venues d'un autre site.
  const origine = request.headers.get('Origin');
  if (origine && origine !== url.origin) return reponseJson({ erreur: 'Origine refusée' }, 403);

  let corps;
  try {
    corps = await request.json();
  } catch {
    return reponseJson({ erreur: 'Requête invalide' }, 400);
  }
  if (!corps || typeof corps !== 'object') return reponseJson({ erreur: 'Requête invalide' }, 400);

  // Lève une erreur (donc une réponse 503) si le poivre est absent : on ne hache jamais sans lui.
  const poivre = obtenirPoivre(env);

  switch (url.pathname) {
    case '/api/auth/connexion':
      return connexion(request, env, ctx, corps, poivre);
    case '/api/auth/deconnexion':
      return deconnexion(request, env);
    case '/api/auth/deconnexion-globale':
      return deconnexionGlobale(request, env);
    case '/api/auth/mot-de-passe-oublie':
      return motDePasseOublie(request, env, ctx, url, corps, poivre);
    case '/api/auth/reinitialiser':
      return reinitialiser(request, env, ctx, corps, poivre);
    case '/api/auth/mot-de-passe':
      return changerMotDePasse(request, env, ctx, corps, poivre);
    case '/api/auth/email':
      return demanderChangementEmail(request, env, ctx, url, corps, poivre);
    case '/api/auth/confirmer-email':
      return confirmerEmail(request, env, ctx, corps, poivre);
    default:
      return reponseJson({ erreur: 'Route inconnue' }, 404);
  }
}
