// app/manage.tsx
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useRegistry } from "../RegistryContext";
import RoutineListItem from "./RoutineListItem";
import TimerListItem from "./TimerListItem";
import { layout, typography, colors } from '../theme'

type Tab = "routines" | "timers" | "tasks";

export default function ManageScreen() {
  const { registry, addTimer, addRoutine } = useRegistry();
  const [tab, setTab] = useState<Tab>("timers");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const timers = Object.values(registry.timers);
  const routines = Object.values(registry.routines);

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {(["routines", "timers", "tasks"] as Tab[]).map((t) => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            style={[styles.tab, tab === t && styles.activeTab]}
          >
            <Text style={[styles.tabLabel, tab === t && styles.activeTabLabel]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>
      {tab === "routines" && (
        <FlatList
          data={routines}
          keyExtractor={(r) => r.id}
          renderItem={({ item }) => (
            <RoutineListItem
              routine={item}
              isExpanded={expandedId === item.id}
              onExpand={() =>
                setExpandedId((prev) => (prev === item.id ? null : item.id))
              }
            />
          )}
        />
      )}
      {tab === "routines" && (
        <Pressable
          style={styles.fab}
          onPress={() => {
            const id = addRoutine({
              name: "New Routine",
              startTime: null,
              items: [],
              isScheduled: false,
            });
            setExpandedId(id);
          }}
        >
          <Text style={styles.fabLabel}>+</Text>
        </Pressable>
      )}

      {tab === "timers" && (
        <FlatList
          data={timers}
          keyExtractor={(t) => t.id}
          renderItem={({ item }) => (
            <TimerListItem
              timer={item}
              isExpanded={expandedId === item.id}
              onExpand={() =>
                setExpandedId((prev) => (prev === item.id ? null : item.id))
              }
            />
          )}
        />
      )}

      <Pressable
        style={styles.fab}
        onPress={() => {
          if (tab === "timers") {
            const id = addTimer({ name: "New Timer", isActive: false });
            setExpandedId(id);
          } else if (tab === "routines") {
            const id = addRoutine({
              name: "New Routine",
              startTime: null,
              items: [],
              isScheduled: false,
            });
            setExpandedId(id);
          }
        }}
      >
        <Text style={styles.fabLabel}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderColor: colors.border },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabLabel: { ...typography.body, color: colors.textMuted },
  activeTabLabel: { color: colors.primary, fontWeight: 'bold' as const },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  fabLabel: { fontSize: 32, color: colors.white, lineHeight: 56 },
});
