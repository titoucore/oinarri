// Page /revisions/ : série de cartes à réviser, une à la fois.
// Recto : la question. Verso : la réponse et l'explication.
// L'utilisateur s'auto-évalue (je savais / à revoir) et la prochaine échéance est planifiée.

import { LIBELLES } from './progression.js';
import { chargerRevisions, noterCarte, cartesDues } from './revisions.js';

const TAILLE_SERIE = 20;

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

function lien(classe, texte, href) {
  const a = el('a', classe, texte);
  a.href = href;
  return a;
}

function formaterDate(jour) {
  return new Date(`${jour}T00:00:00Z`).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });
}

async function demarrer() {
  const zone = document.getElementById('revision');
  const donneesCartes = document.getElementById('cartes-data');
  if (!zone || !donneesCartes) return;

  const cartes = JSON.parse(donneesCartes.textContent || '[]');
  const parId = new Map(cartes.map((c) => [c.carte, c]));

  function message(texte, ...suite) {
    zone.replaceChildren(el('p', 'rev-message', texte), ...suite);
  }

  const donnees = await chargerRevisions();
  if (!donnees) {
    message("Impossible de charger tes révisions pour le moment. Réessaie dans un instant.");
    return;
  }

  const inscrites = donnees.revisions.filter((r) => parId.has(r.carte));
  if (!inscrites.length) {
    message(
      "Aucune carte pour l'instant. Quand tu valides un niveau dans un chapitre, ses questions de quiz deviennent des cartes de révision.",
      lien('rev-bouton', 'Aller au B.A.-BA', '/ba-ba/'),
    );
    return;
  }

  const dues = cartesDues(donnees, new Set(parId.keys()));
  if (!dues.length) {
    const prochaine = inscrites.map((r) => r.prochaine_revision).sort()[0];
    message(
      `Rien à réviser aujourd'hui. Prochaine carte le ${formaterDate(prochaine)}.`,
      lien('rev-bouton rev-bouton-secondaire', "Retour à l'accueil", '/'),
    );
    return;
  }

  const serie = dues.slice(0, TAILLE_SERIE);
  const restantes = dues.length - serie.length;
  let index = 0;
  let sues = 0;
  const arevoir = [];

  function afficherCarte() {
    const carte = parId.get(serie[index].carte);
    zone.replaceChildren();

    zone.append(el('p', 'rev-progression', `Carte ${index + 1} sur ${serie.length}`));
    zone.append(el('p', 'rev-origine', `${carte.titreCours} · ${LIBELLES[carte.niveau]}`));
    zone.append(el('p', 'rev-enonce', carte.enonce));

    if (carte.type === 'qcm') {
      const liste = el('ul', 'rev-choix');
      for (const choix of carte.choix) liste.append(el('li', undefined, choix));
      zone.append(liste);
    }

    const voir = bouton('rev-bouton', 'Voir la réponse', () => {
      voir.hidden = true;

      const verso = el('div', 'rev-verso');
      verso.append(el('p', 'rev-reponse', carte.reponse));
      if (carte.explication) verso.append(el('p', 'rev-explication', carte.explication));
      zone.append(verso);

      zone.append(el('p', 'rev-info', 'Où en es-tu sur cette carte ?'));
      const actions = el('div', 'rev-actions');
      const erreur = el('p', 'rev-erreur');
      erreur.setAttribute('role', 'alert');
      erreur.hidden = true;

      async function noter(reussi) {
        for (const b of actions.querySelectorAll('button')) b.disabled = true;
        erreur.hidden = true;
        try {
          await noterCarte(carte.carte, reussi);
        } catch {
          erreur.textContent = "L'enregistrement a échoué. Réessaie.";
          erreur.hidden = false;
          for (const b of actions.querySelectorAll('button')) b.disabled = false;
          return;
        }
        if (reussi) sues += 1;
        else arevoir.push(carte);
        index += 1;
        if (index < serie.length) afficherCarte();
        else terminer();
      }

      actions.append(bouton('rev-bouton', 'Je savais', () => noter(true)));
      actions.append(bouton('rev-bouton rev-bouton-secondaire', 'À revoir', () => noter(false)));
      zone.append(actions, erreur);
    });
    zone.append(voir);
  }

  function terminer() {
    zone.replaceChildren();
    zone.append(el('p', 'rev-titre', 'Série terminée'));
    zone.append(el('p', 'rev-score', `${sues} / ${serie.length}`));
    zone.append(el('p', 'rev-info', 'cartes sues du premier coup.'));

    if (arevoir.length) {
      zone.append(el('p', 'rev-info', 'Elles reviendront demain :'));
      const liste = el('ul', 'rev-choix');
      for (const carte of arevoir) liste.append(el('li', undefined, carte.enonce));
      zone.append(liste);
    }

    if (restantes > 0) {
      zone.append(
        el('p', 'rev-info', `Il reste ${restantes} carte${restantes > 1 ? 's' : ''} à réviser aujourd'hui.`),
      );
    }

    const actions = el('div', 'rev-actions');
    if (restantes > 0) {
      actions.append(bouton('rev-bouton', 'Continuer', () => location.reload()));
    }
    actions.append(lien('rev-bouton rev-bouton-secondaire', "Retour à l'accueil", '/'));
    zone.append(actions);
  }

  afficherCarte();
}

demarrer();
