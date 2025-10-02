import { useState, useEffect } from "react";
import api from "../../api";

export default function InterestToggleButton({ 
  eventId, 
  initialInterested = false, 
  initialCount = 0 
}) {
  const [isInterested, setIsInterested] = useState(initialInterested);
  const [interestedCount, setInterestedCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  
  const isAuthenticated = !!localStorage.getItem('token');

  // ✅ Charger le statut depuis l'API au montage ET à chaque changement d'eventId
  useEffect(() => {
    if (!eventId) return;

    // Réinitialiser l'état aux valeurs initiales pendant le chargement
    setIsInterested(initialInterested);
    setInterestedCount(initialCount);
    setLoading(true);

    const fetchInterestStatus = async () => {
      try {
        const response = await api.get(`/events/${eventId}/interest-status`);
        setIsInterested(response.data.is_interested);
        setInterestedCount(response.data.interested_count);
      } catch (error) {
        console.error("Erreur lors du chargement du statut d'intérêt:", error);
        // En cas d'erreur, on garde les valeurs initiales
      } finally {
        setLoading(false);
      }
    };

    fetchInterestStatus();
  }, [eventId, initialInterested, initialCount]);

  // ✅ Écouter les changements depuis d'autres instances (via window.postMessage ou custom event)
  useEffect(() => {
    const handleInterestChange = (event) => {
      // Ne recharger QUE si c'est un événement venant d'une AUTRE instance
      // On utilise un timestamp pour identifier notre propre action
      if (event.detail?.eventId === eventId && event.detail?.timestamp !== window._lastInterestToggle) {
        // Recharger le statut depuis l'API seulement pour les autres instances
        const fetchUpdatedStatus = async () => {
          try {
            const response = await api.get(`/events/${eventId}/interest-status`);
            setIsInterested(response.data.is_interested);
            setInterestedCount(response.data.interested_count);
          } catch (error) {
            console.error("Erreur lors du rechargement du statut:", error);
          }
        };
        fetchUpdatedStatus();
      }
    };

    window.addEventListener('interestChanged', handleInterestChange);
    return () => window.removeEventListener('interestChanged', handleInterestChange);
  }, [eventId]);

  const handleToggleInterest = async () => {
    if (!eventId) {
      console.warn("Aucun eventId fourni au bouton d'intérêt, action ignorée.");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Vous devez être connecté pour marquer votre intérêt");
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      let response;
      if (isInterested) {
        response = await api.delete(`/events/${eventId}/interested`);
      } else {
        response = await api.post(`/events/${eventId}/interested`);
      }
      
      // ✅ Mettre à jour l'état local immédiatement
      setIsInterested(response.data.is_interested);
      setInterestedCount(response.data.interested_count);

      // ✅ Notifier les autres instances avec un timestamp unique
      const timestamp = Date.now();
      window._lastInterestToggle = timestamp; // Stocker pour éviter de se recharger soi-même
      
      window.dispatchEvent(new CustomEvent('interestChanged', { 
        detail: { eventId, timestamp } 
      }));
      
    } catch (error) {
      console.error("Erreur lors du toggle d'intérêt:", error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user');
        alert("Votre session a expiré. Veuillez vous reconnecter.");
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
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
        disabled={!isAuthenticated || loading}
        className={`btn btn-sm gap-2 ${
          isInterested ? 'btn-error btn-outline' : 'btn-success btn-outline'
        }`}
        title={
          !isAuthenticated 
            ? "Connectez-vous pour marquer votre intérêt" 
            : isInterested 
              ? "Retirer mon intérêt" 
              : "Marquer mon intérêt"
        }
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