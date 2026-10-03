// Plan du parcours B.A.-BA, partagé par l'accueil et la liste des chapitres.
// Plan provisoire : à ajuster avant la rédaction des cours.
// Un chapitre avec `href` et `cours` est disponible ; sans, il est « À venir ».
// `cours` = identifiant de la collection de contenu (dossier/fichier sans extension).

export const chapitres = [
  {
    titre: 'Qui intervient sur une opération',
    desc: "Maîtrise d'ouvrage, architecte, bureaux d'études, contrôleur technique, entreprises.",
    href: '/ba-ba/01-qui-intervient/',
    cours: 'ba-ba/01-qui-intervient',
  },
  {
    titre: 'Du terrain au bâtiment',
    desc: 'Les grandes étapes, de la parcelle nue à la livraison.',
    href: '/ba-ba/02-du-terrain-au-batiment/',
    cours: 'ba-ba/02-du-terrain-au-batiment',
  },
  {
    titre: 'Les modes constructifs',
    desc: 'Béton, maçonnerie, bois, métal : comment on fait tenir un bâtiment debout.',
    href: '/ba-ba/03-modes-constructifs/',
    cours: 'ba-ba/03-modes-constructifs',
  },
  {
    titre: 'Terrassement et VRD',
    desc: 'Préparer le terrain et le raccorder aux réseaux.',
    href: '/ba-ba/04-terrassement-et-vrd/',
    cours: 'ba-ba/04-terrassement-et-vrd',
  },
  {
    titre: 'Les fondations',
    desc: 'Ce qui relie le bâtiment au sol.',
    href: '/ba-ba/05-les-fondations/',
    cours: 'ba-ba/05-les-fondations',
  },
  {
    titre: 'Le gros œuvre',
    desc: 'La structure : murs, planchers, charpente.',
    href: '/ba-ba/06-le-gros-oeuvre/',
    cours: 'ba-ba/06-le-gros-oeuvre',
  },
  {
    titre: "Les marchés et les appels d'offres",
    desc: 'Comment les entreprises sont choisies et engagées.',
    href: '/ba-ba/07-marches-et-appels-d-offres/',
    cours: 'ba-ba/07-marches-et-appels-d-offres',
  },
];

export const disponibles = chapitres.filter((c) => c.cours);
