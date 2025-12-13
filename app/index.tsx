import { Text, View } from "react-native";
import TimerView from "./TimerView";
import { testRoutine } from "./TimerView";

export default function Index() {
  return (
    <TimerView routine={testRoutine} />
  );
}
