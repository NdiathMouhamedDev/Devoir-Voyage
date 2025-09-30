import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHourlyByEvent } from "../services/functions";
import SmartCountdown from "../components/SmartCountdown";
import echo from "../../echo";
import { useAuth } from "../layouts/UseAuth";
import api from "../api";

export default function HourlyDetail() {
  const { id } = useParams();
  const [hourly, setHourly] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const { user } = useAuth();

  const handleSubscribe = async (hourlyItem) => {
    const now = new Date();
    const startDate = new Date(hourlyItem.startup);
    
    console.log("Date de départ:", startDate);
    console.log("Maintenant:", now);

    // ⛔ Si l'événement a déjà commencé, on bloque
    if (startDate <= now) {
      alert("Impossible de s'abonner : le planning a déjà commencé ou est passé.");
      return;
    }

    // Vérifier si l'email est vérifié
    if (!user?.email_verified_at) {
      try {
        const res = await api.post("/send-verification");
        alert(res.data.message);
      } catch (err) {
        console.error("Erreur envoi vérification email:", err);
      }
      return;
    }

    // S'abonner aux notifications WebSocket
    echo.private(`hourly.${hourlyItem.id}`).listen("HourlyUpdated", (event) => {
      alert(`Notification ${hourlyItem.title} : ${event.message}`);
    });

    setSubscribed(true);
  };

  useEffect(() => {
    getHourlyByEvent(id).then((res) => {
      if (!res) return;
      const data = res.data ?? res;
      setHourly(Array.isArray(data) ? data : [data]);
    });
  }, [id]);

  if (!hourly) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {hourly.map((h) => {
        // Formater les dates pour l'affichage uniquement
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
                    disabled={subscribed}
                    className={`btn w-full gap-2 ${subscribed ? 'btn-success' : 'btn-accent'}`}
                  >
                    {subscribed ? (
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
                  {/* ✅ Passer les dates brutes (format MySQL/Laravel) */}
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