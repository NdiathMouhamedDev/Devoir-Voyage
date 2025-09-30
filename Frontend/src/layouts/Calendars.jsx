// Calendars.jsx
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { recupEvents } from "../services/functions";

export default function Calendars() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await recupEvents();
        if (!data) return;
        
        const formatted = data.map((event) => ({
          id: event.id,
          title: event.title,
          start: new Date(event.start_at || event.date).toISOString(),
          end: event.end_at ? new Date(event.end_at).toISOString() : undefined,
          backgroundColor: getEventColor(event.category),
          borderColor: getEventColor(event.category),
          extendedProps: {
            description: event.description,
            location: event.location,
          },
        }));
        
        setEvents(formatted);
      } catch (error) {
        console.error("Erreur lors du chargement des événements:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadEvents();
  }, []);

  const getEventColor = (category) => {
    const colors = {
      religious: 'oklch(72% 0.219 149.579)', // primary
      cultural: 'oklch(38% 0.063 188.416)',  // secondary
      social: 'oklch(60% 0.25 292.717)',     // accent
      educational: 'oklch(68% 0.169 237.323)', // info
      default: 'oklch(72% 0.219 149.579)',   // primary
    };
    return colors[category] || colors.default;
  };

  const handleEventClick = (info) => {
    const event = info.event;
    window.location.href = `/event/${event.id}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h2 className="card-title text-2xl">Calendrier des Événements</h2>
            </div>

            <div className="fullcalendar-wrapper">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                locale="fr"
                height="auto"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,dayGridWeek'
                }}
                buttonText={{
                  today: "Aujourd'hui",
                  month: 'Mois',
                  week: 'Semaine',
                }}
                eventClick={handleEventClick}
                eventDisplay="block"
                displayEventTime={false}
                dayMaxEvents={3}
                moreLinkText="autres"
                noEventsContent="Aucun événement"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}