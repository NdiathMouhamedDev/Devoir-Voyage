import { StrictMode } from "react";
import Navbar from "./miniComponents/Navbar";


export default function Header() {
    const menu = [
        { label: "Accueil", href: "/#accueil" },
        { label: "Événements", href: "#events" },
        { label: "Contact", href: "#contact" }
    ];
    return (
        <StrictMode>
            <header className="bg-blue-600 text-white p-4">
                <Navbar className="w-full" brand="Devoir" links={menu} userMenu="Bismillah" />
            </header>
        </StrictMode>
    );
} 