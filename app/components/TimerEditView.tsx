// app/components/manage/TimerEditView.tsx
import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Timer } from '../types';
import { formatDuration } from '../utils';
import DurationInput from './DurationInput';

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
      {/* Name */}
      <Pressable onPress={editingField === null ? onCollapse : stopEditing}
        style={[styles.field, editingField === 'name' && styles.fieldActive]}>
        {editingField === 'name' ? (
          <TextInput
            autoFocus
            value={timer.name}
            onChangeText={val => onUpdate({ name: val })}
            onBlur={stopEditing}
            style={styles.nameInput}
          />
        ) : (
          <Pressable onPress={edit('name')}>
            <Text style={styles.name}>{timer.name}</Text>
          </Pressable>
        )}
      </Pressable>

      {/* Duration */}
      <Pressable onPress={edit('duration')}
        style={[styles.field, editingField === 'duration' && styles.fieldActive]}>
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
  card: { margin: 8, padding: 12, borderRadius: 8, backgroundColor: '#f5f5f5' },
  field: { padding: 8, borderRadius: 6 },
  fieldActive: { backgroundColor: '#e8f0fe', borderWidth: 1, borderColor: '#4a90e2' },
  name: { fontSize: 18, fontWeight: 'bold' },
  nameInput: { fontSize: 18, fontWeight: 'bold' },
  fieldValue: { fontSize: 16, color: '#444' },
  deleteBtn: { marginTop: 8, padding: 8 },
  deleteLabel: { color: 'red' },
});