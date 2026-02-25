import { Stack } from "expo-router";
import { RegistryProvider } from "./RegistryContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "./theme";

export default function RootLayout() {
  return (
    <RegistryProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ contentStyle: { backgroundColor: colors.secondaryGround } }} />
      </SafeAreaProvider>
    </RegistryProvider>
  );
}