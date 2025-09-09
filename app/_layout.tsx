import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import "react-native-reanimated";
import { seedDatabase } from "./(tabs)/db";

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="test.db" onInit={seedDatabase}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="GameScreen" options={{ headerShown: false }} />
        <Stack.Screen name="SettingsScreen" options={{ headerShown: false }} />
      </Stack>
    </SQLiteProvider>
  );
}
