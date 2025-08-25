import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function MesCommandes() {
  const { user } = useContext(AuthContext);
  const [commandes, setCommandes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    axios.get('http://localhost:5000/api/commandes')
      .then(res => {
        const mesCommandes = res.data.filter(c => c.user_id === user.id);
        setCommandes(mesCommandes);
      })
      .catch(err => console.error('❌ Erreur récupération commandes:', err));
  }, [user, navigate]);

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundImage: `url('/images/11.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: '#222',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '2rem',
    },
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      maxWidth: '1200px',
      marginBottom: '2rem',
    },
    links: {
      display: 'flex',
      gap: '2rem',
      fontSize: '1.1rem',
      fontWeight: 'bold',
    },
    loginBtn: {
      padding: '8px 16px',
      border: '1px solid #111',
      borderRadius: '5px',
      backgroundColor: 'white',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    commande: {
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderRadius: '10px',
      padding: '1.5rem',
      marginBottom: '2rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '700px',
    },
    titre: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
    },
    detail: {
      marginBottom: '0.8rem',
      fontSize: '1rem',
      lineHeight: '1.4',
    },
    statut: {
      marginTop: '1rem',
      fontStyle: 'italic',
      fontWeight: 'bold',
      color: '#333',
    },
    header: {
      fontSize: '2rem',
      marginBottom: '2rem',
      textAlign: 'center',
      color: '#111',
    },
    emptyMsg: {
      fontSize: '1.2rem',
      marginTop: '2rem',
      color: '#555',
    }
  };

  return (
    <div style={styles.container}>
      {/* Barre de navigation */}
      <div style={styles.nav}>
        <div style={styles.links}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>Home</span>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/acceuil')}>Produits</span>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/mes-commandes')}>Mes commandes</span>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/Apropos')}>À propos</span>
        </div>
        <div>
          <button style={styles.loginBtn} onClick={() => navigate('/panier')}>Panier</button>
          <button style={styles.loginBtn} onClick={() => navigate(user ? '/compte' : '/login')}>
            {user ? 'Compte' : 'Se connecter'}
          </button>
        </div>
      </div>

      <h2 style={styles.header}>Mes Commandes</h2>

      {commandes.length === 0 ? (
        <p style={styles.emptyMsg}>Vous n'avez encore passé aucune commande.</p>
      ) : (
        commandes.map((commande, index) => (
          <div key={index} style={styles.commande}>
            <div style={styles.titre}>
              Commande #{commande.id} - {new Date(commande.date_commande).toLocaleDateString()}
            </div>
            {commande.details.map((produit, i) => (
              <div key={i} style={styles.detail}>
                <p>🧱 <strong>{produit.produit_nom}</strong></p>
                <p>📏 Dimensions : {produit.longueur_cm}cm x {produit.largeur_cm}cm</p>
                <p>📦 Quantité : {produit.quantite}</p>
                <p>💰 Prix total : {produit.prix_total} DT</p>
              </div>
            ))}
            <div style={styles.statut}>Statut : {commande.statut || 'en attente'}</div>
          </div>
        ))
      )}
    </div>
  );
}
