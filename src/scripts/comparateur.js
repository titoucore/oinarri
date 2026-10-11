// Comparateur de matériaux : choisir 2 ou 3 matériaux, lire leurs propriétés côte à côte
// et calculer l'épaisseur nécessaire pour atteindre une résistance thermique visée (e = R × λ).
//
// Les données viennent de src/data/materiaux.js. Tout texte est inséré avec textContent :
// aucune donnée n'est interprétée comme du HTML.
// La sélection est mémorisée dans l'adresse de la page (#m=paille,pse&r=5) pour pouvoir
// partager ou retrouver une comparaison.

import {
  GROUPES,
  LIBELLES_ASSURANCE,
  LIBELLES_CARBONE,
  LIBELLES_STATUT,
  MATERIAUX,
  REPERES_R,
  SOURCES,
} from '../data/materiaux.js';

const MAX = 3;
const R_MIN = 0.5;
const R_MAX = 20;

const parId = new Map(MATERIAUX.map((m) => [m.id, m]));
const etat = { choix: [], r: 5 };

const message = document.getElementById('cmp-message');
const zoneChoix = document.getElementById('cmp-choix');
const champR = document.getElementById('cmp-r');
const zoneReperes = document.getElementById('cmp-reperes');
const zoneResultats = document.getElementById('cmp-resultats');
const titreBarres = document.getElementById('cmp-titre-barres');
const listeBarres = document.getElementById('cmp-barres');
const listeCartes = document.getElementById('cmp-cartes');
const vide = document.getElementById('cmp-vide');

function el(tag, attrs = {}, ...enfants) {
  const e = document.createElement(tag);
  for (const [cle, valeur] of Object.entries(attrs)) {
    if (cle === 'texte') e.textContent = valeur;
    else if (cle === 'class') e.className = valeur;
    else e.setAttribute(cle, valeur);
  }
  for (const enfant of enfants) if (enfant) e.append(enfant);
  return e;
}

const nombre = (n, max = 3) => n.toLocaleString('fr-FR', { maximumFractionDigits: max });

function annoncer(texte) {
  message.textContent = texte;
  message.hidden = !texte;
}

// ---------- Calculs ----------

function epaisseurTexte(m, r) {
  const a = r * m.lambda.min;
  const b = r * m.lambda.max;
  const enMetres = b >= 1;
  const fmt = (x) => (enMetres ? nombre(x, 2) : nombre(x * 100, 1));
  const unite = enMetres ? 'm' : 'cm';
  return fmt(a) === fmt(b) ? `${fmt(a)} ${unite}` : `${fmt(a)} à ${fmt(b)} ${unite}`;
}

function lambdaTexte(m) {
  const { min, max } = m.lambda;
  return (min === max ? nombre(min) : `${nombre(min)} à ${nombre(max)}`) + ' W/(m·K)';
}

// ---------- Mémorisation dans l'adresse ----------

function lireAdresse() {
  try {
    const params = new URLSearchParams(location.hash.slice(1));
    const ids = (params.get('m') || '').split(',').filter((id) => parId.has(id));
    etat.choix = [...new Set(ids)].slice(0, MAX);
    const r = Number(params.get('r'));
    if (Number.isFinite(r) && r >= R_MIN && r <= R_MAX) etat.r = r;
  } catch {
    // adresse illisible : on garde l'état par défaut
  }
}

function ecrireAdresse() {
  try {
    const params = new URLSearchParams();
    if (etat.choix.length) params.set('m', etat.choix.join(','));
    params.set('r', String(etat.r));
    history.replaceState(null, '', `#${params.toString()}`);
  } catch {
    // la mémorisation est un confort : son échec ne bloque rien
  }
}

// ---------- Choix des matériaux ----------

