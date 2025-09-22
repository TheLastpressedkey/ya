/*
  # Créer le bucket de stockage pour les images

  1. Bucket
    - Créer le bucket 'portfolio-images' pour stocker les images des projets
    - Configurer les permissions publiques pour la lecture
    - Permettre l'upload pour les utilisateurs authentifiés

  2. Policies
    - Lecture publique des images
    - Upload/modification pour les utilisateurs authentifiés
*/

-- Créer le bucket de stockage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-images',
  'portfolio-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
);

-- Politique pour permettre la lecture publique
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-images');

-- Politique pour permettre l'upload aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-images');

-- Politique pour permettre la mise à jour aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-images');

-- Politique pour permettre la suppression aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-images');