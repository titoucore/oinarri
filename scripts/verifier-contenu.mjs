#!/usr/bin/env node
// Contrôle de cohérence du contenu d'Oinarri.
//
// Ce que le script vérifie (présence et cohérence) :
//   1. chaque chiffre de src/data/chiffres-cles.js : les nombres de sa valeur figurent bien dans chacun
//      de ses chapitres, ses sources et ses chapitres existent ;
//   2. chaque schéma de public/schemas : titre et description présents (accessibilité), nombres affichés
//      retrouvés dans le chapitre du même numéro ou dans les chiffres clés, schémas référencés par un chapitre ;
//   3. les images citées par les chapitres existent ;
//   4. les loyers de zone des exercices de révision concordent avec les chiffres clés ;
//   5. la fraîcheur : chiffres au-delà de leur délai de validité, chapitres dont « verifie_le » est ancien ;
//   6. avec --liens : les adresses des sources répondent.
//
// Ce qu'il ne peut pas vérifier : la VÉRITÉ d'un chiffre (est-ce le bon taux ?). Cela reste un travail
// de relecture et de recherche dans les sources officielles.
//
// Utilisation :
//   node scripts/verifier-contenu.mjs                 rapport en avertissement, ne bloque jamais
//   node scripts/verifier-contenu.mjs --strict        code de sortie 1 s'il y a des erreurs
//   node scripts/verifier-contenu.mjs --liens         ajoute le contrôle des adresses (plus lent)
//   node scripts/verifier-contenu.mjs --rapport=f.md  écrit le rapport en Markdown (seulement s'il y a des points)
//
// Pour dispenser un chiffre du contrôle numérique, on ajoute « sans_controle: 'raison' » à son entrée.
// Pour imposer d'autres signatures que ses nombres, on ajoute « motifs: ['...'] ».
// Pour autoriser dans un schéma un nombre calculé absent du chapitre, on ajoute dans le SVG un commentaire :
//   <!-- verifie: 40 630 = 31 254 × 1,3 -->

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const options = process.argv.slice(2);
const STRICT = options.includes('--strict');
const LIENS = options.includes('--liens');
const rapportArg = options.find((a) => a.startsWith('--rapport='));
const fichierRapport = rapportArg ? rapportArg.slice('--rapport='.length) : null;

const PARCOURS = ['ba-ba', 'promotion', 'logement-social', 'materiaux-biosources'];
const JOURS_CHAPITRE = 120;

const erreurs = [];
const avertissements = [];
const err = (m) => erreurs.push(m);
const avert = (m) => avertissements.push(m);

const chemin = (...p) => path.join(racine, ...p);
const lire = (...p) => fs.readFileSync(chemin(...p), 'utf8');
const existe = (...p) => fs.existsSync(chemin(...p));

const joursDepuis = (jour) => Math.floor((Date.now() - new Date(`${jour}T00:00:00Z`).getTime()) / 86400000);

