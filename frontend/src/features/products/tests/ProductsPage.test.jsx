import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProductsPage } from '../components/ProductsPage.jsx';
import { useProducts } from '../hooks/useProducts.js';
import { useProductsPage } from '../hooks/useProductsPage.js';
import { ApiError } from '../../../shared/api/httpClient.js';

vi.mock('../hooks/useProducts.js', () => ({ useProducts: vi.fn() }));
vi.mock('../hooks/useProductsPage.js', () => ({ useProductsPage: vi.fn() }));

const renderPage = () =>
  render(
    <MemoryRouter>
      <ProductsPage />
    </MemoryRouter>,
  );

const idle = { data: null, loading: false, error: null, refetch: vi.fn() };
const PAGE = { title: 'Our Products', intro: 'A live demo feed.' };

describe('ProductsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows a spinner while either source is loading', () => {
    useProductsPage.mockReturnValue({ ...idle, loading: true });
    useProducts.mockReturnValue({ ...idle, loading: true });

    renderPage();

    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
  });

  it('shows ErrorState when a source fails', () => {
    useProductsPage.mockReturnValue(idle);
    useProducts.mockReturnValue({ ...idle, error: new ApiError('boom', 'network', 0) });

    renderPage();

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows the Strapi copy and a graceful message when there are no products', () => {
    useProductsPage.mockReturnValue({ ...idle, data: PAGE });
    useProducts.mockReturnValue({ ...idle, data: [] });

    renderPage();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Our Products');
    expect(screen.getByText('A live demo feed.')).toBeInTheDocument();
    expect(screen.getByText('No products available right now.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
  });

  it('renders the Strapi title/intro and a product card per product on success', () => {
    useProductsPage.mockReturnValue({ ...idle, data: PAGE });
    useProducts.mockReturnValue({
      ...idle,
      data: [
        {
          id: 1,
          title: 'Product A',
          price: 109.95,
          category: 'electronics',
          image: 'https://fakestoreapi.com/img/a.jpg',
          rating: { rate: 4.1, count: 259 },
        },
        {
          id: 2,
          title: 'Product B',
          price: 22.3,
          category: 'jewelery',
          image: 'https://fakestoreapi.com/img/b.jpg',
          rating: { rate: 3.9, count: 120 },
        },
      ],
    });

    renderPage();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Our Products');
    // One card (h3 title) per product
    const cardTitles = screen.getAllByRole('heading', { level: 3 });
    expect(cardTitles).toHaveLength(2);
    expect(cardTitles[0]).toHaveTextContent('Product A');
    expect(cardTitles[1]).toHaveTextContent('Product B');
    // Store-style details
    expect(screen.getByText('$109.95')).toBeInTheDocument();
    expect(screen.getByText('electronics')).toBeInTheDocument();
    // Each product image uses alt = title
    expect(screen.getByAltText('Product A')).toBeInTheDocument();
    expect(screen.getByAltText('Product B')).toBeInTheDocument();
  });
});
