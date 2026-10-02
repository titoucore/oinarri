// Page /compte/ : informations, progression détaillée, remise à zéro,
// export des données et suppression du compte.
// Le squelette de la page est dans compte.astro ; ce script le remplit et branche les boutons.

import { LIBELLES, NIVEAUX, libelleEtat } from './progression.js';

const $ = (id) => document.getElementById(id);
const section = $('compte');
const message = $('c-message');

// ---------- Outils ----------

function formaterDate(texte) {
  if (!texte) return '—';
  const iso = texte.length === 10 ? `${texte}T00:00:00Z` : `${texte.replace(' ', 'T')}Z`;
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function pluriel(nombre, mot) {
  return `${nombre} ${mot}${nombre > 1 ? 's' : ''}`;
}

function annoncer(texte) {
  message.textContent = texte;
  message.hidden = !texte;
}

async function appeler(url, options) {
  const reponse = await fetch(url, options);
  const donnees = await reponse.json().catch(() => ({}));
  if (!reponse.ok) throw new Error(donnees.erreur || 'Requête refusée');
  return donnees;
}

function poster(corps) {
  return appeler('/api/compte', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corps),
  });
}

// ---------- Affichage ----------

function afficher(donnees) {
  const { moi, progression, quiz, revisions } = donnees;

  $('c-email').textContent = moi.email;
  $('c-prenom').value = moi.prenom || '';
  $('c-cree').textContent = formaterDate(moi.cree_le);
  $('c-visite').textContent = formaterDate(moi.derniere_visite);

  const lignes = new Map(progression.map((l) => [l.cours, l]));
  let toutVide = true;

  for (const li of document.querySelectorAll('.c-chapitre')) {
    const cours = li.dataset.cours;
    const ligne = lignes.get(cours);
    const quizDuCours = quiz.filter((q) => q.cours === cours);
    const cartes = revisions.filter((r) => r.carte.startsWith(`${cours}#`));
    const atteint = ligne ? NIVEAUX.indexOf(ligne.niveau_atteint) : -1;

    li.querySelector('.c-etat').textContent = libelleEtat(ligne) || 'Pas encore commencé';

    NIVEAUX.forEach((niveau, i) => {
      const q = quizDuCours.find((x) => x.niveau === niveau);
      const nb = cartes.filter((c) => c.carte.startsWith(`${cours}#${niveau}#`)).length;
      const morceaux = [
        i <= atteint ? 'acquis' : 'non validé',
        q
          ? `quiz ${q.meilleur} / ${q.total} (${pluriel(q.tentatives, 'essai')})`
          : 'quiz non fait',
        `${pluriel(nb, 'carte')} en révision`,
      ];
      li.querySelector(`[data-niveau="${niveau}"]`).textContent =
        `${LIBELLES[niveau]} · ${morceaux.join(' · ')}`;
    });

    const vide = !ligne && !quizDuCours.length && !cartes.length;
    li.querySelector('[data-action="reset"]').disabled = vide;
    if (!vide) toutVide = false;
  }

  $('c-reset-tout').disabled = toutVide;
}

async function recharger() {
  afficher(await appeler('/api/compte'));
}

// ---------- Remise à zéro ----------

// Chaque bouton « Remettre à zéro » ouvre une confirmation en ligne avant d'agir.
function brancherReinitialisation({ bouton, confirmation, oui, non, cours, texteSucces }) {
  bouton.addEventListener('click', () => {
    annoncer('');
    bouton.hidden = true;
    confirmation.hidden = false;
    non.focus();
  });
  non.addEventListener('click', () => {
    confirmation.hidden = true;
    bouton.hidden = false;
  });
  oui.addEventListener('click', async () => {
    oui.disabled = true;
    non.disabled = true;
    try {
      await poster({ action: 'reinitialiser', cours });
      await recharger();
      annoncer(texteSucces);
    } catch {
      annoncer("La remise à zéro a échoué. Réessaie dans un instant.");
    }
    oui.disabled = false;
    non.disabled = false;
    confirmation.hidden = true;
    bouton.hidden = false;
  });
}

for (const li of document.querySelectorAll('.c-chapitre')) {
  brancherReinitialisation({
    bouton: li.querySelector('[data-action="reset"]'),
    confirmation: li.querySelector('.c-confirm'),
    oui: li.querySelector('[data-action="oui"]'),
    non: li.querySelector('[data-action="non"]'),
    cours: li.dataset.cours,
    texteSucces: 'Chapitre remis à zéro.',
  });
}

brancherReinitialisation({
  bouton: $('c-reset-tout'),
  confirmation: $('c-reset-tout-confirm'),
  oui: $('c-reset-tout-oui'),
  non: $('c-reset-tout-non'),
  cours: null,
  texteSucces: 'Toute ta progression a été remise à zéro.',
});

// ---------- Prénom ----------

$('c-form-prenom').addEventListener('submit', async (evenement) => {
  evenement.preventDefault();
  const bouton = $('c-form-prenom').querySelector('button');
  bouton.disabled = true;
  try {
    await appeler('/api/moi', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prenom: $('c-prenom').value }),
    });
    annoncer('Prénom enregistré.');
  } catch (e) {
    annoncer(e.message || "Impossible d'enregistrer le prénom.");
  }
  bouton.disabled = false;
});

// ---------- Suppression du compte ----------

const champSuppression = $('c-suppr-champ');
const boutonSuppression = $('c-suppr-oui');

champSuppression.addEventListener('input', () => {
  boutonSuppression.disabled = champSuppression.value.trim().toUpperCase() !== 'SUPPRIMER';
});

boutonSuppression.addEventListener('click', async () => {
  boutonSuppression.disabled = true;
  champSuppression.disabled = true;
  annoncer('');
  try {
    await poster({ action: 'supprimer', confirmation: 'SUPPRIMER' });
  } catch {
    annoncer('La suppression a échoué. Ton compte est intact. Réessaie dans un instant.');
    champSuppression.disabled = false;
    boutonSuppression.disabled = false;
    return;
  }
  // Compte supprimé : on masque la page et on déconnecte la session Access.
  $('c-contenu').hidden = true;
  $('c-supprime').hidden = false;
  setTimeout(() => {
    location.href = '/cdn-cgi/access/logout';
  }, 3000);
});

// ---------- Démarrage ----------

async function demarrer() {
  try {
    await recharger();
  } catch {
    annoncer("Impossible de charger ton compte pour le moment. Réessaie dans un instant.");
  } finally {
    section.classList.remove('attente');
  }
}

demarrer();
