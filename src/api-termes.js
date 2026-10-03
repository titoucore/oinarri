// Route /api/termes : glossaire personnel de l'utilisateur connecté.
//
// GET    /api/termes  -> ses termes
// POST   /api/termes  -> ajoute un terme { terme, categorie, definition }
// PUT    /api/termes  -> modifie un terme { id, categorie, definition }
// DELETE /api/termes  -> supprime un terme { id }
//
// Un terme n'existe qu'une fois par utilisateur (comparaison sans accent ni majuscule).
// Chaque requête ne touche que les lignes de l'utilisateur identifié.

import { normaliser } from './lib/texte.js';

export const CATEGORIES = [
  'Construction',
  'Matériaux',
  'Thermique',
  'Réglementation',
  'Urbanisme',
  'Promotion',
  'Financement',
  'Logement social',
  'Juridique',
  'Assurance',
  'Biosourcé',
  'Géosourcé',
  'Concepts',
];

const MAX_TERMES = 500;
const MAX_TERME = 80;
const MAX_DEFINITION = 600;
const COLONNES = 'id, terme, categorie, definition, cree_le, mis_a_jour';

function reponseJson(donnees, statut = 200) {
  return Response.json(donnees, {
    status: statut,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function gererTermes(request, env, utilisateur, url) {
  const base = env.DB_OINARRI;

  if (request.method === 'GET') {
    const { results } = await base
      .prepare(`SELECT ${COLONNES} FROM termes_perso WHERE utilisateur_id = ? ORDER BY cle`)
      .bind(utilisateur.id)
      .all();
    return reponseJson({ termes: results });
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
    const terme = typeof corps?.terme === 'string' ? corps.terme.trim().replace(/\s+/g, ' ') : '';
    const definition = typeof corps?.definition === 'string' ? corps.definition.trim() : '';
    const categorie = CATEGORIES.includes(corps?.categorie) ? corps.categorie : 'Concepts';
    const cle = normaliser(terme);

    if (!terme || !cle) return reponseJson({ erreur: 'Le terme est vide.' }, 400);
    if (terme.length > MAX_TERME) {
      return reponseJson({ erreur: `Terme trop long (${MAX_TERME} caractères au maximum).` }, 400);
    }
    if (!definition) return reponseJson({ erreur: 'La définition est vide.' }, 400);
    if (definition.length > MAX_DEFINITION) {
      return reponseJson(
        { erreur: `Définition trop longue (${MAX_DEFINITION} caractères au maximum).` },
        400,
      );
    }

    const total = await base
      .prepare('SELECT COUNT(*) AS n FROM termes_perso WHERE utilisateur_id = ?')
      .bind(utilisateur.id)
      .first();
    if ((total?.n ?? 0) >= MAX_TERMES) {
      return reponseJson({ erreur: 'Limite de termes atteinte. Supprime-en pour en ajouter.' }, 400);
    }

    try {
      const cree = await base
        .prepare(
          `INSERT INTO termes_perso (utilisateur_id, cle, terme, categorie, definition)
           VALUES (?, ?, ?, ?, ?)
           RETURNING ${COLONNES}`,
        )
        .bind(utilisateur.id, cle, terme, categorie, definition)
        .first();
      return reponseJson({ terme: cree }, 201);
    } catch (erreur) {
      if (String(erreur?.message ?? erreur).includes('UNIQUE')) {
        return reponseJson({ erreur: 'Ce terme est déjà dans ton glossaire.' }, 409);
      }
      throw erreur;
    }
  }

  const id = corps?.id;
  if (!Number.isInteger(id) || id < 1) return reponseJson({ erreur: 'Terme invalide' }, 400);

  if (request.method === 'PUT') {
    const definition = typeof corps.definition === 'string' ? corps.definition.trim() : '';
    const categorie = CATEGORIES.includes(corps.categorie) ? corps.categorie : 'Concepts';
    if (!definition) return reponseJson({ erreur: 'La définition est vide.' }, 400);
    if (definition.length > MAX_DEFINITION) {
      return reponseJson(
        { erreur: `Définition trop longue (${MAX_DEFINITION} caractères au maximum).` },
        400,
      );
    }
    const modifie = await base
      .prepare(
        `UPDATE termes_perso SET definition = ?, categorie = ?, mis_a_jour = datetime('now')
         WHERE id = ? AND utilisateur_id = ?
         RETURNING ${COLONNES}`,
      )
      .bind(definition, categorie, id, utilisateur.id)
      .first();
    if (!modifie) return reponseJson({ erreur: 'Terme introuvable' }, 404);
    return reponseJson({ terme: modifie });
  }

  // DELETE
  await base
    .prepare('DELETE FROM termes_perso WHERE id = ? AND utilisateur_id = ?')
    .bind(id, utilisateur.id)
    .run();
  return reponseJson({ ok: true });
}
