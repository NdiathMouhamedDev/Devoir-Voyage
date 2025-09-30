import React, { useState } from "react";

export default function VerifyEmail() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const resendVerificationEmail = async () => {
    setLoading(true);
    setError(null);
    setMessage("");

    // Simulation de l'API
    setTimeout(() => {
      setMessage("✅ Votre email a été vérifié !");
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Card principale */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {/* En-tête */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-primary"
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
              </div>
              <h1 className="text-3xl font-bold text-base-content">
                Vérification de l'email
              </h1>
              <p className="mt-4 text-base-content/70">
                Pour accéder à toutes les fonctionnalités, veuillez vérifier votre adresse email.
                Cliquez sur le bouton ci-dessous pour recevoir un nouvel email de vérification.
              </p>
            </div>

            {/* Messages d'erreur */}
            {error && (
              <div className="alert alert-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Messages de succès */}
            {message && (
              <div className="alert alert-success">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{message}</span>
              </div>
            )}

            {/* Bouton d'action */}
            <button
              onClick={resendVerificationEmail}
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading && <span className="loading loading-spinner"></span>}
              {loading ? "Envoi en cours..." : "Renvoyer l'email de vérification"}
            </button>

            {/* Informations supplémentaires */}
            <div className="divider">ou</div>
            
            <div className="text-center">
              <p className="text-sm text-base-content/60">
                Vous avez déjà vérifié votre email ?
              </p>
              <button
                className="btn btn-ghost btn-sm mt-2"
              >
                Retour au tableau de bord
              </button>
            </div>
          </div>
        </div>

        {/* Card d'aide */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body py-4">
            <div className="flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-info shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-sm text-base-content/70">
                  <strong className="text-base-content">Astuce :</strong> Vérifiez votre dossier spam si vous ne recevez pas l'email dans les 5 minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}