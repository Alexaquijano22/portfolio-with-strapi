import { describe, it, expect, vi, beforeEach } from 'vitest';
import { httpClient, ApiError } from './httpClient.js';

describe('httpClient', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns parsed JSON on a successful 200 response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { id: 1 } }),
    }));

    const result = await httpClient('/api/profile');
    expect(result).toEqual({ data: { id: 1 } });
  });

  it('throws ApiError with type "network" and status 0 on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Failed to fetch')));

    await expect(httpClient('/api/profile')).rejects.toMatchObject({
      name:   'ApiError',
      type:   'network',
      status: 0,
    });
  });

  it('throws ApiError with type "client" and status 404 on a 404 response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok:         false,
      status:     404,
      statusText: 'Not Found',
    }));

    await expect(httpClient('/api/missing')).rejects.toMatchObject({
      name:   'ApiError',
      type:   'client',
      status: 404,
    });
  });

  it('throws ApiError with type "server" and status 500 on a 500 response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok:         false,
      status:     500,
      statusText: 'Internal Server Error',
    }));

    await expect(httpClient('/api/profile')).rejects.toMatchObject({
      name:   'ApiError',
      type:   'server',
      status: 500,
    });
  });
});
