// Glossaire du chapitre « L'enveloppe et la thermique » du B.A.-BA.
// Même format que glossaire.js (voir les champs décrits en tête de ce fichier).
// Ce fichier est fusionné par glossaire.js.

export const termes = [
  {
    terme: 'Enveloppe du bâtiment',
    categorie: 'Thermique',
    definition:
      "Ensemble des parois qui séparent l'intérieur chauffé de l'extérieur, du sol ou des locaux non chauffés : toiture ou plancher haut, murs, plancher bas, fenêtres et portes.",
    aussi: ['Enveloppe', 'Parois déperditives'],
  },
  {
    terme: 'Coefficient de transmission thermique',
    developpe: 'U',
    categorie: 'Thermique',
    definition:
      "Quantité de chaleur qui traverse un mètre carré de paroi pour un degré d'écart entre les deux faces, en W/(m²·K). Il vaut 1 divisé par la résistance totale de la paroi (couches et résistances superficielles) : plus il est faible, mieux la paroi isole.",
    aussi: ['Coefficient U', 'U', 'Uc', 'Up', 'Transmission thermique'],
  },
  {
    terme: 'Résistances superficielles',
    developpe: 'Rsi, Rse',
    categorie: 'Thermique',
    definition:
      "Résistances thermiques du film d'air qui colle à chaque face d'une paroi : Rsi à l'intérieur, Rse à l'extérieur. Pour un mur, elles valent 0,13 et 0,04 m²·K/W.",
    aussi: ['Rsi', 'Rse', 'Résistance superficielle'],
  },
  {
    terme: 'Pont thermique',
    categorie: 'Thermique',
    definition:
      "Zone de l'enveloppe où la chaleur passe plus facilement qu'en partie courante : jonction mur-plancher, balcon, appui de fenêtre, montant d'ossature. Il se mesure par un coefficient linéique ψ ou ponctuel χ.",
    aussi: ['Ponts thermiques', 'ψ', 'Coefficient linéique', 'Pont thermique intégré'],
  },
  {
    terme: "Étanchéité à l'air",
    categorie: 'Thermique',
    definition:
      "Capacité de l'enveloppe à limiter les fuites d'air parasites par ses défauts et ses jonctions. Elle se vérifie par le test de la porte soufflante, qui donne l'indicateur Q4Pa-surf.",
    aussi: ["Perméabilité à l'air", "Fuites d'air", "Étanchéité à l'air du bâtiment"],
  },
  {
    terme: 'Q4Pa-surf',
    categorie: 'Réglementation',
    definition:
      "Débit de fuite d'air sous 4 pascals de différence de pression, rapporté à la surface des parois, en m³/(h·m²). D'après les sources professionnelles, il doit rester sous 0,6 en maison individuelle et sous 1,0 en logement collectif.",
    aussi: ['Q4', 'Q4Pa_surf', 'Q4Pa surf'],
  },
  {
    terme: "Test d'infiltrométrie",
    categorie: 'Réglementation',
    definition:
      "Mesure de l'étanchéité à l'air d'un bâtiment avec une porte soufflante : un ventilateur le met en pression ou en dépression et l'on relève le débit de fuite. D'après les sources professionnelles, elle est obligatoire en fin de chantier pour les logements neufs soumis à la RE2020.",
    aussi: ['Porte soufflante', 'Blower door', 'Infiltrométrie', "Test d'étanchéité à l'air"],
  },
  {
    terme: 'Bbio',
    developpe: 'Besoin bioclimatique conventionnel',
    categorie: 'Réglementation',
    definition:
      "Indicateur de la RE2020 qui note, en points, la qualité du bâti indépendamment des équipements : 2 × besoins de chauffage + 2 × besoins de refroidissement + 5 × besoins d'éclairage. Sa valeur doit rester sous le Bbio max, dont la moyenne est de 63 points en maison et 65 en collectif avant modulations.",
    aussi: ['Besoin bioclimatique', 'Bbio max', 'Bbiomax', 'Bbio_max'],
  },
  {
    terme: "Isolation thermique par l'extérieur",
    developpe: 'ITE',
    categorie: 'Thermique',
    definition:
      "Isolation posée sur la face extérieure du mur. Elle passe devant les planchers et traite en général mieux les ponts thermiques, mais elle change l'aspect de la façade.",
    aussi: ['ITE', "Isolation par l'extérieur"],
  },
  {
    terme: "Isolation thermique par l'intérieur",
    developpe: 'ITI',
    categorie: 'Thermique',
    definition:
      "Isolation posée sur la face intérieure du mur. Simple à mettre en œuvre, elle réduit la surface habitable et laisse en général des ponts thermiques au droit des planchers.",
    aussi: ['ITI', "Isolation par l'intérieur"],
  },
];
