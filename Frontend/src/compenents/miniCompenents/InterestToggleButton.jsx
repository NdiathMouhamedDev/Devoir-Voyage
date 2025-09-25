import { useState, useEffect } from "react";
import api from "../../api";

export default function InterestToggleButton({ eventId, initialInterested = false, initialCount = 0 }) {
  const [isInterested, setIsInterested] = useState(initialInterested);
  const [interestedCount, setInterestedCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  // Vérifier l'état initial d'intérêt au chargement
  useEffect(() => {
    // Ne rien faire tant que l'ID de l'événement n'est pas disponible
    if (!eventId) return;
    const checkInterestStatus = async () => {
      try {
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
    if (!localStorage.getItem('token')) {
      alert("Vous devez être connecté pour marquer votre intérêt");
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      let response;
      if (isInterested) {
        // Si déjà intéressé, on retire l'intérêt
        response = await api.delete(`/events/${eventId}/interested`);
      } else {
        // Sinon on ajoute l'intérêt
        response = await api.post(`/events/${eventId}/interested`);
      }
      
      // Mettre à jour l'état avec les nouvelles données
      setIsInterested(response.data.is_interested);
      setInterestedCount(response.data.interested_count);
      
    } catch (error) {
      console.error("Erreur lors du toggle d'intérêt:", error);
      if (error.response?.status === 401) {
        alert("Vous devez être connecté pour marquer votre intérêt");
        window.location.href = '/login';
      } else {
        alert(error.response?.data?.message || "Une erreur s'est produite");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleToggleInterest}
        disabled={loading}
        className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium
          ${isInterested
            ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'
            : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {loading ? 'Chargement...' : (isInterested ? 'Je ne suis plus intéressé' : 'Je suis intéressé')}
      </button>
      <div className="text-sm text-gray-600">
        {interestedCount} {interestedCount <= 1 ? 'personne intéressée' : 'personnes intéressées'}
      </div>
    </div>
  );
}