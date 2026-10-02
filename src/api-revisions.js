// Route /api/revisions : cartes de révision espacée de l'utilisateur connecté.
//
// GET  -> { aujourdhui, revisions: [{ carte, prochaine_revision, intervalle_jours, repetitions }] }
// POST -> { action: 'inscrire', cartes: [...] }  : ajoute des cartes (sans toucher à celles qui existent)
//         { action: 'noter', carte, reussi }     : enregistre une révision et planifie la suivante
//
// Identifiant d'une carte : "<cours>#<niveau>#<numéro de la question>",
// par exemple "ba-ba/01-qui-intervient#essentiel#0".
//
// Planification (inspirée de SM-2, simplifiée à deux réponses : je savais / à revoir) :
//   - une nouvelle carte revient le lendemain ;
//   - réussite : 3 jours, puis 7 jours, puis intervalle précédent x facilité ;
//   - échec : retour à 1 jour, et la facilité baisse de 0,2 (minimum 1,3).

const CARTE_VALIDE = /^[a-z0-9-]{1,40}\/[a-z0-9-]{1,80}#(essentiel|approfondir|expert)#[0-9]{1,3}$/;
const MAX_CARTES = 100;
const FACILITE_INITIALE = 2.5;
const FACILITE_MIN = 1.3;

function reponseJson(donnees, statut = 200) {
  return Response.json(donnees, {
    status: statut,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function gererRevisions(request, env, utilisateur, url) {
  if (request.method === 'GET') {
    const { results } = await env.DB_OINARRI.prepare(
      `SELECT carte, prochaine_revision, intervalle_jours, repetitions
       FROM revisions
       WHERE utilisateur_id = ?`,
    )
      .bind(utilisateur.id)
      .all();
    const jour = await env.DB_OINARRI.prepare(`SELECT date('now') AS aujourdhui`).first();
    return reponseJson({ aujourdhui: jour.aujourdhui, revisions: results });
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

    if (corps?.action === 'inscrire') {
      const cartes = Array.isArray(corps.cartes) ? [...new Set(corps.cartes)] : [];
      const valide =
        cartes.length > 0 &&
        cartes.length <= MAX_CARTES &&
        cartes.every((c) => typeof c === 'string' && CARTE_VALIDE.test(c));
      if (!valide) return reponseJson({ erreur: 'Cartes invalides' }, 400);

      // INSERT OR IGNORE : une carte déjà inscrite garde son historique.
      const requetes = cartes.map((carte) =>
        env.DB_OINARRI.prepare(
          `INSERT OR IGNORE INTO revisions
             (utilisateur_id, carte, prochaine_revision, intervalle_jours, facilite, repetitions, derniere_revision)
           VALUES (?, ?, date('now', '+1 day'), 1, ?, 0, NULL)`,
        ).bind(utilisateur.id, carte, FACILITE_INITIALE),
      );
      await env.DB_OINARRI.batch(requetes);
      return reponseJson({ inscrites: cartes.length });
    }

    if (corps?.action === 'noter') {
      const { carte, reussi } = corps;
      if (typeof carte !== 'string' || !CARTE_VALIDE.test(carte) || typeof reussi !== 'boolean') {
        return reponseJson({ erreur: 'Requête invalide' }, 400);
      }

      const ligne = await env.DB_OINARRI.prepare(
        `SELECT intervalle_jours, facilite, repetitions
         FROM revisions
         WHERE utilisateur_id = ? AND carte = ?`,
      )
        .bind(utilisateur.id, carte)
        .first();
      if (!ligne) return reponseJson({ erreur: 'Carte inconnue' }, 404);

      let repetitions;
      let intervalle;
      let facilite = ligne.facilite;
      if (reussi) {
        repetitions = ligne.repetitions + 1;
        if (repetitions === 1) intervalle = 3;
        else if (repetitions === 2) intervalle = 7;
        else intervalle = Math.max(1, Math.round(ligne.intervalle_jours * facilite));
      } else {
        repetitions = 0;
        intervalle = 1;
        facilite = Math.max(FACILITE_MIN, facilite - 0.2);
      }

      await env.DB_OINARRI.prepare(
        `UPDATE revisions
         SET prochaine_revision = date('now', '+' || ? || ' days'),
             intervalle_jours = ?,
             facilite = ?,
             repetitions = ?,
             derniere_revision = date('now')
         WHERE utilisateur_id = ? AND carte = ?`,
      )
        .bind(intervalle, intervalle, facilite, repetitions, utilisateur.id, carte)
        .run();
      return reponseJson({ carte, intervalle_jours: intervalle, repetitions });
    }

    return reponseJson({ erreur: 'Action inconnue' }, 400);
  }

  return reponseJson({ erreur: 'Méthode non autorisée' }, 405);
}
