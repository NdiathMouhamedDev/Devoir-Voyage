import axios from "../../api";
import { useState } from "react";

export default function VerifyEmail() {
  const [message, setMessage] = useState("");

  const resendEmail = async () => {
    try {
      const res = await axios.post("/email/verification-notification", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // récupère le token stocké après login/register
        },
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur lors de l'envoi");
    }
  };

  return (
    <div>
      <h1>Minicomponents</h1>
      <h2>Vérifie ton email 📧</h2>
      <p>Un email de confirmation a été envoyé. Clique sur le bouton si tu ne l'as pas reçu.</p>
      <button className="btn" onClick={resendEmail}>Renvoyer l'email</button>
      {message && <p>{message}</p>}
    </div>
  );
}
