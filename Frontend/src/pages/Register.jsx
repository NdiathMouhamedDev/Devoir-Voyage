import React, { useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import api from '../api';

export default function Register() {
    const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Effacer l'erreur pour ce champ
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      const response = await api.post('/register', formData);
      
      console.log('Full response:', response);
      
      let data;
      // Si votre api.js retourne directement les données
      if (response.data) {
        data = response.data;
      } 


      // Vérifier le succès de différentes façons
      const isSuccess = response.ok || response.status === 200 || response.status === 201 || data.access_token;

      if (isSuccess && data.access_token) {
        console.log('Registration successful:', data);
        
        // Sauvegarder le token
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setSuccess(true);
        
        // CORRECTION 3: Redirection immédiate avec debug
        console.log('About to navigate to /events');
        
        setTimeout(() => {
          console.log('Executing navigation to /events');
          navigate('/events', { replace: true });
        }, 2000);
        
      } else {
        console.error('Registration failed:', data);
        // Gérer les erreurs de validation
        if ((response.status === 422 || data.errors) && data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: data.message || 'Erreur lors de l\'inscription' });
        }
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Erreur de connexion au serveur' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="hero min-h-screen bg-success/10">
        <div className="hero-content text-center">
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
              <h2 className="card-title text-2xl justify-center">Inscription réussie !</h2>
              <p className="text-base-content/70 mb-4">Bienvenue {formData.name} !</p>
              <div className="flex items-center justify-center gap-2">
                <span className="loading loading-dots loading-sm"></span>
                <span className="text-sm text-base-content/60">Redirection vers /events...</span>
              </div>
              {/* Bouton de debug */}
              <button 
                className="btn btn-primary btn-sm mt-2"
                onClick={() => navigate('/events')}
              >
                Aller maintenant aux événements
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100">
          <div className="card-body">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold">Créer un compte</h2>
              <p className="text-base-content/70">Rejoignez-nous dès aujourd'hui</p>
            </div>

            {errors.general && (
              <div className="alert alert-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errors.general}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Nom */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nom complet</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`input input-bordered w-full pl-10 ${errors.name ? 'input-error' : ''}`}
                    placeholder="Votre nom complet"
                  />
                </div>
                {errors.name && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.name[0]}</span>
                  </label>
                )}
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Adresse email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`input input-bordered w-full pl-10 ${errors.email ? 'input-error' : ''}`}
                    placeholder="votre@email.com"
                  />
                </div>
                {errors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.email[0]}</span>
                  </label>
                )}
              </div>

              {/* Mot de passe */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Mot de passe</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`input input-bordered w-full pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                    placeholder="Mot de passe"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-base-content/40 hover:text-base-content" />
                    ) : (
                      <Eye className="h-5 w-5 text-base-content/40 hover:text-base-content" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.password[0]}</span>
                  </label>
                )}
              </div>

              {/* Confirmation mot de passe */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirmer le mot de passe</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    name="password_confirmation"
                    type="password"
                    required
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className={`input input-bordered w-full pl-10 ${errors.password_confirmation ? 'input-error' : ''}`}
                    placeholder="Confirmer le mot de passe"
                  />
                </div>
                {errors.password_confirmation && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.password_confirmation[0]}</span>
                  </label>
                )}
              </div>
            </div>

            <div className="form-control mt-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Inscription en cours...
                  </>
                ) : (
                  'S\'inscrire'
                )}
              </button>
            </div>

            <div className="divider">OU</div>

            <div className="text-center">
              <p className="text-sm text-base-content/70">
                Déjà un compte ?{' '}
                <button 
                  onClick={() => navigate('/login')}
                  className="link link-primary link-hover"
                >
                  Se connecter
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}