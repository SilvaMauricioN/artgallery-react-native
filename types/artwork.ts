/**
 * Obra de arte simple: lo que devuelve el punto final de búsqueda (GET /artworks) para cada elemento.
 * Esta es también la forma que guardamos en favoritos.
 */
export interface ArtworkSummary {
  id: number;
  title: string;
  image: string;
}

/**
  * Ficha detallada de la obra: GET /artworks/{id}.
 * Solo el identificador, el título y la imagen están siempre presentes, por lo que el resto de datos son opcionales. */
export interface ArtworkDetail extends ArtworkSummary {
  start_date?: number | null;
  end_date?: number | null;
  author?: string | null;
  origin?: string | null;
  art_types?: string[] | null;
  materials?: string[] | null;
  description?: string | null;
}

/** Respuesta completa de la solicitud GET /artworks (búsqueda). */
export interface SearchArtworksResponse {
  /** Total number of artworks that match the search. */
  available: number;
  /** How many artworks came in this page. */
  number: number;
  /** Position where this page starts. */
  offset: number;
  artworks: ArtworkSummary[];
}

/** Se ha mantenido el alias para que la pantalla de inicio*/
export type Artwork = ArtworkDetail;