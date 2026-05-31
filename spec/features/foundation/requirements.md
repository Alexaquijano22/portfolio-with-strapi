# Foundation — Requirements

> Scope: the shared infrastructure that every other feature depends on.
> Data contract: see `spec/overview.md §3`. Engineering rules: see `spec/constitution.md`.

---

## 1. Purpose

The `foundation` feature delivers everything that is not specific to any product section:
project scaffold, environment wiring, design tokens, the HTTP client, and the reusable UI
primitives used by profile, skills, and projects.

It must be **fully implemented and tested before any other feature begins**.

---

## 2. What It Provides

### 2.1 Project Scaffold
A working Vite + React 18 application that:
- Starts (`pnpm dev`) without errors and renders a dark background page.
- Builds (`pnpm build`) without errors.
- Runs the test suite (`pnpm test`) and exits 0.

### 2.2 Environment Configuration
- `VITE_API_URL` is read from `.env` and available throughout the app via `import.meta.env.VITE_API_URL`.
- `.env.example` is committed with an empty value as documentation.
- No source file contains a hardcoded host or port.

### 2.3 Design Tokens
All color tokens declared in `src/index.css` inside a Tailwind CSS v4 `@theme` block
(see `spec/constitution.md §8.2`). The accent token value is left as a `TODO` comment.

### 2.4 HTTP Client & ApiError
A single `httpClient` function and `ApiError` class that:
- Build request URLs from `VITE_API_URL`.
- Throw a typed `ApiError` for network failures, 4xx, and 5xx responses.
- Return parsed JSON on success.

### 2.5 Reusable UI Primitives
Four shared components consumed across all features:

| Component | Responsibility |
|---|---|
| `Spinner` | Animated loading indicator (or `animate-pulse` skeleton block). |
| `ErrorState` | Displays a type-mapped message and a **Retry** button. Accepts `error: ApiError` and `onRetry: function`. |
| `Card` | Generic surface container (background, border, rounded corners, padding). |
| `Badge` | Small inline label (e.g., tech stack chip, category tag). |

---

## 3. Behaviour

### 3.1 Spinner
- Renders a visible animation while any async operation is pending.
- Accepts an optional `className` prop for sizing.

### 3.2 ErrorState
- Maps `error.type` to a human-readable string:
  - `'network'` → "Could not reach the server. Check your connection."
  - `'client'` → "The content could not be loaded (client error)."
  - `'server'` → "Server error — please try again later."
  - fallback → "An unexpected error occurred."
- Renders a **Retry** button that calls `onRetry()` on click.
- Button is keyboard-focusable with a visible focus ring.

### 3.3 Card
- No intrinsic content, just a styled wrapper.
- Consumers pass `className` for layout overrides.

### 3.4 Badge
- Renders its `children` inside a small rounded pill.
- Accent-colored or muted-colored variant via a `variant` prop (`'accent' | 'muted'`; default `'muted'`).

---

## 4. Responsive Rules
UI primitives are layout-agnostic; they adapt to whatever container places them.
`Spinner` centers itself within its containing block.

---

## 5. Out of Scope for Foundation
- Any section-specific component (Hero, About, Skills, Projects, Header, Footer).
- Any service or hook that calls a Strapi endpoint.
- Routing (this is a single-page, single-route app).
