import StatusMessage from '@/components/StatusMessage';
import { spacing } from '@/constants/theme';
import { useFavorites } from '@/context/FavoritesContext';
import { useAppTheme } from '@/context/ThemeContext';
import useGetArtwork from '@/hooks/useGetArtwork';
import { formatLabel, formatYears } from '@/utils/format';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Chip, IconButton, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HERO_HEIGHT = 380;

/** Una fila titulada de pequeñas chips (utilizadas para tipos y materiales artísticos). */
function Tags({ title, items }: { title: string; items?: string[] | null }) {
  const theme = useAppTheme();
  if (!items || items.length === 0) return null;

  return (
    <View style={styles.tagsBlock}>
      <Text variant="labelLarge" style={{ color: theme.colors.primary }}>
        {title}
      </Text>
      <View style={styles.tagsRow}>
        {items.map((item) => (
          <Chip key={item} compact style={{ backgroundColor: theme.colors.surfaceVariant }}>
            {formatLabel(item)}
          </Chip>
        ))}
      </View>
    </View>
  );
}

/**
 * Detalles de la obra: imagen grande, título, autor, fechas, procedencia, tipos, materiales y descripción.
 * Se trata de una pantalla de «Stack»: se abre desde «Explorar» y la flecha de retroceso te lleva de vuelta allí.
 */
export default function ArtworkDetailScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, loading, error, refetch } = useGetArtwork(Number(id));
  const { isFavorite, toggleFavorite } = useFavorites();

  const favorite = data ? isFavorite(data.id) : false;
  const toggle = () => {
    if (data) toggleFavorite({ id: data.id, title: data.title, image: data.image });
  };

  const meta = data ? [formatYears(data.start_date, data.end_date), data.origin].filter(Boolean).join('  ·  ') : '';
  const paragraphs = data?.description?.split(/\n+/).map((p) => p.trim()).filter(Boolean) ?? [];

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        bounces={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.lg }}
      >
        {/* Hero imagen */}
        <View style={[styles.hero, { backgroundColor: theme.colors.surfaceVariant }]}>
          {data?.image ? (
            <Image source={{ uri: data.image }} style={styles.heroImage} resizeMode="cover" />
          ) : loading ? (
            <ActivityIndicator />
          ) : null}
        </View>

        {/* Ficha informativa que se superpone a la imagen */}
        <View style={[styles.sheet, { backgroundColor: theme.colors.background }]}>
          {error ? (
            <StatusMessage
              icon="cloud-offline-outline"
              title="Could not load the artwork"
              message={error}
              actionLabel="Try again"
              onAction={refetch}
            />
          ) : data ? (
            <>
              <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
                {data.title}
              </Text>
              {data.author ? (
                <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {data.author}
                </Text>
              ) : null}
              {meta ? (
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {meta}
                </Text>
              ) : null}

              <Tags title="Type" items={data.art_types} />
              <Tags title="Materials" items={data.materials} />

              {paragraphs.length > 0 ? (
                <View style={styles.description}>
                  {paragraphs.map((paragraph, index) => (
                    <Text
                      key={index}
                      variant="bodyMedium"
                      style={[styles.paragraph, { color: theme.colors.onSurfaceVariant }]}
                    >
                      {paragraph}
                    </Text>
                  ))}
                </View>
              ) : null}

              <Button
                mode="contained"
                icon={favorite ? 'heart' : 'heart-outline'}
                onPress={toggle}
                contentStyle={styles.buttonContent}
              >
                {favorite ? 'Remove from favorites' : 'Add to favorites'}
              </Button>
            </>
          ) : null}
        </View>
      </ScrollView>

      {/* Round buttons floating over the image */}
      <IconButton
        icon="arrow-left"
        iconColor={theme.colors.onSurface}
        containerColor={theme.colors.surface}
        accessibilityLabel="Go back"
        style={[styles.floating, { top: insets.top + spacing.sm, left: spacing.md }]}
        onPress={() => router.back()}
      />
      <IconButton
        icon={favorite ? 'heart' : 'heart-outline'}
        iconColor={favorite ? theme.colors.primary : theme.colors.onSurface}
        containerColor={theme.colors.surface}
        accessibilityLabel={favorite ? 'Remove from favorites' : 'Add to favorites'}
        disabled={!data}
        style={[styles.floating, { top: insets.top + spacing.sm, right: spacing.md }]}
        onPress={toggle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  hero: { width: '100%', height: HERO_HEIGHT, alignItems: 'center', justifyContent: 'center' },
  heroImage: { width: '100%', height: '100%' },
  sheet: {
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    gap: spacing.md,
    minHeight: 300,
  },
  title: { fontWeight: '600' },
  tagsBlock: { gap: spacing.sm },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  description: { gap: spacing.md },
  paragraph: { lineHeight: 24 },
  buttonContent: { paddingVertical: spacing.xs },
  floating: { position: 'absolute', margin: 0 },
});