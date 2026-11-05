import type { ArtworkDetail } from '@/types/artwork';
import { useCallback, useEffect, useState } from 'react';

const API_URL = process.env.EXPO_PUBLIC_ARTSEARCH_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_ARTSEARCH_KEY;

interface UseArtworkResult {
  data: ArtworkDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/** Obtiene toda la información sobre una obra de arte (GET /artworks/{id}). */
export default function useGetArtwork(id: number | undefined): UseArtworkResult {
  const [data, setData] = useState<ArtworkDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtwork = useCallback(async (): Promise<void> => {
    if (id === undefined || Number.isNaN(id)) {
      setLoading(false);
      setError('Invalid artwork');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ 'api-key': API_KEY ?? '' });
      const response = await fetch(`${API_URL}/artworks/${id}?${params}`);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const json: ArtworkDetail = await response.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the artwork');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchArtwork();
  }, [fetchArtwork]);

  return { data, loading, error, refetch: fetchArtwork };
}