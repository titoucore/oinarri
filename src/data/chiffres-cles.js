// Chiffres clés d'Oinarri : une seule source de vérité pour les valeurs qui changent ou qu'on cite souvent.
//
// Cette liste alimente la page /chiffres-cles/ (filtres, avertissements de fraîcheur, export CSV).
// Les chapitres restent rédigés à la main : en cas de changement, on met à jour ce fichier
// ET le chapitre (le champ « chapitres » indique où le chiffre apparaît).
//
// Champs d'un chiffre :
//   id            identifiant stable
//   theme         un des thèmes de THEMES
//   libelle       ce que mesure le chiffre
//   valeur        la valeur telle qu'on la lit (texte)
//   unite         unité éventuelle (facultatif)
//   contexte      une phrase de précision (date d'application, exceptions)
//   statut        'en-vigueur', 'projet' ou 'repere' (ordre de grandeur, pratique)
//   volatilite    'semestriel', 'annuel', 'reglementation', 'projet' ou 'stable' :
//                 elle fixe le délai (VALIDITE_JOURS) au-delà duquel on affiche « à revérifier »
//   verifie_le    date de la dernière vérification (AAAA-MM-JJ)
//   fiabilite     'confirme' (source officielle ou sources concordantes) ou 'a-confirmer'
//                 (source unique ou texte non relu)
//   sources       clés de SOURCES_CHIFFRES
//   chapitres     identifiants des chapitres concernés (ex. 'ba-ba/09-l-acoustique')

export const THEMES = [
  'Financement du logement social',
  'Loyers et conventions',
  'Occupants et organismes',
  'Production et gestion du parc',
  'Carbone et RE2020',
  'Marchés publics',
  'Thermique et énergie',
  'Acoustique',
  'Bâtiment passif',
  'Incendie',
  'Accessibilité',
];

// Délai de validité, en jours, avant l'avertissement « à revérifier ».
export const VALIDITE_JOURS = {
  semestriel: 45,
  annuel: 150,
  reglementation: 90,
  projet: 30,
  stable: 365,
};

export const LIBELLES_STATUT = {
  'en-vigueur': 'En vigueur',
  projet: 'Projet',
  repere: 'Repère',
};

export const LIBELLES_NIVEAU = {
  officielle: 'Source officielle',
  professionnelle: 'Source professionnelle',
  pedagogique: 'Document pédagogique',
  secondaire: 'Source secondaire',
  chapitre: 'Chapitre du cours',
};

