# Foundation — Task List

> Tasks are ordered. Verify every done-criterion before starting the next task.
> No application source code may be written until this task list is the active one.

---

## F-01 · Scaffold the Vite + React project

**Files touched:**
`frontend/` (entire initial scaffold), `frontend/.env`, `frontend/.env.example`,
`frontend/vite.config.js`, `frontend/package.json`, `frontend/src/main.jsx`,
`frontend/src/App.jsx`, `frontend/src/index.css`, `frontend/src/tests/setup.js`

**Steps:**
1. From repo root: `pnpm create vite frontend -- --template react`
2. `cd frontend && pnpm install`
3. Install additional deps:
   `pnpm add -D @tailwindcss/vite vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom`
4. Replace `vite.config.js` with the config from `design.md §4` (adds Tailwind plugin + Vitest config).
5. Create `src/tests/setup.js` with `import '@testing-library/jest-dom'`.
6. Replace the generated `src/index.css` with the token-bearing stylesheet from `design.md §5`.
   Leave the accent token as `#TODO`.
7. Strip boilerplate from `src/App.jsx` (remove the counter demo; leave a `<div>` placeholder).
8. Delete unused scaffold files: `src/App.css`, `src/assets/react.svg`.
9. Create `.env` with `VITE_API_URL=http://localhost:1337` (add to `.gitignore`).
10. Create `.env.example` with `VITE_API_URL=`.

**Done when:**
- `pnpm dev` starts without errors and renders a dark (`--color-bg`) blank page.
- `pnpm build` exits 0.
- `pnpm test` exits 0 (zero tests at this stage is fine; the runner must start).
- No string `"localhost"` appears in any committed source file.

---

## F-02 · Implement ApiError and httpClient

**Files touched:**
`src/features/foundation/api/httpClient.js`,
`src/features/foundation/tests/httpClient.test.js`

**Steps:**
1. Create `httpClient.js` following the design in `design.md §2`.
   - Export `ApiError` class (message, type, status).
   - Export `httpClient(path, options?)` function.
2. Create `httpClient.test.js` with the four test cases from `design.md §7`:
   - success → returns JSON
   - network error → `ApiError` with `type 'network'`, `status 0`
   - 404 → `ApiError` with `type 'client'`, `status 404`
   - 500 → `ApiError` with `type 'server'`, `status 500`

**Done when:**
- `pnpm test` passes all four `httpClient.test.js` cases.
- The string `"localhost"` does not appear in `httpClient.js`.
- `httpClient.js` is the only file in the project that calls `fetch`.

---

## F-03 · Implement Spinner and ErrorState primitives

**Files touched:**
`src/features/foundation/components/Spinner.jsx`,
`src/features/foundation/components/ErrorState.jsx`

**Steps:**
1. Implement `Spinner` (see `design.md §3.1`): accepts optional `className`; renders a
   centered `animate-spin` ring or `animate-pulse` block using design tokens.
2. Implement `ErrorState` (see `design.md §3.2`):
   - Accepts `{ error, onRetry }`.
   - Maps `error.type` to the four message strings from `requirements.md §3.2`.
   - Renders `<div role="alert">` with message text and a **Retry** button.
3. Write a smoke render test for each (import and render with minimal props; assert no crash
   and the expected text appears).

**Done when:**
- `pnpm test` passes.
- `<ErrorState error={new ApiError('', 'network', 0)} onRetry={() => {}} />` renders the
  network message and a "Retry" button.
- `<Spinner />` renders without errors.

---

## F-04 · Implement Card and Badge primitives

**Files touched:**
`src/features/foundation/components/Card.jsx`,
`src/features/foundation/components/Badge.jsx`

**Steps:**
1. Implement `Card` (see `design.md §3.3`): wraps `children` in a styled surface `<div>`;
   merges optional `className` prop.
2. Implement `Badge` (see `design.md §3.4`): renders `children` in a rounded pill;
   `variant` prop controls accent vs muted coloring.
3. Write a smoke render test for each.

**Done when:**
- `pnpm test` passes.
- `<Card><p>hello</p></Card>` renders `"hello"` inside a styled container.
- `<Badge variant="accent">React</Badge>` renders `"React"` with the accent-color class applied.

---

## F-05 · Wire App.jsx and verify dark page

**Files touched:**
`src/App.jsx`

**Steps:**
1. Update `App.jsx` to render placeholder `<section>` blocks for each future section
   (Header, Hero, About, Skills, Projects, Footer) so the layout skeleton is visible.
2. Apply `min-h-screen bg-[--color-bg] text-[--color-text]` to the root wrapper.
3. Confirm visually at `http://localhost:5173` that the dark background renders correctly.

**Done when:**
- `pnpm dev` shows a dark page with six placeholder sections, no console errors.
- `pnpm build && pnpm preview` also works without errors.
- All prior `pnpm test` cases still pass.

---

## Checkpoint: Foundation Complete

Before moving to any feature, confirm **all** of the following:

| Check | Pass? |
|---|---|
| `pnpm dev` renders dark page without console errors | |
| `pnpm build` exits 0 | |
| `pnpm test` exits 0 with ≥ 6 passing tests (httpClient × 4, Spinner × 1, ErrorState × 1, Card × 1, Badge × 1) | |
| `httpClient.js` is the only file calling `fetch` | |
| No hardcoded URL in any source file | |
| Design tokens declared once in `index.css`; accent is `#TODO` | |
