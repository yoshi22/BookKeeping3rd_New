/**
 * CBT準拠ガイダンスパネルコンポーネント
 * 3段階折りたたみガイド（概要→詳細→補足）
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { GuidanceStep } from "@/types/models";

interface GuidancePanelProps {
  guidance: GuidanceStep[];
  initiallyExpanded?: boolean;
  onStageChange?: (stage: number) => void;
}

export const GuidancePanel: React.FC<GuidancePanelProps> = ({
  guidance,
  initiallyExpanded = true,
  onStageChange,
}) => {
  const [expandedStage, setExpandedStage] = useState<number | null>(
    initiallyExpanded ? 1 : null,
  );
  const [animatedValues] = useState(() =>
    guidance.map(() => new Animated.Value(0)),
  );

  const toggleStage = (stage: number) => {
    const newExpandedStage = expandedStage === stage ? null : stage;
    setExpandedStage(newExpandedStage);

    // アニメーション実行
    guidance.forEach((_, index) => {
      const targetValue = index + 1 === newExpandedStage ? 1 : 0;
      Animated.timing(animatedValues[index], {
        toValue: targetValue,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });

    if (onStageChange && newExpandedStage) {
      onStageChange(newExpandedStage);
    }
  };

  const getStageIcon = (stage: number, isExpanded: boolean): string => {
    if (isExpanded) return "chevron-down";
    return "chevron-forward";
  };

  const getStageColor = (stage: number): string => {
    switch (stage) {
      case 1:
        return "#4CAF50"; // 緑（概要）
      case 2:
        return "#2196F3"; // 青（詳細）
      case 3:
        return "#FF9800"; // 橙（補足）
      default:
        return "#666666";
    }
  };

  return (
    <View style={styles.container} testID="guidance-panel">
      <Text style={styles.panelTitle}>学習ガイド</Text>

      {guidance.map((step, index) => {
        const isExpanded = expandedStage === step.stage;
        const stageColor = getStageColor(step.stage);

        return (
          <View key={step.stage} style={styles.stageContainer}>
            {/* ステージヘッダー */}
            <TouchableOpacity
              style={[styles.stageHeader, { borderLeftColor: stageColor }]}
              onPress={() => toggleStage(step.stage)}
              testID={`guidance-stage-${step.stage}-header`}
            >
              <View style={styles.stageHeaderLeft}>
                <View
                  style={[styles.stageNumber, { backgroundColor: stageColor }]}
                >
                  <Text style={styles.stageNumberText}>{step.stage}</Text>
                </View>
                <Text style={styles.stageTitle}>{step.title}</Text>
              </View>

              <Ionicons
                name={getStageIcon(step.stage, isExpanded)}
                size={20}
                color="#666666"
              />
            </TouchableOpacity>

            {/* ステージ内容（アニメーション付き） */}
            <Animated.View
              style={[
                styles.stageContent,
                {
                  maxHeight: animatedValues[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 200], // 最大高さ
                  }),
                  opacity: animatedValues[index],
                },
              ]}
              testID={`guidance-stage-${step.stage}-content`}
            >
              <Text style={styles.stageBody}>{step.body}</Text>
            </Animated.View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    margin: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F8F9FA",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  stageContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  stageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderLeftWidth: 3,
    backgroundColor: "#FAFAFA",
  },
  stageHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  stageNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stageNumberText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  stageTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
    flex: 1,
  },
  stageContent: {
    overflow: "hidden",
  },
  stageBody: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555555",
    paddingHorizontal: 52, // ステージ番号の幅分を左にパディング
    paddingVertical: 12,
  },
});
