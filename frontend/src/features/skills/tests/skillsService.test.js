import { describe, it, expect, vi, beforeEach } from 'vitest';
import { httpClient } from '../../../shared/api/httpClient.js';
import { getSkills } from '../services/skillsService.js';

vi.mock('../../../shared/api/httpClient.js', () => ({
  httpClient: vi.fn(),
}));

describe('skillsService.getSkills', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('VITE_API_URL', 'http://api.test');
  });

  it('makes icon.url absolute when an icon is present', async () => {
    httpClient.mockResolvedValue({
      data: [
        { id: 1, name: 'React', category: 'Frontend', icon: { url: '/uploads/react.svg', formats: null } },
      ],
    });

    const skills = await getSkills();

    expect(httpClient).toHaveBeenCalledWith('/api/skills?populate=*');
    expect(skills[0].icon.url).toBe('http://api.test/uploads/react.svg');
  });

  it('preserves icon: null without inventing a URL', async () => {
    httpClient.mockResolvedValue({
      data: [{ id: 2, name: 'Figma', category: 'Tools', icon: null }],
    });

    const skills = await getSkills();

    expect(skills[0].icon).toBeNull();
  });

  it('returns an empty array when data is []', async () => {
    httpClient.mockResolvedValue({ data: [] });

    const skills = await getSkills();

    expect(skills).toEqual([]);
  });
});
