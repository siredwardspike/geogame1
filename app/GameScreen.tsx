import EndGameScreen from "@/components/EndGameScreen";
import McqScreen from "@/components/McqScreen";
import { useFlagQuizStore } from "@/store/flagQuizStore";
import React from "react";

export default function GameScreen() {
  const score = useFlagQuizStore((s) => s.score);
  const numberOfRounds = useFlagQuizStore((s) => s.numberOfRounds);
  console.log(numberOfRounds, "numberOfRounds");
  if (numberOfRounds === 195) {
    return <EndGameScreen />;
  }
  return score === numberOfRounds ? <EndGameScreen /> : <McqScreen />;
}
