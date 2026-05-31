import { Card } from '../../../shared/components/Card.jsx';
import { ErrorState } from '../../../shared/components/ErrorState.jsx';
import { useProfileContext } from '../context/ProfileContext.jsx';

function AboutSkeleton() {
  return (
    <div
      data-testid="about-skeleton"
      className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12"
    >
      <div className="flex flex-col gap-3">
        <div className="h-4 w-full animate-pulse rounded bg-surface" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-surface" />
        <div className="h-4 w-4/6 animate-pulse rounded bg-surface" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-surface" />
      </div>
      <div className="flex flex-col gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-surface" />
        ))}
      </div>
    </div>
  );
}

export function About() {
  const { data, loading, error, refetch } = useProfileContext();

  const paragraphs = data?.bio ? data.bio.split('\n\n') : [];
  const highlights = data?.highlight ?? [];

  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="mb-8 text-3xl font-bold text-text">About</h2>

      {loading && <AboutSkeleton />}

      {!loading && error && <ErrorState error={error} onRetry={refetch} />}

      {!loading && !error && data && (
        <div
          className={`grid grid-cols-1 gap-8 ${
            highlights.length > 0 ? 'md:grid-cols-2 md:gap-12' : ''
          }`}
        >
          {/* Bio — left column */}
          <div className="flex flex-col gap-4 text-muted">
            {paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          {/* Highlights — right column, stacked vertically */}
          {highlights.length > 0 && (
            <div className="flex flex-col gap-4">
              {highlights.map((h) => (
                <Card key={h.title}>
                  <h3 className="mb-2 text-lg font-semibold text-accent">
                    {h.title}
                  </h3>
                  <p className="text-muted">{h.description}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default About;
