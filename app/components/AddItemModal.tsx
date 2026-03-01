// app/components/manage/AddItemModal.tsx
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRegistry } from '../_RegistryContext';
import { Registry, RoutineItem } from '../types';

interface Props {
  visible: boolean;
  routineId: string; // to exclude self from routine picker
  onAdd: (item: RoutineItem) => void;
  onClose: () => void;
}

//lookup to prevent routines from being able to add themselves as subroutines
function routineContains(registry: Registry, routineId: string, targetId: string): boolean {
  const routine = registry.routines[routineId];
  if (!routine) return false;
  return routine.items.some((item: RoutineItem) =>
    item.type === 'routine' && (
      item.routineId === targetId ||
      routineContains(registry, item.routineId, targetId)
    )
  );
}

export default function AddItemModal({ visible, routineId, onAdd, onClose }: Props) {
  const { registry } = useRegistry();
  const routines = Object.values(registry.routines).filter(r =>
    r.id !== routineId && !routineContains(registry, r.id, routineId)
  );

  const handleAddTimer = () => {
    onAdd({ type: 'timer', timer: { name: 'New Timer' } });
    onClose();
  };

  const handlePickRoutine = (id: string) => {
    onAdd({ type: 'routine', routineId: id });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Item</Text>
          <Pressable onPress={onClose}><Text style={styles.close}>✕</Text></Pressable>
        </View>

        <Pressable onPress={handleAddTimer} style={styles.newItem}>
          <Text style={styles.newItemLabel}>+ New Timer</Text>
        </Pressable>

        <Text>Add Routine</Text>
        <FlatList
          data={routines}
          keyExtractor={r => r.id}
          renderItem={({ item }) => (
            <Pressable onPress={() => handlePickRoutine(item.id)} style={styles.item}>
              <Text style={styles.itemLabel}>{item.name}</Text>
            </Pressable>
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold' },
  close: { fontSize: 20, color: '#888' },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ddd' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#4a90e2' },
  tabLabel: { fontSize: 16, color: '#888' },
  activeTabLabel: { color: '#4a90e2', fontWeight: 'bold' },
  item: { padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  itemLabel: { fontSize: 16 },
  newItem: { padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  newItemLabel: { fontSize: 16, color: '#4a90e2', fontWeight: 'bold' },
});