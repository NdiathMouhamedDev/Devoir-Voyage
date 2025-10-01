import { useState, useEffect } from "react";
import api from "../../api";

export default function InterestToggleButton({ eventId, initialInterested = false, initialCount = 0 }) {
  const [isInterested, setIsInterested] = useState(initialInterested);
  const [interestedCount, setInterestedCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    const checkInterestStatus = async () => {
      try {
        // ✅ Appel PUBLIC - pas besoin d'auth
        const response = await api.get(`/events/${eventId}/interest-status`);
        setIsInterested(response.data.is_interested);
        setInterestedCount(response.data.interested_count);
      } catch (error) {
        console.error("Erreur lors de la vérification du statut:", error);
      }
    };

    checkInterestStatus();
  }, [eventId]);

  const handleToggleInterest = async () => {
    if (!eventId) {
      console.warn("Aucun eventId fourni au bouton d'intérêt, action ignorée.");
      return;
    }

    // ✅ Vérifier si l'utilisateur est connecté
    if (!localStorage.getItem('token')) {
      alert("Vous devez être connecté pour marquer votre intérêt");
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    setIsAuthenticated(true);

    try {
      let response;
      
      if (isInterested) {
        response = await api.delete(`/events/${eventId}/interested`);
      } else {
        response = await api.post(`/events/${eventId}/interested`);
      }

      setIsInterested(response.data.is_interested);
      setInterestedCount(response.data.interested_count);
      
    } catch (error) {
      console.error("Erreur lors du toggle d'intérêt:", error);
      
      if (error.response?.status === 401) {
        alert("Vous devez être connecté pour marquer votre intérêt");
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
        // ✅ L'utilisateur n'est pas inscrit
        alert("Vous devez vous inscrire à cet événement avant de marquer votre intérêt");
      } else {
        alert(error.response?.data?.message || "Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggleInterest}
        disabled={loading}
        className={`btn btn-sm gap-2 ${
          isInterested ? 'btn-error btn-outline' : 'btn-success btn-outline'
        }`}
        title={!isAuthenticated ? "Connectez-vous pour marquer votre intérêt" : ""}
      >
        {loading ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill={isInterested ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        )}
        {interestedCount}
      </button>
    </div>
  );
}