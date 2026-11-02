import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';

import { darkTheme, lightTheme } from '../constants/theme';
import { ThemeModeProvider, useAppTheme, useThemeMode } from '../context/ThemeContext';
import { UserProvider, useUser } from '../context/UserContext';

// Mantiene el splash visible hasta saber si ya existe un nombre guardado
SplashScreen.preventAutoHideAsync();

// Va DENTRO de PaperProvider y UserProvider porque usa useAppTheme() y useUser()
function ThemedStack() {
  const theme = useAppTheme();
  const { isDark } = useThemeMode();
  const { name, loaded } = useUser();

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  // Hasta leer AsyncStorage no se sabe qué pantalla mostrar
  if (!loaded) return null;

  const hasName = !!name;

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.background },
          headerShadowVisible: false,
          headerTintColor: theme.colors.onBackground,
          headerTitleStyle: { fontWeight: '600', fontSize: 16 },
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        {/* Sin nombre guardado: solo se puede ver la pantalla de bienvenida */}
        <Stack.Protected guard={!hasName}>
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
        </Stack.Protected>

        {/* Con nombre guardado: se ve el resto de la app */}
        <Stack.Protected guard={hasName}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="user/[id]" options={{ title: 'Detalle', headerBackTitle: 'Atrás' }} />
        </Stack.Protected>
      </Stack>
    </>
  );
}

// Elige el tema de Paper según el modo
function PaperShell() {
  const { isDark } = useThemeMode();

  return (
    <PaperProvider theme={isDark ? darkTheme : lightTheme}>
      <UserProvider>
        <ThemedStack />
      </UserProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeModeProvider>
      <PaperShell />
    </ThemeModeProvider>
  );
}