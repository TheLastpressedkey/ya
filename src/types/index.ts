export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'academic' | 'personal' | 'competition' | 'internship';
  year: number;
  duration?: string;
  tools?: string[];
  status: 'completed' | 'ongoing' | 'concept';
  featured: boolean;
  images: ProjectImage[];
  created_at: string;
  updated_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  url: string;
  title?: string;
  description?: string;
  is_main: boolean;
  order: number;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone?: string;
  location: string;
  avatar_url?: string;
  cv_url?: string;
  hero_image_url?: string;
  logo_type?: 'text' | 'icon';
  logo_text?: string;
  logo_icon?: string;
  social_links: SocialLink[];
  skills: string[];
  education: Education[];
  experience: Experience[];
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  order_index?: number;
  created_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  order_index?: number;
  created_at?: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  start_year: number;
  end_year?: number;
  current: boolean;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description: string;
  location?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin';
  created_at: string;
}