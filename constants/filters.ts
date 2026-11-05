/** Parámetros de consulta de GET /artworks que utilizamos como filtros. */
export type FilterParam = 'type' | 'material' | 'technique';

export interface FilterOption {
  /** Texto que aparece en la chip. */
  label: string;
  /**Qué parámetro de consulta establece chip. */
  param: FilterParam;
  /** Valor enviado a la API (debe ser uno de los valores que figuran en la documentación de la API). */
  value: string;
}

/** Filtros seleccionados actualmente: como máximo un valor por parámetro. */
export type ActiveFilters = Partial<Record<FilterParam, string>>;

export const FILTER_OPTIONS: FilterOption[] = [
  { label: 'Painting', param: 'type', value: 'painting' },
  { label: 'Sculpture', param: 'type', value: 'sculpture' },
  { label: 'Drawing', param: 'type', value: 'drawing' },
  { label: 'Print', param: 'type', value: 'print' },
  { label: 'Photograph', param: 'type', value: 'photograph' },
  { label: 'Oil paint', param: 'material', value: 'oil_paint' },
  { label: 'Watercolor', param: 'material', value: 'watercolor' },
  { label: 'Bronze', param: 'material', value: 'bronze' },
  { label: 'Marble', param: 'material', value: 'marble' },
  { label: 'Etching', param: 'technique', value: 'etching' },
  { label: 'Woodcut', param: 'technique', value: 'woodcut' },
];