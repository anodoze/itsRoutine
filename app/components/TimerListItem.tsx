import { TimerData } from "../types";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { formatDuration } from "../utils";
import { layout, typography } from "../theme";

interface Props {
  timer: TimerData;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TimerListItem({ timer, onEdit, onDelete }: Props) {
  return (
    <View style={styles.card}>
      <Text>{timer.name}</Text>
      <Text>
        {timer.durationSeconds ? formatDuration(timer.durationSeconds) : 'No duration'}
      </Text>
      <Pressable onPress={onEdit}><Text>Edit</Text></Pressable>
      <Pressable onPress={onDelete}><Text>Delete</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { ...layout.card },
  titleRow: { ...layout.row, justifyContent: "space-between" as const },
  titleRowHeading: { ...typography.heading },
  durationLabel: { ...layout.row },
  durationLabelText: { ...typography.body },
  editRow: { ...layout.row, margin: "auto" as const },
  editLabel: { ...typography.strong, marginRight: 4 },
  editField: { ...layout.field },
  editFieldText: { ...typography.body }
});