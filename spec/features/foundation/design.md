# Foundation — Technical Design

> This document describes HOW the foundation feature is built.
> The global visual language (tokens, typography, aesthetic) lives in `spec/constitution.md §8`
> and is not repeated here.

---

## 1. Folder Structure

```
frontend/
├── .env                          # VITE_API_URL=http://localhost:1337  (gitignored)
├── .env.example                  # VITE_API_URL=                       (committed)
├── index.html                    # <meta name="description"> uses seoDescription (injected by App)
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx                  # ReactDOM.createRoot; mounts <App />
    ├── App.jsx                   # Composes all section components in order
    ├── index.css                 # @import "tailwindcss"; + @theme block with design tokens
    ├── shared/                   # Cross-cutting infrastructure (not a user-facing feature)
    │   ├── api/
    │   │   ├── httpClient.js          # ApiError class + httpClient function
    │   │   └── httpClient.test.js     # co-located beside the unit under test
    │   └── components/                # Reusable UI primitives
    │       ├── Spinner.jsx
    │       ├── ErrorState.jsx
    │       ├── Card.jsx
    │       └── Badge.jsx
    └── features/                 # User-facing features only
        ├── profile/   ← see profile feature
        ├── skills/    ← see skills feature
        └── projects/  ← see projects feature
```

> **Folder convention.** `src/features/` is reserved for user-facing features
> (`profile`, `skills`, `projects`). Cross-cutting infrastructure — the HTTP client,
> typed errors, and reusable UI primitives — lives under `src/shared/`. Tests are
> co-located beside the code they exercise (e.g. `httpClient.test.js` sits in
> `src/shared/api/` next to `httpClient.js`).

---

## 2. `httpClient.js` — Design

### 2.1 ApiError class

```js
class ApiError extends Error {
  constructor(message, type, status) {
    super(message);
    this.name  = 'ApiError';
    this.type   = type;   // 'network' | 'client' | 'server'
    this.status = status; // HTTP status code, or 0 for network failures
  }
}
```

### 2.2 `httpClient(path, options?)` function

```
1. Build URL:  const url = `${import.meta.env.VITE_API_URL}${path}`
2. Try fetch(url, options):
     - catch (e) → throw new ApiError('Network failure', 'network', 0)
3. if !response.ok:
     - 400–499 → throw new ApiError(statusText, 'client', response.status)
     - 500–599 → throw new ApiError(statusText, 'server', response.status)
4. return response.json()
```

Only `httpClient` and `ApiError` are exported from this file.
No other module calls `fetch` directly.

---

## 3. UI Primitives — Design

### 3.1 `Spinner.jsx`

```jsx
// Props: { className? }
// Renders: a centered div with animate-spin border trick, or animate-pulse block.
// Tailwind example: rounded-full border-4 border-[--color-surface] border-t-[--color-accent]
```

### 3.2 `ErrorState.jsx`

```jsx
// Props: { error: ApiError, onRetry: () => void }
// Renders:
//   <div role="alert">
//     <p>{messageFor(error.type)}</p>
//     <button onClick={onRetry}>Retry</button>
//   </div>
//
// messageFor(type):
//   'network' → "Could not reach the server. Check your connection."
//   'client'  → "The content could not be loaded (client error)."
//   'server'  → "Server error — please try again later."
//   default   → "An unexpected error occurred."
```

`role="alert"` ensures screen readers announce the error without requiring focus.

### 3.3 `Card.jsx`

```jsx
// Props: { children, className? }
// Renders: <div className={`bg-[--color-surface] border border-[--color-border] rounded-xl p-6 ${className}`}>
```

### 3.4 `Badge.jsx`

```jsx
// Props: { children, variant?: 'accent' | 'muted' }
// Renders: <span> with small rounded-full pill
//   accent → bg-[--color-accent]/10 text-[--color-accent]
//   muted  → bg-[--color-surface] text-[--color-muted]
```

---

## 4. `vite.config.js` — Key Sections

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.js',
  },
});
```

`src/tests/setup.js` imports `@testing-library/jest-dom` to extend Vitest matchers.

---

## 5. `index.css` — Structure

```css
@import "tailwindcss";

@theme {
  /* Accent: violet (decided) — alternatives were #10b981 emerald, #f59e0b amber */
  --color-accent:  #8b5cf6;   /* violet-500 */
  --color-bg:      #0f172a;
  --color-surface: #1e293b;
  --color-border:  #334155;
  --color-text:    #f1f5f9;
  --color-muted:   #94a3b8;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
}
```

---

## 6. `App.jsx` — Responsibility

`App.jsx` is the composition root. It:
- Wraps the tree with `<ProfileProvider>` (added during the profile feature).
- Renders `<Header />`, a `<main>` containing `<Hero />`, `<About />`, `<Skills />`, `<Projects />`, then `<Footer />`.
- Injects `seoDescription` into a `<meta>` tag via `document.querySelector` or a `<Helmet>`-equivalent if preferred.
- Has no data-fetching logic of its own.

---

## 7. Testing Strategy for Foundation

`httpClient.test.js` uses `vi.stubGlobal('fetch', vi.fn())` to avoid real network calls.

| Test case | Assertion |
|---|---|
| Successful 200 response | Returns parsed JSON |
| Network error (fetch throws) | Throws `ApiError` with `type === 'network'` and `status === 0` |
| 404 response | Throws `ApiError` with `type === 'client'` and `status === 404` |
| 500 response | Throws `ApiError` with `type === 'server'` and `status === 500` |

---

## 8. Design Trade-offs

| Decision | Rationale |
|---|---|
| Single `httpClient` function (not a class) | Simple; no instance needed; easy to mock with `vi.mock` |
| Primitives live in `foundation/components/` not a shared `ui/` folder | Keeps all foundation code co-located; the convention is clear from the path |
| No CSS Modules or styled-components | Tailwind v4 utility-first is sufficient; avoids a second abstraction layer |
| No React Router | Single-page, single-route; anchor hash links suffice for in-page navigation |
