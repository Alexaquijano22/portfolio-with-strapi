# Skills — Task List

> Prerequisite: all Foundation tasks complete and their checkpoint passed.
> Can be implemented in parallel with the `profile` feature (no shared state between them).
> Tasks are ordered. Verify done-criteria before starting the next.

---

## S-01 · Implement skillsService

**Files touched:**
`src/features/skills/services/skillsService.js`,
`src/features/skills/tests/skillsService.test.js`

**Steps:**
1. Create `skillsService.js` implementing `getSkills()` as specified in `design.md §2`.
2. Create `skillsService.test.js`:
   - Mock `httpClient` via `vi.mock`.
   - Test: when icon is present, returned skill has absolute `icon.url`.
   - Test: when icon is `null`, returned skill has `icon: null` (no crash, no invented URL).
   - Test: when `data` is `[]`, function returns `[]`.

**Done when:**
- `pnpm test` passes all `skillsService.test.js` cases.
- `skillsService.js` does not call `fetch` directly; no hardcoded URL.

---

## S-02 · Implement useSkills hook

**Files touched:**
`src/features/skills/hooks/useSkills.js`,
`src/features/skills/tests/useSkills.test.js`

**Steps:**
1. Create `useSkills.js` following the pattern in `design.md §3`.
2. Create `useSkills.test.js`:
   - Mock `skillsService` with `vi.mock`.
   - Test: initial state has `loading: true`, `data: null`.
   - Test: after resolution, `data` is the mocked skills array, `loading: false`.
   - Test: on rejection, `error` is an `ApiError` instance, `loading: false`.
   - Test: calling `refetch` invokes `getSkills` a second time.

**Done when:**
- `pnpm test` passes all `useSkills.test.js` cases.

---

## S-03 · Implement CategoryFilter component

**Files touched:**
`src/features/skills/components/CategoryFilter.jsx`

**Steps:**
1. Create `CategoryFilter.jsx` as specified in `design.md §4`.
   - Props: `{ categories, active, onChange }`.
   - Each category renders as a `<button>` with `aria-pressed`.
   - Active button styled with `--color-accent` background.
   - Wraps in `<div role="group" aria-label="Filter skills by category">`.
2. Write a smoke render test:
   - Renders 4 buttons for `['All', 'Frontend', 'Backend', 'Tools']`.
   - Active button has `aria-pressed="true"`.
   - Clicking a button calls `onChange` with the correct category string.

**Done when:**
- `pnpm test` passes the CategoryFilter smoke test.
- Buttons are keyboard-navigable; clicking one fires `onChange`.

---

## S-04 · Implement SkillCard component

**Files touched:**
`src/features/skills/components/SkillCard.jsx`

**Steps:**
1. Create `SkillCard.jsx` as specified in `design.md §4`.
   - When `skill.icon` is not null: render `<img src={skill.icon.url} alt={skill.name} />`.
   - When `skill.icon` is null: render the initial-letter fallback with `aria-hidden="true"`.
   - Render `skill.name` as text and `skill.category` inside `<Badge variant="accent">`.
2. Write a smoke render test:
   - With icon: `<img>` element present; `alt` equals `skill.name`.
   - Without icon (`icon: null`): no `<img>` element; no crash; fallback element present.

**Done when:**
- `pnpm test` passes both SkillCard render tests.
- No broken-image artifact in the browser when icon is null.

---

## S-05 · Implement Skills section and wire into App

**Files touched:**
`src/features/skills/components/Skills.jsx`,
`src/features/skills/tests/Skills.test.jsx`,
`src/App.jsx`

**Steps:**
1. Create `Skills.jsx` as specified in `design.md §4`.
   - Calls `useSkills()` internally.
   - `activeCategory` state defaults to `'All'`.
   - Derives `filteredSkills` from `data` and `activeCategory`.
   - Renders loading skeletons, `<ErrorState>`, empty state, and success content correctly.
2. Create `Skills.test.jsx` with the five test cases from `design.md §5`:
   - Loading → skeleton cards visible.
   - Error → `<ErrorState>` visible.
   - Empty array → "No skills listed yet." text; no filter buttons.
   - Category filter → clicking "Frontend" hides non-Frontend cards.
   - Null icon → renders without crash.
3. Mount `<Skills />` in `App.jsx` after `<About />`.

**Done when:**
- `pnpm test` passes all `Skills.test.jsx` cases.
- `pnpm dev`: Skills section renders live data; filter buttons work; null-icon skills render cleanly.

---

## Checkpoint: Skills Feature Complete

| Check | Pass? |
|---|---|
| `pnpm test` exits 0; all skills tests pass | |
| Category filter buttons visible; "All" active by default | |
| Clicking a category hides non-matching skills (no network call) | |
| Skill with `null` icon renders without broken image or crash | |
| Active filter button is visually distinct (accent color) | |
| `aria-pressed` is set correctly on filter buttons | |
| No hardcoded URL in any skills source file | |
