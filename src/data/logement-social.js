// Plan du parcours « Bailleurs sociaux et logement social », partagé par l'accueil et la liste des chapitres.
// Un chapitre avec `href` et `cours` est disponible ; sans, il est « À venir ».
// `cours` = identifiant de la collection de contenu (dossier/fichier sans extension).
// Le parcours est en préparation : aucun chapitre n'est encore publié.

export const chapitres = [
  {
    titre: 'Le logement social : principes et acteurs',
    desc: "À quoi sert le logement social, qui décide et qui finance.",
  },
  {
    titre: 'Les organismes HLM',
    desc: 'OPH, ESH, coopératives, SEM : statuts, regroupements et contrôle.',
  },
  {
    titre: 'Les financements aidés',
    desc: 'PLAI, PLUS et PLS : prêts, subventions, TVA et taxe foncière.',
  },
  {
    titre: 'Le loyer et le conventionnement',
    desc: "Loyer maximal, convention APL et aide au logement.",
  },
  {
    titre: 'Les occupants',
    desc: 'Plafonds de ressources, attribution des logements et surloyer.',
  },
  {
    titre: 'La loi SRU et la programmation territoriale',
    desc: 'Quotas de logements sociaux, rattrapage et carence.',
  },
  {
    titre: 'Produire du logement social',
    desc: "Maîtrise d'ouvrage, VEFA à un bailleur et renouvellement urbain.",
  },
  {
    titre: "L'accession sociale",
    desc: 'PSLA, bail réel solidaire et vente HLM.',
  },
  {
    titre: 'Gérer et entretenir le parc',
    desc: 'Maintenance, rénovation énergétique et gestion locative.',
  },
];

export const disponibles = chapitres.filter((c) => c.cours);
