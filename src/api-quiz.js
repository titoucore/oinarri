// Route /api/quiz : enregistrement et lecture des résultats de mini-quiz.
// Un score se compte en points : 2 points par question (juste = 2, en partie = 1, à revoir = 0),
// donc total = 2 x nombre de questions.

const NIVEAUX = ['essentiel', 'approfondir', 'expert'];
const COURS_VALIDE = /^[a-z0-9-]{1,40}\/[a-z0-9-]{1,80}$/;

function reponseJson(donnees, statut = 200) {
  return Response.json(donnees, {
    status: statut,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function gererQuiz(request, env, utilisateur, url) {
  if (request.method === 'GET') {
    const { results } = await env.DB_OINARRI.prepare(
      `SELECT cours, niveau, score, total
       FROM resultats_quiz
       WHERE utilisateur_id = ? AND niveau IS NOT NULL
       ORDER BY passe_le, id`,
    )
      .bind(utilisateur.id)
      .all();

    // Une entrée par cours et par niveau : dernier score et meilleur score.
    const regroupes = new Map();
    for (const ligne of results) {
      const cle = `${ligne.cours}#${ligne.niveau}`;
      const existant = regroupes.get(cle);
      regroupes.set(cle, {
        cours: ligne.cours,
        niveau: ligne.niveau,
        dernier: ligne.score,
        meilleur: Math.max(existant?.meilleur ?? 0, ligne.score),
        total: ligne.total,
      });
    }
    return reponseJson({ resultats: [...regroupes.values()] });
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

    const { cours, niveau, score, total } = corps ?? {};
    if (typeof cours !== 'string' || !COURS_VALIDE.test(cours)) {
      return reponseJson({ erreur: 'Cours invalide' }, 400);
    }
    if (!NIVEAUX.includes(niveau)) {
      return reponseJson({ erreur: 'Niveau invalide' }, 400);
    }
    if (
      !Number.isInteger(score) ||
      !Number.isInteger(total) ||
      total < 1 ||
      total > 200 ||
      score < 0 ||
      score > total
    ) {
      return reponseJson({ erreur: 'Score invalide' }, 400);
    }

    await env.DB_OINARRI.prepare(
      `INSERT INTO resultats_quiz (utilisateur_id, cours, niveau, score, total, passe_le)
       VALUES (?, ?, ?, ?, ?, datetime('now'))`,
    )
      .bind(utilisateur.id, cours, niveau, score, total)
      .run();
    return reponseJson({ cours, niveau, score, total });
  }

  return reponseJson({ erreur: 'Méthode non autorisée' }, 405);
}
