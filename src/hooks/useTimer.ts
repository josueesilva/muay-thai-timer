import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { playEndSound, playStartSound } from '../services/audio';
import { Exercise, Phase } from '../types';

interface Options {
  exercises: Exercise[];
  restTime: number;
  onComplete: () => void;
}

export interface TimerControls {
  currentIndex: number;
  phase: Phase;
  timeLeft: number;
  isRunning: boolean;
  progress: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export function useTimer({ exercises, restTime, onComplete }: Options): TimerControls {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('exercise');
  const [timeLeft, setTimeLeft] = useState(exercises[0]?.duration ?? 0);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasStartedRef = useRef(false);

  // Always-current refs so the interval callback never reads stale state
  const phaseRef = useRef(phase);
  const indexRef = useRef(currentIndex);
  phaseRef.current = phase;
  indexRef.current = currentIndex;

  const stopInterval = useCallback(() => {
    if (intervalRef.current === null) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const finishTraining = useCallback(() => {
    stopInterval();
    setIsRunning(false);
    Alert.alert('Training Complete!', 'Great work! 🥊', [
      { text: 'Back', onPress: onComplete },
    ]);
  }, [onComplete, stopInterval]);

  // Ref-based so the interval closure always calls the latest version
  const advancePhaseRef = useRef<() => void>(() => {});
  advancePhaseRef.current = () => {
    const idx = indexRef.current;
    const ph = phaseRef.current;
    const isLastExercise = idx >= exercises.length - 1;

    if (ph === 'exercise') {
      playEndSound();

      if (isLastExercise) {
        finishTraining();
        return;
      }

      if (restTime > 0) {
        setPhase('rest');
        setTimeLeft(restTime);
      } else {
        const next = idx + 1;
        setCurrentIndex(next);
        setTimeLeft(exercises[next].duration);
        playStartSound();
      }
    } else {
      const next = idx + 1;

      if (next >= exercises.length) {
        finishTraining();
        return;
      }

      playStartSound();
      setCurrentIndex(next);
      setPhase('exercise');
      setTimeLeft(exercises[next].duration);
    }
  };

  const start = useCallback(() => {
    if (!hasStartedRef.current) {
      playStartSound();
      hasStartedRef.current = true;
    }
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          advancePhaseRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const pause = useCallback(() => {
    stopInterval();
    setIsRunning(false);
  }, [stopInterval]);

  const reset = useCallback(() => {
    stopInterval();
    setIsRunning(false);
    hasStartedRef.current = false;
    setCurrentIndex(0);
    setPhase('exercise');
    setTimeLeft(exercises[0]?.duration ?? 0);
  }, [exercises, stopInterval]);

  useEffect(() => stopInterval, [stopInterval]);

  const totalDuration = phase === 'rest' ? restTime : (exercises[currentIndex]?.duration ?? 1);
  const progress = timeLeft / totalDuration;

  return { currentIndex, phase, timeLeft, isRunning, progress, start, pause, reset };
}
