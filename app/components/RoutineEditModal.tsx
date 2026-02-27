import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DragList, { DragListRenderItemInfo } from "react-native-draglist";
import { useRegistry } from "../RegistryContext";
import { colors, layout, typography } from "../theme";
import { Routine, RoutineItem } from "../types";
import AddItemModal from "./AddItemModal";
import RoutineItemRow from "./RoutineItemRow";

interface Props {
  visible: boolean;
  routine: Routine;
  onClose: () => void;
}

export default function RoutineEditModal({ visible, routine, onClose }: Props) {
  const { updateRoutine, deleteRoutine } = useRegistry();
  const [expandedRoutineId, setExpandedRoutineId] = useState<string | null>(
    null,
  );
  const [editingName, setEditingName] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const itemKey = (item: RoutineItem, index: number) =>
    item.type === "timer" ? `timer:${index}` : `routine:${item.routineId}`;

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
          <View>
            <RoutineItemRow
              item={item}
              itemIndex={itemIndex}
              routine={routine}
              depth={0}
              expandedRoutineId={expandedRoutineId}
              onToggleRoutine={(id) =>
                setExpandedRoutineId((prev) => (prev === id ? null : id))
              }
            />
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
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
            <Text style={styles.cardTitle}>Edit {routine.name}</Text>
            <Pressable
              style={styles.editRow}
              onPress={
                editingName
                  ? () => setEditingName(false)
                  : () => setEditingName(true)
              }
            >
              <Text style={styles.editLabel}>Title: </Text>
              {editingName ? (
                <TextInput
                  autoFocus
                  style={styles.editField}
                  value={routine.name}
                  onChangeText={(val) =>
                    updateRoutine(routine.id, { name: val })
                  }
                  onBlur={() => setEditingName(false)}
                />
              ) : (
                <Text>{routine.name}</Text>
              )}
            </Pressable>
            <Pressable onPress={onClose}>
              <Text style={styles.button}>Done</Text>
            </Pressable>

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

            <Pressable
              onPress={async () => {
                await deleteRoutine(routine.id);
                onClose();
              }}
            >
              <Text>Delete Routine</Text>
            </Pressable>

            <AddItemModal
              visible={modalVisible}
              routineId={routine.id}
              onAdd={handleAdd}
              onClose={() => setModalVisible(false)}
            />
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
