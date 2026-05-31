# Skills — Technical Design

> HOW the skills feature is built. Visual language in `spec/constitution.md §8`.
> Data contract in `spec/overview.md §3.2`.

---

## 1. Folder Structure

```
src/features/skills/
├── services/
│   └── skillsService.js       # getSkills() — calls httpClient, normalises icon URLs
├── hooks/
│   └── useSkills.js           # { data, loading, error, refetch }
├── components/
│   ├── Skills.jsx             # Section root: orchestrates hook, filters, grid
│   ├── SkillCard.jsx          # Single skill card (icon fallback, name, badge)
│   └── CategoryFilter.jsx     # Filter pill buttons
└── tests/
    ├── skillsService.test.js
    ├── useSkills.test.js
    └── Skills.test.jsx
```

---

## 2. `skillsService.js`

```js
import { httpClient } from '../../../shared/api/httpClient.js';

export async function getSkills() {
  const json = await httpClient('/api/skills?populate=*');

  return json.data.map(skill => ({
    ...skill,
    icon: skill.icon
      ? { ...skill.icon, url: `${import.meta.env.VITE_API_URL}${skill.icon.url}` }
      : null,         // preserve null; do not invent a URL
  }));
}
```

- Returns a flat array (unwrapped from the Strapi envelope).
- `icon` remains `null` when Strapi returns `null`; components must handle both cases.
- No sorting or grouping — left to the component layer.

---

## 3. `useSkills.js`

```js
// Returns: { data: Skill[] | null, loading: boolean, error: ApiError | null, refetch: fn }

const [data, setData]       = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError]     = useState(null);

async function load() {
  setLoading(true);
  setError(null);
  try   { setData(await getSkills()); }
  catch (err) { setError(err); }
  finally { setLoading(false); }
}

useEffect(() => { load(); }, []);
return { data, loading, error, refetch: load };
```

Unlike `useProfile`, this hook is **not** shared via context — it is called directly inside
`Skills.jsx` because only one section consumes skills data.

---

## 4. Component Contracts

### `Skills.jsx`
```
State: activeCategory = 'All'  (local useState)

Derived:
  filteredSkills = activeCategory === 'All'
    ? data
    : data.filter(s => s.category === activeCategory)

Render:
  <section id="skills">
    <h2>Skills</h2>

    {loading && <grid of skeleton cards>}
    {error   && <ErrorState error={error} onRetry={refetch} />}
    {!loading && !error && data?.length === 0 && <p>No skills listed yet.</p>}
    {!loading && !error && data?.length > 0 && (
      <>
        <CategoryFilter
          categories={['All', 'Frontend', 'Backend', 'Tools']}
          active={activeCategory}
          onChange={setActiveCategory}
        />
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSkills.map(skill => <SkillCard key={skill.id} skill={skill} />)}
        </div>
      </>
    )}
  </section>
```

### `SkillCard.jsx`
```
Props: { skill: { id, name, category, icon: { url } | null } }

Render:
  <Card>
    {skill.icon
      ? <img src={skill.icon.url} alt={skill.name} class="w-8 h-8" />
      : <span aria-hidden="true" class="w-8 h-8 …">{skill.name[0]}</span>  // initial fallback
    }
    <p>{skill.name}</p>
    <Badge variant="accent">{skill.category}</Badge>
  </Card>
```

The fallback renders the skill's first letter in a styled circle. No broken-image element is
ever rendered.

### `CategoryFilter.jsx`
```
Props: {
  categories: string[],
  active: string,
  onChange: (category: string) => void
}

Render:
  <div role="group" aria-label="Filter skills by category">
    {categories.map(cat => (
      <button
        key={cat}
        aria-pressed={active === cat}
        onClick={() => onChange(cat)}
        class={active === cat ? 'bg-[--color-accent] text-white …' : '… muted styles …'}
      >
        {cat}
      </button>
    ))}
  </div>
```

---

## 5. Testing Strategy

### `skillsService.test.js`
- Mock `httpClient`.
- Test: returned array items have absolute `icon.url` when icon is present.
- Test: returned array items have `icon: null` when Strapi returns `null` for icon.
- Test: empty array returned when Strapi returns `data: []`.

### `useSkills.test.js`
- Mock `skillsService` with `vi.mock`.
- Test: loading → data on success.
- Test: loading → error (`ApiError`) on failure.
- Test: `refetch` calls the service again.

### `Skills.test.jsx`
- Mock `useSkills`.
- Test: loading state → skeleton cards present; no real skill content.
- Test: error state → `<ErrorState>` rendered.
- Test: empty array → "No skills listed yet." text; no filter buttons.
- Test: data with mixed categories → clicking "Frontend" hides non-Frontend skills.
- Test: skill with `icon: null` renders without crash (no `<img>` element for that skill).

---

## 6. Design Trade-offs

| Decision | Rationale |
|---|---|
| No Context for skills | Only `Skills.jsx` consumes skill data; context overhead is unwarranted |
| Client-side filtering only | No pagination or large data volumes expected; avoids extra network calls |
| Initial-letter fallback for null icon | Zero dependencies; visually consistent with the card grid; avoids broken-image |
| `CategoryFilter` is a pure/controlled component | Keeps filter state in `Skills.jsx`; `CategoryFilter` is stateless and easily testable |
