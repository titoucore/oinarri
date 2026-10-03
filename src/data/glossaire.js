// Glossaire d'Oinarri : une entrée par terme, un fichier par parcours.
//
// Ce fichier contient les termes du B.A.-BA du bâtiment et fusionne ceux des autres parcours
// (src/data/glossaire-<parcours>.js). Pour un nouveau parcours : créer son fichier, l'importer
// ci-dessous et l'ajouter à la liste exportée en bas de ce fichier.
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

import { termes as termesPromotion } from './glossaire-promotion.js';
import { termes as termesLogementSocial } from './glossaire-logement-social.js';

const termesBatiment = [
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
    aussi: ['G1', 'G2', 'G3', 'G4', 'G5', 'NF P94-500', 'Étude G2'],
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
      "Les travaux qui font tenir le bâtiment debout : fondations, murs, planchers, escaliers, charpente. Ils précèdent le second œuvre.",
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
  {
    terme: 'VRD',
    developpe: 'Voirie et Réseaux Divers',
    categorie: 'Construction',
    definition:
      "Les voies d'accès, trottoirs, stationnements et réseaux enterrés (eau, assainissement, électricité, gaz, télécoms) qui desservent un bâtiment.",
  },
  {
    terme: 'Terrassement',
    categorie: 'Construction',
    definition:
      "Travaux qui modèlent le terrain pour accueillir le bâtiment : décapage, déblais et remblais, plateforme, fouilles.",
    aussi: ['Fouilles'],
  },
  {
    terme: 'Décapage',
    categorie: 'Construction',
    definition:
      "Première étape du terrassement : on enlève la terre végétale, souvent stockée pour les espaces verts.",
  },
  {
    terme: 'Déblais et remblais',
    categorie: 'Construction',
    definition:
      "Déblayer, c'est enlever de la terre là où le terrain est trop haut ; remblayer, c'est en apporter là où il est trop bas. Le bilan des deux pèse sur le coût du terrassement.",
    aussi: ['Déblais', 'Remblais', 'Remblai', 'Déblai'],
  },
  {
    terme: 'Plateforme',
    categorie: 'Construction',
    definition:
      "Surface plane, stable et portante préparée avant les fondations, sur laquelle démarre le chantier.",
  },
  {
    terme: 'Branchement',
    categorie: 'Construction',
    definition:
      "Liaison entre le bâtiment et un réseau public (eau, assainissement, électricité, gaz, télécoms).",
    aussi: ['Raccordement'],
  },
  {
    terme: 'Réseaux humides',
    categorie: 'Construction',
    definition: "Les réseaux d'eau : eau potable, eaux usées et eaux pluviales.",
  },
  {
    terme: 'Réseaux secs',
    categorie: 'Construction',
    definition: "Les réseaux d'énergie et de communication : électricité, gaz et télécoms.",
  },
  {
    terme: 'DT',
    developpe: 'Déclaration de projet de Travaux',
    categorie: 'Réglementation',
    definition:
      "Déclaration que le maître d'ouvrage adresse aux exploitants de réseaux avant de lancer la consultation des entreprises, pour savoir ce qui est enterré dans l'emprise des travaux. Elle se valide environ 3 mois.",
    aussi: ['Déclaration de projet de travaux'],
  },
  {
    terme: 'DICT',
    developpe: "Déclaration d'Intention de Commencement de Travaux",
    categorie: 'Réglementation',
    definition:
      "Déclaration que l'entreprise qui exécute les travaux adresse aux exploitants de réseaux avant de commencer à creuser.",
    aussi: ["Déclaration d'intention de commencement de travaux"],
  },
  {
    terme: 'Guichet unique',
    categorie: 'Réglementation',
    definition:
      "Téléservice national (reseaux-et-canalisations.gouv.fr, géré par l'Ineris) qui indique gratuitement quels exploitants de réseaux sont concernés par des travaux.",
    aussi: ['Guichet unique des réseaux'],
  },
  {
    terme: 'Assainissement collectif',
    categorie: 'Construction',
    definition:
      "Collecte et traitement des eaux usées par un réseau public. Le raccordement est obligatoire dans un délai de deux ans après sa mise en service.",
    aussi: ['Tout-à-l\'égout'],
  },
  {
    terme: 'Assainissement non collectif',
    categorie: 'Construction',
    definition:
      "Dispositif individuel de traitement des eaux usées, nécessaire quand le bâtiment n'est pas relié à un réseau public.",
    aussi: ['ANC', 'Fosse septique'],
  },
  {
    terme: 'Eaux usées',
    categorie: 'Construction',
    definition:
      "Eaux sales issues des usages domestiques (cuisine, salle de bains, WC). Elles vont au réseau d'assainissement.",
    aussi: ['EU'],
  },
  {
    terme: 'Eaux pluviales',
    categorie: 'Construction',
    definition:
      "Eaux de pluie ruisselant sur les toitures et les sols. La collectivité fixe les conditions de rejet, souvent pour limiter le débit qui quitte la parcelle.",
    aussi: ['EP'],
  },
  {
    terme: 'Fondations',
    categorie: 'Construction',
    definition:
      "Partie du bâtiment qui reçoit les charges des murs ou des poteaux et les répartit dans le sol.",
    aussi: ['Fondation'],
  },
  {
    terme: 'Semelle filante',
    categorie: 'Construction',
    definition:
      "Bande continue de béton armé placée sous un mur, sur toute sa longueur.",
    aussi: ['Semelle'],
  },
  {
    terme: 'Semelle isolée',
    categorie: 'Construction',
    definition:
      "Plot de béton armé placé sous un poteau. Les semelles isolées sont souvent reliées par des longrines.",
  },
  {
    terme: 'Radier',
    categorie: 'Construction',
    definition:
      "Grande dalle de béton armé placée sous tout le bâtiment. Utile quand le sol porte peu.",
  },
  {
    terme: 'Pieux',
    categorie: 'Construction',
    definition:
      "Colonnes de béton ou d'acier enfoncées en profondeur pour chercher un sol plus résistant. Ce sont des fondations profondes.",
    aussi: ['Pieu', 'Fondation profonde', 'Fondations profondes'],
  },
  {
    terme: 'Fondation superficielle',
    categorie: 'Construction',
    definition:
      "Fondation peu profonde : semelles filantes, semelles isolées ou radier. Le NF DTU 13.1 en fixe les règles.",
    aussi: ['Fondations superficielles'],
  },
  {
    terme: 'Longrine',
    categorie: 'Construction',
    definition:
      "Poutre de béton armé qui relie des fondations entre elles (semelles isolées ou pieux).",
    aussi: ['Longrines'],
  },
  {
    terme: 'Vide sanitaire',
    categorie: 'Construction',
    definition:
      "Espace ventilé entre le sol et le premier plancher, qui éloigne le plancher de l'humidité du sol.",
  },
  {
    terme: 'Dallage',
    categorie: 'Construction',
    definition:
      "Dalle de béton posée directement sur le sol, par exemple au rez-de-chaussée. Le NF DTU 13.3 en fixe les règles.",
  },
  {
    terme: 'Profondeur hors gel',
    categorie: 'Construction',
    definition:
      "Profondeur sous laquelle le gel n'atteint pas le sol. Les fondations descendent plus bas pour ne pas bouger au gel. La valeur dépend de la région.",
    aussi: ['Hors gel'],
  },
  {
    terme: 'Retrait-gonflement des argiles',
    categorie: 'Construction',
    definition:
      "Phénomène du sol : les argiles gonflent quand elles s'humidifient et se rétractent quand elles sèchent, ce qui peut déplacer les fondations et fissurer le bâtiment.",
    aussi: ['RGA', 'Argiles', 'Sol argileux'],
  },
  {
    terme: 'Loi ELAN',
    developpe: "Évolution du Logement, de l'Aménagement et du Numérique",
    categorie: 'Réglementation',
    definition:
      "Loi n° 2018-1021 du 23 novembre 2018. Son article 68 a créé un dispositif de prévention du retrait-gonflement des argiles pour les terrains à bâtir et les constructions neuves.",
    aussi: ['ELAN'],
  },
  {
    terme: 'Dalle pleine',
    categorie: 'Construction',
    definition:
      "Plancher formé d'une plaque de béton armé, coulée d'un seul tenant ou assemblée à partir d'éléments préfabriqués.",
  },
  {
    terme: 'Poutrelles et hourdis',
    categorie: 'Construction',
    definition:
      "Plancher formé de poutrelles préfabriquées qui portent des éléments de remplissage (les hourdis), recouverts d'une dalle de compression.",
    aussi: ['Poutrelle', 'Hourdis', 'Plancher à poutrelles'],
  },
  {
    terme: 'Chaînage',
    categorie: 'Construction',
    definition:
      "Armature continue qui ceinture le bâtiment au niveau des planchers et lie les murs entre eux.",
    aussi: ['Chaînages'],
  },
  {
    terme: 'Linteau',
    categorie: 'Construction',
    definition:
      "Poutre posée au-dessus d'une porte ou d'une fenêtre : elle reprend les charges du mur et les reporte sur les côtés.",
  },
  {
    terme: 'Charpente',
    categorie: 'Construction',
    definition:
      "Ossature de la toiture, en bois ou en métal, qui porte la couverture.",
  },
  {
    terme: 'Couverture',
    categorie: 'Construction',
    definition:
      "Partie supérieure de la toiture qui protège de la pluie : tuiles, ardoises, bacs ou toiture-terrasse avec étanchéité.",
  },
  {
    terme: 'Coffrage',
    categorie: 'Construction',
    definition:
      "Moule provisoire dans lequel on coule le béton pour lui donner sa forme. On le retire après durcissement (décoffrage).",
    aussi: ['Décoffrage', 'Banche'],
  },
  {
    terme: 'Bétonnage',
    categorie: 'Construction',
    definition: "Opération qui consiste à couler et à compacter le béton dans le coffrage.",
  },
  {
    terme: 'Classe de résistance',
    categorie: 'Matériaux',
    definition:
      "Désignation d'un béton selon sa résistance à la compression à 28 jours. C25/30 signifie 25 MPa mesurés sur cylindre et 30 MPa sur cube (norme NF EN 206/CN).",
    aussi: ['C25/30', 'C30/37', 'Résistance caractéristique'],
  },
  {
    terme: 'Éprouvette',
    categorie: 'Matériaux',
    definition:
      "Échantillon de béton (cylindre ou cube) qu'on écrase en laboratoire pour vérifier la résistance annoncée.",
    aussi: ['Éprouvettes'],
  },
  {
    terme: 'DCE',
    developpe: 'Dossier de Consultation des Entreprises',
    categorie: 'Juridique',
    definition:
      "Dossier remis aux entreprises pour qu'elles remettent une offre : règlement de la consultation, pièces écrites, plans, bordereaux.",
    aussi: ['Dossier de consultation des entreprises'],
  },
  {
    terme: 'Règlement de la consultation',
    categorie: 'Juridique',
    definition:
      "Pièce du DCE qui fixe les règles du jeu de la consultation : délais, contenu des offres, critères de choix et pondération.",
    aussi: ['RC'],
  },
  {
    terme: 'CCAP',
    developpe: 'Cahier des Clauses Administratives Particulières',
    categorie: 'Juridique',
    definition:
      "Pièce du marché qui précise les règles administratives propres à ce marché : délais, pénalités, paiement, garantie.",
  },
  {
    terme: 'CCTP',
    developpe: 'Cahier des Clauses Techniques Particulières',
    categorie: 'Juridique',
    definition:
      "Pièce du marché qui décrit les ouvrages à réaliser, les matériaux et les modes d'exécution, lot par lot.",
  },
  {
    terme: "Acte d'engagement",
    categorie: 'Juridique',
    definition:
      "Document par lequel l'entreprise s'engage sur son prix et ses délais, et que le maître d'ouvrage signe pour conclure le marché.",
  },
  {
    terme: 'Lot',
    categorie: 'Juridique',
    definition:
      "Part d'un marché de travaux confiée à une entreprise, en général par corps d'état (gros œuvre, charpente, plomberie…).",
    aussi: ['Lots', 'Allotissement'],
  },
  {
    terme: 'MAPA',
    developpe: 'Marché À Procédure Adaptée',
    categorie: 'Juridique',
    definition:
      "Procédure de commande publique dont l'acheteur fixe librement les modalités dans le respect des principes de la commande publique. Elle s'applique entre le seuil de dispense et le seuil européen.",
    aussi: ['Procédure adaptée'],
  },
  {
    terme: 'Procédure formalisée',
    categorie: 'Juridique',
    definition:
      "Procédure aux règles strictes (appel d'offres, dialogue compétitif…), obligatoire à partir des seuils européens. Pour les travaux, le seuil est de 5 404 000 € HT en 2026-2027.",
    aussi: ['Appel d\'offres', 'Seuils européens'],
  },
  {
    terme: 'Offre anormalement basse',
    categorie: 'Juridique',
    definition:
      "Offre dont le prix paraît trop bas pour être sérieux. L'acheteur doit demander à l'entreprise de justifier son prix avant de la rejeter ou de la retenir.",
    aussi: ['OAB'],
  },
  {
    terme: 'Avenant',
    categorie: 'Juridique',
    definition:
      "Acte qui modifie un marché en cours d'exécution, dans des cas encadrés. Il ne peut pas changer la nature globale du marché.",
  },
  {
    terme: 'Ordre de service',
    categorie: 'Juridique',
    definition:
      "Instruction écrite du maître d'ouvrage ou de la maîtrise d'œuvre à l'entreprise. Le premier ordre de service fait démarrer le chantier.",
    aussi: ['OS'],
  },
  {
    terme: 'Retenue de garantie',
    categorie: 'Juridique',
    definition:
      "Part des sommes dues à l'entreprise retenue pour garantir la levée des réserves. Elle ne peut pas dépasser 5 % du montant du marché et est remboursée dans les trente jours après l'expiration du délai de garantie.",
  },
  {
    terme: 'CCAG-Travaux',
    developpe: 'Cahier des Clauses Administratives Générales applicable aux marchés publics de Travaux',
    categorie: 'Juridique',
    definition:
      "Document de référence approuvé par arrêté du 30 mars 2021, auquel un marché de travaux peut faire référence pour l'exécution, les délais, les prix et la réception.",
    aussi: ['CCAG', 'CCAG Travaux'],
  },
  {
    terme: 'Acompte',
    categorie: 'Juridique',
    definition:
      "Paiement partiel d'un marché de travaux, versé au fur et à mesure de l'avancement sur la base de situations de travaux que la maîtrise d'œuvre vérifie.",
    aussi: ['Acomptes', 'Situation de travaux'],
  },
  {
    terme: 'Marché public',
    categorie: 'Juridique',
    definition:
      "Contrat conclu à titre onéreux par un acheteur soumis à la commande publique pour répondre à ses besoins en travaux, fournitures ou services.",
    aussi: ['Marchés publics', 'Commande publique'],
  },
];

export const termes = [...termesBatiment, ...termesPromotion, ...termesLogementSocial];
