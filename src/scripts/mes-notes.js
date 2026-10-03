// Page « Mes notes » : toutes les notes et tous les passages surlignés, regroupés par chapitre.
// Chaque note se modifie sur place (enregistrement automatique), se supprime, et renvoie à son passage.

import '../styles/notes.css';
import { lireNotes } from './notes-api.js';
import { creerCarte } from './note-carte.js';
import { normaliser } from '../lib/texte.js';

const racine = document.getElementById('mes-notes');
const compte = document.getElementById('mes-notes-compte');
const recherche = document.getElementById('mes-notes-recherche');
const vide = document.getElementById('mes-notes-vide');
const erreur = document.getElementById('mes-notes-erreur');

function pluriel(n, mot) {
  return `${n} ${mot}${n > 1 ? 's' : ''}`;
}

async function demarrer() {
  let infos = {};
  try {
    infos = JSON.parse(document.getElementById('cours-data')?.textContent || '{}');
  } catch {
    infos = {};
  }

  let notes;
  try {
    notes = await lireNotes();
  } catch (e) {
    erreur.textContent = "Impossible de charger tes notes pour l'instant. Réessaie dans un instant.";
    erreur.hidden = false;
    return;
  }

  const parCours = new Map();
  for (const note of notes) {
    if (!parCours.has(note.cours)) parCours.set(note.cours, []);
    parCours.get(note.cours).push(note);
  }

  // Les chapitres suivent l'ordre des parcours ; un cours inconnu (retiré du site) passe à la fin.
  const ordre = [
    ...Object.keys(infos).filter((c) => parCours.has(c)),
    ...[...parCours.keys()].filter((c) => !(c in infos)),
  ];

  const entrees = []; // { carte, note, zone, groupe }
  const groupes = [];

  for (const cours of ordre) {
    const info = infos[cours];
    const groupe = document.createElement('section');
    groupe.className = 'mes-notes-groupe';

    const titre = document.createElement('h2');
    if (info?.href) {
      const lien = document.createElement('a');
      lien.href = info.href;
      lien.textContent = info.titre;
      titre.append(lien);
    } else {
      titre.textContent = info?.titre ?? cours;
    }
    groupe.append(titre);

    if (info?.parcours) {
      const parcours = document.createElement('p');
      parcours.className = 'mes-notes-parcours';
      parcours.textContent = info.parcours;
      groupe.append(parcours);
    }

    const conteneur = document.createElement('div');
    conteneur.className = 'mes-notes-liste';
    groupe.append(conteneur);
    racine.append(groupe);

    const entreesDuGroupe = [];
    groupes.push({ groupe, entrees: entreesDuGroupe });

    for (const note of parCours.get(cours)) {
      const element = creerCarte(note, {
        citationComplete: true,
        lien: info?.href
          ? { href: `${info.href}#note-${note.id}`, libelle: 'Voir dans le cours' }
          : null,
        apresSuppression: () => {
          const i = entrees.findIndex((e) => e.note.id === note.id);
          if (i >= 0) entrees.splice(i, 1);
          const j = entreesDuGroupe.findIndex((e) => e.note.id === note.id);
          if (j >= 0) entreesDuGroupe.splice(j, 1);
          if (!entreesDuGroupe.length) groupe.remove();
          majCompte();
        },
      });
      const entree = { carte: element.carte, note, zone: element.zone };
      entrees.push(entree);
      entreesDuGroupe.push(entree);
      conteneur.append(element.carte);
      element.ajuster();
    }
  }

  function majCompte() {
    const nombre = entrees.length;
    const chapitres = new Set(entrees.map((e) => e.note.cours)).size;
    vide.hidden = nombre > 0;
    recherche.hidden = nombre === 0;
    compte.textContent = nombre
      ? `${pluriel(nombre, 'note')} dans ${pluriel(chapitres, 'chapitre')}`
      : '';
  }

  recherche.addEventListener('input', () => {
    const q = normaliser(recherche.value);
    let visibles = 0;
    for (const { groupe, entrees: duGroupe } of groupes) {
      let reste = 0;
      for (const e of duGroupe) {
        const correspond = !q || normaliser(`${e.note.passage} ${e.zone.value}`).includes(q);
        e.carte.hidden = !correspond;
        if (correspond) reste++;
      }
      groupe.hidden = reste === 0;
      visibles += reste;
    }
    compte.textContent = q
      ? `${pluriel(visibles, 'note')} correspond${visibles > 1 ? 'ent' : ''} à ta recherche`
      : compte.dataset.total ?? compte.textContent;
  });

  majCompte();
  compte.dataset.total = compte.textContent;
}

if (racine && compte && recherche && vide && erreur) demarrer();
