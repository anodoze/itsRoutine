import { Pressable, StyleSheet, Text, View } from "react-native";
import { layout, typography } from "../theme";
import { TimerData } from "../types";
import { formatDuration } from "../utils";

interface Props {
  timer: TimerData;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TimerListItem({ timer, onEdit, onDelete }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.durationLabel}>
        {timer.durationSeconds
          ? formatDuration(timer.durationSeconds)
          : "No duration"}
      </Text>
      <Text style={styles.name}>{timer.name}</Text>
      <Pressable onPress={onEdit} style={styles.button}>
        <Text style={styles.buttonText}>Edit</Text>
      </Pressable>
      <Pressable onPress={onDelete} style={styles.button}>
        <Text style={ styles.buttonText }>Delete</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { ...layout.card, ...layout.row },
  name: { ...typography.heading, flex: 1 },
  durationLabel: { ...typography.body, marginRight: 8 },
  button: { ...layout.button },
  buttonText: { ...typography.buttonText }
});