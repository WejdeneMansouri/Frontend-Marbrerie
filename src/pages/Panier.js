// src/pages/Panier.js
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function Panier() {
  const [panier, setPanier] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Charger le panier et initialiser quantité commandée
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('panier')) || [];
    const withQuantity = stored.map(p => ({
      ...p,
      quantiteCommandee: p.quantiteCommandee || 1,
      largeur: p.largeur || 1,
      hauteur: p.hauteur || 1
    }));
    setPanier(withQuantity);
  }, []);

  // Modifier largeur, hauteur ou quantité commandée
  const handleChange = (index, field, value) => {
    const updated = [...panier];
    updated[index][field] = Number(value);
    setPanier(updated);
    localStorage.setItem('panier', JSON.stringify(updated));
  };

  // Supprimer un article
  const supprimerArticle = (indexToRemove) => {
    const updatedPanier = panier.filter((_, index) => index !== indexToRemove);
    setPanier(updatedPanier);
    localStorage.setItem('panier', JSON.stringify(updatedPanier));
  };

  // Passer la commande
  const passerCommande = () => {
    if (!user) {
      navigate('/login', { state: { from: '/panier' } });
      return;
    }
    navigate('/paiement');
  };

  // Prix total
  const prixTotalCommande = panier.reduce((acc, p) => acc + p.largeur * p.hauteur * p.prix_m2 * p.quantiteCommandee, 0);

  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      backgroundImage: 'url("/images/11.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: '#222',
    },
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      padding: '0 10px',
    },
    links: { display: 'flex', gap: '1.5rem', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' },
    loginBtn: { padding: '6px 14px', border: '1px solid #111', borderRadius: '5px', backgroundColor: 'white', cursor: 'pointer', fontWeight: 'bold' },
    card: {
      position: 'relative',
      border: '1px solid #ddd',
      borderRadius: '10px',
      padding: '15px',
      marginBottom: '15px',
      backgroundColor: 'rgba(255,255,255,0.95)',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '15px',
      transition: 'box-shadow 0.2s',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    img: { width: '120px', height: '80px', objectFit: 'cover', borderRadius: '6px' },
    info: { display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 },
    input: { width: '60px', margin: '2px 0', padding: '4px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'center' },
    button: { padding: '10px 20px', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px', marginRight: '10px' },
    supprimerBtn: { backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontWeight: 'bold', position: 'absolute', top: '8px', right: '8px' },
    h2: { textAlign: 'center', marginBottom: '15px', fontSize: '1.8rem', color: '#111' },
    total: { textAlign: 'right', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '10px', color: '#111' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.nav}>
        <div style={styles.links}>
          <span onClick={() => navigate('/home')}>Home</span>
          <span onClick={() => navigate('/acceuil')}>Produits</span>
          <span onClick={() => navigate('/mes-commandes')}>Mes commandes</span>
                    <span style={{ cursor: 'pointer' }} onClick={() => navigate('/Apropos')}>À propos</span>

        </div>
        <div>
          <button style={styles.loginBtn} onClick={() => navigate('/panier')}>Panier</button>
        </div>
      </div>

      <h2>Votre panier</h2>

      {panier.length === 0 ? (
        <p>🛒 Aucun article dans le panier</p>
      ) : (
        <div>
          {panier.map((p, index) => {
            const surface = p.largeur * p.hauteur;
            const prixTotal = surface * p.prix_m2 * p.quantiteCommandee;

            return (
              <div style={styles.card} key={index}>
                <button style={styles.supprimerBtn} onClick={() => supprimerArticle(index)}>×</button>
                <img src={p.image_url} alt={p.nom} style={styles.img} />
                <div style={styles.info}>
                  <h3>{p.nom}</h3>
                  <p>Prix/m² : {p.prix_m2} €</p>

                  <div>
                    <label>
                      Quantité :
                      <input
                        type="number"
                        min="1"
                        value={p.quantiteCommandee}
                        onChange={(e) => handleChange(index, 'quantiteCommandee', e.target.value)}
                        style={styles.input}
                      />
                    </label>
                  </div>

                  <div>
                    <label>
                      Largeur (m):
                      <input type="number" min="1" value={p.largeur} onChange={(e) => handleChange(index, 'largeur', e.target.value)} style={styles.input} />
                    </label>
                  </div>
                  <div>
                    <label>
                      Hauteur (m):
                      <input type="number" min="1" value={p.hauteur} onChange={(e) => handleChange(index, 'hauteur', e.target.value)} style={styles.input} />
                    </label>
                  </div>

                  <p>Dimensions : {p.largeur} m × {p.hauteur} m</p>
                  <p>Prix total : {prixTotal.toFixed(2)} €</p>
                </div>
              </div>
            );
          })}

          <h3 style={styles.total}>Prix total commande : {prixTotalCommande.toFixed(2)} €</h3>
          <div style={{ textAlign: 'center' }}>
            <button style={styles.button} onClick={passerCommande}>Passer la commande</button>
            <button style={styles.button} onClick={() => navigate('/acceuil')}>Continuer mes achats</button>
          </div>
        </div>
      )}
    </div>
  );
}
