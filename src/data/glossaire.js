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
];
