import { Button, StyleSheet, Text, View } from 'react-native';
import { useRoutineRunner } from '../hooks/use-routine-runner';
import { useRegistry } from '../RegistryContext';
import { Routine } from '../types';

interface TimerViewProps {
  routine: Routine;
}

export default function TimerView({ routine }: TimerViewProps) {
  const { registry } = useRegistry();
  const { currentTimer, secondsLeft, isPaused, isDone, pause, resume, skip } = 
    useRoutineRunner(routine, registry);

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