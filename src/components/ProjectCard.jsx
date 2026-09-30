import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../data/projects.js';
import './ProjectCard.css';

function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        async function loadProjects() {
            try {
                const records = await getProjects();
                if (!cancelled) setProjects(records);
            } catch (loadError) {
                if (!cancelled) {
                    setError(loadError instanceof Error ? loadError.message : 'Unable to load projects.');
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        loadProjects();
        return () => {
            cancelled = true;
        };
    }, []);

    if (isLoading) {
        return <p className="project-list__status" role="status">Loading projects...</p>;
    }

    if (error) {
        return <p className="project-list__status" role="alert">Unable to load projects: {error}</p>;
    }

    if (projects.length === 0) {
        return <p className="project-list__empty">No projects to display yet.</p>;
    }

    return (
        <ul className="project-list">
            {projects.map((project) => (
                <li className="project-list__item" key={project.id}>
                    <article className="project-card">
                        <div className="project-card__image" aria-hidden="true" />
                        <div className="project-card__panel">
                            <div className="project-card__copy">
                                <h2 className="project-card__org">
                                    <Link to={`/projects/${project.id}`}>
                                        {project.org || 'Organization'}
                                    </Link>
                                </h2>
                                <p className="project-card__event">{project.event || 'Event name'}</p>
                            </div>
                        </div>
                    </article>
                </li>
            ))}
        </ul>
    );
}

export default ProjectList;
