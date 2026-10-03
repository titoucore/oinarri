// « Expliquer » une sélection de texte dans un cours.
//
// La barre de sélection (surlignage.js) envoie l'événement « oinarri:expliquer ». Ce module ouvre alors
// un panneau près du texte, demande une explication à Claude (via le Worker, qui garde la clé secrète),
// puis propose d'ajouter le terme au glossaire personnel.

import '../styles/explication.css';
import { termes } from '../data/glossaire.js';
import { normaliser } from '../lib/texte.js';
import { creerTerme, demanderExplication } from './termes-perso-api.js';

const article = document.querySelector('.cours');

const CATEGORIES = [
  'Construction',
  'Matériaux',
  'Thermique',
  'Réglementation',
  'Urbanisme',
  'Promotion',
  'Financement',
  'Logement social',
  'Juridique',
  'Assurance',
  'Biosourcé',
  'Géosourcé',
  'Concepts',
];
const MAX_PASSAGE = 600;

// Termes déjà au glossaire du site : inutile de les ajouter au glossaire personnel.
const officiels = new Set(termes.map((t) => normaliser(t.terme)));

let panneau = null;
let ouvertA = 0;
let jeton = 0; // distingue les demandes successives : une réponse tardive ne s'affiche pas

function fermer() {
  jeton++;
  panneau?.remove();
  panneau = null;
}

function vider() {
  panneau.replaceChildren();
}

function paragraphe(classe, texte) {
  const p = document.createElement('p');
  p.className = classe;
  p.textContent = texte;
  return p;
}

function bouton(libelle, secondaire = false, type = 'button') {
  const b = document.createElement('button');
  b.type = type;
  b.className = `explication-bouton${secondaire ? ' explication-bouton-secondaire' : ''}`;
  b.textContent = libelle;
  return b;
}

function ouvrirPanneau(rect) {
  fermer();
  panneau = document.createElement('div');
  panneau.className = 'explication';
  panneau.setAttribute('role', 'dialog');
  panneau.setAttribute('aria-label', 'Explication');
  document.body.append(panneau);
  ouvertA = performance.now();

  const marge = 12;
  const largeur = panneau.offsetWidth;
  const gauche = Math.min(rect.left, window.scrollX + window.innerWidth - largeur - marge);
  panneau.style.left = `${Math.max(window.scrollX + marge, gauche)}px`;
  panneau.style.top = `${rect.bottom + 8}px`;
}

