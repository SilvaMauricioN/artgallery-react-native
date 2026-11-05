import { spacing } from '@/constants/theme';
import { useAppTheme } from '@/context/ThemeContext';
import type { ArtworkSummary } from '@/types/artwork';
import { memo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

interface Props {
  artwork: ArtworkSummary;
  isFavorite: boolean;
  onToggleFavorite: (artwork: ArtworkSummary) => void;
  /** Opcional: si no aparece, la tarjeta no se puede pulsar (se utiliza en «Favoritos») */
  onPress?: (id: number) => void;
}

/**
 * Ficha de una obra de arte: imagen, título y un corazón para guardarla como favorita.
 * Ocupa la mitad de la fila, por lo que caben dos fichas una al lado de la otra en una FlatList.
 * `memo` evita que se vuelva a dibujar cuando sus propiedades no han cambiado.
 */
function ArtworkCard({ artwork, isFavorite, onToggleFavorite, onPress }: Props) {
  const theme = useAppTheme();

  return (
    <View style={styles.cell}>
      <Pressable
        disabled={!onPress}
        onPress={() => onPress?.(artwork.id)}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={artwork.title}
      >
        <View style={[styles.imageBox, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Image source={{ uri: artwork.image }} style={styles.image} resizeMode="cover" />
        </View>
        <Text variant="titleSmall" numberOfLines={2} style={styles.title}>
          {artwork.title}
        </Text>
      </Pressable>

      <IconButton
        icon={isFavorite ? 'heart' : 'heart-outline'}
        size={18}
        iconColor={isFavorite ? theme.colors.primary : theme.colors.onSurfaceVariant}
        containerColor={theme.colors.surface}
        accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        style={styles.heart}
        onPress={() => onToggleFavorite(artwork)}
      />
    </View>
  );
}

export default memo(ArtworkCard);

const styles = StyleSheet.create({
  cell: { width: '50%', padding: spacing.xs },
  imageBox: { width: '100%', aspectRatio: 1, borderRadius: 12, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  title: { marginTop: spacing.sm, fontWeight: '500' },
  heart: { position: 'absolute', top: spacing.sm, right: spacing.sm, margin: 0 },
});