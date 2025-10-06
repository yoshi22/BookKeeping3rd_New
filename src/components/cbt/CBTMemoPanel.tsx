/**
 * CBTメモ・計算パネルコンポーネント
 * 簿記問題解答時のメモ書き・計算支援機能
 * Phase C: Q2/Q3 CBT UI改善の一環
 */

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CBTMemoPanelProps {
  isVisible: boolean;
  onToggleVisibility: () => void;
  onClose?: () => void;
  initialMemo?: string;
  onMemoChange?: (memo: string) => void;
}

interface CalculationItem {
  id: string;
  expression: string;
  result: number;
}

export const CBTMemoPanel: React.FC<CBTMemoPanelProps> = ({
  isVisible,
  onToggleVisibility,
  onClose,
  initialMemo = "",
  onMemoChange,
}) => {
  const [memoText, setMemoText] = useState(initialMemo);
  const [activeTab, setActiveTab] = useState<"memo" | "calc">("memo");
  const [calculationInput, setCalculationInput] = useState("");
  const [calculations, setCalculations] = useState<CalculationItem[]>([]);
  const [calcResult, setCalcResult] = useState<string>("");

  const screenHeight = Dimensions.get("window").height;
  const panelHeight = Math.min(400, screenHeight * 0.4);

  // メモテキストの変更処理
  const handleMemoChange = (text: string) => {
    setMemoText(text);
    onMemoChange?.(text);
  };

  // 計算実行
  const executeCalculation = () => {
    try {
      if (!calculationInput.trim()) return;

      // 基本的な四則演算の評価（簡易版）
      const sanitizedInput = calculationInput
        .replace(/[^0-9+\-*/().\s]/g, "")
        .replace(/\s+/g, "");

      // eval の代替として基本的な計算のみ許可
      if (!/^[0-9+\-*/().\s]+$/.test(sanitizedInput)) {
        setCalcResult("エラー: 無効な式です");
        return;
      }

      const result = Function(
        '"use strict"; return (' + sanitizedInput + ")",
      )();

      if (typeof result !== "number" || !isFinite(result)) {
        setCalcResult("エラー: 計算できません");
        return;
      }

      const roundedResult = Math.round(result * 100) / 100; // 小数点2桁まで
      setCalcResult(roundedResult.toLocaleString());

      // 計算履歴に追加
      const newCalc: CalculationItem = {
        id: Date.now().toString(),
        expression: calculationInput,
        result: roundedResult,
      };

      setCalculations([newCalc, ...calculations.slice(0, 9)]); // 最新10件まで保持
      setCalculationInput("");
    } catch (error) {
      setCalcResult("エラー: 計算できません");
    }
  };

  // 数字ボタンタップ
  const onNumberPress = (num: string) => {
    setCalculationInput(calculationInput + num);
  };

  // 演算子ボタンタップ
  const onOperatorPress = (op: string) => {
    if (calculationInput && !isNaN(Number(calculationInput.slice(-1)))) {
      setCalculationInput(calculationInput + op);
    }
  };

  // クリア処理
  const clearCalculation = () => {
    setCalculationInput("");
    setCalcResult("");
  };

  // 計算履歴から選択
  const selectFromHistory = (item: CalculationItem) => {
    setCalculationInput(item.expression);
    setCalcResult(item.result.toLocaleString());
  };

  if (!isVisible) {
    return (
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={onToggleVisibility}
        testID="cbt-memo-toggle-button"
      >
        <Ionicons name="document-text-outline" size={24} color="#0066CC" />
        <Text style={styles.floatingButtonText}>メモ</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[styles.panel, { height: panelHeight }]}
      testID="cbt-memo-panel"
    >
      {/* パネルヘッダー */}
      <View style={styles.header}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "memo" && styles.activeTab]}
            onPress={() => setActiveTab("memo")}
            testID="cbt-memo-tab-memo"
          >
            <Ionicons
              name="document-text"
              size={16}
              color={activeTab === "memo" ? "#0066CC" : "#666666"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "memo" && styles.activeTabText,
              ]}
            >
              メモ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "calc" && styles.activeTab]}
            onPress={() => setActiveTab("calc")}
            testID="cbt-memo-tab-calc"
          >
            <Ionicons
              name="calculator"
              size={16}
              color={activeTab === "calc" ? "#0066CC" : "#666666"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "calc" && styles.activeTabText,
              ]}
            >
              計算
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={onToggleVisibility}
          testID="cbt-memo-close-button"
        >
          <Ionicons name="close" size={20} color="#666666" />
        </TouchableOpacity>
      </View>

      {/* メモタブ */}
      {activeTab === "memo" && (
        <View style={styles.memoContainer}>
          <TextInput
            style={styles.memoInput}
            value={memoText}
            onChangeText={handleMemoChange}
            placeholder="ここにメモを入力してください..."
            multiline
            textAlignVertical="top"
            testID="cbt-memo-text-input"
          />
          <View style={styles.memoFooter}>
            <Text style={styles.memoCount}>{memoText.length}/1000文字</Text>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => handleMemoChange("")}
              testID="cbt-memo-clear-button"
            >
              <Text style={styles.clearButtonText}>クリア</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 計算タブ */}
      {activeTab === "calc" && (
        <View style={styles.calcContainer}>
          {/* 計算入力・結果表示 */}
          <View style={styles.calcDisplay}>
            <TextInput
              style={styles.calcInput}
              value={calculationInput}
              onChangeText={setCalculationInput}
              placeholder="計算式を入力 (例: 1000 + 200 * 3)"
              testID="cbt-calc-input"
            />
            <View style={styles.calcResult}>
              <Text style={styles.calcResultText}>= {calcResult || ""}</Text>
            </View>
          </View>

          {/* 計算ボタン */}
          <View style={styles.calcButtons}>
            <View style={styles.calcButtonRow}>
              <TouchableOpacity
                style={styles.calcButton}
                onPress={clearCalculation}
                testID="cbt-calc-clear"
              >
                <Text style={styles.calcButtonText}>C</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.calcButton}
                onPress={() => onOperatorPress("/")}
                testID="cbt-calc-divide"
              >
                <Text style={styles.calcButtonText}>÷</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.calcButton}
                onPress={() => onOperatorPress("*")}
                testID="cbt-calc-multiply"
              >
                <Text style={styles.calcButtonText}>×</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.calcButton}
                onPress={executeCalculation}
                testID="cbt-calc-equals"
              >
                <Text style={styles.calcButtonText}>=</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.calcButtonRow}>
              <TouchableOpacity
                style={styles.calcButton}
                onPress={() => onNumberPress("7")}
                testID="cbt-calc-7"
              >
                <Text style={styles.calcButtonText}>7</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.calcButton}
                onPress={() => onNumberPress("8")}
                testID="cbt-calc-8"
              >
                <Text style={styles.calcButtonText}>8</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.calcButton}
                onPress={() => onNumberPress("9")}
                testID="cbt-calc-9"
              >
                <Text style={styles.calcButtonText}>9</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.calcButton}
                onPress={() => onOperatorPress("-")}
                testID="cbt-calc-minus"
              >
                <Text style={styles.calcButtonText}>-</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.calcButtonRow}>
              <TouchableOpacity
                style={styles.calcButton}
                onPress={() => onNumberPress("4")}
                testID="cbt-calc-4"
              >
                <Text style={styles.calcButtonText}>4</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.calcButton}
                onPress={() => onNumberPress("5")}
                testID="cbt-calc-5"
              >
                <Text style={styles.calcButtonText}>5</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.calcButton}
                onPress={() => onNumberPress("6")}
                testID="cbt-calc-6"
              >
                <Text style={styles.calcButtonText}>6</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.calcButton}
                onPress={() => onOperatorPress("+")}
                testID="cbt-calc-plus"
              >
                <Text style={styles.calcButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.calcButtonRow}>
              <TouchableOpacity
                style={styles.calcButton}
                onPress={() => onNumberPress("1")}
                testID="cbt-calc-1"
              >
                <Text style={styles.calcButtonText}>1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.calcButton}
                onPress={() => onNumberPress("2")}
                testID="cbt-calc-2"
              >
                <Text style={styles.calcButtonText}>2</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.calcButton}
                onPress={() => onNumberPress("3")}
                testID="cbt-calc-3"
              >
                <Text style={styles.calcButtonText}>3</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.calcButton}
                onPress={() => onNumberPress("0")}
                testID="cbt-calc-0"
              >
                <Text style={styles.calcButtonText}>0</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 計算履歴 */}
          {calculations.length > 0 && (
            <View style={styles.calcHistory}>
              <Text style={styles.historyTitle}>計算履歴</Text>
              <ScrollView style={styles.historyList}>
                {calculations.map((calc) => (
                  <TouchableOpacity
                    key={calc.id}
                    style={styles.historyItem}
                    onPress={() => selectFromHistory(calc)}
                    testID={`cbt-calc-history-${calc.id}`}
                  >
                    <Text style={styles.historyExpression}>
                      {calc.expression}
                    </Text>
                    <Text style={styles.historyResult}>
                      = {calc.result.toLocaleString()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    right: 16,
    bottom: 100,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    zIndex: 100,
  },
  floatingButtonText: {
    fontSize: 12,
    color: "#0066CC",
    fontWeight: "600",
    marginLeft: 4,
  },
  panel: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 320,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tabContainer: {
    flexDirection: "row",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: "#E3F2FD",
  },
  tabText: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 4,
  },
  activeTabText: {
    color: "#0066CC",
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  memoContainer: {
    flex: 1,
    padding: 16,
  },
  memoInput: {
    flex: 1,
    fontSize: 14,
    color: "#333333",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#FAFAFA",
  },
  memoFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  memoCount: {
    fontSize: 12,
    color: "#666666",
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F44336",
    borderRadius: 4,
  },
  clearButtonText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  calcContainer: {
    flex: 1,
    padding: 12,
  },
  calcDisplay: {
    marginBottom: 16,
  },
  calcInput: {
    fontSize: 16,
    color: "#333333",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#FAFAFA",
    marginBottom: 8,
  },
  calcResult: {
    backgroundColor: "#E8F5E8",
    padding: 12,
    borderRadius: 8,
    alignItems: "flex-end",
  },
  calcResultText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    fontFamily: "monospace",
  },
  calcButtons: {
    marginBottom: 16,
  },
  calcButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  calcButton: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginHorizontal: 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  calcButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  calcHistory: {
    flex: 1,
    maxHeight: 120,
  },
  historyTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666666",
    marginBottom: 8,
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 4,
    backgroundColor: "#F8F9FA",
    borderRadius: 4,
  },
  historyExpression: {
    fontSize: 12,
    color: "#666666",
    flex: 1,
  },
  historyResult: {
    fontSize: 12,
    color: "#0066CC",
    fontWeight: "600",
    fontFamily: "monospace",
  },
});
