# Profile — Task List

> Prerequisite: all Foundation tasks complete and their checkpoint passed.
> Tasks are ordered. Verify done-criteria before starting the next.

---

## P-01 · Implement profileService

**Files touched:**
`src/features/profile/services/profileService.js`,
`src/features/profile/tests/profileService.test.js`

**Steps:**
1. Create `profileService.js` implementing `getProfile()` as specified in `design.md §2`.
2. Create `profileService.test.js`:
   - Mock `httpClient` via `vi.mock('../../foundation/api/httpClient')`.
   - Test: successful response → returned object contains `fullName`; `avatar.url` is absolute.
   - Test: `avatar` field absent/null → function returns without throwing.

**Done when:**
- `pnpm test` passes all `profileService.test.js` cases.
- `profileService.js` imports only from `httpClient`; no `fetch` call inside it.
- No hardcoded URL string in `profileService.js`.

---

## P-02 · Implement useProfile hook and ProfileContext

**Files touched:**
`src/features/profile/hooks/useProfile.js`,
`src/features/profile/context/ProfileContext.jsx`,
`src/features/profile/tests/useProfile.test.js`,
`src/App.jsx`

**Steps:**
1. Create `useProfile.js` following `design.md §3`.
2. Create `ProfileContext.jsx` with `ProfileProvider` and `useProfileContext` as in `design.md §4`.
3. Wrap the `App.jsx` tree with `<ProfileProvider>`.
4. Create `useProfile.test.js`:
   - Mock `profileService` via `vi.mock`.
   - Test: initial state has `loading: true`, `data: null`.
   - Test: after resolution, `loading: false`, `data` is the mocked profile.
   - Test: on rejection, `loading: false`, `error` is an `ApiError` instance.
   - Test: calling `refetch` invokes the service a second time.

**Done when:**
- `pnpm test` passes all `useProfile.test.js` cases.
- `useProfile` is called only inside `ProfileProvider`, nowhere else.
- `useProfileContext()` throws a clear error when used outside the provider.

---

## P-03 · Implement Header component

**Files touched:**
`src/features/profile/components/Header.jsx`,
`src/App.jsx`

**Steps:**
1. Create `Header.jsx` as specified in `design.md §5`.
   - Sticky positioning: `sticky top-0 z-50`.
   - Reads from `useProfileContext()`.
   - Shows `<Spinner />` while loading; shows `fullName` on success; silently omits on error.
   - Five nav anchor links with `aria-label="Main navigation"` on `<nav>`.
2. Import and render `<Header />` at the top of `App.jsx` (outside `<main>`).

**Done when:**
- `pnpm dev`: Header renders `fullName` from live Strapi data.
- Header remains visible while scrolling.
- All five nav links are keyboard-focusable with visible focus rings.

---

## P-04 · Implement Hero component

**Files touched:**
`src/features/profile/components/Hero.jsx`,
`src/features/profile/tests/Hero.test.jsx`,
`src/App.jsx`

**Steps:**
1. Create `Hero.jsx` as specified in `design.md §5`.
   - `<section id="hero" class="min-h-screen …">`.
   - Avatar `<img src={data.avatar.url} alt={data.fullName} />`.
   - Loading: four `<Spinner />` or skeleton blocks.
   - Error: `<ErrorState error={error} onRetry={refetch} />`.
   - CTA links to `#projects` and is styled with `--color-accent`.
2. Create `Hero.test.jsx`:
   - Mock `useProfileContext`.
   - Test loading state: skeleton/spinner present; no `<h1>` text.
   - Test error state: `<ErrorState>` rendered; Retry button present.
   - Test success state: `<h1>` contains `fullName`; `<img>` has non-empty `alt`; CTA anchor present.
3. Mount `<Hero />` in `App.jsx` as the first child of `<main>`.

**Done when:**
- `pnpm test` passes all `Hero.test.jsx` cases.
- `pnpm dev`: Hero renders avatar, headings, and CTA from live data.

---

## P-05 · Implement About component

**Files touched:**
`src/features/profile/components/About.jsx`,
`src/features/profile/tests/About.test.jsx`,
`src/App.jsx`

**Steps:**
1. Create `About.jsx` as specified in `design.md §5`.
   - `<section id="about">`.
   - Split `bio` on `\n\n` → one `<p>` per segment.
   - Map `highlight[]` to `<Card>` elements in a responsive grid.
   - Loading: skeleton lines + ghost `<Card>` elements.
   - Error: `<ErrorState error={error} onRetry={refetch} />`.
   - Empty `highlight[]`: render bio only; no grid.
2. Create `About.test.jsx`:
   - Test: bio `"A\n\nB"` → exactly 2 `<p>` elements.
   - Test: 2 highlights → 2 `<Card>` elements with correct title text.
   - Test: empty `highlight[]` → no crash; no grid rendered.
   - Test: loading state → skeletons visible.
   - Test: error state → `<ErrorState>` visible.
3. Mount `<About />` in `App.jsx` after `<Hero />`.

**Done when:**
- `pnpm test` passes all `About.test.jsx` cases.
- `pnpm dev`: bio renders as multiple paragraphs; highlights display as cards.

---

## P-06 · Implement Footer component

**Files touched:**
`src/features/profile/components/Footer.jsx`,
`src/App.jsx`

**Steps:**
1. Create `Footer.jsx` as specified in `design.md §5`.
   - `<footer id="contact" role="contentinfo">`.
   - `email` as `<a href="mailto:…">`.
   - `socialLink[]` as `<a target="_blank" rel="noopener noreferrer">`.
   - Copyright: `© {new Date().getFullYear()} {data.fullName}`.
   - Loading: skeleton links area.
   - Error: static "Contact info unavailable" (no retry button).
   - Empty `socialLink[]`: omit social block; email link still renders.
2. Mount `<Footer />` in `App.jsx` after the closing `</main>` tag.

**Done when:**
- `pnpm dev`: Footer shows email, social links, and copyright from live data.
- Email link has correct `mailto:` href.
- Social links have `rel="noopener noreferrer"` and `target="_blank"`.
- Empty `socialLink[]` scenario does not crash.

---

## P-07 · SEO meta tag injection

**Files touched:**
`src/App.jsx`

**Steps:**
1. In `App.jsx`, after the profile data resolves, set:
   `document.querySelector('meta[name="description"]').setAttribute('content', data.seoDescription ?? '')`.
2. Add `<meta name="description" content="">` to `index.html` as the initial placeholder.

**Done when:**
- In browser DevTools, `<meta name="description">` contains the `seoDescription` value from Strapi
  after the page loads.
- `seoDescription` does not appear in any rendered section.

---

## Checkpoint: Profile Feature Complete

| Check | Pass? |
|---|---|
| `pnpm test` exits 0; all profile tests pass | |
| Header shows `fullName` and stays sticky | |
| Hero renders avatar (`<img>` has non-empty `alt`), h1, h2, tagline, CTA | |
| About splits bio into multiple `<p>` elements | |
| Footer has `mailto:` link and social links with `rel="noopener noreferrer"` | |
| `<meta name="description">` populated at runtime | |
| No hardcoded URL in any profile source file | |
