import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({
    nom: '',
    email: '',
    mot_de_passe: '',
    telephone: '',
    adresse: '',
    code_postal: '',
    pays: ''
  });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      alert(data.msg || "Inscription réussie");
      if (res.ok) navigate('/login');
    } catch {
      alert("Erreur inscription");
    }
  }

  const styles = {
    container: {
      maxWidth: '500px',
      margin: '50px auto',
      padding: '25px',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif',
    },
    h2: {
      textAlign: 'center',
      marginBottom: '20px',
      fontSize: '1.8rem',
      color: '#111',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '12px',
    },
    label: {
      fontWeight: 'bold',
      marginBottom: '5px',
      fontSize: '0.95rem',
    },
    input: {
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      fontSize: '1rem',
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#111',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '1rem',
      transition: 'background 0.2s',
    },
    buttonHover: {
      backgroundColor: '#333',
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.h2}>Créer un compte</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Nom & Prénom</label>
          <input
            name="nom"
            placeholder="Nom & Prénom"
            value={form.nom}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email</label>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Mot de passe</label>
          <input
            type="password"
            name="mot_de_passe"
            placeholder="Mot de passe"
            value={form.mot_de_passe}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Téléphone</label>
          <input
            name="telephone"
            placeholder="Téléphone"
            value={form.telephone}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Adresse</label>
          <input
            name="adresse"
            placeholder="Adresse"
            value={form.adresse}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Code Postal</label>
          <input
            name="code_postal"
            placeholder="Code Postal"
            value={form.code_postal}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Pays</label>
          <input
            name="pays"
            placeholder="Pays"
            value={form.pays}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>S'inscrire</button>
      </form>
    </div>
  );
}
