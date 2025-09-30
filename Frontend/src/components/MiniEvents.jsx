import { useState, useEffect } from "react";
import api from "../api";

function InterestToggleButton({ eventId, initialInterested = false, initialCount = 0 }) {
  const [isInterested, setIsInterested] = useState(initialInterested);
  const [interestedCount, setInterestedCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleToggleInterest = async () => {
    if (!token) {
      alert("Vous devez être connecté pour marquer votre intérêt");
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      const response = isInterested
        ? await api.delete(`/events/${eventId}/interested`)
        : await api.post(`/events/${eventId}/interested`);
      setIsInterested(response.data.is_interested);
      setInterestedCount(response.data.interested_count);
    } catch (error) {
      console.error("Erreur lors du toggle d'intérêt:", error);
      alert(error.response?.data?.message || "Une erreur s'est produite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {token ? (
        <button
          onClick={handleToggleInterest}
          disabled={loading}
          className={`btn btn-sm gap-2 ${
            isInterested ? 'btn-error btn-outline' : 'btn-success btn-outline'
          }`}
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
          <span className="badge badge-sm">{interestedCount}</span>
        </button>
      ) : (
        <button
          onClick={() => window.location.href = '/login'}
          className="btn btn-sm btn-outline gap-2"
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
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span className="badge badge-sm">{interestedCount}</span>
        </button>
      )}
    </div>
  );
}

export default function MiniEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    try {
      const res = await api.get('/events/public');
      const allEvents = Array.isArray(res.data) ? res.data : res.data.data || [];
      setEvents(allEvents.slice(0, 5));
    } catch (err) {
      console.error("Erreur lors du chargement des événements:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-base-content/70">Aucun événement disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div id="events" className="space-y-4 w-full max-w-2xl mx-auto">
      {events.map(event => (
        <div key={event.id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow border border-base-300">
          <div className="card-body">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex-1">
                <h3 className="card-title text-base-content mb-2">{event.title}</h3>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <div className="badge badge-primary badge-outline gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
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
                    {formatDate(event.date)}
                  </div>
                  
                  {event.location && (
                    <div className="badge badge-secondary badge-outline gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
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
                      {event.location}
                    </div>
                  )}
                </div>
                
                {event.description && (
                  <p className="text-sm text-base-content/70 line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>
              
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                <InterestToggleButton
                  eventId={event.id}
                  initialInterested={event.is_interested}
                  initialCount={event.interested_count}
                />
                <a href={`/event/${event.id}`} className="btn btn-sm btn-ghost">
                  Voir plus
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
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}