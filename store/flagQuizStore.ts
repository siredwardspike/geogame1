import { create } from "zustand";
import type { Country } from "../types/country";
import { shuffleArray } from "../utils/shuffleArray";
type FlagQuizState = {
  pool: Country[];
  options: Country[];
  correctAnswer: Country | null;
  score: number;
  correctGuesses: Country[];
  questionIndex: number;
  numberOfRounds: number;
  settings: Settings;

  generateQuestion: (pool?: Country[]) => void;
  submitAnswer: (country: Country) => void;
  resetQuiz: () => void;
  setSettings: (settings: Settings) => void;
};
type Settings = {
  regions: string[];
  difficulty: string;
  numberOfRounds: number;
  gameMode: string[];
};

export const useFlagQuizStore = create<FlagQuizState>((set, get) => ({
  pool: [],
  options: [],
  correctAnswer: null,
  score: 0,
  correctGuesses: [],
  questionIndex: 0,
  numberOfRounds: -1,
  settings: {
    regions: [],
    difficulty: "",
    numberOfRounds: 0,
    gameMode: [],
    maxNumberOfRounds: 0,
  },
  setSettings: (settings) => {
    set({
      settings,
      numberOfRounds: settings.numberOfRounds,
      score: 0,
      questionIndex: 0,
      correctGuesses: [],
    });
  },
  generateQuestion: (newPool) => {
    const state = get();
    const basePool = newPool ?? state.pool;
    const regionPool = basePool.filter(
      (c) => c.region && state.settings.regions.includes(c.region)
    );
    const difficultyPool = regionPool.filter(
      (c) => c.difficultyLevel == state.settings.difficulty
    );

    const filteredPool = difficultyPool.filter(
      (country) => !state.correctGuesses.some((g) => g.name === country.name)
    );
    console.log(filteredPool.map((x) => x.name).length, "filteredPool");

    const shuffled = shuffleArray(filteredPool);
    if (shuffled.length < 4) {
      console.warn(
        "Not enough unguessed countries left to generate a question"
      );
      //router.push("/db");
      return;
    }
    const selected = shuffled.slice(0, 4);
    let correct = selected[Math.floor(Math.random() * 4)];

    set({
      pool: newPool ?? state.pool, // still persist the full pool
      options: selected,
      correctAnswer: correct,
    });
    console.log(
      "Correct Guesses :",
      state.correctGuesses.map((x) => x.name).length
    );
  },

  submitAnswer: (country) => {
    const {
      correctAnswer,
      score,
      correctGuesses,
      generateQuestion,
      questionIndex,
      numberOfRounds,
    } = get();

    if (numberOfRounds == score) {
    }
    if (correctAnswer && country.name === correctAnswer.name) {
      set({
        score: score + 1,
        correctGuesses: [...correctGuesses, country],
        questionIndex: questionIndex + 1,
      });

      generateQuestion();
    } else {
      console.log("❌ Incorrect! Try again.");
    }
  },

  resetQuiz: () => {
    set({
      score: 0,
      correctGuesses: [],
      options: [],
      correctAnswer: null,
    });
  },
}));
