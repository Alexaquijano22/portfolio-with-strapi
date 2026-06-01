# Products Demo — Requirements

> Scope: a second page (`/products`) that lists product titles from a third-party API,
> with editorial copy (heading + intro) managed in Strapi.
> Engineering rules: see `spec/constitution.md`. Data contract: see §3 below and `spec/overview.md`.
> Prerequisite: Exercise 1 complete (foundation + profile + skills + projects).
> Exercise 2 — built inside the same repo/frontend/backend, on branch `feature/products-demo`.

---

## 1. Purpose

Demonstrate consuming an **external** REST API (`fakestoreapi.com`) alongside the existing Strapi
backend, reusing the shared HTTP/error layer and UI primitives from Exercise 1. The new page mixes
two data sources:

- **Editorial copy** (heading + intro text) — authored in Strapi (`products-page` single type).
- **Product list** — fetched live from the external API; we render only the product **titles**.

No content is hardcoded: the copy is editable from the Strapi admin, and the product data comes
from the live external API.

---

## 2. Routing

The app becomes a two-route SPA using React Router:

| Route | Page | Notes |
|---|---|---|
| `/` | Existing portfolio | Header, Hero, About, Skills, Projects, Footer (unchanged) |
| `/products` | New Products demo page | Strapi copy + external product titles |

- The existing **Header nav** gains a **"Products"** link (`<Link to="/products">`).
- The Products page provides a way back to the portfolio (a **"Home"** link to `/`).
- Adding the router must **not** break the portfolio page or the `ProfileProvider`/Context: the
  profile data is still fetched once and scoped to the portfolio route.

---

## 3. Data contracts

### 3.1 External products API
- **Endpoint:** `GET https://fakestoreapi.com/products`
- **Shape:** returns an **ARRAY** of product objects.
- Fields consumed per product (store-style card):
  | Field | Type | Use |
  |---|---|---|
  | `id` | number | React key |
  | `title` | string | Card title (clamped to ~2 lines) |
  | `price` | number | Formatted as USD currency (e.g. `$109.95`) |
  | `category` | string | Rendered as a `<Badge>` |
  | `image` | string (absolute URL) | Product photo, used as-is with `object-contain` |
  | `rating` | `{ rate: number, count: number }` | Shown as `★ {rate} ({count})` |

### 3.2 Strapi page copy (single type)
- **Endpoint:** `GET http://localhost:1337/api/products-page` (via `VITE_API_URL`)
- **Shape:** Strapi 5 flat — an **OBJECT** in `data` with:
  | Field | Type | Notes |
  |---|---|---|
  | `title` | string | Page heading |
  | `intro` | string | Short intro paragraph |
- Single type — **no `?populate=*`** needed (no media/components).

---

## 4. Page behaviour

### 4.1 Layout
- Rendered at `/products` as a `<main>` (or `<section>`) with a centered max-width container and
  horizontal padding (consistent with the portfolio sections).
- Strapi `title` rendered as the page heading (`<h1>`).
- Strapi `intro` rendered as an intro `<p>` below the heading.
- The products rendered below as a **store-style responsive grid of cards** (reusing the shared
  `Card` and `Badge`), one card per product. Each card shows the product image (on a light neutral
  area, `object-contain`), the title (clamped to ~2 lines for even card height), the price as
  currency, the rating (`★ rate (count)`), and the category as a `<Badge>`.

### 4.2 Loading state
While either data source is pending, show a `<Spinner />` (reused from `src/shared/components`).

### 4.3 Error state
If either fetch fails, show `<ErrorState error={error} onRetry={refetch} />` (reused), wired to a
`refetch` that retries the failed data. The external API and the Strapi copy each surface a typed
`ApiError` (client/server/network) so the message matches the failure type.

### 4.4 Empty state
If the external API returns an empty array, render a graceful message
(e.g. **"No products available right now."**) instead of an empty list. The Strapi copy still renders.

---

## 5. Responsive rules
- Mobile-first. The container is full-width with padding on small screens and constrained
  (centered max-width) on larger screens.
- The product grid is **1 column (mobile) → 2 (`sm:`) → 3 (`md:`) → 4 (`lg:`)**.
- The page is readable on a 375 px viewport (no horizontal scroll).

---

## 6. Accessibility
- The Strapi `title` is the page's primary heading (`<h1>`); each product card title is an `<h3>`.
- Every product image has a non-empty `alt` equal to its `title`.
- Nav links (including "Products" and "Home") are keyboard-reachable with visible focus rings,
  consistent with the existing Header styling.

---

## 7. Acceptance criteria

| ID | Criterion |
|---|---|
| P2-01 | `/products` renders the Strapi `title` and `intro` (no hardcoded copy). |
| P2-02 | The product cards (image, title, price, rating, category) come live from `fakestoreapi.com` (not hardcoded). |
| P2-03 | Loading shows `<Spinner>`; failure shows a retry-able `<ErrorState>`; empty array shows a graceful message. |
| P2-04 | The external fetch reuses the shared `httpClient` and its typed `ApiError`. |
| P2-05 | `/` still renders the full portfolio; `ProfileProvider` still fetches once. |
| P2-06 | The Header has a working "Products" link; the Products page links back to "/". |
| P2-07 | No component calls `fetch` directly; only services do. |
| P2-08 | No hardcoded Strapi URL; the external base URL lives in the service layer, not in components. |
