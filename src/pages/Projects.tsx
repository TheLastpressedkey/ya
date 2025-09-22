import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Filter, ExternalLink, Eye } from 'lucide-react';
import { Project } from '../types';
import { supabase } from '../lib/supabase';

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === selectedCategory));
    }
  }, [selectedCategory, projects]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const projectsData = data || [];
      setProjects(projectsData);
      
      // Extraire les catégories uniques
      const uniqueCategories = [...new Set(projectsData.map(p => p.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMainImage = (project: Project) => {
    if (project.images && Array.isArray(project.images) && project.images.length > 0) {
      return project.images[0].url || 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800';
    }
    return 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800';
  };

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
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
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-pink-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6"
          >
            Mes Projets
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Découvrez mes créations architecturales, des projets académiques aux concours, 
            en passant par mes explorations personnelles
          </motion.p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-white/80 backdrop-blur-sm sticky top-20 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtrer par catégorie:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                key="all"
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tous les projets
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Filter className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun projet trouvé</h3>
              <p className="text-lg text-gray-600">Essayez de changer les filtres ou revenez plus tard.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div className="relative aspect-w-16 aspect-h-12 overflow-hidden">
                    <img
                      src={getMainImage(project)}
                      alt={project.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <Link
                          to={`/projets/${project.id}`}
                          className="w-full bg-white/90 backdrop-blur-sm text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-white transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Voir le projet</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm font-medium rounded-full">
                        {getCategoryLabel(project.category)}
                      </span>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{project.year}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-200">
                      {project.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                    
                    {project.duration && (
                      <div className="text-sm text-gray-500 mb-2">
                        Durée: {project.duration}
                      </div>
                    )}
                    
                    {project.tools && project.tools.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {project.tools.slice(0, 3).map((tool, toolIndex) => (
                          <span
                            key={toolIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                          >
                            {tool}
                          </span>
                        ))}
                        {project.tools.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                            +{project.tools.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}