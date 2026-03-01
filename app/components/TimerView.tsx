import { Button, StyleSheet, Text, View } from "react-native";
import { useRegistry } from "../_RegistryContext";
import { useRoutineRunner } from "../hooks/use-routine-runner";
import { colors, layout } from "../theme";
import { Routine } from "../types";

interface TimerViewProps {
  routine: Routine;
}

export default function TimerView({ routine }: TimerViewProps) {
  const { registry } = useRegistry();
  const { currentTimer, secondsLeft, isPaused, isDone, pause, resume, skip } =
    useRoutineRunner(routine, registry);

  if (!currentTimer || isDone) {
    return (
      <View style={styles.container}>
        <Text>Done!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>{currentTimer.name}</Text>
      {secondsLeft !== null && <Text>{secondsLeft}</Text>}
      <View style={styles.buttonRow}>
        <Button
          
          title={isPaused ? "Start" : "Pause"}
          onPress={() => (isPaused ? resume() : pause())}
        />
        <Button title="Skip" onPress={skip} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.ground,
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  buttonRow: { ...layout.row },
  button: { ...layout.button },
});