function construireChoix() {
  zoneChoix.replaceChildren();
  for (const groupe of GROUPES) {
    const idTitre = `cmp-g-${groupe.id}`;
    const puces = el('div', { class: 'cmp-puces', role: 'group', 'aria-labelledby': idTitre });
    for (const m of MATERIAUX.filter((x) => x.famille === groupe.id)) {
      const bouton = el('button', {
        class: 'cmp-puce',
        type: 'button',
        'data-id': m.id,
        'aria-pressed': 'false',
        texte: m.nom,
      });
      bouton.addEventListener('click', () => basculer(m.id));
      puces.append(bouton);
    }
    zoneChoix.append(el('h3', { id: idTitre, class: 'cmp-groupe', texte: groupe.libelle }), puces);
  }
}

function majPuces() {
  for (const bouton of zoneChoix.querySelectorAll('.cmp-puce')) {
    bouton.setAttribute('aria-pressed', String(etat.choix.includes(bouton.dataset.id)));
  }
}

function basculer(id) {
  if (etat.choix.includes(id)) {
    etat.choix = etat.choix.filter((x) => x !== id);
    annoncer('');
  } else if (etat.choix.length >= MAX) {
    annoncer(`Trois matériaux au maximum. Retire-en un pour ajouter « ${parId.get(id).nom} ».`);
    return;
  } else {
    etat.choix = [...etat.choix, id];
    annoncer('');
  }
  rendre();
}

// ---------- Résistance visée ----------

function construireReperes() {
  zoneReperes.replaceChildren();
  for (const repere of REPERES_R) {
    const bouton = el('button', {
      class: 'cmp-repere',
      type: 'button',
      'data-r': String(repere.valeur),
      texte: `${nombre(repere.valeur)} (${repere.libelle.toLowerCase()})`,
    });
    bouton.addEventListener('click', () => {
      etat.r = repere.valeur;
      champR.value = String(repere.valeur);
      rendre();
    });
    zoneReperes.append(bouton);
  }
}

function majReperes() {
  for (const bouton of zoneReperes.querySelectorAll('.cmp-repere')) {
    bouton.setAttribute('aria-pressed', String(Number(bouton.dataset.r) === etat.r));
  }
}

champR.addEventListener('input', () => {
  const r = Number(champR.value);
  if (Number.isFinite(r) && r >= R_MIN && r <= R_MAX) {
    etat.r = r;
    rendre();
  }
});

// ---------- Rendu des résultats ----------

function ligne(libelle, ...contenu) {
  return [el('dt', { texte: libelle }), el('dd', {}, ...contenu)];
}

function marqueStatut(champ) {
  const texte = LIBELLES_STATUT[champ.statut];
  return texte ? el('span', { class: 'cmp-statut', texte }) : null;
}

function valeur(champ, texte = champ.texte) {
  return [el('span', { texte }), marqueStatut(champ), champ.note ? el('p', { class: 'cmp-detail', texte: champ.note }) : null];
}

