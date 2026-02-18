import { View, Text, Button, StyleSheet } from 'react-native';
import { Timer, Routine, Registry } from './types';
import { useRoutineRunner } from './hooks/use-routine-runner';

export const testTimers: Timer[] = [
  {
    id: 't1',
    name: 'Stretch',
    durationSeconds: 3,
    isActive: true
  },
  {
    id: 't2', 
    name: 'Push-ups',
    durationSeconds: 10,
    isActive: true
  },
  {
    id: 't3', 
    name: 'jump',
    durationSeconds: 1,
    isActive: true
  }
];

export const nestedRoutine: Routine = {
  id: 'r2',
  name: 'Cooldown',
  startTime: null,
  items: [
    { type: 'timer', timerId: 't3' },
    { type: 'timer', timerId: 't2' },
    { type: 'timer', timerId: 't3' }
  ],
  isScheduled: false
}

export const testRoutine: Routine = {
  id: 'r1',
  name: 'Quick Warmup',
  startTime: null,
  items: [
    { type: 'timer', timerId: 't1' },
    { type: 'routine', routineId: 'r2' },
    { type: 'timer', timerId: 't2' }
  ],
  isScheduled: false
};

const testRegistry: Registry = {
  timers: Object.fromEntries(testTimers.map(t => [t.id, t])),
  routines: { 
    [testRoutine.id]: testRoutine,
    [nestedRoutine.id]: nestedRoutine
   }
};

interface TimerViewProps {
  routine: Routine;
}

export default function TimerView({ routine }: TimerViewProps) {
  const { currentTimer, secondsLeft, isPaused, isDone, pause, resume, skip } = 
    useRoutineRunner(routine, testRegistry);

  if (!currentTimer || isDone) {
    return (
      <View style={styles.container}>
        <Text style={styles.name}>Done!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{currentTimer.name}</Text>
      {secondsLeft !== null && (
        <Text style={styles.timer}>{secondsLeft}</Text>
      )}
      <Button 
        title={isPaused ? 'Start' : 'Pause'}
        onPress={() => isPaused ? resume() : pause()}
      />
      <Button 
        title="Skip"
        onPress={skip}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  timer: {
    fontSize: 72,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});