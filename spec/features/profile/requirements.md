# Profile — Requirements

> Scope: Header, Hero, About, and Footer — all driven by the Profile single type.
> Data contract: see `spec/overview.md §3.1`. Engineering rules: see `spec/constitution.md`.
> Prerequisite: `foundation` feature complete.

---

## 1. Purpose

A single API call fetches the Profile object. Its data is shared across **four** sections via
a React Context so the network request is made exactly once. The four sections are:

| Section | Rendered as | Profile fields consumed |
|---|---|---|
| Header | `<header>` (sticky) | `fullName` |
| Hero | First `<section>` in `<main>` | `fullName`, `role`, `tagline`, `avatar` |
| About | Second `<section>` in `<main>` | `bio`, `highlight[]` |
| Footer | `<footer>` | `socialLink[]`, `email` |

---

## 2. Section Behaviour

### 2.1 Header
- Sticky at the top of the viewport.
- Displays `fullName` as the logo/brand text.
- Renders navigation anchor links to `#hero`, `#about`, `#skills`, `#projects`, `#contact`.
- **Loading**: shows a `<Spinner />` or a skeleton block in place of `fullName`.
- **Error**: omits the name text silently (Header must still render; navigation remains usable).
- Nav links are keyboard-reachable with visible focus rings.

### 2.2 Hero
- Full-viewport-height section (`min-h-screen`).
- Displays:
  - `avatar` image (`<img>` with `alt={fullName}`; uses the absolute URL from the service).
  - `fullName` as `<h1>`.
  - `role` as `<h2>`.
  - `tagline` as `<p>`.
  - A "View my work" CTA button/anchor styled with `--color-accent`, linking to `#projects`.
- **Loading**: skeleton blocks sized to approximate the avatar, h1, h2, and tagline.
- **Error**: `<ErrorState error={error} onRetry={refetch} />`.

### 2.3 About
- Displays:
  - `bio`: split on `\n\n`; each segment rendered as a separate `<p>` element.
  - `highlight[]`: each entry rendered as a `<Card>` showing `title` and `description`.
- **Loading**: skeleton lines for bio paragraphs + ghost cards for highlights.
- **Error**: `<ErrorState error={error} onRetry={refetch} />`.
- **Empty highlights**: omit the highlight grid gracefully; still render bio.

### 2.4 Footer
- Renders:
  - `email` as `<a href="mailto:{email}">`.
  - `socialLink[]`: each as `<a href={url} target="_blank" rel="noopener noreferrer">` with
    `platform` as the link label.
  - Copyright line: `© {currentYear} {fullName}`.
- **Loading**: skeleton blocks for the links area.
- **Error**: shows "Contact info unavailable" text (no retry needed in the footer).
- **Empty socialLink[]**: omit the social links block; still render the email link.

---

## 3. SEO
- `seoDescription` from the Profile object is injected into `<meta name="description" content="…">` in `index.html` at runtime (via `document.querySelector` in `App.jsx`).
- It is **never** rendered in any visible section.

---

## 4. Responsive Rules

| Breakpoint | Hero layout | About layout |
|---|---|---|
| Mobile (default) | Avatar centered above text stack | Bio text full-width; highlights in 1-column grid |
| `md:` ≥ 768 px | Avatar beside text (side-by-side) | Highlights in 2-column grid |
| `lg:` ≥ 1024 px | Generous whitespace; content max-width 1280 px | Highlights in 3-column grid |

Header and Footer are single-column on all breakpoints; max-width container centers content.

---

## 5. Accessibility
- Hero `<h1>` contains `fullName`; it is the page's primary heading.
- Avatar `<img alt={fullName}>`.
- Social links: `aria-label` if the link text alone is ambiguous.
- Footer `<footer role="contentinfo">`.
