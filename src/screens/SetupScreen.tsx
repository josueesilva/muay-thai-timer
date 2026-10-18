import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, Spacing } from '../constants/theme';
import { Exercise } from '../types';
import { formatTime } from '../utils/time';
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

  const count = exercises.length;
  const totalSeconds =
    exercises.reduce((sum, e) => sum + e.duration, 0) + Math.max(0, count - 1) * restTime;

  const startLabel =
    count === 0
      ? 'ADD AN EXERCISE TO START'
      : `▶ START · ${count} ${count === 1 ? 'exercise' : 'exercises'} · ${formatTime(totalSeconds)}`;

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>🥊 MUAY THAI TIMER</Text>

        <ExerciseList exercises={exercises} onRemove={removeExercise} />
        <AddExerciseForm onAdd={addExercise} />
        <RestTimeInput value={restTime} onChange={onRestTimeChange} />
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label={startLabel}
          disabled={count === 0}
          onPress={onStart}
          style={styles.startButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
    paddingTop: Spacing.xxxl + Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.heading,
    fontWeight: '900',
    color: Colors.accent,
    textAlign: 'center',
    letterSpacing: 3,
    marginBottom: Spacing.xxl,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  startButton: {
    marginTop: 0,
  },
});
