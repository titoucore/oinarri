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
  {
    titre: "L'enveloppe et la thermique",
    desc: 'Par où un bâtiment perd sa chaleur : parois, ponts thermiques, étanchéité à l’air et Bbio.',
    href: '/ba-ba/08-l-enveloppe-et-la-thermique/',
    cours: 'ba-ba/08-l-enveloppe-et-la-thermique',
  },
  {
    titre: "L'acoustique : le bruit entre voisins",
    desc: 'Bruits aériens, de choc et d’équipements : les exigences d’un logement neuf et l’attestation acoustique.',
    href: '/ba-ba/09-l-acoustique/',
    cours: 'ba-ba/09-l-acoustique',
  },
  {
    titre: 'Le bâtiment passif, la double flux et le puits canadien',
    desc: 'Le label Passivhaus, ses cinq mesures, la ventilation double flux et ce que vaut un puits canadien.',
    href: '/ba-ba/10-le-batiment-passif-et-le-puits-canadien/',
    cours: 'ba-ba/10-le-batiment-passif-et-le-puits-canadien',
  },
];

export const disponibles = chapitres.filter((c) => c.cours);
