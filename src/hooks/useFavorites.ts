import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'n8n-dashboard-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(new Set(JSON.parse(stored)));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const saveFavorites = useCallback((newFavorites: Set<string>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...newFavorites]));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, [saveFavorites]);

  const isFavorite = useCallback((id: string) => favorites.has(id), [favorites]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
};
