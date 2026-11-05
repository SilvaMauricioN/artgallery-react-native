import type { ActiveFilters } from '@/constants/filters';
import type { ArtworkSummary, SearchArtworksResponse } from '@/types/artwork';
import { useCallback, useEffect, useRef, useState } from 'react';

const API_URL = process.env.EXPO_PUBLIC_ARTSEARCH_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_ARTSEARCH_KEY;

/** Artworks por página. La página siguiente se solicita con un desplazamiento igual al número de obras de arte ya cargadas. */
const PAGE_SIZE = 10;
/** Texto que aparece cuando el usuario no ha escrito nada (para que las cheps funcionen por sí solas). */
const DEFAULT_QUERY = 'famous artworks';

interface UseArtworksResult {
  data: ArtworkSummary[];
  /**  Número total de obras de arte que coinciden con la búsqueda (el campo «disponible» de la API).. */
  total: number;
  /** Cargar primera pagina. */
  loading: boolean;
  /** Cargar la siguiente pagina (infinite scroll). */
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  /** Cargar proximas 10 artworks. */
  loadMore: () => Promise<void>;
  /** Vuelve a empezar desde la primera página. */
  refetch: () => Promise<void>;
  /** Vuelve a enviar la solicitud que falló. */
  retry: () => Promise<void>;
}

/**
 * Busca obras de arte con paginación (GET /artworks).
 * Se vuelve a ejecutar automáticamente cuando cambia la consulta o cualquier filtro.
 */
export default function useGetArtworks(query: string, filters: ActiveFilters): UseArtworksResult {
  const { type, material, technique } = filters;

  const [data, setData] = useState<ArtworkSummary[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Recuento de solicitudes: si una solicitud anterior finaliza después de que lo haya hecho una más reciente, se ignora su resultado.
  const lastRequest = useRef<number>(0);

  const fetchPage = useCallback(
    async (pageOffset: number): Promise<void> => {
      const requestId = ++lastRequest.current;
      const isFirstPage = pageOffset === 0;

      if (isFirstPage) {
        setLoading(true);
        setData([]);
        setTotal(0);
        setOffset(0);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      try {
        const params = new URLSearchParams({
          'api-key': API_KEY ?? '',
          query: query.trim() || DEFAULT_QUERY,
          number: String(PAGE_SIZE),
          offset: String(pageOffset),
        });
        if (type) params.append('type', type);
        if (material) params.append('material', material);
        if (technique) params.append('technique', technique);

        const response = await fetch(`${API_URL}/artworks?${params}`);
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        const json: SearchArtworksResponse = await response.json();
        if (requestId !== lastRequest.current) return;

        setTotal(json.available);
        setOffset(pageOffset + json.artworks.length);
        // Añade la nueva página, omitiendo las ilustraciones que ya tenemos
        setData((prev) => {
          const ids = new Set(prev.map((artwork) => artwork.id));
          return [...prev, ...json.artworks.filter((artwork) => !ids.has(artwork.id))];
        });
      } catch (err) {
        if (requestId !== lastRequest.current) return;
        setError(err instanceof Error ? err.message : 'Could not load artworks');
      } finally {
        if (requestId === lastRequest.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [query, type, material, technique],
  );

  // Primera página: al cargar la página y cada vez que cambien la consulta o los filtros
  useEffect(() => {
    fetchPage(0);
  }, [fetchPage]);

  const hasMore = offset < total;

  const loadMore = useCallback(async (): Promise<void> => {
    if (loading || loadingMore || error || !hasMore) return;
    await fetchPage(offset);
  }, [loading, loadingMore, error, hasMore, offset, fetchPage]);

  const refetch = useCallback(() => fetchPage(0), [fetchPage]);
  const retry = useCallback(() => fetchPage(offset), [fetchPage, offset]);

  return { data, total, loading, loadingMore, error, hasMore, loadMore, refetch, retry };
}