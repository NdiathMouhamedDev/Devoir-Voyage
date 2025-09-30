import React, { useState } from 'react';
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      if (response.data) {
        data = response.data;
      }

      const isSuccess = response.ok || response.status === 200 || response.status === 201 || data.access_token;

      if (isSuccess && data.access_token) {
        console.log('Registration successful:', data);
        
        // Sauvegarder le token
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setSuccess(true);
        
        console.log('About to navigate to /events');
        
        setTimeout(() => {
          console.log('Executing navigation to /events');
          navigate('/events', { replace: true });
        }, 2000);
        
      } else {
        console.error('Registration failed:', data);
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
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card w-full max-w-md bg-base-100 shadow-2xl">
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-success" />
              </div>
            </div>
            <h2 className="card-title text-2xl justify-center text-base-content">
              Inscription réussie !
            </h2>
            <p className="text-base-content/70 text-lg mb-4">
              Bienvenue <span className="font-semibold text-primary">{formData.name}</span> !
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="loading loading-dots loading-md text-primary"></span>
              <span className="text-sm text-base-content/60">Redirection en cours...</span>
            </div>
            <button 
              className="btn btn-primary btn-sm mt-4"
              onClick={() => navigate('/events')}
            >
              Accéder maintenant
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Card principale */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body">
            
            {/* En-tête */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-base-content">Créer un compte</h1>
              <p className="text-base-content/60 mt-2">
                Rejoignez-nous dès aujourd'hui
              </p>
            </div>

            {/* Message d'erreur général */}
            {errors.general && (
              <div className="alert alert-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errors.general}</span>
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Nom */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Nom complet</span>
                </label>
                <label className={`input input-bordered flex items-center gap-2 ${errors.name ? 'input-error' : ''}`}>
                  <User className="w-4 h-4 opacity-70" />
                  <input
                    name="name"
                    type="text"
                    className="grow"
                    placeholder="Votre nom complet"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </label>
                {errors.name && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.name[0]}</span>
                  </label>
                )}
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Adresse email</span>
                </label>
                <label className={`input input-bordered flex items-center gap-2 ${errors.email ? 'input-error' : ''}`}>
                  <Mail className="w-4 h-4 opacity-70" />
                  <input
                    name="email"
                    type="email"
                    className="grow"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </label>
                {errors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.email[0]}</span>
                  </label>
                )}
              </div>

              {/* Mot de passe */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Mot de passe</span>
                </label>
                <label className={`input input-bordered flex items-center gap-2 ${errors.password ? 'input-error' : ''}`}>
                  <Lock className="w-4 h-4 opacity-70" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="grow"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn btn-ghost btn-xs btn-circle"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </label>
                {errors.password && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.password[0]}</span>
                  </label>
                )}
                <label className="label">
                  <span className="label-text-alt">Minimum 8 caractères</span>
                </label>
              </div>

              {/* Confirmation mot de passe */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Confirmer le mot de passe</span>
                </label>
                <label className={`input input-bordered flex items-center gap-2 ${errors.password_confirmation ? 'input-error' : ''}`}>
                  <Lock className="w-4 h-4 opacity-70" />
                  <input
                    name="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    className="grow"
                    placeholder="••••••••"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="btn btn-ghost btn-xs btn-circle"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </label>
                {errors.password_confirmation && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.password_confirmation[0]}</span>
                  </label>
                )}
              </div>

              {/* Force du mot de passe */}
              {formData.password && (
                <div className="form-control">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-base-content/60">Force:</span>
                    <progress 
                      className={`progress w-32 ${
                        formData.password.length < 8 ? 'progress-error' :
                        formData.password.length < 12 ? 'progress-warning' :
                        'progress-success'
                      }`}
                      value={Math.min(formData.password.length * 8, 100)} 
                      max="100"
                    ></progress>
                    <span className={`badge badge-sm ${
                      formData.password.length < 8 ? 'badge-error' :
                      formData.password.length < 12 ? 'badge-warning' :
                      'badge-success'
                    }`}>
                      {formData.password.length < 8 ? 'Faible' :
                       formData.password.length < 12 ? 'Moyen' :
                       'Fort'}
                    </span>
                  </div>
                </div>
              )}

              {/* Bouton d'inscription */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Inscription en cours...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    S'inscrire
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="divider">ou</div>

            {/* Lien vers connexion */}
            <div className="text-center">
              <p className="text-sm text-base-content/60">
                Déjà un compte ?{' '}
                <button 
                  onClick={() => navigate('/login')}
                  className="link link-primary font-semibold"
                >
                  Se connecter
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Info supplémentaire */}
        <div className="card bg-base-100 shadow-lg mt-4">
          <div className="card-body py-3">
            <div className="flex items-start gap-3">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-info shrink-0 mt-0.5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <p className="text-sm text-base-content/70">
                En créant un compte, vous acceptez nos{' '}
                <a href="#" className="link link-primary">conditions d'utilisation</a> et notre{' '}
                <a href="#" className="link link-primary">politique de confidentialité</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}