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
    Alert.alert('Cerrar sesión', '¿Querés salir? Vas a volver a la pantalla de bienvenida.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
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
            Cuenta
          </Text>
          <View>
            <TextInput
              mode="outlined"
              label="Nombre"
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
            Guardar cambios
          </Button>
        </Animated.View>

        {/* Preferencias */}
        <Animated.View entering={enter(2)} style={styles.section}>
          <Text variant="labelLarge" style={{ color: theme.colors.primary }}>
            Preferencias
          </Text>
          <List.Item
            title="Modo oscuro"
            description={isDark ? 'Activado' : 'Desactivado'}
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => <Switch value={isDark} onValueChange={toggleTheme} />}
            onPress={toggleTheme}
            style={styles.item}
          />
        </Animated.View>

        {/* Aplicación */}
        <Animated.View entering={enter(3)} style={styles.section}>
          <Text variant="labelLarge" style={{ color: theme.colors.primary }}>
            Aplicación
          </Text>
          <List.Item
            title="Versión"
            description={Constants.expoConfig?.version ?? '1.0.0'}
            left={(props) => <List.Icon {...props} icon="information-outline" />}
            style={styles.item}
          />
          <List.Item
            title="Tus datos"
            description="Tu nombre y tus preferencias se guardan solo en este dispositivo."
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
            Cerrar sesión
          </Button>
        </Animated.View>
      </ScrollView>

      <Snackbar visible={saved} onDismiss={() => setSaved(false)} duration={2000}>
        Nombre actualizado
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