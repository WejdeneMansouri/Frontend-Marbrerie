import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // Charger utilisateur depuis le localStorage au démarrage
  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("❌ Erreur parsing user localStorage:", e);
          localStorage.removeItem('user');
        }
      }
    }
  }, [token]);

  // Connexion → sauvegarde token + user complet
  function login(token, userData) {
    setToken(token);
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  }

  // Mise à jour user (utile après modification profil)
  function updateUser(userData) {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }

  // Déconnexion → reset tout
  function logout() {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  return (
    <AuthContext.Provider value={{ user, token, login, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
