import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { Colors, FontSize, Spacing } from '../constants/theme';
import { Exercise } from '../types';
import { PrimaryButton } from '../components/atoms/PrimaryButton';
import { AddExerciseForm } from '../components/molecules/AddExerciseForm';
import { ExerciseList } from '../components/molecules/ExerciseList';
import { RestTimeInput } from '../components/molecules/RestTimeInput';

interface Props {
  exercises: Exercise[];
  restTime: number;
  onExercisesChange: (exercises: Exercise[]) => void;
  onRestTimeChange: (seconds: number) => void;
  onStart: () => void;
}

export function SetupScreen({
  exercises,
  restTime,
  onExercisesChange,
  onRestTimeChange,
  onStart,
}: Props) {
  function addExercise(partial: Omit<Exercise, 'id'>) {
    onExercisesChange([...exercises, { id: Date.now().toString(), ...partial }]);
  }

  function removeExercise(id: string) {
    onExercisesChange(exercises.filter((e) => e.id !== id));
  }

  function handleStart() {
    if (exercises.length === 0) {
      Alert.alert('No exercises', 'Add at least one exercise to start.');
      return;
    }
    onStart();
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>🥊 MUAY THAI TIMER</Text>

      <RestTimeInput value={restTime} onChange={onRestTimeChange} />
      <ExerciseList exercises={exercises} onRemove={removeExercise} />
      <AddExerciseForm onAdd={addExercise} />

      <PrimaryButton
        label="START TRAINING"
        disabled={exercises.length === 0}
        onPress={handleStart}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.xl,
    paddingTop: Spacing.xxxl + Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  title: {
    fontSize: FontSize.heading,
    fontWeight: '900',
    color: Colors.accent,
    textAlign: 'center',
    letterSpacing: 3,
    marginBottom: Spacing.xxl,
  },
});
