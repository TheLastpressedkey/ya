/*
  # Ajouter des données de test pour le portfolio de Yasmine

  1. Données de test
    - Profil de Yasmine Adjoumani
    - Projets d'architecture avec images
    - Liens sociaux
    - Expériences et compétences
    - Catégories de projets

  2. Images d'exemple
    - Utilisation d'images Pexels pour la démonstration
    - Images d'architecture et de design
*/

-- Insérer le profil de Yasmine
INSERT INTO profiles (
  name, 
  title, 
  bio, 
  email, 
  phone, 
  location, 
  avatar_url, 
  cv_url
) VALUES (
  'Yasmine Adjoumani',
  'Étudiante en Architecture',
  'Passionnée par l''architecture contemporaine et le design durable, je développe mes compétences à travers des projets académiques et personnels innovants. Mon approche créative combine fonctionnalité et esthétique pour créer des espaces qui inspirent et transforment les modes de vie.',
  'yasmine.adjoumani@example.com',
  '+33 6 12 34 56 78',
  'Paris, France',
  'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=600',
  null
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  bio = EXCLUDED.bio,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location = EXCLUDED.location,
  avatar_url = EXCLUDED.avatar_url;

-- Insérer les liens sociaux
INSERT INTO social_links (platform, url, icon, order_index) VALUES
('instagram', 'https://instagram.com/yasmine.adjoumani', 'instagram', 1),
('linkedin', 'https://linkedin.com/in/yasmine-adjoumani', 'linkedin', 2),
('behance', 'https://behance.net/yasmine-adjoumani', 'behance', 3),
('email', 'mailto:yasmine.adjoumani@example.com', 'mail', 4)
ON CONFLICT (platform) DO UPDATE SET
  url = EXCLUDED.url,
  order_index = EXCLUDED.order_index;

-- Insérer les expériences
INSERT INTO experiences (type, title, institution, location, start_date, end_date, current, description, order_index) VALUES
('education', 'Master Architecture', 'École Nationale Supérieure d''Architecture de Paris-Belleville', 'Paris, France', '2023-09-01', null, true, 'Formation approfondie en conception architecturale, urbanisme et développement durable. Spécialisation en architecture contemporaine et éco-conception.', 1),
('education', 'Licence Architecture', 'École Nationale Supérieure d''Architecture de Paris-Belleville', 'Paris, France', '2020-09-01', '2023-06-30', false, 'Formation fondamentale en architecture, histoire de l''art, construction et représentation graphique. Mention Bien.', 2),
('work', 'Stagiaire Architecte', 'Atelier d''Architecture Moderne', 'Paris, France', '2023-06-01', '2023-08-31', false, 'Participation à la conception de projets résidentiels et commerciaux. Réalisation de plans techniques et modélisations 3D.', 3),
('education', 'Baccalauréat Scientifique', 'Lycée Henri IV', 'Paris, France', '2017-09-01', '2020-06-30', false, 'Spécialité Mathématiques et Physique-Chimie. Option Arts Plastiques. Mention Très Bien.', 4)
ON CONFLICT (title, institution) DO UPDATE SET
  description = EXCLUDED.description,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  current = EXCLUDED.current;

-- Insérer les compétences
INSERT INTO skills (name, category, level, order_index) VALUES
('AutoCAD', 'Logiciels de conception', 4, 1),
('SketchUp', 'Logiciels de conception', 5, 2),
('Revit', 'Logiciels de conception', 3, 3),
('Rhino', 'Logiciels de conception', 3, 4),
('Adobe Photoshop', 'Logiciels graphiques', 4, 5),
('Adobe InDesign', 'Logiciels graphiques', 4, 6),
('Adobe Illustrator', 'Logiciels graphiques', 3, 7),
('Lumion', 'Rendu 3D', 4, 8),
('V-Ray', 'Rendu 3D', 3, 9),
('Conception bioclimatique', 'Architecture durable', 4, 10),
('Analyse environnementale', 'Architecture durable', 3, 11),
('Dessin technique', 'Compétences techniques', 5, 12),
('Maquettage', 'Compétences techniques', 4, 13)
ON CONFLICT (name) DO UPDATE SET
  category = EXCLUDED.category,
  level = EXCLUDED.level;

-- Insérer les catégories de projets
INSERT INTO project_categories (name, description, color, order_index) VALUES
('academique', 'Projets réalisés dans le cadre des études', '#8B5CF6', 1),
('personnel', 'Projets personnels et explorations créatives', '#EC4899', 2),
('concours', 'Participations à des concours d''architecture', '#F59E0B', 3),
('stage', 'Projets réalisés en stage professionnel', '#10B981', 4)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  color = EXCLUDED.color;

-- Insérer les projets d'exemple
INSERT INTO projects (
  title, 
  description, 
  category, 
  year, 
  client, 
  location, 
  area, 
  status, 
  featured, 
  images
) VALUES 
(
  'Résidence Étudiante Écologique',
  'Conception d''une résidence étudiante de 120 logements intégrant des principes de développement durable. Le projet privilégie les matériaux biosourcés, l''optimisation énergétique et la création d''espaces de vie communautaires. L''architecture contemporaine s''inspire des codes du logement social français tout en proposant une approche innovante de l''habitat collectif.',
  'academique',
  2024,
  'Projet académique',
  'Paris, France',
  '3 500 m²',
  'completed',
  true,
  '[
    {"url": "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800", "alt": "Vue d''ensemble de la résidence"},
    {"url": "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800", "alt": "Façade principale"},
    {"url": "https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg?auto=compress&cs=tinysrgb&w=800", "alt": "Espaces communs"}
  ]'::jsonb
),
(
  'Pavillon d''Exposition Temporaire',
  'Structure éphémère conçue pour accueillir des expositions d''art contemporain. L''architecture modulaire permet une adaptation flexible aux différents types d''œuvres. L''utilisation de matériaux recyclables et la conception bioclimatique font de ce pavillon un exemple d''architecture responsable et innovante.',
  'concours',
  2023,
  'Concours Jeunes Architectes',
  'Lyon, France',
  '800 m²',
  'concept',
  true,
  '[
    {"url": "https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg?auto=compress&cs=tinysrgb&w=800", "alt": "Vue extérieure du pavillon"},
    {"url": "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800", "alt": "Espace d''exposition intérieur"}
  ]'::jsonb
),
(
  'Réhabilitation d''un Bâtiment Industriel',
  'Transformation d''une ancienne usine textile en espace de coworking et d''ateliers d''artistes. Le projet conserve l''identité industrielle du lieu tout en l''adaptant aux nouveaux usages. L''intervention architecturale privilégie la réversibilité et la mise en valeur du patrimoine existant.',
  'stage',
  2023,
  'Atelier d''Architecture Moderne',
  'Roubaix, France',
  '2 200 m²',
  'ongoing',
  true,
  '[
    {"url": "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800", "alt": "Façade réhabilitée"},
    {"url": "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800", "alt": "Espaces de coworking"}
  ]'::jsonb
),
(
  'Maison Individuelle Passive',
  'Projet personnel d''une maison familiale respectant les standards de la maison passive. L''architecture contemporaine s''intègre harmonieusement dans le paysage périurbain. Le projet explore les possibilités offertes par les nouvelles technologies constructives et les énergies renouvelables.',
  'personnel',
  2024,
  'Projet personnel',
  'Région parisienne, France',
  '150 m²',
  'concept',
  false,
  '[
    {"url": "https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg?auto=compress&cs=tinysrgb&w=800", "alt": "Vue d''ensemble de la maison"},
    {"url": "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800", "alt": "Jardin et terrasse"}
  ]'::jsonb
),
(
  'Centre Culturel de Quartier',
  'Conception d''un équipement culturel de proximité intégrant médiathèque, salles de spectacle et ateliers créatifs. L''architecture ouverte favorise les échanges entre les différents publics. Le projet s''inscrit dans une démarche de requalification urbaine et de cohésion sociale.',
  'academique',
  2023,
  'Projet académique',
  'Marseille, France',
  '1 800 m²',
  'completed',
  false,
  '[
    {"url": "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800", "alt": "Entrée principale du centre"},
    {"url": "https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg?auto=compress&cs=tinysrgb&w=800", "alt": "Salle de spectacle"}
  ]'::jsonb
),
(
  'Logements Sociaux Innovants',
  'Projet de 60 logements sociaux explorant de nouvelles typologies d''habitat. L''architecture privilégie la qualité des espaces extérieurs privatifs et la mutualisation de certains services. L''approche environnementale vise la certification HQE et l''optimisation des coûts de construction.',
  'concours',
  2024,
  'Concours Habitat Social',
  'Bordeaux, France',
  '4 200 m²',
  'concept',
  false,
  '[
    {"url": "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800", "alt": "Vue d''ensemble du programme"},
    {"url": "https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg?auto=compress&cs=tinysrgb&w=800", "alt": "Espaces extérieurs"}
  ]'::jsonb
)
ON CONFLICT (title) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  year = EXCLUDED.year,
  client = EXCLUDED.client,
  location = EXCLUDED.location,
  area = EXCLUDED.area,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured,
  images = EXCLUDED.images;