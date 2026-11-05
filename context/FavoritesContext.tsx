import { useStoredState } from '@/shared/useStoredState';
import type { ArtworkSummary } from '@/types/artwork';
import { createContext, ReactNode, useCallback, useContext, useMemo } from 'react';

interface FavoritesContextType {
  favorites: ArtworkSummary[];
  /** .false mientras se leen los favoritos guardados del teléfono */
  isReady: boolean;
  isFavorite: (id: number) => boolean;
  /** Añade artwork a los favoritos o la elimina si ya estaba ahí. */
  toggleFavorite: (artwork: ArtworkSummary) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

/** Guarda las obras de arte favoritas y las guarda en AsyncStorage. */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites, isReady] = useStoredState<ArtworkSummary[]>('@artapp/favorites', []);

  // Conjunto de identificadores, de modo que isFavorite() es instantáneo, incluso con muchos favoritos
  const ids = useMemo(() => new Set(favorites.map((artwork) => artwork.id)), [favorites]);

  const isFavorite = useCallback((id: number) => ids.has(id), [ids]);

  const toggleFavorite = useCallback(
    (artwork: ArtworkSummary) => {
      // Solo almacenamos los datos básicos de artwork (id, title, image)
      const item: ArtworkSummary = { id: artwork.id, title: artwork.title, image: artwork.image };
      setFavorites((prev) =>
        prev.some((fav) => fav.id === item.id) ? prev.filter((fav) => fav.id !== item.id) : [item, ...prev],
      );
    },
    [setFavorites],
  );

  const value = useMemo(
    () => ({ favorites, isReady, isFavorite, toggleFavorite }),
    [favorites, isReady, isFavorite, toggleFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used inside a <FavoritesProvider>');
  }
  return context;
}