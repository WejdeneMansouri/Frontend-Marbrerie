// src/pages/Accueil.js
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function Accueil() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [produits, setProduits] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Charger les produits depuis l'API
  useEffect(() => {
    fetch('http://localhost:5000/api/produits')
      .then(res => res.json())
      .then(data => setProduits(data))
      .catch(err => console.error("Erreur chargement produits :", err));
  }, []);

  // Défilement automatique toutes les 5 secondes
  useEffect(() => {
    if (produits.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % produits.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [produits]);

  const ajouterAuPanier = (produit) => {
    if (!user) {
      localStorage.setItem('pendingPanier', JSON.stringify([produit]));
      navigate('/login');
    } else {
      const panier = JSON.parse(localStorage.getItem('panier')) || [];
      panier.push(produit);
      localStorage.setItem('panier', JSON.stringify(panier));
      alert(`✅ ${produit.nom} ajouté au panier !`);
    }
  };

  const styles = {
    container: {
      backgroundImage: `url('/images/11.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      color: '#222',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1rem',
      fontFamily: 'Arial, sans-serif',
    },
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      padding: '1rem 2rem',
    },
    links: {
      display: 'flex',
      gap: '2rem',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
    loginBtn: {
      padding: '8px 16px',
      border: '1px solid black',
      borderRadius: '5px',
      background: 'white',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    logo: {
      fontSize: '4rem',
      margin: '2rem 0',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    catalogueContainer: {
      width: '500px',
      height: '300px',
      position: 'relative',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      cursor: 'pointer',
      marginBottom: '2rem',
    },
    catalogueImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'opacity 0.5s ease-in-out',
    },
    catalogueTitle: {
      position: 'absolute',
      bottom: '10px',
      left: '15px',
      color: '#fff',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: '5px 10px',
      borderRadius: '5px',
      fontWeight: 'bold',
    },
    button: {
      background: 'black',
      color: 'white',
      padding: '12px 30px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: 'bold',
      marginBottom: '2rem',
    }
  };

  return (
    <div style={styles.container}>
      {/* Barre de navigation */}
      <div style={styles.nav}>
        <div style={styles.links}>
          <span onClick={() => navigate('/home')}>Home</span>
          <span onClick={() => navigate('/acceuil')}>Produits</span>
          <span onClick={() => navigate('/mes-commandes')}>Mes commandes</span>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/Apropos')}>À propos</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={styles.loginBtn} onClick={() => navigate('/panier')}>Panier</button>
          <button style={styles.loginBtn} onClick={() => navigate(user ? '/compte' : '/login')}>
            {user ? 'Compte' : 'Se connecter'}
          </button>
        </div>
      </div>

      {/* Logo */}
      <div style={styles.logo}>MARBRE</div>

      {/* Catalogue interactif */}
      {produits.length > 0 && (
        <div
          style={styles.catalogueContainer}
          onClick={() => ajouterAuPanier(produits[currentIndex])}
        >
          <img
            src={produits[currentIndex].image_url}
            alt={produits[currentIndex].nom}
            style={styles.catalogueImage}
          />
          <div style={styles.catalogueTitle}>{produits[currentIndex].nom}</div>
        </div>
      )}

      <button style={styles.button} onClick={() => navigate('/acceuil')}>
        Voir tous les produits
      </button>
    </div>
  );
}
