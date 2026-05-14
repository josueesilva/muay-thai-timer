import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from './src/constants/theme';
import { initAudio } from './src/services/audio';
import { SetupScreen } from './src/screens/SetupScreen';
import { TimerScreen } from './src/screens/TimerScreen';
import { Exercise, Screen } from './src/types';

const DEFAULT_EXERCISES: Exercise[] = [
  { id: '1', name: 'Jab-Cross', duration: 60 },
  { id: '2', name: 'Roundhouse Kicks', duration: 60 },
  { id: '3', name: 'Knee Strikes', duration: 45 }
];

export default function App() {
  const [screen, setScreen] = useState<Screen>('setup');
  const [exercises, setExercises] = useState<Exercise[]>(DEFAULT_EXERCISES);
  const [restTime, setRestTime] = useState(30);

  useEffect(() => {
    initAudio();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      {screen === 'setup' ? (
        <SetupScreen
          exercises={exercises}
          restTime={restTime}
          onExercisesChange={setExercises}
          onRestTimeChange={setRestTime}
          onStart={() => setScreen('timer')}
        />
      ) : (
        <TimerScreen
          exercises={exercises}
          restTime={restTime}
          onFinish={() => setScreen('setup')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
