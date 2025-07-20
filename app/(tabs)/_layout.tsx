import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import React from "react";
import { seedDatabase } from "./db";

export default function TabLayout() {
  return (
    <SQLiteProvider databaseName="test.db" onInit={seedDatabase}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="db" options={{ headerShown: false }} />
      </Stack>
    </SQLiteProvider>
  );
}