function voirLePanneau() {
  panneau?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function afficherChargement() {
  vider();
  const p = paragraphe('explication-texte', "Recherche d'une explication…");
  p.setAttribute('role', 'status');
  panneau.append(p);
}

function afficherErreur(message) {
  vider();
  const actions = document.createElement('div');
  actions.className = 'explication-actions';
  const fermerBouton = bouton('Fermer', true);
  fermerBouton.addEventListener('click', fermer);
  actions.append(fermerBouton);
  const erreur = paragraphe('explication-erreur', message);
  erreur.setAttribute('role', 'alert');
  panneau.append(erreur, actions);
  voirLePanneau();
}

function afficherConfirmation(terme) {
  vider();
  const p = paragraphe('explication-texte', `« ${terme} » est ajouté à ton glossaire.`);
  p.setAttribute('role', 'status');
  panneau.append(p);
  const actions = document.createElement('div');
  actions.className = 'explication-actions';
  const fermerBouton = bouton('Fermer', true);
  fermerBouton.addEventListener('click', fermer);
  actions.append(fermerBouton);
  panneau.append(actions);
}

function afficherFormulaire(resultat, texte) {
  vider();
  const formulaire = document.createElement('form');
  formulaire.className = 'terme-formulaire';

  const champTerme = document.createElement('div');
  const labelTerme = document.createElement('label');
  labelTerme.htmlFor = 'nouveau-terme';
  labelTerme.textContent = 'Terme';
  const saisieTerme = document.createElement('input');
  saisieTerme.id = 'nouveau-terme';
  saisieTerme.type = 'text';
  saisieTerme.maxLength = 80;
  saisieTerme.required = true;
  saisieTerme.value = resultat.terme || (texte.length <= 60 ? texte : '');
  champTerme.append(labelTerme, saisieTerme);

  const champCategorie = document.createElement('div');
  const labelCategorie = document.createElement('label');
  labelCategorie.htmlFor = 'nouvelle-categorie';
  labelCategorie.textContent = 'Catégorie';
  const saisieCategorie = document.createElement('select');
  saisieCategorie.id = 'nouvelle-categorie';
  for (const c of CATEGORIES) {
    const option = document.createElement('option');
    option.value = c;
    option.textContent = c;
    saisieCategorie.append(option);
  }
  saisieCategorie.value = CATEGORIES.includes(resultat.categorie) ? resultat.categorie : 'Concepts';
  champCategorie.append(labelCategorie, saisieCategorie);

  const champDefinition = document.createElement('div');
  const labelDefinition = document.createElement('label');
  labelDefinition.htmlFor = 'nouvelle-definition';
  labelDefinition.textContent = 'Définition (modifiable)';
  const saisieDefinition = document.createElement('textarea');
  saisieDefinition.id = 'nouvelle-definition';
  saisieDefinition.maxLength = 600;
  saisieDefinition.required = true;
  saisieDefinition.value = (resultat.definition || resultat.explication).slice(0, 600);
  champDefinition.append(labelDefinition, saisieDefinition);

  const erreur = paragraphe('terme-formulaire-erreur', '');
  erreur.hidden = true;
  erreur.setAttribute('role', 'alert');

  const actions = document.createElement('div');
  actions.className = 'explication-actions';
  const enregistrer = bouton('Enregistrer', false, 'submit');
  const annuler = bouton('Annuler', true);
  annuler.addEventListener('click', () => afficherResultat(resultat, texte));
  actions.append(enregistrer, annuler);

  formulaire.append(champTerme, champCategorie, champDefinition, erreur, actions);
  formulaire.addEventListener('submit', async (e) => {
    e.preventDefault();
    const terme = saisieTerme.value.trim().replace(/\s+/g, ' ');
    const definition = saisieDefinition.value.trim();
    erreur.hidden = true;
    if (!terme || !definition) {
      erreur.textContent = 'Le terme et la définition sont obligatoires.';
      erreur.hidden = false;
      return;
    }
    if (officiels.has(normaliser(terme))) {
      erreur.textContent = 'Ce terme est déjà dans le glossaire du site.';
      erreur.hidden = false;
      return;
    }
    enregistrer.disabled = true;
    try {
      const cree = await creerTerme({ terme, categorie: saisieCategorie.value, definition });
      window.dispatchEvent(new CustomEvent('oinarri:terme-ajoute', { detail: cree }));
      if (panneau) afficherConfirmation(cree.terme);
    } catch (err) {
      erreur.textContent = err.message;
      erreur.hidden = false;
      enregistrer.disabled = false;
    }
  });

  panneau.append(formulaire);
  (saisieTerme.value ? saisieDefinition : saisieTerme).focus({ preventScroll: true });
  voirLePanneau();
}

function afficherResultat(resultat, texte) {
  vider();
  panneau.append(
    paragraphe('explication-titre', 'Explication'),
    paragraphe('explication-texte', resultat.explication),
    paragraphe(
      'explication-avertissement',
      'Générée par une IA : à vérifier avec les sources du chapitre.',
    ),
  );
  if (typeof resultat.restant === 'number') {
    panneau.append(
      paragraphe(
        'explication-reste',
        `${resultat.restant} explication${resultat.restant > 1 ? 's' : ''} restante${resultat.restant > 1 ? 's' : ''} aujourd'hui.`,
      ),
    );
  }
  const actions = document.createElement('div');
  actions.className = 'explication-actions';
  const ajouter = bouton('Ajouter au glossaire');
  ajouter.addEventListener('click', () => afficherFormulaire(resultat, texte));
  const fermerBouton = bouton('Fermer', true);
  fermerBouton.addEventListener('click', fermer);
  actions.append(ajouter, fermerBouton);
  panneau.append(actions);
  voirLePanneau();
}

if (article) {
  window.addEventListener('oinarri:expliquer', async (e) => {
    const { texte, rect } = e.detail;
    ouvrirPanneau(rect);
    const moi = jeton;

    if (texte.length > MAX_PASSAGE) {
      afficherErreur(
        `Sélection trop longue (${MAX_PASSAGE} caractères au maximum). Sélectionne un terme ou une phrase.`,
      );
      return;
    }

    afficherChargement();
    try {
      const contexte = document.querySelector('h1')?.textContent ?? '';
      const resultat = await demanderExplication(texte, contexte);
      if (moi === jeton && panneau) afficherResultat(resultat, texte);
    } catch (erreur) {
      if (moi === jeton && panneau) afficherErreur(erreur.message);
    }
  });

  document.addEventListener('click', (e) => {
    if (panneau && !panneau.contains(e.target) && performance.now() - ouvertA > 400) fermer();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panneau) fermer();
  });
}
