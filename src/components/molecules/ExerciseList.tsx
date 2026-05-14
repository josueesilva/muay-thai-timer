import { StyleSheet, Text } from 'react-native';
import { Colors, FontSize } from '../../constants/theme';
import { Exercise } from '../../types';
import { Card } from '../atoms/Card';
import { SectionLabel } from '../atoms/SectionLabel';
import { ExerciseListItem } from './ExerciseListItem';

interface Props {
  exercises: Exercise[];
  onRemove: (id: string) => void;
}

export function ExerciseList({ exercises, onRemove }: Props) {
  return (
    <Card>
      <SectionLabel>EXERCISES</SectionLabel>
      {exercises.length === 0 ? (
        <Text style={styles.empty}>No exercises yet. Add one below.</Text>
      ) : (
        exercises.map((ex, index) => (
          <ExerciseListItem key={ex.id} exercise={ex} index={index} onRemove={onRemove} />
        ))
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  empty: {
    color: Colors.muted,
    fontSize: FontSize.body,
    fontStyle: 'italic',
  },
});
