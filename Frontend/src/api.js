import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true, // pour CORS avec cookies

});
 

// 🔑 Ajouter le token automatiquement si présent
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;

});

// Intercepteur pour gérer les erreurs 401 (non connecté)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      // Redirection vers la page de login sans utiliser de hook React
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
