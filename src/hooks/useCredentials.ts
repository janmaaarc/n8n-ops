import { useState, useCallback, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface StoredCredentials {
  id: string;
  n8nUrl: string;
  hasApiKey: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UseCredentialsReturn {
  credentials: StoredCredentials | null;
  loading: boolean;
  error: string | null;
  saveCredentials: (n8nUrl: string, apiKey: string) => Promise<boolean>;
  deleteCredentials: () => Promise<boolean>;
  refetch: () => Promise<void>;
}

export const useCredentials = (): UseCredentialsReturn => {
  const { session, isAuthenticated } = useAuth();
  const [credentials, setCredentials] = useState<StoredCredentials | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = useCallback((): Record<string, string> => {
    if (!session?.access_token) return {};
    return { Authorization: `Bearer ${session.access_token}` };
  }, [session]);

  const fetchCredentials = useCallback(async () => {
    if (!isAuthenticated || !isSupabaseConfigured()) {
      setCredentials(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/credentials', {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch credentials');
      }

      const data = await response.json();
      setCredentials(data.credentials);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, getAuthHeaders]);

  const saveCredentials = useCallback(
    async (n8nUrl: string, apiKey: string): Promise<boolean> => {
      if (!isAuthenticated) return false;

      setError(null);

      try {
        const response = await fetch('/api/credentials', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify({ n8nUrl, apiKey }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to save credentials');
        }

        await fetchCredentials();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        return false;
      }
    },
    [isAuthenticated, getAuthHeaders, fetchCredentials]
  );

  const deleteCredentials = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated) return false;

    setError(null);

    try {
      const response = await fetch('/api/credentials', {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete credentials');
      }

      setCredentials(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    }
  }, [isAuthenticated, getAuthHeaders]);

  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);

  return {
    credentials,
    loading,
    error,
    saveCredentials,
    deleteCredentials,
    refetch: fetchCredentials,
  };
};

/**
 * Get the access token for API requests
 */
export const getAccessToken = async (): Promise<string | null> => {
  if (!isSupabaseConfigured()) return null;

  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
};
