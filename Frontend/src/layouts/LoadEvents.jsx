import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { recupEvents } from "../services/functions";
import InterestToggleButton from "../components/miniComponents/InterestToggleButton";

export default function LoadEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const allEvents = await recupEvents();
      setEvents(Array.isArray(allEvents) ? allEvents : []);
    } catch (err) {
      console.error("Erreur lors du chargement des événements:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    const now = new Date();
    const startDate = new Date(events.map((event)=>(event.start_at)));
    console.log(startDate);
    console.log(now)

    // ⛔ si l'événement a déjà commencé, on bloque
    if (startDate <= now) {
      alert("Impossible de s'abonner : le planning a déjà commencé ou est passé.");
      return;
    }else{
      navigate(`/hourly/${events.map((event)=>(event.id))}/inscrire`)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="card bg-base-100 shadow-xl max-w-md">
          <div className="card-body items-center text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-base-content/20 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h2 className="card-title">Aucun événement disponible</h2>
            <p className="text-base-content/70">
              Les événements apparaîtront ici une fois créés.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content mb-2">Tous les événements</h1>
          <p className="text-base-content/70">
            Découvrez et inscrivez-vous aux événements à venir
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <figure className="h-48 overflow-hidden bg-base-300">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-base-content/20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </figure>

              <div className="card-body">
                <h2 className="card-title line-clamp-2">{event.title}</h2>

                <p className="text-base-content/70 text-sm line-clamp-3 mb-4">
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  {event.start_at && (
                    <div className="flex items-center gap-2 text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-base-content/70">
                        {new Date(event.start_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}

                  {event.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-secondary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-base-content/70 line-clamp-1">{event.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <InterestToggleButton
                    eventId={event.id}
                    initialInterested={event.is_interested}
                    initialCount={event.interested_count}
                  />
                </div>

                <div className="card-actions flex-col gap-2">
                  <button
                    onClick={() => navigate(`/event/${event.id}/`)}
                    className="btn btn-primary btn-sm w-full gap-2"
                  >
                    Voir les détails
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={handleSubscribe}
                    className="btn btn-secondary btn-sm w-full gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    S'inscrire
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}