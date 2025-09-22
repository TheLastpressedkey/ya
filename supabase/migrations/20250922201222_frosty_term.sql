/*
  # Ajouter des catégories de projets personnalisables

  1. Nouvelles Tables
    - `project_categories`
      - `id` (uuid, primary key)
      - `name` (text, nom de la catégorie)
      - `description` (text, description optionnelle)
      - `color` (text, couleur pour l'affichage)
      - `order_index` (integer, ordre d'affichage)
      - `created_at` (timestamp)

  2. Modifications
    - Ajouter des données par défaut pour les catégories
    - Mettre à jour les projets existants

  3. Sécurité
    - Enable RLS sur la nouvelle table
    - Ajouter les politiques appropriées
*/

-- Créer la table des catégories de projets
CREATE TABLE IF NOT EXISTS project_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  color text DEFAULT '#8B5CF6',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;

-- Politiques pour les catégories
CREATE POLICY "Public can read project_categories"
  ON project_categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage project_categories"
  ON project_categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insérer les catégories par défaut
INSERT INTO project_categories (name, description, color, order_index) VALUES
  ('Académique', 'Projets réalisés dans le cadre des études', '#8B5CF6', 1),
  ('Personnel', 'Projets personnels et créatifs', '#EC4899', 2),
  ('Concours', 'Participations à des concours d''architecture', '#F59E0B', 3),
  ('Stage', 'Projets réalisés en entreprise', '#10B981', 4),
  ('Recherche', 'Projets de recherche et expérimentation', '#3B82F6', 5)
ON CONFLICT (name) DO NOTHING;

-- Ajouter quelques projets d'exemple avec images
INSERT INTO projects (title, description, category, year, client, location, area, status, featured, images) VALUES
  (
    'Maison Contemporaine Écologique',
    'Conception d''une maison individuelle intégrant des principes de développement durable et d''efficacité énergétique. Le projet explore l''utilisation de matériaux biosourcés et de systèmes passifs.',
    'Académique',
    2024,
    'Projet d''étude',
    'Lyon, France',
    '150 m²',
    'completed',
    true,
    '[
      {"url": "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg", "alt": "Vue extérieure de la maison"},
      {"url": "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg", "alt": "Intérieur salon"},
      {"url": "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg", "alt": "Cuisine moderne"}
    ]'::jsonb
  ),
  (
    'Réhabilitation d''un Bâtiment Industriel',
    'Transformation d''une ancienne usine en espace de coworking et d''événements culturels. Le projet préserve l''identité industrielle tout en créant des espaces modernes et fonctionnels.',
    'Stage',
    2023,
    'Cabinet d''Architecture Martin & Associés',
    'Marseille, France',
    '800 m²',
    'completed',
    true,
    '[
      {"url": "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg", "alt": "Façade rénovée"},
      {"url": "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg", "alt": "Espace de coworking"},
      {"url": "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg", "alt": "Salle d''événements"}
    ]'::jsonb
  ),
  (
    'Pavillon d''Exposition Temporaire',
    'Conception d''un pavillon éphémère pour une exposition d''art contemporain. Structure légère et modulaire permettant différentes configurations d''exposition.',
    'Concours',
    2024,
    'Concours Jeunes Architectes',
    'Paris, France',
    '200 m²',
    'completed',
    false,
    '[
      {"url": "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg", "alt": "Vue d''ensemble du pavillon"},
      {"url": "https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg", "alt": "Intérieur modulable"}
    ]'::jsonb
  ),
  (
    'Aménagement d''un Jardin Urbain',
    'Projet personnel d''aménagement paysager intégrant des espaces de détente, un potager urbain et des zones de biodiversité en cœur de ville.',
    'Personnel',
    2023,
    'Projet personnel',
    'Toulouse, France',
    '300 m²',
    'in_progress',
    false,
    '[
      {"url": "https://images.pexels.com/photos/1396133/pexels-photo-1396133.jpeg", "alt": "Plan d''aménagement"},
      {"url": "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg", "alt": "Espace potager"}
    ]'::jsonb
  )
ON CONFLICT DO NOTHING;