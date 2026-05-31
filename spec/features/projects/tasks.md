# Projects — Task List

> Prerequisite: all Foundation tasks complete and their checkpoint passed.
> Can be implemented in parallel with the `profile` and `skills` features.
> Tasks are ordered. Verify done-criteria before starting the next.

---

## J-01 · Implement projectsService

**Files touched:**
`src/features/projects/services/projectsService.js`,
`src/features/projects/tests/projectsService.test.js`

**Steps:**
1. Create `projectsService.js` implementing `getProjects()` as specified in `design.md §2`.
2. Create `projectsService.test.js`:
   - Mock `httpClient` via `vi.mock`.
   - Test: when `coverImage` is present, returned project has absolute `coverImage.url`.
   - Test: when `coverImage` is `null`, returned project has `coverImage: null` (no crash).
   - Test: `liveUrl: null` in Strapi → returned project has `liveUrl: null` (not coerced).
   - Test: empty `data` array → function returns `[]`.

**Done when:**
- `pnpm test` passes all `projectsService.test.js` cases.
- `projectsService.js` does not call `fetch` directly; no hardcoded URL.

---

## J-02 · Implement useProjects hook

**Files touched:**
`src/features/projects/hooks/useProjects.js`,
`src/features/projects/tests/useProjects.test.js`

**Steps:**
1. Create `useProjects.js` following the pattern in `design.md §3`.
2. Create `useProjects.test.js`:
   - Mock `projectsService` with `vi.mock`.
   - Test: initial state has `loading: true`, `data: null`.
   - Test: after resolution, `data` is the mocked array, `loading: false`.
   - Test: on rejection, `error` is an `ApiError` instance, `loading: false`.
   - Test: calling `refetch` invokes `getProjects` a second time.

**Done when:**
- `pnpm test` passes all `useProjects.test.js` cases.

---

## J-03 · Implement ProjectCard component

**Files touched:**
`src/features/projects/components/ProjectCard.jsx`

**Steps:**
1. Create `ProjectCard.jsx` as specified in `design.md §4`.
   - Conditionally render `<img>` only when `coverImage` is not null.
   - Render tech stack items as `<Badge variant="muted">`.
   - Conditionally render live link only when `liveUrl` is truthy.
   - Conditionally render repo link only when `repoUrl` is truthy.
   - Use `mt-auto` on the links container to push links to the bottom of the card.
2. Write a smoke render test:
   - With all fields: cover image, title, description, badges, both links rendered.
   - With `liveUrl: null`: no live link element rendered.
   - With `repoUrl: null`: no repo link element rendered.
   - Cover `<img>` has `alt` equal to `title`.

**Done when:**
- `pnpm test` passes all `ProjectCard` render tests.
- No link element appears for null URL fields in the browser.

---

## J-04 · Implement Projects section and wire into App

**Files touched:**
`src/features/projects/components/Projects.jsx`,
`src/features/projects/tests/Projects.test.jsx`,
`src/App.jsx`

**Steps:**
1. Create `Projects.jsx` as specified in `design.md §4`.
   - Calls `useProjects()` internally.
   - Renders: loading skeletons (3 ghost cards), `<ErrorState>`, empty state text,
     and a responsive card grid on success.
2. Create `Projects.test.jsx` with the six test cases from `design.md §5`:
   - Loading → skeleton cards; no real content.
   - Error → `<ErrorState>` rendered.
   - Empty array → "No projects listed yet."; no grid.
   - 2 projects → 2 `<ProjectCard>` elements.
   - `liveUrl: null` → no live link in the rendered card.
   - `repoUrl: null` → no repo link in the rendered card.
3. Mount `<Projects />` in `App.jsx` after `<Skills />`.

**Done when:**
- `pnpm test` passes all `Projects.test.jsx` cases.
- `pnpm dev`: Projects section renders live data in a responsive grid;
  cards with null links show no broken anchor elements.

---

## Checkpoint: Projects Feature Complete

| Check | Pass? |
|---|---|
| `pnpm test` exits 0; all projects tests pass | |
| Project cards render cover image, title, description, tech badges | |
| Cards with `liveUrl: null` show no live link element | |
| Cards with `repoUrl: null` show no repo link element | |
| External links have `rel="noopener noreferrer"` and `target="_blank"` | |
| Cover image `<img>` has `alt` equal to the project title | |
| Grid is 1 col on mobile, 2 on `sm:`, 3 on `lg:` | |
| No hardcoded URL in any projects source file | |

---

## Final Integration Checkpoint (all features)

Run after all four features are complete:

| Check | Pass? |
|---|---|
| `pnpm test` exits 0; all tests pass | |
| `pnpm build` exits 0 | |
| All six sections render with live Strapi data (`pnpm dev`) | |
| Stopping Strapi → each data-driven section shows a retry-able error | |
| Skills null-icon skill renders without broken image | |
| Bio renders as multiple `<p>` elements | |
| Skill filter buttons work client-side (no network call on filter) | |
| Page usable at 375 px viewport width (no horizontal scroll) | |
| All images have non-empty `alt` | |
| No `"localhost"` string in any source file | |
| Acceptance criteria AC-01 through AC-10 in `spec/overview.md §7` are green | |
