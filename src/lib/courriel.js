// Envoi d'e-mails transactionnels via l'API de Resend.
// Variables du Worker : RESEND_API_KEY (secret) et EXPEDITEUR (ex. "Oinarri <no-reply@mail.etika.eus>").
// Les messages sont en texte brut : plus simples, plus sûrs et mieux distribués.

export async function envoyerCourriel(env, { a, sujet, texte }) {
  if (!env.RESEND_API_KEY) throw new Error('Secret RESEND_API_KEY absent');
  const reponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.EXPEDITEUR || 'Oinarri <no-reply@mail.etika.eus>',
      to: [a],
      subject: sujet,
      text: texte,
    }),
  });
  if (!reponse.ok) {
    throw new Error(`Envoi refusé par Resend (HTTP ${reponse.status})`);
  }
}

const SIGNATURE = '\n\nOinarri';

export function courrielReinitialisation(lien) {
  return {
    sujet: 'Oinarri : créer ou réinitialiser ton mot de passe',
    texte:
      'Bonjour,\n\n' +
      'Tu as demandé à créer ou réinitialiser le mot de passe de ton compte Oinarri. ' +
      'Ouvre ce lien (valable 1 heure, utilisable une seule fois) :\n\n' +
      `${lien}\n\n` +
      "Si tu n'es pas à l'origine de cette demande, ignore ce message : ton mot de passe actuel " +
      'reste inchangé.' +
      SIGNATURE,
  };
}

export function courrielInvitation(lien) {
  return {
    sujet: 'Oinarri : tu es invité(e) à rejoindre la plateforme',
    texte:
      'Bonjour,\n\n' +
      "Tu es invité(e) à rejoindre Oinarri, une plateforme d'apprentissage sur le bâtiment, " +
      'la construction, la promotion immobilière et le logement social.\n\n' +
      'Pour activer ton compte, ouvre ce lien et choisis ton mot de passe ' +
      '(valable 7 jours, utilisable une seule fois) :\n\n' +
      `${lien}\n\n` +
      'Si cette invitation ne te concerne pas, ignore ce message : aucun compte ne sera activé.' +
      SIGNATURE,
  };
}

export function courrielMotDePasseModifie() {
  return {
    sujet: 'Oinarri : ton mot de passe a été modifié',
    texte:
      'Bonjour,\n\n' +
      'Le mot de passe de ton compte Oinarri vient d\'être modifié. Tu as été déconnecté des ' +
      'autres appareils.\n\n' +
      "Si tu n'es pas à l'origine de ce changement, utilise « Mot de passe oublié » sur la page de " +
      'connexion pour reprendre la main, et écris-nous.' +
      SIGNATURE,
  };
}

export function courrielConfirmationEmail(lien) {
  return {
    sujet: 'Oinarri : confirme ta nouvelle adresse e-mail',
    texte:
      'Bonjour,\n\n' +
      'Une demande de changement d\'adresse e-mail a été faite pour un compte Oinarri : cette ' +
      'adresse deviendrait l\'identifiant de connexion. Pour confirmer, ouvre ce lien (valable ' +
      '1 heure, utilisable une seule fois) :\n\n' +
      `${lien}\n\n` +
      "Si tu n'es pas à l'origine de cette demande, ignore ce message : rien ne sera modifié." +
      SIGNATURE,
  };
}

export function courrielEmailModifie(nouvelleAdresse) {
  return {
    sujet: "Oinarri : ton adresse e-mail a été modifiée",
    texte:
      'Bonjour,\n\n' +
      `L'adresse e-mail de ton compte Oinarri a été remplacée par ${nouvelleAdresse}. ` +
      'Toutes les sessions ont été fermées : la connexion se fait désormais avec la nouvelle ' +
      'adresse.\n\n' +
      "Si tu n'es pas à l'origine de ce changement, écris-nous sans attendre." +
      SIGNATURE,
  };
}
