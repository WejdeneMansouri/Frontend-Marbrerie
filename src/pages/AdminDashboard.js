// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    produits: 0,
    admins: 0,
    commandes: 0,
    revenus: 0
  });

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats({
        produits: response.data.produits,
        admins: response.data.admins,
        commandes: response.data.commandes,
        revenus: response.data.revenus
      });
    } catch (err) {
      console.error('❌ Erreur récupération stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      <style>{`
        .dashboard { min-height: 100vh; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
        .dashboard-header { display: flex; justify-content: space-between; align-items: center; background-color: #fff; padding: 20px 40px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
        .header-actions { display: flex; gap: 10px; }
        .dashboard-header h1 { font-size: 24px; color: #333; }
        .logout-btn, .profile-btn { background-color: #4299e1; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; transition: 0.3s; text-decoration: none; font-weight: 600; }
        .logout-btn { background-color: #e53e3e; }
        .logout-btn:hover { background-color: #c53030; }
        .profile-btn:hover { background-color: #3182ce; }
        .stats-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; padding: 20px 40px; }
        .stat-card { background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); display: flex; flex-direction: column; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; text-decoration: none; }
        .stat-card:hover { transform: translateY(-5px); box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .stat-title { font-size: 14px; color: #666; }
        .stat-value { font-size: 28px; font-weight: bold; margin-top: 5px; }
        .stat-card.blue { border-left: 5px solid #4299e1; }
        .stat-card.green { border-left: 5px solid #48bb78; }
        .stat-card.purple { border-left: 5px solid #9f7aea; }
        .stat-card.orange { border-left: 5px solid #ed8936; }
        .sections-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; padding: 20px 40px; }
        .section-card { background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); display: flex; flex-direction: column; }
        .section-card h2 { font-size: 20px; margin-bottom: 10px; color: #333; }
        .section-card p { font-size: 14px; color: #666; margin-bottom: 15px; }
        .btn { text-decoration: none; color: #fff; padding: 10px 20px; border-radius: 6px; font-weight: 600; display: inline-block; transition: 0.3s; }
        .btn-blue { background-color: #4299e1; }
        .btn-blue:hover { background-color: #3182ce; }
        .btn-green { background-color: #48bb78; }
        .btn-green:hover { background-color: #38a169; }
        .btn-purple { background-color: #9f7aea; }
        .btn-purple:hover { background-color: #805ad5; }
      `}</style>

      {/* Header */}
      <header className="dashboard-header">
        <h1>Tableau de bord Admin</h1>
        <div className="header-actions">
          <Link to="/admin/profile" className="profile-btn">Voir profil</Link>
          <button className="logout-btn" onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}>Déconnexion</button>
        </div>
      </header>

      {/* Stats cards */}
      <div className="stats-container">
        <Link to="/admin/produits" className="stat-card blue">
          <span className="stat-title">Produits</span>
          <span className="stat-value">{stats.produits}</span>
        </Link>
        <Link to="/admin/commandes" className="stat-card green">
          <span className="stat-title">Commandes</span>
          <span className="stat-value">{stats.commandes}</span>
        </Link>
        
        <div className="stat-card orange">
          <span className="stat-title">Revenus</span>
          <span className="stat-value">{stats.revenus} DTN</span>
        </div>
      </div>

      {/* Sections principales */}
      <div className="sections-container">
        <div className="section-card">
          <h2>Gestion des produits</h2>
          <p>Ajouter, modifier ou supprimer des produits disponibles dans votre boutique.</p>
          <Link to="/admin/produit-form" className="btn btn-blue">Gérer les produits</Link>
        </div>
        <div className="section-card">
          <h2>Gestion des commandes</h2>
          <p>Consulter les commandes, valider ou annuler les commandes des clients.</p>
          <Link to="/admin/commandes" className="btn btn-green">Gérer les commandes</Link>
        </div>
        <div className="section-card">
          <h2>Gestion des admins</h2>
          <p>Voir tous les admins et ajouter un nouvel administrateur.</p>
          <Link to="/admin/ajout-admins" className="btn btn-purple">Gérer les admins</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
