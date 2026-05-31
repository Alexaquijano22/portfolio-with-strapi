# Overview — Product Context & Data Contract

> This document is the single source of truth for **what** the product is and **what data**
> drives it. Feature specs reference this document and never duplicate its content.

---

## 1. Product Context

A single-page personal creative portfolio that pulls all content from a Strapi 5 CMS and
presents it to potential employers and collaborators. Built as **Exercise 1** of a front-end
technical assessment; it must demonstrate clean architecture, CMS-driven content, and
accessible markup.

The page renders six sections in order: **Header → Hero → About → Skills → Projects → Footer**.
The Header is sticky. All remaining sections are within a `<main>` element.

### 1.1 Code Organization

The frontend separates feature code from shared infrastructure:

- **`src/features/`** is reserved for user-facing features only — `profile`, `skills`, and
  `projects`. Each owns its sections, hooks, and feature-specific tests.
- **`src/shared/`** holds cross-cutting infrastructure used by every feature: the HTTP client
  and typed `ApiError` (`src/shared/api/httpClient.js`) and reusable UI primitives
  (`src/shared/components/` — `Spinner`, `ErrorState`, `Card`, `Badge`).
- Tests are **co-located** beside the code they exercise (e.g. `httpClient.test.js` lives in
  `src/shared/api/` next to `httpClient.js`).

---

## 2. Backend

| Item | Value |
|---|---|
| CMS | Strapi 5 |
| Base URL | `http://localhost:1337` (via `VITE_API_URL` env var — never hardcoded) |
| Auth | None; all three endpoints are publicly readable |
| Response format | Strapi 5 **flat** format — no nested `attributes` wrapper |
| Media URLs | **Relative paths** returned by Strapi; must be prefixed with `VITE_API_URL` |

### 2.1 Strapi 5 Response Envelope

```jsonc
// Single type (Profile)
{ "data": { "id": 1, "fullName": "…", … }, "meta": {} }

// Collection type (Skills, Projects)
{ "data": [ { "id": 1, "name": "…" }, … ], "meta": { "pagination": { … } } }
```

Services extract `.data` and return the unwrapped value (object or array).

---

## 3. Strapi Data Contract

All fields listed here are verified against the live API.
`?populate=*` is required for media and component fields.

### 3.1 Profile — single type

**Endpoint:** `GET /api/profile?populate=*`

| Field | Type | Notes |
|---|---|---|
| `fullName` | string | |
| `role` | string | |
| `tagline` | string | Short one-liner |
| `bio` | string | `\n\n` separates logical paragraphs; split and render each as a `<p>` |
| `email` | string | Rendered as a `mailto:` link |
| `seoDescription` | string | Used only in `<meta name="description">` — never rendered in a section |
| `avatar` | media object | `avatar.url` is relative → prefix with `VITE_API_URL`; `formats` is `null` for SVGs so always use the base `url` field |
| `highlight[]` | component array | Each: `{ title: string, description: string }` |
| `socialLink[]` | component array | Each: `{ platform: string, url: string }` |

### 3.2 Skill — collection type

**Endpoint:** `GET /api/skills?populate=*`

| Field | Type | Notes |
|---|---|---|
| `name` | string | |
| `category` | enum | `Frontend` \| `Backend` \| `Tools` |
| `icon` | media object | **NULLABLE** — the UI must render gracefully when `icon` is `null`. When present, `icon.url` is relative → prefix with `VITE_API_URL` |

### 3.3 Project — collection type

**Endpoint:** `GET /api/projects?populate=*`

| Field | Type | Notes |
|---|---|---|
| `title` | string | |
| `description` | string | |
| `liveUrl` | string | May be `null` — omit the link element when absent |
| `repoUrl` | string | May be `null` — omit the link element when absent |
| `coverImage` | media object | `coverImage.url` is relative → prefix with `VITE_API_URL` |
| `techStack[]` | component array | Each: `{ name: string }`; rendered as badges |

> No ordering or "featured" fields exist. Render projects in the order returned by the API.

---

## 4. Section → Data Map

| Section | Data source | Fields consumed |
|---|---|---|
| **Header** | Profile | `fullName` (logo/name text) |
| **Hero** | Profile | `fullName`, `role`, `tagline`, `avatar` |
| **About** | Profile | `bio` (paragraphs), `highlight[]` (small cards) |
| **Skills** | Skills collection | `name`, `category`, `icon` (nullable) |
| **Projects** | Projects collection | `coverImage`, `title`, `description`, `techStack[]`, `liveUrl`, `repoUrl` |
| **Footer** | Profile | `socialLink[]`, `email` |

Header and Footer are layout components; Hero, About, and Footer all share the same
`useProfile` hook instance (provided via React Context) so only one network request is made
for Profile data.

---

## 5. Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL for all API requests and media asset URL prefixing |

`.env` (gitignored): `VITE_API_URL=http://localhost:1337`
`.env.example` (committed): `VITE_API_URL=`

---

## 6. Out of Scope (Exercise 1)

- Contact form submission (planned for Exercise 2).
- Internationalisation (i18n).
- Server-side rendering or static generation.
- Authentication or admin UI.
- Dark/light mode toggle.
- Any Strapi endpoint beyond the three listed above.

---

## 7. Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-01 | All six sections render with content pulled live from Strapi (no hardcoded copy). |
| AC-02 | Loading states appear before data resolves and disappear after. |
| AC-03 | Stopping the Strapi server shows a retry-able error message per section. |
| AC-04 | Skills with a `null` icon render without crash or missing-image artifact. |
| AC-05 | Bio renders as multiple `<p>` elements split on `\n\n`. |
| AC-06 | Project cards omit the live/repo link element when the URL is absent. |
| AC-07 | The page is usable and readable on a 375 px wide viewport. |
| AC-08 | All images have non-empty `alt` attributes. |
| AC-09 | `pnpm test` exits 0 with at least one passing test per hook. |
| AC-10 | No string `"localhost"` or any hardcoded URL appears in source files. |
