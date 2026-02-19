import { useEffect } from "react";
import { View, Button, StyleSheet } from "react-native";
import TimerView from "./TimerView";
import { useRegistry } from "./RegistryContext";
import { createSeedData } from "./Seed";

import { useRouter } from 'expo-router';
const router = useRouter();

export default function Index() {
  const { registry, loading, seedRegistry } = useRegistry();

  // Seed on first launch if empty
  useEffect(() => {
    if (!loading && Object.keys(registry.routines).length === 0) {
      seedRegistry(createSeedData());
    }
  }, [loading, registry.routines, seedRegistry]);

  const handleReset = () => {
    seedRegistry(createSeedData());
  };

  if (loading) {
    return null; // or loading spinner
  }

  const containerRoutine = registry.routines['r_container'];
  
  if (!containerRoutine) {
    return null; // waiting for seed
  }

  return (
    <View style={styles.container}>
      <TimerView routine={containerRoutine} />
      <Button title="Reset Data" onPress={handleReset} />
      <Button title="manage" onPress={() => router.push('/manage')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});