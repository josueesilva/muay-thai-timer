import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';
import { Colors, FontSize, Spacing } from '../constants/theme';
import { useTimer } from '../hooks/useTimer';
import { Exercise } from '../types';
import { formatTime } from '../utils/time';
import { ProgressBar } from '../components/atoms/ProgressBar';
import { TimeDisplay } from '../components/atoms/TimeDisplay';
import { PhaseIndicator } from '../components/molecules/PhaseIndicator';
import { TimerControls } from '../components/molecules/TimerControls';
import { UpcomingList } from '../components/molecules/UpcomingList';

interface Props {
  exercises: Exercise[];
  restTime: number;
  onFinish: () => void;
}

export function TimerScreen({ exercises, restTime, onFinish }: Props) {
  useKeepAwake();
  const { currentIndex, phase, timeLeft, isRunning, progress, isWarning, start, pause, reset } = useTimer({
    exercises,
    restTime,
    onComplete: onFinish,
  });

  const isRest = phase === 'rest';

  const counterLabel = isRest
    ? `Next: ${exercises[currentIndex + 1]?.name ?? ''}`
    : `${currentIndex + 1} / ${exercises.length}`;

  const displayName = isRest ? 'REST' : (exercises[currentIndex]?.name ?? '');

  const timerVariant: 'exercise' | 'rest' | 'warning' = isWarning
    ? 'warning'
    : isRest
      ? 'rest'
      : 'exercise';

  // Dynamic background glow/tint based on phase & warning
  let screenBg: string = Colors.background;
  if (isRunning) {
    if (isWarning) {
      screenBg = Colors.warningSurface;
    } else if (isRest) {
      screenBg = Colors.restSurface;
    } else {
      screenBg = Colors.exerciseSurface;
    }
  }

  function handleBack() {
    Alert.alert('End workout?', 'Your progress will be lost.', [
      { text: 'Keep training', style: 'cancel' },
      {
        text: 'End workout',
        style: 'destructive',
        onPress: () => {
          reset();
          onFinish();
        },
      },
    ]);
  }

  return (
    <View style={[styles.screen, { backgroundColor: screenBg }]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
        accessibilityLabel="End workout">
        <Text style={styles.backLabel}>← BACK</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        <PhaseIndicator phase={phase} isWarning={isWarning} />

        <Text style={styles.counter}>{counterLabel}</Text>
        <Text style={styles.exerciseName}>{displayName}</Text>

        <TimeDisplay time={formatTime(timeLeft)} variant={timerVariant} />

        <ProgressBar progress={progress} variant={timerVariant} />

        <UpcomingList exercises={exercises} fromIndex={currentIndex} />

        <TimerControls
          isRunning={isRunning}
          onPlay={start}
          onPause={pause}
          onReset={reset}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backButton: {
    paddingTop: Spacing.xxxl + Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  backLabel: {
    color: Colors.muted,
    fontSize: FontSize.body,
    fontWeight: '600',
    letterSpacing: 1,
  },
  content: {
    paddingBottom: Spacing.xxxl,
  },
  counter: {
    color: Colors.muted,
    fontSize: FontSize.body,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  exerciseName: {
    color: Colors.text,
    fontSize: FontSize.display,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 2,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
});
