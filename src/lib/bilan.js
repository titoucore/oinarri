// Calcul du bilan d'une opération de promotion (simulateur d'Oinarri).
// Tout est en euros hors taxes. Les valeurs de départ sont celles de la Résidence Arbola, une opération FICTIVE.
//
// Les intérêts dépendent du crédit, qui dépend des dépenses, qui contiennent les intérêts.
// Cette boucle se résout par une formule directe (pas de calcul itératif) :
//   k = taux × (durée/12 × tirage moyen + retard/12)       coût du crédit par euro emprunté
//   dépenses = dépenses hors intérêts / (1 − (1 − part de fonds propres) × k)
// La même formule sert dans l'export Excel, qui n'a donc aucune référence circulaire.

export const VERSION_FORMAT = 1;

// Structure du bilan : 7 postes, chacun avec ses sous-postes.
// `calcule: true` = montant calculé, non saisi (intérêts).
export const POSTES = [
  {
    id: 'foncier',
    libelle: 'Foncier',
    sous: [
      { id: 'acquisition', libelle: "Prix d'acquisition du terrain" },
      { id: 'notaire', libelle: 'Notaire et droits de mutation' },
      { id: 'agence', libelle: "Frais d'agence" },
      { id: 'etudes', libelle: 'Études et diagnostics préalables' },
    ],
  },
  {
    id: 'travaux',
    libelle: 'Travaux',
    sous: [
      { id: 'vrd', libelle: 'VRD et terrassement' },
      { id: 'gros_oeuvre', libelle: 'Gros œuvre' },
      { id: 'second_oeuvre', libelle: 'Second œuvre et lots techniques' },
      { id: 'exterieurs', libelle: 'Aménagements extérieurs' },
      { id: 'aleas', libelle: 'Aléas', aleas: true },
    ],
  },
  {
    id: 'honoraires',
    libelle: 'Honoraires',
    sous: [
      { id: 'moe', libelle: "Maîtrise d'œuvre" },
      { id: 'bet', libelle: "Bureaux d'études" },
      { id: 'controle', libelle: 'Contrôle technique' },
      { id: 'spsopc', libelle: 'Coordination SPS et OPC' },
      { id: 'geometre', libelle: 'Géomètre' },
    ],
  },
  {
    id: 'assurances',
    libelle: 'Assurances',
    sous: [
      { id: 'do', libelle: 'Dommages-ouvrage' },
      { id: 'trc', libelle: 'Tous risques chantier' },
    ],
  },
  {
    id: 'taxes',
    libelle: 'Taxes',
    sous: [
      { id: 'amenagement', libelle: "Taxe d'aménagement" },
      { id: 'rap', libelle: "Redevance d'archéologie préventive" },
      { id: 'participations', libelle: 'Participations et autres' },
    ],
  },
  {
    id: 'financiers',
    libelle: 'Frais financiers',
    sous: [
      { id: 'interets', libelle: 'Intérêts du crédit', calcule: true },
      { id: 'dossier', libelle: 'Frais de dossier bancaire' },
      { id: 'gfa', libelle: "Garantie financière d'achèvement" },
    ],
  },
  {
    id: 'commercialisation',
    libelle: 'Commercialisation',
    sous: [
      { id: 'publicite', libelle: 'Publicité et supports' },
      { id: 'commissions', libelle: 'Commissions de vente' },
      { id: 'actes', libelle: "Frais d'actes de vente" },
    ],
  },
];

// Clé d'un montant saisi : "poste.sous-poste".
export function cle(poste, sous) {
  return `${poste}.${sous}`;
}

export function valeursDepart() {
  return {
    v: VERSION_FORMAT,
    hyp: {
      prixM2: 3000, // € HT par m² de surface utile
      surface: 760, // m² de surface utile
      tva: 0.2, // 0,2 ou 0,055
      taux: 0.035,
      duree: 24, // mois de chantier et de portage
      retard: 0, // mois de retard
      fondsPropres: 440000 / 2240000, // part des dépenses totales
      tirage: 0.5, // part moyenne du crédit utilisée pendant la durée prévue
      margeCible: 0.05, // part des recettes, pour le bilan à rebours
    },
    montants: {
      'foncier.acquisition': 285000,
      'foncier.notaire': 23000,
      'foncier.agence': 6000,
      'foncier.etudes': 6000,
      'travaux.vrd': 110000,
      'travaux.gros_oeuvre': 540000,
      'travaux.second_oeuvre': 680000,
      'travaux.exterieurs': 70000,
      'travaux.aleas': 80000,
      'honoraires.moe': 110000,
      'honoraires.bet': 30000,
      'honoraires.controle': 15000,
      'honoraires.spsopc': 17000,
      'honoraires.geometre': 8000,
      'assurances.do': 30000,
      'assurances.trc': 10000,
      'taxes.amenagement': 38000,
      'taxes.rap': 2000,
      'taxes.participations': 5000,
      'financiers.dossier': 3000,
      'financiers.gfa': 4000,
      'commercialisation.publicite': 25000,
      'commercialisation.commissions': 60000,
      'commercialisation.actes': 20000,
    },
  };
}

