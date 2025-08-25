import React from 'react';
import { useNavigate } from 'react-router-dom';

// Importation des images depuis le dossier public
const images = [
  "/images/ancien1.png",
  "/images/ancien2.png",
  "/images/ancien3.png",
  "/images/ancien4.png"
];

export default function AboutPage({ user }) {
  const navigate = useNavigate();

  const styles = {
    container: {
      backgroundColor: '#fdf9f2',
      minHeight: '100vh',
      color: '#222',
      fontFamily: 'Arial, sans-serif',
      padding: '0',
      margin: '0',
    },
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: 'rgba(255,255,255,0.95)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    },
    navLinks: {
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
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
    },
    title: {
      textAlign: 'center',
      fontSize: '3rem',
      fontWeight: 'bold',
      marginBottom: '2rem',
      letterSpacing: '1px',
    },
    sectionTitle: {
      fontSize: '2rem',
      fontWeight: '600',
      marginBottom: '1rem',
    },
    paragraph: {
      fontSize: '1.1rem',
      lineHeight: '1.8',
      marginBottom: '1rem',
    },
    gallery: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginTop: '2rem',
    },
    galleryItem: {
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    },
    galleryImage: {
      width: '100%',
      height: '250px',
      objectFit: 'cover',
      transition: 'transform 0.3s ease',
    }
  };

  return (
    <div style={styles.container}>
      {/* Barre de navigation */}
      <div style={styles.navbar}>
        <div style={styles.navLinks}>
          <span onClick={() => navigate('/home')}>Home</span>
          <span onClick={() => navigate('/produits')}>Produits</span>
          <span onClick={() => navigate('/mes-commandes')}>Mes commandes</span>
          <span onClick={() => navigate('/apropos')}>À propos</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={styles.loginBtn} onClick={() => navigate('/panier')}>Panier</button>
          <button style={styles.loginBtn} onClick={() => navigate(user ? '/compte' : '/login')}>
            {user ? 'Compte' : 'Se connecter'}
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div style={styles.content}>
        <h1 style={styles.title}>À PROPOS</h1>

        {/* Historique */}
        <div>
          <h2 style={styles.sectionTitle}>HISTORIQUE</h2>
          <p style={styles.paragraph}>
            Marberi el Wafe est une entreprise familiale fondée en <strong>1958</strong>, spécialisée dans le travail et la transformation du marbre. Depuis plus de 60 ans, elle perpétue un savoir-faire artisanal unique qui associe qualité, créativité et respect des traditions.
          </p>
          <p style={styles.paragraph}>
            Grâce à la confiance de nos clients et à notre engagement constant dans la qualité, nous avons su préserver et enrichir notre histoire. Nous remercions toutes les générations qui ont contribué à bâtir la réputation de Marberi el Wafe.
          </p>
        </div>

        {/* Galerie d'images */}
        <div style={styles.gallery}>
          {images.map((src, index) => (
            <div key={index} style={styles.galleryItem}>
              <img src={src} alt={`Marbre ${index + 1}`} style={styles.galleryImage} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
