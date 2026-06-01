# Products Demo — Task List

> Prerequisite: Exercise 1 complete. Work on branch `feature/products-demo` (not `main`).
> Tasks are ordered. Verify done-criteria before starting the next.

---

## D-00 · Install React Router

**Command:** `pnpm --dir frontend add react-router-dom`

**Done when:**
- `react-router-dom` appears in `frontend/package.json` dependencies and `pnpm-lock.yaml` updates.
- No other dependency changes.

---

## D-01 · Extend httpClient to support absolute URLs

**Files touched:**
`src/shared/api/httpClient.js`, `src/shared/api/httpClient.test.js`

**Steps:**
1. Change the URL build to pass through absolute URLs:
   `const url = /^https?:\/\//i.test(path) ? path : \`${import.meta.env.VITE_API_URL}${path}\`;`
2. Add a test case: when `path` starts with `http(s)://`, `fetch` is called with that exact URL
   (no `VITE_API_URL` prefix). Existing relative-path tests must still pass.

**Done when:**
- `pnpm test` passes, including the new absolute-URL case and all prior `httpClient` cases.
- Behavior for relative Strapi paths is unchanged.

---

## D-02 · Implement productService (external API)

**Files touched:**
`src/features/products/services/productService.js`,
`src/features/products/tests/productService.test.js`

**Steps:**
1. Implement `getProducts()` per `design.md §3`: call `httpClient('https://fakestoreapi.com/products')`
   (base URL as a module constant), return the array (coerce non-array to `[]`).
2. Test (mock `httpClient`): called with the absolute URL; returns the array; non-array → `[]`;
   `ApiError` propagates on rejection.

**Done when:**
- `pnpm test` passes all `productService.test.js` cases.
- `productService.js` does not call `fetch` directly; no Strapi/`VITE_API_URL` usage.

---

## D-03 · Implement productsPageService (Strapi copy)

**Files touched:**
`src/features/products/services/productsPageService.js`,
`src/features/products/tests/productsPageService.test.js`

**Steps:**
1. Implement `getProductsPage()` per `design.md §3`: `httpClient('/api/products-page')`, return `json.data`.
2. Test (mock `httpClient`): called with `/api/products-page`; returns the unwrapped `{ title, intro }`.

**Done when:**
- `pnpm test` passes all `productsPageService.test.js` cases.
- No hardcoded URL; no `fetch` call inside the service.

---

## D-04 · Implement useProducts and useProductsPage hooks

**Files touched:**
`src/features/products/hooks/useProducts.js`,
`src/features/products/hooks/useProductsPage.js`

**Steps:**
1. Implement both hooks per `design.md §4` (same shape as `useSkills`/`useProjects`):
   `{ data, loading, error, refetch }`, initial `loading: true`, `ApiError` captured.

**Done when:**
- Both hooks follow the established pattern and compile.
- (Hook behavior is exercised indirectly via the `ProductsPage` tests in D-05.)

---

## D-05 · Implement ProductsPage component

**Files touched:**
`src/features/products/components/ProductsPage.jsx`,
`src/features/products/tests/ProductsPage.test.jsx`

**Steps:**
1. Implement `ProductsPage` per `design.md §5`: compose both hooks; combined `loading`/`error`/`refetch`.
   - Loading → `<Spinner />`; error → `<ErrorState error={error} onRetry={refetch} />`.
   - Success → `<h1>{title}</h1>`, `<p>{intro}</p>`, then `<ul>` of product titles.
   - Empty array → graceful "No products available right now." (heading/intro still render).
   - Include a `<Link to="/">` back to the portfolio. Use theme tokens; mobile-first container.
2. Test (mock both hooks): loading → Spinner; error → ErrorState; empty → message + heading/intro;
   success → `<h1>` has Strapi title and product titles render as `<li>`.

**Done when:**
- `pnpm test` passes all `ProductsPage.test.jsx` cases.
- No `fetch` in the component; data comes only from the hooks.

---

## D-06 · Add routing and wire into App.jsx + Header

**Files touched:**
`src/App.jsx`, `src/features/profile/components/Header.jsx`

**Steps:**
1. Wrap the app in `<BrowserRouter>` with routes `/` (portfolio) and `/products` (`ProductsPage`)
   per `design.md §6`. Move the current `Layout` (ProfileProvider + Header + sections + Footer +
   SEO effect) behind the `/` route as `PortfolioPage`, unchanged.
2. Add a `"Products"` `<Link to="/products">` to the Header nav (section anchors stay as-is).

**Done when:**
- `pnpm dev`: `/` shows the full portfolio (profile data still loads once); `/products` shows the
  Strapi copy + live product titles; the Header "Products" link and the page's "Home" link work.
- `pnpm build` exits 0. `pnpm test` exits 0 (all Exercise 1 + Exercise 2 tests pass).

---

## Checkpoint: Products Demo Complete

| Check | Pass? |
|---|---|
| On branch `feature/products-demo`; nothing committed to `main` | |
| `/products` renders Strapi `title` + `intro` (no hardcoded copy) | |
| Product titles come live from fakestoreapi (reusing shared `httpClient` + `ApiError`) | |
| Loading → `<Spinner>`; error → retry-able `<ErrorState>`; empty → graceful message | |
| `/` portfolio unchanged; `ProfileProvider` still fetches once | |
| Header "Products" link works; Products page links back to `/` | |
| No `fetch` outside services; no hardcoded Strapi URL | |
| `pnpm test` and `pnpm build` both green | |
