import api from "../api";
import axios from "axios";


// 📌 Récupérer tous les événements
export async function recupEvents() {
  try {
    const res = await api.get("/events");
    const response = res.data;
    return response.data;
  } catch (err) {
    console.error("❌ Erreur recupEvents:", err.response?.data || err.message);
    throw err;
  }
}

// 📌 Récupérer un seul événement par ID
export async function recupEventById(id) {
  try {
    const res = await api.get(`/events/${id}`);
    // Le backend renvoie { message, data: { ...event } }
    // On retourne directement l'objet événement
    return res.data.data;
  } catch (err) {
    console.error("❌ Erreur recupEventById:", err.response?.data || err.message);
    throw err;
  }
}

// 📌 Créer un événement
export async function createEvent(eventData) {
  try {
    const res = await api.post("/events", eventData);
    const response = res.data;
    return response.data;
  } catch (err) {
    console.error("❌ Erreur createEvent:", err.response?.data || err.message);
    throw err;
  }
}

// 📌 Mettre à jour un événement
export async function updateEvent(id, eventData) {
  try {
    const res = await api.put(`/events/${id}`, eventData);
    const response = res.data;
    return response.data;
  } catch (err) {
    console.error("❌ Erreur updateEvent:", err.response?.data || err.message);
    throw err;
  }
}

// 📌 Supprimer un événement
export async function deleteEvent(id) {
  try {
    await api.delete(`/events/${id}`);
    return { success: true };
  } catch (err) {
    console.error("❌ Erreur deleteEvent:", err.response?.data || err.message);
    throw err;
  }
}

export function checkAuth(navigate) {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");

  if (!token || !userId) {
    alert("Veuillez vous connecter pour accéder à cette page.");
    navigate("/login"); // redirection vers login
    return false;
  }

  return true;
}
