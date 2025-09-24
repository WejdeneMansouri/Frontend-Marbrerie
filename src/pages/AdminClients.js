// src/pages/AdminClients.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Token manquant. Connectez-vous.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setClients(response.data);
        setLoading(false);
      } catch (err) {
        console.error('❌ Erreur récupération clients:', err);
        setError('Impossible de récupérer les clients');
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) return <div className="loading">Chargement des clients...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-clients">
      <style>{`
        .admin-clients {
          min-height: 100vh;
          background-color: #f7f7f7;
          padding: 2rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
        }
        .admin-clients h1 {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          background-color: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        th, td {
          padding: 12px 15px;
          text-align: left;
        }
        th {
          background-color: #e2e8f0;
          font-weight: 600;
          color: #2d3748;
        }
        tr {
          border-bottom: 1px solid #e2e8f0;
          transition: background-color 0.2s ease;
        }
        tr:hover {
          background-color: #f1f5f9;
        }
        .loading, .error {
          padding: 2rem;
          font-size: 1.2rem;
        }
        .error {
          color: #e53e3e;
          font-weight: bold;
        }
        .btn-back {
          display: inline-block;
          margin-bottom: 1rem;
          padding: 10px 20px;
          background-color: #4299e1;
          color: white;
          font-weight: 600;
          border-radius: 6px;
          text-decoration: none;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .btn-back:hover {
          background-color: #3182ce;
        }
        @media (max-width: 768px) {
          table, thead, tbody, th, td, tr {
            display: block;
          }
          thead tr {
            display: none;
          }
          td {
            padding: 10px;
            position: relative;
          }
          td::before {
            content: attr(data-label);
            position: absolute;
            left: 0;
            width: 120px;
            font-weight: 600;
            color: #4a5568;
          }
        }
      `}</style>

      <h1>Liste des clients</h1>
      <button className="btn-back" onClick={() => navigate('/admin/dashboard')}>Retour au Dashboard</button>

      {clients.length === 0 ? (
        <p>Aucun client trouvé.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Adresse</th>
              <th>Date création</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td data-label="ID">{client.id}</td>
                <td data-label="Nom">{client.nom}</td>
                <td data-label="Email">{client.email}</td>
                <td data-label="Téléphone">{client.telephone || '-'}</td>
                <td data-label="Adresse">{client.adresse || '-'}</td>
                <td data-label="Date création">{new Date(client.date_creation).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminClients;
