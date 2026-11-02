export const NAME_MIN = 2;
export const NAME_MAX = 30;
 
/**
 * Valida el nombre del usuario.
 * @returns un mensaje de error, o null si el nombre es válido.
 */
export function validateName(raw: string): string | null {
  const value = raw.trim();
  if (value.length < NAME_MIN) return `Ingresá al menos ${NAME_MIN} caracteres`;
  if (value.length > NAME_MAX) return `Máximo ${NAME_MAX} caracteres`;
  return null;
}
 