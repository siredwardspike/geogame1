import { Country } from "./country";

export type McqProps = {
  image?: string;
  question?: Country | null;
  handlePress: (option: Country) => void;
  anweserOptions: Country[];
  questionIndex: number;
  gameMode: string[];
};
