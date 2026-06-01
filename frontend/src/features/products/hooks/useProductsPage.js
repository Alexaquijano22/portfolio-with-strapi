import { useState, useEffect, useCallback } from 'react';
import { getProductsPage } from '../services/productsPageService.js';

// Fetches the Strapi-authored editorial copy { title, intro } for the products page.
export function useProductsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getProductsPage());
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
