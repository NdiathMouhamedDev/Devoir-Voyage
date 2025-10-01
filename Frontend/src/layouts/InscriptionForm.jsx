import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";

export default function InscriptionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
    payment: "cash",
    statuts:'valid',
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoadingUser(false);
      return;
    }

    // ✅ Vérifier si déjà inscrit via localStorage
    const registeredEvents = JSON.parse(localStorage.getItem("registered_events") || "[]");
    if (registeredEvents.includes(id)) {
      setIsAlreadyRegistered(true);
      setStatus({ 
        type: "info", 
        text: "✓ Vous êtes déjà inscrit à cet événement" 
      });
    }

    api
      .get("/user")
      .then((res) => {
        const userData = res.data.user || res.data;
        setForm((prev) => ({
          ...prev,
          name: userData.name || "",
          email: userData.email || "",
          phone_number: userData.phone_number || "",
          address: userData.address || "",
        }));
      })
      .catch(() => setStatus({ type: "error", text: "Impossible de charger vos informations" }))
      .finally(() => setLoadingUser(false));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    if (!token) {
      setStatus({ type: "warning", text: "Vous devez être connecté" });
      return;
    }

    if (isAlreadyRegistered) {
      setStatus({ type: "warning", text: "Vous êtes déjà inscrit à cet événement" });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      // 1. Mettre à jour les infos utilisateur
      await api.put("/user", {
        name: form.name,
        email: form.email,
        phone_number: form.phone_number,
        address: form.address,
      });

      // 2. Créer l'inscription
      await api.post(`/inscriptions/${id}`, {
        payment: form.payment,
        phone_number: form.phone_number,
        address: form.address,
        statuts: "valid"
      });

      // ✅ Sauvegarder l'inscription dans localStorage
      const registeredEvents = JSON.parse(localStorage.getItem("registered_events") || "[]");
      registeredEvents.push(id);
      localStorage.setItem("registered_events", JSON.stringify(registeredEvents));

      setStatus({ type: "success", text: "🎉 Inscription réussie !" });
      setIsAlreadyRegistered(true);
      
      setTimeout(() => {
        navigate(`/events`);
      }, 2000);
    } catch (err) {
      console.error("Erreur:", err);
      setStatus({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de l'inscription",
      });
    } finally {
      setLoading(false);
    }
  }

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* En-tête avec icône */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-primary-content"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-base-content mb-2">
            {isAlreadyRegistered ? "Inscription confirmée" : "Formulaire d'inscription"}
          </h1>
          <p className="text-base-content/70">
            {isAlreadyRegistered 
              ? "Vous êtes déjà inscrit à cet événement" 
              : "Remplissez vos informations pour participer"}
          </p>
        </div>

        {/* Carte du formulaire */}
        <div className="card bg-base-100 shadow-2xl border border-base-300">
          <div className="card-body p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Nom complet
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered input-primary focus:input-primary"
                  placeholder="Entrez votre nom complet"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  disabled={isAlreadyRegistered}
                />
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Adresse email
                  </span>
                </label>
                <input
                  type="email"
                  className="input input-bordered input-primary focus:input-primary"
                  placeholder="exemple@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  disabled={isAlreadyRegistered}
                />
              </div>

              {/* Téléphone */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    Numéro de téléphone
                  </span>
                </label>
                <input
                  type="tel"
                  className="input input-bordered input-primary focus:input-primary"
                  placeholder="+221 XX XXX XX XX"
                  value={form.phone_number}
                  onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                  required
                  disabled={isAlreadyRegistered}
                />
              </div>

              {/* Adresse */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-primary"
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
                    Adresse
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered input-primary focus:input-primary"
                  placeholder="Votre adresse complète"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  required
                  disabled={isAlreadyRegistered}
                />
              </div>

              {/* Mode de paiement */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Mode de paiement
                  </span>
                </label>
                <select
                  className="select select-bordered select-primary focus:select-primary"
                  value={form.payment}
                  onChange={(e) => setForm({ ...form, payment: e.target.value })}
                  required
                  disabled={isAlreadyRegistered}
                >
                  <option value="cash">💵 Espèces (à la porte)</option>
                  <option value="online" disabled>
                    💳 Paiement en ligne (bientôt disponible)
                  </option>
                </select>
              </div>

              {/* Bouton de soumission */}
              <button
                type="submit"
                className={`btn w-full gap-2 text-lg ${
                  isAlreadyRegistered 
                    ? 'btn-success btn-disabled' 
                    : 'btn-primary'
                }`}
                disabled={loading || isAlreadyRegistered}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Inscription en cours...
                  </>
                ) : isAlreadyRegistered ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
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
                    Inscription validée
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
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
                    Confirmer mon inscription
                  </>
                )}
              </button>

              {/* Message de statut */}
              {status && (
                <div className={`alert alert-${status.type} shadow-lg`}>
                  <div>
                    {status.type === 'success' && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-current flex-shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                    {status.type === 'error' && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-current flex-shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                    {status.type === 'info' && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="stroke-current flex-shrink-0 w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    )}
                    <span className="font-medium">{status.text}</span>
                  </div>
                </div>
              )}

              {/* Note d'information */}
              {!isAlreadyRegistered && (
                <div className="alert alert-warning/10 border border-warning/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-warning flex-shrink-0 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span className="text-sm">
                    Vous ne pouvez vous inscrire qu'une seule fois par événement.
                  </span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bouton retour */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate(`/event/${id}`)}
            className="btn btn-ghost gap-2"
          >
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Retour à l'événement
          </button>
        </div>
      </div>
    </div>
  );
}