export function difficultyType(num: number) {
  if (num <= 1.1847) {
    return "Easy";
  } else if (1.1847 < num && num < 1.213) {
    return "Medium";
  } else {
    return "Hard";
  }
}
