import { createContext, useContext, useState } from 'react';

// ✅ Créer le contexte
const EventsContext = createContext();

// ✅ Hook personnalisé pour utiliser le contexte facilement
export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents doit être utilisé dans un EventsProvider');
  }
  return context;
};

// ✅ Provider pour envelopper votre app
export function EventsProvider({ children }) {
  const [eventsInterests, setEventsInterests] = useState({});
  // Structure: { eventId: { is_interested: bool, interested_count: number } }

  // Mettre à jour l'intérêt d'un événement
  const updateEventInterest = (eventId, isInterested, interestedCount) => {
    setEventsInterests(prev => ({
      ...prev,
      [eventId]: { is_interested: isInterested, interested_count: interestedCount }
    }));
  };

  // Récupérer l'état d'intérêt d'un événement
  const getEventInterest = (eventId) => {
    return eventsInterests[eventId] || null;
  };

  return (
    <EventsContext.Provider value={{ 
      updateEventInterest, 
      getEventInterest,
      eventsInterests 
    }}>
      {children}
    </EventsContext.Provider>
  );
}