export const SOURCES_CHIFFRES = {
  'infogouv-livret': {
    libelle: 'info.gouv.fr, taux du Livret A au 1er août 2026',
    url: 'https://www.info.gouv.fr/public/index.php/actualite/augmentation-du-taux-du-livret-a-a-compter-du-1er-aout-2026',
    niveau: 'officielle',
  },
  'bdt-livret': {
    libelle: 'Banque des Territoires, Livret A à 1,7 %',
    url: 'https://www.banquedesterritoires.fr/evolution-taux-livretA',
    niveau: 'officielle',
  },
  'bdt-pls': {
    libelle: 'Banque des Territoires, prêt locatif social',
    url: 'https://www.banquedesterritoires.fr/pret-pls',
    niveau: 'officielle',
  },
  'bdt-plus': {
    libelle: 'Banque des Territoires, fiche du prêt PLUS',
    url: 'https://banquedesterritoires.fr/sites/default/files/prets/plus.pdf',
    niveau: 'officielle',
  },
  'unafo-lf2026': {
    libelle: 'Unafo, loi de finances n° 2026-103 du 19 février 2026',
    url: 'https://www.unafo.org/centre-de-ressources/loi-de-finances-n2026-103-du-19-fevrier-2026/',
    niveau: 'professionnelle',
  },
  'hlm-plf2027': {
    libelle: 'Fédération des coopératives HLM, projet de loi de finances pour 2027',
    url: 'https://www.hlm.coop/actualites/all/21771',
    niveau: 'professionnelle',
  },
  'ministere-aides': {
    libelle: 'Ministère de la Transition écologique, Les aides financières au logement (avril 2025)',
    niveau: 'officielle',
  },
  'cgi-278': {
    libelle: 'Code général des impôts, article 278 sexies, et BOFiP',
    niveau: 'officielle',
  },
  'avis-loyers-2026': {
    libelle: 'Avis relatif à la fixation des loyers maximums des conventions APL, opérations conventionnées en 2026',
    niveau: 'officielle',
  },
  'service-public-rls': {
    libelle: 'Service-Public, réduction de loyer de solidarité : les montants changent le 1er juin',
    url: 'https://www.service-public.gouv.fr/particuliers/actualites/A15236',
    niveau: 'officielle',
  },
  'anil-rls': {
    libelle: 'ANIL, réduction de loyer de solidarité et APL',
    url: 'https://www.anil.org/aj-reduction-loyer-solidarite-rls-apl/',
    niveau: 'officielle',
  },
  'ffb-seuils': {
    libelle: 'FFB, marchés de travaux : un des seuils a changé',
    url: 'https://www.ffbatiment.fr/actualites-batiment/actualite-ba/marches-travaux-changement-seuils',
    niveau: 'professionnelle',
  },
  'capeb-seuils': {
    libelle: 'CAPEB, marchés publics 2026 : nouveaux seuils',
    url: 'https://www.capeb.fr/actualites/marches-publics-2026-nouveaux-seuils-et-simplification-pour-les-marches-de-travaux',
    niveau: 'professionnelle',
  },
  'mdc85': {
    libelle: 'Maison des Communes de la Vendée, modification des seuils',
    url: 'https://www.maisondescommunes85.fr/actualites/modification-seuils-commande-publique',
    niveau: 'professionnelle',
  },
  landot: {
    libelle: 'Landot & associés, loi de simplification de la vie économique',
    url: 'https://blog.landot-avocats.net/2026/05/27/commande-publique-la-loi-de-simplification-de-la-vie-economique-est-publiee/',
    niveau: 'professionnelle',
  },
  'ffb-re2020-ajustements': {
    libelle: 'FFB, RE2020 : une première série d\'ajustements',
    url: 'https://www.ffbatiment.fr/actualites-batiment/actualite/re2020-premiere-serie-ajustements-suite-rapport-rivaton',
    niveau: 'professionnelle',
  },
  'projet-celsius': {
    libelle: 'Projet Celsius, RE2020 seuil 2028',
    url: 'https://projetcelsius.com/blog/re2020-seuil-2028/',
    niveau: 'professionnelle',
  },
  synasav: {
    libelle: 'Synasav, le gaz écarté des systèmes de chauffage neufs dès 2027',
    url: 'https://synasav.fr/actualites-synasav/detail/construction-neuve-le-gaz-ecarte-des-systemes-de-chauffage-des-2027-sauf-exceptions',
    niveau: 'professionnelle',
  },
  thbat: {
    libelle: 'Règles Th-Bât, fascicule « Matériaux »',
    url: 'https://rt-re-batiment.developpement-durable.gouv.fr/IMG/pdf/2-fascicule_materiaux.pdf',
    niveau: 'officielle',
  },
  drieat: {
    libelle: 'DRIEAT Île-de-France, présentation de la RE2020',
    url: 'https://www.drieat.ile-de-france.developpement-durable.gouv.fr/IMG/pdf/drieat_francois_bourgeois.pdf',
    niveau: 'officielle',
  },
  isere: {
    libelle: 'Préfecture de l\'Isère, présentation de la RE2020',
    url: 'https://www.isere.gouv.fr/index.php/contenu/telechargement/69474/553758/file/Presentation%20RE%202020.pdf',
    niveau: 'officielle',
  },
  'construires-q4': {
    libelle: 'Construires, test d\'infiltrométrie',
    url: 'https://www.construires.fr/reglementation-thermique/rt-infiltrometrie/',
    niveau: 'secondaire',
  },
  'ac-reunion': {
    libelle: 'Académie de La Réunion, support de thermique (règles Th-Bât)',
    url: 'https://etab.ac-reunion.fr/wp-content/uploads/sites/114/2015/10/Thermique-STI2DAC.pdf',
    niveau: 'pedagogique',
  },
  'legifrance-nra': {
    libelle: 'Légifrance, arrêté du 30 juin 1999 relatif aux caractéristiques acoustiques',
    url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000211449',
    niveau: 'officielle',
  },
  'ffb-acoustique': {
    libelle: 'FFB, exigences acoustiques pour les maisons neuves',
    url: 'https://www.ffbatiment.fr/techniques-batiment/reglementation-construction/reglementation-acoustique/dossier/exigences-acoustiques-maisons-neuves',
    niveau: 'professionnelle',
  },
  ineris: {
    libelle: 'Ineris, réglementation acoustique dans les bâtiments d\'habitation',
    url: 'https://aida.ineris.fr/node/38596/printable/pdf',
    niveau: 'officielle',
  },
  'ecologie-acoustique': {
    libelle: 'Ministère de la Transition écologique, acoustique et bâtiment',
    url: 'https://www.ecologie.gouv.fr/politiques-publiques/acoustique-batiment',
    niveau: 'officielle',
  },
  'xpair-acoustique': {
    libelle: 'Xpair, notions théoriques d\'acoustique',
    url: 'https://conseils.xpair.com/consulter_savoir_faire/acoustique-aeraulique/notions-theoriques-acoustique.htm',
    niveau: 'professionnelle',
  },
  'xpair-passif': {
    libelle: 'Xpair, le bâtiment passif, sans chauffage ou presque',
    url: 'https://conseils.xpair.com/actualite_experts/batiment-passif-sans-chauffage.htm',
    niveau: 'professionnelle',
  },
  'maison-passive': {
    libelle: 'La Maison Passive, présentation « La démarche passive »',
    url: 'https://dev24.novabuild.fr/wp-content/uploads/2023/12/2.la_demarche_passive_novabuild.pdf',
    niveau: 'professionnelle',
  },
  'ademe-puits': {
    libelle: 'ADEME, avis sur les puits climatiques (juillet 2012)',
    url: 'https://www.envirobat-oc.fr/IMG/pdf/99695362-avis-de-l-ademe-sur-les-puits-climatiques.pdf',
    niveau: 'officielle',
  },
  'eduscol-incendie': {
    libelle: 'Éducation nationale, sujet d\'examen citant l\'arrêté du 31 janvier 1986',
    url: 'https://bnseep.eduscol.education.fr/ressources/examens/sujets/12/320/2301000/_3202301012-U51-2an1.pdf',
    niveau: 'pedagogique',
  },
  'sdis-ndo23': {
    libelle: 'SDIS, NDO 23 : feux d\'immeubles d\'habitation de 3e et 4e familles',
    url: 'https://enasis.fr/pluginfile.php/47271/mod_resource/content/2/NDO%2023%20-%20Feux%20dimmeubles%20dhabitation%203%C3%A8me%20et%204%C3%A8me%20famille.pdf',
    niveau: 'professionnelle',
  },
  'ffb-isolement': {
    libelle: 'FFB, isolement contre l\'incendie dans les immeubles d\'habitation',
    url: 'https://www.ffbatiment.fr/techniques-batiment/reglementation-construction/reglementation-securite-incendie/dossier-bam/isolement-contre-l-incendie-dans-les-immeubles-d-habitation',
    niveau: 'professionnelle',
  },
  'capeb-isolants': {
    libelle: 'CAPEB, protection au feu des isolants (avril 2024)',
    url: 'https://capeb.fr/www/capeb/media/image/dossier-pratique-protection-des-isolants-avril-2024-v2-1-.pdf',
    niveau: 'professionnelle',
  },
  'legifrance-cch162': {
    libelle: 'Légifrance, code de la construction et de l\'habitation, R. 162-1 à R. 162-15',
    url: 'https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006074096/LEGISCTA000043819249/',
    niveau: 'officielle',
  },
  'actu-juridique': {
    libelle: 'Actu-Juridique, l\'accessibilité des habitations est précisée',
    url: 'https://www.actu-juridique.fr/civil/immobilier/laccessibilite-des-habitations-est-precisee/',
    niveau: 'professionnelle',
  },
  'ch-ls03': {
    libelle: 'Chapitre « Les financements aidés »',
    url: '/logement-social/03-les-financements-aides/',
    niveau: 'chapitre',
  },
  'ch-ls04': {
    libelle: 'Chapitre « Le loyer et le conventionnement »',
    url: '/logement-social/04-le-loyer-et-le-conventionnement/',
    niveau: 'chapitre',
  },
  'ch-bio05': {
    libelle: 'Chapitre « Mesurer et réglementer » (sources citées dans le chapitre)',
    url: '/materiaux-biosources/05-mesurer-et-reglementer/',
    niveau: 'chapitre',
  },
  'ush-chiffres': {
    libelle: "USH, Les chiffres clés du logement social (éditions 2023 et 2024)",
    niveau: 'professionnelle',
  },
  'anil-plafonds': {
    libelle: 'ANIL, plafonds de ressources 2026 du logement social',
    niveau: 'officielle',
  },
  'ministere-dpe': {
    libelle: 'Ministère chargé du logement, réponse du 26 février 2026 sur le calendrier du DPE',
    niveau: 'officielle',
  },
  anru: {
    libelle: 'ANRU, bilan du PNRU et programme NPNRU',
    niveau: 'officielle',
  },
  'ch-ls02': {
    libelle: 'Chapitre « Les organismes HLM »',
    url: '/logement-social/02-les-organismes-hlm/',
    niveau: 'chapitre',
  },
  'ch-ls05': {
    libelle: 'Chapitre « Les occupants » (articles du CCH cités dans le chapitre)',
    url: '/logement-social/05-les-occupants/',
    niveau: 'chapitre',
  },
  'ch-ls07': {
    libelle: 'Chapitre « Produire du logement social » (article L433-2 du CCH)',
    url: '/logement-social/07-produire-du-logement-social/',
    niveau: 'chapitre',
  },
  'ch-ls09': {
    libelle: 'Chapitre « Gérer et entretenir le parc » (sources fiscales citées dans le chapitre)',
    url: '/logement-social/09-gerer-et-entretenir-le-parc/',
    niveau: 'chapitre',
  },
  'ch-ba07': {
    libelle: 'Chapitre « Les marchés et les appels d\'offres » (sources citées dans le chapitre)',
    url: '/ba-ba/07-marches-et-appels-d-offres/',
    niveau: 'chapitre',
  },
};

