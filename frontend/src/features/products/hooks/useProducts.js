import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../services/productService.js';

// Fetches the external product list. Single consumer (ProductsPage); no context.
export function useProducts() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getProducts());
    } catch (err) {
      setError(err); // err is always an ApiError
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
