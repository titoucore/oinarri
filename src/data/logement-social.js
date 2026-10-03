// Plan du parcours « Bailleurs sociaux et logement social », partagé par l'accueil et la liste des chapitres.
// Un chapitre avec `href` et `cours` est disponible ; sans, il est « À venir ».
// `cours` = identifiant de la collection de contenu (dossier/fichier sans extension).
// Le parcours est complet : les neuf chapitres sont publiés.

export const chapitres = [
  {
    titre: 'Le logement social : principes et acteurs',
    desc: "À quoi sert le logement social, qui décide et qui finance.",
    href: '/logement-social/01-principes-et-acteurs/',
    cours: 'logement-social/01-principes-et-acteurs',
  },
  {
    titre: 'Les organismes HLM',
    desc: 'OPH, ESH, coopératives, SEM : statuts, regroupements et contrôle.',
    href: '/logement-social/02-les-organismes-hlm/',
    cours: 'logement-social/02-les-organismes-hlm',
  },
  {
    titre: 'Les financements aidés',
    desc: 'PLAI, PLUS et PLS : prêts, subventions, TVA et taxe foncière.',
    href: '/logement-social/03-les-financements-aides/',
    cours: 'logement-social/03-les-financements-aides',
  },
  {
    titre: 'Le loyer et le conventionnement',
    desc: "Loyer maximal, convention APL et aide au logement.",
    href: '/logement-social/04-le-loyer-et-le-conventionnement/',
    cours: 'logement-social/04-le-loyer-et-le-conventionnement',
  },
  {
    titre: 'Les occupants',
    desc: 'Plafonds de ressources, attribution des logements et surloyer.',
    href: '/logement-social/05-les-occupants/',
    cours: 'logement-social/05-les-occupants',
  },
  {
    titre: 'La loi SRU et la programmation territoriale',
    desc: 'Quotas de logements sociaux, rattrapage et carence.',
    href: '/logement-social/06-la-loi-sru/',
    cours: 'logement-social/06-la-loi-sru',
  },
  {
    titre: 'Produire du logement social',
    desc: "Maîtrise d'ouvrage, VEFA à un bailleur et renouvellement urbain.",
    href: '/logement-social/07-produire-du-logement-social/',
    cours: 'logement-social/07-produire-du-logement-social',
  },
  {
    titre: "L'accession sociale",
    desc: 'PSLA, bail réel solidaire et vente HLM.',
    href: '/logement-social/08-l-accession-sociale/',
    cours: 'logement-social/08-l-accession-sociale',
  },
  {
    titre: 'Gérer et entretenir le parc',
    desc: 'Rénovation énergétique, prêts et aides, convention d\'utilité sociale et contrôle.',
    href: '/logement-social/09-gerer-et-entretenir-le-parc/',
    cours: 'logement-social/09-gerer-et-entretenir-le-parc',
  },
];

export const disponibles = chapitres.filter((c) => c.cours);
