import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function CreatePlanning() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    startup: "",
    end: "",
    place: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post(`/events/${id}/hourly`, form);
      console.log("Planning créé:", res.data);
      navigate(`/event/${id}`);
    } catch (err) {
      console.error("Erreur création planning:", err);
      setError(err.response?.data?.message || "Erreur lors de la création du planning");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6 flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-primary"
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
              Créer un planning
            </h2>

            {error && (
              <div className="alert alert-error mb-4">
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Titre du planning</span>
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Ex: Départ pour la Grande Mosquée"
                  value={form.title}
                  onChange={handleChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Description</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Détails du planning..."
                  value={form.description}
                  onChange={handleChange}
                  className="textarea textarea-bordered h-24"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Heure de départ</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="startup"
                    value={form.startup}
                    onChange={handleChange}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Heure d'arrivée</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="end"
                    value={form.end}
                    onChange={handleChange}
                    className="input input-bordered"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Lieu de rendez-vous</span>
                </label>
                <input
                  type="text"
                  name="place"
                  placeholder="Ex: Place centrale"
                  value={form.place}
                  onChange={handleChange}
                  className="input input-bordered"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => navigate(`/event/${id}`)}
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Créer le planning
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}