// Outils côté navigateur pour les cartes de révision.

// Renvoie { aujourdhui, revisions, parCarte } ou null si l'API est indisponible.
export async function chargerRevisions() {
  try {
    const reponse = await fetch('/api/revisions');
    if (!reponse.ok) return null;
    const donnees = await reponse.json();
    return {
      aujourdhui: donnees.aujourdhui,
      revisions: donnees.revisions,
      parCarte: new Map(donnees.revisions.map((r) => [r.carte, r])),
    };
  } catch {
    return null;
  }
}

// Ajoute des cartes à la révision (celles déjà inscrites sont ignorées côté serveur).
export async function inscrireCartes(cartes) {
  if (!cartes.length) return;
  const reponse = await fetch('/api/revisions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'inscrire', cartes }),
  });
  if (!reponse.ok) throw new Error('Inscription impossible');
}

// reussi = true (« je savais ») ou false (« à revoir »).
export async function noterCarte(carte, reussi) {
  const reponse = await fetch('/api/revisions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'noter', carte, reussi }),
  });
  if (!reponse.ok) throw new Error('Enregistrement impossible');
  return reponse.json();
}

// Identifiants des cartes d'un cours jusqu'à un niveau inclus (indexMax : 0 = essentiel…).
export function cartesJusquaNiveau(cours, quiz, niveaux, indexMax) {
  const ids = [];
  niveaux.forEach((niveau, i) => {
    if (i > indexMax) return;
    (quiz[niveau] || []).forEach((_, k) => ids.push(`${cours}#${niveau}#${k}`));
  });
  return ids;
}

// Cartes à réviser aujourd'hui : inscrites, connues du contenu, échéance atteinte.
export function cartesDues(donnees, idsValides) {
  return donnees.revisions
    .filter((r) => idsValides.has(r.carte) && r.prochaine_revision <= donnees.aujourdhui)
    .sort((a, b) => a.prochaine_revision.localeCompare(b.prochaine_revision));
}
