// src/pages/HourlyDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHourlyById } from "../services/functions";
import SmartCountdown from "../components/SmartCountdown";

export default function HourlyDetail() {
  const { id } = useParams();
  const [hourly, setHourly] = useState(null);

  useEffect(() => {
    getHourlyById(id).then((res) => {
      if (!res) return;
      // si ton backend renvoie { success: true, data: hourly } adapte en conséquence
      const data = res.data ?? res; // tolérance
      setHourly(data);
    });
  }, [id]);

  if (!hourly) return <div className="p-6">⏳ Chargement...</div>;

  // construire start et end selon ton modèle :
  // si hourly.date_heure est ISO, on peut l'utiliser directement.
  // si depart/arrivee sont des times 'HH:mm', on concatène la date.
  function mergeDateAndTime(dateIso, timeStr) {
    if (!dateIso || !timeStr) return null;
    const datePart = new Date(dateIso).toISOString().split("T")[0];
    return `${datePart}T${timeStr}`;
  }

  const start = hourly.startup; // si ton backend renvoie ISO
  // si arrivee est seulement une heure, on la combine :
  const end = hourly.end ? mergeDateAndTime(hourly.startup, hourly.end) : null;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{hourly.titre}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4 bg-base-200 p-4 rounded-lg shadow">
            <p><strong>Lieu :</strong> {hourly.place || "Non défini"}</p>
            <p><strong>Date (start) :</strong> {new Date(start).toLocaleString()}</p>
            <p><strong>Départ :</strong> {hourly.startup || "—"}</p>
            <p><strong>Arrivée :</strong> {hourly.end || "—"}</p>
            <p className="mt-2 text-sm text-gray-500">{hourly.description}</p>
          </div>
        </div>

        <div>
          <SmartCountdown start={start} end={end} size={150} stroke={12} />
        </div>
      </div>
    </div>
  );
}
