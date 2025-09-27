import { useEffect, useState } from "react";
import { getHourly, createHourly, updateHourly, deleteHourly } from "../services/functions";
import Calendars from "../layouts/Calendars";

export default function Hourly() {
    const [hourly, setHourly] = useState([]);
    const [form, setForm] = useState({ titre: "", date_heure: "" });
    const [editId, setEditId] = useState(null);

    // Charger les horaires
    useEffect(() => {
        getHourly().then(setHourly);
    }, []);

    // Ajouter un horaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editId) {
            const updated = await updateHourly(editId, form);
            setHourly(hourly.map((h) => (h.id === editId ? updated : h)));
            setEditId(null);
        } else {
            const newHourly = await createHourly(form);
            setHourly([...hourly, newHourly]);
        }
        setForm({ titre: "", date_heure: "" });
    };

    // Supprimer un horaire
    const handleDelete = async (id) => {
        if (confirm("Voulez-vous vraiment supprimer cet horaire ?")) {
            await deleteHourly(id,);
            setHourly(hourly.filter((h) => h.id !== id));
        }
    };

    // Préparer édition
    const handleEdit = (hourly) => {
        setForm({
            titre: hourly.titre || "",
            date_heure: hourly.date_heure ? hourly.date_heure.slice(0, 16) : "",
            lieu: hourly.lieu || "",
            depart: hourly.depart || "",
            arrivee: hourly.arrivee || ""
        });

        setEditId(hourly.id);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">📅 Gestion des Horaires</h2>

            <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
                <input
                    type="text"
                    placeholder="Titre"
                    name="titre"
                    className="input input-bordered w-full"
                    value={form.titre}
                    onChange={(e) => setForm({ ...form, titre: e.target.value })}
                />
                <input
                    type="datetime-local"
                    name="date_heure"
                    className="input input-bordered"
                    value={form.date_heure}
                    onChange={(e) => setForm({ ...form, date_heure: e.target.value })}
                />
                <input
                    type="text"
                    name="lieu"
                    className="input input-bordered"
                    value={form.lieu}
                    onChange={(e) => setForm({ ...form, lieu: e.target.value })}
                />
                <input
                    type="time"
                    name="depart"
                    className="input input-bordered"
                    value={form.depart}
                    onChange={(e) => setForm({ ...form, depart: e.target.value })}
                />
                <input
                    type="time"
                    name="arrive"
                    className="input input-bordered"
                    value={form.arrivee}
                    onChange={(e) => setForm({ ...form, arrivee: e.target.value })}
                />
                <button className="btn btn-primary">
                    {editId ? "Mettre à jour" : "Ajouter"}
                </button>
            </form>

            <ul className="space-y-2">
                {hourly.map((h) => (
                    <li key={h.id || Math.random()} className="p-3 bg-base-200 rounded-lg shadow flex justify-between items-center">
                        <div>
                            <strong>{h.titre}</strong> —
                            {h.date_heure ? new Date(h.date_heure).toLocaleString() : "⏳ En attente"}
                        </div>
                        <div className="flex gap-2">
                            <button className="btn btn-sm btn-warning" onClick={() => handleEdit(h)}>✏️</button>
                            <button className="btn btn-sm btn-error" onClick={() => handleDelete(h.id)}>🗑️</button>
                        </div>
                    </li>
                ))}
            </ul>
            <Calendars />
        </div>
    );
}
