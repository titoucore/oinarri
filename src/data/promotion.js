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
  },
  {
    titre: "Le bilan de l'opération",
    desc: 'Charge foncière, prix de revient, marge.',
  },
  {
    titre: 'Le financement',
    desc: 'Fonds propres, crédit et garanties financières.',
  },
  {
    titre: 'La VEFA',
    desc: "Le contrat, les paiements par étapes et les protections de l'acquéreur.",
  },
  {
    titre: 'Garanties et assurances',
    desc: 'Achèvement, parfait achèvement, biennale, décennale, dommages-ouvrage.',
  },
  {
    titre: 'Commercialisation, livraison et réception',
    desc: 'De la réservation à la remise des clés.',
  },
];

export const disponibles = chapitres.filter((c) => c.cours);
