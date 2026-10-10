import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home.jsx'
import ProjectList from './components/ProjectCard.jsx'
import ProjectDetails from './pages/ProjectDetails.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/projects/:id" element={<ProjectDetails />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)