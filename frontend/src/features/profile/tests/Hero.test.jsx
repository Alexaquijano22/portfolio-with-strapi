import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '../components/Hero.jsx';
import { useProfileContext } from '../context/ProfileContext.jsx';
import { ApiError } from '../../../shared/api/httpClient.js';

vi.mock('../context/ProfileContext.jsx', () => ({
  useProfileContext: vi.fn(),
}));

describe('Hero', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows a skeleton and no <h1> while loading', () => {
    useProfileContext.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<Hero />);

    expect(screen.getByTestId('hero-skeleton')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('shows ErrorState with a Retry button on error', () => {
    useProfileContext.mockReturnValue({
      data: null,
      loading: false,
      error: new ApiError('boom', 'server', 500),
      refetch: vi.fn(),
    });

    render(<Hero />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('renders the heading, an avatar with non-empty alt, and the CTA on success', () => {
    useProfileContext.mockReturnValue({
      data: {
        fullName: 'Ada Lovelace',
        role: 'Software Engineer',
        tagline: 'I build things.',
        avatar: { url: 'http://api.test/uploads/ada.svg' },
      },
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<Hero />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Ada Lovelace');
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'Ada Lovelace');
    expect(img.getAttribute('alt')).not.toBe('');
    expect(screen.getByRole('link', { name: /view my work/i })).toHaveAttribute(
      'href',
      '#projects',
    );
  });
});
