import { useCallback, useEffect, useState } from 'react';
//import { API_BASE_URL } from '../constants/api';
import { User } from '../types/user';


interface UseUsersResult {
  data: User[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
const API_URL = process.env.EXPO_PUBLIC_ARTSEARCH_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_ARTSEARCH_KEY;
/** Obtiene la lista de usuarios (GET /users). */
export default function useGetUsers(): UseUsersResult {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/users`);
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }
      const json: User[] = await response.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { data, loading, error, refetch: fetchUsers };
}