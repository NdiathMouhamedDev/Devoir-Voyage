import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHourly, createHourly, updateHourly, deleteHourly } from "../services/functions";
import Calendars from "./Calendars";
import RegisterHourly from "./RegisterHourly";

export default function Hourly() {
    const [hourly, setHourly] = useState([]);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({
    title: "",
    description: "",
    startup: "",
    end: "",
    place: "",
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
    setForm({ title: "",description:"", startup: "", place: "",  end: "" });
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
            title: hourly.title || "",
            description: hourly.description || "",
            startup: hourly.startup ? hourly.startup.slice(0, 16) : "",
            end: hourly.end || "",
            place: hourly.place || "",
        });

        setEditId(hourly.id);
    };

    const validateForm = () => {
    const { title, startup, description, end, place } = form;

    if (!title || !startup || !end) {
        alert("⚠️ Veuillez remplir au moins Titre, Date et Départ.");
        return false;
    }

    const eventDate = new Date();
    const now = new Date();
    if (eventDate < now) {
        alert("⚠️ La date de l’événement ne peut pas être dans le passé.");
        return false;
    }

    const startupDateTime = new Date(`${eventDate.toISOString().split("T")[0]}T${startup}`);
    if (startupDateTime < eventDate) {
        alert("⚠️ L’heure de départ doit être après la date/heure de l’événement.");
        return false;
    }

    if (end) {
        const endDateTime = new Date(`${eventDate.toISOString().split("T")[0]}T${end}`);
        if (endDateTime < startupDateTime) {
        alert("⚠️ L’heure d’arrivée doit être après l’heure de départ.");
        return false;
        }
    }

    return true;
    };


    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">📅 Gestion des Horaires</h2>

            <RegisterHourly />

            <ul className="space-y-2">
                {hourly.map((h) => (
                    <li key={h.id || Math.random()} className="p-3 bg-base-200 rounded-lg shadow flex justify-between items-center">
                        <div>
                            <strong>{h.title}</strong> —
                            {h.startup ? new Date(h.startup).toLocaleString() : "⏳ En attente"}
                        </div>
                        <div className="flex gap-2">
                            <Link to={`/hourly/${h.id}`} className="btn btn-sm btn-info">📖 Détails</Link>
                            <Link to={`/hourly/${h.id}/inscrire`} className="btn btn-sm btn-info">S'inscrire</Link>
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





