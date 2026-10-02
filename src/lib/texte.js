// Outils de texte partagés (build et navigateur) pour le glossaire.

// Met un texte sous forme comparable : minuscules, sans accents, sans ponctuation.
// « Maître d'œuvre » devient « maitre d oeuvre ».
export function normaliser(texte) {
  return String(texte)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// Identifiant d'un terme, utilisé comme ancre : « maitre-d-oeuvre ».
export function identifiant(terme) {
  return normaliser(terme).replace(/ /g, '-');
}
