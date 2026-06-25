import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import LandingPage from './components/LandingPage.jsx'
import { project } from './data/project.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LandingPage project={project} />
  </React.StrictMode>,
)
