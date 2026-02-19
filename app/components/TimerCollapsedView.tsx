// app/components/manage/TimerCollapsedView.tsx
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Timer } from '../types';
import { formatDuration } from '../utils';

interface Props {
  timer: Timer;
  onExpand: () => void;
}

export default function TimerCollapsedView({ timer, onExpand }: Props) {
  return (
    <Pressable onPress={onExpand} style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name}>{timer.name}</Text>
        <Text style={styles.duration}>
          {timer.durationSeconds ? formatDuration(timer.durationSeconds) : 'No duration'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { margin: 8, padding: 12, borderRadius: 8, backgroundColor: '#f5f5f5' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 18, fontWeight: 'bold' },
  duration: { fontSize: 16, color: '#666' },
});