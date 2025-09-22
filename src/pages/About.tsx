import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, MapPin, Mail, Phone, Calendar, GraduationCap, Briefcase, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Profile, Experience, Skill, SocialLink } from '../types';

export default function About() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer le profil
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Récupérer les expériences
        const { data: experiencesData, error: experiencesError } = await supabase
          .from('experiences')
          .select('*')
          .order('start_date', { ascending: false });

        if (experiencesError) throw experiencesError;
        setExperiences(experiencesData || []);

        // Récupérer les compétences
        const { data: skillsData, error: skillsError } = await supabase
          .from('skills')
          .select('*')
          .order('category', { ascending: true });

        if (skillsError) throw skillsError;
        setSkills(skillsData || []);

        // Récupérer les liens sociaux
        const { data: socialData, error: socialError } = await supabase
          .from('social_links')
          .select('*')
          .order('order_index', { ascending: true });

        if (socialError) throw socialError;
        setSocialLinks(socialData || []);

      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric'
    });
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="container mx-auto px-6 py-20">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            À propos de moi
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez mon parcours, mes compétences et ma passion pour l'architecture
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Colonne gauche - Profil */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            {/* Photo et infos de base */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-8">
              {profile?.avatar_url && (
                <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
                  <img
                    src={profile.avatar_url}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
                {profile?.name}
              </h2>
              <p className="text-purple-600 text-center font-medium mb-6">
                {profile?.title}
              </p>

              {/* Informations de contact */}
              <div className="space-y-4">
                {profile?.email && (
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-5 h-5 mr-3 text-purple-600" />
                    <span>{profile.email}</span>
                  </div>
                )}
                {profile?.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 mr-3 text-purple-600" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile?.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3 text-purple-600" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>

              {/* Bouton téléchargement CV */}
              {profile?.cv_url && (
                <motion.a
                  href={profile.cv_url}
                  download
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300"
                >
                  <Download className="w-5 h-5" />
                  Télécharger mon CV
                </motion.a>
              )}

              {/* Réseaux sociaux */}
              {socialLinks.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Suivez-moi</h3>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((link) => (
                      <motion.a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-300"
                      >
                        <span className="text-sm font-bold">
                          {link.platform.charAt(0).toUpperCase()}
                        </span>
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Colonne droite - Contenu */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Bio */}
            {profile?.bio && (
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Award className="w-6 h-6 mr-3 text-purple-600" />
                  Présentation
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Expériences */}
            {experiences.length > 0 && (
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <GraduationCap className="w-6 h-6 mr-3 text-purple-600" />
                  Parcours
                </h3>
                <div className="space-y-6">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="border-l-4 border-purple-200 pl-6 pb-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-xl font-semibold text-gray-800">
                            {exp.title}
                          </h4>
                          <p className="text-purple-600 font-medium">
                            {exp.institution}
                          </p>
                          {exp.location && (
                            <p className="text-gray-500 text-sm">
                              {exp.location}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(exp.start_date)} - {exp.current ? 'Présent' : formatDate(exp.end_date!)}
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-gray-600 mt-3">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compétences */}
            {Object.keys(groupedSkills).length > 0 && (
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Briefcase className="w-6 h-6 mr-3 text-purple-600" />
                  Compétences
                </h3>
                <div className="space-y-6">
                  {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                    <div key={category}>
                      <h4 className="text-lg font-semibold text-gray-700 mb-3 capitalize">
                        {category}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categorySkills.map((skill) => (
                          <div key={skill.id} className="flex items-center justify-between">
                            <span className="text-gray-600">{skill.name}</span>
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-3 h-3 rounded-full ${
                                    i < skill.level
                                      ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                                      : 'bg-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export { About }