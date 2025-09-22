import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'
import ToggleTheme from './compenents/ToggleTheme.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ToggleTheme />
  </StrictMode>,
)
