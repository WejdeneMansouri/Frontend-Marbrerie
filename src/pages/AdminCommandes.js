// src/pages/AdminCommandes.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminCommandes = () => {
  const [commandes, setCommandes] = useState([]);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchCommandes();
  }, [token]);

  const fetchCommandes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/commandes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCommandes(res.data);
    } catch (err) {
      console.error("❌ Erreur de chargement des commandes", err);
    }
  };

  const updateStatut = async (id, newStatut) => {
    try {
      console.log(`🔁 Mise à jour commande ${id} → ${newStatut}`);
      await axios.put(
        `http://localhost:5000/api/commandes/${id}`,
        { statut: newStatut },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCommandes(commandes.map(cmd =>
        cmd.id === id ? { ...cmd, statut: newStatut } : cmd
      ));
    } catch (err) {
      console.error("❌ Erreur mise à jour statut", err);
    }
  };

  const handleAccepter = (id) => updateStatut(id, "acceptée");
  const handleRejeter = (id) => updateStatut(id, "rejetée");

  const styles = {
    container: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: 'Segoe UI, sans-serif'
    },
    topBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem'
    },
    dashboardBtn: {
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '0.6rem 1.2rem',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    card: {
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      backgroundColor: '#fff',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '8px'
    },
    details: {
      marginTop: '1rem',
      paddingLeft: '1rem'
    },
    select: {
      padding: '0.5rem',
      borderRadius: '4px',
      border: '1px solid #ccc',
      marginTop: '0.5rem'
    },
    buttonGroup: {
      marginTop: '0.5rem',
      display: 'flex',
      gap: '10px'
    },
    buttonAccept: {
      backgroundColor: '#4caf50',
      color: 'white',
      padding: '0.4rem 1rem',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    buttonReject: {
      backgroundColor: '#f44336',
      color: 'white',
      padding: '0.4rem 1rem',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    noData: {
      textAlign: 'center',
      color: '#6b7280',
      fontSize: '1.1rem',
      marginTop: '4rem'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <button
          style={styles.dashboardBtn}
          onClick={() => navigate('/admin/dashboard')}
        >
          ⬅️ Retour au Dashboard
        </button>
        <h2 style={styles.title}>📦 Gestion des Commandes</h2>
      </div>

      {commandes.length === 0 ? (
        <p style={styles.noData}>🛑 Aucune commande trouvée pour le moment.</p>
      ) : (
        commandes.map((commande) => (
          <div key={commande.id} style={styles.card}>
            <p><strong>Commande #{commande.id}</strong> — Client : {commande.client_nom}</p>
            <p>Date : {new Date(commande.date_commande).toLocaleDateString()}</p>

            <div>
              <strong>Statut :</strong><br />
              {commande.statut === "en attente" || commande.statut === "nouvelle" ? (
                <div style={styles.buttonGroup}>
                  <button
                    style={styles.buttonAccept}
                    onClick={() => handleAccepter(commande.id)}
                  >
                    Accepter
                  </button>
                  <button
                    style={styles.buttonReject}
                    onClick={() => handleRejeter(commande.id)}
                  >
                    Rejeter
                  </button>
                </div>
              ) : commande.statut === "acceptée" || commande.statut === "préparation" || commande.statut === "prête" || commande.statut === "livraison" || commande.statut === "livrée" ? (
                <select
                  value={commande.statut}
                  onChange={(e) => updateStatut(commande.id, e.target.value)}
                  style={styles.select}
                >
                  <option value="en attente">En attente</option>
                  <option value="acceptée">Acceptée</option>
                  <option value="rejetée">Rejetée</option>
                  <option value="préparation">Préparation</option>
                  <option value="prête">Prête</option>
                  <option value="livraison">En cours de livraison</option>
                  <option value="livrée">Livrée</option>
                </select>
              ) : commande.statut === "rejetée" ? (
                <span style={{ color: '#f44336', fontWeight: 'bold' }}>Rejetée</span>
              ) : (
                <span>{commande.statut}</span>
              )}
            </div>

            <div style={styles.details}>
              <h4>Détails :</h4>
              <ul>
                {commande.details.map((d, i) => (
                  <li key={i}>
                    {d.produit_nom} — {d.longueur_cm}×{d.largeur_cm}cm — {d.quantite} pièce(s) — Total : {d.prix_total} DT
                  </li>
                ))}
              </ul>
              <p>
                <strong>💰 Prix total de la commande :</strong> {
                  commande.details.reduce((sum, d) => sum + Number(d.prix_total), 0).toFixed(2)
                } DT
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminCommandes;
