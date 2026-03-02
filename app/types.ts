export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export type RecurrenceRule =
  | { type: 'daily' }
  | { type: 'weekdays'; days: DayOfWeek[] }
  | { type: 'interval'; everyXDays: number; anchorDate: string; strict: boolean } // TODO: strict will be used for handling skipped days, stub
  | { type: 'nthWeekday'; day: DayOfWeek; n: number }; // TODO: stub
  
export type ScheduleEntry = {
  startMinutes: number;        // minutes since midnight (0-1439)
  recurrence: RecurrenceRule;
  lastCompleted: string | null;  // "YYYY-MM-DD"
  anchorGroupId?: string; // TODO: stub, ignored until anchor groups are implemented
};

export interface TimerData {
  name: string;
  durationSeconds?: number;
}

export interface Routine {
  id: string;
  name: string;
  abbreviation: string;
  items: RoutineItem[];
  schedule: ScheduleEntry[]; 
}

export type RoutineItem = 
  | { type: 'timer'; timer: TimerData }
  | { type: 'routine'; routineId: string };

export type Registry = {
  routines: Record<string, Routine>;
  // TODO: anchorGroups: Record<string, AnchorGroup> -- add when implementing grouped scheduling
};