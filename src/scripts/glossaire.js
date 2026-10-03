// Page /glossaire/ : filtre la liste des termes pendant la saisie.
// Sans JavaScript, la liste complète reste affichée et les ancres fonctionnent.

import { normaliser } from '../lib/texte.js';

const champ = document.getElementById('g-recherche');
const vide = document.getElementById('g-vide');
const termes = [...document.querySelectorAll('.g-terme')];
const groupes = [...document.querySelectorAll('.g-groupe')];
const lettres = [...document.querySelectorAll('.g-lettres a')];

function filtrer() {
  const requete = normaliser(champ.value);
  let visibles = 0;

  for (const terme of termes) {
    const correspond = !requete || terme.dataset.recherche.includes(requete);
    terme.hidden = !correspond;
    if (correspond) visibles += 1;
  }

  // Un groupe sans terme visible disparaît, et sa lettre est grisée dans la barre de lettres.
  for (const groupe of groupes) {
    const contientDesTermes = groupe.querySelector('.g-terme:not([hidden])') !== null;
    groupe.hidden = !contientDesTermes;
    const lettre = lettres.find((a) => a.getAttribute('href') === `#${groupe.id}`);
    if (lettre) lettre.dataset.inactif = String(!contientDesTermes);
  }

  vide.hidden = visibles > 0;
}

champ?.addEventListener('input', filtrer);
