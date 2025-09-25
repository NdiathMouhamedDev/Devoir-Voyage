import React, { useState } from 'react';
import axios from 'axios';


const InterestToggleButton = ({ event, onToggle, className = '', size = 'medium' }) => {
  const [isInterested, setIsInterested] = useState(event.is_user_interested || false);
  const [interestedCount, setInterestedCount] = useState(event.interested_count || 0);
  const [loading, setLoading] = useState(false);

  const handleToggleInterest = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      let response;

      if (isInterested) {
        // Se désintéresser
        response = await axios.delete(`/api/events/${event.id}/interested`, { headers });
        setIsInterested(false);
        setInterestedCount(prev => prev - 1);
      } else {
        // S'intéresser
        response = await axios.post(`/api/events/${event.id}/interested`, {}, { headers });
        setIsInterested(true);
        setInterestedCount(prev => prev + 1);
      }

      // Appeler le callback parent si fourni
      if (onToggle) {
        onToggle(event.id, !isInterested, interestedCount);
      }

      // Optionnel : afficher un message de succès
      console.log(response.data.message);

    } catch (error) {
      console.error('Erreur lors du toggle d\'intérêt:', error);

      // Afficher l'erreur à l'utilisateur
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Une erreur s\'est produite. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Vérifier si l'événement est complet
  const isEventFull = event.max_participants && interestedCount >= event.max_participants;
  const canRegister = event.can_register !== false && (!isEventFull || isInterested);

  // Classes CSS dynamiques
  const buttonClasses = [
    'interest-toggle-button',
    `interest-toggle-button--${size}`,
    isInterested ? 'interest-toggle-button--interested' : 'interest-toggle-button--not-interested',
    loading ? 'interest-toggle-button--loading' : '',
    !canRegister && !isInterested ? 'interest-toggle-button--disabled' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="interest-toggle-container">
      <button
        className={buttonClasses}
        onClick={handleToggleInterest}
        disabled={loading || (!canRegister && !isInterested)}
        title={
          !canRegister && !isInterested
            ? 'Événement complet'
            : isInterested
              ? 'Se désintéresser de cet événement'
              : 'S\'intéresser à cet événement'
        }
      >
        <span className="interest-toggle-button__icon">
          {loading ? (
            '⏳'
          ) : isInterested ? (
            '❤️'
          ) : (
            '🤍'
          )}
        </span>

        <span className="interest-toggle-button__text">
          {loading ? (
            'Chargement...'
          ) : isInterested ? (
            'Intéressé(e)'
          ) : (
            isEventFull ? 'Complet' : 'M\'intéresser'
          )}
        </span>

        <span className="interest-toggle-button__count">
          ({interestedCount})
        </span>
      </button>

      {/* Indicateur visuel pour événement complet */}
      {isEventFull && !isInterested && (
        <div className="interest-toggle-warning">
          ⚠️ Nombre maximum de participants atteint
        </div>
      )}
    </div>
  );
};

export default InterestToggleButton;