import { describe, it, expect, vi, beforeEach } from 'vitest';
import { httpClient } from '../../../shared/api/httpClient.js';
import { getProductsPage } from '../services/productsPageService.js';

vi.mock('../../../shared/api/httpClient.js', () => ({
  httpClient: vi.fn(),
}));

describe('productsPageService.getProductsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls /api/products-page and returns the unwrapped data object', async () => {
    httpClient.mockResolvedValue({
      data: { title: 'Our Products', intro: 'A live demo feed.' },
      meta: {},
    });

    const page = await getProductsPage();

    expect(httpClient).toHaveBeenCalledWith('/api/products-page');
    expect(page).toEqual({ title: 'Our Products', intro: 'A live demo feed.' });
  });
});
