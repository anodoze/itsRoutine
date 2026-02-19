import { Stack } from "expo-router";
import { RegistryProvider } from "./RegistryContext";

export default function RootLayout() {
  return (
    <RegistryProvider>
      <Stack />
    </RegistryProvider>
  );
}