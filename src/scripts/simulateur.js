// Simulateur de bilan d'opération. Tout le calcul se fait dans le navigateur (lib/bilan.js) :
// aucun appel à l'API Claude. Seuls l'enregistrement des scénarios et leur ouverture passent par /api/scenarios.

import { POSTES, calculer, chargeFonciere, cle, effetRetard, normaliser, valeursDepart } from '../lib/bilan.js';

const racine = document.getElementById('simulateur');
if (racine) demarrer(racine);

function demarrer(racine) {
  let etat = valeursDepart();
  let scenario = { id: null, nom: '' }; // scénario ouvert (id nul = pas encore enregistré)
  const saisies = []; // { entree, lire(), ecrire(v), format(v) } pour rafraîchir les champs

  // ---------- Petits outils ----------

  const nf = (max) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: max });
  const MOINS = '\u2212';

  function euros(n) {
    const v = Math.round(n);
    return `${v < 0 ? MOINS : ''}${nf(0).format(Math.abs(v))}\u00a0€`;
  }
  function euros2(n) {
    return `${nf(0).format(Math.round(n))}\u00a0€`;
  }
  function signe(n) {
    const v = Math.round(n);
    return `${v > 0 ? '+' : v < 0 ? MOINS : ''}${nf(0).format(Math.abs(v))}\u00a0€`;
  }
  function pct(n, d = 1) {
    return `${n < 0 ? MOINS : ''}${nf(d).format(Math.abs(n) * 100)}\u00a0%`;
  }
  function lire(texte) {
    const propre = String(texte).replace(/[\s\u00a0\u202f€%]/g, '').replace(',', '.');
    if (propre === '') return null;
    const n = Number(propre);
    return Number.isFinite(n) ? n : null;
  }

  function el(balise, attributs = {}, ...enfants) {
    const e = document.createElement(balise);
    for (const [nom, valeur] of Object.entries(attributs)) {
      if (valeur === false || valeur === null || valeur === undefined) continue;
      if (nom === 'class') e.className = valeur;
      else if (nom === 'texte') e.textContent = valeur;
      else e.setAttribute(nom, valeur === true ? '' : valeur);
    }
    for (const enfant of enfants.flat()) {
      if (enfant === null || enfant === undefined || enfant === false) continue;
      e.append(enfant);
    }
    return e;
  }

  let compteur = 0;
  const idUnique = (base) => `sim-${base}-${++compteur}`;

  // ---------- Champs de saisie ----------

  // type : 'euro' (montant), 'pct' (stocké en fraction, saisi en %), 'nombre'.
  function champ({ libelle, unite, type, aide, lecture, ecriture, note }) {
    const id = idUnique('champ');
    const entree = el('input', {
      id,
      type: 'text',
      inputmode: 'decimal',
      autocomplete: 'off',
      autocapitalize: 'none',
      spellcheck: 'false',
    });
    const format = (v) => (type === 'pct' ? nf(2).format(v * 100) : nf(type === 'euro' ? 0 : 2).format(v));
    const versEtat = (n) => (type === 'pct' ? n / 100 : n);

    entree.addEventListener('input', () => {
      const n = lire(entree.value);
      const valide = n !== null && n >= 0 && (type !== 'pct' || n <= 100) && n <= 1e10;
      entree.setAttribute('aria-invalid', valide ? 'false' : 'true');
      if (!valide) return;
      ecriture(versEtat(n));
      modifie();
      afficher();
    });
    entree.addEventListener('blur', () => {
      entree.setAttribute('aria-invalid', 'false');
      entree.value = format(lecture());
    });
    entree.addEventListener('focus', () => entree.select());

    saisies.push({ entree, rafraichir: () => (entree.value = format(lecture())) });
    entree.value = format(lecture());

    const noteEl = el('span', { class: 'sim-note' });
    const ligne = el(
      'div',
      { class: 'sim-ligne' },
      el('div', { class: 'sim-ligne-texte' }, el('label', { for: id, texte: libelle }), aide ? el('span', { class: 'sim-aide', texte: aide }) : null, noteEl),
      el('div', { class: 'sim-entree' }, entree, el('span', { class: 'sim-unite', texte: unite })),
    );
    return { ligne, noteEl, note };
  }

  const notes = []; // champs dont la note (ratio €/m²) se recalcule

  function ligneHyp(cle_, options) {
    const c = champ({
      ...options,
      lecture: () => etat.hyp[cle_],
      ecriture: (v) => (etat.hyp[cle_] = v),
    });
    return c.ligne;
  }

  function ligneMontant(poste, sous) {
    const c = champ({
      libelle: sous.libelle,
      unite: '€',
      type: 'euro',
      lecture: () => etat.montants[cle(poste.id, sous.id)] ?? 0,
      ecriture: (v) => (etat.montants[cle(poste.id, sous.id)] = v),
    });
    notes.push({ noteEl: c.noteEl, poste: poste.id, sous: sous.id, aleas: !!sous.aleas });
    return c.ligne;
  }

  // ---------- Bloc « scénarios » ----------

  const champNom = el('input', {
    id: 'sim-nom',
    type: 'text',
    maxlength: '80',
    placeholder: 'Nom du scénario',
    autocomplete: 'off',
    'aria-label': 'Nom du scénario',
  });
  champNom.addEventListener('input', () => {
    scenario.nom = champNom.value;
  });

  const liste = el('select', { id: 'sim-liste', 'aria-label': 'Mes scénarios enregistrés' });
  const statut = el('p', { class: 'sim-statut', role: 'status' });

  const bouton = (texte, classe, action) => {
    const b = el('button', { type: 'button', class: classe, texte });
    b.addEventListener('click', action);
    return b;
  };

  const boutonEnregistrer = bouton('Enregistrer', 'sim-bouton', enregistrer);
  const boutonOuvrir = bouton('Ouvrir', 'sim-bouton sim-bouton-2', ouvrir);
  const boutonSupprimer = bouton('Supprimer', 'sim-lien', supprimer);

  const outils = el(
    'section',
    { class: 'sim-carte carte-bande', 'aria-label': 'Scénarios' },
    el('div', { class: 'sim-rangee' }, champNom, boutonEnregistrer),
    el('div', { class: 'sim-rangee' }, liste, boutonOuvrir),
    el(
      'div',
      { class: 'sim-actions' },
      bouton('Exporter en Excel', 'sim-lien', exporter),
      bouton("Remettre les valeurs d'Arbola", 'sim-lien', remettre),
      boutonSupprimer,
    ),
    statut,
    el('p', {
      class: 'sim-avertissement',
      texte:
        "Scénarios d'étude uniquement : n'y saisis pas les chiffres d'une opération réelle de ton employeur. L'export Excel sert de modèle de départ à compléter dans tes outils.",
    }),
  );

  // ---------- Saisies : vente ----------

  const selectTva = el('select', { id: 'sim-tva', 'aria-label': 'TVA sur les ventes' });
  function remplirTva() {
    selectTva.replaceChildren();
    const options = [
      [0.2, '20\u00a0%'],
      [0.055, '5,5\u00a0%'],
    ];
    if (!options.some(([v]) => v === etat.hyp.tva)) options.push([etat.hyp.tva, pct(etat.hyp.tva)]);
    for (const [v, t] of options) selectTva.append(el('option', { value: String(v), texte: t }));
    selectTva.value = String(etat.hyp.tva);
  }
  selectTva.addEventListener('change', () => {
    etat.hyp.tva = Number(selectTva.value);
    modifie();
    afficher();
  });

  const carteVente = el(
    'section',
    { class: 'sim-carte', 'aria-labelledby': 'sim-t-vente' },
    el('h2', { id: 'sim-t-vente', texte: 'La vente' }),
    ligneHyp('prixM2', { libelle: 'Prix de vente HT', unite: '€ / m² SU', type: 'euro' }),
    ligneHyp('surface', {
      libelle: 'Surface utile',
      unite: 'm²',
      type: 'nombre',
      aide: "La surface qui sert de base au prix de vente.",
    }),
    el(
      'div',
      { class: 'sim-ligne' },
      el(
        'div',
        { class: 'sim-ligne-texte' },
        el('label', { for: 'sim-tva', texte: 'TVA sur les ventes' }),
        el('span', {
          class: 'sim-aide',
          texte: "Le taux de 5,5\u00a0% n'est possible que sous conditions : à contrôler avant de l'utiliser.",
        }),
      ),
      el('div', { class: 'sim-entree' }, selectTva),
    ),
  );

  // ---------- Saisies : dépenses ----------

  const detailsPostes = [];
  const carteDepenses = el(
    'section',
    { class: 'sim-carte', 'aria-labelledby': 'sim-t-dep' },
    el(
      'div',
      { class: 'sim-titre-ligne' },
      el('h2', { id: 'sim-t-dep', texte: 'Les dépenses (HT)' }),
      bouton('Tout déplier', 'sim-lien', function () {
        const ouvrir_ = detailsPostes.some((d) => !d.open);
        for (const d of detailsPostes) d.open = ouvrir_;
        this.textContent = ouvrir_ ? 'Tout replier' : 'Tout déplier';
      }),
    ),
  );

  const totauxPostes = {};
  for (const poste of POSTES) {
    const total = el('span', { class: 'sim-poste-total' });
    const ratio = el('span', { class: 'sim-poste-ratio' });
    totauxPostes[poste.id] = { total, ratio };
    const details = el(
      'details',
      { class: 'sim-poste' },
      el('summary', {}, el('span', { class: 'sim-poste-nom', texte: poste.libelle }), el('span', { class: 'sim-poste-chiffres' }, total, ratio)),
    );
    for (const sous of poste.sous) {
      if (sous.calcule) {
        const valeur = el('span', { class: 'sim-calcule' });
        totauxPostes[`${poste.id}.${sous.id}`] = { valeur };
        details.append(
          el(
            'div',
            { class: 'sim-ligne' },
            el(
              'div',
              { class: 'sim-ligne-texte' },
              el('span', { class: 'sim-libelle', texte: sous.libelle }),
              el('span', { class: 'sim-aide', texte: 'Calculé à partir du crédit, du taux et des délais (voir « Financement »).' }),
            ),
            el('div', { class: 'sim-entree' }, valeur),
          ),
        );
      } else {
        details.append(ligneMontant(poste, sous));
      }
    }
    detailsPostes.push(details);
    carteDepenses.append(details);
  }

  // ---------- Saisies : financement et objectif ----------

  const carteFinancement = el(
    'section',
    { class: 'sim-carte', 'aria-labelledby': 'sim-t-fin' },
    el('h2', { id: 'sim-t-fin', texte: 'Financement et délais' }),
    ligneHyp('taux', { libelle: "Taux d'intérêt du crédit", unite: '%', type: 'pct' }),
    ligneHyp('duree', { libelle: 'Durée du chantier et du portage', unite: 'mois', type: 'nombre' }),
    ligneHyp('retard', {
      libelle: 'Retard',
      unite: 'mois',
      type: 'nombre',
      aide: "Mois supplémentaires pendant lesquels tout le crédit est utilisé.",
    }),
    ligneHyp('fondsPropres', {
      libelle: 'Part de fonds propres',
      unite: '% des dépenses',
      type: 'pct',
      aide: "Le reste des dépenses est financé par le crédit.",
    }),
    ligneHyp('tirage', {
      libelle: 'Tirage moyen du crédit',
      unite: '% du crédit',
      type: 'pct',
      aide: "Le crédit est débloqué au fil du chantier : en moyenne, seule une part est utilisée pendant la durée prévue.",
    }),
  );

  const carteObjectif = el(
    'section',
    { class: 'sim-carte', 'aria-labelledby': 'sim-t-obj' },
    el('h2', { id: 'sim-t-obj', texte: 'Objectif de marge' }),
    ligneHyp('margeCible', {
      libelle: 'Marge cible',
      unite: '% des recettes',
      type: 'pct',
      aide: "Sert au calcul de la charge foncière maximale (bilan à rebours).",
    }),
  );

  // ---------- Résultats ----------

  const r = {}; // éléments à mettre à jour
  function ligneResultat(libelle, nom, classe = '') {
    r[nom] = el('span', { class: 'sim-valeur' });
    return el('div', { class: `sim-res ${classe}`.trim() }, el('span', { texte: libelle }), r[nom]);
  }

  const barres = POSTES.map((p) => {
    const barre = el('span', { class: 'sim-barre-remplie' });
    const valeur = el('span', { class: 'sim-barre-valeur' });
    r[`barre.${p.id}`] = { barre, valeur };
    return el(
      'li',
      { class: 'sim-barre' },
      el('span', { class: 'sim-barre-nom', texte: p.libelle }),
      el('span', { class: 'sim-barre-piste', 'aria-hidden': 'true' }, barre),
      valeur,
    );
  });

  r.entetePrudent = el('span', { class: 'sim-col' });
  r.enteteCible = el('span', { class: 'sim-col' });
  const ligneRebours = (libelle, nom) => {
    r[`${nom}0`] = el('span', { class: 'sim-col' });
    r[`${nom}1`] = el('span', { class: 'sim-col' });
    return el('div', { class: 'sim-rebours-ligne' }, el('span', { class: 'sim-rebours-nom', texte: libelle }), r[`${nom}0`], r[`${nom}1`]);
  };

  r.retard = el('p', { class: 'sim-texte' });
  r.retardMois = el('p', { class: 'sim-texte' });

  r.alerte = el('p', {
    class: 'sim-alerte',
    role: 'alert',
    hidden: true,
    texte:
      'Ces hypothèses de financement ne tiennent pas : les intérêts dépasseraient presque le crédit. Baisse le taux, la durée ou le retard.',
  });

  const resultats = el(
    'aside',
    { class: 'sim-resultats', 'aria-label': 'Résultats' },
    r.alerte,
    el(
      'section',
      { class: 'sim-carte' },
      el('h2', { texte: 'Résultat' }),
      ligneResultat("Recettes HT", 'recettes'),
      ligneResultat('Dépenses HT', 'depenses'),
      ligneResultat('Marge', 'marge', 'sim-res-fort'),
      ligneResultat('Marge en % des recettes', 'margePct'),
      ligneResultat('Prix de revient HT', 'revient'),
      ligneResultat('Prix de vente TTC', 'ttc'),
    ),
    el(
      'section',
      { class: 'sim-carte' },
      el('h2', { texte: 'Plan de financement' }),
      ligneResultat('Fonds propres', 'fp'),
      ligneResultat('Crédit', 'credit'),
      ligneResultat('dont intérêts estimés', 'interets'),
    ),
    el('section', { class: 'sim-carte' }, el('h2', { texte: 'Où va l\u2019argent' }), el('ul', { class: 'sim-barres' }, barres)),
    el(
      'section',
      { class: 'sim-carte' },
      el('h2', { texte: 'Charge foncière maximale' }),
      el('p', {
        class: 'sim-texte',
        texte:
          "Le bilan à rebours part du prix de vente et des autres dépenses, et cherche le plus que l'on puisse payer le terrain, frais compris.",
      }),
      el('div', { class: 'sim-rebours-ligne sim-rebours-entete' }, el('span'), r.entetePrudent, r.enteteCible),
      ligneRebours('Charge foncière max.', 'charge'),
      ligneRebours('par m² SU', 'chargeM2'),
      ligneRebours("Prix d'acquisition max.", 'acquisition'),
      ligneRebours('Écart avec le foncier saisi', 'ecart'),
    ),
    el('section', { class: 'sim-carte' }, el('h2', { texte: 'Effet d\u2019un retard' }), r.retard, r.retardMois),
  );

  const resume = el(
    'div',
    { class: 'sim-resume', 'aria-hidden': 'true' },
    el('span', {}, 'Marge ', (r.resumeMarge = el('strong'))),
    el('span', {}, 'Dépenses ', (r.resumeDepenses = el('strong'))),
  );

  const grille = el(
    'div',
    { class: 'sim-grille' },
    el('div', { class: 'sim-saisies' }, carteVente, carteDepenses, carteFinancement, carteObjectif),
    resultats,
  );

  const aide = el(
    'details',
    { class: 'sim-carte sim-limites' },
    el('summary', { texte: 'Comment lire ce bilan, et ses limites' }),
    el('ul', {}, [
      el('li', { texte: "Tous les chiffres sont fictifs : ils reprennent la Résidence Arbola des chapitres Promotion, pas une opération réelle." }),
      el('li', { texte: 'Les montants sont hors taxes. La TVA ne sert ici qu’au prix de vente TTC.' }),
      el('li', { texte: "Le crédit est simplifié : un tirage moyen remplace l'échéancier réel des déblocages. Les intérêts sont calculés sans boucle, par une formule directe." }),
      el('li', { texte: "Rien sur l'impôt sur les sociétés, la trésorerie mois par mois ni le calendrier des ventes." }),
      el('li', {}, 'Pour comprendre les postes : ', el('a', { href: '/promotion/04-le-bilan-de-l-operation/', texte: 'le bilan de l\u2019opération' }), ' et ', el('a', { href: '/promotion/05-le-financement/', texte: 'le financement' }), '.'),
    ]),
  );

  racine.replaceChildren(outils, grille, resume, aide);
  remplirTva();

  // ---------- Affichage ----------

  function afficher() {
    const b = calculer(etat);
    const bas = chargeFonciere(etat, 0);
    const cible = chargeFonciere(etat, etat.hyp.margeCible);
    const retard = effetRetard(etat);

    r.alerte.hidden = !b.incoherent;
    r.recettes.textContent = euros(b.recettes);
    r.depenses.textContent = euros(b.depenses);
    r.marge.textContent = signe(b.marge);
    r.margePct.textContent = pct(b.margePct);
    r.revient.textContent = `${euros2(b.prixRevientM2)} / m² SU`;
    r.ttc.textContent = `${euros2(b.prixTtcM2)} / m² SU`;
    r.fp.textContent = euros(b.fondsPropres);
    r.credit.textContent = euros(b.credit);
    r.interets.textContent = euros(b.interets);

    const margeTexte = signe(b.marge);
    const evide = document.getElementById('marge-evide');
    if (evide) {
      evide.textContent = margeTexte;
      evide.dataset.negatif = b.marge < 0 ? 'true' : 'false';
    }
    r.resumeMarge.textContent = margeTexte;
    r.resumeDepenses.textContent = euros(b.depenses);
    r.marge.dataset.negatif = b.marge < 0 ? 'true' : 'false';

    const maxPoste = Math.max(...b.postes.map((p) => p.total), 1);
    for (const p of b.postes) {
      const t = totauxPostes[p.id];
      t.total.textContent = euros(p.total);
      t.ratio.textContent = `${euros2(p.parM2)} / m²`;
      const { barre, valeur } = r[`barre.${p.id}`];
      barre.style.width = `${Math.max((p.total / maxPoste) * 100, 1)}%`;
      valeur.textContent = pct(p.part, 0);
    }
    totauxPostes['financiers.interets'].valeur.textContent = euros(b.interets);

    for (const n of notes) {
      const p = b.postes.find((x) => x.id === n.poste);
      const s = p.sous.find((x) => x.id === n.sous);
      n.noteEl.textContent = n.aleas
        ? `${pct(b.aleasPct)} des travaux hors aléas · ${euros2(s.parM2)} / m²`
        : `${euros2(s.parM2)} / m² SU`;
    }

    r.entetePrudent.textContent = 'Marge nulle';
    r.enteteCible.textContent = `Marge ${pct(etat.hyp.margeCible)}`;
    r.charge0.textContent = euros(bas.chargeMax);
    r.charge1.textContent = euros(cible.chargeMax);
    r.chargeM20.textContent = euros2(bas.chargeMaxM2);
    r.chargeM21.textContent = euros2(cible.chargeMaxM2);
    r.acquisition0.textContent = euros(bas.acquisitionMax);
    r.acquisition1.textContent = euros(cible.acquisitionMax);
    r.ecart0.textContent = signe(bas.ecart);
    r.ecart1.textContent = signe(cible.ecart);

    r.retard.textContent =
      etat.hyp.retard > 0
        ? `Avec ${nf(1).format(etat.hyp.retard)} mois de retard, la marge passe de ${euros(retard.margeSansRetard)} à ${euros(retard.margeAvecRetard)} : le retard coûte ${euros(retard.coutDuRetard)}.`
        : 'Aucun retard saisi : la marge est celle du calendrier prévu.';
    r.retardMois.textContent = `Chaque mois de retard en plus coûte environ ${euros(retard.coutMoisSupplementaire)} de marge, en intérêts.`;
  }

  // ---------- Scénarios ----------

  let messageEffacement = null;
  function dire(texte, erreur = false) {
    statut.textContent = texte;
    statut.dataset.erreur = erreur ? 'true' : 'false';
    clearTimeout(messageEffacement);
    if (!erreur && texte) messageEffacement = setTimeout(() => (statut.textContent = ''), 6000);
  }
  function modifie() {
    if (statut.dataset.erreur !== 'true') statut.textContent = scenario.id ? 'Modifications non enregistrées.' : '';
  }

  async function api(methode, corps, requete = '') {
    const reponse = await fetch(`/api/scenarios${requete}`, {
      method: methode,
      headers: corps ? { 'Content-Type': 'application/json' } : undefined,
      body: corps ? JSON.stringify(corps) : undefined,
      credentials: 'same-origin',
    });
    if (reponse.status === 401) {
      location.href = `/connexion/?retour=${encodeURIComponent('/simulateur/')}`;
      throw new Error('Session expirée.');
    }
    const donnees = await reponse.json().catch(() => ({}));
    if (!reponse.ok) throw new Error(donnees.erreur || 'Une erreur est survenue.');
    return donnees;
  }

  async function actualiserListe(selection = null) {
    try {
      const { scenarios } = await api('GET');
      liste.replaceChildren(el('option', { value: '', texte: scenarios.length ? 'Mes scénarios' : 'Aucun scénario enregistré' }));
      for (const s of scenarios) liste.append(el('option', { value: String(s.id), texte: s.nom }));
      liste.value = selection ? String(selection) : '';
      boutonOuvrir.disabled = scenarios.length === 0;
    } catch (e) {
      liste.replaceChildren(el('option', { value: '', texte: 'Liste indisponible' }));
      boutonOuvrir.disabled = true;
    }
  }

  async function enregistrer() {
    const nom = champNom.value.trim();
    if (!nom) {
      dire('Donne un nom au scénario pour l\u2019enregistrer.', true);
      champNom.focus();
      return;
    }
    boutonEnregistrer.disabled = true;
    try {
      if (scenario.id) {
        await api('PUT', { id: scenario.id, nom, donnees: etat });
      } else {
        const { scenario: cree } = await api('POST', { nom, donnees: etat });
        scenario.id = cree.id;
      }
      scenario.nom = nom;
      await actualiserListe(scenario.id);
      dire('Scénario enregistré.');
    } catch (e) {
      dire(e.message, true);
    } finally {
      boutonEnregistrer.disabled = false;
    }
  }

  async function ouvrir() {
    const id = Number(liste.value);
    if (!id) {
      dire('Choisis d\u2019abord un scénario dans la liste.', true);
      return;
    }
    try {
      const { scenario: ouvert } = await api('GET', null, `?id=${id}`);
      etat = normaliser(ouvert.donnees);
      scenario = { id: ouvert.id, nom: ouvert.nom };
      champNom.value = ouvert.nom;
      rafraichirChamps();
      dire(`Scénario « ${ouvert.nom} » ouvert.`);
    } catch (e) {
      dire(e.message, true);
    }
  }

  async function supprimer() {
    const id = scenario.id || Number(liste.value);
    if (!id) {
      dire('Aucun scénario enregistré à supprimer.', true);
      return;
    }
    const nom = scenario.id ? scenario.nom : liste.options[liste.selectedIndex]?.text;
    if (!window.confirm(`Supprimer le scénario « ${nom} » ? Cette action est définitive.`)) return;
    try {
      await api('DELETE', { id });
      if (scenario.id === id) scenario = { id: null, nom: scenario.nom };
      await actualiserListe();
      dire('Scénario supprimé.');
    } catch (e) {
      dire(e.message, true);
    }
  }

  function remettre() {
    etat = valeursDepart();
    scenario = { id: null, nom: '' };
    champNom.value = '';
    liste.value = '';
    rafraichirChamps();
    dire("Valeurs d'Arbola rétablies.");
  }

  function rafraichirChamps() {
    for (const s of saisies) s.rafraichir();
    remplirTva();
    afficher();
  }

  // ---------- Export Excel ----------

  function nomDeFichier(nom) {
    const base = nom
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `bilan-${base || 'scenario'}.xlsx`;
  }

  async function exporter() {
    try {
      const { construireXlsx } = await import('../lib/xlsx-bilan.js');
      const nom = champNom.value.trim() || "Résidence Arbola (valeurs fictives)";
      const octets = construireXlsx(etat, nom);
      const blob = new Blob([octets], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const lien = el('a', { href: URL.createObjectURL(blob), download: nomDeFichier(nom) });
      document.body.append(lien);
      lien.click();
      lien.remove();
      setTimeout(() => URL.revokeObjectURL(lien.href), 10000);
      dire('Fichier Excel préparé.');
    } catch (e) {
      dire("L'export n'a pas pu être préparé.", true);
    }
  }

  // ---------- Démarrage ----------

  afficher();
  boutonOuvrir.disabled = true;
  actualiserListe();
}
