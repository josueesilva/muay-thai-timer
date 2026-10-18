import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Vibration } from 'react-native';
import { playEndSound, playStartSound } from '../services/audio';
import { Exercise, Phase } from '../types';

interface Options {
  exercises: Exercise[];
  restTime: number;
  totalRounds?: number;
  onComplete: () => void;
}

export interface TimerControls {
  currentIndex: number;
  currentRound: number;
  totalRounds: number;
  phase: Phase;
  timeLeft: number;
  isRunning: boolean;
  progress: number;
  isWarning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export function useTimer({ exercises, restTime, totalRounds = 1, onComplete }: Options): TimerControls {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [phase, setPhase] = useState<Phase>('exercise');
  const [timeLeft, setTimeLeft] = useState(exercises[0]?.duration ?? 0);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasStartedRef = useRef(false);

  // Always-current refs so the interval callback never reads stale state
  const phaseRef = useRef(phase);
  const indexRef = useRef(currentIndex);
  const roundRef = useRef(currentRound);
  phaseRef.current = phase;
  indexRef.current = currentIndex;
  roundRef.current = currentRound;

  const stopInterval = useCallback(() => {
    if (intervalRef.current === null) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const finishTraining = useCallback(() => {
    stopInterval();
    setIsRunning(false);
    Vibration.vibrate([0, 300, 150, 300, 150, 500]);
    Alert.alert('Training Complete!', 'Great work! 🥊', [
      { text: 'Back', onPress: onComplete },
    ]);
  }, [onComplete, stopInterval]);

  // Ref-based so the interval closure always calls the latest version
  const advancePhaseRef = useRef<() => void>(() => {});
  advancePhaseRef.current = () => {
    const idx = indexRef.current;
    const ph = phaseRef.current;
    const rnd = roundRef.current;
    const isLastExerciseInRound = idx >= exercises.length - 1;
    const isLastRound = rnd >= totalRounds;

    if (ph === 'exercise') {
      playEndSound();
      Vibration.vibrate([0, 400, 100, 400]);

      if (isLastExerciseInRound && isLastRound) {
        finishTraining();
        return;
      }

      if (restTime > 0) {
        setPhase('rest');
        setTimeLeft(restTime);
      } else {
        if (isLastExerciseInRound) {
          // Next round immediately
          const nextRnd = rnd + 1;
          setCurrentRound(nextRnd);
          setCurrentIndex(0);
          setTimeLeft(exercises[0].duration);
        } else {
          const next = idx + 1;
          setCurrentIndex(next);
          setTimeLeft(exercises[next].duration);
        }
        playStartSound();
        Vibration.vibrate(300);
      }
    } else {
      playStartSound();
      Vibration.vibrate(400);

      if (isLastExerciseInRound) {
        // Start next round!
        const nextRnd = rnd + 1;
        setCurrentRound(nextRnd);
        setCurrentIndex(0);
        setPhase('exercise');
        setTimeLeft(exercises[0].duration);
      } else {
        const next = idx + 1;
        setCurrentIndex(next);
        setPhase('exercise');
        setTimeLeft(exercises[next].duration);
      }
    }
  };

  const start = useCallback(() => {
    if (!hasStartedRef.current) {
      playStartSound();
      Vibration.vibrate(200);
      hasStartedRef.current = true;
    }
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          advancePhaseRef.current();
          return 0;
        }

        const nextTime = prev - 1;
        // Haptic pulse on countdown (3, 2, 1) and light pulse at 10 seconds
        if (nextTime === 10) {
          Vibration.vibrate([0, 150, 100, 150]);
        } else if (nextTime <= 3 && nextTime >= 1) {
          Vibration.vibrate(80);
        }

        return nextTime;
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
    setCurrentRound(1);
    setPhase('exercise');
    setTimeLeft(exercises[0]?.duration ?? 0);
  }, [exercises, stopInterval]);

  useEffect(() => stopInterval, [stopInterval]);

  const totalDuration = phase === 'rest' ? restTime : (exercises[currentIndex]?.duration ?? 1);
  const progress = timeLeft / totalDuration;
  const isWarning = isRunning && timeLeft <= 10 && timeLeft > 0;

  return {
    currentIndex,
    currentRound,
    totalRounds,
    phase,
    timeLeft,
    isRunning,
    progress,
    isWarning,
    start,
    pause,
    reset,
  };
}
