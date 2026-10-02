// Pages d'authentification (connexion, mot de passe oublié, nouveau mot de passe,
// confirmation d'e-mail). Le formulaire porte data-action = connexion | oubli | reinitialiser | confirmer.
// Ces pages sont publiques : elles n'appellent que les routes /api/auth/*.

const formulaire = document.getElementById('form-auth');

if (formulaire) {
  const action = formulaire.dataset.action;
  const zoneErreur = document.getElementById('auth-erreur');
  const zoneSucces = document.getElementById('auth-succes');
  const texteSucces = document.getElementById('auth-succes-texte');
  const lienSucces = document.getElementById('auth-succes-lien');
  const bouton = formulaire.querySelector('button[type="submit"]');
  const valeur = (id) => document.getElementById(id)?.value ?? '';

  function afficherErreur(texte) {
    zoneErreur.textContent = texte;
    zoneErreur.hidden = !texte;
  }

  function afficherSucces(texte, lien) {
    formulaire.hidden = true;
    texteSucces.textContent = texte;
    if (lien) {
      lienSucces.textContent = lien.texte;
      lienSucces.href = lien.href;
      lienSucces.hidden = false;
    }
    zoneSucces.hidden = false;
  }

  // Destination après connexion : uniquement un chemin interne au site.
  function destination() {
    const retour = new URLSearchParams(location.search).get('retour');
    const interne =
      retour &&
      retour.startsWith('/') &&
      !retour.startsWith('//') &&
      !retour.startsWith('/\\') &&
      !retour.startsWith('/connexion') &&
      !retour.startsWith('/api/');
    return interne ? retour : '/';
  }

  async function poster(url, corps) {
    const reponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corps),
    });
    const donnees = await reponse.json().catch(() => ({}));
    return { ok: reponse.ok, donnees };
  }

  // Le jeton d'un lien reçu par e-mail est lu une fois puis retiré de l'adresse affichée.
  let jeton = null;
  if (action === 'reinitialiser' || action === 'confirmer') {
    jeton = new URLSearchParams(location.search).get('jeton');
    if (jeton) history.replaceState(null, '', location.pathname);
    else {
      formulaire.hidden = true;
      afficherSucces("Ce lien est incomplet ou n'est plus valable.", {
        texte: 'Demander un nouveau lien',
        href: '/mot-de-passe-oublie/',
      });
    }
  }

  formulaire.addEventListener('submit', async (evenement) => {
    evenement.preventDefault();
    afficherErreur('');

    if (action === 'reinitialiser' && valeur('a-nouveau') !== valeur('a-confirmation')) {
      afficherErreur('Les deux mots de passe ne sont pas identiques.');
      return;
    }

    bouton.disabled = true;
    try {
      if (action === 'connexion') {
        const { ok, donnees } = await poster('/api/auth/connexion', {
          email: valeur('a-email'),
          mot_de_passe: valeur('a-mdp'),
        });
        if (ok) {
          location.href = destination();
          return;
        }
        afficherErreur(donnees.erreur || 'Connexion impossible pour le moment.');
      } else if (action === 'oubli') {
        const { ok, donnees } = await poster('/api/auth/mot-de-passe-oublie', {
          email: valeur('a-email'),
        });
        if (ok) afficherSucces(donnees.message);
        else afficherErreur(donnees.erreur || 'Demande impossible pour le moment.');
      } else if (action === 'reinitialiser') {
        const { ok, donnees } = await poster('/api/auth/reinitialiser', {
          jeton,
          mot_de_passe: valeur('a-nouveau'),
        });
        if (ok) {
          afficherSucces('Ton mot de passe est enregistré. Tu peux maintenant te connecter.', {
            texte: 'Se connecter',
            href: '/connexion/',
          });
        } else afficherErreur(donnees.erreur || 'Enregistrement impossible pour le moment.');
      } else if (action === 'confirmer') {
        const { ok, donnees } = await poster('/api/auth/confirmer-email', { jeton });
        if (ok) {
          afficherSucces(
            'Ton adresse e-mail est modifiée. Connecte-toi avec ta nouvelle adresse.',
            { texte: 'Se connecter', href: '/connexion/' },
          );
        } else afficherErreur(donnees.erreur || 'Confirmation impossible pour le moment.');
      }
    } catch {
      afficherErreur('Connexion impossible. Réessaie dans un instant.');
    }
    bouton.disabled = false;
  });
}
