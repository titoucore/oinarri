// Page /compte/ : informations, connexion et sécurité, progression détaillée,
// remise à zéro, export des données et suppression du compte.
// Le squelette de la page est dans compte.astro ; ce script le remplit et branche les boutons.
// Selon le mode de connexion renvoyé par l'API ("access" ou "compte"), certaines sections changent.

import { LIBELLES, NIVEAUX, libelleEtat } from './progression.js';

const $ = (id) => document.getElementById(id);
const section = $('compte');
const message = $('c-message');

let mode = 'access';

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
  if (texte) message.scrollIntoView({ block: 'nearest' });
}

async function appeler(url, options) {
  const reponse = await fetch(url, options);
  const donnees = await reponse.json().catch(() => ({}));
  if (!reponse.ok) throw new Error(donnees.erreur || 'Requête refusée');
  return donnees;
}

function poster(url, corps) {
  return appeler(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corps),
  });
}

const posterCompte = (corps) => poster('/api/compte', corps);

// ---------- Affichage ----------

function afficher(donnees) {
  const { moi, progression, quiz, revisions } = donnees;
  mode = donnees.mode;
  const modeCompte = mode === 'compte';

  // Les éléments propres à chaque mode de connexion.
  $('c-aide-access').hidden = modeCompte;
  $('c-aide-compte').hidden = !modeCompte;
  $('c-securite').hidden = !modeCompte;
  $('c-suppr-mdp-bloc').hidden = !modeCompte;
  $('c-suppr-aide-access').hidden = modeCompte;
  $('c-deconnexion-access').hidden = modeCompte;

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
  majBoutonSuppression();
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
      await posterCompte({ action: 'reinitialiser', cours });
      await recharger();
      annoncer(texteSucces);
    } catch {
      annoncer('La remise à zéro a échoué. Réessaie dans un instant.');
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

// ---------- Connexion et sécurité (mode "compte") ----------

// Envoie un formulaire de sécurité et affiche le résultat ; vide les champs en cas de succès.
async function soumettreSecurite(formulaire, url, corps, texteSucces) {
  const bouton = formulaire.querySelector('button[type="submit"]');
  bouton.disabled = true;
  try {
    const donnees = await poster(url, corps);
    formulaire.reset();
    annoncer(donnees.message || texteSucces);
  } catch (e) {
    annoncer(e.message || 'Action impossible pour le moment.');
  }
  bouton.disabled = false;
}

$('c-form-mdp').addEventListener('submit', (evenement) => {
  evenement.preventDefault();
  if ($('c-mdp-nouveau').value !== $('c-mdp-confirmation').value) {
    annoncer('Les deux nouveaux mots de passe ne sont pas identiques.');
    return;
  }
  soumettreSecurite(
    $('c-form-mdp'),
    '/api/auth/mot-de-passe',
    { actuel: $('c-mdp-actuel').value, nouveau: $('c-mdp-nouveau').value },
    'Mot de passe modifié. Les autres appareils ont été déconnectés.',
  );
});

$('c-form-email').addEventListener('submit', (evenement) => {
  evenement.preventDefault();
  soumettreSecurite(
    $('c-form-email'),
    '/api/auth/email',
    { nouvel_email: $('c-email-nouveau').value, mot_de_passe: $('c-email-mdp').value },
    'Un e-mail de confirmation a été envoyé.',
  );
});

async function deconnecter(url) {
  try {
    await poster(url, {});
    location.href = '/connexion/';
  } catch {
    annoncer('La déconnexion a échoué. Réessaie dans un instant.');
  }
}

$('c-deconnexion').addEventListener('click', () => deconnecter('/api/auth/deconnexion'));
$('c-deconnexion-globale').addEventListener('click', () =>
  deconnecter('/api/auth/deconnexion-globale'),
);

// ---------- Suppression du compte ----------

const champSuppression = $('c-suppr-champ');
const champMotDePasse = $('c-suppr-mdp');
const boutonSuppression = $('c-suppr-oui');

// Le bouton ne s'active que si SUPPRIMER est écrit (et le mot de passe saisi en mode "compte").
function majBoutonSuppression() {
  const confirme = champSuppression.value.trim().toUpperCase() === 'SUPPRIMER';
  const motDePasseOk = mode !== 'compte' || champMotDePasse.value.length > 0;
  boutonSuppression.disabled = !(confirme && motDePasseOk);
}

champSuppression.addEventListener('input', majBoutonSuppression);
champMotDePasse.addEventListener('input', majBoutonSuppression);

boutonSuppression.addEventListener('click', async () => {
  boutonSuppression.disabled = true;
  champSuppression.disabled = true;
  champMotDePasse.disabled = true;
  annoncer('');
  try {
    await posterCompte({
      action: 'supprimer',
      confirmation: 'SUPPRIMER',
      mot_de_passe: champMotDePasse.value,
    });
  } catch (e) {
    annoncer(
      e.message && e.message !== 'Requête refusée'
        ? `${e.message} Ton compte est intact.`
        : 'La suppression a échoué. Ton compte est intact. Réessaie dans un instant.',
    );
    champSuppression.disabled = false;
    champMotDePasse.disabled = false;
    majBoutonSuppression();
    return;
  }
  // Compte supprimé : on masque la page, puis on quitte (déconnexion Access ou page de connexion).
  $('c-contenu').hidden = true;
  $('c-supprime').hidden = false;
  setTimeout(() => {
    location.href = mode === 'compte' ? '/connexion/' : '/cdn-cgi/access/logout';
  }, 3000);
});

// ---------- Démarrage ----------

async function demarrer() {
  try {
    await recharger();
  } catch {
    annoncer('Impossible de charger ton compte pour le moment. Réessaie dans un instant.');
  } finally {
    section.classList.remove('attente');
  }
}

demarrer();
