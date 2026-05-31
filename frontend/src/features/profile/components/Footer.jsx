import { useProfileContext } from '../context/ProfileContext.jsx';

export function Footer() {
  const { data, loading, error } = useProfileContext();

  return (
    <footer
      id="contact"
      role="contentinfo"
      className="border-t border-[--color-border] bg-[--color-bg]"
    >
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-6 py-12">
        {loading && (
          <div data-testid="footer-skeleton" className="flex flex-col gap-3">
            <div className="h-5 w-48 animate-pulse rounded bg-[--color-surface]" />
            <div className="h-5 w-64 animate-pulse rounded bg-[--color-surface]" />
          </div>
        )}

        {!loading && error && (
          <p className="text-[--color-muted]">Contact info unavailable</p>
        )}

        {!loading && !error && data && (
          <>
            {data.email && (
              <a
                href={`mailto:${data.email}`}
                className="text-[--color-accent] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-bg]"
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
                      className="text-[--color-muted] transition-colors hover:text-[--color-accent] focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-bg]"
                    >
                      {s.platform}
                    </a>
                  </li>
                ))}
              </ul>
            )}

            <p className="text-sm text-[--color-muted]">
              © {new Date().getFullYear()} {data.fullName}
            </p>
          </>
        )}
      </div>
    </footer>
  );
}

export default Footer;
