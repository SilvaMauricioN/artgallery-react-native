import { spacing } from '@/constants/theme';
import { useAppTheme } from '@/context/ThemeContext';
import { useSession } from '@/context/UserContext';
import useGetRandomArtwork from '@/hooks/useGetRandomArtwork';
import type { Artwork } from '@/types/artwork';
import { useEffect, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, IconButton, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Desde esta longitud se ofrece "Ver más" para no mostrar un bloque enorme. */
const LONG_DESCRIPTION = 180;

/** "United States · drawing". Omite los datos que la API no devuelva. */
function formatSubtitle(artwork: Artwork): string {
  return [artwork.origin, artwork.art_types?.join(', ')].filter(Boolean).join(' · ');
}

/**
 * Inicio: saludo al usuario y una obra aleatoria de la API con su descripción.
 * El botón "Sorprendeme" pide otra obra.
 */
export default function Home() {
  const theme = useAppTheme();
  const { user } = useSession();
  const { data, loading, error, refetch } = useGetRandomArtwork();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const insets = useSafeAreaInsets();

  // Al cambiar de obra, la descripción vuelve a mostrarse resumida
  useEffect(() => {
    setExpanded(false);
  }, [data?.id]);

  const subtitle = data ? formatSubtitle(data) : '';
  const description = data?.description?.trim() ?? '';
  const isLong = description.length > LONG_DESCRIPTION;

  return (
    <>
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.content}
    >
      <View>
        <Text variant="headlineSmall" style={[styles.greeting, { color: theme.colors.onBackground }]}>
          Hello, {user}
        </Text>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
          ¿What work are we discovering today?
        </Text>
      </View>

      <Button mode="contained-tonal" icon="refresh" onPress={refetch} loading={loading} disabled={loading}>
        {error ? 'Retry' : 'Surprise me'}
      </Button>

      {/* Imagen de la obra (mientras carga la primera, muestra un recuadro con spinner) */}
      <View style={[styles.imageBox, { backgroundColor: theme.colors.surfaceVariant }]}>
        {data?.image ? (
          <Pressable
            style={styles.image}
            accessibilityRole="imagebutton"
            accessibilityLabel="View image in full screen"
            onPress={() => setFullscreen(true)}
          >
            <Image source={{ uri: data.image }} style={styles.image} resizeMode="cover" />
          </Pressable>
        ) : loading ? (
          <ActivityIndicator />
        ) : null}
      </View>

      {error ? (
        <Text style={{ color: theme.colors.error }}>{error}</Text>
      ) : data ? (
        <View style={styles.info}>
          <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
            {data.title}
          </Text>
          {subtitle ? (
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      ) : null}      

      {/* Descripción de la obra */}
      {description ? (
        <View style={styles.about}>
          <Text variant="labelLarge" style={{ color: theme.colors.primary }}>
            About the work
          </Text>
          <Text
            variant="bodyMedium"
            numberOfLines={expanded ? undefined : 5}
            style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
          >
            {description}
          </Text>
          {isLong ? (
            <Button mode="text" compact style={styles.more} onPress={() => setExpanded((prev) => !prev)}>
              {expanded ? 'See less' : 'See more'}
            </Button>
          ) : null}
        </View>
      ) : null}
    </ScrollView>

    {/* Visor de imagen a pantalla completa: tocar la imagen o la X lo cierra */}
    <Modal
      visible={fullscreen}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => setFullscreen(false)}
    >
      <View style={styles.viewer}>
        <Pressable style={styles.viewerTouch} onPress={() => setFullscreen(false)}>
          {data?.image ? (
            <Image source={{ uri: data.image }} style={styles.viewerImage} resizeMode="contain" />
          ) : null}
        </Pressable>
        <IconButton
          icon="close"
          size={24}
          iconColor="#FFFFFF"
          containerColor="rgba(0,0,0,0.5)"
          accessibilityLabel="Cerrar imagen"
          style={[styles.close, { top: insets.top + spacing.sm }]}
          onPress={() => setFullscreen(false)}
        />
      </View>
    </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md },
  greeting: { fontWeight: '500' },
  imageBox: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '100%', height: '100%' },
  info: { gap: spacing.xs },
  title: { fontWeight: '500' },
  about: { gap: spacing.sm, marginTop: spacing.sm },
  description: { lineHeight: 22 },
  more: { alignSelf: 'flex-start', marginLeft: -spacing.sm },
  viewer: { flex: 1, backgroundColor: '#000000' },
  viewerTouch: { flex: 1, justifyContent: 'center' },
  viewerImage: { width: '100%', height: '100%' },
  close: { position: 'absolute', right: spacing.md },
});