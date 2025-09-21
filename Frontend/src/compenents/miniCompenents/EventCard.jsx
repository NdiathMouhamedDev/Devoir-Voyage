
import { useState } from "react";

export default function EventCard({ event = {title: "title", date: "date", description: "description", image: "image"} }) {
    const [interesse, setInteresse] = useState(true);

    const handleToggle = () => setInteresse((v) => !v);

    return (
        <div style={{maxWidth: "30rem", maxHeight: "70rem"}}>
            <div className="carousel-item card bg-base-300 shadow-sm" style={{margin:"0 .5rem"}}>
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
                    <div style={{justifyContent:"space-between"}} className="card-actions ">
                        <div className="badge badge-outline">{event.date}</div>
                        <button type="button" className="badge badge-outline btn" onClick={handleToggle}>
                            {interesse ? "Intéressé" : "Désintéressé"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


<div style={{position:"absolute" }} className="carousel rounded-box">
                <div className="carousel-item">
                    <img
                        src="https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp"
                        alt="Burger" />
                </div>
                <div className="carousel-item">
                    <img
                        src="https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp"
                        alt="Burger" />
                </div>
                <div className="carousel-item">
                    <img
                        src="https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp"
                        alt="Burger" />
                </div>
                <div className="carousel-item">
                    <img
                        src="https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp"
                        alt="Burger" />
                </div>
                <div className="carousel-item">
                    <img
                        src="https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp"
                        alt="Burger" />
                </div>
                <div className="carousel-item">
                    <img
                        src="https://img.daisyui.com/images/stock/photo-1559181567-c3190ca9959b.webp"
                        alt="Burger" />
                </div>
                <div className="carousel-item">
                    <img
                        src="https://img.daisyui.com/images/stock/photo-1601004890684-d8cbf643f5f2.webp"
                        alt="Burger" />
                </div>
            </div>