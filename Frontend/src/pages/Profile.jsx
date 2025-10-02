import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { storageUrl } from '../utils/url';
import DeconnexionBTN from '../components/miniComponents/DeconnexionBTN';
import MinNav from '../components/miniComponents/MinNav';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [interestedEvents, setInterestedEvents] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    bio: '',
    address: '',
    current_password: '',
    password: '',
    password_confirmation: ''
  });
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    document.title = "Debug | Touba Events";
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const [profileRes, eventsRes] = await Promise.all([
        api.get('/profile'),
        api.get('/profile/interested-events')
      ]);
      
      setUser(profileRes.data.user);
      setInterestedEvents(eventsRes.data);
      setFormData(prev => ({
        ...prev,
        name: profileRes.data.user.name,
        email: profileRes.data.user.email,
        phone_number: profileRes.data.user.phone_number || '',
        bio: profileRes.data.user.bio || '',
        address: profileRes.data.user.address || ''
      }));
      
      setPreviewImage(null);
      setSelectedFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner un fichier image valide');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('La taille du fichier ne doit pas dépasser 5MB');
        return;
      }
      
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (!['current_password', 'password', 'password_confirmation'].includes(key)) {
          if (formData[key] !== null && formData[key] !== '') {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      if (selectedFile) {
        formDataToSend.append('profile_photo', selectedFile);
      }

      const response = await api.post('/profile', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUser(response.data.user);
      setMessage('Profil mis à jour avec succès !');
      
      setSelectedFile(null);
      setPreviewImage(null);
      
      const fileInput = document.getElementById('profile_photo');
      if (fileInput) {
        fileInput.value = '';
      }
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la mise à jour');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (formData.password !== formData.password_confirmation) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    try {
      await api.post('/profile/password', {
        current_password: formData.current_password,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      });

      setMessage('Mot de passe mis à jour avec succès !');
      setFormData(prev => ({
        ...prev,
        current_password: '',
        password: '',
        password_confirmation: ''
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const removePreviewImage = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    const fileInput = document.getElementById('profile_photo');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center space-y-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <div className="text-base-content text-lg">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        
        {/* Header */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
                  <span className="text-primary">👤</span>
                  Mon Profil
                </h1>
                <p className="text-base-content/60 mt-2">
                  Gérez vos informations personnelles
                </p>
              </div>
              <DeconnexionBTN />
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="alert alert-success shadow-lg mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{message}</span>
          </div>
        )}
        
        {error && (
          <div className="alert alert-error shadow-lg mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="tabs tabs-boxed bg-base-100 shadow-lg mb-6 p-2">
          <a 
            className={`tab tab-lg ${activeTab === 'info' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Informations
          </a>
          <a 
            className={`tab tab-lg ${activeTab === 'security' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Sécurité
          </a>
          <a 
            className={`tab tab-lg ${activeTab === 'events' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Mes événements
          </a>
        </div>

        {/* Tab Content */}
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Photo de profil */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <h2 className="card-title mb-4">Photo de profil</h2>
                <div className="avatar">
                  <div className="w-40 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 relative">
                    <img
                      src={
                        previewImage || 
                        (user?.profile_photo ? storageUrl(user.profile_photo) : 
                        'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y')
                      }
                      alt="Profile"
                    />
                    {previewImage && (
                      <button
                        type="button"
                        onClick={removePreviewImage}
                        className="btn btn-circle btn-xs btn-error absolute top-0 right-0"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                <input
                  type="file"
                  id="profile_photo"
                  name="profile_photo"
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/jpg,image/gif"
                  className="file-input file-input-bordered file-input-primary w-full max-w-xs mt-4"
                />
                <div className="text-sm text-base-content/60 mt-2">
                  JPG, PNG ou GIF (Max. 5MB)
                </div>

                {/* QR Code */}
                {user?.qr_code && (
                  <div className="divider">QR Code</div>
                )}
                {user?.qr_code && (
                  <div className="mt-4">
                    <img
                      src={storageUrl(user.qr_code)}
                      alt="QR Code"
                      className="w-48 h-48 mx-auto"
                    />
                    <p className="text-sm text-base-content/60 mt-2">
                      Scannez pour partager vos infos
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Formulaire */}
            <div className="card bg-base-100 shadow-xl lg:col-span-2">
              <div className="card-body">
                <h2 className="card-title mb-4">Informations personnelles</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control  mx-5">
                      <label className="label">
                        <span className="label-text font-semibold">Nom complet</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        required
                      />
                    </div>

                    <div className="form-control  mx-5">
                      <label className="label">
                        <span className="label-text font-semibold">Email</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control  mx-5">
                      <label className="label">
                        <span className="label-text font-semibold">Téléphone</span>
                      </label>
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        placeholder="+221 XX XXX XX XX"
                      />
                    </div>

                    <div className="form-control  mx-5">
                      <label className="label">
                        <span className="label-text font-semibold">Adresse</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        placeholder="Votre adresse"
                      />
                    </div>
                  </div>

                  <div className="form-control  mx-5">
                    <label className="label">
                      <span className="label-text font-semibold">Biographie</span>
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="textarea textarea-bordered h-24"
                      placeholder="Parlez-nous de vous..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mettre à jour le profil
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto">
            <div className="card-body">
              <h2 className="card-title mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Changer le mot de passe
              </h2>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="form-control  mx-2">
                  <label className="label">
                    <span className="label-text font-semibold">Mot de passe actuel</span>
                  </label>
                  <input
                    type="password"
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control  mx-2">
                  <label className="label">
                    <span className="label-text font-semibold">Nouveau mot de passe</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    minLength="8"
                    required
                  />
                  <label className="label">
                    <span className="label-text-alt">Au moins 8 caractères</span>
                  </label>
                </div>

                <div className="form-control  mx-2  mx-5">
                  <label className="label">
                    <span className="label-text font-semibold">Confirmer le mot de passe</span>
                  </label>
                  <input
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="alert alert-info">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Votre mot de passe doit contenir au moins 8 caractères pour plus de sécurité.</span>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Changer le mot de passe
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Mes événements intéressés
              </h2>
              {interestedEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {interestedEvents.map(event => (
                    <div key={event.id} className="card bg-base-200 shadow-md hover:shadow-xl transition-shadow">
                      <div className="card-body">
                        <h3 className="card-title text-lg">{event.title}</h3>
                        <div className="flex items-center gap-2 text-base-content/70">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm">{event.date}</span>
                        </div>
                        <div className="card-actions justify-end mt-4">
                          <button
                            onClick={() => navigate(`/event/${event.id}`)}
                            className="btn btn-primary btn-sm"
                          >
                            Voir les détails
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <p className="text-base-content/60 text-lg">Aucun événement intéressé pour le moment.</p>
                  <button 
                    onClick={() => navigate('/events')}
                    className="btn btn-primary mt-4"
                  >
                    Découvrir des événements
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <MinNav/>
    </div>
  );
}