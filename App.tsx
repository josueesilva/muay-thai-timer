import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Audio } from 'expo-av';
import { File, Paths } from 'expo-file-system/next';

// ─── Sound generation ────────────────────────────────────────────────────────

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

function generateWAV(
  frequency: number,
  durationSec: number,
  type: 'sine' | 'bell' = 'sine',
  sampleRate = 8000,
): Uint8Array {
  const numSamples = Math.floor(sampleRate * durationSec);
  const fileSize = 44 + numSamples;
  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, fileSize - 8, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate, true);
  view.setUint16(32, 1, true);
  view.setUint16(34, 8, true);
  writeString(view, 36, 'data');
  view.setUint32(40, numSamples, true);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let amplitude: number;

    if (type === 'bell') {
      // Bell: fundamental + harmonics with exponential decay
      const decay = Math.exp(-t * 4);
      const wave =
        0.5 * Math.sin(2 * Math.PI * frequency * t) +
        0.3 * Math.sin(2 * Math.PI * frequency * 2.76 * t) +
        0.2 * Math.sin(2 * Math.PI * frequency * 5.4 * t);
      amplitude = wave * decay;
    } else {
      // Beep: sine with short attack/release envelope
      const attack = Math.min(1, i / (sampleRate * 0.01));
      const release = Math.min(1, (numSamples - i) / (sampleRate * 0.05));
      amplitude = Math.sin(2 * Math.PI * frequency * t) * attack * release;
    }

    view.setUint8(44 + i, Math.round(128 + 100 * amplitude));
  }

  return new Uint8Array(buffer);
}

async function playSound(
  frequency: number,
  durationSec: number,
  type: 'sine' | 'bell' = 'sine',
) {
  try {
    const wav = generateWAV(frequency, durationSec, type);
    const file = new File(Paths.cache, `tone_${frequency}_${type}.wav`);
    file.write(wav);
    const { sound } = await Audio.Sound.createAsync({ uri: file.uri });
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (e) {
    // silently fail if audio is unavailable
  }
}

const BELL_ASSET = require('./assets/bell.mp3');

async function playBeep() {
  try {
    const { sound } = await Audio.Sound.createAsync(BELL_ASSET);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) sound.unloadAsync();
    });
  } catch (e) {}
}

const playBell = () => playSound(520, 1.5, 'bell');

// ─── Types ────────────────────────────────────────────────────────────────────

interface Exercise {
  id: string;
  name: string;
  duration: number; // seconds
}

