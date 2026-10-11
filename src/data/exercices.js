// Exercices chiffrés des révisions.
//
// Chaque exercice génère de nouvelles valeurs à chaque tirage : on s'entraîne à la méthode,
// pas à une réponse mémorisée. Les formules viennent des chapitres du cours (voir « cours »).
//
// Champs d'un exercice :
//   id        identifiant stable : la carte de révision s'appelle « exo/<id> » (ne jamais le changer)
//   cours     le chapitre concerné ; valider le niveau « niveau » inscrit l'exercice aux révisions
//   niveau    'essentiel', 'approfondir' ou 'expert'
//   generer   fonction (alea) qui renvoie { enonce, reponse, tolerance, unite, decimales, etapes }
//
// Les tolérances absorbent les arrondis : la réponse est acceptée si |saisie - reponse| <= tolerance.

// Nombre à la française, avec un nombre fixe de décimales.
const nombre = (x, d = 2) =>
  x.toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d });

export const alea = {
  entier: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),
  choix: (tableau) => tableau[Math.floor(Math.random() * tableau.length)],
};

export const EXERCICES = [
  {
    id: 'r-couche',
    cours: 'ba-ba/08-l-enveloppe-et-la-thermique',
    niveau: 'essentiel',
    generer(a) {
      const e = a.choix([10, 12, 14, 16, 18, 20, 22, 24, 26]);
      const l = a.choix([0.036, 0.038, 0.04, 0.042, 0.045, 0.05]);
      const r = e / 100 / l;
      return {
        enonce: `Une couche d'isolant de ${e} cm a une conductivité λ de ${nombre(l, 3)} W/(m·K). Quelle est sa résistance thermique R, en m²·K/W ? (arrondie au centième)`,
        reponse: r,
        tolerance: 0.02,
        unite: 'm²·K/W',
        decimales: 2,
        etapes: [
          'R = épaisseur (en mètres) ÷ λ',
          `R = ${nombre(e / 100)} ÷ ${nombre(l, 3)} = ${nombre(r)} m²·K/W`,
        ],
      };
    },
  },
  {
    id: 'epaisseur-r',
    cours: 'ba-ba/08-l-enveloppe-et-la-thermique',
    niveau: 'essentiel',
    generer(a) {
      const r = a.choix([3.5, 5, 6, 7.5]);
      const l = a.choix([0.036, 0.038, 0.04, 0.042, 0.045, 0.05]);
      const e = r * l;
      return {
        enonce: `Quelle épaisseur d'isolant, en centimètres, faut-il pour atteindre R = ${nombre(r, 1)} m²·K/W avec un isolant de λ = ${nombre(l, 3)} W/(m·K) ? (arrondie au demi-centimètre)`,
        reponse: e * 100,
        tolerance: 0.5,
        unite: 'cm',
        decimales: 1,
        etapes: [
          'Épaisseur = R × λ',
          `${nombre(r, 1)} × ${nombre(l, 3)} = ${nombre(e, 3)} m, soit ${nombre(e * 100, 1)} cm`,
        ],
      };
    },
  },
  {
    id: 'u-mur',
    cours: 'ba-ba/08-l-enveloppe-et-la-thermique',
    niveau: 'essentiel',
    generer(a) {
      const r = a.choix([2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7]);
      const total = 0.13 + r + 0.04;
      const u = 1 / total;
      return {
        enonce: `Les couches d'un mur (isolant et parements) ont une résistance totale R = ${nombre(r, 1)} m²·K/W. Avec les résistances superficielles d'un mur, quel est son coefficient U, en W/(m²·K) ? (arrondi au centième)`,
        reponse: u,
        tolerance: 0.01,
        unite: 'W/(m²·K)',
        decimales: 2,
        etapes: [
          "U = 1 ÷ (Rsi + somme des R + Rse), avec Rsi = 0,13 et Rse = 0,04 pour un mur",
          `U = 1 ÷ (0,13 + ${nombre(r, 1)} + 0,04) = 1 ÷ ${nombre(total)} = ${nombre(u)} W/(m²·K)`,
        ],
      };
    },
  },
  {
    id: 'bbio',
    cours: 'ba-ba/08-l-enveloppe-et-la-thermique',
    niveau: 'approfondir',
    generer(a) {
      const chauffage = a.entier(8, 45);
      const froid = a.entier(2, 18);
      const eclairage = a.entier(5, 12);
      const bbio = 2 * (chauffage + froid) + 5 * eclairage;
      return {
        enonce: `Un bâtiment a un besoin de chauffage de ${chauffage} points, un besoin de refroidissement de ${froid} points et un besoin d'éclairage de ${eclairage} points. Quel est son Bbio, en points ?`,
        reponse: bbio,
        tolerance: 0,
        unite: 'points',
        decimales: 0,
        etapes: [
          'Bbio = 2 × (chauffage + refroidissement) + 5 × éclairage',
          `Bbio = 2 × (${chauffage} + ${froid}) + 5 × ${eclairage} = ${2 * (chauffage + froid)} + ${5 * eclairage} = ${bbio} points`,
        ],
      };
    },
  },
  {
    id: 'db-somme',
    cours: 'ba-ba/09-l-acoustique',
    niveau: 'essentiel',
    generer(a) {
      const x = a.entier(50, 70);
      const ecart = a.choix([0, 0, 3, 6, 10]);
      const y = x - ecart;
      const total = 10 * Math.log10(10 ** (x / 10) + 10 ** (y / 10));
      const gain = total - x;
      return {
        enonce:
          ecart === 0
            ? `Deux sources identiques émettent chacune ${x} dB dans une même pièce. Quel est le niveau total, en dB ? (arrondi à l'unité)`
            : `Deux sources émettent ${x} dB et ${y} dB dans une même pièce. Quel est le niveau total, en dB ? (arrondi à l'unité)`,
        reponse: total,
        tolerance: 0.6,
        unite: 'dB',
        decimales: 0,
        etapes: [
          "Les décibels ne s'additionnent pas simplement : L = 10 × log₁₀(10^(L₁/10) + 10^(L₂/10))",
          ecart === 0
            ? `Deux sources identiques ajoutent environ 3 dB : ${x} + 3 = ${x + 3} dB.`
            : `Un écart de ${ecart} dB ajoute environ ${nombre(gain, 1)} dB à la source la plus forte : ${x} + ${nombre(gain, 1)} ≈ ${Math.round(total)} dB.`,
        ],
      };
    },
  },
  {
    id: 'passif-chauffage',
    cours: 'ba-ba/10-le-batiment-passif-et-le-puits-canadien',
    niveau: 'essentiel',
    generer(a) {
      const s = a.choix([45, 60, 72, 85, 95]);
      if (a.choix([true, false])) {
        return {
          enonce: `Un logement de ${s} m² vise le label Passivhaus. Quel est son besoin de chauffage annuel maximal, en kWh par an ?`,
          reponse: 15 * s,
          tolerance: 0.5,
          unite: 'kWh/an',
          decimales: 0,
          etapes: ['Le label demande au plus 15 kWh/(m²·an) de chauffage.', `${s} × 15 = ${15 * s} kWh par an`],
        };
      }
      return {
        enonce: `Un logement de ${s} m² vise le label Passivhaus. Quelle est sa puissance de chauffe maximale, en watts ?`,
        reponse: 10 * s,
        tolerance: 0.5,
        unite: 'W',
        decimales: 0,
        etapes: ['Le label accepte, au choix, au plus 10 W/m² de puissance de chauffe.', `${s} × 10 = ${10 * s} W`],
      };
    },
  },
  {
    id: 'loyer-max-ls',
    cours: 'logement-social/04-le-loyer-et-le-conventionnement',
    niveau: 'approfondir',
    generer(a) {
      const n = a.choix([3, 6, 12]);
      const su = a.choix([45, 52, 60, 68, 75]);
      const zone = a.choix([
        { produit: 'PLUS', zone: 'II', v: 6.49 },
        { produit: 'PLUS', zone: 'III', v: 6.01 },
        { produit: 'PLAI', zone: 'II', v: 5.77 },
        { produit: 'PLAI', zone: 'III', v: 5.33 },
      ]);
      const prix = zone.v;
      const cs = 0.77 * (1 + (n * 20) / (n * su));
      const loyer = prix * cs * su;
      return {
        enonce: `Une opération compte ${n} logements ${zone.produit} identiques de ${su} m² de surface utile, en zone ${zone.zone}. Le loyer maximal de zone 2026 est de ${nombre(prix)} € par m² et par mois. Quel est le loyer maximal mensuel d'un logement, en euros, sans marge locale et avec un coefficient propre égal à 1 ? (arrondi à l'euro)`,
        reponse: loyer,
        tolerance: 1,
        unite: '€ par mois',
        decimales: 0,
        etapes: [
          'Coefficient de structure = 0,77 × (1 + N × 20 ÷ surface utile totale)',
          `Coefficient = 0,77 × (1 + ${n} × 20 ÷ ${n * su}) = ${nombre(cs, 4)}`,
          `Loyer = prix au m² × coefficient × surface utile = ${nombre(prix)} × ${nombre(cs, 4)} × ${su} = ${nombre(loyer, 1)} €`,
        ],
      };
    },
  },
];

// Cartes à inscrire quand on valide un niveau : exercices du chapitre, niveau compris.
export function exercicesDuCours(cours) {
  return EXERCICES.filter((e) => e.cours === cours).map((e) => ({ carte: `exo/${e.id}`, niveau: e.niveau }));
}
