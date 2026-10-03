// Sommaire d'un cours : liste des sections (h2), affichée dans la marge gauche sur grand écran.
// Construit côté navigateur à partir des titres du cours, et met en évidence la section en cours de lecture.

const cours = document.querySelector('.cours');
const nav = document.getElementById('sommaire');

if (cours && nav) {
  const titres = [...cours.querySelectorAll('h2')];

  if (titres.length > 1) {
    titres.forEach((h, i) => {
      if (!h.id) h.id = `section-${i + 1}`;
    });

    const titre = document.createElement('p');
    titre.className = 'sommaire-titre';
    titre.textContent = 'Dans ce chapitre';

    const liste = document.createElement('ol');
    liste.className = 'sommaire-liste';
    const liens = new Map();

    for (const h of titres) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${h.id}`;
      a.textContent = h.textContent;
      li.append(a);
      liste.append(li);
      liens.set(h.id, a);
    }

    nav.append(titre, liste);
    nav.hidden = false;

    // La section affichée est celle dont le titre a le plus récemment franchi le haut de l'écran.
    const observateur = new IntersectionObserver(
      (entrees) => {
        for (const e of entrees) {
          if (e.isIntersecting) {
            for (const a of liens.values()) a.removeAttribute('aria-current');
            liens.get(e.target.id)?.setAttribute('aria-current', 'true');
          }
        }
      },
      { rootMargin: '0px 0px -75% 0px' },
    );
    titres.forEach((h) => observateur.observe(h));
  }
}
