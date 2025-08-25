import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function Accueil() {
  const [produits, setProduits] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/produits')
      .then(res => res.json())
      .then(data => setProduits(data))
      .catch(err => console.error("Erreur chargement produits :", err));
  }, []);

  const ajouterAuPanier = (produit) => {
    if (!user) {
      localStorage.setItem('pendingPanier', JSON.stringify([produit]));
      navigate('/login');
    } else {
      const panier = JSON.parse(localStorage.getItem('panier')) || [];
      panier.push(produit);
      localStorage.setItem('panier', JSON.stringify(panier));
      navigate('/panier');
    }
  };

 const styles = {
  background: {
    backgroundImage: 'url("/images/11.png")',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#222',
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '30px',
    borderRadius: '12px',
    maxWidth: '1400px',
    margin: '0 auto',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  navLinks: {
    display: 'flex',
    gap: '2rem',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'color 0.3s',
  },
  navLinkHover: {
    color: '#007bff',
  },
  loginBtn: {
    padding: '8px 16px',
    border: '1px solid #111',
    borderRadius: '5px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s',
  },
  loginBtnHover: {
    backgroundColor: '#111',
    color: 'white',
  },
  title: {
    textAlign: 'center',
    fontSize: '3.5rem',
    fontWeight: 'bold',
    margin: '30px 0 10px',
    fontFamily: 'Georgia, serif',
    color: '#111',
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '40px',
    fontWeight: '500',
    color: '#555',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '30px',
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    background: '#fff',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  cardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.12)',
  },
  image: {
    width: '100%',
    height: '220px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  btn: {
    marginTop: '10px',
    padding: '12px',
    width: '100%',
    border: 'none',
    backgroundColor: '#111',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  btnHover: {
    backgroundColor: '#007bff',
  },
};


  return (
    <div style={styles.background}>
      <div style={styles.overlay}>
        {/* Barre de navigation */}
        <div style={styles.navbar}>
          <div style={styles.navLinks}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>Home</span>
            <span onClick={() => navigate('/acceuil')}>Produits</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/mes-commandes')}>Mes commandes</span>
                      <span style={{ cursor: 'pointer' }} onClick={() => navigate('/Apropos')}>À propos</span>

          </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
        <button style={styles.loginBtn} onClick={() => navigate('/panier')}>Panier</button>
          <button
            style={styles.loginBtn}
            onClick={() => navigate(user ? '/compte' : '/login')}
          >
            {user ? 'Compte' : 'Se connecter'}
          </button>
          </div>
        </div>

        {/* Titres */}
        <div style={styles.title}>MARBRE</div>
        <div style={styles.sectionTitle}>Produits</div>

        {/* Grille de produits */}
        <div style={styles.grid}>
          {produits.map(p => (
            <div style={styles.card} key={p.id}>
              <img src={p.image_url} alt={p.nom} style={styles.image} />
              <h3 style={{ marginBottom: '5px' }}>{p.nom}</h3>
              <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{p.prix_m2} €</p>
              <button
                type="button"
                style={styles.btn}
                onClick={() => ajouterAuPanier(p)}
              >
                Ajouter au panier
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
