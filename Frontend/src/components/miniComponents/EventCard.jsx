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
    <div className="w-full max-w-sm">
      <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-base-300">
        <figure className="relative h-52 overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <CategoryBadge category={event.category} />
          </div>
        </figure>
        
        <div className="card-body p-5">
          <h2 className="card-title text-base-content line-clamp-2">
            {event.title}
          </h2>
          
          <p className="text-base-content/70 text-sm line-clamp-3 mb-4">
            {event.description}
          </p>
          
          <div className="card-actions flex-col gap-3">
            <div className="flex justify-between items-center w-full">
              <div className="badge badge-outline badge-primary gap-1">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-3.5 w-3.5" 
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
                {event.date}
              </div>
              
              <InterestToggleButton
                eventId={event.id}
                initialInterested={event.is_interested}
                initialCount={event.interested_count}
              />
            </div>
            
            <Link
              to={`/event/${event.id}`}
              className="btn btn-primary btn-sm w-full"
            >
              Voir plus
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}