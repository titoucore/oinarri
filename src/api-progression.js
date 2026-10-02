// Route /api/progression : lecture et mise à jour de l'avancement de l'utilisateur connecté.
// Chaque requête est limitée aux lignes de l'utilisateur identifié par Access.

const NIVEAUX = ['essentiel', 'approfondir', 'expert'];
// Identifiant d'un cours : "<parcours>/<fichier>", par exemple "ba-ba/01-qui-intervient".
const COURS_VALIDE = /^[a-z0-9-]{1,40}\/[a-z0-9-]{1,80}$/;

function reponseJson(donnees, statut = 200) {
  return Response.json(donnees, {
    status: statut,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function gererProgression(request, env, utilisateur, url) {
  if (request.method === 'GET') {
    const { results } = await env.DB_OINARRI.prepare(
      `SELECT cours, niveau_atteint, termine, mis_a_jour
       FROM progression
       WHERE utilisateur_id = ?`,
    )
      .bind(utilisateur.id)
      .all();
    return reponseJson({ progression: results });
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

    const cours = corps?.cours;
    const niveau = corps?.niveau;
    if (typeof cours !== 'string' || !COURS_VALIDE.test(cours)) {
      return reponseJson({ erreur: 'Cours invalide' }, 400);
    }

    // niveau = null : on retire la progression de ce cours.
    if (niveau === null) {
      await env.DB_OINARRI.prepare(
        'DELETE FROM progression WHERE utilisateur_id = ? AND cours = ?',
      )
        .bind(utilisateur.id, cours)
        .run();
      return reponseJson({ cours, niveau_atteint: null, termine: 0 });
    }

    if (!NIVEAUX.includes(niveau)) {
      return reponseJson({ erreur: 'Niveau invalide' }, 400);
    }

    // Un cours est terminé quand le niveau expert est atteint.
    const termine = niveau === 'expert' ? 1 : 0;
    await env.DB_OINARRI.prepare(
      `INSERT INTO progression (utilisateur_id, cours, niveau_atteint, termine, mis_a_jour)
       VALUES (?, ?, ?, ?, datetime('now'))
       ON CONFLICT(utilisateur_id, cours) DO UPDATE SET
         niveau_atteint = excluded.niveau_atteint,
         termine = excluded.termine,
         mis_a_jour = excluded.mis_a_jour`,
    )
      .bind(utilisateur.id, cours, niveau, termine)
      .run();
    return reponseJson({ cours, niveau_atteint: niveau, termine });
  }

  return reponseJson({ erreur: 'Méthode non autorisée' }, 405);
}
