// Page d'administration : invitations et gestion des comptes.
// Tout le texte venant des comptes (e-mail, prénom) est inséré avec textContent, jamais en HTML.

const message = document.getElementById('ad-message');
const liste = document.getElementById('ad-liste');
const vide = document.getElementById('ad-vide');
const titreComptes = document.getElementById('t-comptes');
const formInvitation = document.getElementById('ad-form-invitation');
const champEmail = document.getElementById('ad-email');

let compteur = 0;

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

function afficher(texte, erreur = false) {
  message.textContent = texte;
  message.hidden = false;
  message.classList.toggle('ad-erreur', erreur);
  message.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

async function appel(chemin, corps) {
  const options = corps
    ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corps) }
    : {};
  const reponse = await fetch(chemin, options);
  let donnees = {};
  try {
    donnees = await reponse.json();
  } catch {
    // réponse sans corps JSON
  }
  if (reponse.status === 401) {
    location.href = '/connexion/?retour=/admin/';
    throw new Error('Session expirée.');
  }
  if (!reponse.ok) throw new Error(donnees.erreur || 'Une erreur est survenue. Réessaie.');
  return donnees;
}

function date(valeur) {
  if (!valeur) return 'jamais';
  const d = new Date(String(valeur).replace(' ', 'T') + 'Z');
  return Number.isNaN(d.getTime())
    ? valeur
    : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function pluriel(n, singulier, plurielTexte) {
  return `${n} ${n > 1 ? plurielTexte : singulier}`;
}

// Zone de confirmation sous les boutons d'une carte.
function confirmer(zone, texte, libelle, action, { motDePasse = false } = {}) {
  zone.replaceChildren();
  zone.hidden = false;
  zone.append(el('p', { texte }));

  let champ = null;
  if (motDePasse) {
    const id = `ad-mdp-${++compteur}`;
    champ = el('input', { id, type: 'password', autocomplete: 'current-password' });
    zone.append(el('label', { for: id, texte: 'Ton mot de passe' }), champ);
  }

  const oui = el('button', { class: 'ad-bouton', type: 'button', texte: libelle });
  const non = el('button', { class: 'ad-bouton ad-bouton-secondaire', type: 'button', texte: 'Annuler' });
  non.addEventListener('click', () => {
    zone.hidden = true;
    zone.replaceChildren();
  });
  oui.addEventListener('click', async () => {
    if (champ && !champ.value) {
      champ.focus();
      return;
    }
    oui.disabled = true;
    try {
      const resultat = await action(champ ? champ.value : '');
      afficher(resultat.message || 'Fait.');
      await charger();
    } catch (erreur) {
      afficher(erreur.message, true);
      oui.disabled = false;
    }
  });
  zone.append(el('div', { class: 'ad-boutons' }, oui, non));
  (champ || oui).focus();
}

function carte(u, moi) {
  const estAdmin = u.role === 'admin';
  const nom = u.prenom || u.email;

  const entete = el('p', { class: 'ad-nom' }, el('strong', { texte: nom }));
  if (estAdmin) entete.append(el('span', { class: 'ad-badge', texte: u.id === moi ? 'Administrateur, c’est toi' : 'Administrateur' }));
  if (u.en_attente) entete.append(el('span', { class: 'ad-badge ad-badge-attente', texte: 'Invitation en attente' }));

  const li = el('li', { class: 'ad-compte' }, entete);
  if (u.prenom) li.append(el('p', { class: 'ad-email', texte: u.email }));

  li.append(
    el('p', { class: 'ad-meta', texte: `Créé le ${date(u.cree_le)}.` }),
    el('p', {
      class: 'ad-meta',
      texte: u.en_attente ? 'Pas encore connecté.' : `Dernière visite : ${date(u.derniere_visite)}.`,
    }),
  );

  if (!u.en_attente) {
    li.append(
      el('p', {
        class: 'ad-meta',
        texte:
          `${pluriel(u.chapitres_commences, 'chapitre commencé', 'chapitres commencés')}, ` +
          `${u.chapitres_termines} terminé${u.chapitres_termines > 1 ? 's' : ''}, ` +
          `${pluriel(u.quiz_passes, 'quiz passé', 'quiz passés')}.`,
      }),
    );
  }

  if (estAdmin) return li;

  const zone = el('div', { class: 'ad-confirm', hidden: '' });
  zone.hidden = true;

  const boutonLien = el('button', {
    class: 'ad-bouton ad-bouton-secondaire',
    type: 'button',
    texte: u.en_attente ? 'Renvoyer l’invitation' : 'Envoyer un lien de mot de passe',
  });
  boutonLien.addEventListener('click', () =>
    confirmer(
      zone,
      u.en_attente
        ? `Un nouvel e-mail d’invitation sera envoyé à ${u.email} (lien valable 7 jours).`
        : `${u.email} recevra un lien pour choisir un nouveau mot de passe (valable 1 heure). Son mot de passe actuel reste valable tant qu’il n’a pas utilisé le lien.`,
      'Envoyer',
      () => appel('/api/admin/lien', { id: u.id }),
    ),
  );

  const boutons = el('div', { class: 'ad-boutons' }, boutonLien);

  if (!u.en_attente) {
    const boutonParcours = el('button', {
      class: 'ad-bouton ad-bouton-secondaire',
      type: 'button',
      texte: 'Remettre le parcours à zéro',
    });
    boutonParcours.addEventListener('click', () =>
      confirmer(
        zone,
        'Les niveaux validés, les scores de quiz et les cartes de révision seront effacés. Ses notes et son glossaire personnel sont conservés. Action définitive.',
        'Oui, remettre à zéro',
        () => appel('/api/admin/parcours', { id: u.id }),
      ),
    );
    boutons.append(boutonParcours);
  }

  const boutonSuppr = el('button', { class: 'ad-lien', type: 'button', texte: 'Supprimer le compte' });
  boutonSuppr.addEventListener('click', () =>
    confirmer(
      zone,
      `Le compte ${u.email} et toutes ses données (parcours, notes, glossaire, scénarios) seront effacés définitivement.`,
      'Supprimer définitivement',
      (motDePasse) =>
        appel('/api/admin/supprimer', { id: u.id, email: u.email, mot_de_passe: motDePasse }),
      { motDePasse: true },
    ),
  );

  li.append(boutons, el('div', { class: 'ad-boutons' }, boutonSuppr), zone);
  return li;
}

async function charger() {
  const donnees = await appel('/api/admin/utilisateurs');
  liste.replaceChildren(...donnees.utilisateurs.map((u) => carte(u, donnees.moi)));
  const autres = donnees.utilisateurs.filter((u) => u.role !== 'admin').length;
  titreComptes.textContent = `Comptes (${donnees.utilisateurs.length})`;
  vide.hidden = autres > 0;
}

formInvitation.addEventListener('submit', async (evenement) => {
  evenement.preventDefault();
  const bouton = formInvitation.querySelector('button[type="submit"]');
  bouton.disabled = true;
  try {
    const resultat = await appel('/api/admin/inviter', { email: champEmail.value.trim() });
    champEmail.value = '';
    afficher(resultat.message);
  } catch (erreur) {
    afficher(erreur.message, true);
  }
  bouton.disabled = false;
  try {
    await charger();
  } catch {
    // la liste se rechargera au prochain essai
  }
});

charger().catch((erreur) => afficher(erreur.message, true));
