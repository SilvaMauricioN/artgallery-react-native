import { UserAvatar } from '@/components/UserAvatar';
import { useAppTheme } from '@/context/ThemeContext';
import { useSession } from '@/context/UserContext';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

/** Avatar + nombre del usuario para el lado derecho del header. */
export default function UserHeader() {
  const theme = useAppTheme();
  const { user } = useSession();

  if (!user) return null;

  return (
    <View style={styles.row}>
      <UserAvatar name={user} size={28} />
      <Text variant="labelLarge" numberOfLines={1} style={{ color: theme.colors.onBackground }}>
        {user}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginRight: 16, maxWidth: 160 },
});