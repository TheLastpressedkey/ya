import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, ExternalLink, Instagram, Linkedin, Mail, MapPin, Globe, Palette, Dribbble, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { Profile, Project } from '../types';
import { supabase } from '../lib/supabase';

export function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Récupérer le profil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .single();

      // Récupérer les projets mis en avant
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(3);

      // Récupérer les liens sociaux séparément
      const { data: socialData } = await supabase
        .from('social_links')
        .select('*')
        .order('order_index');

      setProfile(profileData);
      setFeaturedProjects(projectsData || []);
      
      // Ajouter les liens sociaux au profil
      if (profileData && socialData) {
        setProfile({ ...profileData, social_links: socialData });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />;
      case 'behance':
        return <Palette className="w-5 h-5" />;
      case 'dribbble':
        return <Dribbble className="w-5 h-5" />;
      case 'website':
        return <Globe className="w-5 h-5" />;
      case 'email':
        return <Mail className="w-5 h-5" />;
      case 'phone':
        return <Phone className="w-5 h-5" />;
      default:
        return <ExternalLink className="w-5 h-5" />;
    }
  };

  const getMainImage = (project: Project) => {
    if (project.images && Array.isArray(project.images) && project.images.length > 0) {
      return project.images[0].url || 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800';
    }
    return 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800';
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-7xl font-bold mb-6"
              >
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {profile?.name || 'Yasmine Adjoumani'}
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-600 mb-4 font-light"
              >
                {profile?.title || 'Étudiante en Architecture'}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex items-center space-x-2 text-gray-500 mb-8"
              >
                <MapPin className="w-5 h-5" />
                <span>{profile?.location || 'Paris, France'}</span>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg"
              >
                {profile?.bio || 'Passionnée par l\'architecture contemporaine et le design durable. Je crée des espaces qui racontent des histoires et inspirent les communautés.'}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-wrap gap-4 mb-8"
              >
                <Link
                  to="/projets"
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-full hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span>Voir mes projets</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                
                {profile?.cv_url && (
                  <a
                    href={profile.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-gray-700 font-medium rounded-full border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300"
                  >
                    <Download className="w-5 h-5" />
                    <span>Télécharger CV</span>
                  </a>
                )}
              </motion.div>
              
              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex space-x-4"
              >
                {profile?.social_links?.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white"
                  >
                    {renderSocialIcon(social.platform)}
                  </a>
                ))}
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative w-full max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl transform rotate-6"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                  <img
                    src={profile?.hero_image_url || profile?.avatar_url || 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=600'}
                    alt={profile?.name || 'Yasmine Adjoumani'}
                    className="w-full h-96 object-cover rounded-2xl"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Compétences & Outils
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Les technologies et méthodes que j'utilise pour donner vie à mes projets
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {(profile?.skills || ['AutoCAD', 'SketchUp', 'Revit', 'Photoshop', 'InDesign', 'Rhino']).map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600"
              >
                <span className="font-medium text-gray-700 group-hover:text-white transition-colors duration-300">
                  {skill}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Projets Sélectionnés
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Découvrez mes réalisations les plus marquantes
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="aspect-w-16 aspect-h-12 overflow-hidden">
                    <img
                      src={getMainImage(project)}
                      alt={project.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm font-medium rounded-full">
                        {project.category === 'academique' ? 'Académique' : 
                         project.category === 'personnel' ? 'Personnel' :
                         project.category === 'concours' ? 'Concours' : 'Stage'}
                      </span>
                      <span className="text-sm text-gray-500">{project.year}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-200">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2">{project.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link
                to="/projets"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-full hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <span>Voir tous les projets</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}