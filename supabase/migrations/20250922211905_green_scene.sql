/*
  # Ajouter option logo dans le profil

  1. Modifications
    - Ajouter colonne `logo_type` (text ou icon)
    - Ajouter colonne `logo_text` pour le texte personnalisé
    - Ajouter colonne `logo_icon` pour l'icône choisie

  2. Valeurs par défaut
    - logo_type: 'text' (par défaut texte)
    - logo_text: nom du profil
    - logo_icon: 'User' (icône par défaut)
*/

-- Ajouter les colonnes pour la gestion du logo
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS logo_type text DEFAULT 'text',
ADD COLUMN IF NOT EXISTS logo_text text DEFAULT 'Portfolio',
ADD COLUMN IF NOT EXISTS logo_icon text DEFAULT 'User';

-- Mettre à jour les profils existants avec le nom comme logo_text
UPDATE profiles 
SET logo_text = name 
WHERE logo_text = 'Portfolio' AND name IS NOT NULL;