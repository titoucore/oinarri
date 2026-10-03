-- Scénarios du simulateur de bilan (lot 5). Déjà appliquée sur la base oinarri-db le 3 octobre 2026.
-- Un scénario d'étude (hypothèses et montants) d'un utilisateur, enregistré sous un nom.
-- `donnees` est un JSON versionné : `version_format` permet de relire d'anciens scénarios si la structure du bilan évolue.
-- Règle : uniquement des scénarios d'étude, jamais les données d'une opération réelle.

CREATE TABLE IF NOT EXISTS scenarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  utilisateur_id INTEGER NOT NULL,
  nom TEXT NOT NULL,
  donnees TEXT NOT NULL,
  version_format INTEGER NOT NULL DEFAULT 1,
  cree_le TEXT NOT NULL DEFAULT (datetime('now')),
  mis_a_jour TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (utilisateur_id, nom)
);
