import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, FolderOpen, Settings, LogOut, User } from 'lucide-react';

export function AdminLayout() {
  const { user, isAdmin, signOut, loading } = useAuth();
  const location = useLocation();

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Rediriger vers login si pas connecté
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Projets', href: '/admin/projects', icon: FolderOpen },
    { name: 'Paramètres', href: '/admin/settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="pt-20">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white/70 backdrop-blur-sm shadow-xl min-h-screen">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>
            
            <nav className="mt-6 px-3">
              <div className="space-y-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href || 
                    (item.href !== '/admin' && location.pathname.startsWith(item.href));
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-300"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Déconnexion
                </button>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}