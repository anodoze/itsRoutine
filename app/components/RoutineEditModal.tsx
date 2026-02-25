import { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal } from 'react-native';
import DragList, { DragListRenderItemInfo } from 'react-native-draglist';
import { Routine, RoutineItem } from '../types';
import { useRegistry } from '../RegistryContext';
import RoutineItemRow from './RoutineItemRow';
import AddItemModal from './AddItemModal';

interface Props {
  visible: boolean;
  routine: Routine;
  onClose: () => void;
}

export default function RoutineEditModal({ visible, routine, onClose }: Props) {
  const { updateRoutine, deleteRoutine } = useRegistry();
  const [expandedRoutineId, setExpandedRoutineId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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
            depth={0}
            expandedRoutineId={expandedRoutineId}
            onToggleRoutine={(id) => setExpandedRoutineId(prev => prev === id ? null : id)}
          />
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View>
        <View>
          <Pressable onPress={editingName ? () => setEditingName(false) : () => setEditingName(true)}>
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
          <Pressable onPress={onClose}>
            <Text>Done</Text>
          </Pressable>
        </View>

        <DragList
          data={routine.items}
          keyExtractor={itemKey}
          onReordered={handleReorder}
          renderItem={renderItem}
          scrollEnabled={false}
        />

        <Pressable onPress={() => setModalVisible(true)}>
          <Text>+ Add Item</Text>
        </Pressable>

        <Pressable onPress={async () => { await deleteRoutine(routine.id); onClose(); }}>
          <Text>Delete Routine</Text>
        </Pressable>

        <AddItemModal
          visible={modalVisible}
          routineId={routine.id}
          onAdd={handleAdd}
          onClose={() => setModalVisible(false)}
        />
      </View>
    </Modal>
  );
}