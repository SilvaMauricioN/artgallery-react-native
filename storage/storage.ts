import AsyncStorage from '@react-native-async-storage/async-storage';

/** Claves de AsyncStorage usadas por la app (todas con el mismo prefijo). */
export const STORAGE_KEYS = {
  userName: '@artapp/user-name',
  themeMode: '@artapp/theme-mode',
  favorites: '@artapp/favorites',
  recentSearches: '@artapp/recent-searches',
  dailyArtwork: '@artapp/daily-artwork',
} as const;

/**
 * Wrapper de AsyncStorage que serializa a JSON y nunca lanza errores:
 * si algo falla, `get` devuelve null y `set`/`remove` lo registran en consola.
 */
export const storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (e) {
      console.warn(`[storage] No se pudo leer "${key}"`, e);
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`[storage] No se pudo guardar "${key}"`, e);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn(`[storage] No se pudo borrar "${key}"`, e);
    }
  },
};