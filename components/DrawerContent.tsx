import { UserAvatar } from '@/components/UserAvatar';
import { spacing } from '@/constants/theme';
import { useAppTheme } from '@/context/ThemeContext';
import { useSession } from '@/context/UserContext';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

/** Contenido del menú lateral: cabecera con el usuario + lista de pantallas. */
export default function DrawerContent(props: DrawerContentComponentProps) {
  const theme = useAppTheme();
  const { user } = useSession();

  return (
    <DrawerContentScrollView {...props}>
      <View style={[styles.header, { borderBottomColor: theme.colors.outlineVariant }]}>
        <UserAvatar name={user ?? '?'} size={56} />
        <View style={styles.texts}>
          <Text variant="titleMedium" numberOfLines={1} style={styles.name}>
            {user}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            ArtSearch
          </Text>
        </View>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    marginBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  texts: { flex: 1 },
  name: { fontWeight: '500' },
});