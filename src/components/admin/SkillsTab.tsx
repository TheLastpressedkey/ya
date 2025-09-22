import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import { Skill } from '../../types';
import { supabase } from '../../lib/supabase';

interface SkillsTabProps {
  skills: Skill[];
  onSkillsUpdate: (skills: Skill[]) => void;
}

const SKILL_CATEGORIES = [
  'Logiciels de conception',
  'Rendu et visualisation',
  'Présentation',
  'Gestion de projet',
  'Langues',
  'Autres'
];

export function SkillsTab({ skills, onSkillsUpdate }: SkillsTabProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Logiciels de conception',
    level: 3
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Logiciels de conception',
      level: 3
    });
    setEditingSkill(null);
  };

  const openModal = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        name: skill.name,
        category: skill.category,
        level: skill.level || 3
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'level' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const skillData = {
        ...formData,
        order_index: skills.length
      };

      if (editingSkill) {
        const { data, error } = await supabase
          .from('skills')
          .update(skillData)
          .eq('id', editingSkill.id)
          .select()
          .single();

        if (error) throw error;
        
        const updatedSkills = skills.map(s => s.id === editingSkill.id ? data : s);
        onSkillsUpdate(updatedSkills);
      } else {
        const { data, error } = await supabase
          .from('skills')
          .insert([skillData])
          .select()
          .single();

        if (error) throw error;
        onSkillsUpdate([...skills, data]);
      }

      closeModal();
      alert(editingSkill ? 'Compétence mise à jour !' : 'Compétence ajoutée !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (skill: Skill) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) return;

    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', skill.id);

      if (error) throw error;
      
      const updatedSkills = skills.filter(s => s.id !== skill.id);
      onSkillsUpdate(updatedSkills);
      alert('Compétence supprimée !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const renderStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < level
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">Compétences</h3>
        <button
          onClick={() => openModal()}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une compétence</span>
        </button>
      </div>

      {/* Skills by Category */}
      <div className="space-y-8">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category} className="bg-white rounded-2xl shadow-lg p-6">
            <h4 className="text-xl font-bold text-gray-900 mb-6">{category}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categorySkills.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200">
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 mb-2">{skill.name}</h5>
                    <div className="flex items-center space-x-1">
                      {renderStars(skill.level || 3)}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openModal(skill)}
                      className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(skill)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Star className="w-12 h-12 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucune compétence</h3>
          <p className="text-lg text-gray-600 mb-6">Ajoutez vos compétences techniques et personnelles.</p>
          <button
            onClick={() => openModal()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Ajouter une compétence
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingSkill ? 'Modifier la compétence' : 'Nouvelle compétence'}
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
                    Nom de la compétence *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                    placeholder="ex: AutoCAD, Photoshop..."
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
                    {SKILL_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Niveau de maîtrise (1-5) *
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      name="level"
                      min="1"
                      max="5"
                      value={formData.level}
                      onChange={handleInputChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Débutant</span>
                      <span>Intermédiaire</span>
                      <span>Avancé</span>
                      <span>Expert</span>
                      <span>Maître</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      {renderStars(formData.level)}
                    </div>
                  </div>
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
                    {isSubmitting ? 'Sauvegarde...' : (editingSkill ? 'Mettre à jour' : 'Ajouter')}
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