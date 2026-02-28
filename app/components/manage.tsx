import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useRegistry } from "../RegistryContext";
import { colors } from "../theme";
import RoutineListItem from "./RoutineListItem";

export default function ManageScreen() {
  const { registry, addRoutine } = useRegistry();
  const routines = Object.values(registry.routines);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' }, // drop "relative?"
  list: { backgroundColor: colors.ground },
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
