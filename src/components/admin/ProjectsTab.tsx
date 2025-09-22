import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Calendar, MapPin, Upload, X } from 'lucide-react';
import { Project } from '../../types';
import { supabase, uploadImage } from '../../lib/supabase';

interface ProjectsTabProps {
  projects: Project[];
  onProjectsUpdate: (projects: Project[]) => void;
}

export function ProjectsTab({ projects, onProjectsUpdate }: ProjectsTabProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'academique',
    year: new Date().getFullYear(),
    client: '',
    location: '',
    area: '',
    status: 'completed',
    featured: false
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'academique',
      year: new Date().getFullYear(),
      client: '',
      location: '',
      area: '',
      status: 'completed',
      featured: false
    });
    setSelectedImages([]);
    setExistingImages([]);
    setEditingProject(null);
  };

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        category: project.category,
        year: project.year || new Date().getFullYear(),
        client: project.client || '',
        location: project.location || '',
        area: project.area || '',
        status: project.status || 'completed',
        featured: project.featured || false
      });
      setExistingImages(project.images || []);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(files);
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrls = [...existingImages];

      // Upload new images
      if (selectedImages.length > 0) {
        setUploadingImages(true);
        for (const file of selectedImages) {
          const fileName = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${file.name.split('.').pop()}`;
          const url = await uploadImage(file, fileName);
          imageUrls.push({ url, title: file.name });
        }
        setUploadingImages(false);
      }

      const projectData = {
        ...formData,
        images: imageUrls,
        year: parseInt(formData.year.toString())
      };

      if (editingProject) {
        const { data, error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id)
          .select()
          .single();

        if (error) throw error;
        
        const updatedProjects = projects.map(p => p.id === editingProject.id ? data : p);
        onProjectsUpdate(updatedProjects);
      } else {
        const { data, error } = await supabase
          .from('projects')
          .insert([projectData])
          .select()
          .single();

        if (error) throw error;
        onProjectsUpdate([...projects, data]);
      }

      closeModal();
      alert(editingProject ? 'Projet mis à jour !' : 'Projet créé !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsSubmitting(false);
      setUploadingImages(false);
    }
  };

  const handleDelete = async (project: Project) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id);

      if (error) throw error;
      
      const updatedProjects = projects.filter(p => p.id !== project.id);
      onProjectsUpdate(updatedProjects);
      alert('Projet supprimé !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const getMainImage = (project: Project) => {
    if (project.images && Array.isArray(project.images) && project.images.length > 0) {
      return project.images[0].url || 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
    return 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">Mes Projets</h3>
        <button
          onClick={() => openModal()}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau projet</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="aspect-w-16 aspect-h-12 overflow-hidden">
              <img
                src={getMainImage(project)}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm font-medium rounded-full">
                  {project.category}
                </span>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{project.year}</span>
                </div>
              </div>
              
              <h4 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h4>
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">{project.description}</p>
              
              {project.location && (
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{project.location}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {project.featured && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                      Mis en avant
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    project.status === 'completed' ? 'bg-green-100 text-green-800' :
                    project.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status === 'completed' ? 'Terminé' : 
                     project.status === 'ongoing' ? 'En cours' : 'Concept'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openModal(project)}
                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Eye className="w-12 h-12 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun projet</h3>
          <p className="text-lg text-gray-600 mb-6">Commencez par ajouter votre premier projet.</p>
          <button
            onClick={() => openModal()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Créer un projet
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingProject ? 'Modifier le projet' : 'Nouveau projet'}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre du projet *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                    >
                      <option value="academique">Académique</option>
                      <option value="personnel">Personnel</option>
                      <option value="concours">Concours</option>
                      <option value="stage">Stage</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Année *
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                      min="2000"
                      max="2030"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client
                    </label>
                    <input
                      type="text"
                      name="client"
                      value={formData.client}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                    >
                      <option value="completed">Terminé</option>
                      <option value="ongoing">En cours</option>
                      <option value="concept">Concept</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Localisation
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surface
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder="ex: 150 m²"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">
                    Mettre en avant sur la page d'accueil
                  </label>
                </div>

                {/* Images Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images du projet
                  </label>
                  
                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Images actuelles :</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {existingImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.url}
                              alt={`Image ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(index)}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            {index === 0 && (
                              <span className="absolute bottom-1 left-1 px-2 py-1 bg-purple-600 text-white text-xs rounded">
                                Principal
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <label className="cursor-pointer">
                      <span className="text-purple-600 font-medium">Cliquez pour ajouter des images</span>
                      <span className="text-gray-500"> ou glissez-déposez</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG, JPG, GIF jusqu'à 5MB chacune
                    </p>
                  </div>

                  {selectedImages.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">
                        {selectedImages.length} nouvelle(s) image(s) sélectionnée(s)
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedImages.map((file, index) => (
                          <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                            {file.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 text-gray-700 font-medium rounded-xl border border-gray-200 hover:border-purple-300 hover:text-purple-600 transition-all duration-300"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || uploadingImages}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isSubmitting || uploadingImages ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>{uploadingImages ? 'Upload...' : 'Sauvegarde...'}</span>
                      </>
                    ) : (
                      <span>{editingProject ? 'Mettre à jour' : 'Créer le projet'}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}