import { Route, Routes } from 'react-router-dom'
import '../index.css';
import ProjectList from '../components/ProjectCard.jsx'


function Home() {
    return (
        <div>
            <div className="intro">
            </div>
            <h2>Selected Works</h2>
            <Routes>
            <Route path="/*" element={<ProjectList />} />
            </Routes>
        </div>
    )
}

export default Home;