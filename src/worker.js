// Worker d'Oinarri.
// Les pages du site (dossier dist) sont servies directement par Cloudflare.
// Ce Worker n'est appelé en premier que pour les routes /api/* (voir wrangler.jsonc).
// Les comptes, la progression (D1) et l'envoi des liens de connexion (Resend)
// viendront s'ajouter ici dans une étape ultérieure.

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/sante') {
      return Response.json({
        app: 'oinarri',
        ok: true,
        date: new Date().toISOString(),
      });
    }

    if (url.pathname.startsWith('/api/')) {
      return Response.json({ erreur: 'Route inconnue' }, { status: 404 });
    }

    return env.ASSETS.fetch(request);
  },
};
