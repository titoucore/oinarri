// Glossaire d'Oinarri : un seul fichier, une entrée par terme.
//
// Champs :
//   terme       nom du terme (avec majuscule initiale) ; il sert aussi à fabriquer l'ancre
//   developpe   (facultatif) développement d'un sigle, affiché entre parenthèses
//   categorie   Construction, Matériaux, Thermique, Réglementation, Urbanisme, Promotion,
//               Financement, Logement social, Juridique, Assurance, Biosourcé, Géosourcé, Concepts…
//   definition  une ou deux phrases courtes, sans jargon non expliqué
//   aussi       (facultatif) autres façons d'écrire le terme (sigles, variantes) ; elles servent
//               à la recherche et à rendre cliquable la section « Vocabulaire » des cours
//
// Format des définitions : celui de la convention /def. Pour ajouter un terme, on ajoute
// une entrée ; l'ordre dans ce fichier n'a pas d'importance (la page trie par ordre alphabétique).

export const termes = [
  {
    terme: "Maître d'ouvrage",
    categorie: 'Construction',
    definition:
      "La personne ou l'organisme pour qui l'ouvrage est construit : il décide, finance et répond de l'opération. Il fixe le programme et l'enveloppe financière, et signe les contrats.",
    aussi: ['MOA'],
  },
  {
    terme: "Maître d'œuvre",
    categorie: 'Construction',
    definition:
      "L'équipe (architecte, bureaux d'études…) qui conçoit le projet puis dirige sa réalisation pour le compte du maître d'ouvrage. Elle n'est pas l'entreprise qui construit.",
    aussi: ['MOE', "Maîtrise d'œuvre"],
  },
  {
    terme: "Assistant à maîtrise d'ouvrage",
    categorie: 'Construction',
    definition:
      "Un conseil que le maître d'ouvrage engage quand il manque de moyens ou de compétence sur un sujet (programmation, financement, environnement). Il conseille, il ne décide pas.",
    aussi: ['AMO'],
  },
  {
    terme: 'Mandataire',
    categorie: 'Juridique',
    definition:
      "Personne à qui le maître d'ouvrage confie, par un contrat de mandat, l'exercice de tout ou partie de ses attributions, en son nom et pour son compte. À la différence d'un assistant (AMO), il agit à la place du maître d'ouvrage.",
  },
  {
    terme: 'Géomètre-expert',
    categorie: 'Construction',
    definition:
      "Professionnel qui établit le plan topographique du terrain, en délimite les limites (bornage) et implante l'ouvrage sur le terrain.",
  },
  {
    terme: 'Géotechnicien',
    categorie: 'Construction',
    definition:
      "Spécialiste du sol : il étudie sa nature et sa résistance pour que les fondations soient adaptées. Ses études se classent en missions G1 à G5.",
  },
  {
    terme: 'Missions géotechniques',
    categorie: 'Construction',
    definition:
      "Classement des études de sol défini par la norme NF P94-500 : G1 (étude préalable, avant la conception), G2 (étude de conception, qui précise les fondations), G3 (étude et suivi d'exécution), G4 (supervision de l'exécution) et G5 (diagnostic).",
    aussi: ['G1', 'G2', 'G3', 'G4', 'G5', 'NF P94-500'],
  },
  {
    terme: 'Architecte',
    categorie: 'Construction',
    definition:
      "Professionnel qui conçoit le projet architectural et en établit le dossier de permis de construire. Son recours est obligatoire sauf exceptions : une personne morale (un organisme HLM, par exemple) n'en est jamais dispensée, et le seuil de 150 m² de surface de plancher ne concerne que les particuliers.",
  },
  {
    terme: "Bureau d'études techniques",
    categorie: 'Construction',
    definition:
      "Entreprise de spécialistes (structure, fluides, électricité, thermique, voirie et réseaux, acoustique) qui calculent et dimensionnent les ouvrages. Il travaille avec l'architecte au sein de l'équipe de maîtrise d'œuvre.",
    aussi: ['BET'],
  },
  {
    terme: 'Économiste de la construction',
    categorie: 'Construction',
    definition:
      "Il chiffre le projet à chaque étape, décompose les travaux par lots et rédige les pièces techniques utilisées pour consulter les entreprises.",
  },
  {
    terme: 'OPC',
    developpe: 'Ordonnancement, Coordination, Pilotage',
    categorie: 'Construction',
    definition:
      "Mission qui consiste à tenir le planning du chantier et à coordonner les entreprises entre elles. Elle s'ajoute à la mission de base de maîtrise d'œuvre et est souvent confiée à un spécialiste.",
  },
  {
    terme: 'Contrôleur technique',
    categorie: 'Construction',
    definition:
      "Intervenant agréé qui donne son avis au maître d'ouvrage pour prévenir les aléas techniques, surtout sur la solidité de l'ouvrage et la sécurité des personnes. Dans les limites de sa mission, il est soumis comme les constructeurs à la présomption de responsabilité décennale.",
  },
  {
    terme: 'Coordonnateur SPS',
    developpe: 'Sécurité et Protection de la Santé',
    categorie: 'Réglementation',
    definition:
      "Désigné par le maître d'ouvrage dès la conception quand plusieurs entreprises interviennent sur un chantier de bâtiment. Il coordonne la prévention des risques, sans se substituer à la responsabilité de chaque entreprise envers ses salariés.",
    aussi: ['SPS', 'Coordination SPS'],
  },
  {
    terme: 'PPSPS',
    developpe: 'Plan Particulier de Sécurité et de Protection de la Santé',
    categorie: 'Réglementation',
    definition:
      "Document propre à une entreprise, qui décrit comment elle organise la sécurité de ses salariés sur le chantier. Il est remis au coordonnateur SPS.",
  },
  {
    terme: "Corps d'état",
    categorie: 'Construction',
    definition:
      "Chaque spécialité de métier intervenant sur un chantier : terrassement, gros œuvre, charpente, plomberie, électricité…",
  },
  {
    terme: 'Entreprise générale',
    categorie: 'Construction',
    definition:
      "Une seule entreprise signe avec le maître d'ouvrage et réalise (ou sous-traite) l'ensemble des travaux, au lieu d'un marché distinct par corps d'état.",
  },
  {
    terme: 'Dommages-ouvrage',
    categorie: 'Assurance',
    definition:
      "Assurance obligatoire souscrite par le maître d'ouvrage avant l'ouverture du chantier. Elle préfinance les réparations des dommages de nature décennale, puis l'assureur se retourne contre les responsables.",
    aussi: ['DO', 'Assurance dommages-ouvrage'],
  },
  {
    terme: 'Garantie décennale',
    categorie: 'Assurance',
    definition:
      "Responsabilité des constructeurs pendant dix ans après la réception, pour les dommages qui compromettent la solidité de l'ouvrage ou le rendent impropre à sa destination. Chaque constructeur la couvre par une assurance décennale.",
    aussi: ['Décennale', 'Assurance décennale'],
  },
  {
    terme: 'ESQ',
    developpe: 'Esquisse',
    categorie: 'Construction',
    definition:
      "Premier élément de la mission de maîtrise d'œuvre : l'architecte cherche le parti architectural, c'est-à-dire l'idée générale du projet.",
    aussi: ['Esquisse'],
  },
  {
    terme: 'APS',
    developpe: 'Avant-Projet Sommaire',
    categorie: 'Construction',
    definition:
      "Étape de conception qui fixe les grandes dimensions et les choix techniques principaux, avec une première estimation du coût.",
    aussi: ['Avant-projet sommaire'],
  },
  {
    terme: 'APD',
    developpe: 'Avant-Projet Définitif',
    categorie: 'Construction',
    definition:
      "Étape de conception qui produit les plans précis, les surfaces détaillées et une estimation arrêtée. Elle fournit la base du dossier de permis de construire.",
    aussi: ['Avant-projet définitif'],
  },
  {
    terme: 'PRO',
    developpe: 'Projet',
    categorie: 'Construction',
    definition:
      "Étape de conception qui produit des plans et des pièces écrites assez détaillés pour consulter les entreprises.",
    aussi: ['Projet de conception'],
  },
  {
    terme: 'ACT',
    developpe: 'Assistance pour la passation des Contrats de Travaux',
    categorie: 'Construction',
    definition:
      "Mission par laquelle la maîtrise d'œuvre aide le maître d'ouvrage à consulter les entreprises, analyser leurs offres et préparer les marchés.",
  },
  {
    terme: 'VISA',
    developpe: "Visa des études d'exécution",
    categorie: 'Construction',
    definition:
      "Mission par laquelle la maîtrise d'œuvre vérifie que les plans d'exécution établis par les entreprises respectent le projet.",
  },
  {
    terme: 'DET',
    developpe: "Direction de l'Exécution des contrats de Travaux",
    categorie: 'Construction',
    definition:
      "Mission par laquelle la maîtrise d'œuvre suit le chantier, contrôle les travaux et vérifie les situations de paiement des entreprises.",
  },
  {
    terme: 'AOR',
    developpe: 'Assistance aux Opérations de Réception',
    categorie: 'Construction',
    definition:
      "Mission par laquelle la maîtrise d'œuvre assiste le maître d'ouvrage au moment de la réception des travaux.",
  },
  {
    terme: 'PLU',
    developpe: "Plan Local d'Urbanisme",
    categorie: 'Urbanisme',
    definition:
      "Document de la commune ou de l'intercommunalité qui fixe les règles de construction sur chaque terrain : zones, usages autorisés, implantation, hauteurs. Il détermine ce qu'on a le droit de construire.",
    aussi: ["Plan local d'urbanisme"],
  },
  {
    terme: "Certificat d'urbanisme",
    categorie: 'Urbanisme',
    definition:
      "Document délivré par la mairie qui indique les règles d'urbanisme applicables à un terrain. Le certificat d'information (CUa) renseigne ; le certificat opérationnel (CUb) dit en plus si un projet précis est réalisable. Il est valable 18 mois et n'autorise aucun travaux.",
    aussi: ['CU', 'CUa', 'CUb'],
  },
  {
    terme: 'Permis de construire',
    categorie: 'Urbanisme',
    definition:
      "Autorisation d'urbanisme nécessaire pour bâtir. La mairie dispose de 2 mois (maison individuelle) ou de 3 mois (autres projets) pour répondre, sauf cas qui allongent le délai.",
    aussi: ['PC', 'Permis'],
  },
  {
    terme: 'Recours des tiers',
    categorie: 'Urbanisme',
    definition:
      "Possibilité pour un voisin ou une association de contester un permis devant le juge administratif, pendant 2 mois à compter du premier jour d'un affichage continu de 2 mois sur le terrain. Un permis dont les délais de recours et de retrait sont écoulés est dit « purgé ».",
    aussi: ['Purge', 'Permis purgé', 'Affichage du permis', 'Recours'],
  },
  {
    terme: 'DOC',
    developpe: "Déclaration d'Ouverture de Chantier",
    categorie: 'Urbanisme',
    definition:
      "Déclaration que le bénéficiaire d'un permis dépose en mairie dès le commencement des travaux.",
    aussi: ["Déclaration d'ouverture de chantier"],
  },
  {
    terme: 'DAACT',
    developpe: "Déclaration Attestant l'Achèvement et la Conformité des Travaux",
    categorie: 'Urbanisme',
    definition:
      "Déclaration déposée en mairie par le bénéficiaire du permis quand les travaux sont terminés. La mairie dispose ensuite de 3 mois (5 mois dans certains cas) pour contester la conformité. Elle ne se confond pas avec la réception.",
  },
  {
    terme: 'Réception des travaux',
    categorie: 'Juridique',
    definition:
      "Acte par lequel le maître d'ouvrage déclare accepter l'ouvrage, avec ou sans réserves. Elle déclenche les garanties de parfait achèvement (1 an), biennale (2 ans) et décennale (10 ans).",
    aussi: ['Réception'],
  },
  {
    terme: 'Réserves',
    categorie: 'Juridique',
    definition:
      "Défauts constatés au moment de la réception et consignés dans le procès-verbal. L'entreprise doit les corriger : c'est la levée des réserves.",
    aussi: ['Levée des réserves'],
  },
  {
    terme: 'OPR',
    developpe: 'Opérations Préalables à la Réception',
    categorie: 'Construction',
    definition:
      "Visite de contrôle organisée avant la réception, pendant laquelle la maîtrise d'œuvre et les entreprises relèvent ce qui reste à corriger. C'est un usage de la profession.",
  },
  {
    terme: 'Garantie de parfait achèvement',
    categorie: 'Juridique',
    definition:
      "Garantie d'un an après la réception : l'entrepreneur répare tous les désordres signalés à la réception ou dans l'année qui suit, quelles que soient leur importance et leur nature.",
    aussi: ['GPA', 'Parfait achèvement'],
  },
  {
    terme: 'Garantie biennale',
    categorie: 'Juridique',
    definition:
      "Garantie de deux ans minimum après la réception : l'entrepreneur répare ou remplace un élément d'équipement qui ne fonctionne pas correctement.",
    aussi: ['Garantie de bon fonctionnement', 'Biennale'],
  },
  {
    terme: 'Gros œuvre',
    categorie: 'Construction',
    definition:
      "Les travaux qui font tenir le bâtiment debout : fondations, murs, planchers, charpente. Ils précèdent le second œuvre.",
  },
  {
    terme: 'Second œuvre',
    categorie: 'Construction',
    definition:
      "Les travaux d'équipement et d'aménagement une fois la structure posée : cloisons, réseaux, isolation, revêtements, peintures.",
  },
  {
    terme: "Hors d'eau",
    categorie: 'Construction',
    definition:
      "Stade du chantier où la toiture est posée : il ne pleut plus à l'intérieur. En VEFA, il permet d'appeler jusqu'à 70 % du prix.",
    aussi: ["Mise hors d'eau"],
  },
  {
    terme: "Hors d'air",
    categorie: 'Construction',
    definition:
      "Stade du chantier où les fenêtres et les portes extérieures sont posées : le bâtiment est clos. C'est un usage de chantier, que la loi ne définit pas.",
  },
  {
    terme: 'VEFA',
    developpe: "Vente en l'État Futur d'Achèvement",
    categorie: 'Promotion',
    definition:
      "Vente d'un logement qui n'est pas encore terminé. Le prix se paie par étapes selon l'avancement du chantier, avec des plafonds cumulés : 35 % aux fondations, 70 % hors d'eau, 95 % à l'achèvement.",
    aussi: ["Vente en l'état futur d'achèvement", 'Vente sur plan'],
  },
  {
    terme: 'Structure porteuse',
    categorie: 'Construction',
    definition:
      "Le squelette du bâtiment : l'ensemble des éléments qui portent les charges et assurent la stabilité (fondations, murs ou poteaux, planchers, charpente).",
    aussi: ['Structure'],
  },
  {
    terme: 'Descente de charges',
    categorie: 'Construction',
    definition:
      "Le chemin que suivent les charges, de la toiture jusqu'au sol : toiture, planchers, murs ou poteaux, fondations, puis sol. Elle sert à dimensionner chaque élément.",
    aussi: ['Charges', 'Chemin des charges'],
  },
  {
    terme: 'Contreventement',
    categorie: 'Construction',
    definition:
      "Ensemble des éléments (murs pleins, voiles, croix de renfort…) qui empêchent le bâtiment de se déformer ou de bouger sous les efforts horizontaux, surtout le vent.",
  },
  {
    terme: 'Mur porteur',
    categorie: 'Construction',
    definition:
      "Mur qui porte les planchers ou la toiture et fait partie du chemin des charges. On ne le perce ni ne le supprime sans étude.",
    aussi: ['Murs porteurs'],
  },
  {
    terme: 'Poteau',
    categorie: 'Construction',
    definition: "Élément vertical d'une ossature qui porte les charges jusqu'aux fondations.",
    aussi: ['Poteaux'],
  },
  {
    terme: 'Poutre',
    categorie: 'Construction',
    definition:
      "Élément horizontal qui reprend les charges d'un plancher ou d'une toiture et les transmet aux poteaux ou aux murs.",
    aussi: ['Poutres'],
  },
  {
    terme: 'Plancher',
    categorie: 'Construction',
    definition:
      "Élément horizontal qui sépare deux niveaux et porte les occupants et le mobilier. Il peut être en béton, en bois ou mixte.",
    aussi: ['Planchers'],
  },
  {
    terme: 'Béton armé',
    categorie: 'Matériaux',
    definition:
      "Béton dans lequel on noie des armatures en acier. Le béton résiste bien à la compression, l'acier reprend les efforts de traction.",
  },
  {
    terme: 'Armatures',
    categorie: 'Matériaux',
    definition:
      "Barres et treillis en acier noyés dans le béton pour reprendre les efforts de traction.",
    aussi: ['Armature', 'Ferraillage'],
  },
  {
    terme: 'Béton banché',
    categorie: 'Construction',
    definition:
      "Murs en béton coulés sur place entre deux coffrages (les banches). On parle aussi de voiles en béton.",
    aussi: ['Banché', 'Banches'],
  },
  {
    terme: 'Voile',
    categorie: 'Construction',
    definition:
      "Mur plein, en général en béton armé, qui porte les planchers et contribue au contreventement.",
    aussi: ['Voiles', 'Voile en béton'],
  },
  {
    terme: 'Préfabrication',
    categorie: 'Construction',
    definition:
      "Fabrication d'éléments (murs, planchers, panneaux) en usine, puis assemblage sur le chantier. Elle réduit le temps passé sur place.",
    aussi: ['Préfabriqué'],
  },
  {
    terme: 'Maçonnerie',
    categorie: 'Construction',
    definition:
      "Ouvrage réalisé en assemblant des petits éléments (blocs de béton, briques de terre cuite, pierre) au mortier.",
    aussi: ['Maçonnerie de petits éléments'],
  },
  {
    terme: 'Parpaing',
    categorie: 'Matériaux',
    definition: "Nom courant d'un bloc de béton utilisé en maçonnerie.",
    aussi: ['Bloc béton', 'Agglo'],
  },
  {
    terme: 'Ossature bois',
    categorie: 'Construction',
    definition:
      "Mode constructif où des montants en bois rapprochés, contreventés par des panneaux, forment des murs porteurs légers. Il est encadré par le NF DTU 31.2.",
    aussi: ['Construction bois', 'Ossature en bois'],
  },
  {
    terme: 'Construction métallique',
    categorie: 'Construction',
    definition:
      "Structure en acier faite de poteaux et de poutres assemblés. Elle permet de grandes portées et demande une protection contre le feu et la corrosion.",
    aussi: ['Charpente métallique', 'Structure acier'],
  },
  {
    terme: 'Structure mixte',
    categorie: 'Construction',
    definition:
      "Structure où deux matériaux travaillent ensemble dans un même élément, par exemple l'acier et le béton. Par extension, bâtiment qui combine plusieurs familles de structure.",
    aussi: ['Mixte', 'Plancher mixte'],
  },
  {
    terme: 'Eurocodes',
    categorie: 'Réglementation',
    definition:
      "Normes européennes de calcul des structures (EN 1990 à EN 1999), déclinées en France par des annexes nationales. Elles disent comment calculer, pas comment exécuter.",
    aussi: ['Eurocode', 'EN 1990', 'EN 1992', 'EN 1993', 'EN 1995', 'EN 1996'],
  },
  {
    terme: 'DTU',
    developpe: 'Document Technique Unifié',
    categorie: 'Réglementation',
    definition:
      "Document de référence qui précise comment exécuter un type d'ouvrage dans les règles de l'art (par exemple le NF DTU 31.2 pour l'ossature bois). Ce n'est pas une loi : les marchés le reprennent comme référence contractuelle.",
    aussi: ['NF DTU', 'DTU 20.1', 'DTU 21', 'DTU 31.2'],
  },
  {
    terme: "Familles d'habitation",
    categorie: 'Réglementation',
    definition:
      "Classement en quatre familles des bâtiments d'habitation pour la sécurité incendie (arrêté du 31 janvier 1986), selon leur hauteur et leur forme. Au-delà de 50 m, c'est le régime des immeubles de grande hauteur.",
    aussi: ['1re famille', '2e famille', '3e famille', '4e famille', 'IGH'],
  },
];
