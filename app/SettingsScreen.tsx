import { useFlagQuizStore } from "@/store/flagQuizStore";
import { Country } from "@/types/country";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { scale } from "react-native-size-matters";

const REGIONS = ["Africa", "Asia", "Europe", "Americas", "Oceania"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const QUESTION_TYPES = ["Flags", "Capitals", "Population"];

export default function SettingsScreen() {
  const router = useRouter();
  const setSettings = useFlagQuizStore((s) => s.setSettings);

  const [selectedRegions, setSelectedRegions] = useState<string[]>(REGIONS);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(QUESTION_TYPES);
  const [difficulty, setDifficulty] = useState("Easy");
  const [rounds, setRounds] = useState(5);
  const [maxRounds, setMaxRounds] = useState(5);

  const toggleRegion = (region: string) => {
    setSelectedRegions((prev) => {
      if (prev.includes(region)) {
        if (prev.length === 1) return prev;
        return prev.filter((r) => r !== region);
      } else {
        return [...prev, region];
      }
    });
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        if (prev.length === 1) return prev;
        return prev.filter((r) => r !== type);
      } else {
        return [...prev, type];
      }
    });
  };
  function handleSetRoundIncrease() {
    if (rounds < maxRounds) {
      setRounds((r) => r + 1);
    } else {
      return;
    }
  }
  const db = useSQLiteContext();

  useEffect(() => {
    const loadData = async () => {
      const countries = await db.getAllAsync<Country>(
        "SELECT * FROM countries"
      );

      let x = useFlagQuizStore
        .getState()
        .findMaxNumberOfRounds(difficulty, selectedRegions, countries);
      setMaxRounds(x);
      if (rounds > maxRounds) {
        setRounds(maxRounds);
      }
    };

    loadData();
  }, [selectedRegions, difficulty, rounds, maxRounds]);

  const handleStart = () => {
    setSettings({
      regions: selectedRegions,
      difficulty: difficulty,
      numberOfRounds: rounds,
      gameMode: selectedTypes,
    });

    router.replace("/GameScreen");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Select Regions</Text>
      <View style={styles.optionGroup}>
        {REGIONS.map((region) => {
          const selected = selectedRegions.includes(region);
          return (
            <TouchableOpacity
              key={region}
              onPress={() => toggleRegion(region)}
              style={[styles.optionButton, selected && styles.selectedButton]}
            >
              <Text
                style={[styles.optionText, selected && styles.selectedText]}
              >
                {region}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Difficulty</Text>
      <View style={styles.optionGroup}>
        {DIFFICULTIES.map((level) => (
          <TouchableOpacity
            key={level}
            onPress={() => setDifficulty(level)}
            style={[
              styles.optionButton,
              difficulty === level && styles.selectedButton,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                difficulty === level && styles.selectedText,
              ]}
            >
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Question Type</Text>
      <View style={styles.optionGroup}>
        {QUESTION_TYPES.map((type) => {
          const selected = selectedTypes.includes(type);
          return (
            <TouchableOpacity
              key={type}
              onPress={() => toggleType(type)}
              style={[styles.optionButton, selected && styles.selectedButton]}
            >
              <Text
                style={[styles.optionText, selected && styles.selectedText]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.sectionTitle}>
          Rounds: {rounds}/{maxRounds}
        </Text>
        <View style={styles.counter}>
          <TouchableOpacity
            onPress={() => setRounds((r) => Math.max(1, r - 1))}
          >
            <Text style={styles.counterButton}>−</Text>
          </TouchableOpacity>
          <Text style={styles.counterText}>{rounds}</Text>
          <TouchableOpacity onPress={handleSetRoundIncrease}>
            <Text style={styles.counterButton}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={handleStart} style={styles.startButton}>
        <Text style={styles.startText}>Start Quiz</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/db")}
        style={styles.listButton}
      >
        <Text style={styles.listText}>Country List</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: scale(20),
    backgroundColor: "#E0F7FA", // light cyan background
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: scale(28),
    fontWeight: "bold",
    color: "#17638A", // deep blue for strong headings
    textAlign: "center",
    marginBottom: scale(20),
  },
  sectionTitle: {
    fontSize: scale(18),
    fontWeight: "600",
    marginVertical: scale(10),
    color: "#3178a8", // medium blue for section titles
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: scale(5),
    gap: scale(10),
  },
  optionLabel: {
    fontSize: scale(16),
    color: "#486f86", // muted blue-gray for labels
  },
  optionGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(10),
    marginVertical: scale(10),
  },
  optionButton: {
    padding: scale(10),
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: "#6aa4c4", // lighter blue border
    backgroundColor: "#f5fbfe", // very light blue fill for unselected options
  },
  selectedButton: {
    backgroundColor: "#17638A", // deep blue fill for selected
    borderColor: "#17638A",
  },
  optionText: {
    color: "#3178a8", // medium blue text for unselected
    fontWeight: "600",
  },
  selectedText: {
    color: "#E0F7FA", // very light text on selected (background color)
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(20),
    marginVertical: scale(10),
    paddingHorizontal: 20,
  },
  counterText: {
    fontSize: scale(18),
    fontWeight: "bold",
    color: "#486f86", // blue-gray for counter text
  },
  counterButton: {
    fontSize: scale(28),
    fontWeight: "bold",
    color: "#17638A", // deep blue for buttons
  },
  startButton: {
    marginTop: scale(20),
    backgroundColor: "#17638A", // deep blue button
    paddingVertical: scale(14),
    alignItems: "center",
    borderRadius: scale(20),
    shadowColor: "#14516b",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  startText: {
    color: "#E0F7FA", // light text on button
    fontSize: scale(18),
    fontWeight: "600",
  },
  listButton: {
    backgroundColor: "#134a65", // slightly darker blue for secondary button
    marginTop: scale(20),
    borderColor: "#17638A",
    borderWidth: 1.5,
    borderRadius: 25,
    paddingVertical: scale(14),
    alignItems: "center",
    alignSelf: "center",
    width: scale(200),
  },
  listText: {
    color: "#E0F7FA", // light text for list button
    fontSize: scale(14),
    fontWeight: "500",
  },
});
