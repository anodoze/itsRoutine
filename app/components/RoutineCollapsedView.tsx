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
    <Pressable onPress={onExpand} style={styles.routineCard}>
      <Text style={ styles.routineHeading }>{routine.name} ▶</Text>
      <View>
        <Text style={styles.itemCount}>{itemCount} {itemCount === 1 ? 'item' : 'items'}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  routineCard: { ...layout.card, ...layout.row },
  routineHeading: { ...typography.heading },
  itemCount: { ...typography.body, marginLeft: 16 }
});