import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMiscProjects } from '../data/projects.js';
import { getProjectImageList } from '../data/projectImages.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './ProjectDetails.css';
import './MiscProject.css';

function MiscProject({ project }) {
    const [miscProjects, setMiscProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        async function loadMiscProjects() {
            try {
                const records = await getMiscProjects();
                if (!cancelled) setMiscProjects(records);
            } catch (loadError) {
                if (!cancelled) {
                    setError(loadError instanceof Error ? loadError.message : 'Unable to load miscellaneous projects.');
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        loadMiscProjects();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <main className="project-details misc-project">
            <div className="project-details__nav">
                <Link className="project-details__back" to="/">Selected Works</Link>
                <FontAwesomeIcon className='project-details__arrow' icon={faChevronRight} size='s'/>
                <div className="project-details__current">{project.name}</div>
            </div>

            <header className="project-details__header">
                <h1>{project.name}</h1>
                {project.desc && <p className="misc-project__description">{project.desc}</p>}
            </header>

            {isLoading && <p className="project-details__status" role="status">Loading projects...</p>}
            {error && <p className="project-details__status" role="alert">Unable to load projects: {error}</p>}
            {!isLoading && !error && miscProjects.length === 0 && (
                <p className="misc-project__empty">No miscellaneous projects to display yet.</p>
            )}

            {!isLoading && !error && miscProjects.length > 0 && (
                <section className="misc-project__gallery" aria-label={`${project.name} gallery`}>
                    {miscProjects.map((miscItem) => {
                        const image = getProjectImageList(miscItem.img)[0];

                        return (
                            <article className="misc-project__item" key={miscItem.id}>
                                <div className="misc-project__copy">
                                    <h3>{miscItem.title}</h3>
                                    {miscItem.year && <p className="misc-project__year">{miscItem.year}</p>}
                                    {image && (
                                    <img
                                        className="misc-project__image"
                                        src={image.src}
                                        alt={miscItem.title}
                                        loading="lazy"
                                    />
                                )}
                                    {miscItem.desc && <p className="misc-project__item-description">{miscItem.desc}</p>}
                                    {miscItem.tools && 
                                    <dl className="misc-project__item-tools" border="1">
                                        <dt>Tools</dt>
                                        <dd>{miscItem.tools}</dd>
                                    </dl>}
                                </div>
                            </article>
                        );
                    })}
                </section>
            )}
        </main>
    );
}

export default MiscProject;
