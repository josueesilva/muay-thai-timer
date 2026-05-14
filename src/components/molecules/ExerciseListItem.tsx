import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, FontSize, Spacing } from '../../constants/theme';
import { Exercise } from '../../types';
import { formatTime } from '../../utils/time';
import { Badge } from '../atoms/Badge';

interface Props {
  exercise: Exercise;
  index: number;
  onRemove: (id: string) => void;
}

export function ExerciseListItem({ exercise, index, onRemove }: Props) {
  return (
    <View style={styles.row}>
      <Badge value={index + 1} />
      <View style={styles.info}>
        <Text style={styles.name}>{exercise.name}</Text>
        <Text style={styles.duration}>{formatTime(exercise.duration)}</Text>
      </View>
      <TouchableOpacity style={styles.deleteHitArea} onPress={() => onRemove(exercise.id)}>
        <Text style={styles.deleteIcon}>✕</Text>
      </TouchableOpacity>
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
});
