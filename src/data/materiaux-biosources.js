// Plan du parcours « Nouvelles méthodes de construction » (biosourcé, géosourcé, réemploi), partagé par l'accueil et la liste des chapitres.
// Un chapitre avec `href` et `cours` est disponible ; sans, il est « À venir ».
// `cours` = identifiant de la collection de contenu (dossier/fichier sans extension).
// Les dix chapitres du parcours sont écrits.

export const chapitres = [
  {
    titre: 'Pourquoi changer',
    desc: 'Carbone, cycle de vie et vocabulaire : biosourcé, géosourcé, réemploi, réutilisation, recyclage.',
    href: '/materiaux-biosources/01-pourquoi-changer/',
    cours: 'materiaux-biosources/01-pourquoi-changer',
  },
  {
    titre: 'Les matériaux biosourcés',
    desc: 'Bois, paille, chanvre, ouate de cellulose, liège, lin : origines et usages.',
    href: '/materiaux-biosources/02-les-materiaux-biosources/',
    cours: 'materiaux-biosources/02-les-materiaux-biosources',
  },
  {
    titre: 'Les matériaux géosourcés',
    desc: 'La terre crue et la pierre : techniques, atouts et limites.',
    href: '/materiaux-biosources/03-les-materiaux-geosources/',
    cours: 'materiaux-biosources/03-les-materiaux-geosources',
  },
  {
    titre: 'Le comportement physique',
    desc: "Hygrothermie, inertie, confort d'été, acoustique et résistance au feu.",
    href: '/materiaux-biosources/04-le-comportement-physique/',
    cours: 'materiaux-biosources/04-le-comportement-physique',
  },
  {
    titre: 'Mesurer et réglementer',
    desc: 'RE2020, analyse de cycle de vie, FDES, base INIES et labels.',
    href: '/materiaux-biosources/05-mesurer-et-reglementer/',
    cours: 'materiaux-biosources/05-mesurer-et-reglementer',
  },
  {
    titre: 'Règles professionnelles et assurabilité',
    desc: "Règles de l'art, règles professionnelles, Avis Technique, ATEx et assurance : technique courante ou non.",
    href: '/materiaux-biosources/06-regles-professionnelles-et-assurabilite/',
    cours: 'materiaux-biosources/06-regles-professionnelles-et-assurabilite',
  },
  {
    titre: 'Réemploi, réutilisation, recyclage',
    desc: 'Diagnostic avant démolition, filières, responsabilités et assurance.',
    href: '/materiaux-biosources/07-reemploi-reutilisation-recyclage/',
    cours: 'materiaux-biosources/07-reemploi-reutilisation-recyclage',
  },
  {
    titre: 'Coûts et filières locales',
    desc: 'Prix, ordres de grandeur, coût global, ressources et acteurs en Nouvelle-Aquitaine et au Pays basque.',
    href: '/materiaux-biosources/08-couts-et-filieres-locales/',
    cours: 'materiaux-biosources/08-couts-et-filieres-locales',
  },
  {
    titre: 'Retours d\'expérience et logement social',
    desc: 'Ce que montrent les opérations réelles, les aides, et la Résidence Arbola en version béton ou biosourcée.',
    href: '/materiaux-biosources/09-retours-d-experience-et-logement-social/',
    cours: 'materiaux-biosources/09-retours-d-experience-et-logement-social',
  },
  {
    titre: 'Ouverture : construire et habiter autrement',
    desc: 'Construction hors site, réversibilité, sobriété, habitat participatif, et bilan du parcours.',
    href: '/materiaux-biosources/10-ouverture-construire-et-habiter-autrement/',
    cours: 'materiaux-biosources/10-ouverture-construire-et-habiter-autrement',
  },
];

export const disponibles = chapitres.filter((c) => c.cours);
