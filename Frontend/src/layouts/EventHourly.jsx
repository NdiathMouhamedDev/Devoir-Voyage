import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function EventHourly() {
  const { id } = useParams();
  const [hourly, setPlanning] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/events/${id}/hourly`)
      .then((res) => {
        setPlanning(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur hourly:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <span className="loading loading-spinner loading-md text-primary"></span>
      </div>
    );
  }

  if (!hourly) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-base-content/20"
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
          <p className="text-base-content/70">Aucun planning disponible pour cet événement.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">{hourly.title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="badge badge-success gap-2">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Départ
            </div>
            <span className="text-base-content/70">
              {new Date(hourly.startup).toLocaleString('fr-FR')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="badge badge-error gap-2">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Arrivée
            </div>
            <span className="text-base-content/70">
              {new Date(hourly.end).toLocaleString('fr-FR')}
            </span>
          </div>
        </div>

        {hourly.place && (
          <div className="mt-4 p-4 bg-base-200 rounded-lg flex items-center gap-3">
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
              <p className="text-base-content/70">{hourly.place}</p>
            </div>
          </div>
        )}

        {hourly.description && (
          <div className="mt-4">
            <p className="text-base-content/70">{hourly.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}