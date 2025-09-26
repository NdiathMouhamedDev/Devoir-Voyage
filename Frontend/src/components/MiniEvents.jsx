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
        <div className="flex flex-col items-center gap-1">
            {token ? (
                <button
                    onClick={handleToggleInterest}
                    disabled={loading}
                    className={`btn btn-xs ${isInterested ? 'btn-error' : 'btn-primary'}`}
                >
                    {loading ? 'Chargement...' : isInterested ? '💔 Je ne suis plus intéressé' : '❤️ Je suis intéressé'}
                </button>
            ) : (
                <button
                    onClick={() => window.location.href = '/login'}
                    className="btn btn-xs btn-outline"
                >
                    ❤️ Je suis intéressé
                </button>
            )}
            <span className="text-xs">
                👥 {interestedCount} {interestedCount <= 1 ? 'personne intéressée' : 'personnes intéressées'}
            </span>
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

    useEffect(() => { loadEvents(); }, []);

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

    if (loading) return <div className="card w-96 shadow-xl p-4">Chargement...</div>;
    if (!events.length) return <div className="card w-96 shadow-xl p-4">Aucun événement disponible</div>;

    return (
        <div className="space-y-4 w-96">
            {events.map(event => (
                <div key={event.id} className="card bg-base-100 shadow-md p-3 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold">{event.title}</h3>
                            <div className="text-xs text-gray-500">
                                📅 {formatDate(event.date)} {event.location && <>📍 {event.location}</>}
                            </div>
                        </div>
                    </div>
                    {event.description && <p className="text-sm text-gray-700">{event.description.substring(0, 100)}...</p>}
                </div>
            ))}
        </div>
    );
}
