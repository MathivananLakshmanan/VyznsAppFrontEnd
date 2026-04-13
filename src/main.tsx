import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Keep Render backend alive - ping every 10 mins
const ping = () => fetch("https://vyznsappspringbootbackendhostinginrender.onrender.com/auth/ping").catch(() => {});
ping();
setInterval(ping, 10 * 60 * 1000);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
