/*
  # Portfolio Schema for Yasmine Adjoumani

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `name` (text)
      - `title` (text)
      - `bio` (text)
      - `avatar_url` (text)
      - `cv_url` (text)
      - `email` (text)
      - `phone` (text)
      - `location` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `year` (integer)
      - `client` (text)
      - `location` (text)
      - `area` (text)
      - `status` (text)
      - `featured` (boolean)
      - `images` (jsonb array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `social_links`
      - `id` (uuid, primary key)
      - `platform` (text)
      - `url` (text)
      - `icon` (text)
      - `order_index` (integer)
      - `created_at` (timestamp)
    
    - `experiences`
      - `id` (uuid, primary key)
      - `type` (text) - 'education' or 'work'
      - `title` (text)
      - `institution` (text)
      - `location` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `current` (boolean)
      - `description` (text)
      - `order_index` (integer)
      - `created_at` (timestamp)
    
    - `skills`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `level` (integer)
      - `order_index` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data
    - Public read access for portfolio content
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Yasmine Adjoumani',
  title text DEFAULT 'Étudiante en Architecture',
  bio text DEFAULT 'Passionnée par l''architecture contemporaine et le design durable, je développe mes compétences à travers des projets académiques et personnels innovants.',
  avatar_url text,
  cv_url text,
  email text DEFAULT 'yasmine.adjoumani@example.com',
  phone text,
  location text DEFAULT 'Paris, France',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'academique',
  year integer DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  client text,
  location text,
  area text,
  status text DEFAULT 'completed',
  featured boolean DEFAULT false,
  images jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create social_links table
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  icon text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('education', 'work')),
  title text NOT NULL,
  institution text NOT NULL,
  location text,
  start_date date NOT NULL,
  end_date date,
  current boolean DEFAULT false,
  description text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  level integer DEFAULT 3 CHECK (level >= 1 AND level <= 5),
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read profiles"
  ON profiles
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read projects"
  ON projects
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read social_links"
  ON social_links
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read experiences"
  ON experiences
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read skills"
  ON skills
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policies for authenticated users to manage data
CREATE POLICY "Authenticated users can manage profiles"
  ON profiles
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage social_links"
  ON social_links
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage experiences"
  ON experiences
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage skills"
  ON skills
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default data
INSERT INTO profiles (id) VALUES (gen_random_uuid()) ON CONFLICT DO NOTHING;

-- Insert default social links
INSERT INTO social_links (platform, url, icon, order_index) VALUES
  ('Instagram', 'https://instagram.com/yasmine.adjoumani', 'Instagram', 1),
  ('LinkedIn', 'https://linkedin.com/in/yasmine-adjoumani', 'Linkedin', 2),
  ('Behance', 'https://behance.net/yasmine-adjoumani', 'Palette', 3),
  ('Email', 'mailto:yasmine.adjoumani@example.com', 'Mail', 4)
ON CONFLICT DO NOTHING;

-- Insert default education
INSERT INTO experiences (type, title, institution, location, start_date, current, description, order_index) VALUES
  ('education', 'Master en Architecture', 'École Nationale Supérieure d''Architecture', 'Paris, France', '2023-09-01', true, 'Spécialisation en architecture durable et design urbain contemporain.', 1),
  ('education', 'Licence en Architecture', 'École d''Architecture', 'Paris, France', '2020-09-01', false, 'Formation fondamentale en architecture, urbanisme et design.', 2)
ON CONFLICT DO NOTHING;

-- Insert default skills
INSERT INTO skills (name, category, level, order_index) VALUES
  ('AutoCAD', 'Logiciels', 4, 1),
  ('SketchUp', 'Logiciels', 4, 2),
  ('Rhino', 'Logiciels', 3, 3),
  ('Adobe Creative Suite', 'Logiciels', 4, 4),
  ('Revit', 'Logiciels', 3, 5),
  ('Design Conceptuel', 'Compétences', 5, 6),
  ('Modélisation 3D', 'Compétences', 4, 7),
  ('Rendu Architectural', 'Compétences', 4, 8),
  ('Architecture Durable', 'Spécialisations', 4, 9),
  ('Design Urbain', 'Spécialisations', 3, 10)
ON CONFLICT DO NOTHING;

-- Insert sample projects
INSERT INTO projects (title, description, category, year, location, status, featured, images) VALUES
  ('Pavillon d''Exposition Temporaire', 'Conception d''un pavillon modulaire pour expositions temporaires, alliant durabilité et esthétique contemporaine.', 'academique', 2024, 'Paris, France', 'completed', true, '["https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg", "https://images.pexels.com/photos/323775/pexels-photo-323775.jpeg"]'),
  ('Réhabilitation d''un Loft Industriel', 'Transformation d''un ancien atelier en loft moderne, préservant l''identité industrielle tout en créant un espace de vie contemporain.', 'personnel', 2024, 'Lyon, France', 'completed', true, '["https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg", "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg"]'),
  ('Centre Culturel Communautaire', 'Projet de fin d''études : conception d''un centre culturel intégrant espaces d''exposition, théâtre et ateliers créatifs.', 'academique', 2023, 'Marseille, France', 'completed', false, '["https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg", "https://images.pexels.com/photos/1109543/pexels-photo-1109543.jpeg"]'),
  ('Habitat Collectif Écologique', 'Concours étudiant : proposition d''habitat collectif intégrant solutions bioclimatiques et espaces partagés.', 'concours', 2023, 'Bordeaux, France', 'completed', false, '["https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg", "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg"]')
ON CONFLICT DO NOTHING;