import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Home, Building, Palette, Compass, Crown, Diamond, Hexagon, Triangle, Circle, Square, Star, Heart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .single();
      
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      User, Home, Building, Palette, Compass, Crown, Diamond,
      Hexagon, Triangle, Circle, Square, Star, Heart
    };
    return icons[iconName] || User;
  };

  const renderLogo = () => {
    if (!profile) {
      return 'Portfolio';
    }

    if (profile.logo_type === 'icon') {
      const IconComponent = getIconComponent(profile.logo_icon || 'User');
      return (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
            <IconComponent className="w-4 h-4 text-white" />
          </div>
          {profile.logo_text && (
            <span>{profile.logo_text}</span>
          )}
        </div>
      );
    }

    return profile.logo_text || profile.name || 'Portfolio';
  };

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Projets', href: '/projets' },
    { name: 'À propos', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/80 backdrop-blur-xl fixed w-full z-50 border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {renderLogo()}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  location.pathname === item.href
                    ? 'text-purple-600'
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                {item.name}
                {location.pathname === item.href && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"
                    layoutId="navbar-underline"
                  />
                )}
              </Link>
            ))}
            
            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all duration-300"
              >
                Dashboard
              </Link>
            )}
            
            {user && !isAdmin && (
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-gray-100 transition-all duration-200"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100"
          >
            <div className="px-4 py-6 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    location.pathname === item.href
                      ? 'text-purple-600 bg-purple-50'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-base font-medium text-center"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}