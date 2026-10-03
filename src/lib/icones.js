// Icônes de l'application, servies publiquement par le Worker.
// Pourquoi ici et pas dans public/ : les images PNG ne peuvent pas être publiées par le connecteur
// (texte seulement). Elles sont donc stockées en base64 et décodées à la demande.
// Les icônes doivent être publiques : iOS les télécharge sans cookie de session.

const ICONES = {
  '/apple-touch-icon.png':
    'iVBORw0KGgoAAAANSUhEUgAAALQAAAC0BAMAAADP4xsBAAAAMFBMVEX7+fLx7+jw7+jU0sq2tKu0sqq0sqmcm5OJiIGIh4B7enM2NjMuLissLCssLConJyaXDl+ZAAACkklEQVR42u3Yv2sUQRQH8Jk9DSLu7R4n2CQ6XiyPFCqmUhQi2CgIgq2F4q/O2kILOxH/ALGwj2DA6tQTLKz8cWfanLt7gqRIshmbIGbGOsT58WZd8Md322E/95h578275ausridioEGDBg0aNGjQoEGDBg0aNGjQoP98eodjXWXmqEQlWo2PGNc2h6IKPe7ee21Yalw7K63vcusXM5VcfWyOqpeIcDr/cu6g+Xe/FzKYVmxuvTS/Wr60hm1Pvj1Ds8z0/ofhe52PL2nbuxtSBke9mliXNytUY8Zqo2vsIWl9tKNL7AzPELWraTvHdPcgPEMmrFuiLw8rFPqzJ9pYNK1iI7zQmYr3Raa49efbd6rQjbc3TLkdnXn+oULnY6rdM20Iv/CuU6FfMzYy3zIO2UmzkXHFIbtpjDig/6lxcuQpdMi0pcK3PisRsRpVu/feS54+pAWNzpfve0Y9e1eSaJVc9z3g0c0DgpIhxYvCNxHEoxlS8vEl4Z2+P2RGoFV34J+/UwNS1Don1EZZXzVm9dE1Ri1oGUKZUVMKHS3O+MtFQtuQw5l/8zxBqsapOeUrqytDYnv6+sCTnlgw/Fc3NtVk/pWXvPd03KFdBdGni20v+mgsqYOZyjp+W10I+szndzl2ME6C/t9plQU4mU/JqEbcJ8uNkx+Fuz2NJ5+ukWm+cl46o1bJfMiG8GPbvvlto/PlQRpAa3lLuo6xm4XIjDffZA5a6fXAXFsTDvpbPw2T+VLTQZc6tEK0s2TKv7LQ09rolIdK3EXHpwI3W0+7SibiSWDULVfJsEURFLaWx509pMb2xPLJfkBTbXk01d93FfxiMDMPiLYLTGDmAw0aNGjQoEGDBg0aNGjQoEGDBr31+QlIfsgfsnTXNAAAAABJRU5ErkJggg==',
  '/icon-192.png':
    'iVBORw0KGgoAAAANSUhEUgAAAMAAAADABAMAAACg8nE0AAAAMFBMVEX+/PXx7+jPzcW1s6q0sqmmpJ2NjIWKiYKIh4CIh3+Af3hGRUIvLy0tLSssLColJSMAplriAAAC10lEQVR42u3YvW8TMRQA8HNSFqTc+XoVCzS5HLCh0ooCU/hSKiGmSoCEmJD4M5AQAxKszFWHbkxRdz7ExkACJTNqeqQbas6+VEVQOLMHat/zw6gS79ZL/Muz/Z6fw0ae26fiEUAAAQQQQAABBBBAAAEEEEAAAQQQQAABgGfK+ImR0LxkTdPXmelPwVHEda97CTKCIvq0onm9dOtDjIsg/XpDO0V313IUUASnpfYDotOIMUD6eZnrf+G3PEcASi1K0zbpBLF9HqijqWl89QizBmK4bMyT7zK3j0Bm5lTdR5WKdTPw8z+vpuY19qoYIAjNwBEM4J8XxjxY7CMAttcw1ntUojmvRe6rqfPzwCuqjk809JlsBJx3FdTZEUCA2/tBVnoUxi2AUSUsDahBE1wqimptozRQnT+wqB4YwfjLiig/RbdvbnFYBGL2uoCs5YPLDBYBey5DCPA05hyyTYvjzzhoN9bWYGsw3IaN77F39RwSAV+HJtR+XwCA4sRHKOBL4bhUCFAtUnDgDXccAayaMvhIV5yXa8giV8YN6PAMlsnpPSiw1wIB9SUBG18lErYGu8A5kvdT2C7Kn2SAGFR2sRXDzgNVebu6VX6zX3g8AAJelnQBJ9q5goHb90FSvmKrzWmL+0FWvm0JQ7qAEEDAYbuAZNajhWUAJRNrYCS5GZD1l9bAzFzKjUC9A6jTE09bzJkjePEqOWkLdHeDyebit2r64+GC/SKz2rGrTL9NZXfefnxPjV8b8kDN9gVm16szk9+fjKBIcXklMq4F2EaAA6q9QAvInfgvt8AV/M3jcFXTIBJuAdVE7iK1IPVTFCJ/sB/p84CNWxwzPhs2DIssI9QcBflZrq+m/rWdISKG93dSA8C2T4me/Qy1L0nTeeBzNmN/JrcH3NhdZ9OIKdoMS7TviPPgD7t8qlTvQa0jAQQQQAABBBBAAAEEEEAAAQQQQAABBPwr4BeX6dtnyeeycAAAAABJRU5ErkJggg==',
};

function decoder(base64) {
  const binaire = atob(base64);
  const octets = new Uint8Array(binaire.length);
  for (let i = 0; i < binaire.length; i++) octets[i] = binaire.charCodeAt(i);
  return octets;
}

// Renvoie la réponse PNG si le chemin est une icône, sinon null.
export function reponseIcone(chemin, methode) {
  const base64 = ICONES[chemin];
  if (!base64 || (methode !== 'GET' && methode !== 'HEAD')) return null;
  return new Response(methode === 'HEAD' ? null : decoder(base64), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
