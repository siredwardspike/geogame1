import Mcq from "@/components/Mcq";
import ScoreProgressBar from "@/components/ScoreProgressBar";
import { useFlagQuizStore } from "@/store/flagQuizStore";
import { Country } from "@/types/country";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { scale } from "react-native-size-matters";

function McqSql() {
  const correctAnswer = useFlagQuizStore((s) => s.correctAnswer);
  const options = useFlagQuizStore((s) => s.options);
  const submitAnswer = useFlagQuizStore((s) => s.submitAnswer);
  const questionIndex = useFlagQuizStore((s) => s.questionIndex);
  const gameMode = useFlagQuizStore((s) => s.settings.gameMode);

  function handleOptionPress(option: Country) {
    submitAnswer(option);
  }
  const db = useSQLiteContext();
  const [questionData, setQuestionData] = useState<{
    question: Country;
    answerOptions: Country[];
    image?: string;
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const countries = await db.getAllAsync<Country>(
        "SELECT * FROM countries"
      );

      if (countries.length < 4) {
        console.warn("Not enough countries to generate question");
        return;
      }

      useFlagQuizStore.getState().generateQuestion(countries);

      // Wait a moment to let Zustand update its state (since set is async)
      setTimeout(() => {
        const correct = useFlagQuizStore.getState().correctAnswer;
        const options = useFlagQuizStore.getState().options;

        if (correct && options.length === 4) {
          const data = {
            question: correct,
            answerOptions: options,
            image: correct.flagPath,
          };
          console.log("Generated question:", data);
          setQuestionData(data);
        } else {
          console.warn("Correct answer or options not ready yet");
        }
      }, 0); // defer to next tick
    };

    loadData();
  }, []);
  useEffect(() => {
    if (correctAnswer && options.length === 4) {
      setQuestionData({
        question: correctAnswer,
        image: correctAnswer.flagPath,
        answerOptions: options,
      });
    }
  }, [questionIndex]);

  if (!questionData) return null;

  return (
    <Mcq
      key={questionData.question.capital}
      questionIndex={questionIndex}
      handlePress={handleOptionPress}
      image={questionData.image}
      question={questionData.question}
      anweserOptions={questionData.answerOptions}
      gameMode={gameMode}
    />
  );
}
export default function McqScreen() {
  const score = useFlagQuizStore((s) => s.score);
  const numberOfRounds = useFlagQuizStore((s) => s.numberOfRounds);

  return (
    <SafeAreaView style={styles.container}>
      <ScoreProgressBar score={score} maxScore={numberOfRounds} />

      <View style={styles.body}>
        <SQLiteProvider databaseName="test.db">
          <McqSql />
        </SQLiteProvider>
      </View>

      <Animatable.View
        animation="fadeInUp"
        delay={500}
        style={styles.footer}
      ></Animatable.View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F7FA",
    paddingTop: scale(30),
    paddingHorizontal: scale(20),
  },
  header: {
    alignItems: "center",
    marginBottom: scale(10),
  },
  headerText: {
    fontSize: scale(24),
    fontWeight: "bold",
    color: "#00796B",
  },
  scoreText: {
    fontSize: scale(16),
    color: "#444",
    marginTop: scale(4),
  },
  body: {
    flex: 1,
    justifyContent: "center",
  },
  footer: {
    alignItems: "center",
    paddingBottom: scale(20),
  },
  nextButton: {
    backgroundColor: "#00796B",
    paddingVertical: scale(14),
    paddingHorizontal: scale(40),
    borderRadius: scale(25),
    elevation: 3,
  },
  nextText: {
    color: "#fff",
    fontSize: scale(18),
    fontWeight: "600",
  },
});
