import { StrictMode } from "react";
import Navbar from "./miniComponents/Navbar";

export default function Header() {
  const menu = [
    { label: "Accueil", href: "#accueil" },
    { label: "Événements", href: "#events" },
    { label: "Contact", href: "#contact" }
  ];

  return (
    <StrictMode>
      <header className="mb-20">
        <Navbar links={menu} />
      </header>
    </StrictMode>
  );
}