import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../data/projects.js';
import './ProjectList.css';

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
                    <article className="project-list__project">
                        <div className="project-list__heading">
                            <div>
                                <p className="project-list__eyebrow">
                                    {[project.category, project.event].filter(Boolean).join(' / ')}
                                </p>
                                <h2>
                                    <Link to={`/projects/${project.id}`}>{project.name}</Link>
                                </h2>
                            </div>
                            {project.duration && (
                                <span className="project-list__duration">{project.duration}</span>
                            )}
                        </div>

                        {(project.org || project.position) && (
                            <p className="project-list__credit">
                                {[project.position, project.org].filter(Boolean).join(' at ')}
                            </p>
                        )}

                        {project.desc && <p className="project-list__description">{project.desc}</p>}

                        {project.tools && (
                            <p className="project-list__tools">
                                <span>Tools</span> {project.tools}
                            </p>
                        )}
                    </article>
                </li>
            ))}
        </ul>
    );
}

export default ProjectList;
