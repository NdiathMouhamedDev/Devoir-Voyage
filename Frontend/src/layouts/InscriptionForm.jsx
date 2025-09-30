import { useEffect, useState } from "react";
import api from "../api";
import { useParams } from "react-router-dom";

export default function InscriptionForm() {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
    paiement: "cash",
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoadingUser(false);
      return;
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
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    if (!token) {
      setStatus({ type: "warning", text: "Vous devez être connecté" });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      await api.put("/user", {
        name: form.name,
        email: form.email,
        phone_number: form.phone_number,
        address: form.address,
      });

      await api.post(`/inscriptions/${id}`, {
        event_id: id,
        paiement: form.paiement,
      });

      setStatus({ type: "success", text: "Inscription réussie !" });
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
      <div className="flex justify-center p-8">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">Formulaire d'inscription</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Nom complet</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <input
              type="email"
              className="input input-bordered"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Téléphone</span>
            </label>
            <input
              type="tel"
              className="input input-bordered"
              value={form.phone_number}
              onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Adresse</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Mode de paiement</span>
            </label>
            <select
              className="select select-bordered"
              value={form.paiement}
              onChange={(e) => setForm({ ...form, paiement: e.target.value })}
            >
              <option value="cash">Espèces</option>
              <option value="online" disabled>
                En ligne (indisponible)
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Inscription en cours...
              </>
            ) : (
              "S'inscrire à l'événement"
            )}
          </button>

          {status && (
            <div className={`alert alert-${status.type}`}>
              <span>{status.text}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
