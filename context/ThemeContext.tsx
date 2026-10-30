import { AppTheme } from '@/constants/theme';
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { useTheme as usePaperTheme } from 'react-native-paper';

interface ThemeModeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextType | undefined>(undefined);

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = useCallback(() => setIsDark((prev) => !prev), []);

  const value = useMemo(() => ({ isDark, toggleTheme }), [isDark, toggleTheme]);

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

// Modo claro/oscuro y toggle
export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode debe usarse dentro de <ThemeModeProvider>');
  return ctx;
}

// Tema de Paper ya tipado con los colores extra (success, etc.)
export const useAppTheme = () => usePaperTheme<AppTheme>();