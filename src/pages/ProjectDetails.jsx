import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProjectById } from '../data/projects.js';
import { getProjectImageList } from '../data/projectImages.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './ProjectDetails.css';

const projectFields = [
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

    const headerImage = getProjectImageList(project.img_header)[0]?.src;
    const otherImages = getProjectImageList(project.img_others);
    const hasDescription = typeof project.desc === 'string' && project.desc.trim().length > 0;

    return (
        <main className="project-details">
            <div className="project-details__nav">
                <Link className="project-details__back" to="/">Selected Works</Link>
                <FontAwesomeIcon className='project-details__arrow' icon={faChevronRight} size='s'/>
                <div className="project-details__current">{project.name}</div>
            </div>
            <header className="project-details__header">
                <h1>{project.name}</h1>
                <p className="project-details__position">{project.duration} {project.position}</p>
            </header>

            {headerImage && (
                <img
                    className="project-details__header-image"
                    src={headerImage}
                    alt={`${project.name} project`}
                />
            )}

            <section className={`project-details__section project-details__content${hasDescription ? '' : ' project-details__content--no-description'}`}>
                <section className="project-details__metadata" aria-labelledby="project-details-heading">
                    <h2 id="project-details-heading">Project Details</h2>
                    <dl className="project-details__fields">
                        {projectFields.map(({ key, label }) => (
                            <div className="project-details__field" key={key}>
                                <dt>{label}</dt>
                                <dd>{project[key] || 'Not provided yet'}</dd>
                            </div>
                        ))}
                    </dl>
                </section>

                {hasDescription && (
                    <section className="project-details__description-panel" aria-labelledby="project-description-heading">
                        <h2 id="project-description-heading">Description</h2>
                        <p className="project-details__description">{project.desc}</p>
                    </section>
                )}
            </section>

            {otherImages.length > 0 && (
                <section className="project-details__gallery" aria-label={`${project.name} images`}>
                    {otherImages.map(({ filename, src }, index) => (
                        <img
                            className="project-details__gallery-image"
                            key={`${filename}-${index}`}
                            src={src}
                            alt={`${project.name} project image ${index + 1}`}
                            loading="lazy"
                        />
                    ))}
                </section>
            )}
        </main>
    );
}

export default ProjectDetails;