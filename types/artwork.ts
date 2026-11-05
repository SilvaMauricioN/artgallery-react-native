/** Obra tal como la devuelve la API (GET /artworks/random y GET /artworks/{id}). */
export interface Artwork {
  id: number;
  title: string;
  image: string;
  start_date: number;
  end_date: number;
  author: string | null;
  /** País de origen, por ejemplo "United States". */
  origin?: string | null;
  /** Tipos de obra, por ejemplo ["drawing"] o ["painting"]. */
  art_types?: string[] | null;
  /** Descripción larga (varios párrafos separados por saltos de línea). */
  description?: string | null;
}
 