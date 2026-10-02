// Cartes de révision : chaque question d'un mini-quiz devient une carte.
// Utilisé au moment de la construction du site (pages Astro), pas dans le navigateur.
//
// Identifiant d'une carte : "<cours>#<niveau>#<numéro de la question>".
// Règle importante : le numéro est la position de la question dans le fichier YAML.
// Pour ne pas fausser l'historique de révision, on ajoute les nouvelles questions
// à la fin de leur niveau et on ne réordonne pas les questions existantes.

import { getCollection, getEntry } from 'astro:content';

const NIVEAUX = ['essentiel', 'approfondir', 'expert'];

// Transforme une question de quiz en recto/verso de carte.
function versCarte(question) {
  if (question.type === 'qcm') {
    return {
      type: 'qcm',
      enonce: question.question,
      choix: question.choix,
      reponse: question.choix[question.reponse] ?? '',
      explication: question.explication,
    };
  }
  if (question.type === 'vf') {
    return {
      type: 'vf',
      enonce: `${question.affirmation} Vrai ou faux ?`,
      reponse: question.reponse ? 'Vrai' : 'Faux',
      explication: question.explication,
    };
  }
  return {
    type: 'ouverte',
    enonce: question.question,
    reponse: question.modele,
    explication: null,
  };
}

export async function listerCartes() {
  const quiz = await getCollection('quiz');
  const cartes = [];
  for (const fichier of quiz) {
    const cours = await getEntry('cours', fichier.id);
    for (const niveau of NIVEAUX) {
      (fichier.data[niveau] ?? []).forEach((question, indice) => {
        cartes.push({
          carte: `${fichier.id}#${niveau}#${indice}`,
          titreCours: cours?.data.titre ?? fichier.id,
          niveau,
          ...versCarte(question),
        });
      });
    }
  }
  return cartes;
}
