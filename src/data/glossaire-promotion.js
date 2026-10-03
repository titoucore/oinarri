// Glossaire du parcours « Promotion immobilière ».
// Même format que glossaire.js (voir les champs décrits en tête de ce fichier).
// Ce fichier est fusionné avec les autres par glossaire.js : on n'y touche pas pour ajouter
// un terme d'un autre parcours.

export const termes = [
  {
    terme: 'Promoteur immobilier',
    categorie: 'Promotion',
    definition:
      "Au sens juridique, la personne liée à un maître d'ouvrage par un contrat de promotion immobilière : elle s'engage à faire réaliser un programme de construction. Au sens courant, celui qui construit pour vendre.",
    aussi: ['Promoteur', 'Promotion immobilière'],
  },
  {
    terme: 'Contrat de promotion immobilière',
    categorie: 'Promotion',
    definition:
      "Mandat d'intérêt commun défini à l'article 1831-1 du Code civil : le promoteur s'engage envers le maître d'ouvrage à faire réaliser un programme de construction pour un prix convenu et à accomplir pour lui des opérations juridiques, administratives et financières. Il est établi par écrit.",
    aussi: ['CPI', 'Contrat de promotion'],
  },
  {
    terme: "Mandat d'intérêt commun",
    categorie: 'Juridique',
    definition:
      "Contrat par lequel une personne agit au nom d'une autre, dans un intérêt qui profite aux deux. C'est la nature juridique du contrat de promotion immobilière.",
  },
  {
    terme: "Maîtrise d'ouvrage déléguée",
    categorie: 'Juridique',
    definition:
      "Contrat par lequel le maître d'ouvrage confie à un mandataire une partie de ses attributions. À la différence du contrat de promotion immobilière, il ne comporte pas, en principe, d'engagement du mandataire sur le prix et le délai.",
    aussi: ['MOD', "Maître d'ouvrage délégué"],
  },
  {
    terme: 'Programme immobilier',
    categorie: 'Promotion',
    definition:
      "Description de ce qu'on veut construire : nombre et taille des logements, locaux annexes, stationnements. Le promoteur le définit avant de concevoir le projet.",
    aussi: ['Programme', 'Programme de construction'],
  },
  {
    terme: 'Étude de faisabilité',
    categorie: 'Promotion',
    definition:
      "Première analyse d'un terrain : combien de logements on peut y construire, à quel coût et à quel prix de vente. Elle dit si l'opération vaut la peine d'être poursuivie.",
    aussi: ['Faisabilité'],
  },
  {
    terme: 'Foncier',
    categorie: 'Promotion',
    definition:
      "Le terrain sur lequel porte une opération, ou ce qui touche à son acquisition. « Trouver du foncier » veut dire trouver un terrain à bâtir.",
    aussi: ['Terrain à bâtir'],
  },
  {
    terme: 'Commercialisation',
    categorie: 'Promotion',
    definition:
      "Vente des logements aux futurs acquéreurs, souvent commencée avant le début des travaux, par des réservations.",
    aussi: ['Réservation'],
  },
  {
    terme: 'Livraison',
    categorie: 'Promotion',
    definition:
      "Remise du logement terminé à l'acquéreur. Elle ne se confond pas avec la réception des travaux, qui est l'acceptation de l'ouvrage par le maître d'ouvrage.",
    aussi: ['Remise des clés'],
  },
  {
    terme: 'Charge foncière',
    categorie: 'Promotion',
    definition:
      "Part du prix de revient des logements qui correspond au terrain : prix d'achat, frais, et parfois démolition ou dépollution. Elle pèse lourd dans le bilan de l'opération.",
  },
  {
    terme: 'Promesse de vente',
    categorie: 'Juridique',
    definition:
      "Avant-contrat signé avant l'acte authentique, qui bloque un terrain ou un logement tout en le soumettant à des conditions. Elle prend la forme d'une promesse unilatérale ou d'une promesse synallagmatique.",
    aussi: ['Avant-contrat', 'Promesse'],
  },
  {
    terme: 'Promesse unilatérale de vente',
    categorie: 'Juridique',
    definition:
      "Promesse par laquelle le vendeur s'engage à vendre, l'acheteur gardant le choix d'acheter ou non (il « lève l'option »). L'acheteur verse en général une indemnité d'immobilisation.",
    aussi: ['Promesse unilatérale'],
  },
  {
    terme: 'Promesse synallagmatique de vente',
    categorie: 'Juridique',
    definition:
      "Promesse par laquelle le vendeur et l'acheteur s'engagent tous deux à conclure la vente, sous réserve des conditions suspensives prévues. On l'appelle couramment « compromis de vente ».",
    aussi: ['Compromis', 'Compromis de vente', 'Promesse synallagmatique'],
  },
  {
    terme: 'Condition suspensive',
    categorie: 'Juridique',
    definition:
      "Événement dont dépend la vente : s'il ne se réalise pas avant la date limite prévue, l'acheteur peut renoncer sans pénalité. Exemples : obtention du permis, absence de préemption, sol compatible avec le projet.",
    aussi: ['Conditions suspensives'],
  },
  {
    terme: "Indemnité d'immobilisation",
    categorie: 'Juridique',
    definition:
      "Somme que l'acheteur verse au vendeur en contrepartie du blocage du bien pendant une promesse unilatérale. Il la perd s'il renonce à acheter alors que les conditions sont remplies.",
  },
  {
    terme: 'Acte authentique',
    categorie: 'Juridique',
    definition:
      "Acte de vente signé devant notaire. C'est lui qui transfère la propriété du bien à l'acheteur.",
    aussi: ['Acte de vente', 'Acte notarié'],
  },
  {
    terme: 'Droit de préemption urbain',
    categorie: 'Urbanisme',
    definition:
      "Droit pour une commune de se substituer à l'acheteur lors de la vente d'un bien situé dans une zone qu'elle a délimitée. Le notaire lui adresse une déclaration d'intention d'aliéner, et elle dispose d'environ deux mois pour décider.",
    aussi: ['DPU', 'Préemption', 'Droit de préemption'],
  },
  {
    terme: "Déclaration d'intention d'aliéner",
    categorie: 'Urbanisme',
    definition:
      "Document que le notaire adresse à la commune avant une vente en zone de préemption, pour lui permettre d'exercer son droit ou d'y renoncer.",
    aussi: ['DIA'],
  },
  {
    terme: 'Servitude',
    categorie: 'Juridique',
    definition:
      "Charge qui pèse sur un terrain au profit d'un autre terrain (passage, canalisation, vue) ou d'un intérêt public. Elle peut empêcher de construire à un endroit.",
    aussi: ['Servitudes', "Servitude d'utilité publique"],
  },
  {
    terme: 'Viabilisation',
    categorie: 'Construction',
    definition:
      "Ensemble des travaux qui rendent un terrain constructible en le desservant : voirie, eau, assainissement, électricité, télécoms. Son coût est à chiffrer avant d'acheter.",
    aussi: ['Terrain viabilisé', 'Viabilisé'],
  },
  {
    terme: "Secteur d'information sur les sols",
    categorie: 'Réglementation',
    definition:
      "Zone arrêtée par le préfet où la connaissance de la pollution des sols justifie une étude de sols en cas de changement d'usage. Pour construire, le dossier de permis doit contenir une attestation d'un bureau d'études certifié.",
    aussi: ['SIS', 'Attestation ATTES'],
  },
  {
    terme: 'Archéologie préventive',
    categorie: 'Réglementation',
    definition:
      "Ensemble des opérations (diagnostic, puis éventuellement fouilles) menées avant des travaux pour étudier les vestiges enfouis. Le préfet de région les prescrit.",
    aussi: ['Diagnostic archéologique', 'Fouilles archéologiques'],
  },
  {
    terme: 'Étude géotechnique préalable',
    categorie: 'Réglementation',
    definition:
      "Étude de sol que le vendeur d'un terrain constructible fournit en zone argileuse d'exposition moyenne ou forte. Elle donne une première identification des risques et est annexée à la promesse de vente.",
    aussi: ['Étude préalable'],
  },
  {
    terme: 'Service des Domaines',
    categorie: 'Juridique',
    definition:
      "Service de l'État qui estime la valeur vénale d'un bien public avant une cession. Son avis éclaire la collectivité sans la lier.",
    aussi: ['Domaines', 'France Domaine', 'Avis du Domaine'],
  },
  {
    terme: 'Établissement public foncier',
    categorie: 'Urbanisme',
    definition:
      "Établissement public qui achète et porte des terrains pour le compte de collectivités, parfois pendant plusieurs années, avant de les céder à un opérateur.",
    aussi: ['EPF'],
  },
  {
    terme: "Zone d'aménagement concerté",
    categorie: 'Urbanisme',
    definition:
      "Opération d'aménagement conduite par un aménageur qui équipe un grand terrain, puis cède des lots à des constructeurs avec un cahier des charges.",
    aussi: ['ZAC'],
  },
  {
    terme: 'Bail réel solidaire',
    categorie: 'Logement social',
    definition:
      "Contrat par lequel un organisme de foncier solidaire accorde à un ménage un droit de construire ou d'occuper un logement, sans lui vendre le terrain. Le prix du logement baisse d'autant.",
    aussi: ['BRS'],
  },
  {
    terme: 'Organisme de foncier solidaire',
    categorie: 'Logement social',
    definition:
      "Organisme agréé qui reste propriétaire du terrain et le met à disposition de ménages par des baux réels solidaires.",
    aussi: ['OFS'],
  },
  {
    terme: 'Zonage',
    categorie: 'Urbanisme',
    definition:
      "Découpage du territoire d'une commune en zones par le PLU : urbaines (U), à urbaniser (AU), agricoles (A) et naturelles (N). Chaque zone a son règlement.",
    aussi: ['Zone U', 'Zone AU', 'Zone A', 'Zone N'],
  },
  {
    terme: 'Règlement du PLU',
    categorie: 'Urbanisme',
    definition:
      "Partie du PLU qui fixe, zone par zone, ce qu'on a le droit de construire : usages autorisés, implantation, hauteur, emprise, stationnement, espaces verts.",
    aussi: ['Règlement de zone'],
  },
  {
    terme: "Orientation d'aménagement et de programmation",
    categorie: 'Urbanisme',
    definition:
      "Pièce du PLU qui précise l'esprit attendu sur un secteur donné (accès, formes urbaines, espaces publics). Un projet doit être compatible avec elle.",
    aussi: ['OAP'],
  },
  {
    terme: 'Cristallisation des règles',
    categorie: 'Urbanisme',
    definition:
      "Effet du certificat d'urbanisme : si le permis est demandé dans les 18 mois, les règles d'urbanisme, taxes et limitations au droit de propriété qui figuraient au certificat ne peuvent pas être remises en cause, sauf celles qui protègent la sécurité ou la salubrité publiques.",
    aussi: ['Cristallisation', 'Règles figées'],
  },
  {
    terme: 'Permis tacite',
    categorie: 'Urbanisme',
    definition:
      "Permis réputé accordé quand la mairie ne notifie aucune décision à l'issue du délai d'instruction. Il a la même valeur qu'un permis exprès.",
    aussi: ['Permis de construire tacite', 'Accord tacite'],
  },
  {
    terme: 'Intérêt à agir',
    categorie: 'Urbanisme',
    definition:
      "Condition pour contester un permis : la construction doit affecter directement les conditions d'occupation, d'utilisation ou de jouissance du bien du requérant. Un voisin immédiat peut le justifier, un habitant éloigné plus difficilement.",
    aussi: ['Qualité pour agir'],
  },
  {
    terme: 'Retrait du permis',
    categorie: 'Urbanisme',
    definition:
      "Décision par laquelle la commune annule elle-même un permis illégal. Elle ne le peut que dans les trois mois suivant la décision, et doit la notifier au bénéficiaire avant la fin de ce délai.",
    aussi: ['Retrait', "Retrait d'un permis"],
  },
  {
    terme: 'Permis modificatif',
    categorie: 'Urbanisme',
    definition:
      "Permis qui adapte un projet déjà autorisé, par exemple pour corriger une irrégularité réparable relevée par le juge.",
    aussi: ['PC modificatif', 'Modificatif'],
  },
  {
    terme: "Bilan d'opération",
    categorie: 'Promotion',
    definition:
      "Tableau qui met face à face les recettes d'une opération (prix de vente des logements) et ses dépenses (foncier, travaux, honoraires, taxes, frais financiers…). La différence est la marge. On le met à jour à chaque étape.",
    aussi: ['Bilan', 'Bilan prévisionnel', 'Bilan promoteur', "Bilan de l'opération"],
  },
  {
    terme: 'Recettes',
    categorie: 'Promotion',
    definition:
      "Ce que rapporte une opération : essentiellement le prix de vente des logements, calculé sur la surface dans laquelle le prix est exprimé.",
    aussi: ['Recette'],
  },
  {
    terme: 'Prix de revient',
    categorie: 'Promotion',
    definition:
      "Total de ce que coûte une opération jusqu'à la livraison : foncier, travaux, honoraires, assurances, taxes, frais financiers et frais de commercialisation.",
    aussi: ['Coût de revient'],
  },
  {
    terme: "Marge de l'opération",
    categorie: 'Promotion',
    definition:
      "Ce qui reste quand les recettes ont payé toutes les dépenses. Pour un promoteur privé, elle rémunère ses fonds propres et le risque pris ; pour un organisme en accession sociale, elle est faible et sert de coussin face aux imprévus.",
    aussi: ['Marge'],
  },
  {
    terme: 'Surface de plancher',
    categorie: 'Urbanisme',
    definition:
      "Surface définie par le code de l'urbanisme (article R111-22) : somme des surfaces closes et couvertes de chaque niveau, sous plus de 1,80 m de hauteur, calculée à partir du nu intérieur des façades, avec des déductions. Elle sert au permis, à la densité et à la taxe d'aménagement.",
    aussi: ['SDP'],
  },
  {
    terme: 'Surface habitable',
    categorie: 'Construction',
    definition:
      "Surface définie par le code de la construction et de l'habitation (article R156-1) : surface de plancher construite après déduction des murs, cloisons, marches, cages d'escalier, gaines et embrasures. Les caves, garages, terrasses et balcons n'y sont pas comptés.",
    aussi: ['SHAB', 'Surface loi Boutin'],
  },
  {
    terme: 'Surface utile',
    categorie: 'Logement social',
    definition:
      "Surface habitable augmentée de la moitié de la surface des annexes (article R331-10 du code de la construction et de l'habitation). Les plafonds de prix de l'accession sociale s'expriment par mètre carré de surface utile.",
  },
  {
    terme: 'TVA',
    developpe: 'Taxe sur la Valeur Ajoutée',
    categorie: 'Financement',
    definition:
      "Taxe incluse dans le prix de vente d'un logement neuf : 20 % au taux normal. En accession sociale, un taux réduit de 5,5 % s'applique sous conditions (dispositif, localisation, plafonds de ressources et de prix).",
    aussi: ['TVA à taux réduit', 'TVA à 5,5 %', 'Taux réduit de TVA'],
  },
  {
    terme: 'Plafonds de prix',
    categorie: 'Logement social',
    definition:
      "Prix de vente maximaux, fixés par dispositif et revalorisés chaque année, que le vendeur ne doit pas dépasser pour que l'acquéreur bénéficie de l'accession sociale (par exemple le taux réduit de TVA). Ils s'expriment en euros hors taxes par mètre carré de surface utile.",
    aussi: ['Plafond de prix', 'Prix plafonds'],
  },
  {
    terme: 'Plafonds de ressources',
    categorie: 'Logement social',
    definition:
      "Revenus maximaux qu'un ménage ne doit pas dépasser pour accéder à un dispositif d'accession sociale. Ils sont revalorisés chaque année.",
    aussi: ['Plafond de ressources'],
  },
  {
    terme: "Taxe d'aménagement",
    categorie: 'Urbanisme',
    definition:
      "Taxe due à l'occasion d'une construction. Son assiette est la surface de plancher (article L331-10 du code de l'urbanisme). Des exonérations ou abattements existent pour certains logements aidés.",
  },
  {
    terme: 'Frais financiers',
    categorie: 'Financement',
    definition:
      "Intérêts et frais des financements de l'opération. Ils augmentent quand l'opération dure plus longtemps : un retard coûte de l'argent.",
  },
  {
    terme: 'Honoraires techniques',
    categorie: 'Promotion',
    definition:
      "Rémunération des intervenants techniques : architecte, bureaux d'études, contrôleur technique, coordonnateur SPS, géotechnicien. Poste du bilan d'opération.",
    aussi: ['Honoraires'],
  },
  {
    terme: 'Aléas',
    categorie: 'Promotion',
    definition:
      "Provision prévue dans le bilan pour les imprévus du chantier. Elle est soit comprise dans les travaux, soit inscrite sur une ligne à part.",
    aussi: ['Aléa', 'Provision pour aléas', 'Imprévus'],
  },
  {
    terme: 'Bilan à rebours',
    categorie: 'Promotion',
    definition:
      "Calcul qui part du prix de vente pour trouver le prix maximal du terrain : recettes moins dépenses hors foncier moins marge visée. Le terrain y sert de variable d'ajustement.",
    aussi: ['Compte à rebours', 'Compte à rebours du promoteur'],
  },
  {
    terme: 'PSLA',
    developpe: 'Prêt Social Location-Accession',
    categorie: 'Logement social',
    definition:
      "Prêt conventionné consenti à un opérateur (organisme HLM, société d'économie mixte, promoteur) pour financer des logements neufs vendus en location-accession, à des ménages sous plafonds de ressources. Il suppose un agrément et une convention avec l'État, et les logements peuvent bénéficier de la TVA à 5,5 %.",
  },
  {
    terme: 'QPV',
    developpe: 'Quartier Prioritaire de la politique de la Ville',
    categorie: 'Urbanisme',
    definition:
      "Quartier défini par la politique de la ville, où vit une population à faibles revenus. Pour l'accession sociale, la vente de logements neufs dans un QPV ou à moins de 300 m de ses limites peut bénéficier de la TVA à 5,5 %, sous conditions.",
    aussi: ['Quartier prioritaire', 'Quartiers prioritaires'],
  },
  {
    terme: 'Plan de financement',
    categorie: 'Financement',
    definition:
      "Tableau qui montre comment le besoin de financement d'une opération est couvert : fonds propres, crédit et autres ressources. Il se construit à partir du bilan d'opération.",
    aussi: ['Montage financier'],
  },
  {
    terme: 'Besoin de financement',
    categorie: 'Financement',
    definition:
      "Somme à réunir pour payer les dépenses d'une opération avant d'avoir encaissé les recettes. Elle est égale au total des dépenses du bilan.",
    aussi: ['Besoin en financement'],
  },
  {
    terme: 'Fonds propres',
    categorie: 'Financement',
    definition:
      "Argent que l'organisme ou le promoteur investit lui-même dans l'opération, sans l'emprunter. Les banques en exigent une part, souvent de l'ordre de 15 à 20 % du besoin de financement.",
    aussi: ['Apport en fonds propres'],
  },
  {
    terme: 'Crédit de promotion',
    categorie: 'Financement',
    definition:
      "Prêt bancaire qui finance une opération de construction. Il prend la forme d'une ouverture de crédit : la banque met une enveloppe à disposition, et l'emprunteur tire les sommes au fur et à mesure. Les intérêts portent sur les sommes tirées.",
    aussi: ['Crédit promoteur', "Crédit de l'opération", 'Ouverture de crédit', "Crédit d'accompagnement"],
  },
  {
    terme: 'Pré-commercialisation',
    categorie: 'Promotion',
    definition:
      "Vente ou réservation de logements avant le début des travaux. Les banques l'exigent pour s'assurer que la demande existe ; les seuils varient selon les établissements (souvent de 30 à 50 %).",
    aussi: ['Prévente', 'Pré-vente', 'Préventes'],
  },
  {
    terme: 'Appel de fonds',
    categorie: 'Financement',
    definition:
      "Demande de paiement adressée à l'acquéreur à chaque étape d'avancement du chantier, dans les plafonds de la vente en l'état futur d'achèvement : 35 % aux fondations, 70 % hors d'eau, 95 % à l'achèvement.",
    aussi: ['Appels de fonds'],
  },
  {
    terme: "Garantie financière d'achèvement",
    categorie: 'Assurance',
    definition:
      "Garantie que le vendeur en l'état futur d'achèvement doit souscrire (article L261-10-1 du code de la construction et de l'habitation) : si le vendeur est défaillant, les sommes nécessaires pour achever l'immeuble sont versées. Elle est en principe délivrée par une banque ou une assurance (garantie extrinsèque).",
    aussi: ['GFA', "Garantie d'achèvement", 'Garantie extrinsèque'],
  },
  {
    terme: 'Location-accession',
    categorie: 'Logement social',
    definition:
      "Contrat par lequel un ménage occupe d'abord un logement neuf en payant une redevance, puis peut lever l'option pour en devenir propriétaire. Le logement reste la propriété du vendeur jusqu'à la levée de l'option.",
    aussi: ['Contrat de location-accession', 'Locataire-accédant'],
  },
  {
    terme: 'Quasi-fonds propres',
    categorie: 'Financement',
    definition:
      "Financements de long terme, souvent remboursés tard, que les banques traitent comme proches des fonds propres. Un organisme peut s'en servir pour renforcer son apport.",
  },
  {
    terme: 'Contrat de réservation',
    categorie: 'Juridique',
    definition:
      "Avant-contrat de la vente en l'état futur d'achèvement : le vendeur s'engage à réserver un logement à l'acquéreur, qui peut verser un dépôt de garantie plafonné. En secteur protégé, c'est le seul avant-contrat autorisé.",
    aussi: ['Contrat préliminaire', 'Avant-contrat de VEFA'],
  },
  {
    terme: 'Dépôt de garantie',
    categorie: 'Juridique',
    definition:
      "Somme que le réservataire peut verser en contrepartie de la réservation d'un logement vendu sur plan : au plus 5 % du prix prévisionnel si la vente est conclue dans l'année, 2 % jusqu'à deux ans, rien au-delà. Versé sur un compte spécial, il est restitué dans les cas prévus par la loi.",
    aussi: ['Dépôt de garantie en VEFA'],
  },
  {
    terme: 'Délai de rétractation',
    categorie: 'Juridique',
    definition:
      "Dix jours pendant lesquels l'acquéreur peut renoncer à la réservation d'un logement vendu sur plan, sans motif ni pénalité, à compter du lendemain de la première présentation de la lettre qui lui notifie le contrat. Le dépôt de garantie lui est alors restitué.",
    aussi: ['Rétractation', 'Droit de rétractation'],
  },
  {
    terme: 'Secteur protégé',
    categorie: 'Juridique',
    definition:
      "Régime de la vente d'un immeuble à construire destiné à l'habitation (ou à l'habitation et à un usage professionnel), qui protège l'acquéreur : contrat de réservation encadré, mentions obligatoires, paiements échelonnés, garantie d'achèvement.",
    aussi: ['Secteur libre'],
  },
  {
    terme: 'Garantie de remboursement',
    categorie: 'Assurance',
    definition:
      "Garantie qui assure à l'acquéreur le remboursement des sommes versées si le contrat de vente est résolu faute d'achèvement de l'immeuble. Elle est une alternative à la garantie d'achèvement.",
  },
  {
    terme: 'Garantie intrinsèque',
    categorie: 'Assurance',
    definition:
      "Ancienne forme de garantie d'achèvement, fondée sur les fonds propres du vendeur plutôt que sur un garant extérieur. Elle n'est plus admise pour les opérations récentes de vente en l'état futur d'achèvement (date d'effet à vérifier).",
    aussi: ['GFA intrinsèque'],
  },
  {
    terme: 'Consignation du solde',
    categorie: 'Juridique',
    definition:
      "À la livraison d'un logement vendu sur plan, si l'acquéreur constate des défauts de conformité ou des vices apparents, il peut déposer le solde de 5 % du prix à la Caisse des dépôts plutôt que de le payer au vendeur, jusqu'à la correction des défauts.",
    aussi: ['Consignation'],
  },
  {
    terme: 'Retard légitime',
    categorie: 'Juridique',
    definition:
      "Clause fréquente d'un contrat de vente sur plan qui prévoit des causes de report de la date de livraison, par exemple des intempéries. Le contrat de réservation précise aussi les pénalités en cas de retard.",
    aussi: ['Clause de retard légitime', 'Cause légitime de retard'],
  },
  {
    terme: 'Constructeur non réalisateur',
    categorie: 'Assurance',
    definition:
      "Vendeur d'un immeuble qu'il a fait construire sans l'exécuter lui-même, comme un promoteur. Il répond des désordres décennaux comme un constructeur, et la loi du 4 janvier 1978 prévoit une assurance pour cela.",
    aussi: ['CNR'],
  },
  {
    terme: 'Tous risques chantier',
    categorie: 'Assurance',
    definition:
      "Assurance facultative qui couvre les dommages survenant pendant le chantier (tempête, incendie, vol…), que la dommages-ouvrage ne couvre pas.",
    aussi: ['TRC'],
  },
  {
    terme: 'Vices apparents',
    categorie: 'Juridique',
    definition:
      "Défauts visibles au moment de la livraison d'un logement. En vente sur plan, le vendeur n'en est pas déchargé avant la réception ou, au plus tard, avant l'expiration d'un mois après la prise de possession (article 1642-1 du Code civil, à vérifier).",
    aussi: ['Vice apparent', 'Défauts de conformité apparents'],
  },
  {
    terme: 'Défaut de conformité',
    categorie: 'Juridique',
    definition:
      "Écart entre le logement livré et ce que prévoyait le contrat : surface, matériaux, équipements.",
    aussi: ['Non-conformité', 'Défauts de conformité'],
  },
  {
    terme: 'Accession sociale',
    categorie: 'Logement social',
    definition:
      "Achat de sa résidence principale neuve à un prix inférieur à celui du marché libre. Les programmes sont réalisés par des organismes HLM ou certaines de leurs filiales et vendus à des ménages sous conditions de ressources.",
    aussi: ['Accession sociale à la propriété'],
  },
  {
    terme: 'Achèvement',
    categorie: 'Juridique',
    definition:
      "Stade où un immeuble vendu sur plan est réputé achevé : les ouvrages sont exécutés et les éléments d'équipement indispensables à son utilisation, conformément à sa destination, sont installés (article R261-1). Les défauts de conformité ne sont pas pris en compte, et le constat de l'achèvement ne vaut pas reconnaissance de conformité.",
    aussi: ['Immeuble achevé'],
  },
  {
    terme: 'Procès-verbal de livraison',
    categorie: 'Juridique',
    definition:
      "Document signé à la remise des clés, après la visite du logement, qui consigne les défauts de conformité et les vices apparents relevés par l'acquéreur. Il ne se confond pas avec le procès-verbal de réception des travaux.",
    aussi: ['PV de livraison'],
  },
  {
    terme: 'Garantie de rachat',
    categorie: 'Logement social',
    definition:
      "Engagement de l'organisme HLM qui vend en accession sociale de racheter le logement de l'acquéreur en résidence principale dans des conditions définies au contrat. Sa durée varie selon les sources (souvent 15 ans).",
  },
  {
    terme: 'Garantie de relogement',
    categorie: 'Logement social',
    definition:
      "Engagement de l'organisme HLM qui vend en accession sociale de reloger l'acquéreur en difficulté, par exemple dans son patrimoine locatif, dans des conditions définies au contrat.",
  },
  {
    terme: 'Assurance revente',
    categorie: 'Logement social',
    definition:
      "Assurance que l'organisme HLM fait souscrire à l'acquéreur en résidence principale, pour l'indemniser de la moins-value en cas de revente à perte pendant une durée définie au contrat.",
  },
  {
    terme: 'Dossier des ouvrages exécutés',
    categorie: 'Construction',
    definition:
      "Dossier remis à la fin du chantier, avec les plans conformes à l'exécution et les notices des équipements installés. Il sert à l'entretien et aux interventions futures.",
    aussi: ['DOE'],
  },
];
