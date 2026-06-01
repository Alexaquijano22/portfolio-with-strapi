import { Link } from 'react-router-dom';
import { Spinner } from '../../../shared/components/Spinner.jsx';
import { ErrorState } from '../../../shared/components/ErrorState.jsx';
import { useProducts } from '../hooks/useProducts.js';
import { useProductsPage } from '../hooks/useProductsPage.js';
import { ProductCard } from './ProductCard.jsx';

export function ProductsPage() {
  const { data: page, loading: pageLoading, error: pageError, refetch: refetchPage } =
    useProductsPage();
  const { data: products, loading: listLoading, error: listError, refetch: refetchList } =
    useProducts();

  const loading = pageLoading || listLoading;
  const error = pageError ?? listError;
  const refetch = () => {
    refetchPage();
    refetchList();
  };

  return (
    <main id="products" className="mx-auto min-h-screen max-w-5xl px-6 py-16">
      <Link
        to="/"
        className="mb-8 inline-block text-sm text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        ← Back to portfolio
      </Link>

      {loading && <Spinner />}

      {!loading && error && <ErrorState error={error} onRetry={refetch} />}

      {!loading && !error && (
        <>
          <h1 className="text-4xl font-bold text-text md:text-5xl">{page?.title}</h1>
          <p className="mt-4 max-w-2xl text-muted">{page?.intro}</p>

          {products?.length === 0 ? (
            <p className="mt-10 text-muted">No products available right now.</p>
          ) : (
            <div className="mt-10 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default ProductsPage;
