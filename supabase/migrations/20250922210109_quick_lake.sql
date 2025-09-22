/*
  # Ajouter l'image d'accueil et les catégories

  1. Modifications
    - Ajouter `hero_image_url` à la table `profiles`
    - La table `project_categories` existe déjà dans le schéma

  2. Sécurité
    - Maintenir les politiques RLS existantes
*/

-- Ajouter la colonne hero_image_url à la table profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'hero_image_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN hero_image_url text;
  END IF;
END $$;