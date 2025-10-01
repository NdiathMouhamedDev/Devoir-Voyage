import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHourlyByEvent } from "../services/functions";
import SmartCountdown from "../components/SmartCountdown";
import echo from "../../echo";
import { useAuth } from "../layouts/UseAuth";
import api from "../api";
import { toast } from 'react-hot-toast';

export default function HourlyDetail() {
  const { id } = useParams();
  const [hourly, setHourly] = useState([]);
  const [subscribedHourlies, setSubscribedHourlies] = useState({}); 
  const { user } = useAuth();



  const handleSubscribe = async (hourlyItem) => {
    const now = new Date();
    const startDate = new Date(hourlyItem.startup);

    if (startDate <= now) {
      alert("Impossible de s'abonner : le planning a déjà commencé ou est passé.");
      return;
    }

    if (!user?.email_verified_at) {
      try {
        const res = await api.post("/send-verification");
        alert(res.data.message);
      } catch (err) {
        console.error("Erreur envoi vérification email:", err);
      }
      return;
    }

    try {
      // S'abonner au canal WebSocket
      const channel = echo.channel(`hourly.${hourlyItem.id}`);

      channel.listen('.HourlyUpdated', (event) => {
        console.log('Notification reçue:', event);

        // Afficher une notification
        alert(`${hourlyItem.title}: ${event.message}`);

        // Ou utiliser react-hot-toast pour plus de style
        // toast.success(`${hourlyItem.title}: ${event.message}`);
      });

      setSubscribedHourlies(prev => ({
        ...prev,
        [hourlyItem.id]: true
      }));

      console.log(`Abonné aux notifications pour: ${hourlyItem.title}`);
    } catch (error) {
      console.error("Erreur lors de l'abonnement:", error);
      alert("Erreur lors de l'activation des notifications");
    }
  };

  useEffect(() => {
    getHourlyByEvent(id).then((res) => {
      if (!res) return;
      const data = res.data ?? res;
      setHourly(Array.isArray(data) ? data : [data]);
    });

    // Nettoyage : se désabonner quand le composant est démonté
    return () => {
      if (hourly) {
        hourly.forEach(h => {
          echo.leaveChannel(`hourly.${h.id}`);
        });
      }
    };
  }, [id]);

  return (
    <div className="space-y-6">
      {hourly.map((h) => {
        const startDisplay = new Date(h.startup).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });

        const endDisplay = h.end ? new Date(h.end).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }) : null;

        // ✅ Vérifier si CET horaire spécifique est abonné
        const isSubscribed = subscribedHourlies[h.id] || false;

        return (
          <div key={h.id || `hourly-${Math.random()}`} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">{h.title}</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-base-200 p-4 rounded-lg space-y-3">
                    <div className="flex items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary"
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
                      <div>
                        <p className="text-sm font-medium">Lieu</p>
                        <p className="text-base-content/70">{h.place || "Non défini"}</p>
                      </div>
                    </div>

                    <div className="divider my-2"></div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Départ</p>
                        <div className="badge badge-success gap-2">
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
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {startDisplay || "—"}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-1">Arrivée</p>
                        <div className="badge badge-error gap-2">
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
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {endDisplay || "—"}
                        </div>
                      </div>
                    </div>

                    {h.description && (
                      <>
                        <div className="divider my-2"></div>
                        <p className="text-sm text-base-content/70">{h.description}</p>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handleSubscribe(h)}
                    disabled={isSubscribed} // ✅ Utiliser l'état spécifique à cet horaire
                    className={`btn w-full gap-2 ${isSubscribed ? 'btn-success' : 'btn-accent'}`}
                  >
                    {isSubscribed ? ( // ✅ Utiliser l'état spécifique à cet horaire
                      <>
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Notifications activées
                      </>
                    ) : (
                      <>
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
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          />
                        </svg>
                        Activer les notifications
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center">
                  <SmartCountdown
                    start={h.startup}
                    end={h.end}
                    size={150}
                    stroke={12}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}