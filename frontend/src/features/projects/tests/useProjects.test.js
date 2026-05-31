import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { getProjects } from '../services/projectsService.js';
import { useProjects } from '../hooks/useProjects.js';
import { ApiError } from '../../../shared/api/httpClient.js';

vi.mock('../services/projectsService.js', () => ({
  getProjects: vi.fn(),
}));

const PROJECTS = [
  { id: 1, title: 'A', description: '', coverImage: null, techStack: [], liveUrl: null, repoUrl: null },
  { id: 2, title: 'B', description: '', coverImage: null, techStack: [], liveUrl: null, repoUrl: null },
];

describe('useProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts in a loading state with no data', () => {
    getProjects.mockReturnValue(new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useProjects());

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('populates data and clears loading on success', async () => {
    getProjects.mockResolvedValue(PROJECTS);
    const { result } = renderHook(() => useProjects());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(PROJECTS);
    expect(result.current.error).toBeNull();
  });

  it('captures an ApiError on rejection', async () => {
    getProjects.mockRejectedValue(new ApiError('boom', 'server', 500));
    const { result } = renderHook(() => useProjects());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeInstanceOf(ApiError);
    expect(result.current.data).toBeNull();
  });

  it('refetch invokes the service a second time', async () => {
    getProjects.mockResolvedValue(PROJECTS);
    const { result } = renderHook(() => useProjects());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(getProjects).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.refetch();
    });
    expect(getProjects).toHaveBeenCalledTimes(2);
  });
});
