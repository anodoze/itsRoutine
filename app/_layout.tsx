import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RegistryProvider } from "./_RegistryContext";
import { colors } from "./theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <RegistryProvider>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: colors.secondaryGround },
            headerShown: false,
          }}
        />
      </RegistryProvider>
    </SafeAreaProvider>
  );
}
