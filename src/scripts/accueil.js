// Accueil : salutation par prénom, « reprendre où tu en es » et compteur de révisions.
//
// Une seule requête (/api/accueil) récupère tout. L'affichage se fait ensuite en un seul
// temps, puis le contenu apparaît en fondu : pas de blocs qui surgissent un par un.

import { libelleEtat } from './progression.js';
import { cartesDues } from './revisions.js';

const section = document.getElementById('accueil');
const perso = document.getElementById('perso');
const salut = document.getElementById('salut');
const formulaire = document.getElementById('form-prenom');
const champ = document.getElementById('prenom');
const erreur = document.getElementById('erreur-prenom');

function afficherPrenom(moi) {
  perso.hidden = false;
  if (moi.prenom) {
    salut.textContent = 'Bonjour, ' + moi.prenom;
    salut.hidden = false;
    formulaire.hidden = true;
  } else {
    salut.hidden = true;
    formulaire.hidden = false;
  }
}

// « Reprendre où j'en suis », tous parcours confondus :
// 1. le chapitre commencé (non terminé) le plus récemment ;
// 2. à défaut, le premier chapitre disponible non terminé.
// Affiché seulement si l'utilisateur a déjà validé quelque chose.
function afficherReprise(progression) {
  const bloc = document.getElementById('reprise');
  if (!bloc) return;

  const chapitres = JSON.parse(bloc.dataset.chapitres);
  if (!chapitres.some((c) => progression.has(c.cours))) return;

  const titre = document.getElementById('reprise-titre');
  const etat = document.getElementById('reprise-etat');

  const entames = chapitres
    .filter((c) => progression.has(c.cours) && !progression.get(c.cours).termine)
    .sort((a, b) =>
      (progression.get(b.cours).mis_a_jour || '').localeCompare(
        progression.get(a.cours).mis_a_jour || '',
      ),
    );
  const cible = entames[0] ?? chapitres.find((c) => !progression.get(c.cours)?.termine);

  if (cible) {
    bloc.href = cible.href;
    titre.textContent = cible.titre;
    etat.textContent = libelleEtat(progression.get(cible.cours)) || 'Pas encore commencé';
  } else {
    bloc.href = '#parcours';
    titre.textContent = 'Tous les chapitres disponibles sont terminés';
    etat.textContent = 'Les suivants arrivent.';
  }
  bloc.hidden = false;
}

// Compteur de révisions : affiché seulement si au moins une carte est inscrite.
function afficherRevisions(donnees) {
  const lien = document.getElementById('revision-lien');
  if (!lien) return;

  const idsValides = new Set(JSON.parse(lien.dataset.cartes));
  const inscrites = donnees.revisions.filter((r) => idsValides.has(r.carte));
  if (!inscrites.length) return;

  const nombre = cartesDues(donnees, idsValides).length;
  document.getElementById('revision-texte').textContent =
    nombre > 0
      ? `${nombre} carte${nombre > 1 ? 's' : ''} à réviser`
      : "Rien à réviser aujourd'hui";
  lien.hidden = false;
}

formulaire.addEventListener('submit', async (evenement) => {
  evenement.preventDefault();
  erreur.hidden = true;
  const bouton = formulaire.querySelector('button');
  bouton.disabled = true;
  try {
    const reponse = await fetch('/api/moi', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prenom: champ.value }),
    });
    const donnees = await reponse.json();
    if (!reponse.ok) {
      erreur.textContent = donnees.erreur || "Impossible d'enregistrer le prénom.";
      erreur.hidden = false;
    } else {
      afficherPrenom(donnees);
    }
  } catch (e) {
    erreur.textContent = 'Connexion impossible. Réessaie dans un instant.';
    erreur.hidden = false;
  } finally {
    bouton.disabled = false;
  }
});

async function demarrer() {
  try {
    const reponse = await fetch('/api/accueil');
    if (reponse.ok) {
      const donnees = await reponse.json();
      afficherPrenom(donnees.moi);
      afficherReprise(new Map(donnees.progression.map((ligne) => [ligne.cours, ligne])));
      afficherRevisions(donnees.revisions);
    }
  } catch (e) {
    // Hors ligne ou API indisponible : l'accueil reste utilisable sans personnalisation.
  } finally {
    // Tout est en place : on révèle le contenu d'un seul coup.
    section?.classList.remove('attente');
  }
}

demarrer();
