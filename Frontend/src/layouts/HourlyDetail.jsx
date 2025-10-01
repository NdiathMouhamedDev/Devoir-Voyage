import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const [registeredHourlies, setRegisteredHourlies] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ Fonction pour vérifier les inscriptions
  const checkRegistrations = async (hourlies) => {
    if (!user) return;

    try {
      const registrationStatus = {};
      
      for (const h of hourlies) {
        try {
          const response = await api.get(`/inscriptions/${h.id}/check`);
          registrationStatus[h.id] = response.data.is_registered || false;
        } catch (error) {
          console.error(`Erreur vérification inscription ${h.id}:`, error);
          registrationStatus[h.id] = false;
        }
      }
      
      setRegisteredHourlies(registrationStatus);
    } catch (error) {
      console.error("Erreur lors de la vérification des inscriptions:", error);
    }
  };

  const handleSubscribeform = async (hourlyItem) => {
    const now = new Date();
    const startDate = new Date(hourlyItem.startup);

    if (startDate <= now) {
      toast.error("Impossible de s'inscrire : le planning a déjà commencé ou est passé.");
      return;
    }

    navigate(`/hourly/${hourlyItem.id}/inscrire`);
  };

  const handleSubscribe = async (hourlyItem) => {
    const now = new Date();
    const startDate = new Date(hourlyItem.startup);

    if (startDate <= now) {
      toast.error("Impossible de s'abonner : le planning a déjà commencé ou est passé.");
      return;
    }

    if (!user?.email_verified_at) {
      try {
        const res = await api.post("/send-verification");
        toast.info(res.data.message);
      } catch (err) {
        console.error("Erreur envoi vérification email:", err);
        toast.error("Erreur lors de l'envoi de l'email de vérification");
      }
      return;
    }

    try {
      await api.post(`/hourlies/${hourlyItem.id}/subscribe`);

      const channel = echo.channel(`hourly.${hourlyItem.id}`);
      
      channel.listen('.HourlyUpdated', (event) => {
        console.log('Notification reçue:', event);
        
        toast.success(event.message, {
          duration: 5000,
          position: 'top-right',
        });
      });
      
      setSubscribedHourlies(prev => ({
        ...prev,
        [hourlyItem.id]: true
      }));

      toast.success(`Vous êtes maintenant abonné aux notifications pour "${hourlyItem.title}"`);
    } catch (error) {
      console.error("Erreur lors de l'abonnement:", error);
      toast.error("Erreur lors de l'activation des notifications");
    }
  };

  useEffect(() => {
    setLoading(true);
    
    getHourlyByEvent(id).then(async (res) => {
      if (!res) {
        setLoading(false);
        return;
      }
      
      const data = res.data ?? res;
      const hourliesData = Array.isArray(data) ? data : [data];
      setHourly(hourliesData);
      
      // ✅ Vérifier les inscriptions après avoir chargé les horaires
      await checkRegistrations(hourliesData);
      
      setLoading(false);
    });

    return () => {
      if (hourly) {
        hourly.forEach(h => {
          echo.leaveChannel(`hourly.${h.id}`);
        });
      }
    };
  }, [id, user]); // ✅ Ajouter user comme dépendance

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

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

        const isRegistered = registeredHourlies[h.id] || false;
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

                  {/* Bouton Inscription */}
                  <button
                    onClick={() => handleSubscribeform(h)}
                    disabled={isRegistered}
                    className={`btn w-full gap-2 ${
                      isRegistered 
                        ? 'btn-success btn-disabled' 
                        : 'btn-secondary'
                    }`}
                  >
                    {isRegistered ? (
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Inscrit ✓
                      </>
                    ) : (
                      <>
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
                        Inscrivez-vous
                      </>
                    )}
                  </button>

                  {/* Bouton Notifications */}
                  <button
                    onClick={() => handleSubscribe(h)}
                    disabled={!isRegistered || isSubscribed}
                    className={`btn w-full gap-2 ${
                      isSubscribed 
                        ? 'btn-success' 
                        : isRegistered 
                        ? 'btn-accent' 
                        : 'btn-disabled'
                    }`}
                  >
                    {isSubscribed ? (
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
                        {isRegistered 
                          ? 'Activer les notifications' 
                          : 'Inscrivez-vous d\'abord'}
                      </>
                    )}
                  </button>

                  {/* Indication visuelle */}
                  {!isRegistered && (
                    <div className="alert alert-info shadow-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="stroke-current flex-shrink-0 w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm">Inscrivez-vous pour activer les notifications</span>
                    </div>
                  )}

                  {isRegistered && !isSubscribed && (
                    <div className="alert alert-warning shadow-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="stroke-current flex-shrink-0 w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <span className="text-sm">Activez les notifications pour être alerté</span>
                    </div>
                  )}

                  {isSubscribed && (
                    <div className="alert alert-success shadow-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="stroke-current flex-shrink-0 w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm">Vous recevrez les notifications pour cet horaire</span>
                    </div>
                  )}
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