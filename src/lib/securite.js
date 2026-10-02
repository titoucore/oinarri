// Outils de sécurité du Worker : jetons, empreintes, hachage des mots de passe.
// Tout repose sur l'API Web Crypto standard, sans bibliothèque ni algorithme maison.

const encodeur = new TextEncoder();

export function enOctets(texte) {
  return encodeur.encode(texte);
}

export function versBase64url(octets) {
  let binaire = '';
  for (const octet of octets) binaire += String.fromCharCode(octet);
  return btoa(binaire).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function depuisBase64url(texte) {
  const b64 = texte
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(texte.length / 4) * 4, '=');
  const binaire = atob(b64);
  const octets = new Uint8Array(binaire.length);
  for (let i = 0; i < binaire.length; i++) octets[i] = binaire.charCodeAt(i);
  return octets;
}

function versHex(octets) {
  return [...octets].map((o) => o.toString(16).padStart(2, '0')).join('');
}

// Jeton aléatoire (32 octets = 256 bits par défaut), prêt à mettre dans un cookie ou un lien.
export function jetonAleatoire(octets = 32) {
  return versBase64url(crypto.getRandomValues(new Uint8Array(octets)));
}

// Empreinte d'un jeton : c'est elle, et jamais le jeton, qui est stockée en base.
// Un jeton de 256 bits aléatoires n'a pas besoin d'un hachage lent.
export async function sha256Hex(texte) {
  return versHex(new Uint8Array(await crypto.subtle.digest('SHA-256', enOctets(texte))));
}

// Empreinte signée avec un secret : sert à stocker des adresses IP ou e-mails sans les garder en clair.
export async function hmacHex(secret, message) {
  const cle = await crypto.subtle.importKey(
    'raw',
    enOctets(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return versHex(new Uint8Array(await crypto.subtle.sign('HMAC', cle, enOctets(message))));
}

// ---------- Poivre ----------

// Secret serveur (variable PEPPER), appliqué avant le hachage des mots de passe.
// Sans lui, une fuite de la base seule ne permet pas d'attaquer les mots de passe.
// S'il manque ou s'il est trop court, on refuse de continuer plutôt que de hacher sans poivre.
export function obtenirPoivre(env) {
  if (typeof env.PEPPER !== 'string' || env.PEPPER.length < 32) {
    throw new Error('Secret PEPPER absent ou trop court (32 caractères minimum)');
  }
  return env.PEPPER;
}

// ---------- Mots de passe ----------

// Cloudflare plafonne PBKDF2 à 100 000 itérations. Format stocké :
// pbkdf2-sha256$<itérations>$<sel>$<empreinte>
const ALGORITHME = 'pbkdf2-sha256';
const ITERATIONS = 100000;
const SEL_FACTICE = new Uint8Array(16);

export const MOT_DE_PASSE_MIN = 12;
export const MOT_DE_PASSE_MAX = 128;

// Normalise puis protège le mot de passe par le poivre (HMAC), puis dérive la clé (PBKDF2).
async function deriver(motDePasse, sel, iterations, poivre) {
  const cleHmac = await crypto.subtle.importKey(
    'raw',
    enOctets(poivre),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const prehache = new Uint8Array(
    await crypto.subtle.sign('HMAC', cleHmac, enOctets(motDePasse.normalize('NFKC'))),
  );
  const cle = await crypto.subtle.importKey('raw', prehache, 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: sel, iterations, hash: 'SHA-256' },
    cle,
    256,
  );
  return new Uint8Array(bits);
}

// Comparaison en temps constant (évite de révéler la position du premier octet différent).
function egaux(a, b) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a[i] ^ b[i];
  return difference === 0;
}

export async function hacherMotDePasse(motDePasse, poivre) {
  const sel = crypto.getRandomValues(new Uint8Array(16));
  const empreinte = await deriver(motDePasse, sel, ITERATIONS, poivre);
  return `${ALGORITHME}$${ITERATIONS}$${versBase64url(sel)}$${versBase64url(empreinte)}`;
}

export async function verifierMotDePasse(motDePasse, stocke, poivre) {
  const parties = typeof stocke === 'string' ? stocke.split('$') : [];
  const iterations = Number(parties[1]);
  if (
    parties.length !== 4 ||
    parties[0] !== ALGORITHME ||
    !Number.isInteger(iterations) ||
    iterations < 1 ||
    iterations > ITERATIONS
  ) {
    await verifierFactice(motDePasse, poivre);
    return false;
  }
  const attendu = depuisBase64url(parties[3]);
  const calcule = await deriver(motDePasse, depuisBase64url(parties[2]), iterations, poivre);
  return egaux(attendu, calcule);
}

// Même durée de calcul quand le compte n'existe pas : le temps de réponse ne révèle pas
// si l'adresse e-mail est connue.
export async function verifierFactice(motDePasse, poivre) {
  await deriver(motDePasse, SEL_FACTICE, ITERATIONS, poivre);
}

// Renvoie un message d'erreur lisible, ou null si le mot de passe est acceptable.
// Longueur seulement : pas de règles de composition arbitraires.
export function controlerMotDePasse(motDePasse, email) {
  if (typeof motDePasse !== 'string') return 'Mot de passe invalide.';
  const longueur = [...motDePasse].length;
  if (longueur < MOT_DE_PASSE_MIN) {
    return `Le mot de passe doit contenir au moins ${MOT_DE_PASSE_MIN} caractères.`;
  }
  if (longueur > MOT_DE_PASSE_MAX) {
    return `Le mot de passe ne doit pas dépasser ${MOT_DE_PASSE_MAX} caractères.`;
  }
  if (email && motDePasse.trim().toLowerCase() === email.toLowerCase()) {
    return "Le mot de passe ne doit pas être identique à l'adresse e-mail.";
  }
  return null;
}

// ---------- Adresses e-mail ----------

const EMAIL_VALIDE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Renvoie l'adresse en minuscules, ou null si elle est invalide.
export function normaliserEmail(valeur) {
  if (typeof valeur !== 'string') return null;
  const email = valeur.trim().toLowerCase();
  return email.length <= 254 && EMAIL_VALIDE.test(email) ? email : null;
}
