import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Tag, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  order_index?: number;
  created_at?: string;
}

interface CategoriesTabProps {
  categories: Category[];
  onCategoriesUpdate: (categories: Category[]) => void;
}

const DEFAULT_COLORS = [
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#6366F1', // Indigo
  '#8B5A2B', // Brown
];

export function CategoriesTab({ categories, onCategoriesUpdate }: CategoriesTabProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#8B5CF6'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#8B5CF6'
    });
    setEditingCategory(null);
  };

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        color: category.color
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const categoryData = {
        ...formData,
        order_index: categories.length
      };

      if (editingCategory) {
        const { data, error } = await supabase
          .from('project_categories')
          .update(categoryData)
          .eq('id', editingCategory.id)
          .select()
          .single();

        if (error) throw error;
        
        const updatedCategories = categories.map(c => c.id === editingCategory.id ? data : c);
        onCategoriesUpdate(updatedCategories);
      } else {
        const { data, error } = await supabase
          .from('project_categories')
          .insert([categoryData])
          .select()
          .single();

        if (error) throw error;
        onCategoriesUpdate([...categories, data]);
      }

      closeModal();
      alert(editingCategory ? 'Catégorie mise à jour !' : 'Catégorie créée !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;

    try {
      const { error } = await supabase
        .from('project_categories')
        .delete()
        .eq('id', category.id);

      if (error) throw error;
      
      const updatedCategories = categories.filter(c => c.id !== category.id);
      onCategoriesUpdate(updatedCategories);
      alert('Catégorie supprimée !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">Catégories de projets</h3>
        <button
          onClick={() => openModal()}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle catégorie</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: category.color }}
                >
                  <Tag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{category.name}</h4>
                  {category.description && (
                    <p className="text-gray-600 text-sm mt-1">{category.description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openModal(category)}
                  className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div 
                className="px-3 py-1 rounded-full text-white text-sm font-medium"
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </div>
              <div 
                className="w-6 h-6 rounded-full border-2 border-gray-200"
                style={{ backgroundColor: category.color }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Tag className="w-12 h-12 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucune catégorie</h3>
          <p className="text-lg text-gray-600 mb-6">Créez des catégories pour organiser vos projets.</p>
          <button
            onClick={() => openModal()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Créer une catégorie
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
                  {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la catégorie *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                    placeholder="ex: Résidentiel, Commercial..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 resize-none"
                    placeholder="Description optionnelle de la catégorie..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Couleur *
                  </label>
                  <div className="space-y-3">
                    <input
                      type="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-full h-12 border border-gray-200 rounded-xl cursor-pointer"
                    />
                    <div className="grid grid-cols-4 gap-2">
                      {DEFAULT_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, color }))}
                          className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 ${
                            formData.color === color ? 'border-gray-400 scale-110' : 'border-gray-200'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
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
                    {isSubmitting ? 'Sauvegarde...' : (editingCategory ? 'Mettre à jour' : 'Créer')}
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