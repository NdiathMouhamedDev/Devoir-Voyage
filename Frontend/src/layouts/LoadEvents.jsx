import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { recupEvents } from "../services/functions";
import EventCard from "../components/miniComponents/EventCard";
import api from "../api";
import InterestToggleButton from "../components/miniComponents/InterestToggleButton";


export default function LoadEvents() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);


  useEffect(() => {
    api.get("/events")
      .then((res) => {
        console.log("Réponse API /events:", res.data);

        // Adapter selon la structure
        if (Array.isArray(res.data)) {
          setEvents(res.data);
        } else if (Array.isArray(res.data.data)) {
          setEvents(res.data.data);
        } else if (Array.isArray(res.data.events)) {
          setEvents(res.data.events);
        } else {
          setEvents([]);
        }
      })
      .catch((err) => console.error("Erreur events:", err));
  }, [navigate]);


  const loadEvents = async () => {
    try {
      const allEvents = await recupEvents();
      setEvents(allEvents);
    } catch (err) {
      console.error("Erreur lors du chargement des événements:", err);
    }
  };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id}>
            <h2 className="bg-primary">{event.title}</h2>
            <p>{event.description}</p>
            <p>{event.start_at}------{event.end_at}</p>
            <p>{event.location}</p>
            <InterestToggleButton eventId={event.id} />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => navigate(`/event/${event.id}/`)}
            >Details</button>
            <Link className="btn btn-primary" to={`/hourly/${event.id}/inscrire`}>S'inscrire</Link>
          </div>)
        )}
      </div>
    </div>
  );
}
