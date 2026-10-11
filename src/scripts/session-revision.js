// Page /revisions/ : séances de révision espacée.
//
// Trois modes au départ : séance rapide (5 cartes), un chapitre (ou le vocabulaire), mélange.
// Quatre sortes de cartes :
//   - QCM et vrai/faux : on touche sa réponse, la correction est immédiate, la note est automatique ;
//   - vocabulaire : un terme du glossaire, retrouvé à partir de sa définition (ou l'inverse) ;
//   - exercice chiffré : de nouvelles valeurs à chaque tirage, on saisit un résultat ;
//   - question ouverte : on écrit (facultatif), on compare, puis on s'auto-évalue.
// Notes possibles : su, hesite, oublie. Une carte oubliée ou hésitée revient une fois dans la séance
// (« rappel »), sans modifier son calendrier : seule la première réponse compte.

import { LIBELLES } from './progression.js';
import { chargerRevisions, noterCarte, cartesDues } from './revisions.js';
import { EXERCICES, alea } from '../data/exercices.js';

const TAILLE_RAPIDE = 5;
const TAILLE_MELANGE = 20;
const ECART_RAPPEL = 4; // un rappel revient quatre cartes plus loin

// Choix qu'on ne mélange pas : leur sens dépend de leur place (« les deux », « aucune des… »).
const PAS_DE_MELANGE = /^(toutes?|tous|les deux|aucune?\s+des)\b/i;

function el(balise, classe, texte) {
  const noeud = document.createElement(balise);
  if (classe) noeud.className = classe;
  if (texte !== undefined) noeud.textContent = texte;
  return noeud;
}

function bouton(classe, texte, action) {
  const b = el('button', classe, texte);
  b.type = 'button';
  b.addEventListener('click', action);
  return b;
}

function lien(classe, texte, href, nouvelOnglet = false) {
  const a = el('a', classe, texte);
  a.href = href;
  if (nouvelOnglet) {
    a.target = '_blank';
    a.rel = 'noopener';
  }
  return a;
}

function formaterDate(jour) {
  return new Date(`${jour}T00:00:00Z`).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });
}

const nombreFr = (x, decimales = 2) =>
  x.toLocaleString('fr-FR', { minimumFractionDigits: decimales, maximumFractionDigits: decimales });

