import { useFlagQuizStore } from "@/store/flagQuizStore";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { scale } from "react-native-size-matters";

export default function EndGameScreen() {
  const router = useRouter();
  const { score, resetQuiz } = useFlagQuizStore();

  const handleRetry = () => {
    resetQuiz();
    router.replace("/GameScreen"); // reload game
  };

  const handleHome = () => {
    resetQuiz();
    router.replace("/"); // back to start screen
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require("@/assets/Trophy.json")}
        autoPlay
        loop={false}
        style={styles.lottie}
      />
      <Text style={styles.title}>🏆 Victory!</Text>
      <Text style={styles.score}>Your Score: {score}</Text>

      <View style={styles.buttons}>
        <TouchableOpacity onPress={handleRetry} style={styles.button}>
          <Text style={styles.buttonText}>Play Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleHome}
          style={[styles.button, styles.secondary]}
        >
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F7FA",
    justifyContent: "center",
    alignItems: "center",
    padding: scale(20),
  },
  lottie: {
    width: scale(250),
    height: scale(250),
  },
  title: {
    fontSize: scale(28),
    fontWeight: "bold",
    color: "#00796B",
    marginTop: scale(10),
  },
  score: {
    fontSize: scale(20),
    color: "#333",
    marginVertical: scale(10),
  },
  buttons: {
    marginTop: scale(20),
    width: "100%",
    alignItems: "center",
    gap: scale(10),
  },
  button: {
    backgroundColor: "#00796B",
    paddingVertical: scale(14),
    paddingHorizontal: scale(40),
    borderRadius: scale(25),
    width: scale(200),
    alignItems: "center",
    elevation: 3,
  },
  secondary: {
    backgroundColor: "#009688",
  },
  buttonText: {
    color: "#fff",
    fontSize: scale(16),
    fontWeight: "600",
  },
});
