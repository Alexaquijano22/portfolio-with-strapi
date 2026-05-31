import { useState } from 'react';
import { ErrorState } from '../../../shared/components/ErrorState.jsx';
import { useSkills } from '../hooks/useSkills.js';
import { CategoryFilter } from './CategoryFilter.jsx';
import { SkillCard } from './SkillCard.jsx';

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Tools'];

function SkillsSkeleton() {
  return (
    <div
      data-testid="skills-skeleton"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-32 animate-pulse rounded-xl bg-surface" />
      ))}
    </div>
  );
}

export function Skills() {
  const { data, loading, error, refetch } = useSkills();
  const [activeCategory, setActiveCategory] = useState('All');

  // Client-side filtering only — no extra network call.
  const filteredSkills =
    activeCategory === 'All' ? data : data.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="mx-auto max-w-[1280px] px-6 py-16">
      <h2 className="mb-8 text-3xl font-bold text-text">Skills</h2>

      {loading && <SkillsSkeleton />}

      {!loading && error && <ErrorState error={error} onRetry={refetch} />}

      {!loading && !error && data?.length === 0 && (
        <p className="text-muted">No skills listed yet.</p>
      )}

      {!loading && !error && data?.length > 0 && (
        <>
          <CategoryFilter
            categories={CATEGORIES}
            active={activeCategory}
            onChange={setActiveCategory}
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filteredSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default Skills;
