import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// On a prerendered page the entrance animations already played in the
// static HTML — this class disables them so the React takeover is seamless.
if (window.__PRELOADED_API__) {
  document.documentElement.classList.add('preloaded')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
