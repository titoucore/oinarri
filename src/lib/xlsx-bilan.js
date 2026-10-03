// Export Excel du bilan : un classeur .xlsx avec des formules vivantes.
// Aucune bibliothèque : un fichier .xlsx est une archive zip de fichiers XML, écrite ici sans compression.
// Les cellules d'hypothèses sont modifiables ; tout le reste se recalcule dans Excel, Numbers ou LibreOffice.
// Les valeurs déjà calculées par la page sont enregistrées avec les formules, pour les lecteurs qui ne recalculent pas.

import { POSTES, calculer, chargeFonciere, coutCredit, effetRetard } from './bilan.js';

// ---------- Archive zip (méthode « stocké ») ----------

const TABLE_CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(octets) {
  let c = 0xffffffff;
  for (let i = 0; i < octets.length; i++) c = TABLE_CRC[(c ^ octets[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function zip(fichiers) {
  const encodeur = new TextEncoder();
  const morceaux = [];
  const centrale = [];
  let decalage = 0;

  for (const [nom, texte] of fichiers) {
    const nomOctets = encodeur.encode(nom);
    const donnees = encodeur.encode(texte);
    const crc = crc32(donnees);

    const entete = new DataView(new ArrayBuffer(30));
    entete.setUint32(0, 0x04034b50, true);
    entete.setUint16(4, 20, true);
    entete.setUint16(6, 0x0800, true); // noms en UTF-8
    entete.setUint16(8, 0, true); // stocké
    entete.setUint16(10, 0, true);
    entete.setUint16(12, 0x21, true); // date fixe : 1er janvier 1980
    entete.setUint32(14, crc, true);
    entete.setUint32(18, donnees.length, true);
    entete.setUint32(22, donnees.length, true);
    entete.setUint16(26, nomOctets.length, true);
    entete.setUint16(28, 0, true);
    morceaux.push(new Uint8Array(entete.buffer), nomOctets, donnees);

    const entree = new DataView(new ArrayBuffer(46));
    entree.setUint32(0, 0x02014b50, true);
    entree.setUint16(4, 20, true);
    entree.setUint16(6, 20, true);
    entree.setUint16(8, 0x0800, true);
    entree.setUint16(10, 0, true);
    entree.setUint16(12, 0, true);
    entree.setUint16(14, 0x21, true);
    entree.setUint32(16, crc, true);
    entree.setUint32(20, donnees.length, true);
    entree.setUint32(24, donnees.length, true);
    entree.setUint16(28, nomOctets.length, true);
    entree.setUint32(42, decalage, true);
    centrale.push(new Uint8Array(entree.buffer), nomOctets);

    decalage += 30 + nomOctets.length + donnees.length;
  }

  const tailleCentrale = centrale.reduce((s, x) => s + x.length, 0);
  const fin = new DataView(new ArrayBuffer(22));
  fin.setUint32(0, 0x06054b50, true);
  fin.setUint16(8, fichiers.length, true);
  fin.setUint16(10, fichiers.length, true);
  fin.setUint32(12, tailleCentrale, true);
  fin.setUint32(16, decalage, true);

  const tout = [...morceaux, ...centrale, new Uint8Array(fin.buffer)];
  const resultat = new Uint8Array(tout.reduce((s, x) => s + x.length, 0));
  let pos = 0;
  for (const x of tout) {
    resultat.set(x, pos);
    pos += x.length;
  }
  return resultat;
}

// ---------- Feuille ----------

function xml(texte) {
  return String(texte).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Styles : numéro = position dans cellXfs (voir STYLES plus bas).
const S = {
  normal: 0,
  gras: 1,
  titre: 2,
  euro: 3,
  euroGras: 4,
  pct: 5,
  saisieEuro: 6,
  saisiePct: 7,
  saisieNombre: 8,
  entete: 9,
  nombre: 10,
  note: 11,
  retrait: 12,
  nombreGras: 13,
  pctGras: 14,
};

const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<numFmts count="3"><numFmt numFmtId="164" formatCode="#,##0\\ &quot;€&quot;"/><numFmt numFmtId="165" formatCode="0.0%"/><numFmt numFmtId="166" formatCode="#,##0"/></numFmts>
<fonts count="5">
<font><sz val="11"/><name val="Calibri"/></font>
<font><b/><sz val="11"/><name val="Calibri"/></font>
<font><b/><sz val="14"/><name val="Calibri"/></font>
<font><sz val="11"/><color rgb="FF1F4E9E"/><name val="Calibri"/></font>
<font><i/><sz val="10"/><color rgb="FF5F5E5A"/><name val="Calibri"/></font>
</fonts>
<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF1EFE8"/><bgColor indexed="64"/></patternFill></fill></fills>
<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="15">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
<xf numFmtId="164" fontId="1" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1"/>
<xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
<xf numFmtId="164" fontId="3" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1"/>
<xf numFmtId="165" fontId="3" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1"/>
<xf numFmtId="166" fontId="3" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1"/>
<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>
<xf numFmtId="166" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
<xf numFmtId="0" fontId="4" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment indent="1"/></xf>
<xf numFmtId="166" fontId="1" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1"/>
<xf numFmtId="165" fontId="1" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1"/>
</cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;

const LETTRES = ['A', 'B', 'C', 'D'];

// Construit la feuille ligne par ligne. `ligne(...)` renvoie le numéro de la ligne créée.
function construireFeuille() {
  const lignes = [];
  return {
    ligne(cellules) {
      lignes.push(cellules);
      return lignes.length;
    },
    vide() {
      lignes.push([]);
      return lignes.length;
    },
    suivante() {
      return lignes.length + 1;
    },
    xml() {
      const rangees = lignes
        .map((cellules, i) => {
          const n = i + 1;
          const contenu = cellules
            .map((c, j) => {
              if (!c) return '';
              const ref = `${LETTRES[j]}${n}`;
              const style = c.s ? ` s="${c.s}"` : '';
              if (c.f !== undefined) {
                const v = Number.isFinite(c.v) ? `<v>${c.v}</v>` : '';
                return `<c r="${ref}"${style}><f>${xml(c.f)}</f>${v}</c>`;
              }
              if (typeof c.v === 'number') return `<c r="${ref}"${style}><v>${c.v}</v></c>`;
              return `<c r="${ref}"${style} t="inlineStr"><is><t xml:space="preserve">${xml(c.v)}</t></is></c>`;
            })
            .join('');
          return `<row r="${n}">${contenu}</row>`;
        })
        .join('');
      return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0" showGridLines="0"/></sheetViews><cols><col min="1" max="1" width="48" customWidth="1"/><col min="2" max="4" width="20" customWidth="1"/></cols><sheetData>${rangees}</sheetData></worksheet>`;
    },
  };
}

const texte = (v, s = S.normal) => ({ v, s });
const nb = (v, s) => ({ v, s });
const fm = (f, v, s) => ({ f, v, s });

// Renvoie le classeur sous forme d'octets (Uint8Array), prêt à être téléchargé.
export function construireXlsx(scenario, nom = 'Scénario') {
  const h = scenario.hyp;
  const r = calculer(scenario);
  const k = coutCredit(h);
  const f = construireFeuille();

  f.ligne([texte(`Bilan d'opération — ${nom}`, S.titre)]);
  f.ligne([texte("Scénario d'étude préparé dans Oinarri. Les valeurs sont à remplacer par les vôtres ; les cellules en bleu sont les hypothèses modifiables, tout le reste se recalcule.", S.note)]);
  f.ligne([texte('Montants en euros hors taxes. Ratios au m² de surface utile (SU).', S.note)]);
  f.vide();

  // --- Hypothèses ---
  f.ligne([texte('Hypothèses', S.entete), texte('', S.entete), texte('', S.entete), texte('', S.entete)]);
  const rPrix = f.ligne([texte('Prix de vente HT (€ par m² SU)'), nb(h.prixM2, S.saisieEuro)]);
  const rSurf = f.ligne([texte('Surface utile (m²)'), nb(h.surface, S.saisieNombre)]);
  const rTva = f.ligne([texte('TVA sur les ventes (0,2 ou 0,055)'), nb(h.tva, S.saisiePct)]);
  const rTaux = f.ligne([texte("Taux d'intérêt du crédit"), nb(h.taux, S.saisiePct)]);
  const rDuree = f.ligne([texte('Durée du chantier et du portage (mois)'), nb(h.duree, S.saisieNombre)]);
  const rRetard = f.ligne([texte('Retard (mois)'), nb(h.retard, S.saisieNombre)]);
  const rFp = f.ligne([texte('Part de fonds propres (dans les dépenses totales)'), nb(h.fondsPropres, S.saisiePct)]);
  const rTirage = f.ligne([texte('Tirage moyen du crédit pendant la durée prévue'), nb(h.tirage, S.saisiePct)]);
  const rCible = f.ligne([texte('Marge cible (part des recettes), pour le bilan à rebours'), nb(h.margeCible, S.saisiePct)]);
  const B = (n) => `$B$${n}`;
  const rK = f.ligne([
    texte('Coût du crédit par euro emprunté (intérêts)'),
    fm(`${B(rTaux)}*(${B(rDuree)}/12*${B(rTirage)}+${B(rRetard)}/12)`, k, S.pct),
  ]);
  f.vide();

  // --- Recettes ---
  f.ligne([texte('Recettes', S.entete), texte('', S.entete), texte('', S.entete), texte('', S.entete)]);
  const rCa = f.ligne([
    texte("Chiffre d'affaires HT", S.gras),
    fm(`${B(rPrix)}*${B(rSurf)}`, r.recettes, S.euroGras),
  ]);
  f.ligne([texte('Prix de vente TTC (€ par m² SU)'), fm(`${B(rPrix)}*(1+${B(rTva)})`, r.prixTtcM2, S.euro)]);
  f.vide();

  // --- Dépenses ---
  f.ligne([
    texte('Dépenses HT', S.entete),
    texte('Montant', S.entete),
    texte('€ par m² SU', S.entete),
    texte('% des dépenses', S.entete),
  ]);

  // Première passe : numéros de lignes. Les lignes sont créées dans l'ordre, donc calculables à l'avance.
  let n = f.suivante();
  const dispo = [];
  for (const p of POSTES) {
    const ligneP = n++;
    const sous = p.sous.map((s) => ({ id: s.id, ligne: n++, calcule: !!s.calcule }));
    dispo.push({ poste: p, ligne: ligneP, sous });
  }
  const rTotal = n; // ligne du total des dépenses
  const rD0 = n + 1; // ligne des dépenses hors intérêts

  // Plages des dépenses hors intérêts : chaque poste, sauf la ligne d'intérêts.
  const plages = [];
  for (const d of dispo) {
    const saisies = d.sous.filter((s) => !s.calcule);
    if (!saisies.length) continue;
    const premiere = saisies[0].ligne;
    const derniere = saisies[saisies.length - 1].ligne;
    plages.push(premiere === derniere ? `B${premiere}` : `B${premiere}:B${derniere}`);
  }
  const refD0 = `$B$${rD0}`;
  const refTotal = `$B$${rTotal}`;
  const SU = B(rSurf);

  for (const d of dispo) {
    const calcP = r.postes.find((p) => p.id === d.poste.id);
    const ligneP = d.ligne;
    f.ligne([
      texte(d.poste.libelle, S.gras),
      fm(`SUM(B${d.sous[0].ligne}:B${d.sous[d.sous.length - 1].ligne})`, calcP.total, S.euroGras),
      fm(`IF(${SU}>0,B${ligneP}/${SU},0)`, calcP.parM2, S.nombreGras),
      fm(`IF(${refTotal}>0,B${ligneP}/${refTotal},0)`, calcP.part, S.pctGras),
    ]);
    for (const s of d.sous) {
      const calcS = calcP.sous.find((x) => x.id === s.id);
      const libelle = d.poste.sous.find((x) => x.id === s.id).libelle;
      let cellule;
      if (s.calcule) {
        cellule = fm(`(1-${B(rFp)})*${B(rK)}*${refD0}/(1-(1-${B(rFp)})*${B(rK)})`, calcS.montant, S.euro);
      } else {
        cellule = nb(scenario.montants[`${d.poste.id}.${s.id}`] ?? 0, S.saisieEuro);
      }
      f.ligne([
        texte(libelle, S.retrait),
        cellule,
        fm(`IF(${SU}>0,B${s.ligne}/${SU},0)`, calcS.parM2, S.nombre),
        fm(`IF(${refTotal}>0,B${s.ligne}/${refTotal},0)`, r.depenses > 0 ? calcS.montant / r.depenses : 0, S.pct),
      ]);
    }
  }

  f.ligne([
    texte('Total des dépenses', S.gras),
    fm(dispo.map((d) => `B${d.ligne}`).join('+'), r.depenses, S.euroGras),
    fm(`IF(${SU}>0,B${rTotal}/${SU},0)`, r.prixRevientM2, S.nombreGras),
  ]);
  f.ligne([
    texte('dont dépenses hors intérêts (sert au calcul des intérêts)', S.note),
    fm(`SUM(${plages.join(',')})`, r.d0, S.euro),
  ]);
  f.vide();

  // --- Résultat ---
  f.ligne([texte('Résultat', S.entete), texte('', S.entete), texte('', S.entete), texte('', S.entete)]);
  const rMarge = f.ligne([texte('Marge', S.gras), fm(`B${rCa}-B${rTotal}`, r.marge, S.euroGras)]);
  f.ligne([texte('Marge en % des recettes'), fm(`IF(B${rCa}>0,B${rMarge}/B${rCa},0)`, r.margePct, S.pct)]);
  f.ligne([texte('Prix de revient HT (€ par m² SU)'), fm(`IF(${SU}>0,B${rTotal}/${SU},0)`, r.prixRevientM2, S.nombre)]);
  f.vide();

  // --- Plan de financement ---
  f.ligne([texte('Plan de financement', S.entete), texte('', S.entete), texte('', S.entete), texte('', S.entete)]);
  const rCredit = f.ligne([texte('Crédit'), fm(`(1-${B(rFp)})*B${rTotal}`, r.credit, S.euro)]);
  f.ligne([texte('Fonds propres'), fm(`B${rTotal}-B${rCredit}`, r.fondsPropres, S.euro)]);
  f.ligne([texte('Total des ressources', S.gras), fm(`B${rTotal}`, r.depenses, S.euroGras)]);
  f.vide();

  // --- Bilan à rebours ---
  const a0 = chargeFonciere(scenario, 0);
  const a1 = chargeFonciere(scenario, h.margeCible);
  f.ligne([
    texte('Bilan à rebours (charge foncière maximale)', S.entete),
    texte('Marge nulle', S.entete),
    texte('Marge cible', S.entete),
    texte('', S.entete),
  ]);
  const rVisee = f.ligne([texte('Marge visée (part des recettes)'), nb(0, S.pct), fm(B(rCible), h.margeCible, S.pct)]);
  const foncierTotal = `$B$${dispo[0].ligne}`;
  const autresFrais = `($B$${dispo[0].ligne}-$B$${dispo[0].sous[0].ligne})`;
  const formuleCharge = (col) =>
    `$B$${rCa}*(1-${col}${rVisee})*(1-(1-${B(rFp)})*${B(rK)})-(${refD0}-${foncierTotal})`;
  const rCharge = f.ligne([
    texte('Charge foncière maximale, tout compris', S.gras),
    fm(formuleCharge('B'), a0.chargeMax, S.euroGras),
    fm(formuleCharge('C'), a1.chargeMax, S.euroGras),
  ]);
  f.ligne([
    texte('par m² SU'),
    fm(`IF(${SU}>0,B${rCharge}/${SU},0)`, a0.chargeMaxM2, S.nombre),
    fm(`IF(${SU}>0,C${rCharge}/${SU},0)`, a1.chargeMaxM2, S.nombre),
  ]);
  f.ligne([
    texte("Prix d'acquisition maximal (autres frais de foncier inchangés)"),
    fm(`B${rCharge}-${autresFrais}`, a0.acquisitionMax, S.euro),
    fm(`C${rCharge}-${autresFrais}`, a1.acquisitionMax, S.euro),
  ]);
  f.ligne([
    texte('Écart avec le foncier actuel'),
    fm(`B${rCharge}-${foncierTotal}`, a0.ecart, S.euro),
    fm(`C${rCharge}-${foncierTotal}`, a1.ecart, S.euro),
  ]);
  f.vide();

  // --- Retard ---
  const ret = effetRetard(scenario);
  f.ligne([texte('Effet du retard', S.entete), texte('', S.entete), texte('', S.entete), texte('', S.entete)]);
  const kSans = `${B(rTaux)}*${B(rDuree)}/12*${B(rTirage)}`;
  const rSans = f.ligne([
    texte('Marge sans retard'),
    fm(`B${rCa}-${refD0}/(1-(1-${B(rFp)})*${kSans})`, ret.margeSansRetard, S.euro),
  ]);
  f.ligne([texte('Coût du retard saisi'), fm(`B${rSans}-B${rMarge}`, ret.coutDuRetard, S.euro)]);

  const fichiers = [
    [
      '[Content_Types].xml',
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`,
    ],
    [
      '_rels/.rels',
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    ],
    [
      'xl/workbook.xml',
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Bilan" sheetId="1" r:id="rId1"/></sheets><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>`,
    ],
    [
      'xl/_rels/workbook.xml.rels',
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
    ],
    ['xl/styles.xml', STYLES],
    ['xl/worksheets/sheet1.xml', f.xml()],
  ];
  return zip(fichiers);
}
