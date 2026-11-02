import { Avatar } from 'react-native-paper';
import { useAppTheme } from '../context/ThemeContext';

/** Iniciales del nombre: "Lucía" -> "LU", "Ana Pérez" -> "AP". */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const second = parts[1]?.[0] ?? parts[0]?.[1] ?? '';
  return (first + second).toUpperCase();
}

/** Avatar circular con las iniciales del usuario, con los colores del tema. */
export function UserAvatar({ name, size = 32 }: { name: string; size?: number }) {
  const theme = useAppTheme();
  return (
    <Avatar.Text
      size={size}
      label={getInitials(name)}
      style={{ backgroundColor: theme.colors.primaryContainer }}
      labelStyle={{ color: theme.colors.onPrimaryContainer }}
    />
  );
}