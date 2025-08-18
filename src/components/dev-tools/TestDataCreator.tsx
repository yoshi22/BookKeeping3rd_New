/**
 * 開発用テストデータ作成コンポーネント
 * 復習システムのテストデータを生成
 */

import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { testDataService } from "../../services/test-data-service";
import { logger } from "@/utils/logger";

interface TestDataCreatorProps {}

export function TestDataCreator({}: TestDataCreatorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<string>("");

  const createTestData = async () => {
    if (isCreating) return;

    setIsCreating(true);
    setResult("");

    try {
      const creationResult = await testDataService.createTestData();

      setResult(creationResult.output);

      if (creationResult.success) {
        Alert.alert("成功", creationResult.message);
      } else {
        Alert.alert("エラー", creationResult.message);
      }
    } catch (error) {
      const errorMessage = `予期しないエラー: ${error instanceof Error ? error.message : error}`;
      logger.error("[TestDataCreator] 予期しないエラー:", error as Error);
      setResult(errorMessage);
      Alert.alert("エラー", "テストデータの作成に失敗しました。");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <View
      style={{
        padding: 16,
        backgroundColor: "#f9f9f9",
        margin: 8,
        borderRadius: 8,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          marginBottom: 12,
          color: "#333",
        }}
      >
        🧪 テストデータ作成
      </Text>
      <Text style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
        復習システムのテスト用に学習履歴と復習アイテムを作成します
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: isCreating ? "#ccc" : "#007AFF",
          padding: 12,
          borderRadius: 6,
          alignItems: "center",
          marginBottom: 12,
        }}
        onPress={createTestData}
        disabled={isCreating}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>
          {isCreating ? "作成中..." : "テストデータ作成"}
        </Text>
      </TouchableOpacity>

      {result ? (
        <ScrollView
          style={{
            backgroundColor: "#000",
            padding: 8,
            borderRadius: 4,
            maxHeight: 300,
          }}
          showsVerticalScrollIndicator={true}
        >
          <Text
            style={{ color: "#00FF00", fontFamily: "monospace", fontSize: 11 }}
          >
            {result}
          </Text>
        </ScrollView>
      ) : null}
    </View>
  );
}
