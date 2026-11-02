import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { storage, STORAGE_KEYS } from '../storage/storage';

interface UserContextType {
  /** Nombre guardado, o null si el usuario todavía no lo cargó. */
  name: string | null;
  /** true cuando ya se leyó AsyncStorage (evita parpadeos al iniciar). */
  loaded: boolean;
  setName: (value: string) => Promise<void>;
  clearName: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

/** Provee el nombre del usuario y lo persiste en AsyncStorage. */
export function UserProvider({ children }: { children: ReactNode }) {
  const [name, setNameState] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  // Lectura inicial desde AsyncStorage
  useEffect(() => {
    storage.get<string>(STORAGE_KEYS.userName).then((saved) => {
      setNameState(saved);
      setLoaded(true);
    });
  }, []);

  const setName = useCallback(async (value: string): Promise<void> => {
    const clean = value.trim();
    setNameState(clean);
    await storage.set(STORAGE_KEYS.userName, clean);
  }, []);

  const clearName = useCallback(async (): Promise<void> => {
    setNameState(null);
    await storage.remove(STORAGE_KEYS.userName);
  }, []);

  const value = useMemo(
    () => ({ name, loaded, setName, clearName }),
    [name, loaded, setName, clearName],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser debe usarse dentro de <UserProvider>');
  return ctx;
}