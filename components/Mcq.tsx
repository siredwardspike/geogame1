import type { McqProps } from "@/types/mcqProps";
import { Image } from "expo-image";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { scale } from "react-native-size-matters";

export default function Mcq({
  image,
  question,
  anweserOptions,
  handlePress,
  questionIndex,
  gameMode,
}: McqProps) {
  const [currentIndex, setCurrentIndex] = useState(questionIndex);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const questionRef = useRef<Animatable.View & View>(null);
  const optionsRef = useRef<Animatable.View & View>(null);

  const mode = gameMode[currentIndex % gameMode.length];
  const items = Array.from({ length: 4 }, (_, i) => anweserOptions[i]);

  const correctAnswer = question; // Assuming correctAnswer is `question`

  const handleOptionPress = async (item: any) => {
    if (isAnimating || selectedOption) return;

    setSelectedOption(item.name);
    const isCorrect = item.name === correctAnswer?.name;

    if (isCorrect) {
      setIsAnimating(true);

      await Promise.all([
        questionRef.current?.fadeOutUp?.(300),
        optionsRef.current?.fadeOutDown?.(300),
      ]);

      handlePress(item); // Triggers parent update

      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnimating(false);
      }, 100);
    } else {
      await optionsRef.current?.shake?.(600);
      setSelectedOption(null); // allow retry or move on based on logic
    }
  };

  useEffect(() => {
    if (!isAnimating && !selectedOption) setCurrentIndex(questionIndex);
  }, [questionIndex]);

  return (
    <View style={styles.mainContainer}>
      <Animatable.View
        ref={questionRef}
        key={`question-${currentIndex}`}
        animation="fadeInDown"
        duration={500}
        style={{ alignItems: "center" }}
      >
        {mode === "Capitals" && (
          <Text style={styles.questionText} adjustsFontSizeToFit>
            {question?.capital}
          </Text>
        )}

        {mode === "Flags" && (
          <Image
            source={{ uri: image }}
            style={styles.image}
            contentFit="contain"
            transition={1000}
          />
        )}

        {mode === "Population" && (
          <Text style={styles.questionText} adjustsFontSizeToFit>
            {`Population: ${question?.population?.toLocaleString()}`}
          </Text>
        )}
      </Animatable.View>

      <Animatable.View
        ref={optionsRef}
        key={`options-${currentIndex}`}
        animation="fadeInUp"
        duration={600}
        style={styles.optionsContainer}
      >
        {items.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => handleOptionPress(item)}
            style={({ pressed }) => [
              styles.option,
              pressed && { transform: [{ scale: 0.96 }] },
              selectedOption &&
              selectedOption === item.name &&
              item.name !== correctAnswer?.name
                ? { backgroundColor: "#e74c3c" }
                : {},
            ]}
            disabled={!!selectedOption}
          >
            <Text style={styles.optionText} adjustsFontSizeToFit>
              {item.name}
            </Text>
          </Pressable>
        ))}
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "center",
    gap: scale(20),
  },
  image: {
    width: scale(200),
    height: scale(200),
    borderColor: "#ccc",
  },
  questionText: {
    textAlign: "center",
    fontSize: scale(26),
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 10,
  },
  optionsContainer: {
    width: "100%",
    alignItems: "center",
    gap: scale(12),
  },
  option: {
    backgroundColor: "#00bcd4",
    paddingVertical: scale(14),
    paddingHorizontal: scale(30),
    borderRadius: scale(12),
    width: scale(200),
    alignItems: "center",
    elevation: 3,
  },
  optionText: {
    textAlign: "center",
    fontSize: scale(18),
    color: "#fff",
    fontWeight: "600",
  },
});
