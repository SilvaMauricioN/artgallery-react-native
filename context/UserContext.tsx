import { useStoredState } from "@/shared/useStoredState";
import { createContext, ReactNode, useCallback, useContext, useMemo } from "react";

interface SessionContextType {
  user: string | null; // nombre de la persona; null = nadie inició sesión
  isReady: boolean; // false mientras se lee del celular si ya había una sesión guardada
  login: (name: string) => void;
  logout: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({children}: {children: ReactNode}){
    const [user, setUser, isReady] = useStoredState<string | null>("@apiRest:session", null);

    const login = useCallback((name: string) => setUser(name.trim()), [setUser])

    const logout = useCallback(() => setUser(null), [setUser])

    const value = useMemo(() => ({ user, isReady, login, logout }), [user, isReady, login, logout]);

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession debe usarse dentro de un <SessionProvider>");
  }
  return context;
}

// import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
// import { storage, STORAGE_KEYS } from '../storage/storage';
// //que información estará disponible en nuestro Context.
// interface UserContextType {
//   /** Nombre guardado, o null si el usuario todavía no lo cargó. */
//   name: string | null;
//   loaded: boolean;
//   setName: (value: string) => Promise<void>;
//   clearName: () => Promise<void>;
// }
// 
// const UserContext = createContext<UserContextType | undefined>(undefined);
// 
// /** Provee el nombre del usuario y lo persiste en AsyncStorage. */
// export function UserProvider({ children }: { children: ReactNode }) {
//   const [name, setNameState] = useState<string | null>(null);
//   const [loaded, setLoaded] = useState<boolean>(false);
// 
//   // Lectura inicial desde AsyncStorage
//   useEffect(() => {
//     storage.get<string>(STORAGE_KEYS.userName).then((saved) => {
//       setNameState(saved);
//       setLoaded(true);
//     });
//   }, []);
// 
//   const setName = useCallback(async (value: string): Promise<void> => {
//     const clean = value.trim();
//     setNameState(clean);
//     await storage.set(STORAGE_KEYS.userName, clean);
//   }, []);
// 
//   const clearName = useCallback(async (): Promise<void> => {
//     setNameState(null);
//     await storage.remove(STORAGE_KEYS.userName);
//   }, []);
// 
//   const value = useMemo(
//     () => ({ name, loaded, setName, clearName }),
//     [name, loaded, setName, clearName],
//   );
// 
//   return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
// }
// 
// export function useUser() {
//   const ctx = useContext(UserContext);
//   if (!ctx) throw new Error('useUser debe usarse dentro de <UserProvider>');
//   return ctx;
// }