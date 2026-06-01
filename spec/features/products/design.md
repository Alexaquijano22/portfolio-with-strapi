# Products Demo — Technical Design

> HOW the products feature is built. Visual language in `spec/constitution.md §8`.
> Requirements in `requirements.md`. Reuses the Exercise 1 shared layer.

---

## 1. Folder structure

```
src/features/products/
├── services/
│   ├── productService.js         # getProducts() — external fakestoreapi (via shared httpClient)
│   └── productsPageService.js    # getProductsPage() — Strapi /api/products-page copy
├── hooks/
│   ├── useProducts.js            # { data: Product[]|null, loading, error, refetch }
│   └── useProductsPage.js        # { data: {title,intro}|null, loading, error, refetch }
├── components/
│   ├── ProductsPage.jsx          # Route page: composes both hooks + Strapi copy + product grid
│   └── ProductCard.jsx           # Single store-style product card (image, title, price, rating, badge)
└── tests/
    ├── productService.test.js
    ├── productsPageService.test.js
    └── ProductsPage.test.jsx
```

Routing lives in `src/App.jsx` (composition root); the Header link change is in
`src/features/profile/components/Header.jsx`.

---

## 2. Reusing `httpClient` for an external API

The shared client currently always prefixes `VITE_API_URL`:

```js
const url = `${import.meta.env.VITE_API_URL}${path}`;
```

To call `fakestoreapi.com` through the **same** typed-error layer (instead of a second raw
`fetch`), extend it with a minimal, backward-compatible rule: **if `path` is already an absolute
URL (`http://` or `https://`), use it as-is; otherwise prefix `VITE_API_URL`.**

```js
const url = /^https?:\/\//i.test(path) ? path : `${import.meta.env.VITE_API_URL}${path}`;
```

- Strapi calls (relative paths like `/api/products-page`) behave exactly as before.
- External calls pass the full URL; all `ApiError` classification (4xx → client, 5xx → server,
  thrown → network) is reused unchanged.
- This keeps the rule "only `httpClient` calls `fetch`" intact and adds no second HTTP layer.

The external base URL is **not** hardcoded in components: it lives as a module constant in
`productService.js` (a fixed third-party endpoint). Optionally it may be read from an env var
(e.g. `VITE_PRODUCTS_API_URL`) for configurability; the constant is acceptable since it is a
third-party API base, not the app's own backend.

---

## 3. Services

### `productService.js`
```js
import { httpClient } from '../../../shared/api/httpClient.js';

const PRODUCTS_API = 'https://fakestoreapi.com/products';

export async function getProducts() {
  const data = await httpClient(PRODUCTS_API); // absolute URL → no VITE_API_URL prefix
  return Array.isArray(data) ? data : [];      // external API returns a bare array (no envelope)
}
```
- Returns the raw array. No Strapi envelope (`.data`) here — fakestoreapi returns the array directly.
- Errors propagate as `ApiError` from `httpClient`.

### `productsPageService.js`
```js
import { httpClient } from '../../../shared/api/httpClient.js';

export async function getProductsPage() {
  const json = await httpClient('/api/products-page'); // relative → prefixed with VITE_API_URL
  return json.data;                                    // Strapi 5 flat object { title, intro }
}
```
- Single type → unwraps `.data`. No `populate` needed.

---

## 4. Hooks

Two hooks following the Exercise 1 pattern (one service → one hook, `{ data, loading, error, refetch }`):

```js
// useProducts.js / useProductsPage.js — identical shape to useSkills/useProjects
const [data, setData]       = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError]     = useState(null);

const load = useCallback(async () => {
  setLoading(true); setError(null);
  try   { setData(await getX()); }
  catch (err) { setError(err); }   // ApiError
  finally { setLoading(false); }
}, []);

useEffect(() => { load(); }, [load]);
return { data, loading, error, refetch: load };
```

`ProductsPage` composes both (see §5). Keeping them separate mirrors the existing features and
keeps each independently testable; no Context is needed (single consumer page).

---

## 5. Component contract — `ProductsPage.jsx`

```
Reads:  useProductsPage() → { data: page,     loading: lP, error: eP, refetch: rP }
        useProducts()     → { data: products, loading: lL, error: eL, refetch: rL }

Derived:
  loading = lP || lL
  error   = eP ?? eL
  refetch = () => { rP(); rL(); }   // retry whichever data is needed

Render:
  <main id="products" class="mx-auto max-w-5xl px-6 py-16">
    <Link to="/">← Back to portfolio</Link>

    {loading && <Spinner />}
    {!loading && error && <ErrorState error={error} onRetry={refetch} />}
    {!loading && !error && (
      <>
        <h1>{page.title}</h1>
        <p>{page.intro}</p>

        {products.length === 0
          ? <p>No products available right now.</p>
          : <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>}
      </>
    )}
  </main>
```

