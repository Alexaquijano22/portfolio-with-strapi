# Constitution — Engineering & Design Principles

> This document is the single source of truth for **how** the frontend is built.
> Every feature spec references it; nothing here is duplicated there.
> A rule listed here is non-negotiable. A task that violates one must be reworked before the
> next task starts.

---

## 1. Technology Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | React 18+ | Functional components only; no class components |
| Bundler | Vite 5.x | Config in `vite.config.js` |
| Language | JavaScript / JSX | No TypeScript in this exercise |
| Styling | Tailwind CSS v4 | Loaded via `@tailwindcss/vite` plugin; no PostCSS config needed |
| Testing | Vitest + React Testing Library | `jsdom` environment; `@testing-library/jest-dom` matchers |
| Package manager | pnpm | Consistent with the existing backend workspace |

---

## 2. Architecture — Separation of Concerns (hard rule)

The frontend is split into three strict layers. Crossing a boundary is not allowed.

```
services/   ← owns ALL fetch calls, URL construction, response normalisation
hooks/      ← owns data-fetching state; calls services; exposes { data, loading, error, refetch }
components/ ← renders UI; calls hooks or receives props; never calls fetch directly
```

| Layer | Must do | Must NOT do |
|---|---|---|
| `services` | Build URLs from `VITE_API_URL`; call `httpClient`; normalise response shapes; prefix relative media URLs | Import React; hold state; render anything |
| `hooks` | Call one service function; manage `data / loading / error` state; expose `refetch` | Call `fetch` directly; render anything |
| `components` | Render markup; delegate data needs to a hook or receive props | Import `fetch`; manage async state |

---

## 3. Zero Hardcoded URLs

Every request URL **must** be constructed as:

```js
`${import.meta.env.VITE_API_URL}${path}`
```

Media asset URLs returned by Strapi are relative paths. They **must** be prefixed with
`VITE_API_URL` inside the service layer, before any component ever sees them.
The string `"localhost:1337"` must never appear in any source file.

---

## 4. ApiError — Typed Error Classification

A custom `ApiError` class (in `src/shared/api/httpClient.js`) is the only
error type propagated through the system.

```
network failure   → ApiError({ type: 'network', status: 0 })
HTTP 4xx response → ApiError({ type: 'client',  status: <code> })
HTTP 5xx response → ApiError({ type: 'server',  status: <code> })
```

Hooks catch errors and set `error` to an `ApiError` instance — never a raw `Error` or string.
Components receive the typed object and map `error.type` to a user-facing message.

---

## 5. Three UI States + Empty State (mandatory for every data-driven section)

Every section that fetches remote data **must** implement all of:

| State | Required UI |
|---|---|
| Loading | `<Spinner />` or skeleton blocks using `animate-pulse` |
| Error | Human-readable message (mapped from `ApiError.type`) + visible **Retry** button that calls `refetch()` |
| Empty | A graceful "nothing to show" message; never a crash or blank section |
| Success | The actual content |

---

## 6. Mobile-First Responsive Design

All layout decisions start at the smallest viewport (≥ 320 px) and layer up using
Tailwind's `sm:` / `md:` / `lg:` prefixes. Desktop-only layouts are not acceptable.

---

## 7. Accessibility Baseline

- Semantic HTML: `<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`, `<article>`.
- Every `<img>` carries a meaningful `alt` attribute (`alt=""` only for purely decorative images).
- Interactive elements are keyboard-reachable and show a visible focus ring.
- Color contrast meets WCAG AA against the dark background for both body text and the accent.

---

## 8. Design Language

### 8.1 Theme
Dark mode by default. The page background is near-black (slate-900 range); surface cards use
a slightly lighter tone (slate-800 range). No light-mode toggle is required for this exercise.

### 8.2 Palette — Design Tokens
All color decisions are expressed as CSS custom properties declared **once** in the global
stylesheet (`src/index.css`) inside a Tailwind CSS v4 `@theme` block.

```css
@theme {
  /* Accent: violet (decided) — alternatives were #10b981 emerald, #f59e0b amber */
  --color-accent:   #8b5cf6;   /* violet-500 */

  --color-bg:       #0f172a;   /* slate-900 */
  --color-surface:  #1e293b;   /* slate-800 */
  --color-border:   #334155;   /* slate-700 */
  --color-text:     #f1f5f9;   /* slate-100 */
  --color-muted:    #94a3b8;   /* slate-400 */
}
```

`--color-accent` is used for: primary CTA buttons, active filter pills, skill category badges,
hover accents on nav links. It is **never** hardcoded as a hex value anywhere else.

### 8.3 Aesthetic
Minimalist and clean: no gradients, no heavy shadows, no decorative animations. Subtle
`transition-colors` on interactive elements is acceptable.

### 8.4 Typography
A single font family loaded via a `<link>` in `index.html`, or the system font stack. All
headings use `font-bold`; body text uses `font-normal`. No mixing of decorative typefaces.

---

## 9. Clean-Code Guardrails

1. **No dead code in commits** — commented-out or unused code is deleted, not shipped.
2. **One responsibility per file** — a service file exports service functions; a hook file
   exports one hook; a component file exports one component.
3. **Consistent naming** — files and exports follow their layer: `*Service.js`, `use*.js`,
   `*.jsx` (PascalCase component name).
4. **No inline styles** — Tailwind utility classes only; no `style={{}}` props.
5. **Short files** — hooks target ≤ 40 lines; UI atoms ≤ 60 lines; section components ≤ 80 lines.

---

## 10. Testing Policy

- **Minimum coverage**: at least one unit test per custom hook and at least one render test
  per section component.
- **Test scope**:
  - Hook tests: mock the service module with `vi.mock`; assert `loading → data` on success
    and `loading → error` on failure; assert that calling `refetch` triggers another service call.
  - Component tests: mock the hook; render with `loading=true`, `error=<ApiError>`, and
    `data=<fixture>`; assert the correct UI for each state.
- **No real network calls** in tests — all service functions are mocked.
- **Test location**: `src/features/<feature>/tests/` co-located with the feature.
- Tests run with `pnpm test` (Vitest in run mode); CI must exit 0.
