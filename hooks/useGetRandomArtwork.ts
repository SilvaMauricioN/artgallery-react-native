import type { Artwork } from '@/types/artwork';
import { useCallback, useEffect, useState } from 'react';

// Variables del archivo .env (deben escribirse completas y literales)
const API_URL = process.env.EXPO_PUBLIC_ARTSEARCH_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_ARTSEARCH_KEY;

interface UseRandomArtworkResult {
  data: Artwork | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/** Obtiene una obra aleatoria (GET /artworks/random). Se ejecuta al montar. */
export default function useGetRandomArtwork(): UseRandomArtworkResult {
  const [data, setData] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtwork = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // La API key viaja en la URL
      const params = new URLSearchParams({ 'api-key': API_KEY ?? '' });
      const response = await fetch(`${API_URL}/artworks/random?${params}`);
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }
      const json: Artwork = await response.json();
      console.log("artwork: ", json)
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar la obra');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArtwork();
  }, [fetchArtwork]);

  return { data, loading, error, refetch: fetchArtwork };
}