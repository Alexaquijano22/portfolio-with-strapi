import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { getProfile } from '../services/profileService.js';
import { useProfile } from '../hooks/useProfile.js';
import { ApiError } from '../../../shared/api/httpClient.js';

vi.mock('../services/profileService.js', () => ({
  getProfile: vi.fn(),
}));

const PROFILE = { fullName: 'Ada Lovelace', role: 'Engineer' };

describe('useProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts in a loading state with no data', () => {
    getProfile.mockReturnValue(new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useProfile());

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('populates data and clears loading on success', async () => {
    getProfile.mockResolvedValue(PROFILE);
    const { result } = renderHook(() => useProfile());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(PROFILE);
    expect(result.current.error).toBeNull();
  });

  it('captures an ApiError on rejection', async () => {
    getProfile.mockRejectedValue(new ApiError('boom', 'server', 500));
    const { result } = renderHook(() => useProfile());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeInstanceOf(ApiError);
    expect(result.current.data).toBeNull();
  });

  it('refetch invokes the service a second time', async () => {
    getProfile.mockResolvedValue(PROFILE);
    const { result } = renderHook(() => useProfile());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(getProfile).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.refetch();
    });
    expect(getProfile).toHaveBeenCalledTimes(2);
  });
});
