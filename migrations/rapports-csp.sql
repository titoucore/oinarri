-- Signalements de la politique de sécurité du contenu (CSP) : ce que le navigateur aurait bloqué.
-- Table temporaire, utilisée pendant la phase d'observation. Plafonnée à 300 lignes par le Worker.
-- À supprimer une fois la CSP activée et stable : DROP TABLE rapports_csp;

CREATE TABLE IF NOT EXISTS rapports_csp (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  directive TEXT,
  bloque TEXT,
  page TEXT,
  extrait TEXT,
  cree_le TEXT NOT NULL
);
