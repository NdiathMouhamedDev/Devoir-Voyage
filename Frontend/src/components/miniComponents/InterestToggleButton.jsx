import { useState, useEffect } from "react";
import api from "../../api";
import { useEvents } from "../../contexts/EventsContext";

export default function InterestToggleButton({ 
  eventId, 
  initialInterested = false, 
  initialCount = 0 
}) {
  // ✅ Utiliser le contexte global
  const { updateEventInterest, getEventInterest } = useEvents();
  
  // ✅ Vérifier d'abord le state global, sinon utiliser les props
  const globalState = getEventInterest(eventId);
  const [isInterested, setIsInterested] = useState(
    globalState?.is_interested ?? initialInterested
  );
  const [interestedCount, setInterestedCount] = useState(
    globalState?.interested_count ?? initialCount
  );
  const [loading, setLoading] = useState(false);
  
  const isAuthenticated = !!localStorage.getItem('token');

  // ✅ Synchroniser avec le state global
  useEffect(() => {
    const globalState = getEventInterest(eventId);
    if (globalState) {
      setIsInterested(globalState.is_interested);
      setInterestedCount(globalState.interested_count);
    }
  }, [eventId, getEventInterest, globalState]);

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
      
      const newIsInterested = response.data.is_interested;
      const newCount = response.data.interested_count;

      // ✅ Mettre à jour l'état local
      setIsInterested(newIsInterested);
      setInterestedCount(newCount);

      // ✅ Mettre à jour le state global (synchronise tous les composants)
      updateEventInterest(eventId, newIsInterested, newCount);
      
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