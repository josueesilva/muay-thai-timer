import { StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, Spacing } from '../../constants/theme';
import { Exercise } from '../../types';
import { Card } from '../atoms/Card';
import { SectionLabel } from '../atoms/SectionLabel';
import { ExerciseListItem } from './ExerciseListItem';

interface Props {
  exercises: Exercise[];
  onRemove: (id: string) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
}

export function ExerciseList({ exercises, onRemove, onMoveUp, onMoveDown }: Props) {
  return (
    <Card>
      <SectionLabel>EXERCISES</SectionLabel>
      {exercises.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>🥊</Text>
          <Text style={styles.emptyTitle}>Add your first exercise</Text>
          <Text style={styles.emptyHint}>Fill in the form below to build your workout.</Text>
        </View>
      ) : (
        exercises.map((ex, index) => (
          <ExerciseListItem
            key={ex.id}
            exercise={ex}
            index={index}
            total={exercises.length}
            onRemove={onRemove}
            onMoveUp={() => onMoveUp?.(index)}
            onMoveDown={() => onMoveDown?.(index)}
          />
        ))
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  emptyBox: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: FontSize.bodyLg,
    fontWeight: '700',
  },
  emptyHint: {
    color: Colors.muted,
    fontSize: FontSize.body,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
});
