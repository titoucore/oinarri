// Routes /api/admin/* : gestion des comptes, réservée aux administrateurs (role = 'admin').
//
// GET  /api/admin/utilisateurs                      liste des comptes avec des compteurs d'avancement
// POST /api/admin/inviter     { email }             crée le compte et envoie l'invitation (lien valable 7 jours)
// POST /api/admin/lien        { id }                invitation renvoyée (compte en attente) ou lien de
//                                                   réinitialisation (compte actif), valable 1 heure
// POST /api/admin/parcours    { id }                efface progression, scores de quiz et cartes de révision
// POST /api/admin/supprimer   { id, email, mot_de_passe }   supprime le compte et toutes ses données
//
// Principes :
// - l'administrateur ne connaît ni ne définit jamais le mot de passe d'autrui : il envoie un lien ;
// - il ne lit jamais le contenu des notes, termes ou scénarios : seulement des compteurs ;
// - les comptes administrateurs (dont le sien) ne sont modifiables que depuis « Mon compte ».

import { verifierLimite } from './lib/limites.js';
import {
  courrielInvitation,
  courrielReinitialisation,
  envoyerCourriel,
} from './lib/courriel.js';
import {
  jetonAleatoire,
  normaliserEmail,
  obtenirPoivre,
  sha256Hex,
  verifierMotDePasse,
} from './lib/securite.js';

const DUREE_INVITATION = 7 * 24 * 3600; // 7 jours
const DUREE_REINITIALISATION = 3600; // 1 heure

const maintenant = () => Math.floor(Date.now() / 1000);

function reponseJson(donnees, statut = 200) {
  return Response.json(donnees, {
    status: statut,
    headers: { 'Cache-Control': 'no-store' },
  });
}

// Crée un jeton de type « reinitialisation » : c'est celui que la page /reinitialiser/ sait consommer.
// Un seul jeton en attente par utilisateur.
async function creerJeton(env, utilisateurId, duree) {
  const jeton = jetonAleatoire(32);
  await env.DB_OINARRI.batch([
    env.DB_OINARRI.prepare(
      `DELETE FROM jetons WHERE utilisateur_id = ? AND type = 'reinitialisation'`,
    ).bind(utilisateurId),
    env.DB_OINARRI.prepare(
      `INSERT INTO jetons (id_hash, utilisateur_id, type, email_cible, expire_le, utilise_le)
       VALUES (?, ?, 'reinitialisation', NULL, ?, NULL)`,
    ).bind(await sha256Hex(jeton), utilisateurId, maintenant() + duree),
  ]);
  return jeton;
}

async function lireCible(env, id) {
  if (!Number.isInteger(id)) return null;
  return await env.DB_OINARRI.prepare(
    `SELECT id, email, role, (mot_de_passe_hash IS NULL) AS en_attente
     FROM utilisateurs WHERE id = ?`,
  )
    .bind(id)
    .first();
}

// Cible valide pour une action : elle existe et n'est pas un compte administrateur.
async function cibleModifiable(env, admin, id) {
  const cible = await lireCible(env, id);
  if (!cible) return { erreur: reponseJson({ erreur: 'Compte introuvable.' }, 404) };
  if (cible.role === 'admin' || cible.id === admin.id) {
    return {
      erreur: reponseJson(
        { erreur: 'Un compte administrateur se gère depuis « Mon compte ».' },
        403,
      ),
    };
  }
  return { cible };
}

function tropDeTentatives() {
  return reponseJson({ erreur: 'Trop de tentatives. Réessaie dans quelques minutes.' }, 429);
}

// ---------- Actions ----------

