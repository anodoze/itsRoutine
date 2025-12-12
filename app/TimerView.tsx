const testTimers: Timer[] = [
  {
    id: 't1',
    name: 'Stretch',
    durationSeconds: 30,
    isActive: true
  },
  {
    id: 't2', 
    name: 'Push-ups',
    durationSeconds: 45,
    isActive: true
  }
];

const testRoutine: Routine = {
  id: 'r1',
  name: 'Quick Warmup',
  startTime: null,
  items: [
    { type: 'timer', timerId: 't1' },
    { type: 'timer', timerId: 't2' }
  ],
  isScheduled: false
};

import { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Timer, Routine } from './types'

interface TimerViewProps {
    routine: Routine;
}

function TimerView({routine}: TimerViewProps){
    const [index, setIndex] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [paused, setPaused] = useState(true);
    
    const item = routine.items[index];
    if (!item || item.type !== 'timer') return <Text>Done!</Text>;

    const timer = testTimers.find(t => t.id === item?.timerId);

    const nextItem = routine.items[index + 1];
    if (!nextItem || nextItem.type !== 'timer') return <Text>Done!</Text>;
    
    const nextTimer = nextItem && testTimers.find( t => t.id === nextItem.timerId);

    useEffect(() => {
        if (timer && seconds === 0 && paused ) {
            setSeconds(timer.durationSeconds);
        }
    }, [timer, paused]);

    useEffect(() => {
        if (paused || seconds === 0) return;

        const tick = setInterval(() => {
            setSeconds(s => {
                if (s <= 1) {
                    setIndex(i => i + 1);
                    setPaused(true);
                    return 0;
                }
                return s-1
            });
        }, 1000)

        return () => clearInterval(tick);
    }, [paused, seconds]);

    if (!timer) return <Text>Done!</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.name}>{timer.name}</Text>
            <Text style={styles.timer}>{seconds}</Text>
            { nextTimer && <Text>Next: {nextTimer.name}</Text>}
            <Button 
                title={paused ? 'Start' : 'Pause'}
                onPress={() => setPaused(!paused)}
            />
        </View>
    )
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