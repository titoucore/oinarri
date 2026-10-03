// Route /api/scenarios : scénarios d'étude du simulateur de bilan, pour l'utilisateur connecté.
//
// GET    /api/scenarios           -> la liste de ses scénarios (sans le contenu)
// GET    /api/scenarios?id=<id>   -> un scénario avec son contenu
// POST   /api/scenarios           -> crée { nom, donnees }
// PUT    /api/scenarios           -> met à jour { id, donnees } et/ou renomme { id, nom }
// DELETE /api/scenarios           -> supprime { id }
//
// Le contenu est toujours renormalisé côté serveur (voir lib/bilan.js) : seuls les nombres attendus sont gardés.
// Chaque requête ne touche que les lignes de l'utilisateur identifié.

import { VERSION_FORMAT, normaliser } from './lib/bilan.js';

const MAX_SCENARIOS = 50;
const MAX_TAILLE = 10000; // caractères du JSON enregistré
const NOM_VALIDE = /^[\p{L}\p{N}][\p{L}\p{N} '’.,()+&/-]{0,79}$/u;

function reponseJson(donnees, statut = 200) {
  return Response.json(donnees, {
    status: statut,
    headers: { 'Cache-Control': 'no-store' },
  });
}

function serialiser(donnees) {
  if (!donnees || typeof donnees !== 'object') return null;
  const texte = JSON.stringify(normaliser(donnees));
  return texte.length <= MAX_TAILLE ? texte : null;
}

function conflitDeNom(erreur) {
  return String(erreur?.message ?? erreur).includes('UNIQUE');
}

export async function gererScenarios(request, env, utilisateur, url) {
  const base = env.DB_OINARRI;

  if (request.method === 'GET') {
    const idTexte = url.searchParams.get('id');
    if (idTexte !== null) {
      const id = Number(idTexte);
      if (!Number.isInteger(id) || id < 1) return reponseJson({ erreur: 'Scénario invalide' }, 400);
      const ligne = await base
        .prepare(
          `SELECT id, nom, donnees, version_format, mis_a_jour
           FROM scenarios WHERE id = ? AND utilisateur_id = ?`,
        )
        .bind(id, utilisateur.id)
        .first();
      if (!ligne) return reponseJson({ erreur: 'Scénario introuvable' }, 404);
      let donnees;
      try {
        donnees = normaliser(JSON.parse(ligne.donnees));
      } catch {
        return reponseJson({ erreur: 'Scénario illisible' }, 500);
      }
      return reponseJson({ scenario: { id: ligne.id, nom: ligne.nom, mis_a_jour: ligne.mis_a_jour, donnees } });
    }
    const { results } = await base
      .prepare('SELECT id, nom, mis_a_jour FROM scenarios WHERE utilisateur_id = ? ORDER BY mis_a_jour DESC, id DESC')
      .bind(utilisateur.id)
      .all();
    return reponseJson({ scenarios: results });
  }

  if (request.method !== 'POST' && request.method !== 'PUT' && request.method !== 'DELETE') {
    return reponseJson({ erreur: 'Méthode non autorisée' }, 405);
  }

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

  if (request.method === 'POST') {
    const nom = typeof corps?.nom === 'string' ? corps.nom.trim() : '';
    if (!NOM_VALIDE.test(nom)) {
      return reponseJson({ erreur: 'Nom invalide : 1 à 80 caractères, lettres, chiffres et ponctuation courante.' }, 400);
    }
    const donnees = serialiser(corps.donnees);
    if (!donnees) return reponseJson({ erreur: 'Scénario invalide ou trop volumineux' }, 400);

    const total = await base
      .prepare('SELECT COUNT(*) AS n FROM scenarios WHERE utilisateur_id = ?')
      .bind(utilisateur.id)
      .first();
    if ((total?.n ?? 0) >= MAX_SCENARIOS) {
      return reponseJson({ erreur: 'Limite de scénarios atteinte. Supprime-en pour en ajouter.' }, 400);
    }
    try {
      const creee = await base
        .prepare(
          `INSERT INTO scenarios (utilisateur_id, nom, donnees, version_format)
           VALUES (?, ?, ?, ?)
           RETURNING id, nom, mis_a_jour`,
        )
        .bind(utilisateur.id, nom, donnees, VERSION_FORMAT)
        .first();
      return reponseJson({ scenario: creee }, 201);
    } catch (erreur) {
      if (conflitDeNom(erreur)) return reponseJson({ erreur: 'Un scénario porte déjà ce nom.' }, 409);
      throw erreur;
    }
  }

  const id = corps?.id;
  if (!Number.isInteger(id) || id < 1) return reponseJson({ erreur: 'Scénario invalide' }, 400);

  if (request.method === 'PUT') {
    const nom = typeof corps.nom === 'string' ? corps.nom.trim() : null;
    if (nom !== null && !NOM_VALIDE.test(nom)) {
      return reponseJson({ erreur: 'Nom invalide : 1 à 80 caractères, lettres, chiffres et ponctuation courante.' }, 400);
    }
    const donnees = corps.donnees === undefined ? null : serialiser(corps.donnees);
    if (corps.donnees !== undefined && !donnees) {
      return reponseJson({ erreur: 'Scénario invalide ou trop volumineux' }, 400);
    }
    if (nom === null && donnees === null) return reponseJson({ erreur: 'Rien à modifier' }, 400);
    try {
      const modifiee = await base
        .prepare(
          `UPDATE scenarios
           SET nom = COALESCE(?, nom), donnees = COALESCE(?, donnees),
               version_format = CASE WHEN ? IS NULL THEN version_format ELSE ? END,
               mis_a_jour = datetime('now')
           WHERE id = ? AND utilisateur_id = ?
           RETURNING id, nom, mis_a_jour`,
        )
        .bind(nom, donnees, donnees, VERSION_FORMAT, id, utilisateur.id)
        .first();
      if (!modifiee) return reponseJson({ erreur: 'Scénario introuvable' }, 404);
      return reponseJson({ scenario: modifiee });
    } catch (erreur) {
      if (conflitDeNom(erreur)) return reponseJson({ erreur: 'Un scénario porte déjà ce nom.' }, 409);
      throw erreur;
    }
  }

  // DELETE
  await base.prepare('DELETE FROM scenarios WHERE id = ? AND utilisateur_id = ?').bind(id, utilisateur.id).run();
  return reponseJson({ ok: true });
}
