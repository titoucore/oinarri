// Données du comparateur de matériaux.
//
// Règles de ce fichier :
// - aucune valeur n'est inventée : chaque champ renvoie à une ou plusieurs sources (clés de SOURCES) ;
// - « statut » dit à quel point la valeur est solide :
//     recoupe        confirmée par une source primaire ou par au moins deux sources
//     source_unique  une seule source secondaire
//     ecart          les sources donnent des valeurs différentes (l'écart est expliqué dans la note)
//     non_recoupe    repère général, non vérifié ici
// - une information absente de la source est notée « non renseigné », jamais estimée ;
// - « assurance » : courante = référentiel de mise en œuvre reconnu (voir chapitre 6) ;
//   selon_assureur = hors liste, à négocier ; a_verifier = non établi ici ;
// - « carbone » est qualitatif : le résultat réel dépend de la FDES du produit (chapitre 5).
//
// Les champs de propriétés physiques viennent des sources consultées le 11 octobre 2026.
// Les champs d'assurance et de carbone reprennent les chapitres d'Oinarri vérifiés le 4 octobre 2026.

export const DONNEES_VERIFIEES_LE = '2026-10-11';

export const GROUPES = [
  { id: 'biosource', libelle: 'Biosourcés' },
  { id: 'geosource', libelle: 'Géosourcés' },
  { id: 'reference', libelle: 'Références classiques' },
];

export const SOURCES = {
  thbat: {
    titre: 'Règles Th-Bât, fascicule « Matériaux »',
    editeur: 'Ministère chargé de la construction',
    date: '20 décembre 2017',
    niveau: 'Primaire',
    url: 'https://rt-re-batiment.developpement-durable.gouv.fr/IMG/pdf/2-fascicule_materiaux.pdf',
  },
  me2019: {
    titre: 'La Maison écologique, spécial isolation : comparatif global des isolants',
    editeur: 'Repris par la DREAL des Pays de la Loire',
    date: '2019 (chiffres mis à jour en 2017)',
    niveau: 'Secondaire sérieux',
    url: 'https://www.pays-de-la-loire.developpement-durable.gouv.fr/tableau-comparatif-des-isolants-a5845.html',
  },
  dec96603: {
    titre: 'Décision 96/603/CE : produits de classe A1 sans essai',
    editeur: 'Commission européenne',
    date: '1996, modifiée',
    niveau: 'Primaire',
    url: 'https://eur-lex.europa.eu/eli/dec/1996/603/oj/fra',
  },
  dec2003593: {
    titre: 'Décision 2003/593/CE : réaction au feu des produits de bois de charpente',
    editeur: 'Commission européenne (copie hébergée par Buildwise)',
    date: '2003',
    niveau: 'Primaire',
    url: 'https://www.buildwise.be/media/roxjjtpu/2003-593-ce_fr.pdf',
  },
  ch2: {
    titre: 'Oinarri, chapitre 2 : les matériaux biosourcés',
    editeur: 'Oinarri',
    date: 'vérifié le 4 octobre 2026',
    niveau: 'Chapitre du cours',
    url: '/materiaux-biosources/02-les-materiaux-biosources/',
  },
  ch3: {
    titre: 'Oinarri, chapitre 3 : les matériaux géosourcés',
    editeur: 'Oinarri',
    date: 'vérifié le 4 octobre 2026',
    niveau: 'Chapitre du cours',
    url: '/materiaux-biosources/03-les-materiaux-geosources/',
  },
  ch4: {
    titre: 'Oinarri, chapitre 4 : le comportement physique',
    editeur: 'Oinarri',
    date: 'vérifié le 4 octobre 2026',
    niveau: 'Chapitre du cours',
    url: '/materiaux-biosources/04-le-comportement-physique/',
  },
  ch5: {
    titre: 'Oinarri, chapitre 5 : mesurer et réglementer',
    editeur: 'Oinarri',
    date: 'vérifié le 4 octobre 2026',
    niveau: 'Chapitre du cours',
    url: '/materiaux-biosources/05-mesurer-et-reglementer/',
  },
  ch6: {
    titre: 'Oinarri, chapitre 6 : règles professionnelles et assurabilité',
    editeur: 'Oinarri',
    date: 'vérifié le 4 octobre 2026',
    niveau: 'Chapitre du cours',
    url: '/materiaux-biosources/06-regles-professionnelles-et-assurabilite/',
  },
};

