import { describe, it, expect, vi, beforeEach } from 'vitest';
import { httpClient, ApiError } from '../../../shared/api/httpClient.js';
import { getProducts } from '../services/productService.js';

vi.mock('../../../shared/api/httpClient.js', () => ({
  httpClient: vi.fn(),
  ApiError: class ApiError extends Error {
    constructor(message, type, status) {
      super(message);
      this.name = 'ApiError';
      this.type = type;
      this.status = status;
    }
  },
}));

describe('productService.getProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls the external fakestoreapi URL and returns the array', async () => {
    const products = [
      { id: 1, title: 'Product A' },
      { id: 2, title: 'Product B' },
    ];
    httpClient.mockResolvedValue(products);

    const result = await getProducts();

    expect(httpClient).toHaveBeenCalledWith('https://fakestoreapi.com/products');
    expect(result).toEqual(products);
  });

  it('coerces a non-array response to an empty array', async () => {
    httpClient.mockResolvedValue({ unexpected: 'shape' });

    const result = await getProducts();

    expect(result).toEqual([]);
  });

  it('lets an ApiError propagate on failure', async () => {
    httpClient.mockRejectedValue(new ApiError('boom', 'server', 500));

    await expect(getProducts()).rejects.toBeInstanceOf(ApiError);
  });
});
