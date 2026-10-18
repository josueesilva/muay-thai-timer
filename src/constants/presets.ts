import { Exercise } from '../types';

export interface WorkoutPreset {
  id: string;
  name: string;
  icon: string;
  description: string;
  rounds: number;
  restTime: number;
  exercises: Exercise[];
}

export const WORKOUT_PRESETS: WorkoutPreset[] = [
  {
    id: 'muay-thai-classic',
    name: 'Muay Thai Classic',
    icon: '🥊',
    description: '3 rounds · 3 min boxing, kicks & knees',
    rounds: 3,
    restTime: 60,
    exercises: [
      { id: 'mt-1', name: 'Jab - Cross - Hook', duration: 180 },
      { id: 'mt-2', name: 'Roundhouse Kicks & Teep', duration: 180 },
      { id: 'mt-3', name: 'Clinch & Knee Strikes', duration: 180 },
    ],
  },
  {
    id: 'heavy-bag-combos',
    name: 'Heavy Bag Combos',
    icon: '🔥',
    description: '5 rounds · 2 min high-intensity combinations',
    rounds: 5,
    restTime: 45,
    exercises: [
      { id: 'hb-1', name: 'Straight Punches & Low Kick', duration: 120 },
      { id: 'hb-2', name: 'Elbow Strikes & Clinch', duration: 120 },
      { id: 'hb-3', name: 'High Kick & Teep Check', duration: 120 },
      { id: 'hb-4', name: 'Power Hooks & Uppercuts', duration: 120 },
    ],
  },
  {
    id: 'fighter-conditioning',
    name: 'Fighter Conditioning',
    icon: '⚡',
    description: '4 rounds · 1 min explosive circuit',
    rounds: 4,
    restTime: 30,
    exercises: [
      { id: 'fc-1', name: 'Shadowboxing & Footwork', duration: 60 },
      { id: 'fc-2', name: 'Rapid Teeps (Front Kicks)', duration: 60 },
      { id: 'fc-3', name: 'Skip Knees & Sprawls', duration: 60 },
      { id: 'fc-4', name: 'Burnout Straight Punches', duration: 60 },
    ],
  },
  {
    id: 'quick-sparring',
    name: 'Quick Sparring Rounds',
    icon: '🛡️',
    description: '3 rounds · 2 min simulated sparring flow',
    rounds: 3,
    restTime: 60,
    exercises: [
      { id: 'qs-1', name: 'Round 1: Boxing & Range', duration: 120 },
      { id: 'qs-2', name: 'Round 2: Kicks & Defense', duration: 120 },
      { id: 'qs-3', name: 'Round 3: Free All Weapons', duration: 120 },
    ],
  },
];
