import ArtworkCard from '@/components/ArtworkCard';
import FilterChips from '@/components/FilterChips';
import StatusMessage from '@/components/StatusMessage';
import { ActiveFilters, FilterOption } from '@/constants/filters';
import { spacing } from '@/constants/theme';
import { useFavorites } from '@/context/FavoritesContext';
import { useAppTheme } from '@/context/ThemeContext';
import type { ArtworkSummary } from '@/types/artwork';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Searchbar, Text } from 'react-native-paper';
import useGetArtworks from '../../../hooks/useGetArtworks';

/**
 * Explorar: cuadro de búsqueda + iconos de filtro + cuadrícula de obras de arte con paginación.
 * Al pulsar sobre una ficha se abre la pantalla de detalles; al pulsar sobre el corazón, se guarda como favorita.
 */
export default function Explore() {
  const theme = useAppTheme();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [text, setText] = useState<string>(''); // what the user is typing
  const [query, setQuery] = useState<string>(''); // what was actually searched (on submit)
  const [filters, setFilters] = useState<ActiveFilters>({});

  const { data, total, loading, loadingMore, error, hasMore, loadMore, retry } = useGetArtworks(query, filters);

  const handleToggleFilter = useCallback((option: FilterOption) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (prev[option.param] === option.value) {
        delete next[option.param]; // tapped again: unselect
      } else {
        next[option.param] = option.value;
      }
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => setFilters({}), []);

  const openArtwork = useCallback(
    (id: number) => router.push({ pathname: '/artwork/[id]', params: { id: String(id) } }),
    [router],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ArtworkSummary>) => (
      <ArtworkCard
        artwork={item}
        isFavorite={isFavorite(item.id)}
        onToggleFavorite={toggleFavorite}
        onPress={openArtwork}
      />
    ),
    [isFavorite, toggleFavorite, openArtwork],
  );

  // Parte inferior de la lista: indicador giratorio mientras se carga más contenido, botón de reintentar en caso de error, mensaje final
  const footer = loadingMore ? (
    <ActivityIndicator style={styles.footer} />
  ) : error && data.length > 0 ? (
    <Button onPress={retry} style={styles.footer}>
      Could not load more. Tap to retry
    </Button>
  ) : !hasMore && data.length > 0 ? (
    <Text variant="bodySmall" style={[styles.footer, styles.end, { color: theme.colors.onSurfaceVariant }]}>
      You have reached the end
    </Text>
  ) : null;

  const hasFilters = Object.keys(filters).length > 0;

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
          Explore
        </Text>

        <Searchbar
          placeholder="Search artworks..."
          value={text}
          onChangeText={setText}
          onSubmitEditing={() => setQuery(text)}
          onClearIconPress={() => {
            setText('');
            setQuery('');
          }}
          returnKeyType="search"
          elevation={0}
          style={[styles.search, { backgroundColor: theme.colors.surfaceVariant }]}
        />

        <FilterChips selected={filters} onToggle={handleToggleFilter} onClear={clearFilters} />

        {total > 0 ? (
          <Text variant="bodyMedium" style={[styles.count, { color: theme.colors.onSurfaceVariant }]}>
            {total.toLocaleString('en-US')} results
          </Text>
        ) : null}
      </View>

      {loading && data.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : error && data.length === 0 ? (
        <StatusMessage
          icon="cloud-offline-outline"
          title="Something went wrong"
          message={error}
          actionLabel="Try again"
          onAction={retry}
        />
      ) : data.length === 0 ? (
        <StatusMessage
          icon="image-outline"
          title="No artworks found"
          message="Try a different search or remove some filters."
          actionLabel={hasFilters ? 'Clear filters' : undefined}
          onAction={hasFilters ? clearFilters : undefined}
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.list}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={footer}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { gap: spacing.md, paddingTop: spacing.sm },
  title: { fontWeight: '600', paddingHorizontal: spacing.lg },
  search: { marginHorizontal: spacing.lg, borderRadius: 24 },
  count: { paddingHorizontal: spacing.lg },
  list: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  footer: { marginVertical: spacing.md },
  end: { textAlign: 'center' },
});