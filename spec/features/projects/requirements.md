# Projects — Requirements

> Scope: the Projects section, driven by the Project collection type.
> Data contract: see `spec/overview.md §3.3`. Engineering rules: see `spec/constitution.md`.
> Prerequisite: `foundation` feature complete.

---

## 1. Purpose

Display all projects fetched from the Strapi Projects collection as a responsive card grid.
Each card presents the project's cover image, title, description, technology badges, and
optional live/repo links.

---

## 2. Section Behaviour

### 2.1 Layout
- Rendered as `<section id="projects">` within `<main>`.
- Section heading: "Projects" (or a designer-chosen label).
- Projects rendered in the order returned by the API (no client-side sorting).

### 2.2 Project Card
Each project card contains:
- **Cover image**: `<img src={absoluteCoverUrl} alt={title} />`.
- **Title**: `<h3>{title}</h3>`.
- **Description**: `<p>{description}</p>`.
- **Tech stack**: each `techStack[].name` rendered as a `<Badge>` (muted variant).
- **Live URL link**: `<a href={liveUrl} target="_blank" rel="noopener noreferrer">Live</a>` —
  **omit the element entirely** when `liveUrl` is `null` or absent.
- **Repo URL link**: `<a href={repoUrl} target="_blank" rel="noopener noreferrer">Repo</a>` —
  **omit the element entirely** when `repoUrl` is `null` or absent.

### 2.3 Loading State
A grid of skeleton `<Card>` placeholders that matches the grid layout.
Skeleton height should approximate a real project card.

### 2.4 Error State
`<ErrorState error={error} onRetry={refetch} />` centered in the section.

### 2.5 Empty State
If the API returns an empty array: render the message **"No projects listed yet."** inside
the section. Do not render the grid.

---

## 3. Responsive Rules

| Breakpoint | Grid columns |
|---|---|
| Mobile (default) | 1 column |
| `sm:` ≥ 640 px | 2 columns |
| `lg:` ≥ 1024 px | 3 columns |

Cards in the grid are equal height within each row (CSS grid `align-items: stretch`).

---

## 4. Accessibility
- Cover image `<img alt={title}>`.
- External links include `rel="noopener noreferrer"` and `target="_blank"`.
- Section has a visible heading (`<h2>`) for screen reader navigation.
- Tech stack badges are read as text by screen readers (no `aria-hidden`).
