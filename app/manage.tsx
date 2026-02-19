// app/manage.tsx
import { useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { useRegistry } from './RegistryContext';
import TimerListItem from './components/TimerListItem';

type Tab = 'routines' | 'timers' | 'tasks';

export default function ManageScreen() {
  const { registry, addTimer } = useRegistry();
  const [tab, setTab] = useState<Tab>('timers');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const timers = Object.values(registry.timers);

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {(['routines', 'timers', 'tasks'] as Tab[]).map(t => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.activeTab]}>
            <Text style={[styles.tabLabel, tab === t && styles.activeTabLabel]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {tab === 'timers' && (
        <FlatList
          data={timers}
          keyExtractor={t => t.id}
          renderItem={({ item }) => (
            <TimerListItem
              timer={item}
              isExpanded={expandedId === item.id}
              onExpand={() => setExpandedId(prev => prev === item.id ? null : item.id)}
            />
          )}
        />
      )}

      <Pressable style={styles.fab} onPress={() => {
        const id = addTimer({ name: 'New Timer', isActive: false });
        setExpandedId(id);
      }}>
        <Text style={styles.fabLabel}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ddd' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#4a90e2' },
  tabLabel: { fontSize: 16, color: '#888' },
  activeTabLabel: { color: '#4a90e2', fontWeight: 'bold' },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#4a90e2', justifyContent: 'center', alignItems: 'center' },
  fabLabel: { fontSize: 32, color: '#fff', lineHeight: 56 },
});