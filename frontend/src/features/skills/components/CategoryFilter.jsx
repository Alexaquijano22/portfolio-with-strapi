// Controlled, stateless filter pills. Parent (Skills.jsx) owns the active state.
export function CategoryFilter({ categories, active, onChange }) {
  return (
    <div
      role="group"
      aria-label="Filter skills by category"
      className="mb-8 flex flex-wrap gap-2"
    >
      {categories.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-bg] ${
              isActive
                ? 'bg-[--color-accent] text-[--color-bg]'
                : 'bg-[--color-surface] text-[--color-muted] hover:text-[--color-text]'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryFilter;
