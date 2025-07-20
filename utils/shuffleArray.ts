export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]; // Create a copy to avoid mutation
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index 0 ≤ j ≤ i
    [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap
  }
  return arr;
}
