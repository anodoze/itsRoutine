export interface TimerData {
  name: string;
  durationSeconds?: number;
}

export interface Routine {
  id: string;
  name: string;
  startTime: string | null;
  items: RoutineItem[];
  isScheduled: boolean;
}

export type RoutineItem = 
  | { type: 'timer'; timer: TimerData }
  | { type: 'routine'; routineId: string };

export type Registry = {
  routines: Record<string, Routine>;
};

export type RegistryContextValue = {
  registry: Registry;
  loading: boolean;
  
  addRoutine: (routine: Omit<Routine, 'id'>) => string;
  updateRoutine: (id: string, updates: Partial<Routine>) => void;
  deleteRoutine: (id: string) => Promise<boolean>;
  
  getRoutineReferences: (routineId: string) => Routine[]; // which routines nest this one

  seedRegistry: (data: Registry) => void;
};