async function lister(env, admin) {
  const { results } = await env.DB_OINARRI.prepare(
    `SELECT u.id, u.email, u.prenom, u.role, u.cree_le, u.derniere_visite,
            (u.mot_de_passe_hash IS NULL) AS en_attente,
            (SELECT COUNT(*) FROM progression p WHERE p.utilisateur_id = u.id) AS chapitres_commences,
            (SELECT COALESCE(SUM(p.termine), 0) FROM progression p WHERE p.utilisateur_id = u.id) AS chapitres_termines,
            (SELECT COUNT(*) FROM resultats_quiz q WHERE q.utilisateur_id = u.id) AS quiz_passes
     FROM utilisateurs u
     ORDER BY (u.role = 'admin') DESC, u.cree_le DESC, u.id DESC`,
  ).all();
  return reponseJson({
    moi: admin.id,
    utilisateurs: results.map((r) => ({ ...r, en_attente: !!r.en_attente })),
  });
}

async function inviter(env, admin, url, corps) {
  const email = normaliserEmail(corps.email);
  if (!email) return reponseJson({ erreur: 'Adresse e-mail invalide.' }, 400);

  const limite = await verifierLimite(env, `invit:${admin.id}`, 20, 3600);
  if (!limite.autorise) return tropDeTentatives();

  const existant = await env.DB_OINARRI.prepare(
    'SELECT id, (mot_de_passe_hash IS NULL) AS en_attente FROM utilisateurs WHERE email = ?',
  )
    .bind(email)
    .first();
  if (existant) {
    return reponseJson(
      {
        erreur: existant.en_attente
          ? "Cette personne a déjà été invitée. Utilise « Renvoyer l'invitation » dans la liste."
          : 'Cette adresse a déjà un compte actif.',
      },
      409,
    );
  }

  let ajout;
  try {
    ajout = await env.DB_OINARRI.prepare(
      `INSERT INTO utilisateurs (email, role) VALUES (?, 'lecteur')`,
    )
      .bind(email)
      .run();
  } catch {
    return reponseJson({ erreur: 'Cette adresse a déjà un compte.' }, 409);
  }

  const id = ajout.meta.last_row_id;
  const jeton = await creerJeton(env, id, DUREE_INVITATION);
  try {
    await envoyerCourriel(env, {
      a: email,
      ...courrielInvitation(`${url.origin}/reinitialiser/?jeton=${jeton}`),
    });
  } catch (erreur) {
    console.error("Invitation : envoi d'e-mail impossible :", erreur.message);
    return reponseJson(
      {
        erreur:
          "Le compte est créé mais l'e-mail n'est pas parti. Utilise « Renvoyer l'invitation » dans la liste.",
      },
      502,
    );
  }
  console.log('admin: invitation', admin.id, '->', id);
  return reponseJson({ ok: true, message: `Invitation envoyée à ${email}. Le lien est valable 7 jours.` });
}

async function envoyerLien(env, admin, url, corps) {
  const { cible, erreur } = await cibleModifiable(env, admin, corps.id);
  if (erreur) return erreur;

  const limite = await verifierLimite(env, `lienadm:${cible.id}`, 5, 3600);
  if (!limite.autorise) return tropDeTentatives();

  const enAttente = !!cible.en_attente;
  const jeton = await creerJeton(env, cible.id, enAttente ? DUREE_INVITATION : DUREE_REINITIALISATION);
  const lien = `${url.origin}/reinitialiser/?jeton=${jeton}`;
  try {
    await envoyerCourriel(env, {
      a: cible.email,
      ...(enAttente ? courrielInvitation(lien) : courrielReinitialisation(lien)),
    });
  } catch (e) {
    console.error('Lien admin : envoi impossible :', e.message);
    return reponseJson({ erreur: "L'e-mail n'est pas parti. Réessaie dans un instant." }, 502);
  }
  console.log('admin: lien', admin.id, '->', cible.id);
  return reponseJson({
    ok: true,
    message: enAttente
      ? `Invitation renvoyée à ${cible.email} (valable 7 jours).`
      : `Lien de réinitialisation envoyé à ${cible.email} (valable 1 heure).`,
  });
}

