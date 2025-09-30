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

  const handleSubscribe = async () => {
    const now = new Date();
    const startDate = new Date(hourly.map((h)=>(h.startup)));
    console.log(startDate);
    console.log(now)

    // ⛔ si l'événement a déjà commencé, on bloque
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

    echo.private(`hourly.${hourly.id}`).listen("HourlyUpdated", (event) => {
      alert(`Notification ${hourly.title} : ${event.message}`);
    });

    setSubscribed(true);
  };

  useEffect(() => {
    getHourlyByEvent(id).then((res) => {
      if (!res) return;
      const data = res.data ?? res;
      setHourly(data);
    });
  }, [id]);

  if (!hourly) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  function mergeDateAndTime(dateIso, timeStr) {
    if (!dateIso || !timeStr) return null;
    const datePart = new Date(dateIso).toISOString().split("T")[0];
    return `${datePart}T${timeStr}`;
  }

  const start = hourly.startup;
  const end = hourly.end ? mergeDateAndTime(hourly.startup, hourly.end) : null;

  return (
    <div className="card bg-base-100 shadow-xl">
      {hourly.map((h)=>{
        const start_at = new Date(h.startup).toLocaleDateString("fr-FR", { hour: "2-digit", minute: "2-digit" });
        const end_at = new Date(h.end).toLocaleDateString("fr-FR", { hour: "2-digit", minute: "2-digit" });
        return(
        <div key={`${h.title}-${Math.random()}`} className="card-body">
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
                    {start_at || "—"}
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
                    {end_at || "—"}
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
              onClick={handleSubscribe}
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
            <SmartCountdown start={start_at} end={end_at} size={150} stroke={12} />
          </div>
        </div>
      </div>
    )})}
    </div>
  );
}