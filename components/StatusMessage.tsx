import { spacing } from '@/constants/theme';
import { useAppTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

interface Props {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** Mensaje centrado con un icono: se utiliza para errores y listas vacías. */
export default function StatusMessage({ icon, title, message, actionLabel, onAction }: Props) {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={theme.colors.onSurfaceVariant} />
      <Text variant="titleMedium" style={styles.title}>
        {title}
      </Text>
      {message ? (
        <Text variant="bodyMedium" style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>
          {message}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button mode="contained-tonal" onPress={onAction} style={styles.button}>
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.sm },
  title: { fontWeight: '500', textAlign: 'center' },
  message: { textAlign: 'center' },
  button: { marginTop: spacing.sm },
});