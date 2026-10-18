import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, Spacing } from '../constants/theme';
import { WorkoutPreset } from '../constants/presets';
import { Exercise } from '../types';
import { formatTime } from '../utils/time';
import { PrimaryButton } from '../components/atoms/PrimaryButton';
import { AddExerciseForm } from '../components/molecules/AddExerciseForm';
import { ExerciseList } from '../components/molecules/ExerciseList';
import { PresetSelector } from '../components/molecules/PresetSelector';
import { RestTimeInput } from '../components/molecules/RestTimeInput';
import { RoundCountInput } from '../components/molecules/RoundCountInput';

interface Props {
  exercises: Exercise[];
  restTime: number;
  rounds: number;
  onExercisesChange: (exercises: Exercise[]) => void;
  onRestTimeChange: (seconds: number) => void;
  onRoundsChange: (rounds: number) => void;
  onStart: () => void;
}

export function SetupScreen({
  exercises,
  restTime,
  rounds,
  onExercisesChange,
  onRestTimeChange,
  onRoundsChange,
  onStart,
}: Props) {
  function addExercise(partial: Omit<Exercise, 'id'>) {
    onExercisesChange([...exercises, { id: Date.now().toString(), ...partial }]);
  }

  function removeExercise(id: string) {
    onExercisesChange(exercises.filter((e) => e.id !== id));
  }

  function moveExerciseUp(index: number) {
    if (index <= 0) return;
    const updated = [...exercises];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    onExercisesChange(updated);
  }

  function moveExerciseDown(index: number) {
    if (index >= exercises.length - 1) return;
    const updated = [...exercises];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    onExercisesChange(updated);
  }

  function handleSelectPreset(preset: WorkoutPreset) {
    onExercisesChange(preset.exercises);
    onRestTimeChange(preset.restTime);
    onRoundsChange(preset.rounds);
  }

  const count = exercises.length;
  const singleCycleTime =
    exercises.reduce((sum, e) => sum + e.duration, 0) + Math.max(0, count - 1) * restTime;
  const totalSeconds = singleCycleTime * rounds + Math.max(0, rounds - 1) * restTime;

  const startLabel =
    count === 0
      ? 'ADD AN EXERCISE TO START'
      : `▶ START · ${rounds} ${rounds === 1 ? 'Round' : 'Rounds'} · ${formatTime(totalSeconds)}`;

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>🥊 MUAY THAI TIMER</Text>

        <PresetSelector onSelectPreset={handleSelectPreset} />

        <ExerciseList
          exercises={exercises}
          onRemove={removeExercise}
          onMoveUp={moveExerciseUp}
          onMoveDown={moveExerciseDown}
        />

        <AddExerciseForm onAdd={addExercise} />

        <RoundCountInput value={rounds} onChange={onRoundsChange} />

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
