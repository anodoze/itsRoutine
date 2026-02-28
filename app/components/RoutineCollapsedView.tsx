import { Pressable, StyleSheet, Text } from "react-native";
import { layout, typography } from "../theme";
import { Routine } from "../types";

interface Props {
  routine: Routine;
  onExpand: () => void;
}

export default function RoutineCollapsedView({ routine, onExpand }: Props) {
  const itemCount = routine.items.length;
  return (
    <Pressable onPress={onExpand} style={styles.routineCard}>
      <Text style={styles.routineHeading}>{routine.name} ▶</Text>
      <Text style={styles.itemCount}>
        {itemCount} {itemCount === 1 ? "item" : "items"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  routineCard: { ...layout.card, ...layout.row },
  routineHeading: { ...typography.heading },
  itemCount: { ...typography.body, marginLeft: 16 },
});
