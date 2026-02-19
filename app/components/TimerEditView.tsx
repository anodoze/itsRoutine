// app/components/manage/TimerEditView.tsx
import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Timer } from '../types';
import { formatDuration } from '../utils';
import DurationInput from './DurationInput';
import { layout, typography, colors } from '../theme'

type EditingField = 'name' | 'duration' | null;

interface Props {
  timer: Timer;
  onUpdate: (updates: Partial<Timer>) => void;
  onCollapse: () => void;
  onDelete: () => void;
}

export default function TimerEditView({ timer, onUpdate, onCollapse, onDelete }: Props) {
  const [editingField, setEditingField] = useState<EditingField>(null);

  const edit = (field: EditingField) => () => setEditingField(field);
  const stopEditing = () => setEditingField(null);

  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <Pressable
          onPress={editingField === 'name' ? stopEditing : edit('name')}
          style={[styles.nameField, editingField === 'name' && styles.fieldActive]}
        >
          {editingField === 'name' ? (
            <TextInput
              autoFocus
              value={timer.name}
              onChangeText={val => onUpdate({ name: val })}
              onBlur={stopEditing}
              style={styles.nameInput}
            />
          ) : (
            <Text style={styles.name}>{timer.name}</Text>
          )}
        </Pressable>
        <Pressable onPress={onCollapse} style={styles.chevronBtn}>
          <Text style={styles.chevron}>▼</Text>
        </Pressable>
      </View>

      {/* Duration */}
      <Pressable
        onPress={edit('duration')}
        style={[styles.field, editingField === 'duration' && styles.fieldActive]}
      >
        {editingField === 'duration' ? (
          <DurationInput
            value={timer.durationSeconds ?? 0}
            onChange={val => onUpdate({ durationSeconds: val || undefined })}
          />
        ) : (
          <Text style={styles.fieldValue}>
            {timer.durationSeconds ? formatDuration(timer.durationSeconds) : 'No duration'}
          </Text>
        )}
      </Pressable>

      <Pressable onPress={onDelete} style={styles.deleteBtn}>
        <Text style={styles.deleteLabel}>Delete</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { ...layout.card, backgroundColor: colors.card },
  headerRow: { ...layout.row, justifyContent: 'space-between' },
  nameField: { ...layout.field, flex: 1 },
  fieldActive: { backgroundColor: colors.activeFieldBg, borderWidth: 1, borderColor: colors.activeFieldBorder },
  name: { ...typography.heading },
  nameInput: { ...typography.heading },
  field: { ...layout.field, marginTop: 4 },
  fieldValue: { ...typography.label },
  chevronBtn: { padding: 8 },
  chevron: { fontSize: 16, color: colors.textMuted },
  deleteBtn: { marginTop: 8, padding: 8 },
  deleteLabel: { color: colors.danger },
});