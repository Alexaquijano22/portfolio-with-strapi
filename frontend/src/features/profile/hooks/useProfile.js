import { useState, useEffect, useCallback } from 'react';
import { getProfile } from '../services/profileService.js';

// Single source of truth for Profile data. Intended to be called exactly once,
// inside <ProfileProvider>; section components consume it through context.
export function useProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getProfile());
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
