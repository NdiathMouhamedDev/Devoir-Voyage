import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import "./styles/customCalendar.css"
import App from './App.jsx'
import ToggleTheme from './components/ToggleTheme.jsx'
import { AuthProvider } from './layouts/UseAuth';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <ToggleTheme />
    </AuthProvider>
  </StrictMode>,
)
