import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors, layout, typography } from "../theme";
import { TimerData } from "../types";
import DurationInput from "./DurationInput";

interface Props {
  visible: boolean;
  timer: TimerData;
  onSave: (updated: TimerData) => void;
  onCancel: () => void;
}

export default function TimerEditModal({
  visible,
  timer,
  onSave,
  onCancel,
}: Props) {
  const [draft, setDraft] = useState<TimerData>(timer);

  useEffect(() => setDraft(timer), [timer]); // reset draft if timer changes (e.g. opening for a different timer)

  return (
    <Modal
      visible={visible}
      presentationStyle="overFullScreen"
      transparent
      onRequestClose={onCancel}
    >
      <View style={styles.centerModal}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 24,
          }}
        >
          <View style={styles.modal}>
            <Text style={styles.cardTitle}>Edit {draft.name}</Text>
            <View style={styles.card}>
              
              <View style={styles.editRow}>
                <Text style={styles.editLabel}>Title: </Text>
                <TextInput
                  style={styles.editField}
                  value={draft.name}
                  onChangeText={(val) => setDraft((d) => ({ ...d, name: val }))}
                />
              </View>

              <DurationInput
                value={draft.durationSeconds ?? 0}
                onChange={(val) =>
                  setDraft((d) => ({ ...d, durationSeconds: val || undefined }))
                }
              />

              <View style={styles.buttonRow}>
                <Pressable onPress={onCancel} style={styles.button}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
                <Pressable onPress={() => onSave(draft)} style={styles.button}>
                  <Text style={styles.buttonText}>Save</Text>
                </Pressable>
              </View>

            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centerModal: { flex: 1, backgroundColor: colors.background },
  modal: { ...layout.modal },
  card: { ...layout.card },
  cardTitle: { ...typography.title, color: colors.secondaryGround },
  buttonRow: { ...layout.row },
  button: { ...layout.button },
  buttonText: { ...typography.body },
  editRow: { ...layout.row },
  editLabel: { ...typography.strong },
  editField: { ...layout.field, ...typography.body },
});
