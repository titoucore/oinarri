-- Glossaire personnel (lot 4). Déjà appliquée sur la base oinarri-db le 3 octobre 2026.
-- Un terme ajouté par l'utilisateur depuis un cours, avec sa définition.
-- `cle` est le terme sous forme comparable (sans accent ni majuscule) : un terme n'existe qu'une fois par utilisateur.

CREATE TABLE IF NOT EXISTS termes_perso (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  utilisateur_id INTEGER NOT NULL,
  cle TEXT NOT NULL,
  terme TEXT NOT NULL,
  categorie TEXT NOT NULL DEFAULT 'Concepts',
  definition TEXT NOT NULL,
  cree_le TEXT NOT NULL DEFAULT (datetime('now')),
  mis_a_jour TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (utilisateur_id, cle)
);