const NON_RENSEIGNE = 'Non renseigné dans la source';

export const MATERIAUX = [
  // ---------- Biosourcés ----------
  {
    id: 'bois-structure',
    nom: 'Bois de structure (résineux)',
    famille: 'biosource',
    forme: 'Bois massif, ossature, lamellé',
    roles: ['Porter'],
    chapitre: '/materiaux-biosources/02-les-materiaux-biosources/',
    note: "Le bois porte, il n'isole pas : l'épaisseur calculée sert à comparer, pas à construire un mur.",
    lambda: { min: 0.11, max: 0.15, src: ['thbat'], statut: 'recoupe', note: 'Épicéa et sapin : 0,11 ; douglas, mélèze, pins : 0,13 ; résineux mi-lourds : 0,15.' },
    masse: { texte: "Jusqu'à 520 kg/m³ (masse volumique sèche des résineux légers et mi-lourds)", src: ['thbat'], statut: 'recoupe' },
    chaleur: { texte: '1 600 J/(kg·K)', src: ['thbat'], statut: 'recoupe' },
    vapeur: { texte: 'μ de 50 (sec) à 20 (humide)', src: ['thbat'], statut: 'recoupe' },
    feu: { texte: 'D-s2, d0 pour le bois de charpente (au moins 350 kg/m³ et 22 mm d\'épaisseur)', src: ['dec2003593'], statut: 'recoupe' },
    assurance: { niveau: 'courante', texte: "Ossature bois : NF DTU 31.2, jusqu'à 28 m de hauteur. Autres systèmes (CLT, poteaux-poutres) : à vérifier au cas par cas.", src: ['ch2'], statut: 'source_unique' },
    carbone: { niveau: 'stocke', texte: 'Stocke du carbone biogénique tant qu\'il reste en place. Le bois de structure améliore le bilan.', src: ['ch5'], statut: 'source_unique' },
  },
  {
    id: 'paille',
    nom: 'Botte de paille',
    famille: 'biosource',
    forme: 'Bottes compressées, remplissage d\'ossature',
    roles: ['Remplir', 'Isoler'],
    chapitre: '/materiaux-biosources/02-les-materiaux-biosources/',
    note: "Un mur de paille enduit a tenu EI 120 min lors d'un essai présenté en 2023 : la tenue au feu d'une paroi est un autre critère que la classe du matériau (chapitre 4).",
    lambda: { min: 0.045, max: 0.055, src: ['me2019', 'ch2'], statut: 'recoupe', note: '0,052 posée sur chant (règles professionnelles CP 2012) ; 0,048 dans un autre comparatif.' },
    masse: { texte: '80 à 120 kg/m³', src: ['me2019', 'ch2'], statut: 'recoupe' },
    chaleur: { texte: '1 400 à 2 000 J/(kg·K)', src: ['me2019'], statut: 'source_unique' },
    vapeur: { texte: 'μ de 1 à 2', src: ['me2019'], statut: 'source_unique' },
    feu: { texte: 'Classe E annoncée', src: ['me2019'], statut: 'source_unique' },
    assurance: { niveau: 'courante', texte: 'Règles professionnelles CP 2012 (3e édition), acceptées par la C2P depuis le 1er juillet 2018 : technique courante dans leur domaine d\'emploi.', src: ['ch2', 'ch6'], statut: 'recoupe' },
    carbone: { niveau: 'stocke', texte: 'Stocke du carbone : bilan favorable.', src: ['me2019'], statut: 'source_unique' },
  },
  {
    id: 'beton-chanvre',
    nom: 'Béton de chanvre',
    famille: 'biosource',
    forme: 'Chènevotte et chaux, banché ou projeté',
    roles: ['Remplir', 'Isoler'],
    chapitre: '/materiaux-biosources/02-les-materiaux-biosources/',
    note: 'Non porteur. On l\'apprécie pour son épaisseur et son inertie plus que pour son λ.',
    lambda: { min: 0.056, max: 0.09, src: ['me2019', 'thbat', 'ch2'], statut: 'ecart', note: 'Valeurs déclarées : 0,056 à 0,09. Les règles Th-Bât imposent par défaut 0,1 à 0,2 selon la masse volumique : une valeur volontairement prudente.' },
    masse: { texte: '190 à 400 kg/m³', src: ['me2019'], statut: 'source_unique' },
    chaleur: { texte: '1 500 à 1 700 J/(kg·K)', src: ['me2019'], statut: 'source_unique' },
    vapeur: { texte: 'μ de 10 à 13', src: ['me2019'], statut: 'source_unique' },
    feu: { texte: 'Classe B annoncée', src: ['me2019'], statut: 'source_unique' },
    assurance: { niveau: 'courante', texte: 'Règles professionnelles « parois verticales » (juin 2024), acceptées par la C2P depuis le 1er juillet 2024 : murs, cloisons, doublages. Sols et toitures : à vérifier.', src: ['ch2', 'ch6'], statut: 'recoupe' },
    carbone: { niveau: 'stocke', texte: 'Stocke du carbone : bilan favorable.', src: ['me2019'], statut: 'source_unique' },
  },
  {
    id: 'ouate',
    nom: 'Ouate de cellulose',
    famille: 'biosource',
    forme: 'Vrac soufflé, insufflé ou projeté humide',
    roles: ['Isoler'],
    chapitre: '/materiaux-biosources/02-les-materiaux-biosources/',
    lambda: { min: 0.036, max: 0.044, src: ['me2019', 'ch2'], statut: 'recoupe', note: 'Selon le mode de pose : soufflé 0,036 à 0,041 ; insufflé 0,040 à 0,044 ; projeté humide 0,040 à 0,043.' },
    masse: { texte: '23 à 65 kg/m³ selon la pose', src: ['me2019'], statut: 'source_unique' },
    chaleur: { texte: '1 600 à 2 100 J/(kg·K)', src: ['me2019'], statut: 'source_unique' },
    vapeur: { texte: 'μ de 1 à 2', src: ['me2019'], statut: 'source_unique' },
    feu: { texte: 'De B à E selon le produit', src: ['me2019'], statut: 'source_unique' },
    assurance: { niveau: 'a_verifier', texte: 'Une norme de produit existe. Le référentiel de mise en œuvre est à confirmer selon le procédé (DTU, Avis Technique).', src: ['ch2', 'ch6'], statut: 'source_unique' },
    carbone: { niveau: 'stocke', texte: 'Papier recyclé : bilan favorable.', src: ['me2019'], statut: 'source_unique' },
  },
  {
    id: 'fibre-bois-souple',
    nom: 'Fibre de bois, panneau souple',
    famille: 'biosource',
    forme: 'Panneaux souples entre montants',
    roles: ['Isoler'],
    chapitre: '/materiaux-biosources/02-les-materiaux-biosources/',
    lambda: { min: 0.036, max: 0.042, src: ['me2019', 'ch2'], statut: 'recoupe' },
    masse: { texte: '30 à 50 kg/m³', src: ['me2019'], statut: 'source_unique' },
    chaleur: { texte: '1 800 à 2 100 J/(kg·K)', src: ['me2019'], statut: 'source_unique' },
    vapeur: { texte: 'μ de 1 à 2', src: ['me2019'], statut: 'source_unique' },
    feu: { texte: 'Classe E annoncée', src: ['me2019'], statut: 'source_unique' },
    assurance: { niveau: 'a_verifier', texte: "Selon le produit : norme de produit et Avis Technique éventuel. Le domaine d'emploi est à vérifier.", src: ['ch6'], statut: 'source_unique' },
    carbone: { niveau: 'stocke', texte: 'Stocke du carbone : bilan favorable.', src: ['me2019'], statut: 'source_unique' },
  },
  {
    id: 'fibre-bois-rigide',
    nom: 'Fibre de bois, panneau rigide',
    famille: 'biosource',
    forme: "Panneaux rigides, isolation par l'extérieur ou sous-toiture",
    roles: ['Isoler'],
    chapitre: '/materiaux-biosources/02-les-materiaux-biosources/',
    lambda: { min: 0.038, max: 0.05, src: ['me2019', 'ch2'], statut: 'recoupe' },
    masse: { texte: '140 à 270 kg/m³', src: ['me2019'], statut: 'source_unique' },
    chaleur: { texte: '1 800 à 2 100 J/(kg·K)', src: ['me2019'], statut: 'source_unique' },
    vapeur: { texte: 'μ de 3 à 5', src: ['me2019'], statut: 'source_unique' },
    feu: { texte: 'Classe E annoncée', src: ['me2019'], statut: 'source_unique' },
    assurance: { niveau: 'a_verifier', texte: "Selon le produit : norme de produit et Avis Technique éventuel. Le domaine d'emploi est à vérifier.", src: ['ch6'], statut: 'source_unique' },
    carbone: { niveau: 'stocke', texte: 'Stocke du carbone : bilan favorable.', src: ['me2019'], statut: 'source_unique' },
  },
  {
    id: 'liege',
    nom: 'Liège expansé, panneau',
    famille: 'biosource',
    forme: 'Panneaux de liège expansé pur',
    roles: ['Isoler'],
    chapitre: '/materiaux-biosources/02-les-materiaux-biosources/',
    lambda: { min: 0.038, max: 0.042, src: ['me2019', 'ch2'], statut: 'recoupe', note: '0,037 dans le diagramme du chapitre 2 : écart faible.' },
    masse: { texte: '105 à 150 kg/m³', src: ['me2019'], statut: 'source_unique' },
    chaleur: { texte: '1 700 à 2 000 J/(kg·K)', src: ['me2019'], statut: 'source_unique' },
    vapeur: { texte: 'μ de 5 à 30', src: ['me2019'], statut: 'source_unique' },
    feu: { texte: 'Classe E annoncée', src: ['me2019'], statut: 'source_unique' },
    assurance: { niveau: 'a_verifier', texte: "Selon le produit : norme de produit et Avis Technique éventuel. Le domaine d'emploi est à vérifier.", src: ['ch6'], statut: 'source_unique' },
    carbone: { niveau: 'stocke', texte: 'Stocke du carbone : bilan favorable.', src: ['me2019'], statut: 'source_unique' },
  },
  {
    id: 'lin',
    nom: 'Laine de lin',
    famille: 'biosource',
    forme: 'Panneaux et rouleaux',
    roles: ['Isoler'],
    chapitre: '/materiaux-biosources/02-les-materiaux-biosources/',
    lambda: { min: 0.037, max: 0.038, src: ['me2019', 'ch2'], statut: 'recoupe' },
    masse: { texte: '20 à 40 kg/m³', src: ['me2019'], statut: 'source_unique' },
    chaleur: { texte: '1 300 à 1 700 J/(kg·K)', src: ['me2019'], statut: 'source_unique' },
    vapeur: { texte: 'μ de 1 à 2', src: ['me2019'], statut: 'source_unique' },
    feu: { texte: 'De B à F selon le produit', src: ['me2019'], statut: 'source_unique' },
    assurance: { niveau: 'selon_assureur', texte: "Évaluation par ATEx citée dans un guide du ministère de 2020 ; son existence actuelle est à vérifier auprès du CSTB.", src: ['ch2', 'ch6'], statut: 'source_unique' },
    carbone: { niveau: 'neutre', texte: 'Bilan proche de la neutralité dans la source consultée.', src: ['me2019'], statut: 'source_unique' },
  },

  // ---------- Géosourcés ----------
  {
    id: 'terre-crue',
    nom: 'Terre crue porteuse',
    famille: 'geosource',
    forme: 'Pisé, bauge, adobe, blocs de terre comprimée',
    roles: ['Porter'],
    chapitre: '/materiaux-biosources/03-les-materiaux-geosources/',
    note: "La terre isole peu mais stocke beaucoup : son intérêt est l'inertie et la régulation de l'humidité (chapitre 4). L'épaisseur calculée sert à comparer.",
    lambda: { min: 1.1, max: 1.1, src: ['thbat', 'ch3'], statut: 'recoupe', note: 'Valeur pour 1 770 à 2 000 kg/m³. Elle varie beaucoup selon la terre et l\'humidité.' },
    masse: { texte: '1 770 à 2 000 kg/m³', src: ['thbat'], statut: 'recoupe' },
    chaleur: { texte: NON_RENSEIGNE, src: ['thbat'], statut: 'non_recoupe' },
    vapeur: { texte: NON_RENSEIGNE, src: ['thbat'], statut: 'non_recoupe' },
    feu: { texte: 'Non classée dans les listes consultées : à justifier par essai.', src: ['ch3'], statut: 'source_unique' },
    assurance: { niveau: 'selon_assureur', texte: "Six guides de bonnes pratiques, hors liste des règles de la C2P. Enduits sur terre crue : règles professionnelles acceptées (2012). Pisé porteur en R+2 : démarche d'ATEx d'après une présentation de 2021.", src: ['ch3', 'ch6'], statut: 'recoupe' },
    carbone: { niveau: 'a_documenter', texte: 'Peu transformée, mais peu de FDES : la donnée par défaut s\'applique. À chiffrer dans la base INIES.', src: ['ch3', 'ch5'], statut: 'recoupe' },
  },
  {
    id: 'pierre-calcaire',
    nom: 'Pierre calcaire ferme',
    famille: 'geosource',
    forme: 'Pierre massive, pierres fermes et demi-fermes',
    roles: ['Porter'],
    chapitre: '/materiaux-biosources/03-les-materiaux-geosources/',
    note: 'Autres classes de calcaire : de 0,85 (très tendre) à 2,3 (extra-dure). Le calcul d\'épaisseur sert à comparer.',
    lambda: { min: 1.4, max: 1.4, src: ['thbat'], statut: 'recoupe', note: 'Conductivité équivalente, joints compris, pour 1 800 à 1 990 kg/m³.' },
    masse: { texte: '1 800 à 1 990 kg/m³', src: ['thbat'], statut: 'recoupe' },
    chaleur: { texte: '1 000 J/(kg·K)', src: ['thbat'], statut: 'recoupe' },
    vapeur: { texte: 'μ de 50 (sec) à 40 (humide)', src: ['thbat'], statut: 'recoupe' },
    feu: { texte: 'A1 (incombustible), sans essai nécessaire', src: ['dec96603'], statut: 'recoupe' },
    assurance: { niveau: 'a_verifier', texte: "Pierre massive : Eurocode 6 et NF DTU 20.1. Pierre sèche : règles professionnelles de la C2P, murs de soutènement et à double parement seulement. Statut assurantiel à confirmer.", src: ['ch3', 'ch6'], statut: 'recoupe' },
    carbone: { niveau: 'a_documenter', texte: 'Dépend beaucoup de la distance à la carrière. À chiffrer avec les FDES.', src: ['ch3'], statut: 'source_unique' },
  },

  // ---------- Références classiques ----------
  {
    id: 'beton-arme',
    nom: 'Béton plein armé',
    famille: 'reference',
    forme: 'Béton de granulats courants, 1 à 2 % d\'acier',
    roles: ['Porter'],
    chapitre: '/materiaux-biosources/05-mesurer-et-reglementer/',
    note: "Le béton porte et stocke la chaleur, il n'isole pas : l'épaisseur calculée sert de point de comparaison.",
    lambda: { min: 2.3, max: 2.3, src: ['thbat'], statut: 'recoupe', note: 'Pour 2 300 à 2 400 kg/m³ avec 1 à 2 % d\'acier ; 2,0 pour un béton plein non armé de 2 300 à 2 600 kg/m³.' },
    masse: { texte: '2 300 à 2 400 kg/m³', src: ['thbat'], statut: 'recoupe' },
    chaleur: { texte: '1 000 J/(kg·K)', src: ['thbat'], statut: 'recoupe' },
    vapeur: { texte: 'μ de 130 (sec) à 80 (humide)', src: ['thbat'], statut: 'recoupe' },
    feu: { texte: 'A1 (incombustible), sans essai nécessaire', src: ['dec96603'], statut: 'recoupe' },
    assurance: { niveau: 'courante', texte: 'Technique traditionnelle (Eurocodes, NF DTU). Repère général, non détaillé ici.', src: [], statut: 'non_recoupe' },
    carbone: { niveau: 'a_documenter', texte: 'Non évalué ici : se calcule avec les FDES de la base INIES.', src: ['ch5'], statut: 'source_unique' },
  },
  {
    id: 'laine-verre',
    nom: 'Laine de verre',
    famille: 'reference',
    forme: 'Rouleaux et panneaux',
    roles: ['Isoler'],
    chapitre: '/materiaux-biosources/02-les-materiaux-biosources/',
    lambda: { min: 0.035, max: 0.042, src: ['me2019', 'thbat'], statut: 'recoupe', note: 'Valeurs par défaut Th-Bât : 0,038 à 0,044 selon la masse volumique.' },
    masse: { texte: '15 à 40 kg/m³', src: ['me2019'], statut: 'source_unique' },
    chaleur: { texte: '840 à 1 030 J/(kg·K)', src: ['me2019', 'thbat'], statut: 'recoupe' },
    vapeur: { texte: 'μ de 1 à 2', src: ['me2019', 'thbat'], statut: 'recoupe' },
    feu: { texte: 'A1 ou A2 selon le produit', src: ['me2019'], statut: 'source_unique' },
    assurance: { niveau: 'courante', texte: 'Norme de produit NF EN 13162. Mise en œuvre : DTU selon l\'ouvrage, non détaillés ici.', src: ['thbat'], statut: 'non_recoupe' },
    carbone: { niveau: 'emet', texte: 'Fabrication énergivore : bilan carbone positif dans la source consultée.', src: ['me2019'], statut: 'source_unique' },
  },
  {
    id: 'pse',
    nom: 'Polystyrène expansé (PSE)',
    famille: 'reference',
    forme: 'Panneaux',
    roles: ['Isoler'],
    chapitre: '/materiaux-biosources/02-les-materiaux-biosources/',
    lambda: { min: 0.032, max: 0.038, src: ['me2019', 'thbat'], statut: 'recoupe', note: 'Valeurs par défaut Th-Bât : 0,038 à 0,056 selon la masse volumique.' },
    masse: { texte: '7 à 30 kg/m³', src: ['me2019'], statut: 'source_unique' },
    chaleur: { texte: '1 450 J/(kg·K)', src: ['me2019', 'thbat'], statut: 'recoupe' },
    vapeur: { texte: 'μ de 20 à 100', src: ['me2019', 'thbat'], statut: 'recoupe' },
    feu: { texte: 'Classe E annoncée', src: ['me2019'], statut: 'source_unique' },
    assurance: { niveau: 'courante', texte: 'Norme de produit NF EN 13163. Mise en œuvre : DTU selon l\'ouvrage, non détaillés ici.', src: ['thbat'], statut: 'non_recoupe' },
    carbone: { niveau: 'emet', texte: 'Dérivé du pétrole : bilan carbone positif dans la source consultée.', src: ['me2019'], statut: 'source_unique' },
  },
];

// Libellés des niveaux, pour l'affichage.
export const LIBELLES_ASSURANCE = {
  courante: 'Technique courante',
  selon_assureur: "Selon l'assureur",
  a_verifier: 'À confirmer',
};

export const LIBELLES_CARBONE = {
  stocke: 'Stocke du carbone',
  neutre: 'Proche de la neutralité',
  emet: 'Émetteur',
  a_documenter: 'À chiffrer avec les FDES',
};

export const LIBELLES_STATUT = {
  recoupe: '',
  source_unique: 'Source unique',
  ecart: 'Sources en désaccord',
  non_recoupe: 'Non recoupé',
};

// Repères de résistance thermique : presse spécialisée (2019, époque RT 2012), pas une exigence de la RE2020.
export const REPERES_R = [
  { valeur: 3.5, libelle: 'Dalle basse' },
  { valeur: 5, libelle: 'Mur' },
  { valeur: 7.5, libelle: 'Toiture' },
];
