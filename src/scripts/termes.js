// Termes du glossaire dans le texte d'un cours.
// Au chargement, la première occurrence de chaque terme dans chaque section (titre de niveau 2)
// est soulignée en pointillé. Un clic ouvre une bulle avec la définition et un lien vers le glossaire.
// Sont ignorés : les titres, les liens, la section « Vocabulaire » (déjà cliquable) et les sources.

import '../styles/termes.css';
import { termes } from '../data/glossaire.js';
import { identifiant, normaliser } from '../lib/texte.js';

const article = document.querySelector('.cours');

// ---------- Index des formes reconnues ----------

const parForme = new Map(); // forme normalisée -> terme
const souples = []; // formes cherchées sans tenir compte de la casse
const sensibles = []; // sigles (« PLU », « DO ») : cherchés en respectant la casse

function enregistrer(forme, terme) {
  const n = normaliser(forme);
  if (n.length < 2 || parForme.has(n)) return;
  parForme.set(n, terme);
  const sigle = forme === forme.toUpperCase() && /[A-Z]/.test(forme) && forme.length <= 6;
  (sigle ? sensibles : souples).push(forme);
}

// Les termes eux-mêmes d'abord, pour qu'ils l'emportent sur la variante d'un autre terme.
for (const t of termes) enregistrer(t.terme, t);
for (const t of termes) {
  if (t.developpe) enregistrer(t.developpe, t);
  for (const v of t.aussi ?? []) enregistrer(v, t);
}

const ESPACES = '[\\s\\u00a0\\u202f]+';

function motif(forme) {
  return forme
    .trim()
    .split(/[\s\u00a0\u202f]+/)
    .map((mot) => mot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/['’]/g, "['’]"))
    .join(ESPACES);
}

// Les formes les plus longues passent d'abord, pour que « permis de construire » l'emporte sur « permis ».
function fabriquer(liste, drapeaux) {
  if (!liste.length) return null;
  const triees = [...liste].sort((a, b) => b.length - a.length);
  return new RegExp(`(?:${triees.map(motif).join('|')})(?:s|x)?`, drapeaux);
}

const reSouple = fabriquer(souples, 'giu');
const reSigle = fabriquer(sensibles, 'gu');
const EST_LETTRE = /[\p{L}\p{N}]/u;

function termeDe(brut) {
  let n = normaliser(brut);
  if (parForme.has(n)) return parForme.get(n);
  if (/[sx]$/.test(n)) {
    n = n.slice(0, -1);
    if (parForme.has(n)) return parForme.get(n);
  }
  return null;
}

// Cherche tous les termes dans un texte ; un mot qui n'est qu'un morceau d'un autre mot est écarté.
function trouver(texte) {
  const trouves = [];
  for (const re of [reSouple, reSigle]) {
    if (!re) continue;
    for (const m of texte.matchAll(re)) {
      const debut = m.index;
      const fin = debut + m[0].length;
      if (EST_LETTRE.test(texte[debut - 1] ?? '') || EST_LETTRE.test(texte[fin] ?? '')) continue;
      const t = termeDe(m[0]);
      if (t) trouves.push({ debut, fin, t });
    }
  }
  return trouves.sort((a, b) => a.debut - b.debut || b.fin - b.debut - (a.fin - a.debut));
}

// ---------- Marquage des termes ----------

const EXCLUS = 'a, h1, h2, h3, h4, h5, h6, code, pre, button, textarea, .terme, .quiz, .validation';

function traiter(bloc, vus) {
  const marcheur = document.createTreeWalker(bloc, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) =>
      n.parentElement?.closest(EXCLUS) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
  });
  const noeuds = [];
  while (marcheur.nextNode()) noeuds.push(marcheur.currentNode);

  for (const noeud of noeuds) {
    const texte = noeud.nodeValue;
    const retenus = [];
    let limite = 0;
    for (const m of trouver(texte)) {
      if (m.debut < limite || vus.has(m.t)) continue;
      vus.add(m.t);
      retenus.push(m);
      limite = m.fin;
    }
    if (!retenus.length) continue;

    const fragment = document.createDocumentFragment();
    let curseur = 0;
    for (const m of retenus) {
      fragment.append(texte.slice(curseur, m.debut));
      const span = document.createElement('span');
      span.className = 'terme';
      span.tabIndex = 0;
      span.setAttribute('role', 'button');
      span.setAttribute('aria-expanded', 'false');
      span.dataset.terme = identifiant(m.t.terme);
      span.textContent = texte.slice(m.debut, m.fin);
      fragment.append(span);
      curseur = m.fin;
    }
    fragment.append(texte.slice(curseur));
    noeud.replaceWith(fragment);
  }
}

