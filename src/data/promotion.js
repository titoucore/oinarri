// Plan du parcours « Promotion immobilière », partagé par l'accueil et la liste des chapitres.
// Plan provisoire : à ajuster avant la rédaction des cours.
// Un chapitre avec `href` et `cours` est disponible ; sans, il est « À venir ».
// `cours` = identifiant de la collection de contenu (dossier/fichier sans extension).

export const chapitres = [
  {
    titre: "Le promoteur et le cycle d'une opération",
    desc: "Qui est promoteur, et les grandes étapes d'une opération, de l'idée à la livraison.",
    href: '/promotion/01-promoteur-et-cycle-d-une-operation/',
    cours: 'promotion/01-promoteur-et-cycle-d-une-operation',
  },
  {
    titre: 'Le foncier',
    desc: 'Trouver, sécuriser et purger un terrain.',
    href: '/promotion/02-le-foncier/',
    cours: 'promotion/02-le-foncier',
  },
  {
    titre: "L'urbanisme",
    desc: "PLU, certificat d'urbanisme, permis de construire et recours.",
    href: '/promotion/03-l-urbanisme/',
    cours: 'promotion/03-l-urbanisme',
  },
  {
    titre: "Le bilan de l'opération",
    desc: 'Recettes, dépenses, marge, surfaces et TVA.',
    href: '/promotion/04-le-bilan-de-l-operation/',
    cours: 'promotion/04-le-bilan-de-l-operation',
  },
  {
    titre: 'Le financement',
    desc: "Fonds propres, crédit, pré-commercialisation et garantie d'achèvement.",
    href: '/promotion/05-le-financement/',
    cours: 'promotion/05-le-financement',
  },
  {
    titre: 'La VEFA',
    desc: 'La vente sur plan : réservation, paiements par étapes et protections de l\'acquéreur.',
    href: '/promotion/06-la-vefa/',
    cours: 'promotion/06-la-vefa',
  },
  {
    titre: 'Garanties et assurances',
    desc: 'Parfait achèvement, biennale, décennale, dommages-ouvrage et assurances du vendeur.',
    href: '/promotion/07-garanties-et-assurances/',
    cours: 'promotion/07-garanties-et-assurances',
  },
  {
    titre: 'Commercialisation, livraison et réception',
    desc: 'De la réservation à la remise des clés.',
  },
];

export const disponibles = chapitres.filter((c) => c.cours);
