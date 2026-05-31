# Profile — Technical Design

> HOW the profile feature is built. Visual language in `spec/constitution.md §8`.
> Data contract in `spec/overview.md §3.1`.

---

## 1. Folder Structure

```
src/features/profile/
├── services/
│   └── profileService.js      # getProfile() — calls httpClient, normalises response
├── hooks/
│   └── useProfile.js          # { data, loading, error, refetch }
├── context/
│   └── ProfileContext.jsx     # Provider + useProfileContext() consumer hook
├── components/
│   ├── Header.jsx
│   ├── Hero.jsx
│   ├── About.jsx
│   └── Footer.jsx
└── tests/
    ├── profileService.test.js
    ├── useProfile.test.js
    ├── Hero.test.jsx
    └── About.test.jsx
```

---

## 2. `profileService.js`

```js
import { httpClient } from '../../../shared/api/httpClient.js';

export async function getProfile() {
  const json = await httpClient('/api/profile?populate=*');
  const data = json.data;

  // Prefix relative avatar URL; SVG avatars have formats: null so always use base url
  if (data.avatar?.url) {
    data.avatar.url = `${import.meta.env.VITE_API_URL}${data.avatar.url}`;
  }

  return data;
}
```

- Returns the unwrapped profile object (not the envelope).
- Mutates `avatar.url` to an absolute URL before returning.
- All `highlight[]` and `socialLink[]` arrays pass through as-is (already flat in Strapi 5).

---

## 3. `useProfile.js`

```js
// Returns: { data: ProfileObject | null, loading: boolean, error: ApiError | null, refetch: fn }

const [data, setData]       = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError]     = useState(null);

async function load() {
  setLoading(true);
  setError(null);
  try   { setData(await getProfile()); }
  catch (err) { setError(err); }       // err is always ApiError
  finally { setLoading(false); }
}

useEffect(() => { load(); }, []);
return { data, loading, error, refetch: load };
```

- `useProfile` is called **once** — inside `ProfileProvider`.
- Section components never call `useProfile` directly; they consume context.

---

## 4. `ProfileContext.jsx`

```jsx
const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const profileState = useProfile();   // { data, loading, error, refetch }
  return (
    <ProfileContext.Provider value={profileState}>
      {children}
    </ProfileContext.Provider>
  );
}

// Convenience hook — throws a clear error if used outside the provider
export function useProfileContext() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfileContext must be used inside <ProfileProvider>');
  return ctx;
}
```

`ProfileProvider` wraps the entire app tree in `App.jsx` so all four sections can consume it.

---

## 5. Component Contracts

### `Header.jsx`
```
Reads:  useProfileContext() → { data, loading }
Renders:
  <header class="sticky top-0 …">
    <nav aria-label="Main navigation">
      <span>{loading ? <Spinner/> : data.fullName}</span>
      <a href="#hero">Home</a>  <a href="#about">About</a>
      <a href="#skills">Skills</a>  <a href="#projects">Projects</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>
Error: silently omits fullName; nav links remain usable.
```

### `Hero.jsx`
```
Reads:  useProfileContext() → { data, loading, error, refetch }
Renders (success):
  <section id="hero" class="min-h-screen …">
    <img src={data.avatar.url} alt={data.fullName} />
    <h1>{data.fullName}</h1>
    <h2>{data.role}</h2>
    <p>{data.tagline}</p>
    <a href="#projects" class="… accent button …">View my work</a>
  </section>
Loading: 4 SkeletonBlocks (avatar shape, h1, h2, p)
Error:   <ErrorState error={error} onRetry={refetch} />
```

### `About.jsx`
```
Reads:  useProfileContext() → { data, loading, error, refetch }
Renders (success):
  <section id="about">
    {data.bio.split('\n\n').map(p => <p key={p}>{p}</p>)}
    <div class="grid …">
      {data.highlight.map(h => <Card key={h.title}><h3>{h.title}</h3><p>{h.description}</p></Card>)}
    </div>
  </section>
Loading: skeleton lines + ghost cards
Error:   <ErrorState error={error} onRetry={refetch} />
Empty highlight[]: omit the grid; render bio only
```

### `Footer.jsx`
```
Reads:  useProfileContext() → { data, loading }
Renders:
  <footer id="contact" role="contentinfo">
    <a href={`mailto:${data.email}`}>{data.email}</a>
    {data.socialLink.map(s => <a href={s.url} target="_blank" rel="noopener noreferrer">{s.platform}</a>)}
    <p>© {new Date().getFullYear()} {data.fullName}</p>
  </footer>
Loading: skeleton blocks
Error:   static "Contact info unavailable" text (no retry)
```

---

## 6. Testing Strategy

### `profileService.test.js`
- Mock `httpClient` with `vi.mock`.
- Assert: returned object has `fullName`, `avatar.url` is absolute (starts with `VITE_API_URL`).
- Assert: when `avatar` is `null`, no crash occurs and `null` is returned for avatar.

### `useProfile.test.js`
- Mock `profileService` with `vi.mock`.
- Use `renderHook` from RTL.
- Test: `loading=true` initially → `data` populated on resolve.
- Test: `loading=true` initially → `error` is `ApiError` on rejection.
- Test: calling `refetch` invokes the service a second time.

### `Hero.test.jsx`
- Mock `useProfileContext` to return controlled values.
- Three render tests: loading state → skeletons visible; error state → `ErrorState` visible;
  success state → `<h1>` contains `fullName`, `<img>` has non-empty `alt`.

### `About.test.jsx`
- Mock `useProfileContext`.
- Assert: bio `"Para one\n\nPara two"` produces exactly 2 `<p>` elements.
- Assert: 2 highlight items produce 2 `<Card>` elements.
- Assert: empty `highlight[]` does not crash.

---

## 7. Design Trade-offs

| Decision | Rationale |
|---|---|
| Context instead of prop-threading | Four components across the tree consume Profile; context avoids a long prop chain through `App.jsx` |
| `useProfile` called once in the Provider | Guarantees a single network request regardless of how many consumers mount |
| Footer shows static error text (no retry) | Footer errors are non-critical; a retry button in the footer is poor UX |
| `data.avatar.url` mutated in the service | Keeps components free of URL-construction logic; consistent with `constitution.md §3` |
