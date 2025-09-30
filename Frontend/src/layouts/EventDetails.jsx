import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import InterestToggleButton from '../components/miniComponents/InterestToggleButton';
import { recupEventById } from '../services/functions';
import AvatarMenu from '../components/miniComponents/AvatarMenu';
import HourlyDetail from './HourlyDetail';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await recupEventById(id);
        setEvent(res);
        console.log("Event récupéré:", res);
      } catch (err) {
        setError("Impossible de charger les détails de l'événement");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-error mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-error">{error}</p>
              <Link to="/events" className="btn btn-primary mt-4">
                Retour aux événements
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <p className="text-base-content/70">Événement non trouvé</p>
              <Link to="/events" className="btn btn-primary mt-4">
                Retour aux événements
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header avec navigation */}
        <div className="flex justify-between items-center mb-6">
          <Link to="/events" className="btn btn-ghost gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Retour
          </Link>
          <AvatarMenu />
        </div>

        {/* Card principale de l'événement */}
        <div className="card bg-base-100 shadow-xl overflow-hidden mb-8">
          {/* Image de l'événement */}
          <figure className="relative h-64 md:h-96">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </figure>

          {/* Contenu */}
          <div className="card-body">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <h1 className="card-title text-3xl">{event.title}</h1>
              <InterestToggleButton
                eventId={id}
                initialInterested={event.is_interested}
                initialCount={event.interested_count}
              />
            </div>

            {/* Badge de date */}
            <div className="badge badge-primary badge-lg gap-2 mb-4">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {event.date}
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <p className="text-base-content/70 text-lg whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            {/* Localisation */}
            {event.location && (
              <div className="mt-6 p-4 bg-base-200 rounded-lg">
                <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                  Lieu
                </h2>
                <p className="text-base-content/70">{event.location}</p>
              </div>
            )}
          </div>
        </div>

        {/* Planning horaire */}
        <HourlyDetail />
      </div>
    </div>
  );
}
