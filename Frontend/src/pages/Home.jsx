import Header from "../components/Header"
import Footer from "../components/Footer"
import MainHome from "../components/MainHome"
import MiniEvents from "../components/MiniEvents"
import Contact from "../components/Contact"
import { useEffect } from "react"
import MinNav from "../components/miniComponents/MinNav"

export default function MainLayout({ className }) {
    useEffect(() => {
        document.title = "Touba Events";
      }, []);
    return (
        <div className={`${className} flex flex-col min-h-screen`}>
            <Header />
            <MainHome />
            <MiniEvents/>
            <Contact/>
            <Footer />
            <MinNav/>
        </div>
    );
}