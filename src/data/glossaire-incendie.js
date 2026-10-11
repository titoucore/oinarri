// Glossaire du chapitre « La sécurité incendie des logements » du B.A.-BA.
// Même format que glossaire.js (voir les champs décrits en tête de ce fichier).
// Ce fichier est fusionné par glossaire.js.

export const termes = [
  {
    terme: "Famille d'habitation",
    categorie: 'Réglementation',
    definition:
      "Classement d'un bâtiment d'habitation du point de vue de l'incendie, de la 1re à la 4e famille, selon sa hauteur et son type. Plus la famille est élevée, plus la structure et les planchers doivent résister longtemps au feu. Au-dessus de 50 m, ce sont les règles des immeubles de grande hauteur.",
    aussi: ['Familles', 'Première famille', 'Deuxième famille', 'Troisième famille', 'Quatrième famille', '3e famille A', '3e famille B', '1re famille', '2e famille', '4e famille'],
  },
  {
    terme: 'Stabilité au feu',
    developpe: 'SF',
    categorie: 'Réglementation',
    definition:
      "Durée pendant laquelle un élément porteur conserve sa stabilité en cas d'incendie. Pour les logements, elle va de 15 minutes (1re famille) à 1 h 30 (4e famille).",
    aussi: ['SF', 'Stable au feu', 'Stabilité au feu de la structure'],
  },
  {
    terme: 'Escalier protégé',
    categorie: 'Réglementation',
    definition:
      "Escalier dont le dégagement est isolé du feu et de la fumée, soit « à l'air libre », soit « à l'abri des fumées ». Il est exigé dans les habitations de la 3e famille B.",
    aussi: ['Escaliers protégés', "Escalier à l'abri des fumées", "Escalier à l'air libre"],
  },
  {
    terme: 'Voie-échelles',
    categorie: 'Réglementation',
    definition:
      "Voie aux caractéristiques réglementaires, placée en bordure du bâtiment, qui permet aux pompiers de dresser leurs échelles. Elle est demandée pour la 3e famille A.",
    aussi: ['Voie échelles', 'Voies-échelles'],
  },
  {
    terme: 'Voie-engins',
    categorie: 'Réglementation',
    definition:
      "Voie ouverte à la circulation des engins de secours. Pour la 3e famille B et la 4e famille, les accès aux escaliers doivent être à moins de 50 m d'une voie-engins.",
    aussi: ['Voie engins', 'Voies-engins'],
  },
  {
    terme: 'Porte palière',
    categorie: 'Construction',
    definition:
      "Porte d'entrée d'un logement, donnant sur le palier ou la circulation commune. En 2e et 3e familles, elle doit être pare-flammes un quart d'heure.",
    aussi: ['Portes palières', 'Bloc-porte palier', 'Porte palier'],
  },
  {
    terme: 'Écran thermique',
    categorie: 'Réglementation',
    definition:
      "Protection (par exemple une plaque de plâtre) posée sur un isolant combustible pour qu'il ne s'embrase pas trop vite en cas d'incendie intérieur. L'arrêté du 7 août 2019 renvoie au guide de l'isolation par l'intérieur de 2016.",
    aussi: ['Écrans thermiques', 'Protection thermique de l\'isolant'],
  },
  {
    terme: 'IGH',
    developpe: 'Immeuble de grande hauteur',
    categorie: 'Réglementation',
    definition:
      "Immeuble dont le plancher bas du logement le plus haut dépasse 50 m. Il relève de règles de sécurité spécifiques et non de l'arrêté du 31 janvier 1986.",
    aussi: ['Immeubles de grande hauteur', 'IGH habitation'],
  },
  {
    terme: 'IMH',
    developpe: 'Immeuble de moyenne hauteur',
    categorie: 'Réglementation',
    definition:
      "Catégorie créée par la loi ELAN, qui remplace la 4e famille pour les immeubles d'habitation dont le plancher bas du niveau le plus haut est à 50 m au plus du sol accessible aux engins et qui ne relèvent pas des trois premières familles.",
    aussi: ['Immeubles de moyenne hauteur', 'IMH habitation'],
  },
];
