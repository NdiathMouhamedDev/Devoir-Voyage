import { useState, useEffect } from "react";
import api from "../api";

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error("Erreur chargement notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      loadNotifications();
    } catch (err) {
      console.error("Erreur marquage lecture:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
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
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <h1 className="text-3xl font-bold">Centre de notifications</h1>
        </div>

        {notifications.length === 0 ? (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <p className="text-base-content/70">Aucune notification pour le moment</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`card bg-base-100 shadow-xl ${
                  notif.read ? 'opacity-60' : 'border-l-4 border-primary'
                }`}
              >
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-lg">{notif.message}</p>
                      <p className="text-sm text-base-content/70 mt-2">
                        {new Date(notif.created_at).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="btn btn-sm btn-ghost"
                      >
                        Marquer comme lu
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}