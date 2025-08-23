/**
 * テスト用の最小限のUnifiedExplanationコンポーネント
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";

export interface UnifiedExplanationProps {
  explanation: string;
  visible?: boolean;
}

export const UnifiedExplanation: React.FC<UnifiedExplanationProps> = ({
  explanation,
  visible = true,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>解説</Text>
      <Text style={styles.text}>{explanation}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    margin: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default UnifiedExplanation;
