import { Link } from "react-router-dom";
import EventCard from "./miniCompenents/EventCard";

export default function Events() {
    return (
            <div id="events" style={{maxWidth: "99vw", height:"99vh" }} className="flex flex-col justify-center items-center p-4 gap-4">
                <div>
                    <h2 className="text-center" >Événements à venir</h2>
                </div>
                <div style={{maxHeight:"70vh", maxWidth:"96vw"}} className="carousel rounded-box">
                    <EventCard />
                    <EventCard />
                    <EventCard />
                    <EventCard />
                    <EventCard />
                </div>
                <div>
                    <button  style={{marginTop:"1rem"}} className="btn btn-primary"><Link className="link" aria-current="page" to="/login">Voir Plus</Link></button>
                </div>
            </div>
    )
}