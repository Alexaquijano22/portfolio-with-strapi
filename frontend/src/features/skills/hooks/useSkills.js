import { useState, useEffect, useCallback } from 'react';
import { getSkills } from '../services/skillsService.js';

// Fetches the skills array. Unlike useProfile this hook is not shared via context —
// only Skills.jsx consumes it, so it is called there directly.
export function useSkills() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getSkills());
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
