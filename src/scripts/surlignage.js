// Surlignages et notes dans un cours.
//
// - Sélectionner du texte fait apparaître une barre « Surligner » (souris et doigt).
// - Un surlignage est enregistré avec le passage, quelques mots de contexte et une note facultative.
// - Les notes s'affichent dans la marge de droite, en face de leur passage (grand écran),
//   ou dans un tiroir (écran étroit).
// - Si le cours change et que le passage n'existe plus, la note est conservée, marquée « introuvable ».
//
// Le texte du cours est repéré par sa position dans le texte brut (index), pas par le HTML :
// les termes du glossaire ou d'autres surlignages ne perturbent donc pas la recherche.

import '../styles/notes.css';
import { lireNotes, creerNote } from './notes-api.js';
import { creerCarte } from './note-carte.js';

const article = document.querySelector('.cours');
const marge = document.getElementById('notes-marge');
const liste = document.getElementById('notes-liste');
const vide = document.getElementById('notes-vide');
const bouton = document.getElementById('notes-bouton');
const compte = document.getElementById('notes-compte');
const voile = document.getElementById('notes-voile');

const IGNORES = '.quiz, .validation, .terme-bulle';
const CONTEXTE = 40;
const MAX_PASSAGE = 2000;

// ---------- Index du texte du cours ----------

function indexer() {
  const noeuds = [];
  let plein = '';
  const marcheur = document.createTreeWalker(article, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) =>
      n.parentElement?.closest(IGNORES) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
  });
  while (marcheur.nextNode()) {
    const noeud = marcheur.currentNode;
    noeuds.push({ noeud, debut: plein.length });
    plein += noeud.nodeValue;
  }
  return { noeuds, plein };
}

// Position (début, fin) de la sélection dans le texte brut, espaces de bord retirés.
function intervalle(idx, range) {
  let debut = null;
  let fin = null;
  for (const e of idx.noeuds) {
    if (!range.intersectsNode(e.noeud)) continue;
    const longueur = e.noeud.nodeValue.length;
    const a = e.noeud === range.startContainer ? range.startOffset : 0;
    const b = e.noeud === range.endContainer ? range.endOffset : longueur;
    if (b <= a) continue;
    if (debut === null) debut = e.debut + a;
    fin = e.debut + b;
  }
  if (debut === null) return null;
  while (debut < fin && /\s/.test(idx.plein[debut])) debut++;
  while (fin > debut && /\s/.test(idx.plein[fin - 1])) fin--;
  return fin > debut ? { debut, fin } : null;
}

// Retrouve un passage enregistré. S'il apparaît plusieurs fois, le contexte départage.
function localiser(plein, note) {
  const { passage, avant, apres } = note;
  let meilleur = -1;
  let score = -1;
  let i = plein.indexOf(passage);
  while (i !== -1) {
    let s = 0;
    if (avant && plein.slice(Math.max(0, i - avant.length), i) === avant) s += 2;
    if (apres && plein.slice(i + passage.length, i + passage.length + apres.length) === apres) s += 2;
    if (s > score) {
      score = s;
      meilleur = i;
    }
    i = plein.indexOf(passage, i + 1);
  }
  return meilleur === -1 ? null : { debut: meilleur, fin: meilleur + passage.length };
}

function chevauche(idx, debut, fin) {
  for (const e of idx.noeuds) {
    const a = Math.max(debut, e.debut);
    const b = Math.min(fin, e.debut + e.noeud.nodeValue.length);
    if (b > a && e.noeud.parentElement?.closest('mark.surlignage')) return true;
  }
  return false;
}

