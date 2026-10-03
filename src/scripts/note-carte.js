// Carte d'une note : le passage cité, la zone de texte (enregistrée automatiquement),
// et le bouton de suppression (en deux temps). Partagée par la marge d'un cours et la page « Mes notes ».

import { modifierNote, supprimerNote } from './notes-api.js';

// Notes dont la modification n'est pas encore envoyée : on les envoie quand la page passe en arrière-plan.
const enAttente = new Set();
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') for (const envoyer of [...enAttente]) envoyer();
});

// Raccourcit un texte sur une seule ligne logique.
export function abreger(texte, max) {
  const t = texte.replace(/\s+/g, ' ').trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

// options :
//   citationComplete  affiche tout le passage (page « Mes notes ») au lieu d'un extrait
//   surCitation       fonction appelée quand on touche le passage cité (la citation devient un bouton)
//   lien              { href, libelle } : lien vers le passage dans le cours
//   apresChangement   appelée quand la hauteur de la carte peut avoir changé
//   apresSuppression  appelée quand la note a été supprimée
export function creerCarte(note, options = {}) {
  const {
    citationComplete = false,
    surCitation = null,
    lien = null,
    apresChangement = () => {},
    apresSuppression = () => {},
  } = options;

  const carte = document.createElement('article');
  carte.className = 'note-carte';
  carte.dataset.id = String(note.id);
  carte.id = `carte-note-${note.id}`;

  const citation = document.createElement(surCitation ? 'button' : 'blockquote');
  citation.className = 'note-citation';
  if (surCitation) {
    citation.type = 'button';
    citation.addEventListener('click', surCitation);
  }
  citation.textContent = citationComplete ? note.passage : abreger(note.passage, 110);

  const orpheline = document.createElement('p');
  orpheline.className = 'note-orpheline';
  orpheline.textContent = 'Passage introuvable dans le cours actuel : il a sans doute été modifié.';
  orpheline.hidden = true;

  const zone = document.createElement('textarea');
  zone.className = 'note-texte';
  zone.rows = 2;
  zone.maxLength = 5000;
  zone.value = note.note;
  zone.placeholder = 'Ajouter une note';
  zone.setAttribute('aria-label', 'Note sur ce passage');

  const pied = document.createElement('div');
  pied.className = 'note-pied';

  const statut = document.createElement('span');
  statut.className = 'note-statut';
  statut.setAttribute('role', 'status');

  const supprimer = document.createElement('button');
  supprimer.type = 'button';
  supprimer.className = 'note-supprimer';
  supprimer.textContent = 'Supprimer';

  if (lien) {
    const a = document.createElement('a');
    a.className = 'note-lien';
    a.href = lien.href;
    a.textContent = lien.libelle;
    pied.append(a);
  }
  pied.append(statut, supprimer);
  carte.append(citation, orpheline, zone, pied);

  // La zone de texte grandit avec son contenu (à rappeler une fois la carte placée dans la page).
  function ajuster() {
    zone.style.height = 'auto';
    zone.style.height = `${zone.scrollHeight + 2}px`;
  }

  // ----- Enregistrement automatique -----

  let minuteur = null;
  let envoye = note.note;

  async function enregistrer() {
    if (minuteur) {
      clearTimeout(minuteur);
      minuteur = null;
    }
    enAttente.delete(enregistrer);
    const valeur = zone.value;
    if (valeur === envoye) return;
    statut.textContent = 'Enregistrement…';
    try {
      await modifierNote(note.id, valeur);
      envoye = valeur;
      statut.textContent = 'Enregistré';
    } catch {
      statut.textContent = "Échec de l'enregistrement";
    }
  }

  zone.addEventListener('input', () => {
    ajuster();
    statut.textContent = '';
    if (minuteur) clearTimeout(minuteur);
    minuteur = setTimeout(enregistrer, 800);
    enAttente.add(enregistrer);
    apresChangement();
  });
  zone.addEventListener('blur', enregistrer);

  // ----- Suppression en deux temps -----

  let confirmation = null;
  supprimer.addEventListener('click', async () => {
    if (!confirmation) {
      supprimer.textContent = 'Confirmer la suppression';
      confirmation = setTimeout(() => {
        supprimer.textContent = 'Supprimer';
        confirmation = null;
      }, 4000);
      return;
    }
    clearTimeout(confirmation);
    supprimer.disabled = true;
    try {
      await supprimerNote(note.id);
      enAttente.delete(enregistrer);
      carte.remove();
      apresSuppression(note);
    } catch {
      supprimer.disabled = false;
      supprimer.textContent = 'Supprimer';
      confirmation = null;
      statut.textContent = 'Échec de la suppression';
    }
  });

  return {
    carte,
    zone,
    ajuster,
    definirOrpheline(valeur) {
      orpheline.hidden = !valeur;
    },
  };
}
