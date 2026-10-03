// Route /api/notes : surlignages et notes de l'utilisateur connecté.
//
// GET    /api/notes                -> toutes ses notes
// GET    /api/notes?cours=<cours>  -> les notes d'un cours
// POST   /api/notes                -> crée un surlignage { cours, section, passage, avant, apres, note }
// PUT    /api/notes                -> modifie le texte d'une note { id, note }
// DELETE /api/notes                -> supprime un surlignage et sa note { id }
//
// Chaque requête ne touche que les lignes de l'utilisateur identifié.

// Identifiant d'un cours : "<parcours>/<fichier>", par exemple "promotion/02-le-foncier".
const COURS_VALIDE = /^[a-z0-9-]{1,40}\/[a-z0-9-]{1,80}$/;
const SECTION_VALIDE = /^[\p{L}\p{N}_-]{1,120}$/u;

const MAX_NOTES = 2000;
const MAX_PASSAGE = 2000;
const MAX_CONTEXTE = 120;
const MAX_NOTE = 5000;

const COLONNES = 'id, cours, section, passage, avant, apres, note, cree_le, mis_a_jour';

function reponseJson(donnees, statut = 200) {
  return Response.json(donnees, {
    status: statut,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function gererNotes(request, env, utilisateur, url) {
  const base = env.DB_OINARRI;

  if (request.method === 'GET') {
    const cours = url.searchParams.get('cours');
    if (cours !== null && !COURS_VALIDE.test(cours)) {
      return reponseJson({ erreur: 'Cours invalide' }, 400);
    }
    const requete =
      cours === null
        ? base
            .prepare(`SELECT ${COLONNES} FROM notes WHERE utilisateur_id = ? ORDER BY cours, id`)
            .bind(utilisateur.id)
        : base
            .prepare(`SELECT ${COLONNES} FROM notes WHERE utilisateur_id = ? AND cours = ? ORDER BY id`)
            .bind(utilisateur.id, cours);
    const { results } = await requete.all();
    return reponseJson({ notes: results });
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
    const cours = corps?.cours;
    const passage = typeof corps?.passage === 'string' ? corps.passage.trim() : '';
    if (typeof cours !== 'string' || !COURS_VALIDE.test(cours)) {
      return reponseJson({ erreur: 'Cours invalide' }, 400);
    }
    if (!passage) return reponseJson({ erreur: 'Passage vide' }, 400);
    if (passage.length > MAX_PASSAGE) {
      return reponseJson({ erreur: `Passage trop long (${MAX_PASSAGE} caractères au maximum).` }, 400);
    }

    const section =
      typeof corps.section === 'string' && SECTION_VALIDE.test(corps.section) ? corps.section : null;
    // Le contexte sert seulement à départager deux passages identiques : on le borne sans refuser.
    const avant = typeof corps.avant === 'string' ? corps.avant.slice(-MAX_CONTEXTE) : '';
    const apres = typeof corps.apres === 'string' ? corps.apres.slice(0, MAX_CONTEXTE) : '';
    const note = typeof corps.note === 'string' ? corps.note : '';
    if (note.length > MAX_NOTE) {
      return reponseJson({ erreur: `Note trop longue (${MAX_NOTE} caractères au maximum).` }, 400);
    }

    const total = await base
      .prepare('SELECT COUNT(*) AS n FROM notes WHERE utilisateur_id = ?')
      .bind(utilisateur.id)
      .first();
    if ((total?.n ?? 0) >= MAX_NOTES) {
      return reponseJson({ erreur: 'Limite de notes atteinte. Supprime-en pour en ajouter.' }, 400);
    }

    const creee = await base
      .prepare(
        `INSERT INTO notes (utilisateur_id, cours, section, passage, avant, apres, note)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         RETURNING ${COLONNES}`,
      )
      .bind(utilisateur.id, cours, section, passage, avant, apres, note)
      .first();
    return reponseJson({ note: creee }, 201);
  }

  const id = corps?.id;
  if (!Number.isInteger(id) || id < 1) return reponseJson({ erreur: 'Note invalide' }, 400);

  if (request.method === 'PUT') {
    const note = typeof corps.note === 'string' ? corps.note : null;
    if (note === null) return reponseJson({ erreur: 'Note manquante' }, 400);
    if (note.length > MAX_NOTE) {
      return reponseJson({ erreur: `Note trop longue (${MAX_NOTE} caractères au maximum).` }, 400);
    }
    const modifiee = await base
      .prepare(
        `UPDATE notes SET note = ?, mis_a_jour = datetime('now')
         WHERE id = ? AND utilisateur_id = ?
         RETURNING ${COLONNES}`,
      )
      .bind(note, id, utilisateur.id)
      .first();
    if (!modifiee) return reponseJson({ erreur: 'Note introuvable' }, 404);
    return reponseJson({ note: modifiee });
  }

  // DELETE
  await base
    .prepare('DELETE FROM notes WHERE id = ? AND utilisateur_id = ?')
    .bind(id, utilisateur.id)
    .run();
  return reponseJson({ ok: true });
}
