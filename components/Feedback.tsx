import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';

import { useAppTheme } from '../context/ThemeContext';

export function LoadingView(): React.JSX.Element {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" />
    </View>
  );
}

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorView({ message, onRetry }: ErrorViewProps): React.JSX.Element {
  const theme = useAppTheme();

  return (
    <View style={styles.center}>
      <View style={[styles.errorBox, { backgroundColor: theme.colors.errorContainer }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{message}</Text>
      </View>
      {onRetry && (
        <Button mode="contained" onPress={onRetry} style={styles.retry}>
          Reintentar
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorBox: {
    borderRadius: 10,
    padding: 14,
  },
  errorText: {
    textAlign: 'center',
  },
  retry: {
    marginTop: 14,
  },
});