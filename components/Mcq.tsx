import type { McqProps } from "@/types/mcqProps";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { scale } from "react-native-size-matters";

import { Pressable } from "react-native";
import * as Animatable from "react-native-animatable";

export default function Mcq({
  image,
  question,
  anweserOptions,
  handlePress,
  questionIndex,
  gameMode,
}: McqProps) {
  const items = Array.from({ length: 4 }, (_, i) => anweserOptions[i]);
  const numberOfTypes = gameMode.length;
  console.log("inside mcq component", gameMode);
  console.log(numberOfTypes, "numberOfTypes");

  return (
    <View style={styles.mainContainer}>
      <Animatable.View animation="fadeInDown" delay={200} duration={600}>
        {(() => {
          const mode = gameMode[questionIndex % gameMode.length];

          if (mode === "Capitals") {
            return (
              <Text style={styles.questionText} adjustsFontSizeToFit>
                {question?.capital}
              </Text>
            );
          }

          if (mode === "Flags") {
            return (
              <Image
                source={{ uri: image }}
                style={styles.image}
                contentFit="contain"
                transition={1000}
              />
            );
          }

          if (mode === "Population") {
            return (
              <Text style={styles.questionText} adjustsFontSizeToFit>
                {`Population: ${question?.population?.toLocaleString()}`}
              </Text>
            );
          }
        })()}
      </Animatable.View>

      <Animatable.View
        animation="fadeInUp"
        delay={400}
        duration={800}
        style={styles.optionsContainer}
      >
        {items.map((item, index) => (
          <Pressable
            onPress={() => handlePress(item)}
            key={index}
            style={({ pressed }) => [
              styles.option,
              pressed && { transform: [{ scale: 0.96 }] },
            ]}
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
