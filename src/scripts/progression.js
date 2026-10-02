// Outils côté navigateur pour l'avancement de l'utilisateur.
// Partagés par l'accueil, la liste du B.A.-BA et les pages de cours.

export const NIVEAUX = ['essentiel', 'approfondir', 'expert'];

export const LIBELLES = {
  essentiel: 'Essentiel',
  approfondir: 'Approfondir',
  expert: 'Expert',
};

// Renvoie une Map "identifiant du cours" -> ligne d'avancement,
// ou null si l'API est indisponible (hors ligne, non connecté…).
export async function chargerProgression() {
  try {
    const reponse = await fetch('/api/progression');
    if (!reponse.ok) return null;
    const donnees = await reponse.json();
    return new Map(donnees.progression.map((ligne) => [ligne.cours, ligne]));
  } catch {
    return null;
  }
}

// niveau = 'essentiel' | 'approfondir' | 'expert', ou null pour effacer l'avancement.
export async function enregistrerProgression(cours, niveau) {
  const reponse = await fetch('/api/progression', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cours, niveau }),
  });
  if (!reponse.ok) throw new Error('Enregistrement impossible');
  return reponse.json();
}

// Texte court décrivant l'avancement, ou null si le cours n'est pas commencé.
export function libelleEtat(ligne) {
  if (!ligne) return null;
  if (ligne.termine) return 'Terminé';
  return `${LIBELLES[ligne.niveau_atteint]} acquis`;
}