// Entoure d'un <mark> chaque morceau de texte compris entre debut et fin.
function envelopper(idx, debut, fin, id) {
  const marques = [];
  for (const e of idx.noeuds) {
    const longueur = e.noeud.nodeValue.length;
    const a = Math.max(debut, e.debut) - e.debut;
    const b = Math.min(fin, e.debut + longueur) - e.debut;
    if (b <= a) continue;
    if (!/\S/.test(e.noeud.nodeValue.slice(a, b))) continue;
    const range = document.createRange();
    range.setStart(e.noeud, a);
    range.setEnd(e.noeud, b);
    const marque = document.createElement('mark');
    marque.className = 'surlignage';
    marque.dataset.note = String(id);
    range.surroundContents(marque);
    marques.push(marque);
  }
  return marques;
}

function retirerMarques(marques) {
  for (const marque of marques) {
    const parent = marque.parentNode;
    if (!parent) continue;
    while (marque.firstChild) parent.insertBefore(marque.firstChild, marque);
    parent.removeChild(marque);
    parent.normalize();
  }
}

// Identifiant du titre de niveau 2 sous lequel se trouve un noeud.
function sectionDe(noeud) {
  let el = noeud.nodeType === Node.ELEMENT_NODE ? noeud : noeud.parentElement;
  el = el?.closest('.cours > *') ?? null;
  while (el && el.tagName !== 'H2') el = el.previousElementSibling;
  return el?.id || null;
}

// ---------- Programme principal ----------

