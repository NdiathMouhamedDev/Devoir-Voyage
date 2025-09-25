import { useState, useEffect } from "react";
import { recupEvents } from "../services/functions";
import EventCard from "../compenents/miniCompenents/EventCard";

export default function LoadEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const allEvents = await recupEvents();
      setEvents(allEvents);
    } catch (err) {
      console.error("Erreur lors du chargement des événements:", err);
    }
  };

  return (
    <div>
      <h2>📅 Tous les événements</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {events.length > 0 ? (
          events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <p>Aucun événement trouvé.</p>
        )}
      </div>
    </div>
  );
}
