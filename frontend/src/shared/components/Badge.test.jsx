import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge.jsx';

describe('Badge', () => {
  it('renders its children with the accent-color class applied', () => {
    render(<Badge variant="accent">React</Badge>);

    const badge = screen.getByText('React');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-[--color-accent]');
  });

  it('falls back to the muted variant by default', () => {
    render(<Badge>Tools</Badge>);
    expect(screen.getByText('Tools')).toHaveClass('text-[--color-muted]');
  });
});
