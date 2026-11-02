import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorView, LoadingView } from '../../components/Feedback';
import ThemeToggle from '../../components/ThemeToggle';
import UserCard from '../../components/UserCard';
import { AppTheme } from '../../constants/theme';
import { useAppTheme } from '../../context/ThemeContext';
import useUsers from '../../hooks/useGetUsers';
import { User } from '../../types/user';

export default function UsersScreen(): React.JSX.Element {
  const router = useRouter();
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { data, loading, error, refetch } = useUsers();
  const [query, setQuery] = useState<string>('');

  const filtered = useMemo(
    () => data.filter((u) => u.name.toLowerCase().includes(query.trim().toLowerCase())),
    [data, query]
  );

  const openUser = (user: User): void => {
    router.push(`/user/${user.id}`);
  };

  const header = (
    <View>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Usuarios</Text>
          <Text style={styles.subtitle}>JSONPlaceholder · GET /users</Text>
        </View>
        <ThemeToggle />
      </View>
      <TextInput
        mode="outlined"
        label="Buscar usuario"
        value={query}
        onChangeText={setQuery}
        left={<TextInput.Icon icon="magnify" />}
        style={styles.search}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {loading && data.length === 0 ? (
        <>
          <View style={styles.headerPadding}>{header}</View>
          <LoadingView />
        </>
      ) : error && data.length === 0 ? (
        <>
          <View style={styles.headerPadding}>{header}</View>
          <ErrorView message={error} onRetry={refetch} />
        </>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <UserCard user={item} onPress={openUser} />}
          ListHeaderComponent={header}
          ListEmptyComponent={<Text style={styles.empty}>No se encontraron usuarios</Text>}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refetch}
              tintColor={theme.colors.onBackground}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    list: {
      padding: 24,
      paddingBottom: 32,
    },
    headerPadding: {
      paddingHorizontal: 24,
      paddingTop: 24,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 20,
    },
    title: {
      fontSize: 26,
      fontWeight: '700',
      color: theme.colors.onBackground,
    },
    subtitle: {
      fontSize: 13,
      color: theme.colors.onSurfaceVariant,
      marginTop: 4,
    },
    search: {
      marginBottom: 16,
    },
    empty: {
      textAlign: 'center',
      color: theme.colors.onSurfaceVariant,
      marginTop: 24,
    },
  });