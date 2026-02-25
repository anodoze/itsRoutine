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
  const [editingName, setEditingName] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedRoutineId, setExpandedRoutineId] = useState<string | null>(null);

  const itemKey = (item: RoutineItem, index: number) =>
    item.type === 'timer' ? `timer:${index}` : `routine:${item.routineId}`;

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newItems = [...routine.items];
    const [moved] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, moved);
    updateRoutine(routine.id, { items: newItems });
  };

  const handleAdd = (item: RoutineItem) => {
    updateRoutine(routine.id, { items: [...routine.items, item] });
  };

const renderItem = (info: DragListRenderItemInfo<RoutineItem>) => {
  const { item, onDragStart, isActive } = info;
  const itemIndex = routine.items.indexOf(item);
  return (
    <View>
      <Pressable onLongPress={onDragStart}>
        <Text>☰</Text>
      </Pressable>
      <View>
        <RoutineItemRow
          item={item}
          itemIndex={itemIndex}
          routine={routine}
          depth={depth}
          expandedRoutineId={expandedRoutineId}
          onToggleRoutine={(id) => setExpandedRoutineId(prev => prev === id ? null : id)}
        />
      </View>
    </View>
  );
};

  return (
    <View>
      {/* Header row */}
      <View>
        <Pressable
          onPress={editingName ? () => setEditingName(false) : () => setEditingName(true)}
        >
          {editingName ? (
            <TextInput
              autoFocus
              value={routine.name}
              onChangeText={val => updateRoutine(routine.id, { name: val })}
              onBlur={() => setEditingName(false)}
            />
          ) : (
            <Text>{routine.name}</Text>
          )}
        </Pressable>
        {onCollapse && (
          <Pressable onPress={onCollapse}>
            <Text>▼</Text>
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

      <Pressable onPress={() => setModalVisible(true)} >
        <Text>+ Add Item</Text>
      </Pressable>

      {onCollapse && (
        <Pressable onPress={() => deleteRoutine(routine.id)}>
          <Text>Delete Routine</Text>
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
});