- Heading/intro come from Strapi; the grid renders one `ProductCard` per external product.
- Uses theme tokens (`text-text`, `text-muted`, `text-accent`) — same dark palette + accent.

### `ProductCard.jsx`

```
Props: { product: { id, title, price, category, image, rating: { rate, count } } }

Render (reusing shared Card + Badge):
  <Card class="flex h-full flex-col gap-3">
    <div class="… h-44 bg-neutral-100 …">          // light neutral image area
      <img src={image} alt={title} class="h-full w-full object-contain" loading="lazy" />
    </div>
    <h3 class="line-clamp-2 …">{title}</h3>         // clamp to ~2 lines → even card height
    <div class="mt-auto …">
      <span>{formatUSD(price)}</span>               // Intl.NumberFormat USD, e.g. $109.95
      <span>★ {rating.rate} ({rating.count})</span> // star tinted with accent
      <Badge variant="accent">{category}</Badge>
    </div>
  </Card>
```

- The `image` URL is already absolute (fakestoreapi) → used as-is, no `VITE_API_URL` prefix.
- `object-contain` on a light area keeps white-background product photos intentional and undistorted.
- `price`, `rating`, and `category` are rendered defensively (guarded when absent).

---

## 6. Routing & App.jsx reorganization

Introduce React Router (`react-router-dom`) at the composition root, preserving the portfolio:

```jsx
// App.jsx (sketch)
<BrowserRouter>
  <Routes>
    <Route path="/" element={<PortfolioPage />} />
    <Route path="/products" element={<ProductsPage />} />
  </Routes>
</BrowserRouter>
```

- `PortfolioPage` = the current `Layout` (the `ProfileProvider` + Header + `<main>` with Hero/About/
  Skills/Projects + Footer, and the `seoDescription` effect). It is **moved verbatim** behind the
  `/` route, so `ProfileProvider` stays scoped to the portfolio and is still mounted once.
- `ProductsPage` is independent and does **not** need `ProfileProvider`.

### Header link
Add a `"Products"` entry to the Header nav as a router `<Link to="/products">` (the existing
section entries stay as in-page anchors `#hero`, `#about`, … which are valid on `/`). The Products
page offers its own `<Link to="/">` back to the portfolio. (Trade-off: the full Header lives on the
portfolio route; the Products page uses a lightweight back link rather than re-rendering the
section-anchor nav, which would point at sections that don't exist on `/products`.)

---

## 7. Testing strategy

### `productService.test.js`
- Mock `httpClient`. Assert `getProducts()` calls it with the absolute fakestoreapi URL and returns
  the array. Assert a non-array response coerces to `[]`. Assert `ApiError` propagates on rejection.

### `productsPageService.test.js`
- Mock `httpClient`. Assert it is called with `/api/products-page` and returns the unwrapped
  `{ title, intro }` object.

### `ProductsPage.test.jsx`
- Mock `useProducts` and `useProductsPage`.
- Loading → `<Spinner>` (role="status") visible; no list.
- Error → `<ErrorState>` (role="alert") visible.
- Empty products array → graceful "No products…" message; heading/intro still render.
- Success → `<h1>` has the Strapi title; one product card (`<h3>` title) per product, with the
  formatted price, category badge, and an image whose `alt` equals the title.

(`httpClient`'s absolute-URL extension is covered by adding a case to the existing
`httpClient.test.js`: an absolute path is not prefixed with `VITE_API_URL`.)

---

## 8. Design trade-offs

| Decision | Rationale |
|---|---|
| Extend `httpClient` for absolute URLs | Reuses the typed `ApiError` layer for the external API; avoids a second `fetch` path; backward-compatible with all Strapi calls |
| Two services + two hooks | Mirrors Exercise 1 (one source → one service → one hook); each is independently testable |
| Compose both hooks in the page | The page needs both sources; combined `loading`/`error`/`refetch` keep UX states simple |
| `PortfolioPage` behind `/`, provider unchanged | Router added without touching profile data flow; `ProfileProvider` stays scoped and single-fetch |
| External base URL as a service constant | Third-party endpoint, not the app's backend; kept out of components (optionally env-configurable) |
| No Context for products | Single consumer (the page); Context overhead unwarranted |
| Store-style card grid reusing `Card`/`Badge` | Visual consistency with Exercise 1; no new primitives |
| Light neutral image area + `object-contain` | fakestoreapi photos have white backgrounds; keeps them intentional and undistorted on the dark theme |
