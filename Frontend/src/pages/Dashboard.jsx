import { useEffect, useState } from "react";
import {
  recupEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../services/functions";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    start_at: "",
    end_at: "",
    location: "",
  });

  // 🔄 Charger les événements au montage
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await recupEvents();
      setEvents(data);
    } catch (err) {
      console.error("Erreur lors du chargement des événements:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Créer ou mettre à jour un événement
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await updateEvent(form.id, form);
        alert("✅ Événement mis à jour !");
      } else {
        await createEvent(form);
        alert("✅ Événement créé !");
      }
      setForm({ id: null, title: "", description: "", start_at: "", end_at: "", location: "" });
      loadEvents();
    } catch (err) {
      console.error("Erreur CRUD:", err);
    }
  };

  // ✏️ Pré-remplir le formulaire pour modifier
  const handleEdit = (event) => {
    setForm(event);
  };

  // 🗑️ Supprimer un événement
  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cet événement ?")) {
      await deleteEvent(id);
      loadEvents();
    }
  };

  return (
    <div>
      <h1>📅 Dashboard - Gestion des événements</h1>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          name="title"
          placeholder="Titre"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          type="datetime-local"
          name="start_at"
          value={form.start_at}
          onChange={handleChange}
        />
        <input
          type="datetime-local"
          name="end_at"
          value={form.end_at}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Lieu"
          value={form.location}
          onChange={handleChange}
        />
        <button type="submit">
          {form.id ? "Mettre à jour" : "Créer"}
        </button>
      </form>

      {/* Liste des événements */}
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <strong>{event.title}</strong> - {event.location} <br />
            <p>{event.description}</p>
            <br />
            <button onClick={() => handleEdit(event)}>✏️ Modifier</button>
            <button onClick={() => handleDelete(event.id)}>🗑️ Supprimer</button>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}
