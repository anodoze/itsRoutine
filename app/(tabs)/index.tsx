import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRegistry } from "../_RegistryContext";
import TimerView from "../components/TimerView";
import { colors } from '../theme';

export default function Index() {
  const router = useRouter();
  const { registry, loading, seedRegistry } = useRegistry();

  if (loading) return null;

  const routines = Object.values(registry.routines);
  const containerRoutine = routines[0]; // TODO: add logic for choosing routines based on scheduling/manual start

  return (
    <SafeAreaView style={styles.container}>
      {containerRoutine ? (
        <TimerView routine={containerRoutine} />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No routines yet.</Text>
          <Button title="Create one" onPress={() => router.navigate('/manage')} />
        </View>
      )}
      {/* <Button title="Reset Data" onPress={() => seedRegistry(createSeedData())} /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ground },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  emptyText: { fontSize: 18, color: '#888' },
});