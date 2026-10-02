// Mini-quiz côté navigateur : questions une par une, correction immédiate,
// puis score enregistré. Chaque question vaut 2 points.
//   qcm / vf : juste = 2, faux = 0
//   ouverte  : le lecteur compare avec la réponse modèle et s'auto-évalue
//              (je savais = 2, en partie = 1, à revoir = 0)

import { LIBELLES } from './progression.js';

// Renvoie une Map "cours#niveau" -> { dernier, meilleur, total }, ou null si l'API est indisponible.
export async function chargerResultatsQuiz() {
  try {
    const reponse = await fetch('/api/quiz');
    if (!reponse.ok) return null;
    const donnees = await reponse.json();
    return new Map(donnees.resultats.map((r) => [`${r.cours}#${r.niveau}`, r]));
  } catch {
    return null;
  }
}

async function enregistrerResultat(cours, niveau, score, total) {
  const reponse = await fetch('/api/quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cours, niveau, score, total }),
  });
  if (!reponse.ok) throw new Error('Enregistrement impossible');
}

function el(balise, classe, texte) {
  const noeud = document.createElement(balise);
  if (classe) noeud.className = classe;
  if (texte !== undefined) noeud.textContent = texte;
  return noeud;
}

function bouton(classe, texte, action) {
  const b = el('button', classe, texte);
  b.type = 'button';
  b.addEventListener('click', action);
  return b;
}

export function creerQuiz({ cours, niveau, questions, resultat }) {
  const racine = el('section', 'quiz');
  racine.setAttribute('aria-label', `Mini-quiz ${LIBELLES[niveau]}`);
  const total = questions.length * 2;

  let index = 0;
  let points = 0;
  let ratees = [];
  let meilleur = resultat ? resultat.meilleur : null;
  let totalPrecedent = resultat ? resultat.total : null;

  function montrer() {
    racine.scrollIntoView({ block: 'nearest' });
  }

  function accueil() {
    racine.replaceChildren();
    racine.append(el('p', 'quiz-titre', `Mini-quiz · ${LIBELLES[niveau]}`));
    racine.append(
      el('p', 'quiz-info', `${questions.length} questions pour vérifier ce que tu retiens.`),
    );
    if (meilleur !== null) {
      racine.append(el('p', 'quiz-info', `Meilleur score : ${meilleur} / ${totalPrecedent}`));
    }
    racine.append(
      bouton('quiz-bouton', meilleur !== null ? 'Refaire le quiz' : 'Commencer le quiz', demarrer),
    );
  }

  function demarrer() {
    index = 0;
    points = 0;
    ratees = [];
    afficherQuestion();
  }

  function suivante() {
    index += 1;
    if (index < questions.length) afficherQuestion();
    else terminer();
  }

  function afficherQuestion() {
    racine.replaceChildren();
    const q = questions[index];
    racine.append(el('p', 'quiz-progression', `Question ${index + 1} sur ${questions.length}`));
    if (q.type === 'ouverte') questionOuverte(q);
    else questionChoix(q);
    montrer();
  }

  // QCM et vrai/faux partagent le même affichage.
  function questionChoix(q) {
    const estVF = q.type === 'vf';
    const enonce = estVF ? `${q.affirmation} Vrai ou faux ?` : q.question;
    const options = estVF ? ['Vrai', 'Faux'] : q.choix;
    const bonne = estVF ? (q.reponse ? 0 : 1) : q.reponse;

    racine.append(el('p', 'quiz-enonce', enonce));

    const boutons = options.map((texte, i) => {
      const b = bouton('quiz-choix', texte, () => repondre(i));
      racine.append(b);
      return b;
    });

    const retour = el('div', 'quiz-retour');
    retour.setAttribute('aria-live', 'polite');
    retour.hidden = true;
    racine.append(retour);

    function repondre(choisi) {
      const juste = choisi === bonne;
      boutons.forEach((b, i) => {
        b.disabled = true;
        if (i === bonne) {
          b.dataset.etat = 'juste';
          b.textContent = `✓ ${options[i]}`;
        } else if (i === choisi) {
          b.dataset.etat = 'faux';
          b.textContent = `✗ ${options[i]}`;
        }
      });
      if (juste) points += 2;
      else ratees.push(estVF ? q.affirmation : q.question);

      retour.replaceChildren(
        el('strong', undefined, juste ? 'Bonne réponse. ' : 'Pas tout à fait. '),
        document.createTextNode(q.explication),
      );
      retour.hidden = false;

      const dernier = index === questions.length - 1;
      racine.append(
        bouton('quiz-bouton', dernier ? 'Voir mon score' : 'Question suivante', suivante),
      );
    }
  }

  function questionOuverte(q) {
    racine.append(el('p', 'quiz-enonce', q.question));

    const champ = el('textarea');
    champ.rows = 3;
    champ.placeholder = 'Écris ta réponse ici (facultatif) ou formule-la dans ta tête.';
    champ.setAttribute('aria-label', 'Ta réponse');
    racine.append(champ);

    const voir = bouton('quiz-bouton', 'Voir la réponse modèle', () => {
      voir.hidden = true;
      champ.readOnly = true;

      const modele = el('div', 'quiz-retour');
      modele.append(el('strong', undefined, 'Réponse modèle. '), document.createTextNode(q.modele));
      racine.append(modele);

      racine.append(el('p', 'quiz-info', 'Compare avec ta réponse : où en es-tu ?'));
      const actions = el('div', 'quiz-actions');
      const choix = [
        ['Je savais', 2],
        ['En partie', 1],
        ['À revoir', 0],
      ];
      for (const [libelle, valeur] of choix) {
        actions.append(
          bouton('quiz-bouton quiz-bouton-secondaire', libelle, () => {
            points += valeur;
            if (valeur < 2) ratees.push(q.question);
            suivante();
          }),
        );
      }
      racine.append(actions);
    });
    racine.append(voir);
  }

  async function terminer() {
    racine.replaceChildren();
    racine.append(el('p', 'quiz-titre', `Résultat · ${LIBELLES[niveau]}`));
    racine.append(el('p', 'quiz-score', `${points} / ${total}`));

    const part = points / total;
    const message =
      part >= 0.8
        ? 'Très bien : tu peux valider ce niveau juste en dessous.'
        : part >= 0.5
          ? 'Correct. Relis les points à revoir, puis refais le quiz pour consolider.'
          : "Relis cette partie, puis refais le quiz : c'est en se testant qu'on retient.";
    racine.append(el('p', 'quiz-info', message));

    if (ratees.length) {
      racine.append(el('p', 'quiz-info', 'À revoir :'));
      const liste = el('ul', 'quiz-liste');
      for (const texte of ratees) liste.append(el('li', undefined, texte));
      racine.append(liste);
    }

    const statut = el('p', 'quiz-info', 'Enregistrement du résultat…');
    statut.setAttribute('aria-live', 'polite');
    racine.append(statut);

    const actions = el('div', 'quiz-actions');
    actions.append(bouton('quiz-bouton', 'Refaire le quiz', demarrer));
    actions.append(bouton('quiz-bouton quiz-bouton-secondaire', 'Fermer', accueil));
    racine.append(actions);
    montrer();

    try {
      await enregistrerResultat(cours, niveau, points, total);
      meilleur = meilleur !== null && totalPrecedent === total ? Math.max(meilleur, points) : points;
      totalPrecedent = total;
      statut.textContent = 'Résultat enregistré.';
    } catch {
      statut.textContent = "Le résultat n'a pas pu être enregistré (connexion).";
    }
  }

  accueil();
  return racine;
}
