import { useState } from "react";
import axios from "axios";
import api from "../../api";

export default function InscriptionButton({ hourly }) {
  const [status, setStatus] = useState(null);

  async function handleInscription() {
    try {
      const token = localStorage.getItem("token"); // ton token Sanctum
      if (!token) {
        setStatus("⚠️ Vous devez être connecté");
        return;
      }

      const res = await api.post(`/hourly/${hourly.id}/inscrire`);
      setStatus("✅ Inscription réussie !");
    } catch (err) {
      setStatus("❌ " + (err.response?.data?.message || "Erreur"));
    }
  }

  return (
    <div className="mt-4">
      <button
        onClick={handleInscription}
        className="btn btn-primary"
        disabled={new Date(hourly.date_heure) <= new Date()}
      >
        S'inscrire
      </button>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
}
