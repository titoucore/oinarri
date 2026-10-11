// Page /chiffres-cles/ : les chiffres du cours, avec leurs sources, leur fraîcheur et un export CSV.
// Données : src/data/chiffres-cles.js. Tout texte est inséré avec textContent.

import {
  CHIFFRES,
  THEMES,
  SOURCES_CHIFFRES,
  VALIDITE_JOURS,
  LIBELLES_STATUT,
  LIBELLES_NIVEAU,
} from '../data/chiffres-cles.js';

const liste = document.getElementById('cc-liste');
const zoneThemes = document.getElementById('cc-themes');
const champRecherche = document.getElementById('cc-recherche');
const casAttention = document.getElementById('cc-attention');
const compte = document.getElementById('cc-compte');
const boutonCsv = document.getElementById('cc-csv');
const boutonImprimer = document.getElementById('cc-imprimer');

let titres = {};
try {
  titres = JSON.parse(document.getElementById('cc-titres')?.textContent || '{}');
} catch {
  titres = {};
}

const etat = { theme: null, recherche: '', attention: false };

function el(balise, classe, texte) {
  const noeud = document.createElement(balise);
  if (classe) noeud.className = classe;
  if (texte !== undefined) noeud.textContent = texte;
  return noeud;
}

const normaliser = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function joursDepuis(jour) {
  const debut = new Date(`${jour}T00:00:00Z`).getTime();
  return Math.floor((Date.now() - debut) / 86400000);
}

const arevoir = (chiffre) => joursDepuis(chiffre.verifie_le) > (VALIDITE_JOURS[chiffre.volatilite] ?? 90);
const aconfirmer = (chiffre) => chiffre.fiabilite === 'a-confirmer';

function dateFr(jour) {
  return new Date(`${jour}T00:00:00Z`).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function filtrer() {
  const mots = normaliser(etat.recherche).split(/\s+/).filter(Boolean);
  return [...CHIFFRES]
    .sort((a, b) => THEMES.indexOf(a.theme) - THEMES.indexOf(b.theme))
    .filter((c) => {
    if (etat.theme && c.theme !== etat.theme) return false;
    if (etat.attention && !(arevoir(c) || aconfirmer(c) || c.statut === 'projet')) return false;
    if (!mots.length) return true;
    const texte = normaliser([c.libelle, c.valeur, c.contexte ?? '', c.theme].join(' '));
    return mots.every((m) => texte.includes(m));
  });
}

function carte(c) {
  const li = el('li', 'cc-carte');
  li.append(el('p', 'cc-theme', c.theme), el('h3', 'cc-libelle', c.libelle));

  const valeur = el('p', 'cc-valeur', c.valeur);
  li.append(valeur);
  if (c.unite) li.append(el('p', 'cc-unite', `Unité : ${c.unite}`));
  if (c.contexte) li.append(el('p', 'cc-contexte', c.contexte));

  const badges = el('ul', 'cc-badges');
  if (c.statut !== 'en-vigueur') badges.append(el('li', 'cc-badge', LIBELLES_STATUT[c.statut]));
  if (arevoir(c)) badges.append(el('li', 'cc-badge cc-badge-attention', 'À revérifier'));
  if (aconfirmer(c)) badges.append(el('li', 'cc-badge cc-badge-attention', 'À confirmer'));
  if (badges.children.length) li.append(badges);

  const sources = el('p', 'cc-source');
  sources.append('Source : ');
  c.sources.forEach((cle, i) => {
    const s = SOURCES_CHIFFRES[cle];
    if (!s) return;
    if (i > 0) sources.append(' ; ');
    if (s.url) {
      const a = el('a', undefined, s.libelle);
      a.href = s.url;
      if (/^https?:/.test(s.url)) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
      sources.append(a);
    } else {
      sources.append(s.libelle);
    }
    sources.append(` (${LIBELLES_NIVEAU[s.niveau] ?? s.niveau})`);
  });
  sources.append(`. Vérifié le ${dateFr(c.verifie_le)}.`);
  li.append(sources);

  const chapitres = el('p', 'cc-chapitres');
  chapitres.append('Dans le cours : ');
  c.chapitres.forEach((id, i) => {
    if (i > 0) chapitres.append(' ; ');
    const a = el('a', undefined, titres[id] ?? id);
    a.href = `/${id}/`;
    chapitres.append(a);
  });
  li.append(chapitres);
  return li;
}

function rendre() {
  const retenus = filtrer();
  liste.replaceChildren(...retenus.map(carte));
  compte.textContent = `${retenus.length} chiffre${retenus.length > 1 ? 's' : ''} sur ${CHIFFRES.length}`;
  for (const b of zoneThemes.querySelectorAll('button')) {
    b.setAttribute('aria-pressed', String((b.dataset.theme || null) === etat.theme));
  }
}

function construireThemes() {
  const ajouter = (libelle, valeur) => {
    const b = el('button', 'cc-puce', libelle);
    b.type = 'button';
    b.dataset.theme = valeur ?? '';
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => {
      etat.theme = valeur;
      rendre();
    });
    zoneThemes.append(b);
  };
  ajouter('Tous', null);
  for (const t of THEMES) ajouter(t, t);
}

// ---------- Export CSV (la sélection affichée) ----------

function csv() {
  const cellule = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const entetes = ['Thème', 'Libellé', 'Valeur', 'Unité', 'Contexte', 'Statut', 'Fiabilité', 'Sources', 'Liens', 'Vérifié le', 'Chapitres'];
  const lignes = filtrer().map((c) => {
    const sources = c.sources.map((k) => SOURCES_CHIFFRES[k]).filter(Boolean);
    return [
      c.theme,
      c.libelle,
      c.valeur,
      c.unite ?? '',
      c.contexte ?? '',
      LIBELLES_STATUT[c.statut],
      aconfirmer(c) ? 'À confirmer' : 'Confirmé',
      sources.map((s) => s.libelle).join(' | '),
      sources.map((s) => s.url ?? '').filter(Boolean).join(' | '),
      c.verifie_le,
      c.chapitres.map((id) => titres[id] ?? id).join(' | '),
    ];
  });
  // Séparateur « ; » et BOM UTF-8 : le fichier s'ouvre correctement dans Excel en français.
  const contenu = [entetes, ...lignes].map((l) => l.map(cellule).join(';')).join('\r\n');
  const blob = new Blob(['\ufeff', contenu], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `oinarri-chiffres-cles-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

champRecherche.addEventListener('input', () => {
  etat.recherche = champRecherche.value;
  rendre();
});
casAttention.addEventListener('change', () => {
  etat.attention = casAttention.checked;
  rendre();
});
boutonCsv.addEventListener('click', csv);
boutonImprimer.addEventListener('click', () => window.print());

construireThemes();
rendre();
