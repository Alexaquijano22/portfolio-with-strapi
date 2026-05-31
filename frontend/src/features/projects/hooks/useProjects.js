import { useState, useEffect, useCallback } from 'react';
import { getProjects } from '../services/projectsService.js';

// Fetches the projects array. Single consumer (Projects.jsx), so no context needed.
export function useProjects() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getProjects());
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
