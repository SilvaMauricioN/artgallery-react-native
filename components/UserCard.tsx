import React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, Card, Icon } from 'react-native-paper';

import { useAppTheme } from '../context/ThemeContext';
import { User } from '../types/user';

interface Props {
  user: User;
  onPress: (user: User) => void;
}

const getInitials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

export default function UserCard({ user, onPress }: Props): React.JSX.Element {
  const theme = useAppTheme();

  return (
    <Card mode="outlined" style={styles.card} onPress={() => onPress(user)}>
      <Card.Title
        title={user.name}
        subtitle={user.email}
        titleVariant="titleMedium"
        left={(props) => <Avatar.Text {...props} label={getInitials(user.name)} />}
        right={() => (
          <Icon source="chevron-right" size={22} color={theme.colors.onSurfaceVariant} />
        )}
        rightStyle={styles.chevron}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
  chevron: {
    marginRight: 16,
  },
});