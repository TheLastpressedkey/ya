import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, FolderOpen, Link as LinkIcon, GraduationCap, Star, Tag } from 'lucide-react';
import { Profile, Project, SocialLink, Experience, Skill } from '../../types';
import { supabase } from '../../lib/supabase';
import { ProfileTab } from '../../components/admin/ProfileTab';
import { ProjectsTab } from '../../components/admin/ProjectsTab';
import { SocialLinksTab } from '../../components/admin/SocialLinksTab';
import { ExperiencesTab } from '../../components/admin/ExperiencesTab';
import { SkillsTab } from '../../components/admin/SkillsTab';
import { CategoriesTab } from '../../components/admin/CategoriesTab';

type TabType = 'profile' | 'projects' | 'social' | 'experiences' | 'skills' | 'categories';

interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  order_index?: number;
  created_at?: string;
}

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'projects', name: 'Projets', icon: FolderOpen },
    { id: 'social', name: 'Réseaux sociaux', icon: LinkIcon },
    { id: 'experiences', name: 'Expériences', icon: GraduationCap },
    { id: 'skills', name: 'Compétences', icon: Star },
    { id: 'categories', name: 'Catégories', icon: Tag },
  ];

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [profileRes, projectsRes, socialRes, experiencesRes, skillsRes, categoriesRes] = await Promise.all([
        supabase.from('profiles').select('*').single(),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('social_links').select('*').order('order_index', { ascending: true }),
        supabase.from('experiences').select('*').order('start_date', { ascending: false }),
        supabase.from('skills').select('*').order('category', { ascending: true }),
        supabase.from('project_categories').select('*').order('order_index', { ascending: true })
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (projectsRes.data) setProjects(projectsRes.data);
      if (socialRes.data) setSocialLinks(socialRes.data);
      if (experiencesRes.data) setExperiences(experiencesRes.data);
      if (skillsRes.data) setSkills(skillsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileTab 
            profile={profile} 
            onProfileUpdate={setProfile}
          />
        );
      case 'projects':
        return (
          <ProjectsTab 
            projects={projects} 
            onProjectsUpdate={setProjects}
          />
        );
      case 'social':
        return (
          <SocialLinksTab 
            socialLinks={socialLinks} 
            onSocialLinksUpdate={setSocialLinks}
          />
        );
      case 'experiences':
        return (
          <ExperiencesTab 
            experiences={experiences} 
            onExperiencesUpdate={setExperiences}
          />
        );
      case 'skills':
        return (
          <SkillsTab 
            skills={skills} 
            onSkillsUpdate={setSkills}
          />
        );
      case 'categories':
        return (
          <CategoriesTab 
            categories={categories} 
            onCategoriesUpdate={setCategories}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Dashboard Admin
          </h1>
          <p className="text-gray-600">Gérez le contenu de votre portfolio</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Projets</p>
                <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
              </div>
              <FolderOpen className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Réseaux sociaux</p>
                <p className="text-3xl font-bold text-gray-900">{socialLinks.length}</p>
              </div>
              <LinkIcon className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expériences</p>
                <p className="text-3xl font-bold text-gray-900">{experiences.length}</p>
              </div>
              <GraduationCap className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compétences</p>
                <p className="text-3xl font-bold text-gray-900">{skills.length}</p>
              </div>
              <Star className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg mb-8"
        >
          <div className="flex flex-wrap border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          <div className="p-8">
            {renderTabContent()}
          </div>
        </motion.div>
      </div>
    </div>
  );
}