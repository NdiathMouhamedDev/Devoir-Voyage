import { useState, useEffect } from "react";
import { createEvent, updateEvent } from "../services/functions";
import { useNavigate } from "react-router-dom";

export default function RegisterEvent({ onSuccess, eventToEdit }) {
  const navigate = useNavigate();
  const isEditMode = Boolean(eventToEdit);
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    start_at: "",
    end_at: "",
    location: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Pré-remplir le formulaire en mode édition
  useEffect(() => {
    if (eventToEdit) {
      setForm({
        title: eventToEdit.title || "",
        description: eventToEdit.description || "",
        start_at: eventToEdit.start_at ? eventToEdit.start_at.split('T')[0] : "",
        end_at: eventToEdit.end_at ? eventToEdit.end_at.split('T')[0] : "",
        location: eventToEdit.location || "",
      });
    }
  }, [eventToEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation des dates
    if (form.start_at && form.end_at) {
      const startDate = new Date(form.start_at);
      const endDate = new Date(form.end_at);
      
      if (endDate < startDate) {
        setError("La date de fin doit être après la date de début");
        setLoading(false);
        return;
      }
    }

    try {
      if (isEditMode) {
        // Mode édition
        await updateEvent(eventToEdit.id, form);
        console.log("Événement modifié :", eventToEdit.id);
      } else {
        // Mode création
        const data = await createEvent(form);
        console.log("Événement créé :", data);
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/events");
      }
      
      // Réinitialiser le formulaire uniquement en mode création
      if (!isEditMode) {
        setForm({
          title: "",
          description: "",
          start_at: "",
          end_at: "",
          location: "",
        });
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError(
        err.response?.data?.message || 
        `Une erreur est survenue lors de ${isEditMode ? 'la modification' : 'la création'} de l'événement`
      );
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

      {isEditMode && (
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Vous êtes en train de modifier l'événement <strong>"{eventToEdit.title}"</strong></span>
        </div>
      )}

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">
            Titre de l'événement
            <span className="text-error ml-1">*</span>
          </span>
        </label>
        <input
          name="title"
          type="text"
          required
          className="input input-bordered focus:input-primary"
          placeholder="Ex: Conférence annuelle"
          value={form.title}
          onChange={handleChange}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">
            Description
            <span className="text-error ml-1">*</span>
          </span>
        </label>
        <textarea
          name="description"
          required
          className="textarea textarea-bordered focus:textarea-primary h-24"
          placeholder="Décrivez votre événement..."
          value={form.description}
          onChange={handleChange}
        />
        <label className="label">
          <span className="label-text-alt text-base-content/60">
            {form.description.length} caractères
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">
              Date de début
              <span className="text-error ml-1">*</span>
            </span>
          </label>
          <input
            type="date"
            name="start_at"
            required
            className="input input-bordered focus:input-primary"
            value={form.start_at}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">
              Date de fin
              <span className="text-error ml-1">*</span>
            </span>
          </label>
          <input
            type="date"
            name="end_at"
            required
            className="input input-bordered focus:input-primary"
            value={form.end_at}
            onChange={handleChange}
            min={form.start_at || new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Lieu</span>
        </label>
        <div className="join w-full">
          <span className="join-item btn btn-ghost pointer-events-none">
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
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            name="location"
            className="input input-bordered focus:input-primary join-item w-full"
            placeholder="Ex: Grande Mosquée de Touba"
            value={form.location}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="divider"></div>

      <div className="flex gap-2 justify-end">
        {onSuccess ? (
          <button
            type="button"
            onClick={onSuccess}
            className="btn btn-ghost"
          >
            Annuler
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate("/events")}
            className="btn btn-ghost"
          >
            Annuler
          </button>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className={`btn gap-2 ${isEditMode ? 'btn-warning' : 'btn-primary'}`}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              {isEditMode ? 'Modification...' : 'Création en cours...'}
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
                {isEditMode ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                )}
              </svg>
              {isEditMode ? 'Enregistrer les modifications' : 'Créer l\'événement'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}