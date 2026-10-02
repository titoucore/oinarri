// Limitation du nombre de tentatives (connexion, demandes de réinitialisation…).
// Un compteur par clé et par fenêtre de temps, stocké dans la table `limites`.
// Les clés sont des empreintes (voir hmacHex) : ni IP ni e-mail en clair en base.

const maintenant = () => Math.floor(Date.now() / 1000);

// Compte une tentative et indique si elle reste dans la limite.
// max tentatives autorisées par fenêtre de `fenetre` secondes.
export async function verifierLimite(env, cle, max, fenetre) {
  const t = maintenant();
  const ligne = await env.DB_OINARRI.prepare(
    `INSERT INTO limites (cle, compteur, debut) VALUES (?, 1, ?)
     ON CONFLICT(cle) DO UPDATE SET
       compteur = CASE WHEN ? - debut >= ? THEN 1 ELSE compteur + 1 END,
       debut = CASE WHEN ? - debut >= ? THEN ? ELSE debut END
     RETURNING compteur, debut`,
  )
    .bind(cle, t, t, fenetre, t, fenetre, t)
    .first();
  return {
    autorise: ligne.compteur <= max,
    reessayerDans: Math.max(0, ligne.debut + fenetre - t),
  };
}

// Remet un compteur à zéro (par exemple après une connexion réussie).
export async function oublierLimite(env, cle) {
  await env.DB_OINARRI.prepare('DELETE FROM limites WHERE cle = ?').bind(cle).run();
}

// Ménage opportuniste des compteurs et des jetons périmés.
export async function nettoyerLimitesEtJetons(env) {
  const t = maintenant();
  await env.DB_OINARRI.batch([
    env.DB_OINARRI.prepare('DELETE FROM limites WHERE debut < ?').bind(t - 24 * 3600),
    env.DB_OINARRI.prepare('DELETE FROM jetons WHERE expire_le < ?').bind(t - 24 * 3600),
  ]);
}