type Phase = 'exercise' | 'rest';
type Screen = 'setup' | 'timer';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${pad(m)}:${pad(s)}`;
}

// ─── Setup Screen ─────────────────────────────────────────────────────────────

function SetupScreen({
  exercises,
  restTime,
  onExercisesChange,
  onRestTimeChange,
  onStart,
}: {
  exercises: Exercise[];
  restTime: number;
  onExercisesChange: (e: Exercise[]) => void;
  onRestTimeChange: (t: number) => void;
  onStart: () => void;
}) {
  const [newName, setNewName] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [restInput, setRestInput] = useState(String(restTime));

  function addExercise() {
    const dur = parseInt(newDuration, 10);
    if (!newName.trim()) {
      Alert.alert('Error', 'Enter an exercise name.');
      return;
    }
    if (!dur || dur <= 0) {
      Alert.alert('Error', 'Enter a valid duration in seconds.');
      return;
    }
    onExercisesChange([
      ...exercises,
      { id: Date.now().toString(), name: newName.trim(), duration: dur },
    ]);
    setNewName('');
    setNewDuration('');
  }

  function removeExercise(id: string) {
    onExercisesChange(exercises.filter((e) => e.id !== id));
  }

  function saveRestTime() {
    const t = parseInt(restInput, 10);
    if (!isNaN(t) && t >= 0) onRestTimeChange(t);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.setupContent}>
      <Text style={styles.title}>🥊 MUAY THAI TIMER</Text>

      {/* Rest time */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>REST BETWEEN EXERCISES</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={restInput}
            onChangeText={setRestInput}
            onBlur={saveRestTime}
            placeholder="0"
            placeholderTextColor="#666"
          />
          <Text style={styles.unit}>seconds</Text>
        </View>
      </View>

      {/* Exercise list */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>EXERCISES</Text>
        {exercises.length === 0 && (
          <Text style={styles.empty}>No exercises yet. Add one below.</Text>
        )}
        {exercises.map((ex, index) => (
          <View key={ex.id} style={styles.exerciseRow}>
            <View style={styles.exerciseIndex}>
              <Text style={styles.indexText}>{index + 1}</Text>
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{ex.name}</Text>
              <Text style={styles.exerciseDur}>{formatTime(ex.duration)}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => removeExercise(ex.id)}>
              <Text style={styles.deleteBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Add exercise */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>ADD EXERCISE</Text>
        <TextInput
          style={styles.input}
          value={newName}
          onChangeText={setNewName}
          placeholder="Exercise name (e.g. Jab-Cross)"
          placeholderTextColor="#666"
        />
        <View style={[styles.row, { marginTop: 10 }]}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            keyboardType="numeric"
            value={newDuration}
            onChangeText={setNewDuration}
            placeholder="Duration (sec)"
            placeholderTextColor="#666"
          />
          <Text style={styles.unit}>seconds</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={addExercise}>
          <Text style={styles.addBtnText}>+ ADD</Text>
        </TouchableOpacity>
      </View>

      {/* Start */}
      <TouchableOpacity
        style={[styles.startBtn, exercises.length === 0 && styles.disabledBtn]}
        onPress={() => {
          if (exercises.length === 0) {
            Alert.alert('No exercises', 'Add at least one exercise to start.');
            return;
          }
          onStart();
        }}>
        <Text style={styles.startBtnText}>START TRAINING</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── Timer Screen ─────────────────────────────────────────────────────────────

function TimerScreen({
  exercises,
  restTime,
  onFinish,
}: {
  exercises: Exercise[];
  restTime: number;
  onFinish: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('exercise');
  const [timeLeft, setTimeLeft] = useState(exercises[0]?.duration ?? 0);
  const [isRunning, setIsRunning] = useState(false);
  const [started, setStarted] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseRef = useRef(phase);
  const indexRef = useRef(currentIndex);
  const timeRef = useRef(timeLeft);

  phaseRef.current = phase;
  indexRef.current = currentIndex;
  timeRef.current = timeLeft;

  function clearTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  function advancePhase() {
    const idx = indexRef.current;
    const ph = phaseRef.current;

    if (ph === 'exercise') {
      // Exercise finished → play bell
      playBell();
      if (restTime > 0 && idx < exercises.length - 1) {
        // go to rest
        setPhase('rest');
        setTimeLeft(restTime);
      } else if (idx < exercises.length - 1) {
        // no rest, go to next exercise
        const next = idx + 1;
        setCurrentIndex(next);
        setPhase('exercise');
        setTimeLeft(exercises[next].duration);
        playBeep();
      } else {
        // done
        clearTimer();
        setIsRunning(false);
        Alert.alert('Training Complete!', 'Great work! 🥊', [
          { text: 'Back', onPress: onFinish },
        ]);
      }
    } else {
      // Rest finished → play beep, start next exercise
      playBeep();
      const next = idx + 1;
      if (next < exercises.length) {
        setCurrentIndex(next);
        setPhase('exercise');
        setTimeLeft(exercises[next].duration);
      } else {
        clearTimer();
        setIsRunning(false);
        Alert.alert('Training Complete!', 'Great work! 🥊', [
          { text: 'Back', onPress: onFinish },
        ]);
      }
    }
  }

  function startTimer() {
    if (!started) {
      playBeep();
      setStarted(true);
    }
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          advancePhase();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function pauseTimer() {
    clearTimer();
    setIsRunning(false);
  }

  function resetTimer() {
    clearTimer();
    setIsRunning(false);
    setStarted(false);
    setCurrentIndex(0);
    setPhase('exercise');
    setTimeLeft(exercises[0]?.duration ?? 0);
  }

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const exercise = exercises[currentIndex];
  const totalExercises = exercises.length;
  const isRest = phase === 'rest';
  const progress =
    timeLeft /
    (isRest ? restTime : exercise?.duration ?? 1);

  return (
    <View style={styles.screen}>
      <TouchableOpacity style={styles.backBtn} onPress={() => {
        clearTimer();
        onFinish();
      }}>
        <Text style={styles.backBtnText}>← BACK</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.timerContent}>
        {/* Phase indicator */}
        <View style={[styles.phaseBar, isRest ? styles.phaseBarRest : styles.phaseBarExercise]}>
          <Text style={styles.phaseText}>
            {isRest ? '💤 REST' : '🥊 EXERCISE'}
          </Text>
        </View>

        {/* Exercise name */}
        <Text style={styles.exerciseCounter}>
          {isRest
            ? `Next: ${exercises[currentIndex + 1]?.name ?? ''}`
            : `${currentIndex + 1} / ${totalExercises}`}
        </Text>
        <Text style={styles.bigExerciseName}>
          {isRest ? 'REST' : exercise?.name}
        </Text>

        {/* Countdown */}
        <Text style={[styles.countdown, isRest && styles.countdownRest]}>
          {formatTime(timeLeft)}
        </Text>

        {/* Progress bar */}
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              isRest ? styles.progressRest : styles.progressExercise,
              { width: `${Math.round(progress * 100)}%` },
            ]}
          />
        </View>

        {/* Upcoming exercises */}
        <View style={styles.upcomingCard}>
          <Text style={styles.upcomingTitle}>UPCOMING</Text>
          {exercises.slice(currentIndex + 1).map((ex, i) => (
            <Text key={ex.id} style={styles.upcomingItem}>
              {currentIndex + 2 + i}. {ex.name} — {formatTime(ex.duration)}
            </Text>
          ))}
          {exercises.slice(currentIndex + 1).length === 0 && (
            <Text style={styles.upcomingItem}>Last exercise!</Text>
          )}
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.resetBtn} onPress={resetTimer}>
            <Text style={styles.resetBtnText}>↺</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playBtn}
            onPress={isRunning ? pauseTimer : startTimer}>
            <Text style={styles.playBtnText}>{isRunning ? '⏸' : '▶'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>('setup');
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: '1', name: 'Jab-Cross', duration: 60 },
    { id: '2', name: 'Roundhouse Kicks', duration: 60 },
    { id: '3', name: 'Knee Strikes', duration: 45 },
  ]);
  const [restTime, setRestTime] = useState(30);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
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

// ─── Styles ───────────────────────────────────────────────────────────────────

const RED = '#C0392B';
const GOLD = '#F0A500';
const DARK = '#0D0D0D';
const CARD = '#1A1A1A';
const TEXT = '#F0F0F0';
const MUTED = '#888';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: DARK,
  },
  screen: {
    flex: 1,
    backgroundColor: DARK,
  },
  setupContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: GOLD,
    textAlign: 'center',
    letterSpacing: 3,
    marginBottom: 24,
  },
  card: {
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: RED,
  },
  cardTitle: {
    color: GOLD,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#2A2A2A',
    color: TEXT,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 4,
  },
  unit: {
    color: MUTED,
    marginLeft: 10,
    fontSize: 14,
  },
  empty: {
    color: MUTED,
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  exerciseIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  indexText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '600',
  },
  exerciseDur: {
    color: GOLD,
    fontSize: 13,
    marginTop: 2,
  },
  deleteBtn: {
    padding: 6,
  },
  deleteBtnText: {
    color: RED,
    fontSize: 16,
    fontWeight: '700',
  },
  addBtn: {
    backgroundColor: RED,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 1,
  },
  startBtn: {
    backgroundColor: GOLD,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledBtn: {
    opacity: 0.4,
  },
  startBtnText: {
    color: DARK,
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 2,
  },

  // Timer screen
  timerContent: {
    paddingBottom: 40,
  },
  backBtn: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  backBtnText: {
    color: MUTED,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  phaseBar: {
    marginHorizontal: 20,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 24,
  },
  phaseBarExercise: {
    backgroundColor: RED,
  },
  phaseBarRest: {
    backgroundColor: '#1A4A2A',
  },
  phaseText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 3,
  },
  exerciseCounter: {
    color: MUTED,
    fontSize: 14,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 6,
  },
  bigExerciseName: {
    color: TEXT,
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 2,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  countdown: {
    color: GOLD,
    fontSize: 88,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 4,
    fontVariant: ['tabular-nums'],
  },
  countdownRest: {
    color: '#4CAF50',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#2A2A2A',
    marginHorizontal: 20,
    borderRadius: 4,
    marginTop: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressExercise: {
    backgroundColor: RED,
  },
  progressRest: {
    backgroundColor: '#4CAF50',
  },
  upcomingCard: {
    backgroundColor: CARD,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    minHeight: 60,
  },
  upcomingTitle: {
    color: GOLD,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 8,
  },
  upcomingItem: {
    color: MUTED,
    fontSize: 13,
    marginBottom: 4,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: 20,
  },
  resetBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: CARD,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  resetBtnText: {
    color: MUTED,
    fontSize: 24,
  },
  playBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnText: {
    color: DARK,
    fontSize: 32,
  },
});
