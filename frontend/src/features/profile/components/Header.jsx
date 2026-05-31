import { Spinner } from '../../../shared/components/Spinner.jsx';
import { useProfileContext } from '../context/ProfileContext.jsx';

const NAV_LINKS = [
  { href: '#hero', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

export function Header() {
  const { data, loading } = useProfileContext();

  return (
    <header className="sticky top-0 z-50 border-b border-[--color-border] bg-[--color-bg]/90 backdrop-blur">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-6 py-4"
      >
        <span className="text-lg font-bold text-[--color-text]">
          {loading ? <Spinner className="h-5 w-5" /> : data?.fullName}
        </span>
        <ul className="flex flex-wrap gap-4 text-sm">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className="rounded text-[--color-muted] transition-colors hover:text-[--color-accent] focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-bg]"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
