import { UserAvatar } from '@/components/UserAvatar';
import { spacing } from '@/constants/theme';
import { useAppTheme, useThemeMode } from '@/context/ThemeContext';
import { useSession } from '@/context/UserContext';
import { NAME_MAX, validateName } from '@/utils/validation';
import Constants from 'expo-constants';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, HelperText, List, Snackbar, Switch, Text, TextInput } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';

/** Entrada suave y escalonada: cada bloque aparece un poco después del anterior. */
const enter = (index: number) => FadeInDown.duration(350).delay(index * 80);

/**
 * Perfil: avatar y nombre, edición del nombre, preferencia de tema,
 * datos de la app y cierre de sesión.
 */
export default function Profile() {
  const theme = useAppTheme();
  const { isDark, toggleTheme } = useThemeMode();
  const { user, login, logout } = useSession();

  const [value, setValue] = useState<string>(user ?? '');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<boolean>(false);

  const unchanged = value.trim() === (user ?? '');

  const save = () => {
    const validationError = validateName(value);
    if (validationError) {
      setError(validationError);
      return;
    }
    login(value); // vuelve a guardar la sesión con el nombre nuevo
    setSaved(true);
  };

  const confirmLogout = () =>
    Alert.alert('Log out', 'Do you want to exit? You will return to the welcome screen.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: logout },
    ]);

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Cabecera */}
        <Animated.View entering={enter(0)} style={styles.header}>
          <UserAvatar name={user ?? '?'} size={88} />
          <Text variant="headlineSmall" style={styles.name}>
            {user}
          </Text>
        </Animated.View>

        {/* Cuenta */}
        <Animated.View entering={enter(1)} style={styles.section}>
          <Text variant="labelLarge" style={{ color: theme.colors.primary }}>
            Account
          </Text>
          <View>
            <TextInput
              mode="outlined"
              label="Name"
              value={value}
              maxLength={NAME_MAX}
              error={!!error}
              autoCapitalize="words"
              onChangeText={(text) => {
                setValue(text);
                setError(null);
              }}
              onSubmitEditing={save}
            />
            <HelperText type="error" visible={!!error}>
              {error}
            </HelperText>
          </View>
          <Button mode="contained" onPress={save} disabled={unchanged}>
            Save changes
          </Button>
        </Animated.View>

        {/* Preferencias */}
        <Animated.View entering={enter(2)} style={styles.section}>
          <Text variant="labelLarge" style={{ color: theme.colors.primary }}>
            Preferences
          </Text>
          <List.Item
            title="Dark mode"
            description={isDark ? 'Activated' : 'Disabled'}
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => <Switch value={isDark} onValueChange={toggleTheme} />}
            onPress={toggleTheme}
            style={styles.item}
          />
        </Animated.View>

        {/* Aplicación */}
        <Animated.View entering={enter(3)} style={styles.section}>
          <Text variant="labelLarge" style={{ color: theme.colors.primary }}>
            Application
          </Text>
          <List.Item
            title="Version"
            description={Constants.expoConfig?.version ?? '1.0.0'}
            left={(props) => <List.Icon {...props} icon="information-outline" />}
            style={styles.item}
          />
          <List.Item
            title="Your Information"
            description="Your name and preferences are saved only on this device."
            descriptionNumberOfLines={3}
            left={(props) => <List.Icon {...props} icon="cellphone-lock" />}
            style={styles.item}
          />
        </Animated.View>

        {/* Cerrar sesión */}
        <Animated.View entering={enter(4)}>
          <Button
            mode="outlined"
            icon="logout"
            textColor={theme.colors.error}
            style={{ borderColor: theme.colors.error }}
            onPress={confirmLogout}
          >
            Log Out
          </Button>
        </Animated.View>
      </ScrollView>

      <Snackbar visible={saved} onDismiss={() => setSaved(false)} duration={2000}>
        Updated Name
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.lg },
  header: { alignItems: 'center', gap: spacing.sm },
  name: { fontWeight: '500' },
  section: { gap: spacing.sm },
  item: { paddingHorizontal: 0 },
});