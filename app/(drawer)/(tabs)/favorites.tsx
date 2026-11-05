import ArtworkCard from '@/components/ArtworkCard';
import StatusMessage from '@/components/StatusMessage';
import { spacing } from '@/constants/theme';
import { useFavorites } from '@/context/FavoritesContext';
import { useAppTheme } from '@/context/ThemeContext';
import type { ArtworkSummary } from '@/types/artwork';
import { useCallback } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

/**
* Favoritos: las obras de arte que el usuario ha guardado (se leen desde AsyncStorage).
 * Al pulsar sobre el corazón, se elimina una obra de arte de la lista.
 */
export default function Favorites() {
  const theme = useAppTheme();
  const { favorites, isReady, isFavorite, toggleFavorite } = useFavorites();

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ArtworkSummary>) => (
      <ArtworkCard artwork={item} isFavorite={isFavorite(item.id)} onToggleFavorite={toggleFavorite} />
    ),
    [isFavorite, toggleFavorite],
  );

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
          My favorites
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          Artworks you saved to see later.
        </Text>
      </View>

      {!isReady ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : favorites.length === 0 ? (
        <StatusMessage
          icon="heart-outline"
          title="No favorites yet"
          message="Tap the heart on any artwork in Explore to save it here."
        />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { gap: spacing.xs, paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md },
  title: { fontWeight: '600' },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});