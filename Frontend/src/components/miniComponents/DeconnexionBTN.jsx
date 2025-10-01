import { useNavigate } from 'react-router-dom';

export default function DeconnexionBTN() {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      className="btn btn-error"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
        />
      </svg>
      Déconnexion
    </button>
  );
}
