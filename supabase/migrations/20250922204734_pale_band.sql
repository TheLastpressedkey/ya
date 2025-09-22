/*
  # Configuration du stockage Supabase

  1. Création du bucket
    - Nom: `portfolio-images`
    - Public: true pour les lectures
    - Permissions d'upload pour les utilisateurs authentifiés

  2. Politiques de sécurité
    - Lecture publique pour tous
    - Upload/suppression pour les utilisateurs authentifiés
*/

-- Créer le bucket s'il n'existe pas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-images',
  'portfolio-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Politique pour la lecture publique
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'portfolio-images');

-- Politique pour l'upload par les utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'portfolio-images');

-- Politique pour la suppression par les utilisateurs authentifiés
CREATE POLICY "Authenticated users can delete" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'portfolio-images');

-- Politique pour la mise à jour par les utilisateurs authentifiés
CREATE POLICY "Authenticated users can update" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'portfolio-images');