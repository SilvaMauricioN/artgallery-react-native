import { UserAvatar } from '@/components/UserAvatar';
import { useUser } from '@/context/UserContext';
import { spacing } from '@/theme/theme';
import { useAppTheme } from '@/theme/useAppTheme';
import { NAME_MAX, validateName } from '@/utils/validation';
import { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, HelperText, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Primera pantalla de la app: solo pide el nombre del usuario.
 * No muestra obras ni navegación. Al guardar el nombre (AsyncStorage),
 * el guard de app/_layout.tsx redirige automáticamente a la app principal.
 */
export default function Welcome() {
  const theme = useAppTheme();
  const { setName } = useUser();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleChange = useCallback((text: string) => {
    setValue(text);
    setError(null); // limpia el error apenas el usuario vuelve a escribir
  }, []);

  const submit = useCallback(async () => {
    const validationError = validateName(value);
    if (validationError) {
      setError(validationError);
      return;
    }
    setSaving(true);
    await setName(value); // guarda en AsyncStorage y actualiza el contexto
  }, [value, setName]);

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
              ArtSearch
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
              Descubrí obras de arte de todo el mundo
            </Text>
          </View>

          <View>
            <TextInput
              mode="outlined"
              label="¿Cómo te llamás?"
              placeholder="Tu nombre"
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
            Comenzar
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