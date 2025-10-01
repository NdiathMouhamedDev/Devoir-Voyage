import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const query = new URLSearchParams(useLocation().search);
  const status = query.get("status");
  const navigate = useNavigate();

  const messages = {
    success: "✅ Votre email a été vérifié avec succès !",
    already: "ℹ️ Votre email est déjà vérifié.",
    invalid: "❌ Lien invalide ou expiré.",
    user_not_found: "❌ Utilisateur introuvable.",
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Vérification d'email</h1>
      <p className="mb-4">{messages[status] || "⏳ Vérification en cours..."}</p>
      <button
        onClick={() => navigate("/events")}
        className="btn btn-primary"
      >
        Aller au Événements
      </button>
      
    </div>
  );
}
