import { useState, useEffect } from "react";
import { recupEvents } from "../services/functions";
import EventCard from "../compenents/miniCompenents/EventCard";
import CategoryFilter from "../components/CategoryFilter";

const categories = {
  Religious: "Religieux",
  transport: "Transport",
  health: "Santé",
  security: "Securité",
  accommodation: "Hébergement",
};

export default function LoadEvents() {
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const allEvents = await recupEvents();
      setEvents(allEvents);
    } catch (err) {
      console.error("Erreur lors du chargement des événements:", err);
    }
  };

  const filteredEvents = selectedCategory
    ? events.filter(event => event.category === selectedCategory)
    : events;

  return (
    <div className="space-y-6">
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <h2 className="text-2xl font-bold">
        📅 {
          selectedCategory ? (
            ['transport', 'accommodation'].includes(selectedCategory)
              ? `Activités ${categories[selectedCategory]}`
              : ['security', 'health'].includes(selectedCategory)
                ? `Infos ${categories[selectedCategory]}`
                : `Événements ${categories[selectedCategory]}`
          ) : 'Tous les événements'
        }
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <p className="text-gray-500">Aucun événement trouvé.</p>
        )}
      </div>
    </div>
  );
}
