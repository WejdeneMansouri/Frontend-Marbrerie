// src/pages/AjoutAdmins.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const AjoutAdmins = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    mot_de_passe: '',
    adresse: '',
    telephone: ''
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAdmins();
  }, [token]);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admins', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins(res.data);
      setLoading(false);
    } catch (err) {
      console.error('❌ Erreur récupération admins:', err);
      setError('Impossible de récupérer les admins');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/admins',
        { ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Admin ajouté');
      setFormData({ nom: '', email: '', mot_de_passe: '', adresse: '', telephone: '' });
      fetchAdmins();
    } catch (err) {
      console.error(err);
      alert('❌ Erreur lors de l’ajout de l’admin');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet admin ?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins(admins.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert('❌ Erreur lors de la suppression');
    }
  };

  const styles = {
    container: { maxWidth: '900px', margin: '0 auto', padding: '2rem', fontFamily: 'Segoe UI, sans-serif' },
    heading: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' },
    button: { backgroundColor: '#2563eb', color: 'white', padding: '0.6rem 1.2rem', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '1rem' },
    form: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', display: 'grid', gap: '12px', marginBottom: '2rem' },
    input: { padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' },
    table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    th: { padding: '10px', border: '1px solid #eee', backgroundColor: '#f3f4f6' },
    td: { padding: '10px', border: '1px solid #eee', textAlign: 'center' },
    deleteBtn: { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' },
  };

  return (
    <div style={styles.container}>
      <button style={styles.button} onClick={() => navigate('/admin/dashboard')}>⬅️ Retour au Dashboard</button>

      <h1 style={styles.heading}>Admins existants</h1>

      {loading ? <p>Chargement...</p> : error ? <p style={{color:'red'}}>{error}</p> :
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Nom</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Adresse</th>
              <th style={styles.th}>Téléphone</th>
              <th style={styles.th}>Date création</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id}>
                <td style={styles.td}>{admin.id}</td>
                <td style={styles.td}>{admin.nom}</td>
                <td style={styles.td}>{admin.email}</td>
                <td style={styles.td}>{admin.adresse || '-'}</td>
                <td style={styles.td}>{admin.telephone || '-'}</td>
                <td style={styles.td}>{new Date(admin.date_creation).toLocaleDateString()}</td>
                <td style={styles.td}>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(admin.id)}>🗑 Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }

      <h2 style={{...styles.heading, marginTop: '2rem'}}>Ajouter un nouvel admin</h2>
      <form style={styles.form} onSubmit={handleAddAdmin}>
        <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} style={styles.input} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} style={styles.input} required />
        <input type="password" name="mot_de_passe" placeholder="Mot de passe" value={formData.mot_de_passe} onChange={handleChange} style={styles.input} required />
        <input type="text" name="adresse" placeholder="Adresse" value={formData.adresse} onChange={handleChange} style={styles.input} />
        <input type="text" name="telephone" placeholder="Téléphone" value={formData.telephone} onChange={handleChange} style={styles.input} />
        <button type="submit" style={styles.button}>➕ Ajouter Admin</button>
      </form>
    </div>
  );
};

export default AjoutAdmins;
