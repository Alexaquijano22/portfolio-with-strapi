# Projects — Technical Design

> HOW the projects feature is built. Visual language in `spec/constitution.md §8`.
> Data contract in `spec/overview.md §3.3`.

---

## 1. Folder Structure

```
src/features/projects/
├── services/
│   └── projectsService.js     # getProjects() — calls httpClient, normalises coverImage URLs
├── hooks/
│   └── useProjects.js         # { data, loading, error, refetch }
├── components/
│   ├── Projects.jsx           # Section root: orchestrates hook and renders grid
│   └── ProjectCard.jsx        # Single project card
└── tests/
    ├── projectsService.test.js
    ├── useProjects.test.js
    └── Projects.test.jsx
```

---

## 2. `projectsService.js`

```js
import { httpClient } from '../../foundation/api/httpClient';

export async function getProjects() {
  const json = await httpClient('/api/projects?populate=*');

  return json.data.map(project => ({
    ...project,
    coverImage: project.coverImage
      ? { ...project.coverImage, url: `${import.meta.env.VITE_API_URL}${project.coverImage.url}` }
      : null,
  }));
}
```

- Returns a flat array preserving API order.
- Prefixes `coverImage.url` with `VITE_API_URL`; keeps `null` when absent.
- `liveUrl` and `repoUrl` are passed through as-is (may be `null`).
- `techStack` array is passed through as-is.

---

## 3. `useProjects.js`

```js
// Returns: { data: Project[] | null, loading: boolean, error: ApiError | null, refetch: fn }

const [data, setData]       = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError]     = useState(null);

async function load() {
  setLoading(true);
  setError(null);
  try   { setData(await getProjects()); }
  catch (err) { setError(err); }
  finally { setLoading(false); }
}

useEffect(() => { load(); }, []);
return { data, loading, error, refetch: load };
```

Called directly in `Projects.jsx`; no context needed (single consumer).

---

## 4. Component Contracts

### `Projects.jsx`
```
Render:
  <section id="projects">
    <h2>Projects</h2>

    {loading && <grid of skeleton cards (3 placeholders)>}
    {error   && <ErrorState error={error} onRetry={refetch} />}
    {!loading && !error && data?.length === 0 && <p>No projects listed yet.</p>}
    {!loading && !error && data?.length > 0 && (
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map(project => <ProjectCard key={project.id} project={project} />)}
      </div>
    )}
  </section>
```

### `ProjectCard.jsx`
```
Props: { project: { id, title, description, coverImage, techStack[], liveUrl, repoUrl } }

Render:
  <Card class="flex flex-col">
    {coverImage && <img src={coverImage.url} alt={title} class="w-full …" />}
    <h3>{title}</h3>
    <p>{description}</p>
    <div class="flex flex-wrap gap-2">
      {techStack.map(t => <Badge key={t.name} variant="muted">{t.name}</Badge>)}
    </div>
    <div class="flex gap-4 mt-auto">
      {liveUrl && <a href={liveUrl} target="_blank" rel="noopener noreferrer">Live ↗</a>}
      {repoUrl && <a href={repoUrl} target="_blank" rel="noopener noreferrer">Repo ↗</a>}
    </div>
  </Card>
```

Key constraints:
- `liveUrl` / `repoUrl` link elements are **not rendered** when the value is `null`.
- `coverImage` is rendered conditionally (may be `null`).
- `mt-auto` on the links container pushes links to the card bottom for equal-height rows.

---

## 5. Testing Strategy

### `projectsService.test.js`
- Mock `httpClient`.
- Test: returned project has absolute `coverImage.url` when cover is present.
- Test: returned project has `coverImage: null` when Strapi returns `null`.
- Test: `liveUrl: null` passes through as `null` (not coerced).
- Test: empty data array → returns `[]`.

### `useProjects.test.js`
- Mock `projectsService` with `vi.mock`.
- Test: loading → data on success.
- Test: loading → `ApiError` on failure.
- Test: `refetch` calls the service again.

### `Projects.test.jsx`
- Mock `useProjects`.
- Test: loading state → skeleton cards present; no real project content.
- Test: error state → `<ErrorState>` rendered.
- Test: empty array → "No projects listed yet." text; no card grid.
- Test: success with 2 projects → 2 `<ProjectCard>` elements rendered.
- Test: project with `liveUrl: null` → no live link element in the card.
- Test: project with `repoUrl: null` → no repo link element in the card.

---

## 6. Design Trade-offs

| Decision | Rationale |
|---|---|
| No context for projects | Single consumer; context overhead is unwarranted |
| API order preserved | No `displayOrder` or `featured` fields exist in the schema; ordering is the CMS editor's responsibility |
| `mt-auto` card link positioning | Pure CSS solution; no JavaScript required; works with CSS grid stretch |
| `coverImage` rendered conditionally | Consistent defensive pattern with the null-icon approach in `skills` |
| Muted badge variant for tech stack | Accent is reserved for interactive / categorical elements; tech chips are metadata |
