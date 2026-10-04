import { useEffect, useState } from 'react';
import { Link, useParams, Routes } from 'react-router-dom';
import { getProjectById } from '../data/projects.js';
import './details.css';

const projectFields = [
    { key: 'event', label: 'Event' },
    { key: 'committee', label: 'Committee' },
    { key: 'position', label: 'Position' },
    { key: 'org', label: 'Organization' },
    { key: 'duration', label: 'Duration' },
    { key: 'category', label: 'Category' },
    { key: 'role', label: 'Role' },
    { key: 'collaboration', label: 'Collaboration' },
    { key: 'tools', label: 'Tools' },
];

function ProjectDetails() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loadedId, setLoadedId] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        async function loadProject() {
            try {
                // The URL's /projects/:id parameter selects the SQLite row to display.
                const record = await getProjectById(id);
                if (!cancelled) {
                    setProject(record);
                    setError('');
                }
            } catch (loadError) {
                if (!cancelled) {
                    setError(loadError instanceof Error ? loadError.message : 'Unable to load project.');
                }
            } finally {
                if (!cancelled) setLoadedId(id);
            }
        }

        loadProject();

        return () => {
            cancelled = true;
        };
    }, [id]);

    if (loadedId !== id) {
        return <p className="project-details__status" role="status">Loading project...</p>;
    }

    if (error) {
        return <p className="project-details__status" role="alert">Unable to load project: {error}</p>;
    }

    if (!project) {
        return (
            <main className="project-details">
                <p className="project-details__eyebrow">Project not found</p>
                <Link className="project-details__back" to="/">Back to selected works</Link>
            </main>
        );
    }

    return (
        <main className="project-details">
            <Link className="project-details__back" to="/">&larr; Selected works</Link>
            <header className="project-details__header">
                <p className="project-details__eyebrow">
                    {[project.category, project.event].filter(Boolean).join(' / ') || 'Selected work'}
                </p>
                <h1>{project.name}</h1>
                {project.duration && <p className="project-details__duration">{project.duration}</p>}
            </header>

            <section className="project-details__section" aria-labelledby="project-overview-heading">
                <h2 id="project-overview-heading">Overview</h2>
                {/* Edit this field list to change which database columns appear on the page. */}
                <dl className="project-details__fields">
                    {projectFields.map(({ key, label }) => (
                        <div className="project-details__field" key={key}>
                            <dt>{label}</dt>
                            <dd>{project[key] || 'Not provided yet'}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            <section className="project-details__section" aria-labelledby="project-description-heading">
                <h2 id="project-description-heading">Description</h2>
                {/* Replace this placeholder with a richer layout if the DB adds media or links. */}
                <p className="project-details__description">
                    {project.desc || 'Add a project description in the database to show it here.'}
                </p>
            </section>
        </main>
    );
}

export default ProjectDetails;