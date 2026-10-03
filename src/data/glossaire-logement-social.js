// Glossaire du parcours « Bailleurs sociaux et logement social ».
// Même format que glossaire.js (voir les champs décrits en tête de ce fichier).
// Ce fichier est fusionné avec les autres par glossaire.js : on n'y touche pas pour ajouter
// un terme d'un autre parcours.

export const termes = [
  {
    terme: 'Logement locatif social',
    categorie: 'Logement social',
    definition:
      "Logement loué à un loyer plafonné à des ménages dont les ressources sont plafonnées, construit ou acquis avec des aides de l'État. Il vise à améliorer les conditions d'habitat des personnes de ressources modestes ou défavorisées.",
    aussi: ['Logement social', 'Logements sociaux', 'LLS'],
  },
  {
    terme: 'HLM',
    developpe: 'Habitation à Loyer Modéré',
    categorie: 'Logement social',
    definition:
      "Nom courant du logement social et des organismes qui le construisent et le gèrent. Le statut d'organisme d'HLM est défini par le code de la construction et de l'habitation.",
    aussi: ['Hlm', 'Habitation à loyer modéré', 'Habitations à loyer modéré'],
  },
  {
    terme: 'Organisme HLM',
    categorie: 'Logement social',
    definition:
      "Organisme de logement social qui a le statut d'organisme d'habitations à loyer modéré : office public de l'habitat, société anonyme d'HLM (entreprise sociale pour l'habitat) ou société coopérative d'HLM.",
    aussi: ["Organisme d'HLM", 'Organismes HLM', 'Bailleur social', 'Bailleurs sociaux', 'Organisme de logement social', 'Organismes de logement social'],
  },
  {
    terme: "Office public de l'habitat",
    categorie: 'Logement social',
    definition:
      "Organisme HLM public, rattaché à une collectivité territoriale ou à un groupement de collectivités (commune, intercommunalité, département).",
    aussi: ['OPH', 'Offices publics de l\'habitat'],
  },
  {
    terme: "Entreprise sociale pour l'habitat",
    categorie: 'Logement social',
    definition:
      "Organisme HLM qui a la forme d'une société anonyme. Il appartient à des actionnaires, souvent regroupés en groupes, et exerce les mêmes missions d'intérêt général que les autres organismes HLM.",
    aussi: ['ESH', "Société anonyme d'HLM", "Sociétés anonymes d'HLM"],
  },
  {
    terme: "Coopérative d'HLM",
    categorie: 'Logement social',
    definition:
      "Société coopérative qui a le statut d'organisme HLM. Elle est surtout active dans l'accession sociale à la propriété.",
    aussi: ["Coop'HLM", "Société coopérative d'HLM", "Sociétés coopératives d'HLM"],
  },
  {
    terme: "Société d'économie mixte de logement social",
    categorie: 'Logement social',
    definition:
      "Société d'économie mixte agréée pour construire et gérer des logements sociaux. Elle n'est pas un organisme HLM mais bénéficie du même service d'intérêt général pour ces logements, avec une comptabilité distincte.",
    aussi: ['SEM', 'SEM agréée', 'SEM de construction et de gestion de logements sociaux'],
  },
  {
    terme: 'SACICAP',
    developpe: "Société Anonyme Coopérative d'Intérêt Collectif pour l'Accession à la Propriété",
    categorie: 'Logement social',
    definition:
      "Ancienne société de crédit immobilier. Elle adhère à l'Union sociale pour l'habitat sans avoir la qualité d'organisme HLM.",
  },
  {
    terme: "Union sociale pour l'habitat",
    categorie: 'Logement social',
    definition:
      "Organisation créée en 1929 qui rassemble les fédérations d'organismes HLM (offices publics, entreprises sociales, coopératives). Elle représente le Mouvement HLM et publie les chiffres clés du secteur.",
    aussi: ['USH', 'Mouvement HLM'],
  },
  {
    terme: 'ANCOLS',
    developpe: 'Agence Nationale de COntrôle du Logement Social',
    categorie: 'Logement social',
    definition:
      "Établissement public chargé de contrôler et d'évaluer les organismes de logement social et la participation des employeurs à l'effort de construction. Elle publie des rapports de contrôle.",
    aussi: ['Ancols'],
  },
  {
    terme: 'CGLLS',
    developpe: 'Caisse de Garantie du Logement Locatif Social',
    categorie: 'Logement social',
    definition:
      "Organisme qui apporte des concours financiers pour prévenir les difficultés des organismes HLM, les redresser ou les réorganiser. Il contribue aussi au financement du renouvellement urbain.",
  },
  {
    terme: 'Banque des Territoires',
    categorie: 'Financement',
    definition:
      "Entité de la Caisse des Dépôts qui prête aux organismes de logement social, notamment à partir de l'épargne réglementée (Livret A). Ses prêts PLAI, PLUS et PLS sont indexés sur le taux du Livret A.",
    aussi: ['Caisse des Dépôts', 'CDC'],
  },
  {
    terme: 'Action Logement',
    categorie: 'Financement',
    definition:
      "Groupe qui gère la participation des employeurs à l'effort de construction. Il finance du logement social, des prêts et aides aux salariés, et une grande part du renouvellement urbain.",
    aussi: ['Action Logement Services', 'ALS'],
  },
  {
    terme: 'PEEC',
    developpe: "Participation des Employeurs à l'Effort de Construction",
    categorie: 'Financement',
    definition:
      "Contribution des entreprises au logement de leurs salariés, gérée par Action Logement. Elle alimente des prêts, des aides et des réservations de logements.",
    aussi: ['Participation des employeurs à l\'effort de construction', '1 % logement'],
  },
  {
    terme: 'Aides à la pierre',
    categorie: 'Financement',
    definition:
      "Subventions de l'État à la production de logements sociaux (PLUS et PLAI). L'État peut en déléguer la gestion à une intercommunalité ou à un département, qui décide alors à sa place.",
    aussi: ['Aide à la pierre', 'Délégation des aides à la pierre', 'Délégataire'],
  },
  {
    terme: "Service d'intérêt général",
    categorie: 'Juridique',
    definition:
      "Mission que le code de la construction et de l'habitation confie aux organismes HLM (article L411-2) : construire, acquérir, attribuer et gérer des logements à loyers plafonnés pour des ménages sous plafonds de ressources. Elle justifie leurs exonérations fiscales et leurs aides spécifiques.",
    aussi: ['SIG', "Service d'intérêt économique général"],
  },
  {
    terme: 'Mixité sociale',
    categorie: 'Logement social',
    definition:
      "Présence, dans un même quartier ou une même commune, de ménages aux ressources et aux situations variées. Le code de la construction et de l'habitation en fait un objectif du logement social.",
  },
  {
    terme: 'PLAI',
    developpe: "Prêt Locatif Aidé d'Intégration",
    categorie: 'Logement social',
    definition:
      "Financement du logement social le plus aidé, destiné aux ménages en grande précarité. Il donne droit à une subvention, à un prêt à taux avantageux, à la TVA à 5,5 % et aux loyers plafonds les plus bas.",
    aussi: ['PLA d\'intégration', 'PLA-I', 'Prêt locatif aidé d\'intégration'],
  },
  {
    terme: 'PLUS',
    developpe: 'Prêt Locatif à Usage Social',
    categorie: 'Logement social',
    definition:
      "Financement du logement social « ordinaire » : il concerne la grande majorité du parc. Il donne droit à un prêt à taux avantageux, à une subvention éventuelle et à la TVA à 10 % (5,5 % dans le renouvellement urbain).",
    aussi: ['Prêt locatif à usage social'],
  },
  {
    terme: 'PLS',
    developpe: 'Prêt Locatif Social',
    categorie: 'Logement social',
    definition:
      "Financement du logement social destiné à des ménages dont les revenus dépassent les plafonds du PLUS (plafonds du PLUS majorés de 30 %). Il n'est pas subventionné par l'État mais donne droit à un prêt et à des avantages fiscaux.",
    aussi: ['Prêt locatif social'],
  },
  {
    terme: 'Décision de financement et d\'agrément',
    categorie: 'Logement social',
    definition:
      "Décision du préfet, ou de la collectivité qui a reçu la délégation des aides à la pierre, qui ouvre droit aux aides et aux prêts d'une opération de logement social. Les travaux ne doivent pas commencer avant elle.",
    aussi: ['Agrément', "Décision d'agrément", 'Agrément logement social'],
  },
  {
    terme: 'Taxe foncière sur les propriétés bâties',
    categorie: 'Financement',
    definition:
      "Impôt local annuel dû par le propriétaire d'un bâtiment. Les logements sociaux neufs en sont exonérés pendant une longue durée (15 ans de base, 25 ans pour les décisions de financement jusqu'à fin 2026).",
    aussi: ['TFPB', 'Exonération de TFPB', 'Taxe foncière'],
  },
  {
    terme: 'Convention APL',
    categorie: 'Logement social',
    definition:
      "Contrat entre le bailleur et l'État (ou la collectivité délégataire) qui fixe le loyer maximal d'un logement et ouvre droit à l'aide personnalisée au logement pour les locataires. Elle dure autant que le prêt, avec un minimum de 9 ans.",
    aussi: ['Convention', 'Conventionnement', "Convention d'aide personnalisée au logement"],
  },
  {
    terme: 'APL',
    developpe: 'Aide Personnalisée au Logement',
    categorie: 'Logement social',
    definition:
      "Aide au logement versée aux locataires d'un logement conventionné, selon leurs ressources, leur famille et un loyer plafonné pris en compte.",
    aussi: ['Aide personnalisée au logement'],
  },
  {
    terme: 'Loyer maximal de zone',
    categorie: 'Logement social',
    definition:
      "Loyer mensuel maximal au mètre carré de surface utile fixé chaque année par l'avis des loyers, selon le type de financement (PLAI, PLUS, PLS) et la zone géographique.",
    aussi: ['LMzone', 'Avis des loyers', 'Loyer de zone'],
  },
  {
    terme: 'Coefficient de structure',
    categorie: 'Logement social',
    definition:
      "Coefficient qui tient compte de la taille moyenne des logements d'une opération, car les petits logements coûtent plus cher au mètre carré. Il multiplie le loyer maximal de zone.",
    aussi: ['CS'],
  },
  {
    terme: 'Marge locale',
    categorie: 'Logement social',
    definition:
      "Majoration du loyer maximal, accordée sur la base d'un barème local en contrepartie d'un meilleur service ou d'une meilleure maîtrise de la quittance. Elle est limitée à 15 % en PLUS et PLAI et n'existe pas en PLS.",
    aussi: ['Marges locales', 'Majoration locale'],
  },
  {
    terme: 'IRL',
    developpe: 'Indice de Référence des Loyers',
    categorie: 'Logement social',
    definition:
      "Indice publié par l'Insee qui sert à revaloriser les loyers. Pour les conventions APL en cours, le loyer maximal est révisé chaque 1er janvier d'après l'indice du deuxième trimestre de l'année précédente.",
    aussi: ['Indice de référence des loyers'],
  },
  {
    terme: 'CALEOL',
    developpe: "Commission d'Attribution des Logements et d'Examen de l'Occupation des Logements",
    categorie: 'Logement social',
    definition:
      "Instance de chaque organisme HLM qui décide, logement par logement, à qui il est attribué, et qui examine l'occupation du parc. En principe, elle étudie au moins trois candidatures par logement.",
    aussi: ["Commission d'attribution", 'CAL'],
  },
  {
    terme: 'Cotation de la demande',
    categorie: 'Logement social',
    definition:
      "Système de points qui aide à classer les demandes de logement social selon la situation du ménage. Elle éclaire la commission d'attribution sans décider à sa place.",
    aussi: ['Cotation'],
  },
  {
    terme: 'DALO',
    developpe: 'Droit Au Logement Opposable',
    categorie: 'Logement social',
    definition:
      "Droit reconnu à certains ménages mal logés ou sans logement de faire reconnaître leur demande comme prioritaire par une commission de médiation, puis de se faire reloger par l'État. Au moins 25 % des attributions annuelles de chaque organisme vont aux ménages DALO ou prioritaires.",
    aussi: ['Droit au logement opposable', 'Ménages prioritaires'],
  },
  {
    terme: 'Réservataire',
    categorie: 'Logement social',
    definition:
      "Organisme ou collectivité (État, collectivité, Action Logement…) qui peut proposer des candidats pour une part des logements d'un bailleur, en échange d'un soutien à l'opération.",
    aussi: ['Réservation de logements', 'Contingent'],
  },
  {
    terme: 'Supplément de loyer de solidarité',
    categorie: 'Logement social',
    definition:
      "Majoration de loyer demandée à un locataire dont les ressources dépassent d'au moins 20 % les plafonds d'attribution. Elle se calcule avec la surface habitable, un coefficient de dépassement et une valeur de référence par zone, et ne peut pas porter loyer et supplément au-delà de 30 % des ressources.",
    aussi: ['SLS', 'Surloyer', 'Surloyer HLM'],
  },
  {
    terme: 'Loi SRU',
    developpe: 'Solidarité et Renouvellement Urbains',
    categorie: 'Urbanisme',
    definition:
      "Loi du 13 décembre 2000 dont l'article 55 impose à certaines communes d'avoir 20 ou 25 % de logements sociaux parmi leurs résidences principales. Les communes en retard doivent rattraper leur déficit et payer un prélèvement.",
    aussi: ['Article 55', 'Loi solidarité et renouvellement urbains', 'SRU'],
  },
  {
    terme: 'Constat de carence',
    categorie: 'Urbanisme',
    definition:
      "Arrêté du préfet qui constate qu'une commune soumise à la loi SRU n'a pas atteint son objectif triennal de rattrapage. Il peut entraîner une majoration du prélèvement et d'autres mesures.",
    aussi: ['Carence', 'Arrêté de carence', 'Commune carencée'],
  },
  {
    terme: 'Contrat de mixité sociale',
    categorie: 'Urbanisme',
    definition:
      "Contrat entre une commune soumise à la loi SRU, le préfet et ses partenaires, qui détaille comment elle atteindra son objectif triennal. Il permet un rythme de rattrapage un peu moins rapide (25 % du déficit au lieu de 33 %).",
    aussi: ['CMS'],
  },
  {
    terme: 'Bilan triennal',
    categorie: 'Urbanisme',
    definition:
      "Comparaison, tous les trois ans, entre les logements sociaux réalisés par une commune soumise à la loi SRU et son objectif de rattrapage. Il peut aboutir à un constat de carence.",
    aussi: ['Période triennale', 'Objectif triennal'],
  },
  {
    terme: "Programme local de l'habitat",
    categorie: 'Urbanisme',
    definition:
      "Document par lequel une intercommunalité fixe sa politique locale de l'habitat. Il peut par exemple exclure certains quartiers du supplément de loyer de solidarité.",
    aussi: ['PLH'],
  },
  {
    terme: 'Société de coordination',
    categorie: 'Logement social',
    definition:
      "Société à statut d'organisme HLM qui regroupe plusieurs organismes pour mener un projet commun, sans les fusionner : chacun garde sa personnalité morale. C'est l'une des deux façons de former un groupe depuis la loi ELAN.",
    aussi: ['SAC', 'Société anonyme de coordination'],
  },
  {
    terme: "Groupe d'organismes de logement social",
    categorie: 'Logement social',
    definition:
      "Ensemble d'organismes qui gèrent ensemble au moins 12 000 logements, formé soit par un contrôle capitalistique (société mère et filiales), soit autour d'une société de coordination. La loi ELAN l'impose aux organismes plus petits, sauf exceptions.",
    aussi: ['Groupe HLM', 'Regroupement des organismes', 'Groupe capitalistique'],
  },
  {
    terme: 'VEFA HLM',
    categorie: 'Logement social',
    definition:
      "Achat de logements en l'état futur d'achèvement par un organisme HLM, auprès d'un promoteur ou d'un autre organisme. L'article L433-2 du code de la construction et de l'habitation l'encadre.",
    aussi: ['VEFA sociale', 'VEFA bailleur social', 'Vente en bloc à un bailleur'],
  },
  {
    terme: 'VEFA inversée',
    categorie: 'Logement social',
    definition:
      "Vente par un organisme HLM de logements en l'état futur d'achèvement à une personne privée, dans un programme majoritairement social, pour au plus 30 % du programme.",
  },
  {
    terme: "Maîtrise d'ouvrage directe",
    categorie: 'Logement social',
    definition:
      "Mode de production où l'organisme achète lui-même le terrain, fait concevoir et construire les logements et en reste propriétaire, par opposition à l'achat de logements déjà montés par un tiers.",
    aussi: ['Production en maîtrise d\'ouvrage directe'],
  },
  {
    terme: 'ANRU',
    developpe: 'Agence Nationale pour la Rénovation Urbaine',
    categorie: 'Urbanisme',
    definition:
      "Agence qui finance et pilote les programmes nationaux de renouvellement urbain dans les quartiers prioritaires.",
    aussi: ['Anru'],
  },
  {
    terme: 'NPNRU',
    developpe: 'Nouveau Programme National de Renouvellement Urbain',
    categorie: 'Urbanisme',
    definition:
      "Programme lancé en 2014 pour transformer les quartiers prioritaires qui ont les plus grands dysfonctionnements : démolition, reconstruction et réhabilitation de logements sociaux, espaces publics et équipements.",
    aussi: ['Nouveau programme national de renouvellement urbain'],
  },
  {
    terme: 'PNRU',
    developpe: 'Programme National de Rénovation Urbaine',
    categorie: 'Urbanisme',
    definition:
      "Premier programme de rénovation urbaine, conduit de 2004 à 2021 dans 546 quartiers, avec 175 000 logements démolis et 220 000 produits d'après l'ANRU.",
    aussi: ['Programme national de rénovation urbaine'],
  },
  {
    terme: "Reconstitution de l'offre",
    categorie: 'Logement social',
    definition:
      "Reconstruction de logements sociaux pour remplacer ceux qui sont démolis dans une opération de renouvellement urbain, souvent hors du quartier concerné.",
    aussi: ['Reconstitution'],
  },
  {
    terme: 'Vente HLM',
    categorie: 'Logement social',
    definition:
      "Vente par un organisme HLM de logements locatifs sociaux qu'il possède depuis plus de dix ans (quinze ans pour les logements PLS), aux locataires ou à d'autres acquéreurs dans un ordre de priorité fixé par la loi.",
    aussi: ['Vente de logements sociaux', 'Vente de logements HLM'],
  },
  {
    terme: 'Seconde vie',
    categorie: 'Logement social',
    definition:
      "Dispositif de rénovation énergétique lourde de logements sociaux anciens. Sous agrément, il ouvre droit à une TVA réduite, à une exonération de taxe foncière de longue durée et à des prêts équivalents au PLAI, au PLUS ou au PLS.",
    aussi: ['Prêt seconde vie'],
  },
  {
    terme: 'Éco-prêt logement social',
    categorie: 'Financement',
    definition:
      "Prêt de la Banque des Territoires dédié à la rénovation thermique des logements sociaux les plus énergivores. Il peut être complété par le prêt PAM.",
    aussi: ['Éco-prêt', 'Eco-prêt'],
  },
  {
    terme: 'PAM',
    developpe: "Prêt à l'Amélioration",
    categorie: 'Financement',
    definition:
      "Prêt de la Banque des Territoires qui finance des travaux d'amélioration, de résidentialisation et de réhabilitation de logements sociaux.",
    aussi: ['Prêt PAM', "Prêt à l'amélioration"],
  },
  {
    terme: 'DPE',
    developpe: 'Diagnostic de Performance Énergétique',
    categorie: 'Thermique',
    definition:
      "Document qui classe un logement de A (très performant) à G (très énergivore) selon sa consommation d'énergie et ses émissions de gaz à effet de serre. Les classes F et G sont dites « passoires thermiques ».",
    aussi: ['Diagnostic de performance énergétique', 'Passoire thermique', 'Passoires thermiques', 'Étiquette énergétique'],
  },
  {
    terme: "Convention d'utilité sociale",
    categorie: 'Logement social',
    definition:
      "Contrat entre un organisme HLM et l'État qui fixe des objectifs avec des indicateurs : politique patrimoniale, service rendu aux locataires, loyers, ventes. Un manquement grave peut être sanctionné.",
    aussi: ['CUS', "Convention d'utilité sociale (CUS)"],
  },
  {
    terme: 'Plan de concertation locative',
    categorie: 'Logement social',
    definition:
      "Document qui organise la concertation entre un bailleur et les représentants de ses locataires sur la gestion de l'immeuble et du patrimoine.",
    aussi: ['Concertation locative'],
  },
];
