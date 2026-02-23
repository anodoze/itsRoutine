import { Stack } from "expo-router";
import { RegistryProvider } from "./RegistryContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <RegistryProvider>
      <SafeAreaProvider>
        <Stack />
      </SafeAreaProvider>
    </RegistryProvider>
  );
}