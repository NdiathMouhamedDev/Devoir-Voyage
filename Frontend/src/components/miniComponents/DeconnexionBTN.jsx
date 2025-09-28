// DeconnexionBTN.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const DeconnexionBTN = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      // Votre logique de déconnexion
      localStorage.removeItem('token');
      // Redirection
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <button onClick={handleLogout} style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer'
            }}>
      Déconnexion
    </button>
  );
};

export default DeconnexionBTN;