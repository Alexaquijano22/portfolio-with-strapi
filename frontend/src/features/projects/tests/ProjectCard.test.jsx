import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectCard } from '../components/ProjectCard.jsx';

const baseProject = {
  id: 1,
  title: 'Portfolio',
  description: 'A personal site',
  coverImage: { url: 'http://api.test/cover.png' },
  techStack: [{ name: 'React' }, { name: 'Vite' }],
  liveUrl: 'https://example.com',
  repoUrl: 'https://github.com/x/y',
};

describe('ProjectCard', () => {
  it('renders cover, title, description, badges and both links when all fields are present', () => {
    render(<ProjectCard project={baseProject} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'Portfolio');
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Portfolio');
    expect(screen.getByText('A personal site')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Vite')).toBeInTheDocument();

    const live = screen.getByRole('link', { name: /live/i });
    const repo = screen.getByRole('link', { name: /repo/i });
    expect(live).toHaveAttribute('href', 'https://example.com');
    expect(live).toHaveAttribute('target', '_blank');
    expect(live).toHaveAttribute('rel', 'noopener noreferrer');
    expect(repo).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('omits the live link element when liveUrl is null', () => {
    render(<ProjectCard project={{ ...baseProject, liveUrl: null }} />);

    expect(screen.queryByRole('link', { name: /live/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /repo/i })).toBeInTheDocument();
  });

  it('omits the repo link element when repoUrl is null', () => {
    render(<ProjectCard project={{ ...baseProject, repoUrl: null }} />);

    expect(screen.queryByRole('link', { name: /repo/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /live/i })).toBeInTheDocument();
  });

  it('renders no <img> when coverImage is null', () => {
    render(<ProjectCard project={{ ...baseProject, coverImage: null }} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Portfolio');
  });
});
