import { useProfileContext } from '../context/ProfileContext.jsx';

export function Footer() {
  const { data, loading, error } = useProfileContext();

  return (
    <footer
      id="contact"
      role="contentinfo"
      className="border-t border-border bg-bg"
    >
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-6 py-12">
        {loading && (
          <div data-testid="footer-skeleton" className="flex flex-col gap-3">
            <div className="h-5 w-48 animate-pulse rounded bg-surface" />
            <div className="h-5 w-64 animate-pulse rounded bg-surface" />
          </div>
        )}

        {!loading && error && (
          <p className="text-muted">Contact info unavailable</p>
        )}

        {!loading && !error && data && (
          <>
            {data.email && (
              <a
                href={`mailto:${data.email}`}
                className="text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                {data.email}
              </a>
            )}

            {data.socialLink?.length > 0 && (
              <ul className="flex flex-wrap gap-4">
                {data.socialLink.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${s.platform} (opens in a new tab)`}
                      className="text-muted transition-colors hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                    >
                      {s.platform}
                    </a>
                  </li>
                ))}
              </ul>
            )}

            <p className="text-sm text-muted">
              © {new Date().getFullYear()} {data.fullName}
            </p>
          </>
        )}
      </div>
    </footer>
  );
}

export default Footer;
