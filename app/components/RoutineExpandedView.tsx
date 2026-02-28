import { Pressable, StyleSheet, Text, View } from "react-native";
import { Routine } from "../types";
import RoutineItemRow from "./RoutineItemRow";
import { layout, typography } from "../theme";

interface Props {
  routine: Routine;
  onCollapse: () => void;
  onEdit: () => void;
}

export default function RoutineExpandedView({ routine, onCollapse, onEdit }: Props) {

  return (
    <View style={styles.routineCard}>
      <View style={styles.routineRow}>
        <Pressable onPress={onCollapse}>
          <Text style={ styles.routineHeading}>{routine.name} ▼</Text>
        </Pressable>
        <Pressable onPress={onEdit} style={ styles.editButton }>
          <Text style={styles.editButtonText}>Edit</Text>
        </Pressable>
      </View>

      {routine.items.map((item, index) => (
          <RoutineItemRow
            key={index}
            item={item}
            itemIndex={index}
            routine={routine}
            depth={0}
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