/**
 * CBTコンポーネント統合デモ
 * Phase C: Q2/Q3 CBT UI改善の動作確認用デモ画面
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { CBTJournalEntryForm } from "./CBTJournalEntryForm";

interface CBTDemoProps {
  onClose?: () => void;
}

export const CBTDemo: React.FC<CBTDemoProps> = ({ onClose }) => {
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60分
  const [isMarked, setIsMarked] = useState(false);
  const [memo, setMemo] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(1);

  // サンプル問題データ
  const sampleQuestions = [
    {
      id: "DEMO_001",
      text: "現金100,000円で商品を仕入れた。",
      correctAnswer: {
        journalEntries: [
          { account: "商品", amount: 100000 },
          { account: "現金", amount: 100000 },
        ],
      },
    },
    {
      id: "DEMO_002",
      text: "売掛金150,000円を普通預金に回収した。",
      correctAnswer: {
        journalEntries: [
          { account: "普通預金", amount: 150000 },
          { account: "売掛金", amount: 150000 },
        ],
      },
    },
    {
      id: "DEMO_003",
      text: "給料200,000円を現金で支払った。源泉所得税20,000円を差し引いた。",
      correctAnswer: {
        journalEntries: [
          { account: "給料", amount: 200000 },
          { account: "現金", amount: 180000 },
          { account: "所得税預り金", amount: 20000 },
        ],
      },
    },
  ];

  // タイマー機能（デモ用）
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          Alert.alert("時間切れ", "制限時間が終了しました。");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentQuestionData = sampleQuestions[currentQuestion - 1];

  const handleSubmitAnswer = (answer: any) => {
    Alert.alert(
      "解答送信完了",
      `問題${currentQuestion}の解答を送信しました。\n\n借方・貸方合計: ${answer.debitTotal.toLocaleString()}円\n貸借平衡: ${answer.isBalanced ? "あり" : "なし"}`,
      [
        {
          text: "次の問題へ",
          onPress: () => {
            if (currentQuestion < sampleQuestions.length) {
              setCurrentQuestion(currentQuestion + 1);
            } else {
              Alert.alert("完了", "すべての問題が完了しました！");
            }
          },
        },
      ],
    );
  };

  const handleBackPress = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      Alert.alert("確認", "デモを終了しますか？", [
        { text: "キャンセル", style: "cancel" },
        { text: "終了", onPress: onClose },
      ]);
    }
  };

  const handleMarkToggle = () => {
    setIsMarked(!isMarked);
    Alert.alert(
      "マーク",
      isMarked ? "問題のマークを解除しました" : "問題にマークを付けました",
    );
  };

  const handleTimeUp = () => {
    Alert.alert("時間切れ", "制限時間が終了しました。自動的に終了します。");
  };

  const handleMemoChange = (newMemo: string) => {
    setMemo(newMemo);
    console.log("メモ更新:", newMemo);
  };

  return (
    <CBTJournalEntryForm
      questionId={currentQuestionData.id}
      questionText={currentQuestionData.text}
      questionNumber={currentQuestion}
      totalQuestions={sampleQuestions.length}
      sectionNumber={1}
      timeRemaining={timeRemaining}
      isMarked={isMarked}
      correctAnswer={currentQuestionData.correctAnswer}
      onSubmitAnswer={handleSubmitAnswer}
      onBackPress={handleBackPress}
      onMarkToggle={handleMarkToggle}
      onTimeUp={handleTimeUp}
      initialMemo={memo}
      onMemoChange={handleMemoChange}
      testID="cbt-demo"
    />
  );
};

// デモ起動用のエントリーポイント
export const CBTDemoScreen: React.FC = () => {
  const [showDemo, setShowDemo] = useState(false);

  if (showDemo) {
    return <CBTDemo onClose={() => setShowDemo(false)} />;
  }

  return (
    <View style={styles.welcomeContainer}>
      <ScrollView contentContainerStyle={styles.welcomeContent}>
        <Text style={styles.welcomeTitle}>CBT Phase C デモ</Text>
        <Text style={styles.welcomeSubtitle}>
          Q2/Q3 CBT UI改善の新機能をお試しください
        </Text>

        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>⏱️</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>タイマー機能</Text>
              <Text style={styles.featureDescription}>
                リアルタイム時間表示と色分け警告
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📝</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>メモ・計算パネル</Text>
              <Text style={styles.featureDescription}>
                フローティングメモと計算機能
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔖</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>問題マーク機能</Text>
              <Text style={styles.featureDescription}>
                要復習問題のマーキング
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>⚖️</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>貸借平衡チェック</Text>
              <Text style={styles.featureDescription}>
                リアルタイム差額表示と検証
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🎯</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>CBTレイアウト</Text>
              <Text style={styles.featureDescription}>本格的試験形式のUI</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔍</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>勘定科目フィルタリング</Text>
              <Text style={styles.featureDescription}>
                問題に応じた動的科目絞り込み
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => setShowDemo(true)}
          testID="start-cbt-demo"
        >
          <Text style={styles.startButtonText}>デモを開始</Text>
        </TouchableOpacity>

        <Text style={styles.demoInfo}>
          3問のサンプル仕訳問題でCBT機能をお試しいただけます
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  welcomeContent: {
    padding: 20,
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0066CC",
    marginBottom: 8,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 32,
    textAlign: "center",
  },
  featureList: {
    width: "100%",
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F8F9FA",
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#0066CC",
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    color: "#666666",
  },
  startButton: {
    backgroundColor: "#0066CC",
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  demoInfo: {
    fontSize: 14,
    color: "#999999",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
