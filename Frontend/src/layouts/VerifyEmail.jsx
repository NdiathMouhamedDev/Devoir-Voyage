import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function VerifyEmail() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user_id");

    if (!token || !user) {
      navigate("/login");
    }
  }, [navigate]);

  const resendVerificationEmail = async () => {
    setLoading(true);
    setError(null);
    setMessage("");

    try {
      const response = await api.post("/email/verification-notification");
      setMessage("✅ Votre email à ete verifier !");
      navigate('/Dashboard');
    } catch (error) {
      setError(error.response?.data?.message || "Erreur : impossible d'envoyer l'email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="bg-primary">layouts</h1>
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Vérification de l'email
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Pour accéder à toutes les fonctionnalités, veuillez vérifier votre adresse email.
            Cliquez sur le bouton ci-dessous pour recevoir un nouvel email de vérification.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
            {message}
          </div>
        )}

        <button
          onClick={resendVerificationEmail}
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Envoi en cours..." : "Renvoyer l'email de vérification"}
        </button>
      </div>
    </div>
  );
}
