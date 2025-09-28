import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function CreatePlanning() {
  const { id } = useParams(); // id de l'event
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    startup: "",
    end: "",
    place: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/events/${id}/hourly`, form);
      console.log("Planning créé:", res.data);
      navigate(`/event/${id}`);
    } catch (err) {
      console.error("Erreur création planning:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded">
      <input
        type="text"
        name="title"
        placeholder="Titre"
        value={form.title}
        onChange={handleChange}
        className="w-full border p-2"
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="w-full border p-2"
      />
      <input
        type="datetime-local"
        name="startup"
        value={form.startup}
        onChange={handleChange}
        className="w-full border p-2"
        required
      />
      <input
        type="datetime-local"
        name="end"
        value={form.end}
        onChange={handleChange}
        className="w-full border p-2"
      />
      <input
        type="text"
        name="place"
        placeholder="Lieu"
        value={form.place}
        onChange={handleChange}
        className="w-full border p-2"
      />

      <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
        Créer Planning
      </button>
    </form>
  );
}
