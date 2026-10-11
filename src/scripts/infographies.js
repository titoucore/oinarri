// Page /infographies/ : filtres et export PNG des schémas.
// Le téléchargement SVG est un simple lien. Le PNG est fabriqué dans le navigateur :
// le SVG est dessiné sur un canvas (deux fois sa taille, pour rester net), puis enregistré.
// Les polices du site ne sont pas disponibles pour un SVG chargé comme image : le PNG utilise
// la police système de remplacement, ce qui peut légèrement changer la largeur des textes.

const cartes = [...document.querySelectorAll('.ig-carte')];
const puces = [...document.querySelectorAll('.ig-puce')];
const champ = document.getElementById('ig-recherche');
const compte = document.getElementById('ig-compte');
const vide = document.getElementById('ig-vide');
const erreur = document.getElementById('ig-erreur');

const etat = { parcours: '', recherche: '' };

const normaliser = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function appliquer() {
  const mots = normaliser(etat.recherche).split(/\s+/).filter(Boolean);
  let visibles = 0;
  for (const carte of cartes) {
    const bonParcours = !etat.parcours || carte.dataset.parcours === etat.parcours;
    const texte = normaliser(carte.dataset.texte || '');
    const bonTexte = mots.every((m) => texte.includes(m));
    const visible = bonParcours && bonTexte;
    carte.hidden = !visible;
    if (visible) visibles += 1;
  }
  compte.textContent = `${visibles} schéma${visibles > 1 ? 's' : ''}`;
  vide.hidden = visibles > 0;
  for (const p of puces) p.setAttribute('aria-pressed', String(p.dataset.parcours === etat.parcours));
}

for (const p of puces) {
  p.addEventListener('click', () => {
    etat.parcours = p.dataset.parcours || '';
    appliquer();
  });
}
champ.addEventListener('input', () => {
  etat.recherche = champ.value;
  appliquer();
});

// ---------- Export PNG ----------

function dimensions(svg) {
  const vb = svg.match(/viewBox="\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)\s*"/);
  return vb ? { l: Number(vb[1]), h: Number(vb[2]) } : { l: 680, h: 400 };
}

async function telechargerPng(bouton) {
  const src = bouton.dataset.src;
  const nom = bouton.dataset.nom;
  bouton.disabled = true;
  erreur.hidden = true;
  try {
    const reponse = await fetch(src);
    if (!reponse.ok) throw new Error('lecture');
    const svg = await reponse.text();
    const { l, h } = dimensions(svg);
    const echelle = 2;

    const blobSvg = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const adresse = URL.createObjectURL(blobSvg);
    const image = new Image();
    await new Promise((resolu, rejete) => {
      image.onload = resolu;
      image.onerror = rejete;
      image.src = adresse;
    });

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(l * echelle);
    canvas.height = Math.round(h * echelle);
    const contexte = canvas.getContext('2d');
    contexte.fillStyle = '#ffffff';
    contexte.fillRect(0, 0, canvas.width, canvas.height);
    contexte.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(adresse);

    const blobPng = await new Promise((resolu) => canvas.toBlob(resolu, 'image/png'));
    if (!blobPng) throw new Error('export');
    const lien = document.createElement('a');
    lien.href = URL.createObjectURL(blobPng);
    lien.download = `${nom}.png`;
    document.body.append(lien);
    lien.click();
    lien.remove();
    setTimeout(() => URL.revokeObjectURL(lien.href), 1000);
  } catch {
    erreur.textContent = "Le PNG n'a pas pu être créé. Télécharge le SVG, qui contient le même schéma.";
    erreur.hidden = false;
  }
  bouton.disabled = false;
}

for (const b of document.querySelectorAll('.ig-png')) {
  b.hidden = false;
  b.addEventListener('click', () => telechargerPng(b));
}

appliquer();
