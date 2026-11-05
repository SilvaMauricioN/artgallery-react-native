/** "oil_paint" -> "Oil paint". */
export function formatLabel(value: string): string {
  const text = value.replace(/_/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** "1401 – 1450". Si las fechas coinciden o falta una, solo se muestra una. */
export function formatYears(start?: number | null, end?: number | null): string {
  if (start && end && start !== end) return `${start} – ${end}`;
  return String(start ?? end ?? '');
}