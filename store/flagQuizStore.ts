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
  findMaxNumberOfRounds: (
    difficulty: string,
    region: string[],
    pool?: Country[]
  ) => number;

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
  generateQuestion: (newPool?: Country[]) => {
    const state = get();
    const basePool: Country[] = newPool ?? state.pool;

    // Filter by region
    const regionPool = basePool.filter(
      (country) =>
        country.region !== undefined &&
        state.settings.regions.includes(country.region)
    );

    // Filter by difficulty
    const difficultyPool = regionPool.filter(
      (country) => country.difficultyLevel === state.settings.difficulty
    );

    // Helper to exclude guessed countries
    const unguessed = (list: Country[]): Country[] =>
      list.filter(
        (country) =>
          !state.correctGuesses.some((guess) => guess.name === country.name)
      );

    // Step 1: Get initial filtered pool
    const filteredPool = unguessed(difficultyPool);

    console.log(filteredPool.map((c) => c.name).length, "filteredPool");

    // Step 2: Shuffle the filtered options
    let shuffled = shuffleArray(filteredPool);

    // Step 3: Fill in with additional unguessed countries from basePool
    if (shuffled.length < 4) {
      const fallbackPool = unguessed(basePool).filter(
        (country) => !shuffled.some((c) => c.name === country.name)
      );

      const extraNeeded = 4 - shuffled.length;
      const fallbackExtras = shuffleArray(fallbackPool).slice(0, extraNeeded);

      shuffled = [...shuffled, ...fallbackExtras];
    }

    // Step 4: Final check
    if (shuffled.length < 4) {
      console.error("Still not enough countries to generate a question.");
      return;
    }

    // Step 5: Select 4 options and randomly pick the correct one
    const selected = shuffled.slice(0, 4);
    let correct = selected[Math.floor(Math.random() * 4)];
    while (!state.settings.regions.includes(correct.region)) {
      correct = selected[Math.floor(Math.random() * 4)];
    }

    // Step 6: Set to state
    set({
      pool: basePool,
      options: selected,
      correctAnswer: correct,
    });
  },

  findMaxNumberOfRounds: (difficulty, regions, newPool) => {
    const state = get();
    const basePool = newPool ?? state.pool;
    const regionPool = basePool.filter(
      (c) => c.region && regions.includes(c.region)
    );
    const difficultyPool = regionPool.filter(
      (c) => c.difficultyLevel == difficulty
    );
    console.log(
      difficultyPool.length,
      "Max number of rounds",
      difficulty,
      "Difficulty",
      regions,
      "Regions"
    );
    return difficultyPool.length;
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
