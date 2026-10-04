-- Rôle des comptes : 'admin' ou 'lecteur'.
-- Appliquée en production le 2026-10-04 (le compte n° 1 est administrateur).
ALTER TABLE utilisateurs ADD COLUMN role TEXT NOT NULL DEFAULT 'lecteur';
UPDATE utilisateurs SET role = 'admin' WHERE id = 1;
