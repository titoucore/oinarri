-- Notes et surlignages (lot 3). Déjà appliquée sur la base oinarri-db le 3 octobre 2026.
-- Une ligne = un passage surligné dans un cours, avec la note de l'utilisateur.
-- `passage` est le texte surligné ; `avant` et `apres` sont les quelques mots qui l'entourent,
-- pour retrouver le bon endroit si le même passage apparaît plusieurs fois.

CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  utilisateur_id INTEGER NOT NULL,
  cours TEXT NOT NULL,
  section TEXT,
  passage TEXT NOT NULL,
  avant TEXT NOT NULL DEFAULT '',
  apres TEXT NOT NULL DEFAULT '',
  note TEXT NOT NULL DEFAULT '',
  cree_le TEXT NOT NULL DEFAULT (datetime('now')),
  mis_a_jour TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_notes_utilisateur_cours ON notes (utilisateur_id, cours);
