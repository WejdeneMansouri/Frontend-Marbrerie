import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, token } = useContext(AuthContext);

  if (!token || !user) {
    // Pas connecté => redirige vers login
    return <Navigate to="/login" replace />;
  }

  // Connecté => affiche la page demandée
  return children;
};

export default PrivateRoute;
