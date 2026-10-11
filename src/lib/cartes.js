// Cartes de révision : trois sources de cartes.
// Utilisé au moment de la construction du site (pages Astro), pas dans le navigateur.
//
// 1. Chaque question d'un mini-quiz devient une carte.
//    Identifiant : "<cours>#<niveau>#<numéro de la question>".
//    Règle importante : le numéro est la position de la question dans le fichier YAML.
//    Pour ne pas fausser l'historique de révision, on ajoute les nouvelles questions
//    à la fin de leur niveau et on ne réordonne pas les questions existantes.
// 2. Chaque terme du glossaire est une carte de vocabulaire. Identifiant : "vocab/<terme>#mot".
//    Elle est inscrite quand on valide un niveau d'un chapitre dont la section « Vocabulaire »
//    contient le terme. Les propositions de réponse sont tirées au sort dans le navigateur.
// 3. Chaque exercice chiffré (src/data/exercices.js) est une carte. Identifiant : "exo/<id>".
//    Les valeurs changent à chaque tirage.

import { getCollection, getEntry } from 'astro:content';
import { termes } from '../data/glossaire.js';
import { EXERCICES } from '../data/exercices.js';
import { identifiant } from './texte.js';

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

  // Vocabulaire : un terme du glossaire = une carte.
  const vus = new Set();
  for (const t of termes) {
    const id = identifiant(t.terme);
    if (!/^[a-z0-9-]{1,80}$/.test(id) || vus.has(id)) continue;
    vus.add(id);
    cartes.push({
      carte: `vocab/${id}#mot`,
      type: 'vocab',
      titreCours: 'Vocabulaire',
      niveau: 'essentiel',
      groupe: 'vocab',
      href: `/glossaire/#${id}`,
      terme: t.terme,
      developpe: t.developpe ?? null,
      categorie: t.categorie ?? 'Concepts',
      definition: t.definition,
      enonce: '',
      reponse: '',
      explication: null,
    });
  }

  // Exercices chiffrés : les valeurs sont générées dans le navigateur.
  for (const e of EXERCICES) {
    const cours = await getEntry('cours', e.cours);
    cartes.push({
      carte: `exo/${e.id}`,
      type: 'exercice',
      exo: e.id,
      titreCours: cours?.data.titre ?? e.cours,
      niveau: e.niveau,
      groupe: e.cours,
      href: `/${e.cours}/`,
      enonce: '',
      reponse: '',
      explication: null,
    });
  }

  return cartes;
}
