import { useState } from "react";
import api from "../api";

export default function RegisterEvent() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    start_at: "",
    end_at: "",
    location: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/events", form);
      
      alert("✅ Événement créé !");
      console.log(res.data);
    } catch (err) {
      console.error("❌ Erreur:", err.response?.data || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        placeholder="Titre"
        value={form.title}
        onChange={handleChange}
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
        value={form.location}
        onChange={handleChange}
        placeholder="Lieu"
      />
      <button type="submit">Créer</button>
    </form>
  );
}