// Fabrique un chiffre avec des valeurs par défaut.
function c(id, theme, libelle, valeur, contexte, options) {
  return {
    id,
    theme,
    libelle,
    valeur,
    contexte,
    statut: 'en-vigueur',
    volatilite: 'reglementation',
    verifie_le: '2026-10-11',
    fiabilite: 'confirme',
    ...options,
  };
}

const LS03 = 'logement-social/03-les-financements-aides';
const LS04 = 'logement-social/04-le-loyer-et-le-conventionnement';
const BIO05 = 'materiaux-biosources/05-mesurer-et-reglementer';
const BA07 = 'ba-ba/07-marches-et-appels-d-offres';
const BA08 = 'ba-ba/08-l-enveloppe-et-la-thermique';
const BA09 = 'ba-ba/09-l-acoustique';
const BA10 = 'ba-ba/10-le-batiment-passif-et-le-puits-canadien';
const BA11 = 'ba-ba/11-la-securite-incendie';
const BA12 = 'ba-ba/12-l-accessibilite';

const FIN = 'Financement du logement social';
const LOY = 'Loyers et conventions';
const CAR = 'Carbone et RE2020';
const MAR = 'Marchés publics';
const THE = 'Thermique et énergie';
const ACO = 'Acoustique';
const PAS = 'Bâtiment passif';
const INC = 'Incendie';
const ACC = 'Accessibilité';

