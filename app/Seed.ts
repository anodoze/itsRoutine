import { Registry, Timer, Routine } from './types';

export function createSeedData(): Registry {
  const timers: Timer[] = [
    {
      id: 't1',
      name: 'Stretch',
      durationSeconds: 5,
      isActive: true
    },
    {
      id: 't2',
      name: 'Push-ups',
      durationSeconds: 8,
      isActive: true
    },
    {
      id: 't3',
      name: 'Squats',
      durationSeconds: 6,
      isActive: true
    },
    {
      id: 't4',
      name: 'Cooldown',
      durationSeconds: 4,
      isActive: true
    }
  ];

  const nestedRoutine: Routine = {
    id: 'r_nested',
    name: 'Quick Cardio',
    startTime: null,
    items: [
      { type: 'timer', timerId: 't2' },
      { type: 'timer', timerId: 't3' }
    ],
    isScheduled: false
  };

  const containerRoutine: Routine = {
    id: 'r_container',
    name: 'Morning Workout',
    startTime: null,
    items: [
      { type: 'timer', timerId: 't1' },
      { type: 'routine', routineId: 'r_nested' },
      { type: 'timer', timerId: 't4' }
    ],
    isScheduled: false
  };

  return {
    timers: Object.fromEntries(timers.map(t => [t.id, t])),
    routines: {
      [nestedRoutine.id]: nestedRoutine,
      [containerRoutine.id]: containerRoutine
    }
  };
}