function sourcesDe(m) {
  const cles = new Set();
  for (const champ of [m.lambda, m.masse, m.chaleur, m.vapeur, m.feu, m.assurance, m.carbone]) {
    for (const cle of champ.src) cles.add(cle);
  }
  const liste = el('ul', { class: 'cmp-sources' });
  for (const cle of cles) {
    const s = SOURCES[cle];
    const externe = /^https?:/.test(s.url);
    const lien = el('a', {
      href: s.url,
      texte: s.titre,
      ...(externe ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
    });
    liste.append(el('li', {}, lien, el('span', { class: 'cmp-source-meta', texte: ` ${s.editeur}, ${s.date}. ${s.niveau}.` })));
  }
  return el('details', { class: 'cmp-details' }, el('summary', { texte: 'Sources de cette fiche' }), liste);
}

function carte(m) {
  const groupe = GROUPES.find((g) => g.id === m.famille);
  const retirer = el('button', { class: 'cmp-retirer', type: 'button', texte: 'Retirer', 'aria-label': `Retirer ${m.nom}` });
  retirer.addEventListener('click', () => basculer(m.id));

  const roles = el('ul', { class: 'cmp-roles' }, ...m.roles.map((r) => el('li', { texte: r })));

  const li = el(
    'li',
    { class: 'cmp-carte' },
    el('div', { class: 'cmp-carte-tete' }, el('h3', { texte: m.nom }), retirer),
    el('p', { class: 'cmp-famille', texte: groupe.libelle }),
    el('p', { class: 'cmp-forme', texte: m.forme }),
    roles,
    el('p', { class: 'cmp-epaisseur-lib', texte: `Épaisseur pour R = ${nombre(etat.r)} m²·K/W` }),
    el('p', { class: 'cmp-epaisseur', texte: epaisseurTexte(m, etat.r) }),
  );
  if (m.note) li.append(el('p', { class: 'cmp-note', texte: m.note }));

  const dl = el('dl', { class: 'cmp-proprietes' });
  dl.append(
    ...ligne('Conductivité λ', ...valeur(m.lambda, lambdaTexte(m))),
    ...ligne('Masse volumique', ...valeur(m.masse)),
    ...ligne('Chaleur massique', ...valeur(m.chaleur)),
    ...ligne('Perméabilité à la vapeur', ...valeur(m.vapeur)),
    ...ligne('Réaction au feu', ...valeur(m.feu)),
    ...ligne(
      "Cadre d'assurance",
      el('span', { class: 'cmp-etiquette', texte: LIBELLES_ASSURANCE[m.assurance.niveau] }),
      marqueStatut(m.assurance),
      el('p', { class: 'cmp-detail', texte: m.assurance.texte }),
    ),
    ...ligne(
      'Carbone',
      el('span', { class: 'cmp-etiquette', texte: LIBELLES_CARBONE[m.carbone.niveau] }),
      marqueStatut(m.carbone),
      el('p', { class: 'cmp-detail', texte: m.carbone.texte }),
    ),
  );
  li.append(dl, sourcesDe(m), el('a', { class: 'cmp-chapitre', href: m.chapitre, texte: 'Lire le chapitre du cours' }));
  return li;
}

function barres(materiaux) {
  listeBarres.replaceChildren();
  const maxi = Math.max(...materiaux.map((m) => etat.r * m.lambda.max));
  for (const m of materiaux) {
    const largeur = Math.max(1.5, ((etat.r * m.lambda.max) / maxi) * 100);
    const barre = el('div', { class: 'cmp-barre', 'aria-hidden': 'true' });
    barre.style.width = `${largeur}%`;
    listeBarres.append(
      el(
        'li',
        { class: 'cmp-barre-ligne' },
        el('span', { class: 'cmp-barre-nom', texte: m.nom }),
        el('div', { class: 'cmp-barre-piste' }, barre),
        el('span', { class: 'cmp-barre-valeur', texte: epaisseurTexte(m, etat.r) }),
      ),
    );
  }
}

function rendre() {
  majPuces();
  majReperes();
  ecrireAdresse();

  const materiaux = etat.choix.map((id) => parId.get(id));
  vide.hidden = materiaux.length > 0;
  zoneResultats.hidden = materiaux.length === 0;
  if (materiaux.length === 0) return;

  titreBarres.hidden = materiaux.length < 2;
  listeBarres.hidden = materiaux.length < 2;
  if (materiaux.length >= 2) {
    titreBarres.textContent = `Épaisseur pour atteindre R = ${nombre(etat.r)} m²·K/W (valeur haute de la fourchette de λ)`;
    barres(materiaux);
  }

  listeCartes.replaceChildren(...materiaux.map(carte));
  listeCartes.dataset.nombre = String(materiaux.length);
  if (materiaux.length === 1) annoncer('Choisis un deuxième matériau pour comparer.');
  else if (message.textContent.startsWith('Choisis un deuxième')) annoncer('');
}

// ---------- Démarrage ----------

lireAdresse();
construireChoix();
construireReperes();
champR.value = String(etat.r);
rendre();
