import Header from "../components/Header"
import Footer from "../components/Footer"
import MainHome from "../components/MainHome"
import MiniEvents from "../components/MiniEvents"
import Contact from "../components/Contact"

export default function MainLayout({ className }) {
    return (
        <div className={`${className} flex flex-col min-h-screen`}>
            <Header />
            <MainHome />
            <MiniEvents/>
            <Contact/>
            <Footer />
        </div>
    );
}