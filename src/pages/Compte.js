import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Compte() {
  const { user, logout, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: user?.nom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
    adresse: user?.adresse || '',
    mot_de_passe: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');

    try {
      // Utiliser toujours la route /api/users/:id
      const endpoint = `http://localhost:5000/api/users/${user.id}`;

      console.log("Token utilisé :", localStorage.getItem('token'));
      console.log("User actuel :", user);

      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        login(localStorage.getItem('token'), data.user);
        setMessage('Informations mises à jour avec succès ! ✅');
        setForm({ ...form, mot_de_passe: '' });
      } else {
        setMessage(data.msg || 'Erreur lors de la mise à jour ❌');
      }
    } catch {
      setMessage('Erreur lors de la mise à jour ❌');
    }
  };

  return (
    <div style={styles.container}>
      {/* Barre de navigation différente selon le rôle */}
      <div style={styles.nav}>
        {user?.role === 'admin' ? (
          <div style={styles.links}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/dashboard')}>Dashboard</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/ajout-admins')}>Admins</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/produits')}>Produits</span>
          </div>
        ) : (
          <div style={styles.links}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>Home</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/acceuil')}>Produits</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/mes-commandes')}>Mes commandes</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/Apropos')}>À propos</span>
          </div>
        )}
        {user?.role !== 'admin' && (
          <div>
            <button style={styles.loginBtn} onClick={() => navigate('/panier')}>Panier</button>
          </div>
        )}
      </div>

      {/* Formulaire modification compte */}
      <div style={styles.formContainer}>
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          {user?.role === 'admin' ? 'Mon Profil Admin' : 'Mon Compte'}
        </h1>
        {message && <div style={styles.message}>{message}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input style={styles.input} type="text" name="nom" value={form.nom} onChange={handleChange} placeholder="Nom & Prénom" required />
          <input style={styles.input} type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
          <input style={styles.input} type="text" name="telephone" value={form.telephone} onChange={handleChange} placeholder="Téléphone" />
          <input style={styles.input} type="text" name="adresse" value={form.adresse} onChange={handleChange} placeholder="Adresse" />
          <input style={styles.input} type="password" name="mot_de_passe" value={form.mot_de_passe} onChange={handleChange} placeholder="Nouveau mot de passe" />
          <button type="submit" style={styles.button}>Enregistrer</button>
        </form>

        <button
          style={styles.logoutButton}
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#f8f8f8',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1200px',
    marginBottom: '3rem',
    padding: '0 2rem',
  },
  links: {
    display: 'flex',
    gap: '2rem',
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  loginBtn: {
    padding: '8px 16px',
    borderRadius: '5px',
    border: '1px solid #111',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: '2.5rem',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border 0.3s',
  },
  button: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#111',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  logoutButton: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#f44336',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'background 0.3s',
  },
  message: {
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '1rem',
  }
};
