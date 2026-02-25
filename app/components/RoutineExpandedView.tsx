import { Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { Routine } from "../types";
import RoutineItemRow from "./RoutineItemRow";
import { layout, typography } from "../theme";

interface Props {
  routine: Routine;
  onCollapse: () => void;
  onEdit: () => void;
}

export default function RoutineExpandedView({ routine, onCollapse, onEdit }: Props) {
  const [expandedRoutineId, setExpandedRoutineId] = useState<string | null>(null);

  return (
    <View style={styles.routineCard}>
        <Pressable onPress={onCollapse} style={styles.routineRow}>
          <Text style={ styles.routineHeading}>{routine.name} ▼</Text>
        <Pressable onPress={onEdit} style={ styles.editButton }>
          <Text style={styles.editButtonText}>Edit</Text>
        </Pressable>
        </Pressable>

      {routine.items.map((item, index) => (
          <RoutineItemRow
            key={index}
            item={item}
            itemIndex={index}
            routine={routine}
            depth={0}
            expandedRoutineId={expandedRoutineId}
            onToggleRoutine={(id) => setExpandedRoutineId(prev => prev === id ? null : id)}
          />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  routineCard: { ...layout.card},
  routineRow: { ...layout.row },
  routineHeading: { ...typography.heading, marginBottom: 8},
  editButton: { ...layout.button },
  editButtonText: { ...typography.button }
})