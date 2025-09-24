import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminProduits from './pages/AdminProduits';
import AdminCommandes from './pages/AdminCommandes';
import Home from './pages/Home';
import Accueil from './pages/Accueil';
import Panier from './pages/Panier';
import { AuthProvider } from './AuthContext';
import { PanierProvider } from './PanierContext';
import ProtectedRoute from './ProtectedRoute';
import MesCommandes from './pages/MesCommandes';
import Paiement from './pages/Paiement';
import Compte from './pages/Compte';
import Apropos from './pages/Apropos';
import AdminDashboard from './pages/AdminDashboard';
import AdminClients from './pages/AdminClients';
import AdminProduitForm from './pages/AdminProduitForm';
import AjoutAdmins from './pages/AjoutAdmins';

function App() {
  return (
    <AuthProvider>
      <PanierProvider>
        <Router>
          <Routes>
            {/* Pages publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/acceuil" element={<Accueil />} />
            <Route path="/panier" element={<Panier />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/mes-commandes" element={<MesCommandes />} />
            <Route path="/Paiement" element={<Paiement />} />
            <Route path="/compte" element={<Compte />} />
            <Route path="/Apropos" element={<Apropos />} />
            <Route path="/admin/clients" element={<AdminClients />} />
            <Route path="/admin/produit-form" element={<AdminProduitForm />} />
            <Route path="/admin/produit-form/:id" element={<AdminProduitForm />} /> // pour modification
            <Route path="/admin/profile" element={<Compte />} />
            <Route path="/admin/ajout-admins" element={<AjoutAdmins />} />


            {/* ✅ Correction ici */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Routes protégées admin */}
            <Route
              path="/admin/produits"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminProduits />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/commandes"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminCommandes />
                </ProtectedRoute>
              }
            />

            {/* Redirection par défaut */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </PanierProvider>
    </AuthProvider>
  );
}

export default App;
