import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const res = await api.get("/user");
        setUser(res.data);
      } catch (err) {
        console.error("Erreur check auth:", err.response || err.message);
        navigate("/login"); // si token invalide
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [navigate]);

  if (loading) return <p>Chargement...</p>;
  if (!user) return <p>Non authentifié</p>;

  return (
    <div>
      <h1>Bienvenue {user.name} 🎉</h1>
    </div>
  );
}
