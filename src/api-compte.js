// Route /api/compte : gestion du compte de l'utilisateur connecté.
//
// GET  /api/compte         -> informations, avancement, résultats de quiz, cartes de révision
// GET  /api/compte/export  -> toutes les données du compte, en téléchargement (JSON)
// POST /api/compte         -> { action: 'reinitialiser', cours }       efface la progression d'un cours
//                             { action: 'reinitialiser', cours: null } efface toute la progression
//                             { action: 'supprimer', confirmation: 'SUPPRIMER', mot_de_passe }
//                                supprime le compte (le mot de passe est toujours exigé)
//
// « Progression » = avancement par niveau + scores de quiz + cartes de révision.
// Chaque requête ne touche que les lignes de l'utilisateur identifié.

import { obtenirPoivre, verifierMotDePasse } from './lib/securite.js';
import { cookieEffacement } from './lib/sessions.js';
import { verifierLimite } from './lib/limites.js';

const COURS_VALIDE = /^[a-z0-9-]{1,40}\/[a-z0-9-]{1,80}$/;

function reponseJson(donnees, statut = 200, entetes = {}) {
  return Response.json(donnees, {
    status: statut,
    headers: { 'Cache-Control': 'no-store', ...entetes },
  });
}

// Lit toutes les données d'un utilisateur en un seul aller-retour vers la base.
// Le mot de passe haché n'est jamais lu ici : il ne sort pas du serveur.
async function lireDonnees(env, id) {
  const base = env.DB_OINARRI;
  const [compte, progression, quiz, revisions] = await base.batch([
    base
      .prepare('SELECT email, prenom, cree_le, derniere_visite FROM utilisateurs WHERE id = ?')
      .bind(id),
    base
      .prepare(
        `SELECT cours, niveau_atteint, termine, mis_a_jour
         FROM progression WHERE utilisateur_id = ? ORDER BY cours`,
      )
      .bind(id),
    base
      .prepare(
        `SELECT cours, niveau, score, total, passe_le
         FROM resultats_quiz WHERE utilisateur_id = ? ORDER BY passe_le, id`,
      )
      .bind(id),
    base
      .prepare(
        `SELECT carte, prochaine_revision, intervalle_jours, facilite, repetitions, derniere_revision
         FROM revisions WHERE utilisateur_id = ? ORDER BY carte`,
      )
      .bind(id),
  ]);
  return {
    compte: compte.results[0] ?? null,
    progression: progression.results,
    quiz: quiz.results,
    revisions: revisions.results,
  };
}

// Résumé des quiz : une entrée par cours et par niveau.
function resumerQuiz(lignes) {
  const regroupes = new Map();
  for (const l of lignes) {
    if (!l.niveau) continue;
    const cle = `${l.cours}#${l.niveau}`;
    const existant = regroupes.get(cle);
    regroupes.set(cle, {
      cours: l.cours,
      niveau: l.niveau,
      tentatives: (existant?.tentatives ?? 0) + 1,
      meilleur: Math.max(existant?.meilleur ?? 0, l.score),
      total: l.total,
      dernier: l.passe_le,
    });
  }
  return [...regroupes.values()];
}

