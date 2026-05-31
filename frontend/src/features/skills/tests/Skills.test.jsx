import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Skills } from '../components/Skills.jsx';
import { useSkills } from '../hooks/useSkills.js';
import { ApiError } from '../../../shared/api/httpClient.js';

vi.mock('../hooks/useSkills.js', () => ({
  useSkills: vi.fn(),
}));

const MIXED = [
  { id: 1, name: 'React', category: 'Frontend', icon: null },
  { id: 2, name: 'Node', category: 'Backend', icon: null },
];

describe('Skills', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows skeleton cards and no filter buttons while loading', () => {
    useSkills.mockReturnValue({ data: null, loading: true, error: null, refetch: vi.fn() });

    render(<Skills />);

    expect(screen.getByTestId('skills-skeleton')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows ErrorState on error', () => {
    useSkills.mockReturnValue({
      data: null,
      loading: false,
      error: new ApiError('boom', 'network', 0),
      refetch: vi.fn(),
    });

    render(<Skills />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows the empty message and no filter buttons when the array is empty', () => {
    useSkills.mockReturnValue({ data: [], loading: false, error: null, refetch: vi.fn() });

    render(<Skills />);

    expect(screen.getByText('No skills listed yet.')).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: /filter skills/i })).not.toBeInTheDocument();
  });

  it('filters out non-matching skills when a category is clicked', async () => {
    useSkills.mockReturnValue({ data: MIXED, loading: false, error: null, refetch: vi.fn() });

    render(<Skills />);

    // All visible by default
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Frontend' }));

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.queryByText('Node')).not.toBeInTheDocument();
  });

  it('renders a skill with icon: null without crashing (no <img> for it)', () => {
    useSkills.mockReturnValue({
      data: [{ id: 1, name: 'React', category: 'Frontend', icon: null }],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<Skills />);

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
