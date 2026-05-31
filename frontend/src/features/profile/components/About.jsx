import { Card } from '../../../shared/components/Card.jsx';
import { ErrorState } from '../../../shared/components/ErrorState.jsx';
import { useProfileContext } from '../context/ProfileContext.jsx';

function AboutSkeleton() {
  return (
    <div data-testid="about-skeleton" className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="h-4 w-full animate-pulse rounded bg-[--color-surface]" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-[--color-surface]" />
        <div className="h-4 w-4/6 animate-pulse rounded bg-[--color-surface]" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-[--color-surface]" />
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
    <section id="about" className="mx-auto max-w-[1280px] px-6 py-16">
      <h2 className="mb-8 text-3xl font-bold text-[--color-text]">About</h2>

      {loading && <AboutSkeleton />}

      {!loading && error && <ErrorState error={error} onRetry={refetch} />}

      {!loading && !error && data && (
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 text-[--color-muted]">
            {paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          {highlights.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {highlights.map((h) => (
                <Card key={h.title}>
                  <h3 className="mb-2 text-lg font-semibold text-[--color-text]">
                    {h.title}
                  </h3>
                  <p className="text-[--color-muted]">{h.description}</p>
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
