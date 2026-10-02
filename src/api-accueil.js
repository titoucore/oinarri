// Route /api/accueil : tout ce dont l'accueil a besoin, en une seule requête
// (prénom, avancement dans les cours, cartes de révision).
// Une requête au lieu de trois : l'accueil s'affiche d'un seul coup, plus vite.

function reponseJson(donnees, statut = 200) {
  return Response.json(donnees, {
    status: statut,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function gererAccueil(request, env, utilisateur) {
  if (request.method !== 'GET') {
    return reponseJson({ erreur: 'Méthode non autorisée' }, 405);
  }

  // Les trois lectures partent ensemble vers la base, en un seul aller-retour.
  const [progression, revisions, jour] = await env.DB_OINARRI.batch([
    env.DB_OINARRI.prepare(
      `SELECT cours, niveau_atteint, termine, mis_a_jour
       FROM progression
       WHERE utilisateur_id = ?`,
    ).bind(utilisateur.id),
    env.DB_OINARRI.prepare(
      `SELECT carte, prochaine_revision, intervalle_jours, repetitions
       FROM revisions
       WHERE utilisateur_id = ?`,
    ).bind(utilisateur.id),
    env.DB_OINARRI.prepare(`SELECT date('now') AS aujourdhui`),
  ]);

  return reponseJson({
    moi: {
      email: utilisateur.email,
      prenom: utilisateur.prenom,
      prenom_requis: !utilisateur.prenom,
    },
    progression: progression.results,
    revisions: {
      aujourdhui: jour.results[0].aujourdhui,
      revisions: revisions.results,
    },
  });
}
