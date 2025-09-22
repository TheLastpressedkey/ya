import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Instagram, Linkedin, Palette, Dribbble, Globe, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Profile, SocialLink } from '../types';

export function Footer() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
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

      // Récupérer les liens sociaux
      const { data: socialData } = await supabase
        .from('social_links')
        .select('*')
        .order('order_index');

      setProfile(profileData);
      setSocialLinks(socialData || []);
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

  if (loading) {
    return (
      <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {profile?.name?.split(' ')[0] || 'Yasmine'}
              </span>
              <span className="text-white"> {profile?.name?.split(' ').slice(1).join(' ') || 'Adjoumani'}</span>
            </h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              {profile?.bio || 'Passionnée par l\'architecture contemporaine et le design durable. Je crée des espaces qui racontent des histoires et inspirent les communautés.'}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110"
                >
                  {renderSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>
          
          {/* Navigation Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">Navigation</h4>
            <div className="space-y-3">
              <a href="/" className="block text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300">
                Accueil
              </a>
              <a href="/projets" className="block text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300">
                Projets
              </a>
              <a href="/about" className="block text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300">
                À propos
              </a>
              <a href="/contact" className="block text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300">
                Contact
              </a>
            </div>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">Contact</h4>
            <div className="space-y-3">
              {profile?.email && (
                <a 
                  href={`mailto:${profile.email}`}
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300"
                >
                  <Mail className="w-5 h-5 text-purple-400" />
                  <span>{profile.email}</span>
                </a>
              )}
              {profile?.phone && (
                <a 
                  href={`tel:${profile.phone}`}
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300"
                >
                  <Phone className="w-5 h-5 text-purple-400" />
                  <span>{profile.phone}</span>
                </a>
              )}
              {profile?.location && (
                <div className="flex items-center space-x-3 text-gray-300">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-300 text-sm">
              © 2024 {profile?.name || 'Yasmine Adjoumani'}. Tous droits réservés.
            </p>
            <p className="text-gray-400 text-sm">
              Conçu avec ❤️ pour l'architecture moderne
            </p>
          </div>
        </div>
      </div>
      
      {/* Decorative gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600">
        <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
      </div>
    </footer>
  );
}