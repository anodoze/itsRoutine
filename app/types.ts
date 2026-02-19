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

export type RegistryContextValue = {
  registry: Registry;
  loading: boolean;
  
  addTimer: (timer: Omit<Timer, 'id'>) => string;
  updateTimer: (id: string, updates: Partial<Timer>) => void;
  deleteTimer: (id: string) => Promise<boolean>; // ← async, returns true if deleted
  
  addRoutine: (routine: Omit<Routine, 'id'>) => string;
  updateRoutine: (id: string, updates: Partial<Routine>) => void;
  deleteRoutine: (id: string) => Promise<boolean>;
  
  getTimerReferences: (timerId: string) => Routine[]; // which routines use this timer
  getRoutineReferences: (routineId: string) => Routine[]; // which routines nest this one
};