async function remettreParcoursAZero(env, admin, corps) {
  const { cible, erreur } = await cibleModifiable(env, admin, corps.id);
  if (erreur) return erreur;

  await env.DB_OINARRI.batch([
    env.DB_OINARRI.prepare('DELETE FROM progression WHERE utilisateur_id = ?').bind(cible.id),
    env.DB_OINARRI.prepare('DELETE FROM resultats_quiz WHERE utilisateur_id = ?').bind(cible.id),
    env.DB_OINARRI.prepare('DELETE FROM revisions WHERE utilisateur_id = ?').bind(cible.id),
  ]);
  console.log('admin: parcours effacé', admin.id, '->', cible.id);
  return reponseJson({
    ok: true,
    message: `Parcours de ${cible.email} remis à zéro. Ses notes et son glossaire personnel sont conservés.`,
  });
}

async function supprimerCompte(env, admin, corps) {
  const { cible, erreur } = await cibleModifiable(env, admin, corps.id);
  if (erreur) return erreur;

  // Garde-fou : l'adresse saisie doit correspondre au compte visé (liste périmée, mauvais clic).
  if (corps.email !== cible.email) {
    return reponseJson({ erreur: "L'adresse ne correspond pas à ce compte. Recharge la page." }, 400);
  }

  // Supprimer un compte exige le mot de passe de l'administrateur, et les essais sont limités.
  const poivre = obtenirPoivre(env);
  const limite = await verifierLimite(env, `admsuppr:${admin.id}`, 5, 900);
  if (!limite.autorise) return tropDeTentatives();
  const moi = await env.DB_OINARRI.prepare('SELECT mot_de_passe_hash FROM utilisateurs WHERE id = ?')
    .bind(admin.id)
    .first();
  const motDePasse = typeof corps.mot_de_passe === 'string' ? corps.mot_de_passe : '';
  if (
    !moi?.mot_de_passe_hash ||
    !motDePasse ||
    motDePasse.length > 512 ||
    !(await verifierMotDePasse(motDePasse, moi.mot_de_passe_hash, poivre))
  ) {
    return reponseJson({ erreur: 'Mot de passe incorrect.' }, 403);
  }

  const id = cible.id;
  await env.DB_OINARRI.batch([
    env.DB_OINARRI.prepare('DELETE FROM progression WHERE utilisateur_id = ?').bind(id),
    env.DB_OINARRI.prepare('DELETE FROM resultats_quiz WHERE utilisateur_id = ?').bind(id),
    env.DB_OINARRI.prepare('DELETE FROM revisions WHERE utilisateur_id = ?').bind(id),
    env.DB_OINARRI.prepare('DELETE FROM notes WHERE utilisateur_id = ?').bind(id),
    env.DB_OINARRI.prepare('DELETE FROM termes_perso WHERE utilisateur_id = ?').bind(id),
    env.DB_OINARRI.prepare('DELETE FROM scenarios WHERE utilisateur_id = ?').bind(id),
    env.DB_OINARRI.prepare('DELETE FROM sessions WHERE utilisateur_id = ?').bind(id),
    env.DB_OINARRI.prepare('DELETE FROM jetons WHERE utilisateur_id = ?').bind(id),
    env.DB_OINARRI.prepare('DELETE FROM utilisateurs WHERE id = ?').bind(id),
  ]);
  console.log('admin: compte supprimé', admin.id, '->', id);
  return reponseJson({ ok: true, message: `Compte de ${cible.email} supprimé avec toutes ses données.` });
}

// ---------- Point d'entrée ----------

export async function gererAdmin(request, env, admin, url) {
  // Les non-administrateurs ne doivent même pas deviner que ces routes existent.
  if (admin.role !== 'admin') return reponseJson({ erreur: 'Route inconnue' }, 404);

  if (url.pathname === '/api/admin/utilisateurs') {
    if (request.method !== 'GET') return reponseJson({ erreur: 'Méthode non autorisée' }, 405);
    return lister(env, admin);
  }

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

  switch (url.pathname) {
    case '/api/admin/inviter':
      return inviter(env, admin, url, corps);
    case '/api/admin/lien':
      return envoyerLien(env, admin, url, corps);
    case '/api/admin/parcours':
      return remettreParcoursAZero(env, admin, corps);
    case '/api/admin/supprimer':
      return supprimerCompte(env, admin, corps);
    default:
      return reponseJson({ erreur: 'Route inconnue' }, 404);
  }
}
