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
];
