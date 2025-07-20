import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import React, { useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { scale } from "react-native-size-matters";

export default function StartMenu({
  onStart,
  onSettings,
}: {
  onStart: () => void;
  onSettings: () => void;
}) {
  const scaleStart = useRef(new Animated.Value(1)).current;
  const scaleSettings = useRef(new Animated.Value(1)).current;

  const handlePress = async (callback: () => void, scale: Animated.Value) => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.95,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();

    callback();
  };

  return (
    <LinearGradient
      colors={["#1e3c72", "#2a5298"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <LottieView
        source={require("@/assets/earth-rotate.json")}
        autoPlay
        loop
        style={styles.globe}
      />

      <Animatable.Text
        animation="fadeInDown"
        duration={1000}
        delay={500}
        style={styles.title}
      >
        GeoMaster
      </Animatable.Text>

      <Animated.View style={{ transform: [{ scale: scaleStart }] }}>
        <TouchableWithoutFeedback
          onPress={() => handlePress(onStart, scaleStart)}
        >
          <View style={styles.button}>
            <Ionicons name="play" size={22} color="#fff" />
            <Text style={styles.buttonText}>Start Game</Text>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>

      <Animated.View style={{ transform: [{ scale: scaleSettings }] }}>
        <TouchableWithoutFeedback
          onPress={() => handlePress(onSettings, scaleSettings)}
        >
          <View style={styles.secondaryButton}>
            <Ionicons name="settings-outline" size={22} color="#00e5ff" />
            <Text style={styles.secondaryButtonText}>Settings</Text>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>

      <Animatable.Text
        animation="fadeIn"
        delay={1600}
        style={styles.credits}
      ></Animatable.Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  globe: {
    position: "absolute",
    width: scale(750),
    height: scale(750),
    left: -450, // push it partially off-screen to the left
    top: "50%",
    transform: [{ translateY: -scale(350) }], // vertically center
    opacity: 0.5, // optional for subtlety
    pointerEvents: "none", // allows touches to pass through
  },

  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 40,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 6,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#00bcd4",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  secondaryButton: {
    flexDirection: "row",
    borderColor: "#00e5ff",
    borderWidth: 1.5,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: "center",
    gap: 10,
  },
  secondaryButtonText: {
    color: "#00e5ff",
    fontSize: 18,
    fontWeight: "500",
  },
  credits: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 40,
  },
});
