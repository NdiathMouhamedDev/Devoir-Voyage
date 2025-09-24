import React, { useState, useEffect } from 'react';
import { Shield, Crown, Mail, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

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
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchAdminStatus = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/admin-request-status', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
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
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/request-admin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        fetchAdminStatus(); // Refresh status
      } else {
        setMessage(data.message || 'Erreur lors de la demande');
      }
    } catch (error) {
      setMessage('Erreur de connexion au serveur');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p>Chargement des informations...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si déjà admin
  if (status?.current_role === 'admin') {
    return (
      <div className="hero min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="hero-content text-center">
          <div className="card w-96 bg-base-100 shadow-2xl">
            <div className="card-body">
              <Crown className="w-16 h-16 text-warning mx-auto mb-4" />
              <h2 className="card-title text-2xl justify-center text-warning">
                🎉 Vous êtes Administrateur !
              </h2>
              <p className="text-base-content/70 mb-4">
                Vous avez déjà les privilèges administrateur.
              </p>
              <div className="badge badge-warning gap-2">
                <Shield className="w-4 h-4" />
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
      <div className="hero min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="hero-content text-center">
          <div className="card w-96 bg-base-100 shadow-2xl">
            <div className="card-body">
              <div className="flex items-center justify-center mb-4">
                <Clock className="w-16 h-16 text-info animate-pulse" />
              </div>
              <h2 className="card-title text-2xl justify-center text-info">
                Demande en cours
              </h2>
              <p className="text-base-content/70 mb-4">
                Votre demande de rôle administrateur a été envoyée.
              </p>
              
              <div className="alert alert-info">
                <Mail className="w-4 h-4" />
                <span className="text-sm">
                  Vérifiez votre email et cliquez sur le lien de confirmation.
                </span>
              </div>

              {status?.requested_at && (
                <div className="text-sm text-base-content/50 mt-2">
                  Demandé le : {new Date(status.requested_at).toLocaleString('fr-FR')}
                </div>
              )}

              <div className="card-actions justify-center mt-6 space-x-2">
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={fetchAdminStatus}
                >
                  Actualiser le statut
                </button>
                <button 
                  className="btn btn-ghost btn-sm"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Retour Dashboard
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
    <div className="hero min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="hero-content text-center">
        <div className="card w-full max-w-md bg-base-100 shadow-2xl">
          <div className="card-body">
            <div className="flex items-center justify-center mb-6">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-16">
                  <Shield className="w-8 h-8" />
                </div>
              </div>
            </div>

            <h2 className="card-title text-2xl justify-center mb-2">
              Devenir Administrateur
            </h2>
            
            <p className="text-base-content/70 mb-6">
              Demandez les privilèges administrateur pour gérer la plateforme.
            </p>

            {message && (
              <div className={`alert mb-4 ${message.includes('Erreur') ? 'alert-error' : 'alert-success'}`}>
                {message.includes('Erreur') ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                <span className="text-sm">{message}</span>
              </div>
            )}

            <div className="bg-base-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-sm mb-2">Privilèges administrateur :</h3>
              <ul className="text-sm text-base-content/70 space-y-1">
                <li>✅ Gestion complète des événements</li>
                <li>✅ Accès au panneau d'administration</li>
                {/* <li>✅ Modération des utilisateurs</li> */}
                <li>✅ Statistiques avancées (indisponible)</li>
              </ul>
            </div>

            <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-warning" />
                <span className="font-medium text-sm">Processus de vérification</span>
              </div>
              <p className="text-xs text-base-content/60">
                Un email de confirmation sera envoyé à <strong>{user?.email}</strong>. 
                Vous devrez cliquer sur le lien pour activer vos privilèges.
              </p>
            </div>

            <div className="card-actions justify-center space-x-2">
              <button
                onClick={requestAdminRole}
                disabled={requesting}
                className={`btn btn-primary ${requesting ? 'loading' : ''}`}
              >
                {requesting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4" />
                    Demander le rôle Admin
                  </>
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
            
            <div className="text-xs text-base-content/50">
              Rôle actuel : <span className="badge badge-outline badge-sm">{status?.current_role || 'user'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRequest;