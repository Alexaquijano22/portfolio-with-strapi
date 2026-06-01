import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { httpClient, ApiError } from './httpClient.js';

describe('httpClient', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
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

  it('prefixes VITE_API_URL for relative paths', async () => {
    vi.stubEnv('VITE_API_URL', 'http://api.test');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });
    vi.stubGlobal('fetch', fetchMock);

    await httpClient('/api/profile');

    expect(fetchMock).toHaveBeenCalledWith('http://api.test/api/profile', undefined);
  });

  it('passes absolute URLs through without prefixing VITE_API_URL', async () => {
    vi.stubEnv('VITE_API_URL', 'http://api.test');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ id: 1, title: 'A product' }]),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await httpClient('https://fakestoreapi.com/products');

    expect(fetchMock).toHaveBeenCalledWith('https://fakestoreapi.com/products', undefined);
    expect(result).toEqual([{ id: 1, title: 'A product' }]);
  });
});
