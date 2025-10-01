import axios from "../../api";
import { useState } from "react";

export default function VerifyEmail() {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const resendEmail = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const res = await axios.post(
        "/email/verification-notification",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage({ type: "success", text: res.data.message || "Email envoyé avec succès !" });
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: err.response?.data?.message || "Erreur lors de l'envoi" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          {/* Icône email */}
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h2 className="card-title text-2xl mb-2">Vérifie ton email</h2>
          
          <p className="text-base-content/70 mb-6">
            Un email de confirmation a été envoyé à ton adresse. 
            Clique sur le lien dans l'email pour vérifier ton compte.
          </p>

          <button 
            className="btn btn-primary w-full gap-2" 
            onClick={resendEmail}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Envoi en cours...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Renvoyer l'email
              </>
            )}
          </button>

          {message && (
            <div className={`alert alert-${message.type} mt-4 w-full`}>
              <span className="text-sm">{message.text}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}