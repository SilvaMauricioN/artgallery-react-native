import React from 'react';
import { IconButton } from 'react-native-paper';
import { useThemeMode } from '../context/ThemeContext';

export default function ThemeToggle(): React.JSX.Element {
  const { isDark, toggleTheme } = useThemeMode();

  return (
    <IconButton
      icon={isDark ? 'weather-sunny' : 'weather-night'}
      mode="contained-tonal"
      size={20}
      onPress={toggleTheme}
      accessibilityLabel={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    />
  );
}