import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, User, Clock, ExternalLink } from 'lucide-react';
import { Project } from '../types';
import { supabase } from '../lib/supabase';

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProject(id);
    }
  }, [id]);

  const fetchProject = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.error('Erreur lors du chargement du projet:', error);
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
    const labels = {
      'academique': 'Académique',
      'personnel': 'Personnel',
      'concours': 'Concours',
      'stage': 'Stage'
    };
    return labels[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Projet non trouvé</h1>
          <Link
            to="/projets"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-lg transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux projets</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero Image */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={getMainImage(project)}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        <div className="absolute bottom-8 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link
                to="/projets"
                className="inline-flex items-center space-x-2 text-white/80 hover:text-white mb-4 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour aux projets</span>
              </Link>
              
              <div className="flex items-center space-x-4 mb-4">
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white font-medium rounded-full">
                  {getCategoryLabel(project.category)}
                </span>
                <div className="flex items-center space-x-2 text-white/80">
                  <Calendar className="w-4 h-4" />
                  <span>{project.year}</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {project.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="prose prose-lg max-w-none"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Description du projet</h2>
                <p className="text-gray-600 leading-relaxed text-lg mb-8">
                  {project.description}
                </p>

                {/* Image Gallery */}
                {project.images && Array.isArray(project.images) && project.images.length > 1 && (
                  <div className="mb-12">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Galerie d'images</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {project.images.slice(1).map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          className="aspect-w-16 aspect-h-12 overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                          <img
                            src={image.url}
                            alt={`${project.title} - Image ${index + 2}`}
                            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-8 sticky top-24"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Informations du projet</h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center space-x-2 text-gray-500 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">Année</span>
                    </div>
                    <p className="text-gray-900 font-semibold">{project.year}</p>
                  </div>

                  {project.client && (
                    <div>
                      <div className="flex items-center space-x-2 text-gray-500 mb-2">
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium">Client</span>
                      </div>
                      <p className="text-gray-900 font-semibold">{project.client}</p>
                    </div>
                  )}

                  {project.location && (
                    <div>
                      <div className="flex items-center space-x-2 text-gray-500 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">Localisation</span>
                      </div>
                      <p className="text-gray-900 font-semibold">{project.location}</p>
                    </div>
                  )}

                  {project.area && (
                    <div>
                      <div className="flex items-center space-x-2 text-gray-500 mb-2">
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm font-medium">Surface</span>
                      </div>
                      <p className="text-gray-900 font-semibold">{project.area}</p>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center space-x-2 text-gray-500 mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Statut</span>
                    </div>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      project.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : project.status === 'ongoing'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status === 'completed' ? 'Terminé' : 
                       project.status === 'ongoing' ? 'En cours' : 'Concept'}
                    </span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Link
                    to="/projets"
                    className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voir tous les projets</span>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}