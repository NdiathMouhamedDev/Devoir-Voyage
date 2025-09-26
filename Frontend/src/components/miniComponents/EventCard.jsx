import InterestToggleButton from "./InterestToggleButton";
import CategoryBadge from "./CategoryBadge";
import { Link } from "react-router-dom";

export default function EventCard({
  event = {
    id: 0,
    title: "title",
    date: "date",
    description: "description",
    image: "image",
    category: "other",
    is_user_interested: false,
    interested_count: 0
  }
}) {
  return (
    <div style={{ maxWidth: "30rem", maxHeight: "70rem" }}>
      <div className="carousel-item card bg-base-300 shadow-sm" style={{ margin: "0 .5rem" }}>
        <figure style={{ width: "25rem", maxHeight: "13rem", height: "13rem" }}>
          <img
            src={event.image}
            alt={event.title}
          />
        </figure>
        <div className="card-body">
          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
            <h2 className="card-title" style={{ flex: 1 }}>
              {event.title}
              <CategoryBadge category={event.category} />
            </h2>
          </div>
          <p>{event.description}</p>
          <div className="card-actions flex flex-col gap-2">
            <div className="flex justify-between items-center w-full">
              <div className="badge badge-outline">{event.date}</div>
              <InterestToggleButton
                eventId={event.id}
                initialInterested={event.is_interested}
                initialCount={event.interested_count}
              />
            </div>
            <Link
              to={`/event/${event.id}`}
              className="btn btn-primary w-full"
            >
              Voir plus
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
