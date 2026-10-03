// Page Glossaire : section « Mes termes » (glossaire personnel).
// Les termes ajoutés depuis un cours s'y modifient (catégorie et définition) et s'y suppriment.

import '../styles/explication.css';
import { lireTermesPerso, modifierTerme, supprimerTerme } from './termes-perso-api.js';

const groupe = document.getElementById('mes-termes');
const liste = document.getElementById('mes-termes-liste');

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

function element(balise, classe, texte) {
  const e = document.createElement(balise);
  if (classe) e.className = classe;
  if (texte !== undefined) e.textContent = texte;
  return e;
}

function lienAction(libelle) {
  const b = element('button', 'perso-lien-action', libelle);
  b.type = 'button';
  return b;
}

function majVisibilite() {
  groupe.hidden = liste.children.length === 0;
}

function creerFiche(terme) {
  const fiche = element('article', 'g-terme');
  fiche.dataset.id = String(terme.id);

  function afficherLecture() {
    fiche.replaceChildren();
    const titre = element('h3', '', terme.terme);
    const categorie = element('p', 'g-categorie', terme.categorie);
    const definition = element('p', 'g-definition', terme.definition);
    const actions = element('div', 'perso-actions');
    const modifier = lienAction('Modifier');
    const supprimer = lienAction('Supprimer');
    actions.append(modifier, supprimer);
    fiche.append(titre, categorie, definition, actions);

    modifier.addEventListener('click', afficherEdition);

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
        await supprimerTerme(terme.id);
        fiche.remove();
        majVisibilite();
      } catch (erreur) {
        supprimer.disabled = false;
        supprimer.textContent = 'Supprimer';
        confirmation = null;
        alert(erreur.message);
      }
    });
  }

  function afficherEdition() {
    fiche.replaceChildren();
    const titre = element('h3', '', terme.terme);
    const formulaire = element('form', 'terme-formulaire');

    const champCategorie = element('div');
    const labelCategorie = element('label', '', 'Catégorie');
    const selection = element('select');
    selection.id = `categorie-${terme.id}`;
    labelCategorie.htmlFor = selection.id;
    for (const c of CATEGORIES) {
      const option = element('option', '', c);
      option.value = c;
      selection.append(option);
    }
    selection.value = CATEGORIES.includes(terme.categorie) ? terme.categorie : 'Concepts';
    champCategorie.append(labelCategorie, selection);

    const champDefinition = element('div');
    const labelDefinition = element('label', '', 'Définition');
    const zone = element('textarea');
    zone.id = `definition-${terme.id}`;
    zone.maxLength = 600;
    zone.required = true;
    zone.value = terme.definition;
    labelDefinition.htmlFor = zone.id;
    champDefinition.append(labelDefinition, zone);

    const erreur = element('p', 'terme-formulaire-erreur');
    erreur.hidden = true;
    erreur.setAttribute('role', 'alert');

    const actions = element('div', 'explication-actions');
    const enregistrer = element('button', 'explication-bouton', 'Enregistrer');
    enregistrer.type = 'submit';
    const annuler = element('button', 'explication-bouton explication-bouton-secondaire', 'Annuler');
    annuler.type = 'button';
    annuler.addEventListener('click', afficherLecture);
    actions.append(enregistrer, annuler);

    formulaire.append(champCategorie, champDefinition, erreur, actions);
    formulaire.addEventListener('submit', async (e) => {
      e.preventDefault();
      erreur.hidden = true;
      enregistrer.disabled = true;
      try {
        const modifie = await modifierTerme(terme.id, selection.value, zone.value);
        terme = modifie;
        afficherLecture();
      } catch (err) {
        erreur.textContent = err.message;
        erreur.hidden = false;
        enregistrer.disabled = false;
      }
    });

    fiche.append(titre, formulaire);
    zone.focus({ preventScroll: true });
  }

  afficherLecture();
  return fiche;
}

async function demarrer() {
  let termes;
  try {
    termes = await lireTermesPerso();
  } catch {
    return; // Sans l'API, le glossaire du site reste utilisable.
  }
  for (const t of termes) liste.append(creerFiche(t));
  majVisibilite();
  if (location.hash === '#mes-termes' && !groupe.hidden) groupe.scrollIntoView();
}

if (groupe && liste) demarrer();
