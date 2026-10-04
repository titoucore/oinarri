// Plan du parcours « Nouvelles méthodes de construction » (biosourcé, géosourcé, réemploi), partagé par l'accueil et la liste des chapitres.
// Un chapitre avec `href` et `cours` est disponible ; sans, il est « À venir ».
// `cours` = identifiant de la collection de contenu (dossier/fichier sans extension).
// Le parcours est en cours d'écriture : les chapitres sans lien sont à venir.

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
    desc: 'Prix, approvisionnement, savoir-faire et entreprises.',
  },
  {
    titre: 'Retours d\'expérience et logement social',
    desc: 'La Résidence Arbola en version biosourcée, comparée à la version béton.',
  },
  {
    titre: 'Ouverture : de nouvelles façons de construire et d\'habiter',
    desc: 'Construction hors site, réversibilité, sobriété et habitat participatif.',
  },
];

export const disponibles = chapitres.filter((c) => c.cours);
