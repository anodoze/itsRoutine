// app/components/manage/AddItemModal.tsx
import { useState } from 'react';
import { Modal, View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { useRegistry } from '../RegistryContext';
import { RoutineItem } from '../types';

type Tab = 'timers' | 'routines';

interface Props {
  visible: boolean;
  routineId: string; // to exclude self from routine picker
  onAdd: (item: RoutineItem) => void;
  onClose: () => void;
}

export default function AddItemModal({ visible, routineId, onAdd, onClose }: Props) {
  const { registry, addTimer } = useRegistry();
  const [tab, setTab] = useState<Tab>('timers');

  const timers = Object.values(registry.timers);
  const routines = Object.values(registry.routines).filter(r => r.id !== routineId);

  const handleNewTimer = () => {
    const id = addTimer({ name: 'New Timer', isActive: false });
    onAdd({ type: 'timer', timerId: id });
    onClose();
  };

  const handlePickTimer = (timerId: string) => {
    onAdd({ type: 'timer', timerId });
    onClose();
  };

  const handlePickRoutine = (routineId: string) => {
    onAdd({ type: 'routine', routineId });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Item</Text>
          <Pressable onPress={onClose}><Text style={styles.close}>✕</Text></Pressable>
        </View>

        <View style={styles.tabBar}>
          {(['timers', 'routines'] as Tab[]).map(t => (
            <Pressable key={t} onPress={() => setTab(t)}
              style={[styles.tab, tab === t && styles.activeTab]}>
              <Text style={[styles.tabLabel, tab === t && styles.activeTabLabel]}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {tab === 'timers' && (
          <FlatList
            data={[null, ...timers]} // null = "New Timer" sentinel
            keyExtractor={item => item?.id ?? 'new'}
            renderItem={({ item }) => item === null ? (
              <Pressable onPress={handleNewTimer} style={styles.newItem}>
                <Text style={styles.newItemLabel}>+ New Timer</Text>
              </Pressable>
            ) : (
              <Pressable onPress={() => handlePickTimer(item.id)} style={styles.item}>
                <Text style={styles.itemLabel}>{item.name}</Text>
              </Pressable>
            )}
          />
        )}

        {tab === 'routines' && (
          <FlatList
            data={routines}
            keyExtractor={r => r.id}
            renderItem={({ item }) => (
              <Pressable onPress={() => handlePickRoutine(item.id)} style={styles.item}>
                <Text style={styles.itemLabel}>{item.name}</Text>
              </Pressable>
            )}
          />
        )}
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