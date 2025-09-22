import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Upload, Save, Loader } from 'lucide-react';
import { Profile } from '../../types';
import { supabase, uploadImage } from '../../lib/supabase';

interface ProfileTabProps {
  profile: Profile | null;
  onProfileUpdate: (profile: Profile) => void;
}

export function ProfileTab({ profile, onProfileUpdate }: ProfileTabProps) {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    title: profile?.title || '',
    bio: profile?.bio || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    location: profile?.location || '',
    cv_url: profile?.cv_url || '',
    logo_type: profile?.logo_type || 'text',
    logo_text: profile?.logo_text || '',
    logo_icon: profile?.logo_icon || 'User'
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);

  const AVAILABLE_ICONS = [
    'User', 'Home', 'Building', 'Palette', 'Compass', 'Star', 'Heart',
    'Zap', 'Crown', 'Diamond', 'Hexagon', 'Triangle', 'Circle', 'Square'
  ];
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileName = `avatar_${Date.now()}.${file.name.split('.').pop()}`;
      const avatarUrl = await uploadImage(file, fileName);
      
      const { data, error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', profile?.id)
        .select()
        .single();

      if (error) throw error;
      onProfileUpdate(data);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      alert('Erreur lors de l\'upload de l\'avatar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleHeroImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingHero(true);
    try {
      const fileName = `hero_${Date.now()}.${file.name.split('.').pop()}`;
      const heroImageUrl = await uploadImage(file, fileName);
      
      const { data, error } = await supabase
        .from('profiles')
        .update({ hero_image_url: heroImageUrl })
        .eq('id', profile?.id)
        .select()
        .single();

      if (error) throw error;
      onProfileUpdate(data);
      alert('Image d\'accueil mise à jour !');
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      alert('Erreur lors de l\'upload de l\'image d\'accueil');
    } finally {
      setIsUploadingHero(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', profile?.id)
        .select()
        .single();

      if (error) throw error;
      onProfileUpdate(data);
      alert('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour du profil');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Avatar Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <User className="w-5 h-5 mr-2 text-purple-600" />
          Photo de profil
        </h3>
        
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          
          <div>
            <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300">
              {isUploading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Upload...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Changer la photo</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={isUploading}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">
              JPG, PNG ou GIF. Max 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <User className="w-5 h-5 mr-2 text-purple-600" />
          Image d'accueil du portfolio
        </h3>
        
        <div className="space-y-4">
          {profile?.hero_image_url && (
            <div className="w-full h-48 rounded-xl overflow-hidden bg-gray-100">
              <img
                src={profile.hero_image_url}
                alt="Image d'accueil"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div>
            <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300">
              {isUploadingHero ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Upload...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Changer l'image d'accueil</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleHeroImageChange}
                disabled={isUploadingHero}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">
              Image qui s'affichera sur la page d'accueil. JPG, PNG ou GIF. Max 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* Logo Configuration */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <User className="w-5 h-5 mr-2 text-purple-600" />
          Configuration du logo
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de logo *
            </label>
            <select
              name="logo_type"
              value={formData.logo_type}
              onChange={handleSelectChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
            >
              <option value="text">Texte</option>
              <option value="icon">Icône</option>
            </select>
          </div>

          {formData.logo_type === 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texte du logo *
              </label>
              <input
                type="text"
                name="logo_text"
                value={formData.logo_text}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                placeholder="Mon Portfolio"
              />
            </div>
          )}

          {formData.logo_type === 'icon' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icône du logo *
              </label>
              <select
                name="logo_icon"
                value={formData.logo_icon}
                onChange={handleSelectChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
              >
                {AVAILABLE_ICONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-2">
                Choisissez une icône pour représenter votre marque
              </p>
            </div>
          )}

          {/* Aperçu du logo */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm font-medium text-gray-700 mb-3">Aperçu :</p>
            <div className="flex items-center">
              {formData.logo_type === 'text' ? (
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {formData.logo_text || 'Texte du logo'}
                </span>
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Informations personnelles
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre professionnel *
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biographie *
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Localisation *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL du CV
            </label>
            <input
              type="url"
              name="cv_url"
              value={formData.cv_url}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
              placeholder="https://..."
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2"
          >
            {isSaving ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Sauvegarde...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Sauvegarder</span>
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}