export async function gererCompte(request, env, utilisateur, url) {
  const base = env.DB_OINARRI;

  if (url.pathname === '/api/compte/export') {
    if (request.method !== 'GET') return reponseJson({ erreur: 'Méthode non autorisée' }, 405);
    const donnees = await lireDonnees(env, utilisateur.id);
    const export_ = {
      application: 'Oinarri',
      exporte_le: new Date().toISOString(),
      compte: donnees.compte,
      progression: donnees.progression,
      resultats_quiz: donnees.quiz,
      cartes_de_revision: donnees.revisions,
    };
    return new Response(JSON.stringify(export_, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': 'attachment; filename="oinarri-mes-donnees.json"',
        'Cache-Control': 'no-store',
      },
    });
  }

  if (request.method === 'GET') {
    const donnees = await lireDonnees(env, utilisateur.id);
    const jour = await base.prepare(`SELECT date('now') AS aujourdhui`).first();
    return reponseJson({
      // Conservé pour la page « Mon compte » ; il n'existe plus qu'un seul mode de connexion.
      mode: 'compte',
      moi: donnees.compte,
      progression: donnees.progression,
      quiz: resumerQuiz(donnees.quiz),
      revisions: donnees.revisions.map((r) => ({
        carte: r.carte,
        prochaine_revision: r.prochaine_revision,
      })),
      aujourdhui: jour.aujourdhui,
    });
  }

  if (request.method === 'POST') {
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

    const id = utilisateur.id;

    if (corps?.action === 'reinitialiser') {
      const cours = corps.cours ?? null;
      if (cours !== null && (typeof cours !== 'string' || !COURS_VALIDE.test(cours))) {
        return reponseJson({ erreur: 'Cours invalide' }, 400);
      }

      if (cours === null) {
        await base.batch([
          base.prepare('DELETE FROM progression WHERE utilisateur_id = ?').bind(id),
          base.prepare('DELETE FROM resultats_quiz WHERE utilisateur_id = ?').bind(id),
          base.prepare('DELETE FROM revisions WHERE utilisateur_id = ?').bind(id),
        ]);
      } else {
        // Le nom d'un cours ne contient que lettres minuscules, chiffres, tirets et "/" :
        // aucun caractère spécial de LIKE (% ou _) ne peut s'y glisser.
        await base.batch([
          base.prepare('DELETE FROM progression WHERE utilisateur_id = ? AND cours = ?').bind(id, cours),
          base.prepare('DELETE FROM resultats_quiz WHERE utilisateur_id = ? AND cours = ?').bind(id, cours),
          base
            .prepare('DELETE FROM revisions WHERE utilisateur_id = ? AND carte LIKE ?')
            .bind(id, `${cours}#%`),
        ]);
      }
      return reponseJson({ ok: true, cours });
    }

    if (corps?.action === 'supprimer') {
      // Seconde barrière côté serveur : la confirmation doit être exacte.
      if (corps.confirmation !== 'SUPPRIMER') {
        return reponseJson({ erreur: 'Confirmation manquante' }, 400);
      }

      // Supprimer un compte exige toujours le mot de passe, et les essais sont limités.
      const poivre = obtenirPoivre(env);
      const limite = await verifierLimite(env, `suppr:${id}`, 5, 900);
      if (!limite.autorise) {
        return reponseJson({ erreur: 'Trop de tentatives. Réessaie dans quelques minutes.' }, 429);
      }
      const compte = await base
        .prepare('SELECT mot_de_passe_hash FROM utilisateurs WHERE id = ?')
        .bind(id)
        .first();
      const motDePasse = typeof corps.mot_de_passe === 'string' ? corps.mot_de_passe : '';
      if (
        !compte?.mot_de_passe_hash ||
        !motDePasse ||
        !(await verifierMotDePasse(motDePasse, compte.mot_de_passe_hash, poivre))
      ) {
        return reponseJson({ erreur: 'Mot de passe incorrect.' }, 403);
      }

      // Les données liées d'abord, le compte en dernier, en une seule opération.
      await base.batch([
        base.prepare('DELETE FROM progression WHERE utilisateur_id = ?').bind(id),
        base.prepare('DELETE FROM resultats_quiz WHERE utilisateur_id = ?').bind(id),
        base.prepare('DELETE FROM revisions WHERE utilisateur_id = ?').bind(id),
        base.prepare('DELETE FROM sessions WHERE utilisateur_id = ?').bind(id),
        base.prepare('DELETE FROM jetons WHERE utilisateur_id = ?').bind(id),
        base.prepare('DELETE FROM utilisateurs WHERE id = ?').bind(id),
      ]);
      return reponseJson({ ok: true, supprime: true }, 200, { 'Set-Cookie': cookieEffacement() });
    }

    return reponseJson({ erreur: 'Action inconnue' }, 400);
  }

  return reponseJson({ erreur: 'Méthode non autorisée' }, 405);
}
