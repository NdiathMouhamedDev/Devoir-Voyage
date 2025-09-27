import { useEffect, useState } from "react";
import api from "../api";

export default function InscriptionForm({ hourly }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    telephone: "",
    address: "",
    paiement: "cash",
  });
  const [status, setStatus] = useState(null);

  // Charger les infos user (pré-remplissage)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    api
      .get("/user") // ⚠️ Laravel Sanctum expose /api/user (pas /api/api/user)
      .then((res) => {
        setForm((prev) => ({
          ...prev,
          name: res.data.name || "",
          email: res.data.email || "",
          telephone: res.data.telephone || "",
          address: res.data.address || "",
        }));
      })
      .catch(() => setStatus("⚠️ Impossible de charger vos infos"));
  }, []);

  // Soumission du formulaire
  async function handleSubmit(e) {
  e.preventDefault();
  const token = localStorage.getItem("token");
  if (!token) {
    setStatus("⚠️ Vous devez être connecté");
    return;
  }

  try {
    // 1. Mise à jour profil
    await api.put("/user", {
      name: form.name,
      email: form.email,
      phone_number: form.phone_number,
      address: form.address,
    });

    // 2. Inscription à l’event
    const res = await api.post("/inscriptions", {
      event_id: hourly?.id ?? 1, // ⚠️ passer l’id de l’event courant
      paiement: form.paiement,
    });

    setStatus("✅ Inscription réussie !");
    console.log("Réponse backend:", res.data);

  } catch (err) {
    console.error("Erreur Axios complète:", err);
    if (err.response) {
      setStatus("❌ " + (err.response.data.message || "Erreur serveur"));
    } else if (err.request) {
      setStatus("❌ Pas de réponse du serveur");
    } else {
      setStatus("❌ Erreur: " + err.message);
    }
  }
}



  return (
    <form onSubmit={handleSubmit} className="p-4 bg-base-200 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-3">Formulaire d'inscription</h2>

      <div className="mb-2">
        <label className="block text-sm">Nom</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Email</label>
        <input
          type="email"
          className="input input-bordered w-full"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Téléphone</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={form.telephone}
          onChange={(e) => setForm({ ...form, telephone: e.target.value })}
          required
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Adresse</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Mode de paiement</label>
        <select
          className="select select-bordered w-full"
          value={form.paiement}
          onChange={(e) => setForm({ ...form, paiement: e.target.value })}
        >
          <option value="cash">💵 Cash</option>
          <option value="online" disabled>
            💳 Online (indisponible)
          </option>
        </select>
      </div>

      <button className="btn btn-primary mt-2">S’inscrire</button>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </form>
  );
}


