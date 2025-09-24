// src/pages/AdminProduits.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext'; // pour le token

const AdminProduits = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext); // récupération du token
  const [produits, setProduits] = useState([]);

  useEffect(() => {
    fetchProduits();
  }, []);

  const fetchProduits = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/produits', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProduits(res.data);
    } catch (err) {
      console.error('Erreur de chargement des produits', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/produits/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProduits(produits.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de la suppression");
    }
  };

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: 'Segoe UI, sans-serif',
    },
    topBar: {
      marginBottom: '1.5rem',
    },
    button: {
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '0.6rem 1.2rem',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    heading: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      background: 'white',
      borderRadius: '6px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    th: {
      padding: '10px',
      border: '1px solid #eee',
      backgroundColor: '#f3f4f6',
    },
    td: {
      padding: '10px',
      border: '1px solid #eee',
      textAlign: 'center',
    },
    img: {
      height: '64px',
      objectFit: 'cover',
      borderRadius: '4px',
    },
    deleteBtn: {
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      padding: '0.4rem 0.8rem',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <button style={styles.button} onClick={() => navigate('/admin/dashboard')}>
          🏠 Retour au Dashboard
        </button>
      </div>

      <h2 style={styles.heading}>🛠️ Produits Disponibles</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Image</th>
            <th style={styles.th}>Nom</th>
            <th style={styles.th}>Gamme</th>
            <th style={styles.th}>Marque</th>
            <th style={styles.th}>Quantité</th>
            <th style={styles.th}>Prix (DT)</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {produits.map((p) => (
            <tr key={p.id}>
              <td style={styles.td}>
                {p.image_url && <img src={p.image_url} alt={p.nom} style={styles.img} />}
              </td>
              <td style={styles.td}>{p.nom}</td>
              <td style={styles.td}>{p.gamme}</td>
              <td style={styles.td}>{p.marque}</td>
              <td style={{
                ...styles.td,
                color: p.quantite === 0 ? '#6b7280' : p.quantite < 5 ? '#dc2626' : '#2563eb',
                fontWeight: p.quantite === 0 ? 'bold' : 'normal'
              }}>
                {p.quantite === 0 ? 'Rupture de stock' : p.quantite}
              </td>
              <td style={styles.td}>{p.prix_m2} DT</td>
              <td style={styles.td}>
                <button style={styles.deleteBtn} onClick={() => handleDelete(p.id)}>🗑 Supprimer</button>
              </td>
            </tr>
          ))}
          {produits.length === 0 && (
            <tr>
              <td style={styles.td} colSpan="7">Aucun produit disponible.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProduits;
