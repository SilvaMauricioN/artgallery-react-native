import { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, HelperText, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserAvatar } from '../components/UserAvatar';
import { spacing } from '../constants/theme';
import { useAppTheme } from '../context/ThemeContext';
import { useSession } from '../context/UserContext';
import { NAME_MAX, validateName } from '../utils/validation';

/**
 * Primera pantalla de la app: solo pide el nombre del usuario.
 * No muestra obras ni navegación. Al guardar el nombre (AsyncStorage),
 * el guard de app/_layout.tsx redirige automáticamente a la app principal.
 */
export default function Welcome() {
  const theme = useAppTheme();
  const { login } = useSession();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleChange = useCallback((text: string) => {
    setValue(text);
    setError(null); 
  }, []);

  const submit = useCallback(async () => {
    const validationError = validateName(value);
    if (validationError) {
      setError(validationError);
      return;
    }
    setSaving(true);
    await login(value); // guarda en AsyncStorage y actualiza el contexto
  }, [value, login]);

  const hasText = value.trim().length > 0;

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            {hasText ? (
              // Vista previa del avatar mientras se escribe
              <UserAvatar name={value} size={80} />
            ) : (
              <Avatar.Icon
                size={80}
                icon="palette-outline"
                style={{ backgroundColor: theme.colors.primaryContainer }}
                color={theme.colors.onPrimaryContainer}
              />
            )}
            <Text variant="headlineMedium" style={styles.title}>
              Art Gallery
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
              I discovered works of art from around the world
            </Text>
          </View>

          <View>
            <TextInput
              mode="outlined"
              label="What's your name?"
              placeholder="Your name"
              value={value}
              onChangeText={handleChange}
              error={!!error}
              maxLength={NAME_MAX}
              autoFocus
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={submit}
            />
            <HelperText type="error" visible={!!error}>
              {error}
            </HelperText>
          </View>

          <Button mode="contained" onPress={submit} loading={saving} disabled={saving} contentStyle={styles.buttonContent}>
            Get Started
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg, gap: spacing.md },
  header: { alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  title: { fontWeight: '500' },
  buttonContent: { paddingVertical: spacing.xs },
});