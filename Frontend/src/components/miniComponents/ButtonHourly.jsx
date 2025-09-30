import { useState } from "react";
import api from "../../api";

export default function ButtonHourly({ hourly }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleInscription() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setStatus({ type: "warning", message: "Vous devez être connecté" });
        setLoading(false);
        return;
      }
      
      await api.post(`/hourly/${hourly.id}/inscrire`);
      setStatus({ type: "success", message: "Inscription réussie !" });
    } catch (err) {
      setStatus({ 
        type: "error", 
        message: err.response?.data?.message || "Erreur lors de l'inscription" 
      });
    } finally {
      setLoading(false);
    }
  }

  const isPastDate = new Date(hourly.date_heure) <= new Date();

  return (
    <div className="mt-4">
      <button
        onClick={handleInscription}
        className="btn btn-primary w-full"
        disabled={isPastDate || loading}
      >
        {loading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Inscription...
          </>
        ) : (
          "S'inscrire"
        )}
      </button>
      
      {status && (
        <div className={`alert alert-${status.type} mt-3`}>
          <span className="text-sm">{status.message}</span>
        </div>
      )}
      
      {isPastDate && !status && (
        <p className="text-sm text-base-content/60 mt-2 text-center">
          Cette session est passée
        </p>
      )}
    </div>
  );
}