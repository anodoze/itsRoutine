import { useState, useEffect } from "react";
import { Modal, View, Pressable, Text, TextInput, StyleSheet } from "react-native";
import { TimerData } from "../types";
import DurationInput from "./DurationInput";
import { layout, typography } from "../theme";

interface Props {
  visible: boolean;
  timer: TimerData;
  onSave: (updated: TimerData) => void;
  onCancel: () => void;
}

export default function TimerEditModal({ visible, timer, onSave, onCancel }: Props) {
  const [draft, setDraft] = useState<TimerData>(timer);

  useEffect(() => setDraft(timer), [timer]); // reset draft if timer changes (e.g. opening for a different timer)

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onCancel}>
      <View>
        <View>
          <Pressable onPress={onCancel}><Text>Cancel</Text></Pressable>
          <Text>Edit Timer</Text>
          <Pressable onPress={() => onSave(draft)}><Text>Save</Text></Pressable>
        </View>

        <TextInput
          value={draft.name}
          onChangeText={val => setDraft(d => ({ ...d, name: val }))}
        />

        <DurationInput
          value={draft.durationSeconds ?? 0}
          onChange={val => setDraft(d => ({ ...d, durationSeconds: val || undefined }))}
        />
      </View>
    </Modal>
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