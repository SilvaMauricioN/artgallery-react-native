import DrawerContent from '@/components/DrawerContent';
import UserHeader from '@/components/UserHeader';
import { useAppTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';

type IconProps = { color: string; size: number };

export default function DrawerLayout() {
  const { colors } = useAppTheme();

  return (
    <Drawer
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        // headerTintColor pinta el ícono de hamburguesa. Antes usaba onPrimary (blanco),
        // que sobre un fondo blanco en modo claro no se veía.
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTintColor: colors.onBackground,
        headerTitleStyle: { fontWeight: '600', fontSize: 16, color: colors.onBackground },
        sceneStyle: { backgroundColor: colors.background },

        drawerStyle: { backgroundColor: colors.surface },
        drawerActiveTintColor: colors.onPrimaryContainer,
        drawerActiveBackgroundColor: colors.primaryContainer,
        drawerInactiveTintColor: colors.onSurfaceVariant,
        drawerLabelStyle: { fontWeight: '500' },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: 'ArtSearch',
          drawerLabel: 'Home',
          headerRight: () => <UserHeader />,
          drawerIcon: ({ color, size }: IconProps) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: 'My profile',
          drawerLabel: 'My profile',
          drawerIcon: ({ color, size }: IconProps) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer>
  );
}