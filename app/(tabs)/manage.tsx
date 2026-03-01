import { FlatList, Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRegistry } from "../_RegistryContext";
import RoutineListItem from "../components/RoutineListItem";
import { colors } from "../theme";

export default function ManageScreen() {
  const { registry, addRoutine } = useRegistry();
  const routines = Object.values(registry.routines);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={routines}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => <RoutineListItem routine={item} />}
      />
      <Pressable
        style={styles.fab}
        onPress={() =>
          addRoutine({ name: "New Routine", items: [], schedule: [] })
        }
      >
        <Text style={styles.fabLabel}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ground },
  fab: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondaryGround,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabLabel: { fontSize: 32, color: colors.textPrimary, lineHeight: 56 },
});
