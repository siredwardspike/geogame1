import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scale } from "react-native-size-matters";

interface ScoreProgressBarProps {
  score: number;
  maxScore: number;
}

const BAR_HEIGHT = scale(24);
const BORDER_RADIUS = scale(16);

export default function ScoreProgressBar({
  score,
  maxScore,
}: ScoreProgressBarProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(score / maxScore, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    });
  }, [score]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${Math.min(progress.value * 100, 100)}%`,
    backgroundColor: "#4facfe", // base fill color
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Score: {score} / {maxScore}
      </Text>
      <View style={styles.barBackground}>
        <Animated.View style={[styles.barForeground, animatedStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: scale(12),
    paddingHorizontal: scale(16),
  },
  label: {
    fontSize: scale(14),
    color: "#333",
    fontWeight: "600",
    marginBottom: scale(6),
    textAlign: "center",
  },
  barBackground: {
    height: BAR_HEIGHT,
    backgroundColor: "#ddd",
    borderRadius: BORDER_RADIUS,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  barForeground: {
    height: "100%",
    borderRadius: BORDER_RADIUS,
  },
});
