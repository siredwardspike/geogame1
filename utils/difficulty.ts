function normalize(value: number, min: number, max: number): number {
  return (value - min) / (max - min);
}

const minPopulation = 800;
const maxPopulation = 1_428_627_663;

const minArea = 0.49;
const maxArea = 17_098_242;

export function getDifficultyScore(
  population: number,
  area: number,
  capital: string,
  borders: number,
  subregion: string
): number {
  const normPopulation = normalize(population, minPopulation, maxPopulation);
  const normArea = normalize(area, minArea, maxArea);

  const capitalPenalty = capital.length < 8 ? 0.1 : 0.0;
  const borderPenalty = borders === 0 ? 0.1 : 0.0;
  const areaPenalty = area < 1000 ? 0.1 : 0.0;
  const subregionBonus = [
    "Eastern Asia",
    "Western Europe",
    "Northern Europe",
  ].includes(subregion)
    ? -0.3
    : 0.3;

  return (
    (1 - normPopulation) * 0.6 +
    (1 - normArea) * 0.3 +
    capitalPenalty * 0.15 +
    borderPenalty * 0.15 +
    subregionBonus +
    areaPenalty
  );
}
