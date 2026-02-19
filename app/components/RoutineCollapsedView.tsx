// app/components/manage/RoutineCollapsedView.tsx
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Routine } from '../types';
import { layout, typography, colors } from '../theme'

interface Props {
  routine: Routine;
  onExpand: () => void;
}

export default function RoutineCollapsedView({ routine, onExpand }: Props) {
  const itemCount = routine.items.length;
  return (
    <Pressable onPress={onExpand} style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name}>{routine.name}</Text>
        <View style={styles.right}>
         <Text style={styles.meta}>{itemCount} {itemCount === 1 ? 'item' : 'items'}</Text>
         <Text style={styles.chevron}>▶</Text>
        </View>
      </View>
    </Pressable>
  );
}

// RoutineCollapsedView
const styles = StyleSheet.create({
  card: { ...layout.card, backgroundColor: colors.card },
  row: { ...layout.row, justifyContent: 'space-between' },
  name: { ...typography.heading },
  right: { ...layout.row, gap: 8 },
  meta: { ...typography.meta },
  chevron: { fontSize: 16, color: colors.textMuted },
});