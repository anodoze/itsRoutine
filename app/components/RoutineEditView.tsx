// app/components/manage/RoutineEditView.tsx
import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import DragList, { DragListRenderItemInfo } from 'react-native-draglist';
import { Routine, RoutineItem } from '../types';
import { useRegistry } from '../RegistryContext';
import RoutineItemRow from './RoutineItemRow';
import AddItemModal from './AddItemModal';
import { layout, typography, colors } from '../theme'

interface Props {
  routine: Routine;
  onCollapse?: () => void;
  depth?: number;
}

export default function RoutineEditView({ routine, onCollapse, depth = 0 }: Props) {
  const { updateRoutine, deleteRoutine } = useRegistry();
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleItem = (key: string) =>
    setExpandedKey(prev => prev === key ? null : key);

  const itemKey = (item: RoutineItem) =>
    item.type === 'timer' ? `timer:${item.timerId}` : `routine:${item.routineId}`;

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newItems = [...routine.items];
    const [moved] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, moved);
    updateRoutine(routine.id, { items: newItems });
  };

  const handleAdd = (item: RoutineItem) => {
    updateRoutine(routine.id, { items: [...routine.items, item] });
    setExpandedKey(itemKey(item));
  };

  const renderItem = (info: DragListRenderItemInfo<RoutineItem>) => {
    const { item, onDragStart, isActive } = info;
    const key = itemKey(item);
    return (
      <View style={[styles.itemRow, isActive && styles.itemRowDragging]}>
        <Pressable onLongPress={onDragStart} style={styles.dragHandle}>
          <Text style={styles.dragHandleIcon}>☰</Text>
        </Pressable>
        <View style={styles.itemContent}>
          <RoutineItemRow
            item={item}
            isExpanded={expandedKey === key}
            onExpand={() => toggleItem(key)}
            depth={depth}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.card, depth > 0 && styles.nestedCard]}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <Pressable
          onPress={editingName ? () => setEditingName(false) : () => setEditingName(true)}
          style={[styles.nameField, editingName && styles.fieldActive]}
        >
          {editingName ? (
            <TextInput
              autoFocus
              value={routine.name}
              onChangeText={val => updateRoutine(routine.id, { name: val })}
              onBlur={() => setEditingName(false)}
              style={styles.nameInput}
            />
          ) : (
            <Text style={styles.name}>{routine.name}</Text>
          )}
        </Pressable>
        {onCollapse && (
          <Pressable onPress={onCollapse} style={styles.chevronBtn}>
            <Text style={styles.chevron}>▼</Text>
          </Pressable>
        )}
      </View>

      {/* Item list */}
      <DragList
        data={routine.items}
        keyExtractor={itemKey}
        onReordered={handleReorder}
        renderItem={renderItem}
        scrollEnabled={false}
      />

      <Pressable onPress={() => setModalVisible(true)} style={styles.addBtn}>
        <Text style={styles.addLabel}>+ Add Item</Text>
      </Pressable>

      {onCollapse && (
        <Pressable onPress={() => deleteRoutine(routine.id)} style={styles.deleteBtn}>
          <Text style={styles.deleteLabel}>Delete Routine</Text>
        </Pressable>
      )}

      <AddItemModal
        visible={modalVisible}
        routineId={routine.id}
        onAdd={handleAdd}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

// RoutineEditView
const styles = StyleSheet.create({
  card: { ...layout.card, backgroundColor: colors.card },
  nestedCard: { ...layout.card, backgroundColor: colors.nestedCard, margin: 4 },
  headerRow: { ...layout.row, justifyContent: 'space-between' },
  nameField: { ...layout.field, flex: 1 },
  fieldActive: { backgroundColor: colors.activeFieldBg, borderWidth: 1, borderColor: colors.activeFieldBorder },
  name: { ...typography.heading },
  nameInput: { ...typography.heading },
  chevronBtn: { padding: 8 },
  chevron: { fontSize: 16, color: colors.textMuted },
  itemRow: { ...layout.row, alignItems: 'flex-start' },
  itemRowDragging: { opacity: 0.7, backgroundColor: colors.draggingBg, borderRadius: 6 },
  dragHandle: { padding: 12, justifyContent: 'center' },
  dragHandleIcon: { fontSize: 16, color: colors.textLight },
  itemContent: { flex: 1 },
  addBtn: { padding: 12 },
  addLabel: { ...typography.body, color: colors.primary, fontWeight: 'bold' },
  deleteBtn: { padding: 8 },
  deleteLabel: { color: colors.danger },
});