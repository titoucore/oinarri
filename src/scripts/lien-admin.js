// Affiche le lien « Administration » sur la page « Mon compte », pour les administrateurs seulement.
// Le contrôle réel reste côté serveur : sans le rôle admin, /admin/ et /api/admin/* répondent 404.
fetch('/api/moi')
  .then((reponse) => (reponse.ok ? reponse.json() : null))
  .then((moi) => {
    const lien = document.getElementById('c-admin');
    if (moi && moi.admin && lien) lien.hidden = false;
  })
  .catch(() => {});
