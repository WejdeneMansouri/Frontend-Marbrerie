// src/pages/Accueil.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Accueil() {
  const navigate = useNavigate();

  const styles = {
    container: {
      backgroundImage: `url('/images/11.png')`, // remplace selon le chemin correct
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      color: '#222',
      display: 'flex',
      flexDirection: 'column',
    },
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
    },
    links: {
      display: 'flex',
      gap: '2rem',
      fontSize: '1.1rem',
    },
    logo: {
      textAlign: 'center',
      flexGrow: 1,
      fontSize: '4rem',
      marginTop: '3rem',
    },
    subtitle: {
      textAlign: 'center',
      fontSize: '1.3rem',
      color: '#333',
    },
    button: {
      background: 'black',
      color: 'white',
      padding: '12px 30px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      margin: '2rem auto',
      fontSize: '1rem',
    },
    loginBtn: {
      padding: '8px 16px',
      border: '1px solid black',
      borderRadius: '5px',
      background: 'white',
      cursor: 'pointer',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.nav}>
        <div style={styles.links}>
                    <span style={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>Home</span>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/acceuil')}>Accueil</span>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Produits</span>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/mes-commandes')}>Mes commandes</span>
          <span>À propos</span>
        </div >
          <div style={{ display: 'flex', gap: '1rem' }}>
        <button style={styles.loginBtn} onClick={() => navigate('/panier')}>Panier</button>
        <button style={styles.loginBtn} onClick={() => navigate('/login')}>Se connecter</button>
        </div>
      </div>

      <div style={styles.logo}>MARBRE</div>
      <button style={styles.button} onClick={() => navigate('/')}>CATALOGUE</button>
    </div>
  );
}
