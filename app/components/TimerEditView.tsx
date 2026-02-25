// app/components/manage/TimerEditView.tsx
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { layout, typography } from "../theme";
import { TimerData } from "../types";
import { formatDuration } from "../utils";
import DurationInput from "./DurationInput";

type EditingField = "name" | "duration" | null;

interface Props {
  timer: TimerData;
  onUpdate: (updates: Partial<TimerData>) => void;
  onCollapse: () => void;
  onDelete: () => void;
}

export default function TimerEditView({
  timer,
  onUpdate,
  onCollapse,
  onDelete,
}: Props) {
  const [editingField, setEditingField] = useState<EditingField>(null);

  const edit = (field: EditingField) => () => setEditingField(field);
  const stopEditing = () => setEditingField(null);

  return (
    <View style={styles.editCard}>
      <Pressable onPress={onCollapse} style={styles.titleRow}>
        <Text style={styles.titleRowHeading}>{timer.name}</Text>
        <View style={styles.durationLabel}>
          <Text style={styles.durationLabelText}>
            {timer.durationSeconds
              ? formatDuration(timer.durationSeconds)
              : "No duration"}
          </Text>
          <Text style={styles.durationLabelText}>▼</Text>
        </View>
      </Pressable>

      <View style={styles.editRow}>
        <Text style={styles.editLabel}>Title: </Text>
        <Pressable onPress={editingField === "name" ? stopEditing : edit("name")}
          style={styles.editField}
        >
          {editingField === "name" ? (
            <TextInput
              autoFocus
              value={timer.name}
              onChangeText={(val) => onUpdate({ name: val })}
              onBlur={stopEditing}
            />
          ) : (
            <Text style={styles.editFieldText}>{timer.name}</Text>
          )}
        </Pressable>
      </View>

      <View style={ styles.editRow }>
        <Text style={ styles.editLabel }>Time: </Text>
        <Pressable onPress={edit("duration")}
          style={styles.editField}
        >
          {editingField === "duration" ? (
            <DurationInput
            value={timer.durationSeconds ?? 0}
            onChange={(val) => onUpdate({ durationSeconds: val || undefined })}
            />
          ) : (
            <Text style={styles.editFieldText}>
              {timer.durationSeconds
                ? formatDuration(timer.durationSeconds)
                : "No duration"}
            </Text>
          )}
        </Pressable>
      </View>

      <Pressable onPress={onDelete}>
        <Text>Delete</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  editCard: { ...layout.card, justifyContent: "space-between" as const },
  titleRow: { ...layout.row, justifyContent: "space-between" as const },
  titleRowHeading: { ...typography.heading },
  durationLabel: { ...layout.row },
  durationLabelText: { ...typography.body },
  editRow: { ...layout.row, margin: "auto" as const },
  editLabel: { ...typography.strong, marginRight: 4 },
  editField: { ...layout.field },
  editFieldText: { ...typography.body }
});
