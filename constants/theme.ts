import { MD3DarkTheme, MD3LightTheme, MD3Theme } from 'react-native-paper';


export type AppTheme = MD3Theme & {
  colors: MD3Theme['colors'] & {
    success: string;
    successDisabled: string;
    /** Fondo de la barra inferior (dorado en ambos modos) */
    tabBar: string;
    /** Íconos y textos sobre la barra inferior */
    onTabBar: string;
  };
};

export const lightTheme: AppTheme = {
  ...MD3LightTheme,
  roundness: 3,
  colors: {
    ...MD3LightTheme.colors,
    // Dorado de marca
    primary: '#A9894F',
    onPrimary: '#FFFFFF',
    primaryContainer: '#F3EBDA',
    onPrimaryContainer: '#4A3A1C',

    // Marrón suave para acciones secundarias
    secondary: '#6B5B3E',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#EFE6D2',
    onSecondaryContainer: '#3A2F18',

    // Carbón (círculo activo de la tab bar, chips oscuros)
    tertiary: '#2B2A28',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#E7E4DE',
    onTertiaryContainer: '#1C1B19',

    background: '#FFFFFF',
    onBackground: '#1C1B19',

    surface: '#FFFFFF',
    onSurface: '#1C1B19',
    surfaceVariant: '#F5F3EF', // tarjetas tipo "Interesting Facts"
    onSurfaceVariant: '#6F6B64',
    surfaceDisabled: 'rgba(28, 27, 25, 0.12)',
    onSurfaceDisabled: '#A8A39A',

    outline: '#D9D2C3',
    outlineVariant: '#E9E4D9',

    error: '#C0392B',
    onError: '#FFFFFF',
    errorContainer: '#FBEAE7',
    onErrorContainer: '#6B1C13',

    inverseSurface: '#2B2A28',
    inverseOnSurface: '#F5F3EF',
    inversePrimary: '#D9BE87',

    elevation: {
      level0: 'transparent',
      level1: '#FFFFFF',
      level2: '#FAF8F4',
      level3: '#F5F3EF',
      level4: '#F0ECE4',
      level5: '#EAE5DA',
    },

    success: '#3F7D4E',
    successDisabled: '#A9CFAF',

    tabBar: '#C4A670',
    onTabBar: '#FFFFFF',
  },
};

export const darkTheme: AppTheme = {
  ...MD3DarkTheme,
  roundness: 3,
  colors: {
    ...MD3DarkTheme.colors,
    // Dorado más claro para mantener contraste sobre fondo oscuro
    primary: '#D1B27A',
    onPrimary: '#2E2310',
    primaryContainer: '#4A3B20',
    onPrimaryContainer: '#F1E3C2',

    secondary: '#C9B99A',
    onSecondary: '#2E2616',
    secondaryContainer: '#403725',
    onSecondaryContainer: '#EADFC8',

    tertiary: '#E4E1DA',
    onTertiary: '#1C1B19',
    tertiaryContainer: '#3A3835',
    onTertiaryContainer: '#E4E1DA',

    background: '#0F0E0D', // negro cálido, como el fondo de la referencia
    onBackground: '#EDE9E1',

    surface: '#1A1917',
    onSurface: '#EDE9E1',
    surfaceVariant: '#262421',
    onSurfaceVariant: '#B0AA9F',
    surfaceDisabled: 'rgba(237, 233, 225, 0.12)',
    onSurfaceDisabled: '#6E695F',

    outline: '#4A463F',
    outlineVariant: '#33302B',

    error: '#F2918B',
    onError: '#2B0A08',
    errorContainer: '#3A1B19',
    onErrorContainer: '#FAD4D1',

    inverseSurface: '#EDE9E1',
    inverseOnSurface: '#1C1B19',
    inversePrimary: '#A9894F',

    elevation: {
      level0: 'transparent',
      level1: '#171614',
      level2: '#1A1917',
      level3: '#1F1E1B',
      level4: '#242320',
      level5: '#292724',
    },

    success: '#7BC48A',
    successDisabled: '#25432B',

    tabBar: '#B8985F',
    onTabBar: '#FFFFFF',
  },
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };