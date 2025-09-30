import { useState } from "react";
import { createEvent } from "../services/functions";
import { useNavigate } from "react-router-dom";

export default function RegisterEvent({ onSuccess }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    start_at: "",
    end_at: "",
    location: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await createEvent(form);
      console.log("Événement créé :", data);
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/events");
      }
      
      setForm({
        title: "",
        description: "",
        start_at: "",
        end_at: "",
        location: "",
      });
    } catch (err) {
      console.error("Erreur:", err);
      setError(err.response?.data?.message || "Une erreur est survenue lors de la création de l'événement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="alert alert-error">
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
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Titre de l'événement</span>
        </label>
        <input
          name="title"
          type="text"
          required
          className="input input-bordered"
          placeholder="Ex: Conférence annuelle"
          value={form.title}
          onChange={handleChange}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Description</span>
        </label>
        <textarea
          name="description"
          required
          className="textarea textarea-bordered h-24"
          placeholder="Décrivez votre événement..."
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Date et heure de début</span>
          </label>
          <input
            type="datetime-local"
            name="start_at"
            required
            className="input input-bordered"
            value={form.start_at}
            onChange={handleChange}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Date et heure de fin</span>
          </label>
          <input
            type="datetime-local"
            name="end_at"
            required
            className="input input-bordered"
            value={form.end_at}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Lieu</span>
        </label>
        <input
          type="text"
          name="location"
          className="input input-bordered"
          placeholder="Ex: Grande Mosquée de Touba"
          value={form.location}
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={() => navigate("/events")}
          className="btn btn-ghost"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary gap-2"
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Création en cours...
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Créer l'événement
            </>
          )}
        </button>
      </div>
    </form>
  );
}