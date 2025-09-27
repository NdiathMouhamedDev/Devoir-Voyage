import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import EventDetails from "./layouts/EventDetails";
import HourlyDetail from "./layouts/HourlyDetail";
import Profile from "./pages/Profile";
import VerifyEmail from "./layouts/VerifyEmail";
import AdminVerificationDebug from "./pages/AdminVerificationDebug";
import Hourly from "./pages/Hourly";
import InscriptionForm from "./layouts/InscriptionForm";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Events" element={<Events />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/hourly" element={<Hourly />} />
        <Route path="/hourly/:id" element={<HourlyDetail />} />
        <Route path="/hourly/:id/inscrire" element={<InscriptionForm />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/debug" element={<AdminVerificationDebug />} />
      </Routes>
    </BrowserRouter>
  );
}
