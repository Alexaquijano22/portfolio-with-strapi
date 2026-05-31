import { ErrorState } from '../../../shared/components/ErrorState.jsx';
import { useProfileContext } from '../context/ProfileContext.jsx';

function HeroSkeleton() {
  return (
    <div
      data-testid="hero-skeleton"
      className="flex w-full max-w-[1280px] flex-col items-center gap-8 md:flex-row-reverse md:justify-center"
    >
      <div className="h-40 w-40 animate-pulse rounded-full bg-[--color-surface]" />
      <div className="flex w-full max-w-md flex-col gap-4">
        <div className="h-10 w-3/4 animate-pulse rounded bg-[--color-surface]" />
        <div className="h-6 w-1/2 animate-pulse rounded bg-[--color-surface]" />
        <div className="h-4 w-full animate-pulse rounded bg-[--color-surface]" />
      </div>
    </div>
  );
}

export function Hero() {
  const { data, loading, error, refetch } = useProfileContext();

  return (
    <section
      id="hero"
      className="flex min-h-screen items-center justify-center px-6 py-16"
    >
      {loading && <HeroSkeleton />}

      {!loading && error && <ErrorState error={error} onRetry={refetch} />}

      {!loading && !error && data && (
        <div className="flex w-full max-w-[1280px] flex-col items-center gap-8 text-center md:flex-row-reverse md:justify-center md:text-left">
          {data.avatar?.url && (
            <img
              src={data.avatar.url}
              alt={data.fullName}
              className="h-40 w-40 rounded-full object-cover md:h-56 md:w-56"
            />
          )}
          <div className="flex max-w-xl flex-col gap-4">
            <h1 className="text-4xl font-bold text-[--color-text] md:text-5xl">
              {data.fullName}
            </h1>
            <h2 className="text-xl font-medium text-[--color-accent] md:text-2xl">
              {data.role}
            </h2>
            <p className="text-[--color-muted]">{data.tagline}</p>
            <a
              href="#projects"
              className="mt-2 inline-block w-fit rounded-lg bg-[--color-accent] px-5 py-2.5 font-medium text-[--color-bg] transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-bg]"
            >
              View my work
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

export default Hero;
