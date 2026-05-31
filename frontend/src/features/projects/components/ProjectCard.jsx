import { Card } from '../../../shared/components/Card.jsx';
import { Badge } from '../../../shared/components/Badge.jsx';

const linkClass =
  'text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg';

// Single project card. coverImage and the live/repo links are all rendered
// conditionally — when their value is null the element is omitted entirely (no
// broken image, no empty anchor). `mt-auto` on the links row keeps links pinned
// to the card bottom so rows stay equal height.
export function ProjectCard({ project }) {
  const { title, description, coverImage, techStack = [], liveUrl, repoUrl } = project;

  return (
    <Card className="flex h-full flex-col gap-3">
      {coverImage && (
        <img
          src={coverImage.url}
          alt={title}
          className="aspect-video w-full rounded-lg object-cover"
        />
      )}

      <h3 className="text-lg font-semibold text-text">{title}</h3>
      <p className="text-muted">{description}</p>

      {techStack.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {techStack.map((t) => (
            <Badge key={t.name} variant="accent">
              {t.name}
            </Badge>
          ))}
        </div>
      )}

      {(liveUrl || repoUrl) && (
        <div className="mt-auto flex gap-4 pt-2">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Live demo of ${title} (opens in a new tab)`}
              className={linkClass}
            >
              Live ↗
            </a>
          )}
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Source repository for ${title} (opens in a new tab)`}
              className={linkClass}
            >
              Repo ↗
            </a>
          )}
        </div>
      )}
    </Card>
  );
}

export default ProjectCard;
