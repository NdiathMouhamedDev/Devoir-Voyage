import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", form);

      const { token, user } = res.data;

      // ✅ Sauvegarder token + id
      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user.id);

      console.log("Connexion réussie:", user);
      navigate("/dashboard");
    } catch (err) {
      console.error("Erreur de connexion", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Mot de passe"
        value={form.password}
        onChange={handleChange}
      />
      <button type="submit">Se connecter</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