function marquer() {
  const vus = new Set();
  let ignorer = false;
  for (const bloc of [...article.children]) {
    if (bloc.tagName === 'H2') {
      vus.clear();
      const titre = normaliser(bloc.textContent);
      ignorer = titre === 'vocabulaire' || titre.startsWith('sources');
      continue;
    }
    if (ignorer || /^H[1-6]$/.test(bloc.tagName)) continue;
    traiter(bloc, vus);
  }
}

// ---------- Bulle de définition ----------

const parId = new Map(termes.map((t) => [identifiant(t.terme), t]));
let bulle = null;
let declencheur = null;

function fermer(rendreLeFocus = false) {
  if (!bulle) return;
  bulle.remove();
  bulle = null;
  declencheur?.setAttribute('aria-expanded', 'false');
  if (rendreLeFocus) declencheur?.focus();
  declencheur = null;
}

function positionner(span) {
  const r = span.getBoundingClientRect();
  const marge = 12;
  const largeur = bulle.offsetWidth;
  const hauteur = bulle.offsetHeight;
  const gauche = Math.min(r.left, window.innerWidth - largeur - marge);
  bulle.style.left = `${Math.max(marge, gauche) + window.scrollX}px`;
  // En dessous du terme ; au-dessus s'il n'y a pas la place et qu'il y en a plus en haut.
  const placeEnBas = window.innerHeight - r.bottom;
  const dessus = placeEnBas < hauteur + 16 && r.top > placeEnBas;
  const haut = dessus ? r.top - hauteur - 8 : r.bottom + 8;
  bulle.style.top = `${haut + window.scrollY}px`;
}

function ouvrir(span) {
  fermer();
  const t = parId.get(span.dataset.terme);
  if (!t) return;

  bulle = document.createElement('div');
  bulle.className = 'terme-bulle';
  bulle.setAttribute('role', 'dialog');
  bulle.setAttribute('aria-label', t.terme);

  const titre = document.createElement('p');
  titre.className = 'terme-bulle-titre';
  titre.textContent = t.developpe ? `${t.terme} (${t.developpe})` : t.terme;

  const categorie = document.createElement('p');
  categorie.className = 'terme-bulle-categorie';
  categorie.textContent = t.categorie;

  const definition = document.createElement('p');
  definition.className = 'terme-bulle-definition';
  definition.textContent = t.definition;

  const lien = document.createElement('a');
  lien.className = 'terme-bulle-lien';
  lien.href = `/glossaire/#${span.dataset.terme}`;
  lien.textContent = 'Voir dans le glossaire';

  bulle.append(titre, categorie, definition, lien);
  document.body.append(bulle);
  declencheur = span;
  span.setAttribute('aria-expanded', 'true');
  positionner(span);
}

function basculer(span) {
  if (declencheur === span) fermer();
  else ouvrir(span);
}

if (article) {
  marquer();

  article.addEventListener('click', (e) => {
    const span = e.target.closest?.('.terme');
    if (span) basculer(span);
  });

  article.addEventListener('keydown', (e) => {
    const span = e.target.closest?.('.terme');
    if (span && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      basculer(span);
    }
  });

  document.addEventListener('click', (e) => {
    if (bulle && !bulle.contains(e.target) && !e.target.closest?.('.terme')) fermer();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bulle) fermer(true);
  });

  window.addEventListener('resize', () => fermer());
}
