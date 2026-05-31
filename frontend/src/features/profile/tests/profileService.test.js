import { describe, it, expect, vi, beforeEach } from 'vitest';
import { httpClient } from '../../../shared/api/httpClient.js';
import { getProfile } from '../services/profileService.js';

vi.mock('../../../shared/api/httpClient.js', () => ({
  httpClient: vi.fn(),
}));

describe('profileService.getProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('VITE_API_URL', 'http://api.test');
  });

  it('unwraps the envelope and returns an object with an absolute avatar URL', async () => {
    httpClient.mockResolvedValue({
      data: {
        fullName: 'Ada Lovelace',
        avatar: { url: '/uploads/ada.svg', formats: null },
      },
    });

    const profile = await getProfile();

    expect(httpClient).toHaveBeenCalledWith('/api/profile?populate=*');
    expect(profile.fullName).toBe('Ada Lovelace');
    expect(profile.avatar.url).toBe('http://api.test/uploads/ada.svg');
  });

  it('does not throw when avatar is null', async () => {
    httpClient.mockResolvedValue({
      data: { fullName: 'Ada Lovelace', avatar: null },
    });

    const profile = await getProfile();

    expect(profile.fullName).toBe('Ada Lovelace');
    expect(profile.avatar).toBeNull();
  });
});
