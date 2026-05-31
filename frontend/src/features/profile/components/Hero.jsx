import { ErrorState } from '../../../shared/components/ErrorState.jsx';
import { useProfileContext } from '../context/ProfileContext.jsx';

function HeroSkeleton() {
  return (
    <div
      data-testid="hero-skeleton"
      className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 md:flex-row-reverse md:gap-12"
    >
      <div className="flex w-full justify-center md:w-1/2">
        <div className="aspect-square w-56 animate-pulse rounded-full bg-surface sm:w-72 md:w-full md:max-w-[440px]" />
      </div>
      <div className="flex w-full max-w-md flex-col items-center gap-4 md:w-1/2 md:items-start">
        <div className="h-10 w-3/4 animate-pulse rounded bg-surface" />
        <div className="h-6 w-1/2 animate-pulse rounded bg-surface" />
        <div className="h-4 w-full animate-pulse rounded bg-surface" />
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
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 md:flex-row-reverse md:items-center md:gap-12">
          {data.avatar?.url && (
            <div className="flex w-full justify-center md:w-1/2">
              <img
                src={data.avatar.url}
                alt={data.fullName}
                className="aspect-square w-56 rounded-full object-cover sm:w-72 md:w-full md:max-w-[440px]"
              />
            </div>
          )}
          <div className="flex w-full flex-col items-center gap-4 text-center md:w-1/2 md:items-start md:text-left">
            <h1 className="text-4xl font-bold text-text md:text-5xl">
              {data.fullName}
            </h1>
            <h2 className="text-xl font-medium text-accent md:text-2xl">
              {data.role}
            </h2>
            <p className="text-muted">{data.tagline}</p>
            <a
              href="#projects"
              className="mt-2 inline-block w-fit rounded-lg bg-accent px-5 py-2.5 font-medium text-bg transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
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
