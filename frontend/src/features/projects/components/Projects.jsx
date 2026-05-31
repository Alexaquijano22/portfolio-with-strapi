import { ErrorState } from '../../../shared/components/ErrorState.jsx';
import { useProjects } from '../hooks/useProjects.js';
import { ProjectCard } from './ProjectCard.jsx';

function ProjectsSkeleton() {
  return (
    <div
      data-testid="projects-skeleton"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-72 animate-pulse rounded-xl bg-surface" />
      ))}
    </div>
  );
}

export function Projects() {
  const { data, loading, error, refetch } = useProjects();

  return (
    <section id="projects" className="mx-auto max-w-[1280px] px-6 py-16">
      <h2 className="mb-8 text-3xl font-bold text-text">Projects</h2>

      {loading && <ProjectsSkeleton />}

      {!loading && error && <ErrorState error={error} onRetry={refetch} />}

      {!loading && !error && data?.length === 0 && (
        <p className="text-muted">No projects listed yet.</p>
      )}

      {!loading && !error && data?.length > 0 && (
        <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Projects;
