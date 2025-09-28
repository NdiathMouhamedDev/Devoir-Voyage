import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { storageUrl } from '../utils/url';
import DeconnexionBTN from '../components/miniComponents/DeconnexionBTN';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [interestedEvents, setInterestedEvents] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // État séparé pour le fichier
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

  useEffect(() => {
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
      
      // Reset preview when loading profile
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
      // Vérification du type de fichier
      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner un fichier image valide');
        return;
      }
      
      // Vérification de la taille (par exemple, max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La taille du fichier ne doit pas dépasser 5MB');
        return;
      }
      
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setError(''); // Clear any previous errors
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const formDataToSend = new FormData();
      
      // Ajouter tous les champs de texte
      Object.keys(formData).forEach(key => {
        // Exclure les champs de mot de passe du formulaire principal
        if (!['current_password', 'password', 'password_confirmation'].includes(key)) {
          if (formData[key] !== null && formData[key] !== '') {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      // Ajouter le fichier image seulement s'il y en a un nouveau
      if (selectedFile) {
        formDataToSend.append('profile_photo', selectedFile);
      }

      // Pour débugger - voir ce qui est envoyé
      console.log('FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      const response = await api.post('/profile', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUser(response.data.user);
      setMessage('Profil mis à jour avec succès !');
      
      // Reset file selection after successful update
      setSelectedFile(null);
      setPreviewImage(null);
      
      // Reset file input
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

    // Validation côté client
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

  // Fonction pour gérer la suppression de l'image preview
  const removePreviewImage = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    const fileInput = document.getElementById('profile_photo');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  if (loading) return <div className="text-center p-8">Chargement...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>
        <DeconnexionBTN/>
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Informations du profil */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img
                  src={
                    previewImage || 
                    (user?.profile_photo ? storageUrl(user.profile_photo) : 
                    'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y')
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <label htmlFor="profile_photo" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </label>
                {previewImage && (
                  <button
                    type="button"
                    onClick={removePreviewImage}
                    className="absolute top-0 left-0 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="file"
                id="profile_photo"
                name="profile_photo"
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/jpg,image/gif"
                className="hidden"
              />

              <div>
                <label className="block text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Adresse</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                  rows="3"
                  placeholder="Parlez-nous de vous..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
              >
                Mettre à jour le profil
              </button>
            </form>
          </div>

          {/* Changement de mot de passe et QR Code */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Changer le mot de passe</h2>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Mot de passe actuel</label>
                  <input
                    type="password"
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Nouveau mot de passe</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                    minLength="8"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">Au moins 8 caractères</p>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
                >
                  Changer le mot de passe
                </button>
              </form>
            </div>

            {user?.qr_code && (
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Mon QR Code</h2>
                <div className="flex justify-center">
                  <img
                    src={storageUrl(user.qr_code)}
                    alt="QR Code"
                    className="w-48 h-48"
                  />
                </div>
                <p className="text-center mt-4 text-sm text-gray-600">
                  Scannez ce QR code pour obtenir vos informations (nom, email, téléphone, adresse, bio)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Événements intéressés */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Mes événements intéressés</h2>
          {interestedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {interestedEvents.map(event => (
                <div key={event.id} className="border rounded p-4 hover:shadow-md transition duration-200">
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-gray-600">{event.date}</p>
                  <button
                    onClick={() => navigate(`/event/${event.id}`)}
                    className="mt-2 text-blue-600 hover:text-blue-800 transition duration-200"
                  >
                    Voir les détails
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucun événement intéressé pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}