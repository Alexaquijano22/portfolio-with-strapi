import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner.jsx';

describe('Spinner', () => {
  it('renders a loading status without crashing', () => {
    render(<Spinner />);
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
  });
});
