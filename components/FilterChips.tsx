import { ActiveFilters, FILTER_OPTIONS, FilterOption } from '@/constants/filters';
import { spacing } from '@/constants/theme';
import { useAppTheme } from '@/context/ThemeContext';
import { ScrollView, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';

interface Props {
  selected: ActiveFilters;
  /** Se activa cuando se pulsa sobre una ficha (para seleccionarla o deseleccionarla). */
  onToggle: (option: FilterOption) => void;
  /** Se activa al pulsar «Todo» (elimina todos los filtros). */
  onClear: () => void;
}

/** Fila horizontal de fichas para filtrar por tipo, material o técnica. */
export default function FilterChips({ selected, onToggle, onClear }: Props) {
  const theme = useAppTheme();
  const hasFilters = Object.keys(selected).length > 0;

  // Algunas fichas llevan el color de la marca; las demás, un tono neutro suave
  const chipStyle = (active: boolean) => ({
    backgroundColor: active ? theme.colors.primary : theme.colors.surfaceVariant,
  });
  const textStyle = (active: boolean) => ({
    color: active ? theme.colors.onPrimary : theme.colors.onSurfaceVariant,
  });

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      <Chip style={chipStyle(!hasFilters)} textStyle={textStyle(!hasFilters)} onPress={onClear}>
        All
      </Chip>

      {FILTER_OPTIONS.map((option) => {
        const active = selected[option.param] === option.value;
        return (
          <Chip
            key={`${option.param}-${option.value}`}
            style={chipStyle(active)}
            textStyle={textStyle(active)}
            onPress={() => onToggle(option)}
          >
            {option.label}
          </Chip>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.sm, paddingHorizontal: spacing.lg },
});