function decoder(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// Texte sans espaces ni espaces insécables : « 23 403 » et « 23403 » se comparent.
const compact = (s) => s.replace(/[\s\u00a0\u202f]+/g, '');

// Nombres significatifs d'un texte : au moins deux chiffres, ou un nombre décimal.
function nombres(texte) {
  const trouves = new Set();
  for (const m of texte.matchAll(/\d[\d\s\u00a0\u202f]*(?:,\d+)?/g)) {
    const nombre = compact(m[0]);
    if (nombre.length >= 2 || nombre.includes(',')) trouves.add(nombre);
  }
  return [...trouves];
}

function fichiersMarkdown() {
  const liste = [];
  for (const p of PARCOURS) {
    const dossier = chemin('src', 'content', p);
    if (!fs.existsSync(dossier)) continue;
    for (const f of fs.readdirSync(dossier).filter((x) => x.endsWith('.md')).sort()) {
      liste.push({ parcours: p, fichier: f, id: `${p}/${f.replace(/\.md$/, '')}`, chemin: `src/content/${p}/${f}` });
    }
  }
  return liste;
}

const cacheChapitres = new Map();
function texteChapitre(id) {
  if (!cacheChapitres.has(id)) {
    const f = `src/content/${id}.md`;
    cacheChapitres.set(id, existe(f) ? compact(lire(f)) : null);
  }
  return cacheChapitres.get(id);
}

async function main() {
  const { CHIFFRES, VALIDITE_JOURS, SOURCES_CHIFFRES } = await import(
    pathToFileURL(chemin('src', 'data', 'chiffres-cles.js')).href
  );

  const chapitres = fichiersMarkdown();

  // ---------- 1. Chiffres clés ----------
  const ids = new Set();
  const textesChiffres = compact(CHIFFRES.map((c) => `${c.valeur} ${c.contexte ?? ''}`).join(' '));
  const aReverifier = [];
  let sansNombre = 0;

  for (const c of CHIFFRES) {
    if (ids.has(c.id)) err(`Chiffre « ${c.id} » : identifiant en double.`);
    ids.add(c.id);

    for (const s of c.sources ?? []) {
      if (!SOURCES_CHIFFRES[s]) err(`Chiffre « ${c.id} » : source inconnue (${s}).`);
    }
    if (!c.sources?.length) err(`Chiffre « ${c.id} » : aucune source.`);

    if (!c.sans_controle) {
      const motifs = c.motifs ?? nombres(c.valeur);
      if (!motifs.length) sansNombre += 1;
      for (const id of c.chapitres ?? []) {
        const texte = texteChapitre(id);
        if (texte === null) {
          err(`Chiffre « ${c.id} » : chapitre introuvable (${id}).`);
          continue;
        }
        const manquants = motifs.map(compact).filter((m) => !texte.includes(m));
        if (manquants.length) {
          err(`Chiffre « ${c.id} » : ${manquants.join(', ')} absent du chapitre ${id}.`);
        }
      }
    }

    const limite = VALIDITE_JOURS[c.volatilite] ?? 90;
    const age = joursDepuis(c.verifie_le);
    if (age > limite) aReverifier.push(`${c.id} (vérifié il y a ${age} jours, délai ${limite})`);
  }
  if (aReverifier.length) {
    avert(`Chiffres à revérifier (${aReverifier.length}) : ${aReverifier.join(' ; ')}.`);
  }

  // ---------- 2 et 3. Schémas et images des chapitres ----------
  const references = new Set();
  for (const ch of chapitres) {
    const md = lire(ch.chemin);
    for (const m of md.matchAll(/\]\((\/schemas\/[^)\s]+\.svg)\)/g)) {
      references.add(m[1]);
      if (!existe('public', m[1])) err(`Chapitre ${ch.id} : image introuvable (${m[1]}).`);
    }
  }

  for (const p of PARCOURS) {
    const dossier = chemin('public', 'schemas', p);
    if (!fs.existsSync(dossier)) continue;
    for (const f of fs.readdirSync(dossier).filter((x) => x.endsWith('.svg')).sort()) {
      const url = `/schemas/${p}/${f}`;
      const svg = lire('public', 'schemas', p, f);

      if (!/<title>[\s\S]+?<\/title>/.test(svg)) err(`Schéma ${url} : balise <title> absente.`);
      if (!/<desc>[\s\S]+?<\/desc>/.test(svg)) err(`Schéma ${url} : balise <desc> absente.`);
      if (!references.has(url)) avert(`Schéma ${url} : aucun chapitre ne l'affiche.`);

      const numero = (f.match(/^(\d+)-/) ?? [])[1];
      const chapitre = chapitres.find((c) => c.parcours === p && c.fichier.startsWith(`${numero}-`));
      const texteChap = chapitre ? texteChapitre(chapitre.id) : '';

      const autorises = new Set();
      for (const m of svg.matchAll(/<!--\s*verifie:([\s\S]*?)-->/g)) nombres(m[1]).forEach((n) => autorises.add(n));

      const textes = [...svg.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g)]
        .map((m) => decoder(m[1].replace(/<[^>]+>/g, '')))
        .join(' | ');
      const absents = nombres(textes).filter(
        (n) => !autorises.has(n) && !texteChap.includes(n) && !textesChiffres.includes(n),
      );
      if (absents.length) {
        avert(
          `Schéma ${url} : ${absents.join(', ')} introuvable${absents.length > 1 ? 's' : ''} dans le chapitre ${numero} et dans les chiffres clés (valeur calculée ? ajouter un commentaire « verifie: » dans le SVG).`,
        );
      }
    }
  }

  // ---------- 4. Exercices de révision ----------
  if (existe('src', 'data', 'exercices.js')) {
    const source = lire('src', 'data', 'exercices.js');
    for (const m of source.matchAll(/\bv:\s*(\d+\.\d+)/g)) {
      const valeur = Number(m[1]).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      if (!textesChiffres.includes(compact(valeur))) {
        avert(`Exercices : le loyer de zone ${valeur} ne figure pas dans les chiffres clés.`);
      }
    }
  }

  // ---------- 5. Fraîcheur des chapitres ----------
  const anciens = [];
  for (const ch of chapitres) {
    const m = lire(ch.chemin).match(/^verifie_le:\s*(\d{4}-\d{2}-\d{2})/m);
    if (!m) {
      avert(`Chapitre ${ch.id} : champ verifie_le absent.`);
      continue;
    }
    const age = joursDepuis(m[1]);
    if (age > JOURS_CHAPITRE) anciens.push(`${ch.id} (${m[1]})`);
  }
  if (anciens.length) avert(`Chapitres non revérifiés depuis plus de ${JOURS_CHAPITRE} jours : ${anciens.join(' ; ')}.`);

  // ---------- 6. Adresses des sources (option --liens) ----------
  if (LIENS) await controlerLiens(SOURCES_CHIFFRES);

  // ---------- Rapport ----------
  const date = new Date().toISOString().slice(0, 10);
  const lignes = [`# Contrôle du contenu d'Oinarri, ${date}`, ''];
  lignes.push(`${CHIFFRES.length} chiffres, ${chapitres.length} chapitres contrôlés.`);
  if (sansNombre) lignes.push(`${sansNombre} chiffre(s) sans nombre à contrôler (valeur purement textuelle).`);
  lignes.push('');
  lignes.push(`## Erreurs (${erreurs.length})`, '', ...(erreurs.length ? erreurs.map((e) => `- ${e}`) : ['Aucune.']), '');
  lignes.push(
    `## Points à revoir (${avertissements.length})`,
    '',
    ...(avertissements.length ? avertissements.map((a) => `- ${a}`) : ['Aucun.']),
    '',
  );
  lignes.push(
    'Ce contrôle vérifie la cohérence, pas la véracité : un chiffre cohérent peut être périmé ou faux.',
  );
  const rapport = lignes.join('\n');
  console.log(rapport);

  if (fichierRapport && (erreurs.length || avertissements.length)) {
    fs.writeFileSync(chemin(fichierRapport), `${rapport}\n`);
  }
  if (STRICT && erreurs.length) process.exitCode = 1;
}

