// app/manage.tsx
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useRegistry } from "../RegistryContext";
import { colors, layout, typography } from "../theme";
import RoutineListItem from "./RoutineListItem";

export default function ManageScreen() {
  const { registry, addRoutine } = useRegistry();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const routines = Object.values(registry.routines);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={routines}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => (
          <RoutineListItem
            routine={item}
            isExpanded={expandedId === item.id}
            onExpand={() => setExpandedId(prev => prev === item.id ? null : item.id)}
          />
        )}
      />
      <Pressable
        style={styles.fab}
        onPress={() => {
          const id = addRoutine({ name: 'New Routine', startTime: null, items: [], isScheduled: false });
          setExpandedId(id);
        }}
      >
        <Text style={styles.fabLabel}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabBar: { flexDirection: "row" },
  list: { backgroundColor: colors.ground },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  activeTab: { backgroundColor: colors.ground },
  tabLabel: { ...typography.heading, color: colors.textSecondary },
  activeTabLabel: { ...typography.heading, color: colors.secondaryGround },
  fab: {
    ...layout.card,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    margin: "auto" as const,
  },
  fabLabel: { fontSize: 32, color: "white" as const, lineHeight: 56 },
});
