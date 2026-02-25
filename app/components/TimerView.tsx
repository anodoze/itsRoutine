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
      <View>
        <Text>Done!</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>{currentTimer.name}</Text>
      {secondsLeft !== null && (
        <Text >{secondsLeft}</Text>
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

});