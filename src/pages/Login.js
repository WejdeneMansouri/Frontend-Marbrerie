import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', mot_de_passe: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
  e.preventDefault();
  try {
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      login(data.token, data.user);

      // 👇 Redirection selon rôle (ou adapte selon ton champ)
      if (data.user.role === 'admin') {
        navigate('/admin/produits');
      } else {
        navigate('/home');  // client → page d'accueil
      }
    } else {
      alert(data.msg);
    }
  } catch {
    alert('Erreur login');
  }
}


  const styles = {
    page: {
      backgroundColor: '#fdfaf7',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
    },
    title: {
      fontSize: 36,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 32,
    },
    card: {
      backgroundColor: 'white',
      padding: '32px 24px',
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      width: '90%',
      maxWidth: 400,
    },
    input: {
      width: '100%',
      padding: '12px',
      fontSize: 16,
      marginBottom: 16,
      borderRadius: 8,
      border: '1px solid #ccc',
    },
    button: {
      width: '100%',
      padding: '12px',
      fontSize: 16,
      backgroundColor: '#111111',
      color: 'white',
      border: 'none',
      borderRadius: 10,
      fontWeight: 'bold',
      cursor: 'pointer',
      marginBottom: 16,
    },
    footerText: {
      textAlign: 'center',
      fontSize: 14,
    },
    link: {
      fontWeight: 'bold',
      marginLeft: 4,
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Marbre</h1>
      <h2 style={styles.subtitle}>Authentification</h2>
      <form style={styles.card} onSubmit={handleSubmit}>
        <input
          style={styles.input}
          name="email"
          type="email"
          placeholder="Adresse e-mail"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          style={styles.input}
          type="password"
          name="mot_de_passe"
          placeholder="Mot de passe"
          value={form.mot_de_passe}
          onChange={handleChange}
          required
        />
        <button style={styles.button} type="submit">
          Se connecter
        </button>
        <div style={styles.footerText}>
          Première visite?
          <span
            style={styles.link}
            onClick={() => navigate('/register')}
          >
            Créer un compte
          </span>
        </div>
      </form>
    </div>
  );
}
