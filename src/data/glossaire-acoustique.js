// Glossaire du chapitre « L'acoustique » du B.A.-BA.
// Même format que glossaire.js (voir les champs décrits en tête de ce fichier).
// Ce fichier est fusionné par glossaire.js.

export const termes = [
  {
    terme: 'Bruit aérien',
    categorie: 'Acoustique',
    definition:
      "Bruit qui se propage dans l'air (voix, télévision, musique), puis traverse les parois. Entre deux logements neufs, l'isolement DnT,A doit être d'au moins 53 dB.",
    aussi: ['Bruits aériens', 'Bruit aérien entre logements'],
  },
  {
    terme: 'Bruit de choc',
    categorie: 'Acoustique',
    definition:
      "Bruit produit par un choc sur la structure (pas, chute d'objet, chaise tirée) et transmis à l'étage du dessous. Il se mesure par L'nT,w, qui ne doit pas dépasser 58 dB dans les pièces principales d'un logement neuf.",
    aussi: ['Bruits de choc', "Bruit d'impact", "Bruits d'impact"],
  },
  {
    terme: 'Décibel',
    developpe: 'dB',
    categorie: 'Acoustique',
    definition:
      "Unité de mesure du bruit, sur une échelle logarithmique : deux sources identiques ajoutent environ 3 dB, et un écart de 10 dB est perçu comme un bruit deux fois plus fort ou deux fois plus faible. Le dB(A) tient compte de la sensibilité de l'oreille.",
    aussi: ['dB', 'dB(A)', 'Décibels'],
  },
  {
    terme: "L'nT,w",
    developpe: 'Niveau de pression pondéré du bruit de choc standardisé',
    categorie: 'Acoustique',
    definition:
      "Indicateur du bruit de choc perçu dans le logement récepteur. Plus il est bas, meilleur est le sol. L'exigence pour un logement neuf est de 58 dB au plus dans les pièces principales.",
    aussi: ["L'nTw", 'LnTw'],
  },
  {
    terme: 'LnAT',
    developpe: 'Niveau de pression acoustique normalisé',
    categorie: 'Acoustique',
    definition:
      "Indicateur du bruit d'un équipement (ventilation, chauffage, ascenseur) perçu dans un logement, en dB(A). Pour la ventilation au débit minimal, il doit rester sous 30 dB(A) dans les pièces principales et 35 dB(A) dans les cuisines.",
    aussi: ['LnAT', "Bruit d'équipement", "Bruits d'équipements"],
  },
  {
    terme: 'Attestation acoustique',
    developpe: 'Attestation de prise en compte de la réglementation acoustique',
    categorie: 'Réglementation',
    definition:
      "Document que le maître d'ouvrage remet à l'achèvement des travaux, pour les logements neufs dont le permis est déposé depuis le 1er janvier 2013. Il s'appuie sur les études, le chantier et, à partir de 10 logements, sur des mesures acoustiques sur site.",
    aussi: ['Attestation de prise en compte de la réglementation acoustique', 'Attestation acoustique à l\'achèvement'],
  },
  {
    terme: 'Plancher flottant',
    categorie: 'Acoustique',
    definition:
      "Revêtement de sol posé sur une couche souple, sans contact rigide avec la structure, pour empêcher les chocs de se transmettre au plancher et à l'étage du dessous.",
    aussi: ['Chape flottante', 'Sol flottant', 'Sous-couche résiliente'],
  },
  {
    terme: 'Transmissions latérales',
    categorie: 'Acoustique',
    definition:
      "Passage du bruit d'un local à l'autre par les parois voisines (murs de refend, planchers, façades) plutôt que par la paroi qui les sépare. Elles limitent l'isolement réel d'un bâtiment, d'où l'importance des jonctions.",
    aussi: ['Transmission latérale', 'Transmissions parasites', 'Flanking'],
  },
];