export const CHIFFRES = [
  // ---------- Financement du logement social (chapitre 3) ----------
  c('livret-a', FIN, 'Taux du Livret A', '1,7 %', "Depuis le 1er août 2026, pour la période d'août 2026 à janvier 2027. Révisé le 1er février et le 1er août.", { volatilite: 'semestriel', sources: ['infogouv-livret', 'bdt-livret'], chapitres: [LS03] }),
  c('taux-plai', FIN, 'Taux du prêt PLAI', '1,50 % (Livret A moins 0,20 %)', 'Calculé avec le Livret A à 1,7 %.', { volatilite: 'semestriel', sources: ['bdt-plus', 'infogouv-livret'], chapitres: [LS03] }),
  c('taux-plus', FIN, 'Taux du prêt PLUS', '2,30 % (Livret A plus 0,60 %)', 'Calculé avec le Livret A à 1,7 %.', { volatilite: 'semestriel', sources: ['bdt-plus', 'infogouv-livret'], chapitres: [LS03] }),
  c('taux-pls', FIN, 'Taux du prêt PLS', '2,81 % (Livret A plus 1,11 %)', 'Calculé avec le Livret A à 1,7 %. Pas de primo-fixe ni d\'indexation sur l\'inflation.', { volatilite: 'semestriel', sources: ['bdt-pls', 'infogouv-livret'], chapitres: [LS03] }),
  c('duree-prets', FIN, 'Durée des prêts de la Banque des Territoires', '40 ans pour le bâti, 50 ans pour le foncier', "Jusqu'à 80 ans selon les cas.", { volatilite: 'stable', verifie_le: '2026-10-03', sources: ['bdt-plus', 'bdt-pls'], chapitres: [LS03] }),
  c('tva-logement-social', FIN, 'TVA du logement social neuf', '5,5 % (PLAI) ; 10 % (PLUS et PLS)', 'Le PLUS passe à 5,5 % dans le renouvellement urbain (article 278 sexies du CGI).', { verifie_le: '2026-10-03', sources: ['cgi-278'], chapitres: [LS03] }),
  c('pls-part', FIN, 'Part du prêt PLS dans le prix de revient', 'Au moins 50 %', 'Un prêt complémentaire (CPLS) peut le compléter, sur 40 ans au plus.', { sources: ['bdt-pls'], chapitres: [LS03] }),
  c('plafonds-pls', FIN, 'Plafonds de ressources du PLS', 'Ceux du PLUS majorés de 30 %', undefined, { volatilite: 'annuel', verifie_le: '2026-10-03', fiabilite: 'a-confirmer', sources: ['ch-ls03'], chapitres: [LS03, LS05] }),
  c('tfpb-longue-duree', FIN, 'Exonération de taxe foncière (logements sociaux neufs)', '15 ans ; 25 ans si la décision de financement est prise avant le 31 décembre 2026', "20 ans avec une performance énergétique et environnementale supérieure ; 30 ans en cumulant les deux (article 1384 A du CGI). La loi de finances pour 2026 n'a pas prorogé la date du 31 décembre 2026.", { sources: ['unafo-lf2026'], chapitres: [LS03] }),
  c('tfpb-plf2027', FIN, 'Prorogation de l\'exonération de 25 ans', "Jusqu'à fin 2030 (proposition)", "Article 8 du projet de loi de finances pour 2027, présenté le 1er octobre 2026. Ce n'est qu'un projet : il n'est pas voté.", { statut: 'projet', volatilite: 'projet', fiabilite: 'a-confirmer', sources: ['hlm-plf2027'], chapitres: [LS03] }),
  c('action-logement', FIN, 'Prêts Action Logement (PLAI et PLUS)', '40 ans au plus, différé de 4 ans', undefined, { volatilite: 'annuel', verifie_le: '2026-10-03', sources: ['ministere-aides'], chapitres: [LS03] }),

  // ---------- Loyers et conventions (chapitre 4) ----------
  c('loyers-zone-plai', LOY, 'Loyer maximal de zone, PLAI', 'Zone I bis : 7,00 ; zone I : 6,57 ; zone II : 5,77 ; zone III : 5,33', 'Euros par mètre carré de surface utile et par mois, avis des loyers 2026.', { unite: '€/m²/mois', volatilite: 'annuel', verifie_le: '2026-10-03', sources: ['avis-loyers-2026'], chapitres: [LS04] }),
  c('loyers-zone-plus', LOY, 'Loyer maximal de zone, PLUS', 'Zone I bis : 7,85 ; zone I : 7,40 ; zone II : 6,49 ; zone III : 6,01', 'Euros par mètre carré de surface utile et par mois, avis des loyers 2026.', { unite: '€/m²/mois', volatilite: 'annuel', verifie_le: '2026-10-03', sources: ['avis-loyers-2026'], chapitres: [LS04] }),
  c('loyers-zone-pls', LOY, 'Loyer maximal de zone, PLS', 'Zone A bis : 15,32 ; A : 11,80 ; B1 : 10,17 ; B2 : 9,74 ; C : 9,03', 'Euros par mètre carré de surface utile et par mois, avis des loyers 2026.', { unite: '€/m²/mois', volatilite: 'annuel', verifie_le: '2026-10-03', sources: ['avis-loyers-2026'], chapitres: [LS04] }),
  c('coefficient-structure', LOY, 'Coefficient de structure', '0,77 × (1 + N × 20 m² ÷ surface utile totale)', 'N est le nombre de logements de l\'opération (article D353-16 du CGI).', { statut: 'en-vigueur', volatilite: 'stable', verifie_le: '2026-10-03', sources: ['ch-ls04'], chapitres: [LS04] }),
  c('marge-locale', LOY, 'Marge locale sur le loyer', '15 % au plus (PLUS et PLAI) ; aucune en PLS neuf', undefined, { volatilite: 'annuel', verifie_le: '2026-10-03', sources: ['avis-loyers-2026'], chapitres: [LS04] }),
  c('plafonnement-loyer', LOY, 'Plafonnement du produit locatif maximum', '18 % de plus qu\'un loyer sans marge ni annexe (25 % si l\'ascenseur n\'est pas obligatoire)', undefined, { volatilite: 'annuel', verifie_le: '2026-10-03', sources: ['avis-loyers-2026'], chapitres: [LS04] }),
  c('convention-duree', LOY, 'Durée minimale d\'une convention APL', '9 ans', 'Elle dure autant que le prêt qui a financé le logement, puis se renouvelle par tacite reconduction.', { volatilite: 'stable', verifie_le: '2026-10-03', sources: ['ch-ls04'], chapitres: [LS04] }),
  c('irl-2026', LOY, 'Révision des loyers conventionnés au 1er janvier 2026', '1,04 %', 'D\'après l\'indice de référence des loyers du deuxième trimestre de l\'année précédente.', { volatilite: 'annuel', verifie_le: '2026-10-03', sources: ['avis-loyers-2026'], chapitres: [LS04] }),
  c('rls-montants', LOY, 'Réduction de loyer de solidarité, personne seule', '35,99 € (zones 1 et 1 bis) ; 31,58 € (zone 2) ; 29,57 € (zone 3)', 'Par mois, depuis le 1er juin 2026 (arrêté du 22 mai 2026).', { unite: '€/mois', volatilite: 'annuel', sources: ['service-public-rls'], chapitres: [LS04] }),
  c('rls-apl', LOY, 'Baisse de l\'APL liée à la RLS', '98 % de la RLS', 'Le reste à charge du locataire change peu ; le bailleur supporte la baisse de recettes.', { volatilite: 'stable', sources: ['anil-rls'], chapitres: [LS04] }),

  // ---------- Carbone et RE2020 (chapitre 5 du biosourcé) ----------
  c('ic-collectif', CAR, 'Ic construction maximal moyen, logement collectif', '740 (2022) ; 650 (2025) ; 580 (2028) ; 490 (2031)', 'Moyennes avant modulations. Le palier de 2028 est maintenu pour les logements d\'après un site professionnel (28 septembre 2026).', { unite: 'kg CO₂e/m²', verifie_le: '2026-10-04', sources: ['ch-bio05', 'projet-celsius'], chapitres: [BIO05] }),
  c('ic-maison', CAR, 'Ic construction maximal moyen, maison individuelle', '640 (2022) ; 530 (2025) ; 475 (2028) ; 415 (2031)', 'Moyennes avant modulations.', { unite: 'kg CO₂e/m²', verifie_le: '2026-10-04', sources: ['ch-bio05', 'projet-celsius'], chapitres: [BIO05] }),
  c('duree-conventionnelle', CAR, 'Durée de vie conventionnelle d\'un bâtiment (analyse du cycle de vie)', '50 ans', undefined, { volatilite: 'stable', verifie_le: '2026-10-04', sources: ['ch-bio05'], chapitres: [BIO05] }),
  c('decret-2026-200', CAR, 'Modulations de l\'Ic construction : espaces extérieurs', 'Au-delà de 10 % de la surface de référence, plafonné à 25 %', 'Décret n° 2026-200 et arrêté du 18 mars 2026, pour les permis déposés à partir du 1er juillet 2026. S\'y ajoutent une modulation pour la hauteur sous plafond et des assouplissements pour les IGH et les surélévations.', { sources: ['ffb-re2020-ajustements'], chapitres: [BIO05] }),
  c('decret-2026-863', CAR, 'Plafond d\'émissions des équipements de chauffage, refroidissement et eau chaude (bâtiments neufs)', '79 gCO₂e/kWh d\'énergie finale', 'Décret n° 2026-863 du 12 septembre 2026. Pour les logements : permis et déclarations préalables déposés à partir du 1er janvier 2027. En pratique, il écarte le gaz. Texte non relu sur Légifrance ; le sort des appoints varie selon les sources.', { fiabilite: 'a-confirmer', sources: ['synasav'], chapitres: [BIO05] }),

  // ---------- Marchés publics (chapitre 7 du B.A.-BA) ----------
  c('seuil-dispense-travaux', MAR, 'Seuil de dispense de procédure pour les travaux', '100 000 € HT', 'Pérennisé par le décret n° 2025-1386 du 29 décembre 2025, puis consacré par la loi n° 2026-403 du 26 mai 2026.', { unite: '€ HT', sources: ['ffb-seuils', 'capeb-seuils', 'mdc85'], chapitres: [BA07] }),
  c('seuil-europeen-travaux', MAR, 'Seuil européen des marchés de travaux', '5 404 000 € HT', 'Valable pour 2026-2027, révisé tous les deux ans.', { unite: '€ HT', volatilite: 'annuel', sources: ['ffb-seuils', 'capeb-seuils'], chapitres: [BA07] }),
  c('loi-2026-403', MAR, 'Dispense pour les marchés innovants', 'Depuis le 1er juillet 2026 (1er janvier 2027 pour les travaux)', 'Loi n° 2026-403 du 26 mai 2026. Variantes autorisées par défaut en procédure adaptée ; lots réservables aux jeunes entreprises innovantes jusqu\'à 15 %.', { fiabilite: 'a-confirmer', sources: ['landot'], chapitres: [BA07] }),
  c('retenue-garantie', MAR, 'Retenue de garantie', '5 % au plus du montant du marché', undefined, { volatilite: 'stable', verifie_le: '2026-10-03', fiabilite: 'a-confirmer', sources: ['ch-ba07'], chapitres: [BA07] }),
  c('delai-paiement', MAR, 'Délai de paiement des marchés publics', '30 jours', undefined, { volatilite: 'stable', verifie_le: '2026-10-03', fiabilite: 'a-confirmer', sources: ['ch-ba07'], chapitres: [BA07] }),

  // ---------- Thermique et énergie (chapitre 8) ----------
  c('resistances-superficielles', THE, 'Résistances superficielles Rsi et Rse', 'Mur : 0,13 et 0,04 ; toiture : 0,10 et 0,04 ; plancher bas : 0,17 et 0,04', 'En m²·K/W, d\'après les règles Th-Bât relayées par des supports pédagogiques.', { unite: 'm²·K/W', volatilite: 'stable', fiabilite: 'a-confirmer', sources: ['ac-reunion'], chapitres: [BA08] }),
  c('formule-u', THE, 'Coefficient de transmission thermique U', '1 ÷ (Rsi + somme des R + Rse)', 'En W/(m²·K). Plus U est faible, mieux la paroi isole.', { statut: 'en-vigueur', volatilite: 'stable', sources: ['ac-reunion'], chapitres: [BA08] }),
  c('bbio-formule', THE, 'Calcul du Bbio', '2 × (chauffage + refroidissement) + 5 × éclairage', 'En points.', { volatilite: 'stable', sources: ['drieat'], chapitres: [BA08] }),
  c('bbio-max', THE, 'Bbio max moyen', '63 points (maisons) ; 65 points (logements collectifs)', 'Avant modulations (décret du 29 juillet 2021). Leur effet éventuel depuis le décret du 18 mars 2026 n\'a pas été vérifié.', { unite: 'points', sources: ['drieat', 'isere'], chapitres: [BA08] }),
  c('q4pa-surf', THE, 'Étanchéité à l\'air, Q4Pa-surf maximal', '0,6 (maison) ; 1,0 (logement collectif)', 'En m³/(h·m²). Test obligatoire en fin de chantier d\'après des sources professionnelles ; l\'arrêté n\'a pas été relu.', { unite: 'm³/(h·m²)', fiabilite: 'a-confirmer', sources: ['construires-q4'], chapitres: [BA08] }),
  c('coefficient-fr', THE, 'Coefficient FR de la valeur utile de λ', '1 (marquage CE système 1+) ; 1,15 (autres systèmes)', 'λ utile = λ déclaré × FT × Fm × FR.', { volatilite: 'stable', sources: ['thbat'], chapitres: [BA08] }),

  // ---------- Acoustique (chapitre 9) ----------
  c('dnta-logements', ACO, 'Isolement aux bruits aériens entre logements', 'DnT,A ≥ 53 dB', 'Arrêté du 30 juin 1999, permis de construire déposés depuis le 1er janvier 2000.', { unite: 'dB', sources: ['legifrance-nra', 'ineris'], chapitres: [BA09] }),
  c('lntw', ACO, 'Niveau de bruit de choc dans les pièces principales', 'L\'nT,w ≤ 58 dB', undefined, { unite: 'dB', sources: ['ffb-acoustique'], chapitres: [BA09] }),
  c('bruit-ventilation', ACO, 'Bruit de la ventilation, au débit minimal', '≤ 30 dB(A) en pièces principales ; ≤ 35 dB(A) en cuisine', undefined, { unite: 'dB(A)', sources: ['legifrance-nra', 'ffb-acoustique'], chapitres: [BA09] }),
  c('bruit-chauffage', ACO, 'Bruit du chauffage ou de la climatisation individuels', '≤ 35 dB(A) en pièces principales ; ≤ 50 dB(A) en cuisine', undefined, { unite: 'dB(A)', fiabilite: 'a-confirmer', sources: ['ffb-acoustique'], chapitres: [BA09] }),
  c('dnta-tr', ACO, 'Isolement contre le bruit extérieur', 'DnT,A,tr ≥ 30 dB', 'Davantage dans les secteurs classés bruyants.', { unite: 'dB', sources: ['ineris'], chapitres: [BA09] }),
  c('attestation-acoustique', ACO, 'Attestation acoustique à l\'achèvement', 'Permis déposés depuis le 1er janvier 2013 ; mesures sur site pour 10 logements ou plus', 'Décret du 30 mai 2011 et arrêté du 27 novembre 2012.', { sources: ['ecologie-acoustique'], chapitres: [BA09] }),
  c('somme-db', ACO, 'Addition de décibels', 'Deux sources identiques : + 3 dB ; écart de 10 dB : bruit perçu deux fois plus fort', undefined, { statut: 'repere', volatilite: 'stable', sources: ['xpair-acoustique'], chapitres: [BA09] }),

  // ---------- Bâtiment passif (chapitre 10) ----------
  c('passif-chauffage', PAS, 'Passivhaus : besoin de chauffage', '≤ 15 kWh/(m²·an) ou ≤ 10 W/m²', undefined, { unite: 'kWh/(m²·an)', statut: 'repere', volatilite: 'stable', fiabilite: 'a-confirmer', sources: ['xpair-passif', 'maison-passive'], chapitres: [BA10] }),
  c('passif-froid', PAS, 'Passivhaus : besoin de rafraîchissement', '≤ 15 kWh/(m²·an)', undefined, { unite: 'kWh/(m²·an)', statut: 'repere', volatilite: 'stable', fiabilite: 'a-confirmer', sources: ['xpair-passif', 'maison-passive'], chapitres: [BA10] }),
  c('passif-energie-primaire', PAS, 'Passivhaus : énergie primaire, tous usages', '≤ 120 kWh/(m²·an)', 'Les niveaux Plus et Premium ont d\'autres seuils, non détaillés.', { unite: 'kWh/(m²·an)', statut: 'repere', volatilite: 'stable', fiabilite: 'a-confirmer', sources: ['xpair-passif', 'maison-passive'], chapitres: [BA10] }),
  c('passif-n50', PAS, 'Passivhaus : étanchéité à l\'air', 'n50 ≤ 0,6 renouvellement par heure', 'Le n50 n\'est pas comparable au Q4Pa-surf de la réglementation.', { unite: 'h⁻¹', statut: 'repere', volatilite: 'stable', fiabilite: 'a-confirmer', sources: ['xpair-passif', 'maison-passive'], chapitres: [BA10, BA08] }),
  c('passif-surchauffe', PAS, 'Passivhaus : surchauffe', '≤ 10 % du temps au-dessus de 25 °C', undefined, { statut: 'repere', volatilite: 'stable', fiabilite: 'a-confirmer', sources: ['xpair-passif', 'maison-passive'], chapitres: [BA10] }),
  c('double-flux-rendement', PAS, 'Récupération de chaleur de la double flux', '≥ 75 % (bâtiment passif) ; environ 85 % cités par l\'ADEME', undefined, { unite: '%', statut: 'repere', volatilite: 'stable', fiabilite: 'a-confirmer', sources: ['maison-passive', 'ademe-puits'], chapitres: [BA10] }),
  c('puits-canadien', PAS, 'Puits canadien : repères de conception', 'Prise d\'air à 1,20 m ; pente de 2 % vers un point bas', 'Fiche de l\'ADEME de 2012 : à revérifier avant de se prononcer sur un projet.', { statut: 'repere', volatilite: 'stable', fiabilite: 'a-confirmer', sources: ['ademe-puits'], chapitres: [BA10] }),

  // ---------- Incendie (chapitre 11) ----------
  c('stabilite-au-feu', INC, 'Stabilité au feu de la structure, par famille', '15 min (1re) ; 30 min (2e) ; 1 h (3e) ; 1 h 30 (4e)', 'Les planchers suivent les mêmes durées en coupe-feu.', { sources: ['eduscol-incendie', 'sdis-ndo23'], chapitres: [BA11] }),
  c('familles-hauteur', INC, 'Familles d\'habitation collective, par hauteur', '2e : jusqu\'à R+3 ; 3e : jusqu\'à 28 m ; 4e : de 28 à 50 m ; au-delà de 50 m : IGH', 'Hauteur du plancher bas du logement le plus haut, depuis le sol accessible aux engins.', { sources: ['capeb-isolants', 'sdis-ndo23'], chapitres: [BA11] }),
  c('parois-entre-logements', INC, 'Parois entre logements (collectifs)', 'Coupe-feu 1/2 h (2e et 3e familles) ; 1 h (4e famille)', undefined, { sources: ['ffb-isolement'], chapitres: [BA11] }),
  c('portes-palieres', INC, 'Portes palières', 'Pare-flammes 1/4 h (2e et 3e familles) ; 1/2 h (4e famille)', undefined, { sources: ['ffb-isolement'], chapitres: [BA11] }),
  c('facades-isolants-2020', INC, 'Façades et isolants combustibles', 'Arrêté du 7 août 2019, permis déposés depuis le 1er janvier 2020', 'Écran thermique pour les isolants combustibles ; texte consolidé de l\'arrêté de 1986 mis à jour au 3 août 2026.', { fiabilite: 'a-confirmer', sources: ['capeb-isolants'], chapitres: [BA11] }),

  // ---------- Accessibilité (chapitre 12) ----------
  c('ascenseur-obligatoire', ACC, 'Ascenseur obligatoire (habitation collective neuve)', 'Plus de deux étages au-dessus ou au-dessous du rez-de-chaussée (R+3)', 'Depuis le 1er octobre 2019 ; le seuil était R+4 auparavant.', { sources: ['actu-juridique', 'legifrance-cch162'], chapitres: [BA12] }),
  c('quota-accessibles', ACC, 'Logements accessibles et évolutifs', '20 % au moins de logements accessibles, et au moins un ; les autres évolutifs', 'Pour les logements du rez-de-chaussée ou des étages desservis par un ascenseur. La méthode d\'arrondi n\'est pas détaillée.', { sources: ['legifrance-cch162', 'actu-juridique'], chapitres: [BA12] }),
  c('articles-accessibilite', ACC, 'Numérotation des articles (bâtiments neufs)', 'R. 162-1 à R. 162-15 du CCH', 'Anciens articles R. 111-18 et suivants.', { volatilite: 'stable', sources: ['legifrance-cch162'], chapitres: [BA12] }),
];
