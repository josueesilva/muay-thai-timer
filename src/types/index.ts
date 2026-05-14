export interface Exercise {
  id: string;
  name: string;
  duration: number;
}

export type Phase = 'exercise' | 'rest';
export type Screen = 'setup' | 'timer';
