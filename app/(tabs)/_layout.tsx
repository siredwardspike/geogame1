import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import React from "react";

export default function TabLayout() {
  return (
    <SQLiteProvider databaseName="test.db">
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="db" options={{ headerShown: false }} />
      </Stack>
    </SQLiteProvider>
  );
}