async function demarrer() {
  const cours = article.dataset.cours;
  const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const largeur = matchMedia('(min-width: 64rem)');
  const notes = []; // { donnees, marques, carte, zone, ajuster, definirOrpheline }
  let mode = 'marge';

  let existantes;
  try {
    existantes = await lireNotes(cours);
  } catch {
    return; // Sans l'API, le surlignage reste désactivé et la zone de notes cachée.
  }

  // ----- Message bref -----

  let toast = null;
  let minuteurToast = null;
  function message(texte) {
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'notes-toast';
      toast.setAttribute('role', 'status');
      document.body.append(toast);
    }
    toast.textContent = texte;
    toast.hidden = false;
    clearTimeout(minuteurToast);
    minuteurToast = setTimeout(() => {
      toast.hidden = true;
    }, 3500);
  }

  // ----- Présentation : marge ou tiroir -----

  function ajusterTout() {
    for (const n of notes) n.ajuster();
  }

  // Place chaque carte en face de son passage, sans chevauchement (mode marge).
  function disposer() {
    if (mode !== 'marge') {
      for (const n of notes) n.carte.style.top = '';
      return;
    }
    const origine = liste.getBoundingClientRect().top;
    const positions = notes
      .map((n) => ({
        n,
        y: n.marques[0] ? n.marques[0].getBoundingClientRect().top - origine : Infinity,
      }))
      .sort((a, b) => a.y - b.y);
    let bas = 0;
    for (const { n, y } of positions) {
      const haut = Math.max(Number.isFinite(y) ? y : bas, bas);
      n.carte.style.top = `${haut}px`;
      bas = haut + n.carte.offsetHeight + 8;
    }
  }

  let planifie = false;
  function planifier() {
    if (planifie) return;
    planifie = true;
    requestAnimationFrame(() => {
      planifie = false;
      disposer();
    });
  }

  function ouvrirTiroir(ouvert) {
    marge.dataset.ouvert = String(ouvert);
    voile.hidden = !ouvert;
    bouton.setAttribute('aria-expanded', String(ouvert));
    if (ouvert) ajusterTout();
  }

  function appliquerMode() {
    mode = largeur.matches ? 'marge' : 'tiroir';
    marge.dataset.mode = mode;
    ouvrirTiroir(false);
    ajusterTout();
    disposer();
  }

  // ----- Liste des notes -----

  function majEtat() {
    vide.hidden = notes.length > 0;
    compte.textContent = notes.length ? ` (${notes.length})` : '';
  }

  // Les cartes suivent l'ordre du cours ; celles dont le passage est introuvable passent à la fin.
  function trier() {
    const ordre = [...notes].sort((a, b) => {
      const ma = a.marques[0];
      const mb = b.marques[0];
      if (ma && mb) return ma.compareDocumentPosition(mb) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      if (ma) return -1;
      if (mb) return 1;
      return a.donnees.id - b.donnees.id;
    });
    for (const n of ordre) liste.append(n.carte);
  }

  function eclair(entree) {
    for (const m of entree.marques) m.classList.add('flash');
    setTimeout(() => {
      for (const m of entree.marques) m.classList.remove('flash');
    }, 1200);
  }

  function activer(entree, { ouvrir = false, focus = false, centrer = false } = {}) {
    for (const n of notes) {
      n.carte.dataset.actif = String(n === entree);
      for (const m of n.marques) m.classList.toggle('actif', n === entree);
    }
    if (ouvrir && mode === 'tiroir') {
      ouvrirTiroir(true);
      entree.carte.scrollIntoView({ block: 'nearest' });
    }
    if (centrer && entree.marques[0]) {
      entree.marques[0].scrollIntoView({ block: 'center', behavior: reduit ? 'auto' : 'smooth' });
      eclair(entree);
    }
    if (focus) entree.zone.focus({ preventScroll: true });
  }

  function aller(entree) {
    if (!entree.marques[0]) return;
    if (mode === 'tiroir') ouvrirTiroir(false);
    activer(entree, { centrer: true });
  }

  function supprimee(entree) {
    retirerMarques(entree.marques);
    notes.splice(notes.indexOf(entree), 1);
    majEtat();
    disposer();
  }

  function ajouter(donnees) {
    const idx = indexer();
    const position = localiser(idx.plein, donnees);
    let marques = [];
    if (position && !chevauche(idx, position.debut, position.fin)) {
      marques = envelopper(idx, position.debut, position.fin, donnees.id);
    }

    const element = creerCarte(donnees, {
      surCitation: () => aller(entree),
      apresChangement: planifier,
      apresSuppression: () => supprimee(entree),
    });
    const entree = { donnees, marques, ...element };
    element.definirOrpheline(marques.length === 0);
    notes.push(entree);
    liste.append(element.carte);
    trier();
    majEtat();
    element.ajuster();
    disposer();
    return entree;
  }

  // ----- Création d'un surlignage depuis la sélection -----

  async function surligner(range) {
    const idx = indexer();
    const place = intervalle(idx, range);
    if (!place) return;
    if (chevauche(idx, place.debut, place.fin)) {
      message('Ce passage chevauche déjà un surlignage.');
      return;
    }
    const passage = idx.plein.slice(place.debut, place.fin);
    if (passage.length > MAX_PASSAGE) {
      message(`Passage trop long : ${MAX_PASSAGE} caractères au maximum.`);
      return;
    }
    try {
      const donnees = await creerNote({
        cours,
        section: sectionDe(range.startContainer),
        passage,
        avant: idx.plein.slice(Math.max(0, place.debut - CONTEXTE), place.debut),
        apres: idx.plein.slice(place.fin, place.fin + CONTEXTE),
        note: '',
      });
      const entree = ajouter(donnees);
      activer(entree);
      if (mode === 'tiroir') message('Passage surligné. Ajoute une note depuis le bouton « Notes ».');
    } catch (erreur) {
      message(erreur.message);
    }
  }

  // ----- Barre de sélection -----

  const barre = document.createElement('div');
  barre.className = 'barre-selection';
  barre.hidden = true;
  barre.setAttribute('role', 'toolbar');
  barre.setAttribute('aria-label', 'Actions sur la sélection');
  const boutonSurligner = document.createElement('button');
  boutonSurligner.type = 'button';
  boutonSurligner.textContent = 'Surligner';
  barre.append(boutonSurligner);
  document.body.append(barre);

  let rangeCourant = null;
  let figee = false; // vrai pendant qu'on touche la barre : la sélection peut alors disparaître sans la fermer
  let souris = false;

  function masquerBarre() {
    barre.hidden = true;
    rangeCourant = null;
  }

  function afficherBarre(range) {
    barre.hidden = false;
    const r = range.getBoundingClientRect();
    const tactile = matchMedia('(pointer: coarse)').matches;
    // Au doigt, le menu du système s'affiche au-dessus de la sélection : on se place en dessous.
    let haut = tactile ? r.bottom + 12 : r.top - barre.offsetHeight - 8;
    if (haut < 8) haut = r.bottom + 8;
    const gauche = Math.min(
      Math.max(8, r.left + r.width / 2 - barre.offsetWidth / 2),
      window.innerWidth - barre.offsetWidth - 8,
    );
    barre.style.top = `${haut + window.scrollY}px`;
    barre.style.left = `${gauche + window.scrollX}px`;
  }

  function mettreAJourSelection() {
    if (figee || souris) return;
    const selection = getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) return masquerBarre();
    const range = selection.getRangeAt(0);
    if (!article.contains(range.commonAncestorContainer)) return masquerBarre();
    const element =
      range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
        ? range.commonAncestorContainer
        : range.commonAncestorContainer.parentElement;
    if (element?.closest(IGNORES)) return masquerBarre();
    if (selection.toString().trim().length < 2) return masquerBarre();
    rangeCourant = range.cloneRange();
    afficherBarre(range);
  }

  let minuteurSelection = null;
  document.addEventListener('selectionchange', () => {
    clearTimeout(minuteurSelection);
    minuteurSelection = setTimeout(mettreAJourSelection, 200);
  });
  document.addEventListener('mousedown', (e) => {
    if (!barre.contains(e.target)) souris = true;
  });
  document.addEventListener('mouseup', () => {
    souris = false;
    setTimeout(mettreAJourSelection, 0);
  });

  barre.addEventListener('pointerdown', (e) => {
    e.preventDefault(); // garde la sélection au clic
    figee = true;
    setTimeout(() => {
      figee = false;
    }, 800);
  });
  boutonSurligner.addEventListener('click', () => {
    const range = rangeCourant;
    masquerBarre();
    getSelection()?.removeAllRanges();
    if (range) surligner(range);
  });

  // ----- Interactions -----

  article.addEventListener('click', (e) => {
    const marque = e.target.closest?.('mark.surlignage');
    if (!marque || !getSelection().isCollapsed) return;
    const entree = notes.find((n) => String(n.donnees.id) === marque.dataset.note);
    if (!entree) return;
    activer(entree, {
      ouvrir: true,
      focus: mode === 'marge' && matchMedia('(pointer: fine)').matches,
    });
  });

  bouton.addEventListener('click', () => ouvrirTiroir(marge.dataset.ouvert !== 'true'));
  voile.addEventListener('click', () => ouvrirTiroir(false));
  marge.querySelector('.notes-fermer')?.addEventListener('click', () => ouvrirTiroir(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && marge.dataset.ouvert === 'true') ouvrirTiroir(false);
  });

  // ----- Démarrage -----

  for (const donnees of existantes) ajouter(donnees);
  appliquerMode();
  largeur.addEventListener('change', appliquerMode);

  // La hauteur du cours change (quiz inséré, images, polices) : on replace les cartes.
  new ResizeObserver(planifier).observe(article);
  window.addEventListener('resize', planifier);
  document.fonts?.ready.then(planifier);
  for (const image of article.querySelectorAll('img')) image.addEventListener('load', planifier);

  // Lien depuis « Mes notes » : #note-<numéro>.
  const cible = location.hash.match(/^#note-(\d+)$/);
  if (cible) {
    const entree = notes.find((n) => String(n.donnees.id) === cible[1]);
    if (entree) requestAnimationFrame(() => activer(entree, { centrer: true }));
  }
}

if (article && marge && liste && vide && bouton && compte && voile) demarrer();
