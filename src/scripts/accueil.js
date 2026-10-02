// Accueil : salutation par prénom, « reprendre où tu en es » et compteur de révisions.
// Les appels API se font l'un après l'autre (et non en parallèle).

import { chargerProgression, libelleEtat } from './progression.js';
import { chargerRevisions, cartesDues } from './revisions.js';

const perso = document.getElementById('perso');
const salut = document.getElementById('salut');
const formulaire = document.getElementById('form-prenom');
const champ = document.getElementById('prenom');
const erreur = document.getElementById('erreur-prenom');

function afficher(moi) {
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

async function charger() {
  try {
    const reponse = await fetch('/api/moi');
    if (!reponse.ok) return;
    afficher(await reponse.json());
  } catch (e) {
    // Hors ligne ou API indisponible : la page reste utilisable sans salutation.
  }
}

// « Reprendre où j'en suis » : le premier chapitre disponible non terminé,
// affiché seulement si l'utilisateur a déjà validé quelque chose.
async function afficherReprise() {
  const bloc = document.getElementById('reprise');
  if (!bloc) return;
  const progression = await chargerProgression();
  if (!progression) return;

  const chapitres = JSON.parse(bloc.dataset.chapitres);
  if (!chapitres.some((c) => progression.has(c.cours))) return;

  const titre = document.getElementById('reprise-titre');
  const etat = document.getElementById('reprise-etat');
  const cible = chapitres.find((c) => !progression.get(c.cours)?.termine);

  if (cible) {
    bloc.href = cible.href;
    titre.textContent = cible.titre;
    etat.textContent = libelleEtat(progression.get(cible.cours)) || 'Pas encore commencé';
  } else {
    bloc.href = '/ba-ba/';
    titre.textContent = 'Tous les chapitres disponibles sont terminés';
    etat.textContent = 'Les suivants arrivent.';
  }
  bloc.hidden = false;
}

// Compteur de révisions : affiché seulement si au moins une carte est inscrite.
async function afficherRevisions() {
  const lien = document.getElementById('revision-lien');
  if (!lien) return;
  const donnees = await chargerRevisions();
  if (!donnees) return;

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
      afficher(donnees);
    }
  } catch (e) {
    erreur.textContent = 'Connexion impossible. Réessaie dans un instant.';
    erreur.hidden = false;
  } finally {
    bouton.disabled = false;
  }
});

async function demarrer() {
  await charger();
  await afficherReprise();
  await afficherRevisions();
}

demarrer();
