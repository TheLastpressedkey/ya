import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Projects } from './pages/Projects';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { ProjectDetail } from './pages/ProjectDetail';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Navbar />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/projets" element={<Projects />} />
            <Route path="/projets/:id" element={<ProjectDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<div>Liste des projets (à implémenter)</div>} />
              <Route path="projects/new" element={<div>Nouveau projet (à implémenter)</div>} />
              <Route path="settings" element={<div>Paramètres (à implémenter)</div>} />
            </Route>
          </Routes>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;