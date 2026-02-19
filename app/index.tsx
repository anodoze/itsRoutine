import { useEffect } from "react";
import { Button, StyleSheet, View, Text } from "react-native";
import TimerView from "./components/TimerView";
import { useRegistry } from "./RegistryContext";
import { createSeedData } from "./Seed";
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  const { registry, loading, seedRegistry } = useRegistry();

  if (loading) return null;

  const routines = Object.values(registry.routines);
  const containerRoutine = routines[0]; // just grab the first one for now

  return (
    <View style={styles.container}>
      {containerRoutine ? (
        <TimerView routine={containerRoutine} />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No routines yet.</Text>
          <Button title="Create one" onPress={() => router.push('/components/manage')} />
        </View>
      )}
      <Button title="Reset Data" onPress={() => seedRegistry(createSeedData())} />
      <Button title="Manage" onPress={() => router.push('/components/manage')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  emptyText: { fontSize: 18, color: '#888' },
});