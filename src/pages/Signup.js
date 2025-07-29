import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({ nom: '', email: '', mot_de_passe: '' });
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

  return (
    <form onSubmit={handleSubmit}>
      <input name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} required />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input type="password" name="mot_de_passe" placeholder="Mot de passe" value={form.mot_de_passe} onChange={handleChange} required />
      <button type="submit">S'inscrire</button>
    </form>
  );
}
