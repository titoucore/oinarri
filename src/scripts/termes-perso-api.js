// Appels à /api/termes (glossaire personnel) et /api/expliquer (explication par Claude).

async function appeler(chemin, methode, corps) {
  const reponse = await fetch(chemin, {
    method: methode,
    headers: corps ? { 'Content-Type': 'application/json' } : undefined,
    body: corps ? JSON.stringify(corps) : undefined,
  });
  let donnees = null;
  try {
    donnees = await reponse.json();
  } catch {
    // Réponse sans contenu lisible : le message générique ci-dessous suffit.
  }
  if (!reponse.ok) {
    throw new Error(donnees?.erreur || "L'opération a échoué. Réessaie dans un instant.");
  }
  return donnees;
}

export async function lireTermesPerso() {
  return (await appeler('/api/termes', 'GET')).termes;
}

export async function creerTerme(terme) {
  return (await appeler('/api/termes', 'POST', terme)).terme;
}

export async function modifierTerme(id, categorie, definition) {
  return (await appeler('/api/termes', 'PUT', { id, categorie, definition })).terme;
}

export async function supprimerTerme(id) {
  await appeler('/api/termes', 'DELETE', { id });
}

export async function demanderExplication(passage, contexte) {
  return appeler('/api/expliquer', 'POST', { passage, contexte });
}
