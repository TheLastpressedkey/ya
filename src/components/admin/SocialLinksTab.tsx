import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ExternalLink, Instagram, Linkedin, Globe, Mail, Palette, Dribbble, Phone, X } from 'lucide-react';
import { SocialLink } from '../../types';
import { supabase } from '../../lib/supabase';

interface SocialLinksTabProps {
  socialLinks: SocialLink[];
  onSocialLinksUpdate: (links: SocialLink[]) => void;
}

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'behance', label: 'Behance', icon: Palette },
  { value: 'dribbble', label: 'Dribbble', icon: Dribbble },
  { value: 'website', label: 'Site Web', icon: Globe },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'phone', label: 'Téléphone', icon: Phone },
  { value: 'twitter', label: 'Twitter', icon: ExternalLink },
  { value: 'facebook', label: 'Facebook', icon: ExternalLink },
  { value: 'youtube', label: 'YouTube', icon: ExternalLink },
  { value: 'github', label: 'GitHub', icon: ExternalLink },
  { value: 'pinterest', label: 'Pinterest', icon: ExternalLink },
];

export function SocialLinksTab({ socialLinks, onSocialLinksUpdate }: SocialLinksTabProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    platform: 'instagram',
    url: '',
    icon: 'instagram'
  });

  const resetForm = () => {
    setFormData({
      platform: 'instagram',
      url: '',
      icon: 'instagram'
    });
    setEditingLink(null);
  };

  const openModal = (link?: SocialLink) => {
    if (link) {
      setEditingLink(link);
      setFormData({
        platform: link.platform,
        url: link.url,
        icon: link.icon
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
      [name]: value,
      ...(name === 'platform' && { icon: value })
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const linkData = {
        ...formData,
        order_index: socialLinks.length
      };

      if (editingLink) {
        const { data, error } = await supabase
          .from('social_links')
          .update(linkData)
          .eq('id', editingLink.id)
          .select()
          .single();

        if (error) throw error;
        
        const updatedLinks = socialLinks.map(l => l.id === editingLink.id ? data : l);
        onSocialLinksUpdate(updatedLinks);
      } else {
        const { data, error } = await supabase
          .from('social_links')
          .insert([linkData])
          .select()
          .single();

        if (error) throw error;
        onSocialLinksUpdate([...socialLinks, data]);
      }

      closeModal();
      alert(editingLink ? 'Lien mis à jour !' : 'Lien ajouté !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (link: SocialLink) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce lien ?')) return;

    try {
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', link.id);

      if (error) throw error;
      
      const updatedLinks = socialLinks.filter(l => l.id !== link.id);
      onSocialLinksUpdate(updatedLinks);
      alert('Lien supprimé !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const getPlatformIcon = (platform: string) => {
    const platformData = PLATFORMS.find(p => p.value === platform);
    return platformData?.icon || ExternalLink;
  };

  const getPlatformLabel = (platform: string) => {
    const platformData = PLATFORMS.find(p => p.value === platform);
    return platformData?.label || platform;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">Réseaux Sociaux</h3>
        <button
          onClick={() => openModal()}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un lien</span>
        </button>
      </div>

      {/* Social Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {socialLinks.map((link) => {
          const Icon = getPlatformIcon(link.platform);
          return (
            <div key={link.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">
                      {getPlatformLabel(link.platform)}
                    </h4>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700 text-sm truncate block max-w-[150px]"
                    >
                      {link.url}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openModal(link)}
                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(link)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Visiter</span>
              </a>
            </div>
          );
        })}
      </div>

      {socialLinks.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ExternalLink className="w-12 h-12 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun lien social</h3>
          <p className="text-lg text-gray-600 mb-6">Ajoutez vos profils sur les réseaux sociaux.</p>
          <button
            onClick={() => openModal()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Ajouter un lien
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
                  {editingLink ? 'Modifier le lien' : 'Nouveau lien'}
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
                    Plateforme *
                  </label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                  >
                    {PLATFORMS.map((platform) => (
                      <option key={platform.value} value={platform.value}>
                        {platform.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL *
                  </label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    required
                    placeholder="https://..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
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
                    {isSubmitting ? 'Sauvegarde...' : (editingLink ? 'Mettre à jour' : 'Ajouter')}
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