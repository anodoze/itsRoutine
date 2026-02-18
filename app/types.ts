export interface Timer {
  id: string;
  name: string;
  durationSeconds?: number;
  isActive: boolean;
}

export interface Routine {
  id: string;
  name: string;
  startTime: string | null;
  items: RoutineItem[];
  isScheduled: boolean;
}

export type RoutineItem = 
  | { type: 'timer'; timerId: string }
  | { type: 'routine'; routineId: string };

export type Registry = {
  timers: Record<string, Timer>;
  routines: Record<string, Routine>;
};