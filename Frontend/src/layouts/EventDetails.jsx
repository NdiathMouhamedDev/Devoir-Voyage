import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import InterestToggleButton from '../components/miniComponents/InterestToggleButton';
import { recupEventById } from '../services/functions';
import AvatarMenu from '../components/miniComponents/AvatarMenu';
import EventHourly from './EventHourly';
import HourlyDetail from './HourlyDetail';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null); // 👈 un seul event
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await recupEventById(id);
        setEvent(res); // 👈 un seul event
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

  if (loading) return <div className="text-center p-8">Chargement...</div>;
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;
  if (!event) return <div className="text-center p-8">Événement non trouvé</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link to="/events" className="btn btn-outline">
          ← Retour aux événements
        </Link>
        <AvatarMenu />
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-64 md:h-96">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{event.title}</h1>
            <InterestToggleButton eventId={id} />
          </div>

          <div className="mb-6">
            <div className="badge badge-outline text-lg p-3 mb-4">{event.date}</div>
            <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>

          {event.location && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Lieu</h2>
              <p className="text-gray-600">{event.location}</p>
            </div>
          )}
        </div>
      </div>

      <HourlyDetail />
    </div>
  );
}
