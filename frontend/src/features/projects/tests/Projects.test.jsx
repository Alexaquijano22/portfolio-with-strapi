import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Projects } from '../components/Projects.jsx';
import { useProjects } from '../hooks/useProjects.js';
import { ApiError } from '../../../shared/api/httpClient.js';

vi.mock('../hooks/useProjects.js', () => ({
  useProjects: vi.fn(),
}));

const project = (overrides) => ({
  id: 1,
  title: 'Alpha',
  description: 'desc',
  coverImage: null,
  techStack: [],
  liveUrl: 'https://live',
  repoUrl: 'https://repo',
  ...overrides,
});

describe('Projects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows skeleton cards and no real content while loading', () => {
    useProjects.mockReturnValue({ data: null, loading: true, error: null, refetch: vi.fn() });

    render(<Projects />);

    expect(screen.getByTestId('projects-skeleton')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
  });

  it('shows ErrorState on error', () => {
    useProjects.mockReturnValue({
      data: null,
      loading: false,
      error: new ApiError('boom', 'network', 0),
      refetch: vi.fn(),
    });

    render(<Projects />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows the empty message and no grid when the array is empty', () => {
    useProjects.mockReturnValue({ data: [], loading: false, error: null, refetch: vi.fn() });

    render(<Projects />);

    expect(screen.getByText('No projects listed yet.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
  });

  it('renders one card per project (in API order)', () => {
    useProjects.mockReturnValue({
      data: [project({ id: 1, title: 'Alpha' }), project({ id: 2, title: 'Beta' })],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<Projects />);

    const titles = screen.getAllByRole('heading', { level: 3 });
    expect(titles).toHaveLength(2);
    expect(titles[0]).toHaveTextContent('Alpha');
    expect(titles[1]).toHaveTextContent('Beta');
  });

  it('omits the live link when a project has liveUrl: null', () => {
    useProjects.mockReturnValue({
      data: [project({ liveUrl: null })],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<Projects />);

    expect(screen.queryByRole('link', { name: /live/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /repo/i })).toBeInTheDocument();
  });

  it('omits the repo link when a project has repoUrl: null', () => {
    useProjects.mockReturnValue({
      data: [project({ repoUrl: null })],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<Projects />);

    expect(screen.queryByRole('link', { name: /repo/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /live/i })).toBeInTheDocument();
  });
});
