import { describe, it, expect, vi, beforeEach } from 'vitest';
import { httpClient } from '../../../shared/api/httpClient.js';
import { getProjects } from '../services/projectsService.js';

vi.mock('../../../shared/api/httpClient.js', () => ({
  httpClient: vi.fn(),
}));

describe('projectsService.getProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('VITE_API_URL', 'http://api.test');
  });

  it('makes coverImage.url absolute when a cover is present', async () => {
    httpClient.mockResolvedValue({
      data: [
        {
          id: 1,
          title: 'Portfolio',
          coverImage: { url: '/uploads/cover.png', formats: null },
          liveUrl: 'https://example.com',
          repoUrl: 'https://github.com/x/y',
          techStack: [{ name: 'React' }],
        },
      ],
    });

    const projects = await getProjects();

    expect(httpClient).toHaveBeenCalledWith('/api/projects?populate=*');
    expect(projects[0].coverImage.url).toBe('http://api.test/uploads/cover.png');
  });

  it('preserves coverImage: null without inventing a URL', async () => {
    httpClient.mockResolvedValue({
      data: [{ id: 2, title: 'No cover', coverImage: null, liveUrl: null, repoUrl: null, techStack: [] }],
    });

    const projects = await getProjects();

    expect(projects[0].coverImage).toBeNull();
  });

  it('passes liveUrl: null through as null (not coerced)', async () => {
    httpClient.mockResolvedValue({
      data: [{ id: 3, title: 'WIP', coverImage: null, liveUrl: null, repoUrl: 'https://repo', techStack: [] }],
    });

    const projects = await getProjects();

    expect(projects[0].liveUrl).toBeNull();
    expect(projects[0].repoUrl).toBe('https://repo');
  });

  it('returns an empty array when data is []', async () => {
    httpClient.mockResolvedValue({ data: [] });

    const projects = await getProjects();

    expect(projects).toEqual([]);
  });
});
