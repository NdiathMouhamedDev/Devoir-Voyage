import React, { useState, useEffect } from 'react';
import api from '../api';

const AdminRequest = () => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUserData();
    fetchAdminStatus();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await api.get('/user');
      setUser(res.data.user || res.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchAdminStatus = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin-request-status');
      setStatus(res.data);
    } catch (error) {
      console.error('Error fetching admin status:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestAdminRole = async () => {
    setRequesting(true);
    setMessage('');

    try {
      const res = await api.post('/request-admin');
      setMessage(res.data.message);
      fetchAdminStatus();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erreur lors de la demande');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body items-center">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="text-base-content/70">Chargement des informations...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si déjà admin
  if (status?.current_role === 'admin') {
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="card w-96 bg-base-100 shadow-2xl">
            <div className="card-body items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 text-warning mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <h2 className="card-title text-2xl text-warning">
                Vous êtes Administrateur
              </h2>
              <p className="text-base-content/70 mb-4">
                Vous avez déjà les privilèges administrateur.
              </p>
              <div className="badge badge-warning gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                ADMIN
              </div>
              <div className="card-actions justify-center mt-4">
                <button
                  className="btn btn-primary"
                  onClick={() => window.location.href = '/admin-dashboard'}
                >
                  Panneau Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si demande en cours
  if (status?.admin_request_status === 'pending') {
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="card w-96 bg-base-100 shadow-2xl">
            <div className="card-body items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 text-info mb-4 animate-pulse"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="card-title text-2xl text-info">
                Demande en cours
              </h2>
              <p className="text-base-content/70 mb-4">
                Votre demande de rôle administrateur a été envoyée.
              </p>

              <div className="alert alert-info">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm">
                  Vérifiez votre email et cliquez sur le lien de confirmation.
                </span>
              </div>

              {status?.requested_at && (
                <div className="text-sm text-base-content/50 mt-2">
                  Demandé le : {new Date(status.requested_at).toLocaleString('fr-FR')}
                </div>
              )}

              <div className="card-actions justify-center mt-6 gap-2">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={fetchAdminStatus}
                >
                  Actualiser
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Retour
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Interface de demande
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content">
        <div className="card w-full max-w-md bg-base-100 shadow-2xl">
          <div className="card-body">
            <div className="flex items-center justify-center mb-6">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-16">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <h2 className="card-title text-2xl justify-center mb-2">
              Devenir Administrateur
            </h2>

            <p className="text-base-content/70 text-center mb-6">
              Demandez les privilèges administrateur pour gérer la plateforme.
            </p>

            {message && (
              <div className={`alert mb-4 ${message.includes('Erreur') ? 'alert-error' : 'alert-success'}`}>
                <span className="text-sm">{message}</span>
              </div>
            )}

            <div className="bg-base-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-sm mb-2">Privilèges administrateur :</h3>
              <ul className="text-sm text-base-content/70 space-y-1">
                <li>✓ Gestion complète des événements</li>
                <li>✓ Accès au panneau d'administration</li>
                <li>✓ Statistiques avancées</li>
              </ul>
            </div>

            <div className="bg-warning/10 border border-warning rounded-lg p-3 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-warning"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-medium text-sm">Processus de vérification</span>
              </div>
              <p className="text-xs text-base-content/60">
                Un email de confirmation sera envoyé à <strong>{user?.email}</strong>.
                Vous devrez cliquer sur le lien pour activer vos privilèges.
              </p>
            </div>

            <div className="card-actions justify-center gap-2">
              <button
                onClick={requestAdminRole}
                disabled={requesting}
                className="btn btn-primary"
              >
                {requesting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Envoi en cours...
                  </>
                ) : (
                  'Demander le rôle Admin'
                )}
              </button>

              <button
                className="btn btn-ghost"
                onClick={() => window.location.href = '/dashboard'}
              >
                Annuler
              </button>
            </div>

            <div className="divider text-xs">Informations</div>

            <div className="text-xs text-base-content/50 text-center">
              Rôle actuel : <span className="badge badge-outline badge-sm">{status?.current_role || 'user'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRequest;