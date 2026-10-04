// Glossaire du parcours « Nouvelles méthodes de construction » (biosourcé, géosourcé, réemploi).
// Même format que glossaire.js (voir les champs décrits en tête de ce fichier).
// Ce fichier est fusionné avec les autres par glossaire.js : on n'y touche pas pour ajouter
// un terme d'un autre parcours.

export const termes = [
  {
    terme: 'Biosourcé',
    categorie: 'Biosourcé',
    definition:
      "Se dit d'une matière partiellement ou totalement issue de la biomasse végétale ou animale (bois, paille, chanvre, lin, liège, laine de mouton…). Le mot décrit l'origine de la matière, pas sa performance.",
    aussi: ['Matériau biosourcé', 'Matériaux biosourcés', 'Biosourcés', 'Matière biosourcée', 'Produit biosourcé', 'Produits biosourcés'],
  },
  {
    terme: 'Biomasse',
    categorie: 'Biosourcé',
    definition:
      "Matière d'origine biologique, à l'exception des matières de formation géologique ou fossile.",
  },
  {
    terme: 'Géosourcé',
    categorie: 'Géosourcé',
    definition:
      "Se dit d'un matériau issu de ressources d'origine minérale, peu transformées, comme la terre crue ou la pierre. C'est une description d'usage (ministère, Cerema), sans définition réglementaire repérée.",
    aussi: ['Matériau géosourcé', 'Matériaux géosourcés', 'Géosourcés'],
  },
  {
    terme: 'Réemploi',
    categorie: 'Réglementation',
    definition:
      "Opération par laquelle un produit qui n'est pas un déchet est utilisé de nouveau pour un usage identique à celui pour lequel il avait été conçu. Le code de l'environnement (article L541-1-1) le range parmi les mesures de prévention des déchets.",
    aussi: ['Réemployer', 'Produit de réemploi', 'Matériaux de réemploi'],
  },
  {
    terme: 'Réutilisation',
    categorie: 'Réglementation',
    definition:
      "Opération par laquelle un produit devenu déchet est utilisé de nouveau. À la différence du réemploi, l'usage peut être différent de l'usage d'origine.",
    aussi: ['Réutiliser'],
  },
  {
    terme: 'Préparation en vue de la réutilisation',
    categorie: 'Réglementation',
    definition:
      "Opération de contrôle, de nettoyage ou de réparation par laquelle un déchet est préparé pour être utilisé de nouveau sans autre traitement.",
  },
  {
    terme: 'Recyclage',
    categorie: 'Réglementation',
    definition:
      "Opération de valorisation par laquelle des déchets sont retraités pour en refaire de la matière. Selon le code de l'environnement, la valorisation énergétique, la conversion en combustible et le remblayage ne sont pas du recyclage.",
    aussi: ['Recycler', 'Recyclé'],
  },
  {
    terme: 'Prévention des déchets',
    categorie: 'Réglementation',
    definition:
      "Mesures prises avant qu'un produit devienne un déchet, pour réduire la quantité de déchets, leurs effets nocifs ou leur teneur en substances dangereuses. Le réemploi et la prolongation de la durée d'usage en font partie.",
    aussi: ['Prévention'],
  },
  {
    terme: 'Hiérarchie des modes de traitement des déchets',
    categorie: 'Réglementation',
    definition:
      "Ordre de priorité fixé par l'article L541-1 du code de l'environnement : après la prévention, la préparation en vue de la réutilisation, le recyclage, une autre valorisation (notamment énergétique), puis l'élimination.",
    aussi: ['Hiérarchie des déchets', 'Ordre de priorité des déchets'],
  },
  {
    terme: 'Cycle de vie',
    categorie: 'Concepts',
    definition:
      "L'ensemble des étapes de la vie d'un produit ou d'un bâtiment : extraction des matières, fabrication, transport, chantier, usage, fin de vie, puis possibilités de recyclage ou de réemploi.",
    aussi: ['Cycle de vie du bâtiment'],
  },
  {
    terme: 'ACV',
    developpe: 'Analyse de Cycle de Vie',
    categorie: 'Concepts',
    definition:
      "Méthode qui additionne les impacts environnementaux d'un produit ou d'un bâtiment sur toutes les étapes de sa vie. La RE2020 l'impose pour le carbone, sur une durée conventionnelle de 50 ans.",
    aussi: ['Analyse de cycle de vie', 'ACV dynamique'],
  },
  {
    terme: 'RE2020',
    developpe: 'Réglementation Environnementale 2020',
    categorie: 'Réglementation',
    definition:
      "Réglementation des bâtiments neufs, en vigueur pour les logements depuis le 1er janvier 2022. Elle encadre la consommation d'énergie, le confort d'été et, pour la première fois, l'impact carbone sur le cycle de vie.",
    aussi: ['Réglementation environnementale 2020', 'RE 2020'],
  },
  {
    terme: 'Ic construction',
    categorie: 'Réglementation',
    definition:
      "Indicateur de la RE2020 qui mesure l'impact carbone des produits de construction, des équipements et de leur mise en œuvre sur le chantier, en kilogrammes équivalent CO₂ par mètre carré.",
    aussi: ['Ic_construction', 'IC construction'],
  },
  {
    terme: 'Ic énergie',
    categorie: 'Réglementation',
    definition:
      "Indicateur de la RE2020 qui mesure l'impact carbone des consommations d'énergie du bâtiment sur sa durée de vie conventionnelle de 50 ans.",
    aussi: ['Ic_énergie', 'IC énergie'],
  },
  {
    terme: 'Carbone biogénique',
    categorie: 'Biosourcé',
    definition:
      "Carbone absorbé par les végétaux pendant leur croissance. Il reste stocké dans un matériau biosourcé tant que celui-ci reste en place. Le label Bâtiment biosourcé en mesure la quantité stockée.",
    aussi: ['Carbone biogénique stocké', 'Stockage de carbone'],
  },
  {
    terme: 'Label bâtiment biosourcé',
    categorie: 'Biosourcé',
    definition:
      "Label prévu par l'article D171-6 du code de la construction et de l'habitation, délivré par un organisme conventionné avec l'État. Depuis l'arrêté du 2 juillet 2024, ses trois niveaux reposent sur la quantité de carbone biogénique stocké par mètre carré de surface de référence (en habitation : 15, 25 et 45 kgC/m²).",
    aussi: ['Bâtiment biosourcé', 'Label biosourcé'],
  },
  {
    terme: 'Émissions directes',
    categorie: 'Concepts',
    definition:
      "Émissions de gaz à effet de serre produites sur place, par exemple par la combustion du gaz ou du fioul d'un bâtiment (scope 1). Les chiffres officiels du secteur du bâtiment ne comptent qu'elles.",
    aussi: ['Scope 1', 'Émissions directes de gaz à effet de serre'],
  },
  {
    terme: 'CLT',
    developpe: 'Cross Laminated Timber',
    categorie: 'Biosourcé',
    definition:
      "Panneau massif en bois formé de plusieurs couches de planches croisées et collées. Il sert à réaliser des murs, des planchers et des noyaux de bâtiment.",
    aussi: ['Bois lamellé-croisé', 'Bois lamellé croisé', 'Lamellé-croisé', 'Panneau massif contrecollé', 'Panneaux massifs contrecollés'],
  },
  {
    terme: "Classe d'emploi",
    categorie: 'Matériaux',
    definition:
      "Classement (norme NF EN 335) de l'exposition d'un bois à l'humidité et aux agents biologiques, qui détermine la durabilité demandée. Le NF DTU 31.2 place par défaut les bois de structure d'une ossature en classe d'emploi 2.",
    aussi: ["Classes d'emploi", 'NF EN 335'],
  },
  {
    terme: 'Botte de paille',
    categorie: 'Biosourcé',
    definition:
      "Paille de céréale compactée, utilisée comme remplissage isolant d'une ossature et comme support d'enduit. Les règles CP 2012 demandent une masse volumique de 80 à 120 kg/m³ et une humidité inférieure à 20 %.",
    aussi: ['Bottes de paille', 'Paille', 'Construction paille'],
  },
  {
    terme: 'Règles professionnelles',
    categorie: 'Réglementation',
    definition:
      "Documents rédigés par les professionnels d'une filière pour décrire comment concevoir et mettre en œuvre un procédé. Exemple : les règles CP 2012 de la construction en paille, approuvées par la commission de l'AQC chargée de la prévention des produits. Ce n'est pas une loi.",
    aussi: ['Règles pro', 'Règles CP 2012', 'CP 2012', 'Règles professionnelles de la construction en paille'],
  },
  {
    terme: 'Chènevotte',
    categorie: 'Biosourcé',
    definition:
      "Partie fragmentée de l'intérieur de la tige du chanvre, obtenue après défibrage. C'est le granulat léger du béton de chanvre.",
  },
  {
    terme: 'Béton de chanvre',
    categorie: 'Biosourcé',
    definition:
      "Mélange de chènevotte et de chaux, banché, projeté ou coulé pour remplir une ossature, doubler un mur ou isoler une toiture. Il apporte de l'isolation et de l'inertie, mais il ne porte pas le bâtiment.",
    aussi: ['Chaux-chanvre', 'Béton chaux-chanvre', 'Mortier de chanvre'],
  },
  {
    terme: 'Ouate de cellulose',
    categorie: 'Biosourcé',
    definition:
      "Isolant fait de papier recyclé défibré, vendu en vrac (soufflé), en panneaux ou en rouleaux.",
    aussi: ['Laine de cellulose', 'Cellulose'],
  },
  {
    terme: 'Fibre de bois',
    categorie: 'Biosourcé',
    definition:
      "Isolant fabriqué à partir de bois défibré, en panneaux souples ou rigides. Il est souvent fait de coproduits de scierie.",
    aussi: ['Laine de bois', 'Isolant en fibre de bois'],
  },
  {
    terme: 'Liège expansé',
    categorie: 'Biosourcé',
    definition:
      "Isolant issu de l'écorce du chêne-liège, en panneaux ou en vrac.",
    aussi: ['Liège'],
  },
  {
    terme: 'Conductivité thermique',
    developpe: 'lambda, λ',
    categorie: 'Thermique',
    definition:
      "Capacité d'un matériau à laisser passer la chaleur, notée λ et exprimée en W/(m·K). Plus elle est faible, mieux le matériau isole à épaisseur égale.",
    aussi: ['Lambda', 'λ'],
  },
  {
    terme: 'Résistance thermique',
    categorie: 'Thermique',
    definition:
      "Capacité d'une couche de matériau à s'opposer au passage de la chaleur, notée R en m².K/W. Elle vaut l'épaisseur divisée par la conductivité thermique.",
    aussi: ['R', 'Résistance thermique R'],
  },
  {
    terme: 'Terre crue',
    categorie: 'Géosourcé',
    definition:
      "Terre utilisée sans cuisson pour construire. Elle associe de l'argile (le liant), des limons et du sable, parfois des fibres. On la met en œuvre par compactage, empilement, moulage ou remplissage.",
    aussi: ['Construction en terre crue', 'Construction en terre', 'Murs en terre'],
  },
  {
    terme: 'Pisé',
    categorie: 'Géosourcé',
    definition:
      "Technique de mur en terre crue compactée par couches entre deux banches (coffrages). Le mur est porteur, très sensible à l'eau liquide, mais capable de réguler l'humidité de l'air. Il repose sur un soubassement en pierre.",
    aussi: ['Mur en pisé', 'Murs en pisé', 'Maison en pisé'],
  },
  {
    terme: 'Bauge',
    categorie: 'Géosourcé',
    definition:
      "Technique de mur en terre crue mêlée à des fibres (paille, par exemple), à de l'eau et parfois à du sable, empilée en boules puis dressée en mur. Très présente en Bretagne, en Normandie et dans l'Ouest.",
    aussi: ['Mur en bauge', 'Murs en bauge'],
  },
  {
    terme: 'Adobe',
    categorie: 'Géosourcé',
    definition:
      "Brique de terre crue moulée et séchée au soleil ou à l'air, maçonnée avec un mortier de terre. On parle aussi de brique de terre crue.",
    aussi: ['Brique de terre crue', 'Briques de terre crue', 'Briques en terre crue'],
  },
  {
    terme: 'Bloc de terre comprimée',
    developpe: 'BTC',
    categorie: 'Géosourcé',
    definition:
      "Brique de terre crue fabriquée à la presse, plus régulière et plus industrialisée que l'adobe. Elle sert à bâtir des murs de maçonnerie.",
    aussi: ['BTC', 'Blocs de terre comprimée', 'Brique de terre comprimée'],
  },
  {
    terme: 'Torchis',
    categorie: 'Géosourcé',
    definition:
      "Mélange de terre et de fibres végétales qui remplit une ossature en pans de bois (le colombage). Il ne porte pas le bâtiment.",
    aussi: ['Colombage-torchis', 'Pan de bois et torchis'],
  },
  {
    terme: 'Terre allégée',
    categorie: 'Géosourcé',
    definition:
      "Terre mêlée à des fibres ou à des granulats végétaux (paille, par exemple), pour remplir ou doubler un mur. Elle est moins dense, donc plus isolante que la terre pleine.",
    aussi: ['Terre-paille', 'Mélange terre-paille'],
  },
  {
    terme: 'Guides de bonnes pratiques de la terre crue',
    categorie: 'Géosourcé',
    definition:
      "Six guides rédigés par les professionnels (torchis, brique de terre crue, pisé, bauge, terre allégée, enduits de terre). Ils fixent des performances attendues et servent de référence entre concepteurs, entreprises, contrôleurs et assureurs. Ils ne remplacent pas la formation.",
    aussi: ['Guides de bonnes pratiques', 'Guide de bonnes pratiques', 'Guides de bonnes pratiques de la construction en terre crue'],
  },
  {
    terme: 'Pierre sèche',
    categorie: 'Géosourcé',
    definition:
      "Technique de mur en pierres assemblées sans mortier, dont la stabilité vient du calage et de l'appareillage des pierres. Ses règles professionnelles sont acceptées par la C2P de l'AQC. Usages actuels surtout en soutènement et en clôture.",
    aussi: ['Mur en pierre sèche', 'Murs en pierre sèche', 'Pierres sèches'],
  },
  {
    terme: 'Pierre massive',
    categorie: 'Géosourcé',
    definition:
      "Mur porteur en blocs de pierre naturelle, utilisé en construction neuve comme en patrimoine. Le bilan carbone dépend beaucoup de la distance entre la carrière et le chantier.",
    aussi: ['Pierre massive porteuse', 'Maçonnerie de pierre'],
  },
  {
    terme: 'Hygroscopique',
    categorie: 'Matériaux',
    definition:
      "Se dit d'un matériau qui capte l'humidité de l'air, la stocke dans ses pores et la restitue quand l'air s'assèche. C'est le cas des matériaux biosourcés. L'eau absorbée augmente leur conductivité thermique.",
    aussi: ['Hygroscopicité', 'Matériau hygroscopique', 'Matériaux hygroscopiques'],
  },
  {
    terme: "Perméabilité à la vapeur d'eau",
    categorie: 'Matériaux',
    definition:
      "Capacité d'un matériau à laisser passer la vapeur d'eau. Une paroi doit en général laisser sortir la vapeur plus facilement qu'elle ne la laisse entrer. « Respirant » et « perspirant » sont des appellations courantes, sans valeur technique précise.",
    aussi: ['Perspirant', 'Perspirance', 'Respirant', 'Perméable à la vapeur', 'Perméable à la vapeur d\'eau', 'Diffusion de vapeur'],
  },
  {
    terme: 'Frein-vapeur',
    categorie: 'Matériaux',
    definition:
      "Membrane ou revêtement posé côté intérieur d'une paroi, qui ralentit le passage de la vapeur d'eau vers l'isolant pour limiter la condensation. Il freine la vapeur sans l'arrêter complètement.",
    aussi: ['Freins-vapeur', 'Membrane frein-vapeur'],
  },
  {
    terme: 'Condensation interstitielle',
    categorie: 'Construction',
    definition:
      "Condensation de la vapeur d'eau à l'intérieur d'une paroi, là où la température passe sous le point de rosée. Elle mouille l'isolant et peut abîmer la structure.",
    aussi: ['Point de rosée', 'Condensation dans la paroi'],
  },
  {
    terme: 'Inertie thermique',
    categorie: 'Thermique',
    definition:
      "Capacité d'une paroi ou d'un bâtiment à stocker la chaleur puis à la restituer lentement. Elle vient surtout de la masse des matériaux et limite les écarts de température, en particulier en été.",
    aussi: ['Inertie', 'Forte inertie'],
  },
  {
    terme: 'Déphasage thermique',
    categorie: 'Thermique',
    definition:
      "Retard avec lequel la chaleur extérieure traverse une paroi. Il dépend de l'épaisseur, de la densité et de la chaleur massique des matériaux.",
    aussi: ['Déphasage'],
  },
  {
    terme: 'Degrés-heures',
    developpe: 'DH',
    categorie: 'Thermique',
    definition:
      "Indicateur de confort d'été de la RE2020 : somme, heure par heure, de l'écart entre la température ressentie et une température de confort. Sous 350 DH, le confort est jugé bon ; au-dessus de 1 250 DH (cas général), le bâtiment est non conforme.",
    aussi: ['DH', "Degrés-heures d'inconfort", 'Degré-heure', "Confort d'été"],
  },
  {
    terme: 'Isolement acoustique',
    developpe: 'DnT,A',
    categorie: 'Réglementation',
    definition:
      "Mesure en décibels de l'atténuation du bruit entre deux locaux. Entre deux logements neufs, l'arrêté du 30 juin 1999 exige un DnT,A d'au moins 53 dB. Contre les bruits de l'extérieur, le DnT,A,tr minimal est de 30 dB.",
    aussi: ['DnT,A', 'DnT,A,tr', 'Isolement acoustique standardisé pondéré', 'NRA', 'Nouvelle réglementation acoustique'],
  },
  {
    terme: 'Masse-ressort-masse',
    categorie: 'Concepts',
    definition:
      "Principe d'isolation acoustique : deux parois séparées par un matériau souple (air ou isolant) isolent mieux qu'une seule, à poids égal. Il permet de réaliser des parois légères performantes.",
    aussi: ['Masse ressort masse', 'Loi masse-ressort-masse'],
  },
  {
    terme: 'Réaction au feu',
    categorie: 'Réglementation',
    definition:
      "Comportement d'un matériau face au feu : alimente-t-il l'incendie, produit-il de la fumée ou des gouttes enflammées ? Elle se classe en Euroclasses, de A1 (incombustible) à F.",
    aussi: ['Classement au feu'],
  },
  {
    terme: 'Résistance au feu',
    categorie: 'Réglementation',
    definition:
      "Durée pendant laquelle un élément de construction (mur, plancher) remplit sa fonction : R pour la stabilité, E pour l'étanchéité aux flammes et aux gaz, I pour l'isolation. EI 120 signifie coupe-feu pendant deux heures.",
    aussi: ['REI', 'EI', 'Coupe-feu', 'Stable au feu'],
  },
  {
    terme: 'Euroclasse',
    categorie: 'Réglementation',
    definition:
      "Classement européen de la réaction au feu, de A1 (incombustible) à F. Les indices s (fumée) et d (gouttes enflammées) le précisent : B-s1,d0 signifie bonne réaction, peu de fumée et pas de gouttes enflammées.",
    aussi: ['Euroclasses', 'B-s1,d0'],
  },
  {
    terme: 'Feu couvant',
    categorie: 'Matériaux',
    definition:
      "Combustion sans flamme qui s'installe dans les matériaux poreux (isolants fibreux, paille) et se propage à l'intérieur d'une paroi. Elle se vérifie par des essais spécifiques.",
    aussi: ['Couvant', 'Combustion couvante'],
  },
  {
    terme: 'FDES',
    developpe: 'Fiche de Déclaration Environnementale et Sanitaire',
    categorie: 'Réglementation',
    definition:
      "Carte d'identité environnementale d'un produit de construction, établie par son fabricant selon la norme NF EN 15804 et vérifiée par une tierce partie indépendante. Elle sert de donnée d'entrée au calcul carbone de la RE2020 et se consulte dans la base INIES. Elle déclare, elle ne certifie pas un niveau.",
    aussi: ['Fiche de déclaration environnementale et sanitaire', 'FDES collective', 'Déclaration environnementale'],
  },
  {
    terme: 'PEP',
    developpe: 'Profil Environnemental Produit',
    categorie: 'Réglementation',
    definition:
      "Équivalent de la FDES pour les équipements du bâtiment (ventilation, électricité, chauffage…). Il alimente aussi le calcul carbone de la RE2020.",
    aussi: ['Profil environnemental produit', 'PEP Ecopassport'],
  },
  {
    terme: 'INIES',
    categorie: 'Réglementation',
    definition:
      "Base de données publique et gratuite qui rassemble les FDES, les PEP et les données environnementales par défaut utilisées pour le calcul carbone des bâtiments. Elle est créée en 2004.",
    aussi: ['Base INIES', 'inies.fr'],
  },
  {
    terme: 'Donnée environnementale par défaut',
    developpe: 'DED',
    categorie: 'Réglementation',
    definition:
      "Valeur mise à disposition par le ministère pour un produit qui n'a pas de FDES. Elle est majorée : elle pénalise le projet et incite les fabricants à déclarer.",
    aussi: ['DED', 'Données par défaut', 'Donnée par défaut', 'Données environnementales par défaut'],
  },
  {
    terme: 'Unité fonctionnelle',
    categorie: 'Concepts',
    definition:
      "Ce que l'ACV d'un produit mesure et compare : par exemple 1 m² de mur pendant une durée de vie donnée. Deux FDES ne se comparent que si leur unité fonctionnelle et leur durée de vie sont les mêmes.",
    aussi: ['Unités fonctionnelles'],
  },
  {
    terme: 'Technique courante',
    developpe: 'TC',
    categorie: 'Assurance',
    definition:
      "Notion d'assurance : procédé qui dispose d'un référentiel produit, d'un référentiel de mise en œuvre (NF DTU, règles professionnelles acceptées par la C2P, Avis Technique en liste verte, ATEx favorable…) et qui est employé dans son domaine d'emploi. Elle est couverte par défaut par les contrats d'assurance décennale.",
    aussi: ['TC', 'Techniques courantes'],
  },
  {
    terme: 'Technique non courante',
    developpe: 'TNC',
    categorie: 'Assurance',
    definition:
      "Procédé qui ne remplit pas les conditions de la technique courante : pas de référentiel reconnu, Avis Technique hors liste verte, usage hors du domaine d'emploi. Il se déclare à l'assureur, reste assurable après analyse de risque et peut entraîner une surprime.",
    aussi: ['TNC', 'Techniques non courantes'],
  },
  {
    terme: "Domaine d'emploi",
    categorie: 'Assurance',
    definition:
      "Limites dans lesquelles un procédé est reconnu : type de support, famille de bâtiment, localisation, hauteur, conditions climatiques. Hors de ce cadre, même un procédé sous Avis Technique redevient une technique non courante.",
    aussi: ["Domaines d'emploi"],
  },
  {
    terme: 'AQC',
    developpe: 'Agence Qualité Construction',
    categorie: 'Assurance',
    definition:
      "Organisme de prévention des désordres dans le bâtiment. Il observe les sinistres et abrite la C2P, qui examine les règles professionnelles et tient la liste verte.",
    aussi: ['Agence Qualité Construction'],
  },
  {
    terme: 'C2P',
    developpe: 'Commission Prévention Produits mis en œuvre',
    categorie: 'Assurance',
    definition:
      "Commission de l'AQC qui réunit entreprises, fabricants, assureurs, experts, contrôleurs techniques et CSTB. Elle examine les règles professionnelles, classe en liste verte les Avis Techniques sans risque aggravé et peut mettre un procédé en observation.",
    aussi: ['Commission Prévention Produits', 'Commission Prévention Produits mis en œuvre'],
  },
  {
    terme: 'Liste verte',
    categorie: 'Assurance',
    definition:
      "Liste tenue par la C2P des produits et procédés sous Avis Technique ou DTA en cours de validité, non mis en observation. Ils sont considérés comme techniques courantes par les assureurs.",
    aussi: ['Liste verte de la C2P', 'Mise en observation'],
  },
  {
    terme: 'Avis Technique',
    developpe: 'ATec',
    categorie: 'Assurance',
    definition:
      "Évaluation volontaire d'un procédé innovant, instruite par le CSTB et validée par une commission (la CCFAT). Le Document Technique d'Application (DTA) en est une variante. Quand il figure sur la liste verte de la C2P, le procédé relève de la technique courante dans son domaine d'emploi.",
    aussi: ['ATec', 'DTA', "Document Technique d'Application", 'Avis Techniques'],
  },
  {
    terme: 'ATEx',
    developpe: "Appréciation Technique d'Expérimentation",
    categorie: 'Assurance',
    definition:
      "Évaluation rapide, délivrée par le CSTB, d'une technique innovante. Cas A : plusieurs chantiers. Cas B : un chantier précis. Cas C : reprise d'une ATEx de cas B sur un autre chantier. Seule une ATEx favorable ouvre la voie à l'assurabilité.",
    aussi: ["Appréciation technique d'expérimentation", 'ATEx favorable', 'ATEx cas B'],
  },
  {
    terme: 'CSTB',
    developpe: 'Centre Scientifique et Technique du Bâtiment',
    categorie: 'Assurance',
    definition:
      "Établissement public de recherche et d'évaluation du bâtiment. Il instruit les Avis Techniques et délivre les ATEx.",
    aussi: ['Centre scientifique et technique du bâtiment'],
  },
  {
    terme: 'Diagnostic PEMD',
    developpe: 'Produits, Équipements, Matériaux et Déchets',
    categorie: 'Réglementation',
    definition:
      "Diagnostic que le maître d'ouvrage doit faire réaliser avant une démolition ou une rénovation significative dont la surface cumulée de plancher dépasse 1 000 m². Il décrit la nature et la quantité des produits, matériaux, équipements et déchets, et ce qui peut être réemployé. Il remplace depuis juillet 2023 le diagnostic déchets.",
    aussi: ['PEMD', 'Diagnostic déchets', 'Diagnostic ressources', 'Diagnostic produits équipements matériaux déchets'],
  },
  {
    terme: 'REP',
    developpe: 'Responsabilité Élargie du Producteur',
    categorie: 'Réglementation',
    definition:
      "Principe selon lequel les producteurs financent la gestion des déchets issus de leurs produits. Pour le bâtiment (REP PMCB), instaurée par la loi AGEC puis le décret du 31 décembre 2021, elle finance la reprise sans frais des déchets triés. L'écocontribution s'applique aux produits facturés depuis le 1er mai 2023.",
    aussi: ['REP PMCB', 'REP bâtiment', 'Responsabilité élargie du producteur', 'Écocontribution'],
  },
  {
    terme: 'Éco-organisme',
    categorie: 'Réglementation',
    definition:
      "Organisme agréé par l'État auquel les producteurs adhèrent pour remplir leur responsabilité élargie. Il perçoit les écocontributions et organise la collecte et le traitement des déchets.",
    aussi: ['Éco-organismes'],
  },
  {
    terme: 'Terres excavées',
    categorie: 'Réglementation',
    definition:
      "Terres extraites lors d'un chantier de terrassement. Quand elles quittent le site, elles ont un statut de déchet. Réutilisées dans leur état naturel sur le site même, elles ne prennent pas ce statut, selon le ministère.",
    aussi: ['Terre excavée', 'Déblais', 'Terres de déblais'],
  },
  {
    terme: "Qualification d'un produit de réemploi",
    categorie: 'Assurance',
    definition:
      "Étape qui vérifie qu'un produit de réemploi convient à l'usage visé : examen, mesures, calculs ou essais, et traçabilité. Aucun texte ne l'encadre : elle peut être faite par une plateforme, un acteur indépendant ou un intervenant de l'opération, qui doit être assuré.",
    aussi: ['Qualification technique', 'Qualificateur', 'CCTP réemploi'],
  },
  {
    terme: 'Réemploi in situ',
    categorie: 'Assurance',
    definition:
      "Réemploi de matériaux issus du site même de l'opération, par exemple des briques d'un bâtiment démoli utilisées dans le neuf sur la même parcelle.",
    aussi: ['In situ'],
  },
  {
    terme: 'Réemploi rapporté',
    categorie: 'Assurance',
    definition:
      "Réemploi de matériaux venus d'autres opérations, du même maître d'ouvrage ou non, mis à disposition des entreprises sans être vendus. Il n'y a pas de cession, donc pas de garantie de vendeur ; l'entreprise peut refuser la mise en œuvre. Ne pas confondre avec le réemploi ex situ, qui passe par une vente.",
    aussi: ['Réemploi rapporté (hors site)', 'Matériaux rapportés'],
  },
  {
    terme: 'Réemploi ex situ',
    categorie: 'Assurance',
    definition:
      "Réemploi de matériaux venus d'un autre site, par cession ou achat. Le vendeur est tenu aux garanties légales : information, délivrance conforme, vices cachés.",
    aussi: ['Ex situ', 'Réemploi par cession'],
  },
  {
    terme: 'Déboursé sec',
    categorie: 'Promotion',
    definition:
      "Prix d'un matériau ou d'un produit fourni, sans sa pose. Il sert à comparer des produits dont la mise en œuvre est identique ou proche. Pour comparer des techniques différentes, on préfère le prix en œuvre.",
    aussi: ['Prix déboursé sec', 'Déboursés secs'],
  },
  {
    terme: 'Prix en œuvre',
    categorie: 'Promotion',
    definition:
      "Prix d'un ouvrage fourni et posé, par exemple en euros hors taxes par mètre carré de paroi. Il inclut la mise en œuvre, donc convient mieux que le déboursé sec pour comparer des techniques différentes (mur en paille, bloc de chanvre…).",
    aussi: ['Prix mis en œuvre', 'Fourniture et pose', 'Coût en œuvre'],
  },
  {
    terme: 'Coût global',
    categorie: 'Promotion',
    definition:
      "Coût d'un bâtiment sur toute sa durée : investissement, exploitation, entretien, remplacements et déconstruction (norme ISO 15686-5). Il intéresse surtout les propriétaires qui gèrent leur patrimoine, comme les bailleurs.",
    aussi: ['Coût global direct', 'Coût global élargi', 'ISO 15686-5'],
  },
  {
    terme: 'Filière locale',
    categorie: 'Concepts',
    definition:
      "Ensemble des acteurs d'un territoire qui, d'une ressource locale (forêt, paille, terre, pierre) à la mise en œuvre, produisent des matériaux de construction. Une filière tient par la disponibilité de la ressource, des solutions rentables et assurables, et des acteurs formés.",
    aussi: ['Filières locales', 'Filière bas carbone', 'Filières bas carbone', 'Circuit court'],
  },
  {
    terme: 'Formation Pro-Paille',
    categorie: 'Biosourcé',
    definition:
      "Formation de 5 jours définie par le Réseau Français de la Construction Paille. Elle couvre les pratiques des règles professionnelles de la construction en paille et est à prévoir pour la conception comme pour la réalisation.",
    aussi: ['Pro-Paille', 'Pro paille'],
  },
  {
    terme: 'BDNA',
    developpe: 'Bâtiments Durables Nouvelle-Aquitaine',
    categorie: 'Réglementation',
    definition:
      "Démarche environnementale volontaire adaptée à la Nouvelle-Aquitaine. Elle propose des critères d'exigence pour les maîtres d'ouvrage, par exemple sur le recours à des matériaux disponibles sur site, au réemploi ou à des entreprises locales.",
    aussi: ['Bâtiments Durables Nouvelle-Aquitaine', 'Démarche BDNA'],
  },
];
