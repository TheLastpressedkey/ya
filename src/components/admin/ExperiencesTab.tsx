import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, GraduationCap, Briefcase, Calendar, MapPin } from 'lucide-react';
import { Experience } from '../../types';
import { supabase } from '../../lib/supabase';

interface ExperiencesTabProps {
  experiences: Experience[];
  onExperiencesUpdate: (experiences: Experience[]) => void;
}

export function ExperiencesTab({ experiences, onExperiencesUpdate }: ExperiencesTabProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'education' as 'education' | 'work',
    title: '',
    institution: '',
    location: '',
    start_date: '',
    end_date: '',
    current: false,
    description: ''
  });

  const resetForm = () => {
    setFormData({
      type: 'education',
      title: '',
      institution: '',
      location: '',
      start_date: '',
      end_date: '',
      current: false,
      description: ''
    });
    setEditingExperience(null);
  };

  const openModal = (experience?: Experience) => {
    if (experience) {
      setEditingExperience(experience);
      setFormData({
        type: experience.type as 'education' | 'work',
        title: experience.title,
        institution: experience.institution,
        location: experience.location || '',
        start_date: experience.start_date,
        end_date: experience.end_date || '',
        current: experience.current || false,
        description: experience.description || ''
      });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const experienceData = {
        ...formData,
        end_date: formData.current ? null : formData.end_date,
        order_index: experiences.length
      };

      if (editingExperience) {
        const { data, error } = await supabase
          .from('experiences')
          .update(experienceData)
          .eq('id', editingExperience.id)
          .select()
          .single();

        if (error) throw error;
        
        const updatedExperiences = experiences.map(e => e.id === editingExperience.id ? data : e);
        onExperiencesUpdate(updatedExperiences);
      } else {
        const { data, error } = await supabase
          .from('experiences')
          .insert([experienceData])
          .select()
          .single();

        if (error) throw error;
        onExperiencesUpdate([...experiences, data]);
      }

      closeModal();
      alert(editingExperience ? 'Expérience mise à jour !' : 'Expérience ajoutée !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (experience: Experience) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette expérience ?')) return;

    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', experience.id);

      if (error) throw error;
      
      const updatedExperiences = experiences.filter(e => e.id !== experience.id);
      onExperiencesUpdate(updatedExperiences);
      alert('Expérience supprimée !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric'
    });
  };

  const sortedExperiences = [...experiences].sort((a, b) => 
    new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">Expériences</h3>
        <button
          onClick={() => openModal()}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une expérience</span>
        </button>
      </div>

      {/* Experiences Timeline */}
      <div className="space-y-6">
        {sortedExperiences.map((experience) => (
          <div key={experience.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  experience.type === 'education' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-green-100 text-green-600'
                }`}>
                  {experience.type === 'education' ? (
                    <GraduationCap className="w-6 h-6" />
                  ) : (
                    <Briefcase className="w-6 h-6" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-xl font-bold text-gray-900">{experience.title}</h4>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      experience.type === 'education'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {experience.type === 'education' ? 'Formation' : 'Travail'}
                    </span>
                    {experience.current && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                        En cours
                      </span>
                    )}
                  </div>
                  
                  <p className="text-purple-600 font-medium mb-2">{experience.institution}</p>
                  
                  <div className="flex items-center space-x-4 text-gray-500 text-sm mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(experience.start_date)} - {
                          experience.current ? 'Présent' : formatDate(experience.end_date!)
                        }
                      </span>
                    </div>
                    {experience.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{experience.location}</span>
                      </div>
                    )}
                  </div>
                  
                  {experience.description && (
                    <p className="text-gray-600 leading-relaxed">{experience.description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openModal(experience)}
                  className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(experience)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {experiences.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-12 h-12 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucune expérience</h3>
          <p className="text-lg text-gray-600 mb-6">Ajoutez votre parcours professionnel et académique.</p>
          <button
            onClick={() => openModal()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Ajouter une expérience
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingExperience ? 'Modifier l\'expérience' : 'Nouvelle expérience'}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                  >
                    <option value="education">Formation</option>
                    <option value="work">Travail</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {formData.type === 'education' ? 'Diplôme/Formation' : 'Poste'} *
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
                      {formData.type === 'education' ? 'École/Université' : 'Entreprise'} *
                    </label>
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                    />
                  </div>
                </div>

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de début *
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      disabled={formData.current}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="current"
                    checked={formData.current}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">
                    En cours actuellement
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 resize-none"
                    placeholder="Décrivez vos missions, réalisations, compétences acquises..."
                  />
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
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sauvegarde...' : (editingExperience ? 'Mettre à jour' : 'Ajouter')}
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