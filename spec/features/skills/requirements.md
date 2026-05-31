# Skills — Requirements

> Scope: the Skills section, driven by the Skill collection type.
> Data contract: see `spec/overview.md §3.2`. Engineering rules: see `spec/constitution.md`.
> Prerequisite: `foundation` feature complete.

---

## 1. Purpose

Display all skills fetched from the Strapi Skills collection in a responsive grid, grouped
and filterable by category. Handle the nullable `icon` field gracefully.

---

## 2. Section Behaviour

### 2.1 Layout
- Rendered as `<section id="skills">` within `<main>`.
- Section heading: "Skills" (or a designer-chosen label).
- Category filter buttons above the grid: **All | Frontend | Backend | Tools**.
- Skill grid below the filters.

### 2.2 Category Filtering
- Default active filter: **All** (shows every skill).
- Clicking a category button filters the grid to skills whose `category` matches exactly.
- Filtering is **client-side only** — no additional API call is made.
- The active filter button is visually distinguished (accent color background or underline).

### 2.3 Skill Card
Each skill in the grid renders as a card containing:
- **Icon** (when `icon` is not null): `<img src={absoluteIconUrl} alt={name} />`.
- **Icon fallback** (when `icon` is null): a neutral placeholder — a generic icon SVG,
  the skill initial in a styled circle, or simply no icon element. Must **not** render a
  broken-image artifact or throw an error.
- **Name**: the skill's `name` field as text.
- **Category badge**: rendered using the `<Badge>` primitive with accent variant.

### 2.4 Loading State
A grid of skeleton cards (`animate-pulse`) that matches the expected grid layout.
The filter buttons are also shown in a skeleton/disabled state.

### 2.5 Error State
`<ErrorState error={error} onRetry={refetch} />` centered in the section.

### 2.6 Empty State
If the API returns an empty array: render the message **"No skills listed yet."** inside the
section. Do not render the filter buttons or grid.

---

## 3. Responsive Rules

| Breakpoint | Grid columns |
|---|---|
| Mobile (default) | 2 columns |
| `sm:` ≥ 640 px | 3 columns |
| `lg:` ≥ 1024 px | 4 columns |

Filter buttons wrap naturally on narrow viewports; no horizontal scroll.

---

## 4. Accessibility
- Filter buttons are `<button>` elements (not `<div>` or `<span>`).
- Active filter button has `aria-pressed="true"`; inactive buttons have `aria-pressed="false"`.
- Skill icon `<img>` uses `alt={name}`; the fallback placeholder uses `aria-hidden="true"` if
  it carries no semantic meaning.
