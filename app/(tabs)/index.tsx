import StartMenu from "@/screens/StartMenu";
import { useRouter } from "expo-router";
import React from "react";

export default function home() {
  const router = useRouter();

  return (
    <StartMenu
      onStart={() => router.push("/GameScreen")}
      onSettings={() => router.push("/SettingsScreen")}
    ></StartMenu>
  );
}
