import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext'; // ✅ Ajout pour logout

const AdminProduits = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext); // ✅ Ajout
  const [produits, setProduits] = useState([]);
  const [formData, setFormData] = useState({
    nom: '',
    gamme: '',
    marque: '',
    prix_m2: '',
    quantite: '',
    image_url: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProduits();
  }, []);

  const fetchProduits = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/produits');
      setProduits(res.data);
    } catch (err) {
      console.error('Erreur de chargement des produits', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleEdit = (produit) => {
    setFormData({
      nom: produit.nom,
      gamme: produit.gamme,
      marque: produit.marque,
      prix_m2: produit.prix_m2,
      quantite: produit.quantite,
      image_url: produit.image_url
    });
    setEditingId(produit.id);
    setImageFile(null);
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

      if (editingId) {
        await axios.put(`http://localhost:5000/api/produits/${editingId}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("✅ Produit modifié");
      } else {
        const res = await axios.post('http://localhost:5000/api/produits', form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('✅ Produit ajouté');
        setProduits([...produits, res.data]);
      }

      fetchProduits();
      setFormData({ nom: '', gamme: '', marque: '', prix_m2: '', quantite: '', image_url: '' });
      setImageFile(null);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/produits/${id}`);
      setProduits(produits.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de la suppression");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: 'Segoe UI, sans-serif',
    },
    heading: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
    },
    topBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
    },
    button: {
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '0.6rem 1.2rem',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginLeft: '10px'
    },
    logoutButton: {
      backgroundColor: '#ef4444',
      color: 'white',
      padding: '0.6rem 1rem',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    // ... autres styles inchangés
    form: {
      backgroundColor: '#fff',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      display: 'grid',
      gap: '12px',
      marginBottom: '2rem',
    },
    input: {
      padding: '0.6rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
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
    editBtn: {
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      padding: '0.4rem 0.8rem',
      borderRadius: '4px',
      cursor: 'pointer',
      marginRight: '6px'
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.topBar}>
        <button style={styles.button} onClick={() => navigate('/admin/commandes')}>
          📦 Gestion des Commandes
        </button>
        <button style={styles.logoutButton} onClick={handleLogout}>
          🔓 Déconnexion
        </button>
      </div>

      <h2 style={styles.heading}>🛠️ Gestion des Produits</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom du produit" style={styles.input} required />
        <input name="gamme" value={formData.gamme} onChange={handleChange} placeholder="Gamme" style={styles.input} required />
        <input name="marque" value={formData.marque} onChange={handleChange} placeholder="Marque" style={styles.input} required />
        <input name="quantite" type="number" min="0" value={formData.quantite} onChange={handleChange} placeholder="Quantité en stock" style={styles.input} required />
        <input name="prix_m2" value={formData.prix_m2} onChange={handleChange} placeholder="Prix au m²" style={styles.input} required type="number" />
        <input type="file" accept="image/*" onChange={handleFileChange} style={styles.input} />
        <button type="submit" style={styles.button}>
          {editingId ? 'Modifier Produit' : 'Ajouter Produit'}
        </button>
      </form>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Image</th>
            <th style={styles.th}>Nom</th>
            <th style={styles.th}>Gamme</th>
            <th style={styles.th}>Marque</th>
            <th style={styles.th}>Quantité</th>
            <th style={styles.th}>Prix</th>
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
                color: p.quantite == 0 ? '#6b7280' : p.quantite < 5 ? '#dc2626' : '#2563eb',
                fontWeight: p.quantite == 0 ? 'bold' : 'normal'
              }}>
                {p.quantite == 0 ? 'Rupture de stock' : p.quantite}
              </td>
              <td style={styles.td}>{p.prix_m2} DT</td>
              <td style={styles.td}>
                <button style={styles.editBtn} onClick={() => handleEdit(p)}>✏️ Modifier</button>
                <button style={styles.deleteBtn} onClick={() => handleDelete(p.id)}>🗑 Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProduits;
