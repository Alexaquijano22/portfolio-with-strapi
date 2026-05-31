import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { getSkills } from '../services/skillsService.js';
import { useSkills } from '../hooks/useSkills.js';
import { ApiError } from '../../../shared/api/httpClient.js';

vi.mock('../services/skillsService.js', () => ({
  getSkills: vi.fn(),
}));

const SKILLS = [
  { id: 1, name: 'React', category: 'Frontend', icon: null },
  { id: 2, name: 'Node', category: 'Backend', icon: null },
];

describe('useSkills', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts in a loading state with no data', () => {
    getSkills.mockReturnValue(new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useSkills());

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('populates data and clears loading on success', async () => {
    getSkills.mockResolvedValue(SKILLS);
    const { result } = renderHook(() => useSkills());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(SKILLS);
    expect(result.current.error).toBeNull();
  });

  it('captures an ApiError on rejection', async () => {
    getSkills.mockRejectedValue(new ApiError('boom', 'server', 500));
    const { result } = renderHook(() => useSkills());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeInstanceOf(ApiError);
    expect(result.current.data).toBeNull();
  });

  it('refetch invokes the service a second time', async () => {
    getSkills.mockResolvedValue(SKILLS);
    const { result } = renderHook(() => useSkills());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(getSkills).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.refetch();
    });
    expect(getSkills).toHaveBeenCalledTimes(2);
  });
});
