// Glossaire du parcours « Nouvelles méthodes de construction » (biosourcé, géosourcé, réemploi).
// Même format que glossaire.js (voir les champs décrits en tête de ce fichier).
// Ce fichier est fusionné avec les autres par glossaire.js : on n'y touche pas pour ajouter
// un terme d'un autre parcours.

export const termes = [
  {
    terme: 'Biosourcé',
    categorie: 'Biosourcé',
    definition:
      "Se dit d'une matière partiellement ou totalement issue de la biomasse végétale ou animale (bois, paille, chanvre, lin, liège, laine de mouton…). Le mot décrit l'origine de la matière, pas sa performance.",
    aussi: ['Matériau biosourcé', 'Matériaux biosourcés', 'Biosourcés', 'Matière biosourcée', 'Produit biosourcé', 'Produits biosourcés'],
  },
  {
    terme: 'Biomasse',
    categorie: 'Biosourcé',
    definition:
      "Matière d'origine biologique, à l'exception des matières de formation géologique ou fossile.",
  },
  {
    terme: 'Géosourcé',
    categorie: 'Géosourcé',
    definition:
      "Se dit d'un matériau issu de ressources d'origine minérale, peu transformées, comme la terre crue ou la pierre. C'est une description d'usage (ministère, Cerema), sans définition réglementaire repérée.",
    aussi: ['Matériau géosourcé', 'Matériaux géosourcés', 'Géosourcés'],
  },
  {
    terme: 'Réemploi',
    categorie: 'Réglementation',
    definition:
      "Opération par laquelle un produit qui n'est pas un déchet est utilisé de nouveau pour un usage identique à celui pour lequel il avait été conçu. Le code de l'environnement (article L541-1-1) le range parmi les mesures de prévention des déchets.",
    aussi: ['Réemployer', 'Produit de réemploi', 'Matériaux de réemploi'],
  },
  {
    terme: 'Réutilisation',
    categorie: 'Réglementation',
    definition:
      "Opération par laquelle un produit devenu déchet est utilisé de nouveau. À la différence du réemploi, l'usage peut être différent de l'usage d'origine.",
    aussi: ['Réutiliser'],
  },
  {
    terme: 'Préparation en vue de la réutilisation',
    categorie: 'Réglementation',
    definition:
      "Opération de contrôle, de nettoyage ou de réparation par laquelle un déchet est préparé pour être utilisé de nouveau sans autre traitement.",
  },
  {
    terme: 'Recyclage',
    categorie: 'Réglementation',
    definition:
      "Opération de valorisation par laquelle des déchets sont retraités pour en refaire de la matière. Selon le code de l'environnement, la valorisation énergétique, la conversion en combustible et le remblayage ne sont pas du recyclage.",
    aussi: ['Recycler', 'Recyclé'],
  },
  {
    terme: 'Prévention des déchets',
    categorie: 'Réglementation',
    definition:
      "Mesures prises avant qu'un produit devienne un déchet, pour réduire la quantité de déchets, leurs effets nocifs ou leur teneur en substances dangereuses. Le réemploi et la prolongation de la durée d'usage en font partie.",
    aussi: ['Prévention'],
  },
  {
    terme: 'Hiérarchie des modes de traitement des déchets',
    categorie: 'Réglementation',
    definition:
      "Ordre de priorité fixé par l'article L541-1 du code de l'environnement : après la prévention, la préparation en vue de la réutilisation, le recyclage, une autre valorisation (notamment énergétique), puis l'élimination.",
    aussi: ['Hiérarchie des déchets', 'Ordre de priorité des déchets'],
  },
  {
    terme: 'Cycle de vie',
    categorie: 'Concepts',
    definition:
      "L'ensemble des étapes de la vie d'un produit ou d'un bâtiment : extraction des matières, fabrication, transport, chantier, usage, fin de vie, puis possibilités de recyclage ou de réemploi.",
    aussi: ['Cycle de vie du bâtiment'],
  },
  {
    terme: 'ACV',
    developpe: 'Analyse de Cycle de Vie',
    categorie: 'Concepts',
    definition:
      "Méthode qui additionne les impacts environnementaux d'un produit ou d'un bâtiment sur toutes les étapes de sa vie. La RE2020 l'impose pour le carbone, sur une durée conventionnelle de 50 ans.",
    aussi: ['Analyse de cycle de vie', 'ACV dynamique'],
  },
  {
    terme: 'RE2020',
    developpe: 'Réglementation Environnementale 2020',
    categorie: 'Réglementation',
    definition:
      "Réglementation des bâtiments neufs, en vigueur pour les logements depuis le 1er janvier 2022. Elle encadre la consommation d'énergie, le confort d'été et, pour la première fois, l'impact carbone sur le cycle de vie.",
    aussi: ['Réglementation environnementale 2020', 'RE 2020'],
  },
  {
    terme: 'Ic construction',
    categorie: 'Réglementation',
    definition:
      "Indicateur de la RE2020 qui mesure l'impact carbone des produits de construction, des équipements et de leur mise en œuvre sur le chantier, en kilogrammes équivalent CO₂ par mètre carré.",
    aussi: ['Ic_construction', 'IC construction'],
  },
  {
    terme: 'Ic énergie',
    categorie: 'Réglementation',
    definition:
      "Indicateur de la RE2020 qui mesure l'impact carbone des consommations d'énergie du bâtiment sur sa durée de vie conventionnelle de 50 ans.",
    aussi: ['Ic_énergie', 'IC énergie'],
  },
  {
    terme: 'Carbone biogénique',
    categorie: 'Biosourcé',
    definition:
      "Carbone absorbé par les végétaux pendant leur croissance. Il reste stocké dans un matériau biosourcé tant que celui-ci reste en place. Le label Bâtiment biosourcé en mesure la quantité stockée.",
    aussi: ['Carbone biogénique stocké', 'Stockage de carbone'],
  },
  {
    terme: 'Label bâtiment biosourcé',
    categorie: 'Biosourcé',
    definition:
      "Label prévu par l'article D171-6 du code de la construction et de l'habitation, délivré par un organisme conventionné avec l'État. Depuis l'arrêté du 2 juillet 2024, ses trois niveaux reposent sur la quantité de carbone biogénique stocké par mètre carré de surface de référence.",
    aussi: ['Bâtiment biosourcé', 'Label biosourcé'],
  },
  {
    terme: 'Émissions directes',
    categorie: 'Concepts',
    definition:
      "Émissions de gaz à effet de serre produites sur place, par exemple par la combustion du gaz ou du fioul d'un bâtiment (scope 1). Les chiffres officiels du secteur du bâtiment ne comptent qu'elles.",
    aussi: ['Scope 1', 'Émissions directes de gaz à effet de serre'],
  },
];
