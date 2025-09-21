import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../api/AuthContext";

export default function Events() {
  const { token } = useContext(AuthContext);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/events", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, [token]);

  return <h1>{message}</h1>;
}