function nombre(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

// Coût du crédit par euro emprunté (hors frais de dossier et de garantie).
export function coutCredit(h) {
  return nombre(h.taux) * ((nombre(h.duree) / 12) * nombre(h.tirage) + nombre(h.retard) / 12);
}

const DENOMINATEUR_MIN = 0.05;

function denominateur(h) {
  const part = 1 - nombre(h.fondsPropres); // part financée par le crédit
  return 1 - part * coutCredit(h);
}

// Dépenses totales pour des dépenses hors intérêts `d0` : résolution de la boucle crédit-intérêts.
function depensesTotales(d0, h) {
  return d0 / Math.max(denominateur(h), DENOMINATEUR_MIN);
}

// Vrai quand les intérêts dépasseraient presque le montant emprunté : les hypothèses de financement n'ont plus de sens.
export function financementIncoherent(h) {
  return denominateur(h) < DENOMINATEUR_MIN;
}

// Calcule le bilan complet à partir d'un scénario { hyp, montants }.
export function calculer(scenario) {
  const h = scenario.hyp;
  const m = scenario.montants;
  const surface = nombre(h.surface);
  const parM2 = (x) => (surface > 0 ? x / surface : 0);

  // Dépenses hors intérêts, par poste.
  const postes = POSTES.map((p) => {
    const sous = p.sous.map((s) => ({
      id: s.id,
      libelle: s.libelle,
      calcule: !!s.calcule,
      montant: s.calcule ? 0 : nombre(m[cle(p.id, s.id)]),
    }));
    return { id: p.id, libelle: p.libelle, sous, total: 0 };
  });

  const d0 = postes.reduce((somme, p) => somme + p.sous.reduce((s, x) => s + x.montant, 0), 0);
  const k = coutCredit(h);
  const part = 1 - nombre(h.fondsPropres);
  const depenses = depensesTotales(d0, h);
  const credit = part * depenses;
  const interets = credit * k;

  for (const p of postes) {
    for (const s of p.sous) {
      if (s.calcule) s.montant = interets;
      s.parM2 = parM2(s.montant);
    }
    p.total = p.sous.reduce((somme, s) => somme + s.montant, 0);
    p.parM2 = parM2(p.total);
    p.part = depenses > 0 ? p.total / depenses : 0;
  }

  const recettes = nombre(h.prixM2) * surface;
  const marge = recettes - depenses;
  const travaux = postes.find((p) => p.id === 'travaux');
  const baseTravaux = travaux.sous.filter((s) => !s.aleas).reduce((somme, s) => somme + s.montant, 0);
  const aleas = nombre(m['travaux.aleas']);

  return {
    postes,
    recettes,
    depenses,
    marge,
    margePct: recettes > 0 ? marge / recettes : 0,
    fondsPropres: depenses - credit,
    credit,
    interets,
    prixTtcM2: nombre(h.prixM2) * (1 + nombre(h.tva)),
    prixRevientM2: parM2(depenses),
    recettesM2: nombre(h.prixM2),
    aleasPct: baseTravaux > 0 ? aleas / baseTravaux : 0,
    d0,
    incoherent: financementIncoherent(h),
  };
}

// Bilan à rebours : charge foncière maximale pour atteindre une marge donnée (en part des recettes).
// Le foncier est traité comme un seul bloc (acquisition + frais + agence + études).
export function chargeFonciere(scenario, margePct) {
  const h = scenario.hyp;
  const m = scenario.montants;
  const surface = nombre(h.surface);
  const recettes = nombre(h.prixM2) * surface;
  const k = coutCredit(h);
  const part = 1 - nombre(h.fondsPropres);

  const foncier = POSTES[0].sous.reduce((s, x) => s + nombre(m[cle('foncier', x.id)]), 0);
  const d0 = calculer(scenario).d0;
  const d0HorsFoncier = d0 - foncier;

  // marge = recettes − dépenses = margePct × recettes  =>  dépenses = recettes × (1 − margePct)
  const depensesVisees = recettes * (1 - margePct);
  const d0Vise = depensesVisees * Math.max(1 - part * k, DENOMINATEUR_MIN);
  const max = d0Vise - d0HorsFoncier;
  const autresFrais = foncier - nombre(m['foncier.acquisition']);
  return {
    margePct,
    chargeMax: max,
    chargeMaxM2: surface > 0 ? max / surface : 0,
    acquisitionMax: max - autresFrais,
    ecart: max - foncier,
  };
}

// Effet d'un retard : marge avec le retard saisi, sans retard, et coût d'un mois de plus.
export function effetRetard(scenario) {
  const avec = calculer(scenario);
  const sans = calculer({ ...scenario, hyp: { ...scenario.hyp, retard: 0 } });
  const plusUn = calculer({
    ...scenario,
    hyp: { ...scenario.hyp, retard: nombre(scenario.hyp.retard) + 1 },
  });
  return {
    margeAvecRetard: avec.marge,
    margeSansRetard: sans.marge,
    coutDuRetard: sans.marge - avec.marge,
    coutMoisSupplementaire: avec.marge - plusUn.marge,
  };
}

// Vérifie qu'un scénario relu (base de données, fichier) a la forme attendue, et le complète au besoin.
export function normaliser(brut) {
  const depart = valeursDepart();
  if (!brut || typeof brut !== 'object') return depart;
  const hyp = { ...depart.hyp };
  for (const c of Object.keys(hyp)) {
    const n = Number(brut.hyp?.[c]);
    if (brut.hyp && Number.isFinite(n)) hyp[c] = n;
  }
  const montants = { ...depart.montants };
  for (const c of Object.keys(montants)) {
    const n = Number(brut.montants?.[c]);
    if (brut.montants && Number.isFinite(n) && n >= 0) montants[c] = n;
  }
  return { v: VERSION_FORMAT, hyp, montants };
}
