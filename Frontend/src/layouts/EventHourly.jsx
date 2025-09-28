import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function EventHourly() {
  const { id } = useParams(); // id de l'event
  const [hourly, setPlanning] = useState(null);

  useEffect(() => {
    api.get(`/events/${id}/hourly`)
      .then((res) => setPlanning(res.data))
      .catch((err) => console.error("Erreur hourly:", err));
  }, [id]);

  if (!hourly) {
    return <p>Aucun hourly disponible pour cet event.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">{hourly.title}</h1>
      <p>{hourly.description}</p>
      <p>Départ : {new Date(hourly.startup).toLocaleString()}</p>
      <p>Arrivée : {new Date(hourly.end).toLocaleString()}</p>
      <p>Lieu : {hourly.place}</p>
    </div>
  );
}
