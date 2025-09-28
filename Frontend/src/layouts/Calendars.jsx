import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { recupEvents } from "../services/functions";

export default function Calendars() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    recupEvents().then((data) => {
        if(!data) return;
        const formatted = data.map((h) => ({
            title: h.title,
            date: new Date(h.start_at).toISOString(),
      }));
      setEvents(formatted);
    });
  },[]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🗓️ Calendrier des Horaires</h2>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        locale="fr"
        height="80vh"
      />
    </div>
  );
}