function melanger(tableau) {
  const t = [...tableau];
  for (let i = t.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}

// "ba-ba/01-qui-intervient#essentiel#0" -> "ba-ba/01-qui-intervient"
const coursDe = (id) => id.split('#')[0];
const hrefDe = (id) => `/${coursDe(id)}/`;

async function demarrer() {
  const zone = document.getElementById('revision');
  const donneesCartes = document.getElementById('cartes-data');
  if (!zone || !donneesCartes) return;

  const cartes = JSON.parse(donneesCartes.textContent || '[]');
  const parId = new Map(cartes.map((c) => [c.carte, c]));
  const cartesVocab = cartes.filter((c) => c.type === 'vocab');
  const groupeDe = (id) => parId.get(id).groupe ?? coursDe(id);

  function message(texte, ...suite) {
    zone.replaceChildren(el('p', 'rev-message', texte), ...suite);
  }

  const donnees = await chargerRevisions();
  if (!donnees) {
    message('Impossible de charger tes révisions pour le moment. Réessaie dans un instant.');
    return;
  }

  const inscrites = donnees.revisions.filter((r) => parId.has(r.carte));
  if (!inscrites.length) {
    message(
      "Aucune carte pour l'instant. Quand tu valides un niveau dans un chapitre, ses questions de quiz, son vocabulaire et ses exercices deviennent des cartes de révision.",
      lien('rev-bouton', 'Aller au B.A.-BA', '/ba-ba/'),
    );
    return;
  }

  const dues = cartesDues(donnees, new Set(parId.keys()));
  if (!dues.length) {
    const prochaine = inscrites.map((r) => r.prochaine_revision).sort()[0];
    message(
      `Rien à réviser aujourd'hui. Prochaine carte le ${formaterDate(prochaine)}.`,
      lien('rev-bouton rev-bouton-secondaire', "Retour à l'accueil", '/'),
    );
    return;
  }

  let ecouteur = null;
  function arreterTouches() {
    if (ecouteur) {
      document.removeEventListener('keydown', ecouteur);
      ecouteur = null;
    }
  }

  // ---------- Préparation des cartes de vocabulaire et des exercices ----------

  // Un terme : on retrouve soit le terme à partir de sa définition, soit la définition à partir du terme.
  function preparerVocab(carte) {
    const voisins = cartesVocab.filter((c) => c.carte !== carte.carte && c.terme !== carte.terme);
    const pool = [
      ...melanger(voisins.filter((c) => c.categorie === carte.categorie)),
      ...melanger(voisins.filter((c) => c.categorie !== carte.categorie)),
    ];
    const sensDefinition = carte.definition.length <= 150 && Math.random() < 0.5;
    const candidats = sensDefinition ? pool.filter((c) => c.definition.length <= 220) : pool;
    const distracteurs = candidats.slice(0, 3);
    const complement = carte.developpe ? `${carte.terme} signifie : ${carte.developpe}.` : null;

    if (sensDefinition) {
      return {
        enonce: `Quelle est la définition de « ${carte.terme} » ?`,
        options: melanger([
          { texte: carte.definition, juste: true },
          ...distracteurs.map((d) => ({ texte: d.definition, juste: false })),
        ]),
        reponse: carte.definition,
        explication: complement,
      };
    }
    return {
      enonce: `Quel terme correspond à cette définition ? ${carte.definition}`,
      options: melanger([
        { texte: carte.terme, juste: true },
        ...distracteurs.map((d) => ({ texte: d.terme, juste: false })),
      ]),
      reponse: carte.terme,
      explication: complement,
    };
  }

  function genererExercice(carte) {
    const exo = EXERCICES.find((e) => e.id === carte.exo);
    return exo ? exo.generer(alea) : null;
  }

  // ---------- Choix de la séance ----------

  function boutonMode(titre, description, action) {
    const b = el('button', 'rev-mode');
    b.type = 'button';
    b.append(el('span', 'rev-mode-titre', titre), el('span', 'rev-mode-desc', description));
    b.addEventListener('click', action);
    return b;
  }

  function menu() {
    arreterTouches();
    zone.replaceChildren();
    zone.append(
      el('p', 'rev-titre', `${dues.length} carte${dues.length > 1 ? 's' : ''} à réviser aujourd'hui`),
      el('p', 'rev-info', 'Choisis ta séance.'),
    );

    const parGroupe = new Map();
    for (const r of dues) {
      const groupe = groupeDe(r.carte);
      if (!parGroupe.has(groupe)) parGroupe.set(groupe, []);
      parGroupe.get(groupe).push(r);
    }

    const modes = el('div', 'rev-modes');
    modes.append(
      boutonMode(
        'Séance rapide',
        `${Math.min(TAILLE_RAPIDE, dues.length)} carte${Math.min(TAILLE_RAPIDE, dues.length) > 1 ? 's' : ''}, les plus anciennes d'abord`,
        () => serie(dues.slice(0, TAILLE_RAPIDE)),
      ),
      boutonMode(
        'Mélange',
        `Jusqu'à ${TAILLE_MELANGE} cartes, tous chapitres confondus`,
        () => serie(melanger(dues.slice(0, TAILLE_MELANGE))),
      ),
      boutonMode(
        'Un chapitre ou le vocabulaire',
        `${parGroupe.size} groupe${parGroupe.size > 1 ? 's' : ''} avec des cartes à réviser`,
        () => menuGroupes(parGroupe),
      ),
    );
    zone.append(modes);
  }

  function menuGroupes(parGroupe) {
    zone.replaceChildren(el('p', 'rev-titre', 'Quel groupe de cartes ?'));
    const liste = el('div', 'rev-modes');
    for (const [, cartesDuGroupe] of parGroupe) {
      const titre = parId.get(cartesDuGroupe[0].carte).titreCours;
      liste.append(
        boutonMode(
          titre,
          `${cartesDuGroupe.length} carte${cartesDuGroupe.length > 1 ? 's' : ''}`,
          () => serie(cartesDuGroupe.slice(0, TAILLE_MELANGE)),
        ),
      );
    }
    zone.append(liste, bouton('rev-lien', 'Retour au choix de la séance', menu));
  }

  // ---------- Déroulement d'une série ----------

  function serie(choisies) {
    const file = choisies.map((r) => ({ id: r.carte, rappel: false }));
    const idsSerie = new Set(choisies.map((r) => r.carte));
    const arevoir = new Map(); // carte -> carte (oubliée ou hésitée)
    let position = 0;
    let faites = 0;
    let sues = 0;

    function passer() {
      position += 1;
      if (position < file.length) afficherCarte();
      else terminerSerie();
    }

    function afficherCarte() {
      arreterTouches();
      const element = file[position];
      const carte = parId.get(element.id);
      let repondue = false;

      // Contenu de la carte selon son type.
      let enonce = carte.enonce;
      let options = null; // cartes à choix : [{ texte, juste }]
      let reponseTexte = carte.reponse;
      let explicationTexte = carte.explication;
      let instance = null; // exercice chiffré
      let origine = `${carte.titreCours} · ${LIBELLES[carte.niveau]}`;

      if (carte.type === 'vf') {
        options = [
          { texte: 'Vrai', juste: carte.reponse === 'Vrai' },
          { texte: 'Faux', juste: carte.reponse === 'Faux' },
        ];
      } else if (carte.type === 'qcm') {
        options = carte.choix.map((texte) => ({ texte, juste: texte === carte.reponse }));
        if (!options.some((o) => PAS_DE_MELANGE.test(o.texte))) options = melanger(options);
      } else if (carte.type === 'vocab') {
        const v = preparerVocab(carte);
        enonce = v.enonce;
        options = v.options;
        reponseTexte = v.reponse;
        explicationTexte = v.explication;
        origine = `Vocabulaire · ${carte.categorie}`;
      } else if (carte.type === 'exercice') {
        instance = genererExercice(carte);
        if (!instance) {
          // Exercice retiré du catalogue : on passe à la carte suivante.
          passer();
          return;
        }
        enonce = instance.enonce;
        origine = `${carte.titreCours} · Exercice`;
      }
      if (element.rappel) origine += ' · Rappel';

      zone.replaceChildren();
      zone.append(el('p', 'rev-progression', `Carte ${position + 1} sur ${file.length}`));
      zone.append(el('p', 'rev-origine', origine));
      zone.append(el('p', 'rev-enonce', enonce));

      const retour = el('div', 'rev-retour');
      retour.tabIndex = -1;

      // Enregistre la note (sauf pour un rappel) puis passe à la carte suivante.
      async function terminerCarte(note, boutons, erreur) {
        for (const b of boutons) b.disabled = true;
        erreur.hidden = true;
        if (!element.rappel) {
          try {
            await noterCarte(carte.carte, note);
          } catch {
            erreur.textContent = "L'enregistrement a échoué. Réessaie.";
            erreur.hidden = false;
            for (const b of boutons) b.disabled = false;
            return;
          }
          faites += 1;
          if (note === 'su') sues += 1;
          else {
            arevoir.set(carte.carte, carte);
            file.splice(Math.min(position + 1 + ECART_RAPPEL, file.length), 0, { id: carte.carte, rappel: true });
          }
        }
        passer();
      }

      function pied() {
        const zoneActions = el('div', 'rev-actions');
        const erreur = el('p', 'rev-erreur');
        erreur.setAttribute('role', 'alert');
        erreur.hidden = true;
        return { zoneActions, erreur, ajouter: (...bs) => zoneActions.append(...bs) };
      }

      function verso(estJuste) {
        const bloc = el('div', 'rev-verso');
        if (estJuste !== undefined) {
          bloc.append(
            el('p', 'rev-resultat', estJuste ? 'Bonne réponse.' : instance ? 'Pas tout à fait.' : "Ce n'est pas la bonne réponse."),
          );
        }
        if (instance) {
          bloc.append(el('p', 'rev-reponse', `Résultat : ${nombreFr(instance.reponse, instance.decimales)} ${instance.unite}`));
          const etapes = el('ul', 'rev-etapes');
          for (const e of instance.etapes) etapes.append(el('li', undefined, e));
          bloc.append(etapes);
        } else if (carte.type === 'ouverte') {
          bloc.append(el('p', 'rev-reponse', reponseTexte));
        } else if (!estJuste) {
          bloc.append(el('p', 'rev-reponse', `Réponse : ${reponseTexte}`));
        }
        if (explicationTexte) bloc.append(el('p', 'rev-explication', explicationTexte));
        bloc.append(
          lien(
            'rev-lien',
            carte.type === 'vocab' ? 'Voir dans le glossaire' : 'Revoir dans le chapitre',
            carte.href ?? hrefDe(carte.carte),
            true,
          ),
        );
        return bloc;
      }

      // Correction commune aux cartes à choix et aux exercices.
      function corriger(estJuste) {
        retour.append(verso(estJuste));
        const { zoneActions, erreur, ajouter } = pied();
        if (element.rappel) {
          const suite = bouton('rev-bouton', 'Carte suivante', () => terminerCarte('su', [suite], erreur));
          ajouter(suite);
        } else if (estJuste) {
          retour.append(el('p', 'rev-info', 'Étais-tu sûr(e) de ta réponse ?'));
          const sur = bouton('rev-bouton', 'Oui, j\u2019en étais sûr(e)', () => terminerCarte('su', [sur, doute], erreur));
          const doute = bouton('rev-bouton rev-bouton-secondaire', 'J\u2019ai hésité ou deviné', () =>
            terminerCarte('hesite', [sur, doute], erreur),
          );
          ajouter(sur, doute);
        } else {
          const suite = bouton('rev-bouton', 'Carte suivante', () => terminerCarte('oublie', [suite], erreur));
          ajouter(suite);
        }
        retour.append(zoneActions, erreur);
        retour.focus();
      }

      if (options) {
        // Cartes à choix : QCM, vrai/faux, vocabulaire.
        const groupe = el('div', 'rev-options');
        groupe.setAttribute('role', 'group');
        groupe.setAttribute('aria-label', 'Réponses possibles');
        const boutonsOptions = options.map((option, i) => {
          const b = el('button', 'rev-option');
          b.type = 'button';
          b.append(el('span', 'rev-option-num', String(i + 1)), el('span', 'rev-option-texte', option.texte));
          b.addEventListener('click', () => repondre(option, b));
          groupe.append(b);
          return b;
        });
        zone.append(groupe, retour);

        function repondre(option, boutonChoisi) {
          if (repondue) return;
          repondue = true;
          arreterTouches();
          options.forEach((o, i) => {
            const b = boutonsOptions[i];
            b.disabled = true;
            if (o.juste) {
              b.classList.add('rev-juste');
              b.querySelector('.rev-option-texte').append(el('span', 'rev-etiquette', 'Bonne réponse'));
            } else if (b === boutonChoisi) {
              b.classList.add('rev-faux');
              b.querySelector('.rev-option-texte').append(el('span', 'rev-etiquette', 'Ta réponse'));
            }
          });
          corriger(option.juste);
        }

        ecouteur = (e) => {
          if (e.altKey || e.ctrlKey || e.metaKey || repondue) return;
          if (e.target instanceof HTMLElement && e.target.matches('input, textarea')) return;
          const n = Number(e.key);
          if (Number.isInteger(n) && n >= 1 && n <= boutonsOptions.length) boutonsOptions[n - 1].click();
        };
        document.addEventListener('keydown', ecouteur);
      } else if (instance) {
        // Exercice chiffré : on saisit un résultat.
        const champ = el('input', 'rev-nombre');
        champ.type = 'text';
        champ.inputMode = 'decimal';
        champ.autocomplete = 'off';
        champ.setAttribute('aria-label', `Ta réponse, en ${instance.unite}`);
        const rangee = el('div', 'rev-saisie-nombre');
        rangee.append(champ, el('span', 'rev-unite', instance.unite));

        const erreurSaisie = el('p', 'rev-erreur');
        erreurSaisie.setAttribute('role', 'alert');
        erreurSaisie.hidden = true;

        function finir(juste) {
          if (repondue) return;
          repondue = true;
          champ.readOnly = true;
          valider.hidden = true;
          sansReponse.hidden = true;
          erreurSaisie.hidden = true;
          corriger(juste);
        }

        function verifier() {
          const brut = champ.value.trim().replace(/\s/g, '').replace(',', '.');
          const valeur = Number(brut);
          if (brut === '' || !Number.isFinite(valeur)) {
            erreurSaisie.textContent = 'Entre un nombre, par exemple 4,5.';
            erreurSaisie.hidden = false;
            champ.focus();
            return;
          }
          finir(Math.abs(valeur - instance.reponse) <= instance.tolerance);
        }

        const valider = bouton('rev-bouton', 'Valider', verifier);
        const sansReponse = bouton('rev-bouton rev-bouton-secondaire', 'Je ne sais pas', () => finir(false));
        champ.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') verifier();
        });

        const actions = el('div', 'rev-actions');
        actions.append(valider, sansReponse);
        zone.append(rangee, erreurSaisie, actions, retour);
        champ.focus();
      } else {
        // Question ouverte : on formule sa réponse, puis on compare.
        const saisie = el('textarea', 'rev-saisie');
        saisie.rows = 3;
        saisie.placeholder = 'Écris ou formule ta réponse (facultatif)';
        saisie.setAttribute('aria-label', 'Ta réponse, facultative');
        const voir = bouton('rev-bouton', 'Voir la réponse', () => {
          voir.hidden = true;
          saisie.readOnly = true;
          retour.append(verso(undefined));
          retour.append(el('p', 'rev-info', 'Compare avec ta réponse. Où en es-tu ?'));
          const { zoneActions, erreur, ajouter } = pied();
          const tous = [];
          const ajoutNote = (classe, texte, note) => {
            const b = bouton(classe, texte, () => terminerCarte(element.rappel ? 'su' : note, tous, erreur));
            tous.push(b);
            ajouter(b);
          };
          ajoutNote('rev-bouton rev-bouton-secondaire', 'Je ne savais pas', 'oublie');
          ajoutNote('rev-bouton rev-bouton-secondaire', "J'ai hésité", 'hesite');
          ajoutNote('rev-bouton', 'Je savais', 'su');
          retour.append(zoneActions, erreur);
          retour.focus();
        });
        zone.append(saisie, voir, retour);
        saisie.focus();
      }

      zone.append(bouton('rev-lien rev-arreter', 'Arrêter la séance', terminerSerie));
    }

    function terminerSerie() {
      arreterTouches();
      zone.replaceChildren();
      zone.append(el('p', 'rev-titre', 'Série terminée'));
      zone.append(el('p', 'rev-score', `${sues} / ${faites}`));
      zone.append(el('p', 'rev-info', 'cartes sues sans hésiter du premier coup.'));

      if (arevoir.size) {
        zone.append(
          el(
            'p',
            'rev-info',
            'À revoir : les cartes oubliées reviennent demain, les cartes hésitées dans quelques jours.',
          ),
        );
        const liste = el('ul', 'rev-choix');
        for (const carte of arevoir.values()) {
          const li = el('li');
          const libelle =
            carte.type === 'vocab' ? carte.terme : carte.type === 'exercice' ? `Exercice : ${carte.titreCours}` : carte.enonce;
          li.append(el('span', undefined, `${libelle} `));
          li.append(
            lien('rev-lien', carte.type === 'vocab' ? 'Glossaire' : 'Chapitre', carte.href ?? hrefDe(carte.carte), true),
          );
          liste.append(li);
        }
        zone.append(liste);
      }

      const restantes = dues.filter((r) => !idsSerie.has(r.carte)).length;
      if (restantes > 0) {
        zone.append(
          el('p', 'rev-info', `Il reste ${restantes} carte${restantes > 1 ? 's' : ''} à réviser aujourd'hui.`),
        );
      }

      const actions = el('div', 'rev-actions');
      if (restantes > 0) actions.append(bouton('rev-bouton', 'Nouvelle séance', () => location.reload()));
      actions.append(lien('rev-bouton rev-bouton-secondaire', "Retour à l'accueil", '/'));
      zone.append(actions);
    }

    afficherCarte();
  }

  menu();
}

demarrer();
