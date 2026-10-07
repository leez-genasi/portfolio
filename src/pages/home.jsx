import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import ProjectList from '../components/ProjectCard.jsx'
import photo from '../assets/img.png'
import toolIcon from '../assets/tool-placeholder.svg'
import '../index.css'
import './Home.css'

const W = 1920
const H = 1100
const EMAIL = ''
const LINKEDIN = 'https://www.linkedin.com/in/lee-charlette/?isSelfProfile=true'
const tools = [
    { name: 'Tool 1', src: toolIcon },
    { name: 'Tool 2', src: toolIcon },
    { name: 'Tool 3', src: toolIcon },
    { name: 'Tool 4', src: toolIcon },
]
const DOTS = [
    [63, 14.5, 0.4], [94.5, 24, 0.52], [111.5, 47, 0.64], [111.5, 81, 0.76],
    [94.5, 104.5, 0.88], [63, 114, 1], [31.5, 104.5, 0.88], [14.5, 81, 0.76],
    [14.5, 47, 0.64], [31.5, 24, 0.52],
]

const getScale = () => Math.min(
    1,
    1440 / W,
    document.documentElement.clientWidth / W,
    document.documentElement.clientHeight / H,
)

function Home() {
    const [scale, setScale] = useState(getScale)

    useEffect(() => {
        const updateScale = () => setScale(getScale())
        const rootResizeObserver = new ResizeObserver(updateScale)

        updateScale()
        rootResizeObserver.observe(document.getElementById('root'))
        window.addEventListener('resize', updateScale)
        return () => {
            rootResizeObserver.disconnect()
            window.removeEventListener('resize', updateScale)
        }
    }, [])

    return (
        <div>
            <header className="page">
                <div className="stage-wrap" style={{ width: W * scale, height: H * scale }}>
                    <div className="stage" style={{ transform: `scale(${scale})` }}>
                        <div className="grid" aria-hidden="true">
                            {Array.from({ length: 60 }, (_, i) => <span key={i} />)}
                        </div>

                        <img className="photo" src={photo} alt="Charlette" />

                        <p className="name">charlette’s</p>

                        <h1 className="title">
                            <span className="sr-only">portfolio</span>
                            <span aria-hidden="true">
                                <span className="t-p">p</span>
                                <svg className="t-o" viewBox="0 0 126 128.56" width="126" height="128.56">
                                    {DOTS.map(([cx, cy, op], i) => (
                                        <ellipse key={i} cx={cx} cy={cy} rx="14.45" ry="14.29" fill="currentColor" opacity={op} />
                                    ))}
                                </svg>
                                <span className="t-rt">rtfolio</span>
                                <span className="t-box">
                                    <span className="t-rt">rtfolio</span>
                                </span>
                            </span>
                        </h1>

                        <nav className="contact" aria-label="Contact">
                            <span className="reach">reach me:</span>
                            <a href={`mailto:charlee3279@gmail.com`} aria-label="Email me">
                                <img src="src\assets\MAIL.svg" />
                            </a>
                            <a href="https://www.linkedin.com/in/lee-charlette/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                                <img src="src\assets\LINKEDIN.svg" />
                            </a>
                        </nav>
                    </div>
                </div>
            </header>
            <main className="home-content">
                <section className="intro">
                    <p>A small, important tidbit you should know about me:</p>
                    <h6>I try things.</h6>
                    <p>You might call this being a jack of all trades, but I think <i>all</i> is a bit of a stretch because, well, I haven't tried everything (but I'm <i>trying</i>).</p>
                </section>
                <h2>Selected Works</h2>
                <Routes>
                    <Route path="/*" element={<ProjectList />} />
                </Routes>
            </main>
        </div>
    )
}

export default Home
