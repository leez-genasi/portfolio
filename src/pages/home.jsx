import { Route, Routes } from 'react-router-dom'
import '../index.css';
import ProjectList from '../components/ProjectCard.jsx'
import ProjectDetails from './ProjectDetails.jsx'

function Home() {
    return (
        <Routes>
            <Route path="/" element={<ProjectList />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
        </Routes>
    )
}

export default Home;