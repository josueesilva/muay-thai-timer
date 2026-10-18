import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, FontSize, Spacing } from '../../constants/theme';
import { Exercise } from '../../types';
import { formatTime } from '../../utils/time';
import { Badge } from '../atoms/Badge';

interface Props {
  exercise: Exercise;
  index: number;
  total: number;
  onRemove: (id: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export function ExerciseListItem({
  exercise,
  index,
  total,
  onRemove,
  onMoveUp,
  onMoveDown,
}: Props) {
  const isFirst = index === 0;
  const isLast = index === total - 1;

  return (
    <View style={styles.row}>
      <Badge value={index + 1} />
      <View style={styles.info}>
        <Text style={styles.name}>{exercise.name}</Text>
        <Text style={styles.duration}>{formatTime(exercise.duration)}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, isFirst && styles.actionDisabled]}
          disabled={isFirst}
          onPress={onMoveUp}>
          <Text style={styles.arrowIcon}>▲</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, isLast && styles.actionDisabled]}
          disabled={isLast}
          onPress={onMoveDown}>
          <Text style={styles.arrowIcon}>▼</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteHitArea} onPress={() => onRemove(exercise.id)}>
          <Text style={styles.deleteIcon}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
  },
  info: {
    flex: 1,
  },
  name: {
    color: Colors.text,
    fontSize: FontSize.bodyLg,
    fontWeight: '600',
  },
  duration: {
    color: Colors.accent,
    fontSize: FontSize.caption,
    marginTop: Spacing.xs,
  },
  deleteHitArea: {
    padding: Spacing.sm,
  },
  deleteIcon: {
    color: Colors.primary,
    fontSize: FontSize.input,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionBtn: {
    padding: Spacing.sm,
  },
  actionDisabled: {
    opacity: 0.15,
  },
  arrowIcon: {
    color: Colors.muted,
    fontSize: FontSize.caption,
    fontWeight: '700',
  },
});
