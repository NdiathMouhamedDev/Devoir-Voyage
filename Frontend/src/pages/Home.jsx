import Header from "../compenents/Header"
import Footer from "../compenents/Footer"
import MainHome from "../compenents/MainHome"
import MiniEvents from "../compenents/MiniEvents"
import Contact from "../compenents/Contact"

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