async function controlerLiens(sources) {
  const adresses = [...new Set(Object.values(sources).map((s) => s.url).filter((u) => /^https?:/.test(u ?? '')))];
  const a_traiter = [...adresses];
  async function verifier(url) {
    const entetes = { 'User-Agent': 'Mozilla/5.0 (compatible; controle-oinarri)' };
    for (const methode of ['HEAD', 'GET']) {
      try {
        const reponse = await fetch(url, {
          method: methode,
          redirect: 'follow',
          headers: entetes,
          signal: AbortSignal.timeout(20000),
        });
        if (reponse.ok) return;
        if (methode === 'HEAD' && [403, 405, 429, 501].includes(reponse.status)) continue;
        if ([403, 429, 999].includes(reponse.status)) {
          avert(`Lien ${url} : accès refusé (${reponse.status}), peut-être un blocage des robots.`);
        } else {
          avert(`Lien ${url} : réponse ${reponse.status}.`);
        }
        return;
      } catch (e) {
        if (methode === 'GET') avert(`Lien ${url} : injoignable (${e.name}).`);
      }
    }
  }
  const travailleurs = Array.from({ length: 6 }, async () => {
    while (a_traiter.length) await verifier(a_traiter.shift());
  });
  await Promise.all(travailleurs);
}

main().catch((e) => {
  console.error('Le contrôle du contenu a rencontré une erreur :', e);
  // En mode normal (avant un build), une panne du contrôle ne doit jamais bloquer la publication.
  if (STRICT) process.exitCode = 1;
});
