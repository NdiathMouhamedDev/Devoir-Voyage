import InterestToggleButton from "./InterestToggleButton";

export default function EventCard({ 
  event = { 
    id: 0, 
    title: "title", 
    date: "date", 
    description: "description", 
    image: "image", 
    is_user_interested: false,
    interested_count: 0
  } 
}) {
  return (
    <div style={{ maxWidth: "30rem", maxHeight: "70rem" }}>
      <div className="carousel-item card bg-base-300 shadow-sm" style={{ margin:"0 .5rem" }}>
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
              <div className="badge badge-secondary">NEW</div>
            </h2>
          </div>
          <p>{event.description}</p>
          <div style={{ justifyContent:"space-between" }} className="card-actions">
            <div className="badge badge-outline">{event.date}</div>
            
            {/* ✅ Bouton toggle corrigé */}
            <InterestToggleButton eventId={event.id} 
  initialInterested={event.is_interested} 
  initialCount={event.interested_count}/>
          </div>
        </div>
      </div>
    </div>
  );
}
