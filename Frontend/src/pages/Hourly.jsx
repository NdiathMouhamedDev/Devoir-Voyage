import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHourly, createHourly, updateHourly, deleteHourly } from "../services/functions";
import Calendars from "../layouts/Calendars";

export default function Hourly() {
    const [hourly, setHourly] = useState([]);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({
    titre: "",
    date_heure: "",
    lieu: "",
    depart: "",
    arrivee: ""
    });


    // 
    // Charger les horaires
    useEffect(() => {
        getHourly().then(setHourly);
    }, []);


    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // ⛔ Stoppe si les règles ne passent pas

    if (editId) {
        const updated = await updateHourly(editId, form);
        setHourly(hourly.map((h) => (h.id === editId ? updated : h)));
        setEditId(null);
    } else {
        const newHourly = await createHourly(form);
        setHourly([...hourly, newHourly]);
    }
    setForm({ titre: "", date_heure: "", lieu: "", depart: "", arrivee: "" });
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

    const validateForm = () => {
    const { titre, date_heure, depart, arrivee } = form;

    if (!titre || !date_heure || !depart) {
        alert("⚠️ Veuillez remplir au moins Titre, Date et Départ.");
        return false;
    }

    const eventDate = new Date(date_heure);
    const now = new Date();
    if (eventDate < now) {
        alert("⚠️ La date de l’événement ne peut pas être dans le passé.");
        return false;
    }

    const departDateTime = new Date(`${eventDate.toISOString().split("T")[0]}T${depart}`);
    if (departDateTime < eventDate) {
        alert("⚠️ L’heure de départ doit être après la date/heure de l’événement.");
        return false;
    }

    if (arrivee) {
        const arriveeDateTime = new Date(`${eventDate.toISOString().split("T")[0]}T${arrivee}`);
        if (arriveeDateTime < departDateTime) {
        alert("⚠️ L’heure d’arrivée doit être après l’heure de départ.");
        return false;
        }
    }

    return true;
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
                            <Link to={`/hourly/${h.id}`} className="btn btn-sm btn-info">📖 Détails</Link>
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





