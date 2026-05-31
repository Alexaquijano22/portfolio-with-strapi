import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkillCard } from '../components/SkillCard.jsx';

describe('SkillCard', () => {
  it('renders an <img> with alt=name when the icon is present', () => {
    render(
      <SkillCard
        skill={{ id: 1, name: 'React', category: 'Frontend', icon: { url: 'http://api.test/react.svg' } }}
      />,
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'React');
    expect(img).toHaveAttribute('src', 'http://api.test/react.svg');
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Frontend')).toBeInTheDocument();
  });

  it('renders the initial-letter fallback (no <img>) when icon is null', () => {
    render(<SkillCard skill={{ id: 2, name: 'Figma', category: 'Tools', icon: null }} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('F')).toBeInTheDocument();
    expect(screen.getByText('Figma')).toBeInTheDocument();
  });
});
