import { Route, Routes } from 'react-router-dom'
import '../index.css';
import ProjectList from '../components/ProjectCard.jsx'


function Home() {
    return (
        <div>
            <section className="intro">
                <p>A small, important tidbit you should know about me:</p>
                <h6>I try things.</h6>
                <p>You might call this being a jack of all trades, but I think <i>all</i> is a bit of a stretch because, well, I haven't tried everything (but I'm <i>trying</i>).</p>
            </section>
            <h2>Selected Works</h2>
            <Routes>
            <Route path="/*" element={<ProjectList />} />
            </Routes>
        </div>
    )
}

export default Home;