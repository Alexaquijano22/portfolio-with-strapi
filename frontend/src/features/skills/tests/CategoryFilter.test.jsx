import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryFilter } from '../components/CategoryFilter.jsx';

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Tools'];

describe('CategoryFilter', () => {
  it('renders one button per category and marks the active one with aria-pressed', () => {
    render(<CategoryFilter categories={CATEGORIES} active="Frontend" onChange={() => {}} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
    expect(screen.getByRole('button', { name: 'Frontend' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('calls onChange with the clicked category', async () => {
    const onChange = vi.fn();
    render(<CategoryFilter categories={CATEGORIES} active="All" onChange={onChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Backend' }));
    expect(onChange).toHaveBeenCalledWith('Backend');
  });
});
