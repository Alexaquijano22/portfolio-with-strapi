import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { href: '#hero', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

const navLinkClass =
  'rounded text-muted transition-colors hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-[1280px] items-center justify-center px-6 py-4"
      >
        <ul className="flex flex-wrap justify-center gap-4 text-sm">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a href={href} className={navLinkClass}>
                {label}
              </a>
            </li>
          ))}
          <li>
            <Link to="/products" className={navLinkClass}>
              Products
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
