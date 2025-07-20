import type { Country } from "@/types/country";
import { getDifficultyScore } from "@/utils/difficulty";
import { difficultyType } from "@/utils/difficultyType";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import {
  SQLiteProvider,
  useSQLiteContext,
  type SQLiteDatabase,
} from "expo-sqlite";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
export async function seedDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS countries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      capital TEXT,
      region TEXT,
      subregion TEXT,
      population INTEGER,
      area INTEGER,
      borders INTEGER,
      difficulty INTEGER,
      difficultyLevel TEXT,
      flagPath TEXT
    );
  `);

  const existing = await db.getAllAsync(
    "SELECT COUNT(*) as count FROM countries"
  );

  const row = existing?.[0];
  const count = row ? Object.values(row)[0] : 0;

  if (count > 0) {
    console.log("Database already seeded");
    return;
  }

  console.log("Seeding database...");
  const res = await fetch(
    "https://restcountries.com/v3.1/independent?fields=name,population,capital,languages,flags,region,subregion,borders,area"
  );
  const countries = await res.json();

  for (const country of countries) {
    const name = country.name.common;
    const capital = country.capital?.[0] ?? "N/A";
    const region = country.region;
    const subregion = country.subregion;
    const population = country.population;
    const numOfBorderingCountires = country.borders?.length ?? 0;
    const area = country.area;
    const flagUrl = country.flags?.png;
    const difficulty = getDifficultyScore(
      population,
      area,
      capital,
      numOfBorderingCountires,
      subregion
    );
    const difficultyLevel = difficultyType(difficulty);
    const filename = name.replace(/\s+/g, "_") + ".png";
    const localPath = FileSystem.documentDirectory + "flags/" + filename;

    await FileSystem.makeDirectoryAsync(
      FileSystem.documentDirectory + "flags",
      { intermediates: true }
    ).catch(() => {});

    const fileInfo = await FileSystem.getInfoAsync(localPath);
    if (!fileInfo.exists && flagUrl) {
      await FileSystem.downloadAsync(flagUrl, localPath);
    }

    await db.runAsync(
      `INSERT INTO countries (name, capital, region, subregion, population, flagPath, area, borders, difficulty, difficultyLevel)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      name,
      capital,
      region,
      subregion,
      population,
      localPath,
      area,
      numOfBorderingCountires,
      difficulty,
      difficultyLevel
    );
  }
}

export default function App() {
  return (
    <View style={styles.container}>
      <SQLiteProvider databaseName="test.db" onInit={seedDatabase}>
        <Content />
      </SQLiteProvider>
    </View>
  );
}

export function Content() {
  const db = useSQLiteContext();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  async function setup() {
    const result = await db.getAllAsync<Country>("SELECT * FROM countries");
    setCountries(result ?? []);
    setLoading(false);
  }

  useEffect(() => {
    setup();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading database...</Text>
      </View>
    );
  }

  const sortedCountries = [...countries].sort(
    (a, b) => a.difficulty - b.difficulty
  );

  return (
    <FlatList
      data={sortedCountries}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => (
        <View
          style={{
            padding: 12,
            borderBottomWidth: 1,
            borderColor: "#ccc",
            flexDirection: "row",
            gap: 20,
          }}
        >
          <Image
            source={{ uri: item.flagPath }}
            style={{ height: 100, width: 100 }}
            contentFit="contain"
          />
          <View>
            <Text style={{ fontSize: 16 }}>{item.name}</Text>
            <Text>Capital: {item.capital ?? "N/A"}</Text>
            <Text>Population: {item.population.toLocaleString()}</Text>
            <Text>Region: {item.region}</Text>
            <Text>Subregion: {item.subregion}</Text>
            <Text>Borders: {item.borders}</Text>
            <Text>Area :{item.area}</Text>
            <Text>Difficulty score:{item.difficulty}</Text>
            <Text>Difficulty type:{item.difficultyLevel}</Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 50,
  },
  headerContainer: {
    padding: 16,
    backgroundColor: "#6200ee",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  todoItemContainer: {
    padding: 12,
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  todoText: {
    fontSize: 16,
    color: "#333",
  },
});
