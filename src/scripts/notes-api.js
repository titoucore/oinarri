// Appels à /api/notes (surlignages et notes), partagés par la page d'un cours et la page « Mes notes ».

async function appeler(methode, corps, requete = '') {
  const reponse = await fetch(`/api/notes${requete}`, {
    method: methode,
    headers: corps ? { 'Content-Type': 'application/json' } : undefined,
    body: corps ? JSON.stringify(corps) : undefined,
  });
  if (!reponse.ok) {
    let message = '';
    try {
      message = (await reponse.json()).erreur ?? '';
    } catch {
      // Réponse sans détail : le message générique ci-dessous suffit.
    }
    throw new Error(message || "L'enregistrement a échoué. Réessaie dans un instant.");
  }
  return reponse.json();
}

// Notes d'un cours, ou toutes les notes si aucun cours n'est donné.
export async function lireNotes(cours) {
  const requete = cours ? `?cours=${encodeURIComponent(cours)}` : '';
  return (await appeler('GET', null, requete)).notes;
}

export async function creerNote(note) {
  return (await appeler('POST', note)).note;
}

export async function modifierNote(id, texte) {
  return (await appeler('PUT', { id, note: texte })).note;
}

export async function supprimerNote(id) {
  await appeler('DELETE', { id });
}
