// Glossaire du chapitre « Le bâtiment passif, la double flux et le puits canadien » du B.A.-BA.
// Même format que glossaire.js (voir les champs décrits en tête de ce fichier).
// Ce fichier est fusionné par glossaire.js.

export const termes = [
  {
    terme: 'Bâtiment passif',
    categorie: 'Thermique',
    definition:
      "Bâtiment qui réduit tellement ses besoins de chauffage que le soleil, les occupants et leurs appareils en couvrent l'essentiel. Le label Passivhaus demande un besoin de chauffage d'au plus 15 kWh/(m²·an) ou une puissance de 10 W/m². « Passif » ne veut pas dire « sans chauffage ».",
    aussi: ['Maison passive', 'Passif', 'Bâtiment passif / Passivhaus'],
  },
  {
    terme: 'Passivhaus',
    categorie: 'Thermique',
    definition:
      "Label né en Allemagne, géré par le Passivhaus Institut. En France, Maison Passive France est accréditée pour le délivrer. Cinq critères : besoin de chauffage, besoin de rafraîchissement, énergie primaire, étanchéité à l'air et surchauffe.",
    aussi: ['Label Passivhaus', 'PHI', 'Passivhaus Institut', 'Maison Passive France'],
  },
  {
    terme: 'VMC double flux',
    developpe: 'Ventilation Mécanique Contrôlée double flux',
    categorie: 'Thermique',
    definition:
      "Ventilation qui insère de l'air neuf et extrait l'air vicié, avec un échangeur qui transmet la chaleur de l'air sortant à l'air entrant, sans mélange. Un bâtiment passif exige une récupération d'au moins 75 %.",
    aussi: ['Double flux', 'VMC DF', 'Ventilation double flux', 'VMC'],
  },
  {
    terme: 'Puits canadien',
    categorie: 'Thermique',
    definition:
      "Tubes enterrés dans lesquels circule l'air neuf avant d'entrer dans le bâtiment : le sol, à température stable, le réchauffe l'hiver (puits canadien) ou le rafraîchit l'été (puits provençal). C'est un seul système, aussi appelé puits climatique. Son efficacité dépend beaucoup du sol et de la conception.",
    aussi: ['Puits provençal', 'Puits climatique', 'Puits canadien/provençal', 'Puits canadiens'],
  },
  {
    terme: 'Radon',
    categorie: 'Concepts',
    definition:
      "Gaz radioactif d'origine naturelle, plus présent dans les sols granitiques et volcaniques. Il peut s'infiltrer dans un puits canadien mal étanche : l'ADEME demande d'y surveiller l'étanchéité.",
    aussi: [],
  },
  {
    terme: 'n50',
    developpe: "Taux de renouvellement d'air à 50 Pa",
    categorie: 'Réglementation',
    definition:
      "Indicateur d'étanchéité à l'air du label Passivhaus : nombre de renouvellements du volume du bâtiment par heure sous 50 pascals de différence de pression, qui doit rester sous 0,6 h⁻¹. Il ne se compare pas directement au Q4Pa-surf de la réglementation.",
    aussi: ["Taux de renouvellement d'air à 50 Pa"],
  },
];
