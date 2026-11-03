import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
// Tailwind first, on purpose. Its utilities serve the new works-wheel
// component only; loading the hand-written editorial sheets after it means
// that on any rule they ever contest, the site's own CSS still wins.
import './styles/tailwind.css'
import './styles/global.css'
import './styles/hero.css'
import './styles/proof.css'
import './styles/transformations.css'
import './styles/reviews.css'
import './styles/about.css'
import './styles/enquiry.css'
// The floating button. Defines --fab-size and --fab-gap, which footer.css
// also uses to keep the end of the footer clear of the button.
import './styles/whatsapp.css'
import './styles/footer.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
