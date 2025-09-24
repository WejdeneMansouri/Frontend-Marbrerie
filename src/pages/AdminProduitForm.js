// src/pages/AdminProduitForm.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const AdminProduitForm = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { id } = useParams(); // pour la modification, id du produit
  const [formData, setFormData] = useState({
    nom: '',
    gamme: '',
    marque: '',
    prix_m2: '',
    quantite: '',
    image_url: ''
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProduit();
    }
  }, [id]);

  const fetchProduit = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/produits/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData(res.data);
    } catch (err) {
      console.error("Erreur récupération du produit", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append('nom', formData.nom);
      form.append('gamme', formData.gamme);
      form.append('marque', formData.marque);
      form.append('prix_m2', formData.prix_m2);
      form.append('quantite', formData.quantite);
      if (imageFile) {
        form.append('image', imageFile);
      } else {
        form.append('existingImage', formData.image_url);
      }

      if (id) {
        await axios.put(`http://localhost:5000/api/produits/${id}`, form, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        alert("✅ Produit modifié");
      } else {
        await axios.post('http://localhost:5000/api/produits', form, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        alert("✅ Produit ajouté");
      }

      navigate('/admin/produits');
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de l'enregistrement");
    }
  };

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '2rem auto',
      fontFamily: 'Segoe UI, sans-serif',
      background: '#fff',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    },
    heading: { fontSize: '1.8rem', marginBottom: '1rem', fontWeight: 'bold' },
    input: {
      width: '100%',
      padding: '0.6rem',
      marginBottom: '12px',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    button: {
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '0.6rem 1.2rem',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginRight: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>{id ? 'Modifier Produit' : 'Ajouter Produit'}</h2>

      <form onSubmit={handleSubmit}>
        <input name="nom" placeholder="Nom du produit" value={formData.nom} onChange={handleChange} style={styles.input} required />
        <input name="gamme" placeholder="Gamme" value={formData.gamme} onChange={handleChange} style={styles.input} required />
        <input name="marque" placeholder="Marque" value={formData.marque} onChange={handleChange} style={styles.input} required />
        <input name="quantite" type="number" min="0" placeholder="Quantité" value={formData.quantite} onChange={handleChange} style={styles.input} required />
        <input name="prix_m2" type="number" placeholder="Prix au m²" value={formData.prix_m2} onChange={handleChange} style={styles.input} required />
        <input type="file" accept="image/*" onChange={handleFileChange} style={styles.input} />

        <button type="submit" style={styles.button}>{id ? 'Modifier' : 'Ajouter'}</button>
        <button type="button" style={styles.button} onClick={() => navigate('/admin/dashboard')}>🔙 Retour</button>
      </form>
    </div>
  );
};

export default AdminProduitForm;
