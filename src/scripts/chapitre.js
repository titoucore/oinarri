// Page d'un cours : à la fin de chaque niveau (Essentiel, Approfondir, Expert),
// on insère le mini-quiz puis le bouton de validation du niveau.
// Valider un niveau inscrit ses questions de quiz comme cartes de révision.
// La section « Vocabulaire » devient cliquable : chaque terme connu mène au glossaire.
// Les termes du glossaire dans le texte sont repérés par termes.js.

import './termes.js';
import {
  NIVEAUX,
  LIBELLES,
  chargerProgression,
  enregistrerProgression,
} from './progression.js';
import { chargerResultatsQuiz, creerQuiz } from './quiz.js';
import { chargerRevisions, inscrireCartes, cartesJusquaNiveau } from './revisions.js';
import { termes } from '../data/glossaire.js';
import { identifiant, normaliser } from '../lib/texte.js';

// Transforme la liste « Terme · Terme · Terme » de la section Vocabulaire en liens vers le glossaire.
// Un élément sans entrée dans le glossaire reste du texte simple. Le contenu entre parenthèses
// est ignoré pour la recherche (« Géotechnicien (G1 à G5) » retrouve « Géotechnicien »).
function lierVocabulaire() {
  const titre = document.getElementById('vocabulaire');
  const paragraphe = titre?.nextElementSibling;
  if (!paragraphe || paragraphe.tagName !== 'P') return;

  const index = new Map();
  for (const t of termes) {
    const id = identifiant(t.terme);
    index.set(normaliser(t.terme), id);
    for (const variante of t.aussi ?? []) index.set(normaliser(variante), id);
  }

  const elements = paragraphe.textContent
    .split('·')
    .map((texte) => texte.trim())
    .filter(Boolean);
  paragraphe.replaceChildren();

  elements.forEach((texte, i) => {
    if (i > 0) paragraphe.append(' · ');
    const id = index.get(normaliser(texte.replace(/\(.*?\)/g, '')));
    if (id) {
      const lien = document.createElement('a');
      lien.href = `/glossaire/#${id}`;
      lien.textContent = texte;
      paragraphe.append(lien);
    } else {
      paragraphe.append(texte);
    }
  });
}

async function initialiser() {
  const article = document.querySelector('.cours');
  if (!article) return;
  const cours = article.dataset.cours;

  lierVocabulaire();

  let quiz = {};
  try {
    quiz = JSON.parse(document.getElementById('quiz-data')?.textContent || '{}');
  } catch {
    quiz = {};
  }

  // Les appels API se font l'un après l'autre (et non en parallèle).
  const progression = await chargerProgression();
  const resultats = await chargerResultatsQuiz();
  const revisions = await chargerRevisions();

  const ligne = progression ? progression.get(cours) : null;
  let atteint = ligne ? NIVEAUX.indexOf(ligne.niveau_atteint) : -1;

  // Cartes déjà connues du serveur : on n'inscrit que les manquantes.
  const inscrites = new Set(revisions ? revisions.revisions.map((r) => r.carte) : []);

  // Inscrit les cartes des niveaux jusqu'à indexMax (sans bloquer ni alerter en cas d'échec).
  async function inscrireJusqua(indexMax) {
    const manquantes = cartesJusquaNiveau(cours, quiz, NIVEAUX, indexMax).filter(
      (id) => !inscrites.has(id),
    );
    if (!manquantes.length) return;
    try {
      await inscrireCartes(manquantes);
      for (const id of manquantes) inscrites.add(id);
    } catch {
      // Les cartes seront réinscrites au prochain passage sur cette page.
    }
  }

  const blocs = [];

  NIVEAUX.forEach((niveau, i) => {
    const titre = document.getElementById(niveau);
    if (!titre) return;

    // La fin du niveau = juste avant le titre de la section suivante.
    let suivant = titre.nextElementSibling;
    while (suivant && suivant.tagName !== 'H2') suivant = suivant.nextElementSibling;
    const inserer = (noeud) => (suivant ? suivant.before(noeud) : article.append(noeud));

    // 1. Le mini-quiz du niveau (s'il existe).
    const questions = quiz[niveau] || [];
    if (questions.length) {
      inserer(
        creerQuiz({
          cours,
          niveau,
          questions,
          resultat: resultats ? resultats.get(`${cours}#${niveau}`) : null,
        }),
      );
    }

    // 2. La validation du niveau (seulement si l'API de progression répond).
    if (!progression) return;

    const bloc = document.createElement('div');
    bloc.className = 'validation';

    const texte = document.createElement('p');
    texte.className = 'validation-texte';

    const valider = document.createElement('button');
    valider.type = 'button';
    valider.className = 'validation-bouton';
    valider.textContent = `Valider le niveau « ${LIBELLES[niveau]} »`;

    const annuler = document.createElement('button');
    annuler.type = 'button';
    annuler.className = 'validation-annuler';
    annuler.textContent = 'Annuler';

    const erreur = document.createElement('p');
    erreur.className = 'validation-erreur';
    erreur.setAttribute('role', 'alert');
    erreur.hidden = true;

    bloc.append(texte, valider, annuler, erreur);
    inserer(bloc);

    async function appliquer(nouveauNiveau) {
      valider.disabled = true;
      annuler.disabled = true;
      erreur.hidden = true;
      try {
        await enregistrerProgression(cours, nouveauNiveau);
        atteint = nouveauNiveau ? NIVEAUX.indexOf(nouveauNiveau) : -1;
        // Valider un niveau ajoute ses questions (et celles des niveaux précédents) à la révision.
        if (nouveauNiveau) await inscrireJusqua(atteint);
      } catch {
        erreur.textContent = "L'enregistrement a échoué. Réessaie dans un instant.";
        erreur.hidden = false;
      }
      valider.disabled = false;
      annuler.disabled = false;
      afficher();
    }

    valider.addEventListener('click', () => appliquer(niveau));
    // Annuler un niveau annule aussi ceux d'au-dessus : on revient au niveau précédent.
    // Les cartes déjà inscrites restent dans la révision.
    annuler.addEventListener('click', () => appliquer(i === 0 ? null : NIVEAUX[i - 1]));

    blocs.push({ i, niveau, bloc, texte, valider, annuler });
  });

  function afficher() {
    for (const { i, niveau, bloc, texte, valider, annuler } of blocs) {
      const acquis = i <= atteint;
      bloc.dataset.acquis = String(acquis);
      texte.textContent = acquis
        ? `Niveau « ${LIBELLES[niveau]} » acquis`
        : 'Tu as compris cette partie ? Valide-la pour suivre ta progression.';
      valider.hidden = acquis;
      annuler.hidden = !(acquis && i === atteint);
    }
  }

  afficher();

  // Rattrapage : un niveau déjà validé avant l'arrivée des révisions (ou après un échec réseau)
  // inscrit ses cartes au chargement de la page.
  if (revisions && atteint >= 0) await inscrireJusqua(atteint);
}

initialiser();
