import { Registry } from './types';

export function createSeedData(): Registry {
  return {
    routines: {
      r_morning: {
        id: 'r_morning',
        name: 'Morning Routine',
        schedule: [{
          time: '07:00',
          recurrence: { type: 'daily' },
          lastCompleted: null,
        }],
        items: [
          { type: 'timer', timer: { name: 'Drink Water', durationSeconds: 3 } },
          { type: 'timer', timer: { name: 'Meditation', durationSeconds: 5 } },
          { type: 'timer', timer: { name: 'Write Daily Plan', durationSeconds: 4 } },
          { type: 'routine', routineId: 'r_stretch' },
        ],
      },
      r_stretch: {
        id: 'r_stretch',
        name: 'Morning Stretch',
        schedule: [],
        items: [
          { type: 'timer', timer: { name: 'Neck Rolls', durationSeconds: 6 } },
          { type: 'timer', timer: { name: 'Hip Flexors', durationSeconds: 9 } },
        ],
      },
    },
  };
}