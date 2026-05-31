import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card.jsx';

describe('Card', () => {
  it('renders children inside a styled surface container', () => {
    render(
      <Card>
        <p>hello</p>
      </Card>,
    );

    const text = screen.getByText('hello');
    expect(text).toBeInTheDocument();
    expect(text.parentElement).toHaveClass('bg-[--color-surface]');
  });
});
