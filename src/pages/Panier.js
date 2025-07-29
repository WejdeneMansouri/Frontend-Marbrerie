import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function Panier() {
  const [panier, setPanier] = useState([]);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('panier')) || [];
    setPanier(stored);
  }, []);

  const supprimerArticle = (indexToRemove) => {
    const updatedPanier = panier.filter((_, index) => index !== indexToRemove);
    setPanier(updatedPanier);
    localStorage.setItem('panier', JSON.stringify(updatedPanier));
  };

 const passerCommande = async () => {
  if (!user || !token) {
    navigate('/login', { state: { from: '/panier' } }); // <== Redirection avec retour
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/commandes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        user_id: user.id,
        produits: panier.map(p => ({
          produit_id: p.id,
          longueur_cm: 100,
          largeur_cm: 100,
          quantite: 1,
          prix_total: p.prix_m2
        }))
      })
    });

    if (response.ok) {
      alert('✅ Commande envoyée !');
      localStorage.removeItem('panier');
      setPanier([]);
      // navigate('/confirmation');
    } else {
      alert('❌ Erreur lors de la commande');
    }
  } catch (error) {
    console.error('Erreur commande:', error);
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
    },
    overlay: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '20px',
      borderRadius: '12px',
    },
    title: {
      textAlign: 'center',
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '20px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
    },
    card: {
      border: '0.5px solid #ccc',
      borderRadius: '4px',
      padding: '15px',
      background: '#fff',
      textAlign: 'center',
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      borderRadius: '6px',
    },
    supprimerBtn: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: '#f44336',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '28px',
      height: '28px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    btnCommander: {
      marginTop: '30px',
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: '12px 25px',
      background: '#000',
      color: '#fff',
      fontSize: '16px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
    },
    btnRetour: {
      marginTop: '15px',
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: '12px 25px',
      background: '#fff',
      color: '#000',
      fontSize: '16px',
      border: '1px solid black',
      borderRadius: '6px',
      cursor: 'pointer',
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.overlay}>
        <div style={styles.title}>Votre panier</div>
        {panier.length === 0 ? (
          <p style={{ textAlign: 'center' }}>🛒 Aucun article dans le panier</p>
        ) : (
          <>
            <div style={styles.grid}>
              {panier.map((p, index) => (
                <div style={styles.card} key={index}>
                  <button style={styles.supprimerBtn} onClick={() => supprimerArticle(index)}>×</button>
                  <img src={p.image_url} alt={p.nom} style={styles.image} />
                  <h3>{p.nom}</h3>
                  <p>{p.prix_m2} €</p>
                </div>
              ))}
            </div>

            {/* Passer la commande */}
            <button style={styles.btnCommander} onClick={passerCommande}>
              Passer la commande
            </button>

            {/* Retour au shop */}
            <button style={styles.btnRetour} onClick={() => navigate('/acceuil')}>
              Continuer mes achats
            </button>
          </>
        )}
      </div>
    </div>
  );
}
