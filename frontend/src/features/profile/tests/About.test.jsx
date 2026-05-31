import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { About } from '../components/About.jsx';
import { useProfileContext } from '../context/ProfileContext.jsx';
import { ApiError } from '../../../shared/api/httpClient.js';

vi.mock('../context/ProfileContext.jsx', () => ({
  useProfileContext: vi.fn(),
}));

const success = (overrides) => ({
  data: { bio: 'A\n\nB', highlight: [], ...overrides },
  loading: false,
  error: null,
  refetch: vi.fn(),
});

describe('About', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('splits bio on \\n\\n into exactly two <p> elements', () => {
    useProfileContext.mockReturnValue(success({ bio: 'A\n\nB', highlight: [] }));

    const { container } = render(<About />);

    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0]).toHaveTextContent('A');
    expect(paragraphs[1]).toHaveTextContent('B');
  });

  it('renders one Card per highlight with its title', () => {
    useProfileContext.mockReturnValue(
      success({
        bio: 'Bio',
        highlight: [
          { title: 'Fast learner', description: 'desc 1' },
          { title: 'Team player', description: 'desc 2' },
        ],
      }),
    );

    render(<About />);

    const titles = screen.getAllByRole('heading', { level: 3 });
    expect(titles).toHaveLength(2);
    expect(screen.getByText('Fast learner')).toBeInTheDocument();
    expect(screen.getByText('Team player')).toBeInTheDocument();
  });

  it('does not crash and renders no highlight cards when highlight[] is empty', () => {
    useProfileContext.mockReturnValue(success({ bio: 'Only bio', highlight: [] }));

    render(<About />);

    expect(screen.getByText('Only bio')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
  });

  it('shows a skeleton while loading', () => {
    useProfileContext.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<About />);

    expect(screen.getByTestId('about-skeleton')).toBeInTheDocument();
  });

  it('shows ErrorState on error', () => {
    useProfileContext.mockReturnValue({
      data: null,
      loading: false,
      error: new ApiError('boom', 'network', 0),
      refetch: vi.fn(),
    });

    render(<About />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
