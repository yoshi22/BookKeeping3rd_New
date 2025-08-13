import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "../../../src/components/layout/ResponsiveLayout";
import { QuestionRepository } from "../../../src/data/repositories/question-repository";
import type { QuestionCategory } from "../../../src/types/models";

export default function LearningScreen() {
  const router = useRouter();
  const [questionCounts, setQuestionCounts] = useState<
    Record<QuestionCategory, number>
  >({
    journal: 0,
    ledger: 0,
    trial_balance: 0,
    financial_statement: 0,
  });
  const [loading, setLoading] = useState(true);

  const categories = [
    {
      id: "journal" as QuestionCategory,
      name: "第1問",
      subtitle: "仕訳問題",
      description: "基本的な仕訳から応用仕訳まで",
      totalQuestions: questionCounts.journal,
      completedQuestions: 0,
      icon: "📝",
      color: "#4CAF50",
      points: "45点",
      examCount: "15問",
      examTime: "15-20分",
      details:
        "現金・預金、商品売買、債権・債務、給与・税金、固定資産、決算整理",
    },
    {
      id: "ledger" as QuestionCategory,
      name: "第2問",
      subtitle: "補助簿・勘定記入・伝票",
      description: "帳簿記入と勘定の理解",
      totalQuestions: questionCounts.ledger,
      completedQuestions: 0,
      icon: "📋",
      color: "#FF9800",
      points: "20点",
      examCount: "2問",
      examTime: "15-20分",
      details: "勘定記入、補助簿記入、伝票記入、理論・選択問題",
    },
    {
      id: "trial_balance" as QuestionCategory,
      name: "第3問",
      subtitle: "決算書作成",
      description: "財務諸表・精算表・試算表の作成",
      totalQuestions: questionCounts.trial_balance,
      completedQuestions: 0,
      icon: "📊",
      color: "#2196F3",
      points: "35点",
      examCount: "1問",
      examTime: "25-30分",
      details: "財務諸表作成、精算表作成、試算表作成",
    },
  ];

  useEffect(() => {
    const loadQuestionCounts = async () => {
      try {
        console.log("[Learning] 問題数の取得開始");
        const questionRepository = new QuestionRepository();
        const counts = await questionRepository.getQuestionCountsByCategory();
        console.log("[Learning] 問題数取得成功:", counts);
        setQuestionCounts(counts);
        // データがない場合のデフォルト値を設定
        if (
          !counts.journal &&
          !counts.ledger &&
          !counts.trial_balance &&
          !counts.financial_statement
        ) {
          console.warn(
            "[Learning] 問題データが存在しません。デフォルト値を設定します。",
          );
          setQuestionCounts({
            journal: 0,
            ledger: 0,
            trial_balance: 0,
            financial_statement: 0,
          });
        }
      } catch (error) {
        console.error("[Learning] 問題数の取得に失敗しました:", error);
        // エラー時はデフォルト値を設定
        setQuestionCounts({
          journal: 0,
          ledger: 0,
          trial_balance: 0,
          financial_statement: 0,
        });
        // エラー時でもローディング状態を解除
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    loadQuestionCounts();
  }, []);

  return (
    <Screen safeArea={true} scrollable={true} statusBarStyle="dark-content">
      {/* アプリタイトル（ヘッダー代替） */}
      <View style={styles.headerSection}>
        <Text style={styles.appTitle}>学習</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>📚 学習モード</Text>
        <Text style={styles.subtitle}>段階的学習で簿記3級を完全攻略</Text>
        <Text style={styles.totalQuestions}>
          全{Object.values(questionCounts).reduce((a, b) => a + b, 0)}
          問の豊富な問題で実力アップ
        </Text>
      </View>

      <View style={styles.categoriesContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>問題数を読み込み中...</Text>
          </View>
        ) : (
          <>
            {/* 全302問順次進行ボタン（problemsStrategy.md対応） */}
            <TouchableOpacity
              style={[styles.categoryCard, { borderLeftColor: "#ff6b35" }]}
              onPress={() => {
                // 第一問から順次進行（Q_J_001から開始）
                router.push(
                  "/(tabs)/learning/question/Q_J_001?sessionType=learning",
                );
              }}
            >
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryIcon}>🎯</Text>
                <View style={styles.categoryTitleContainer}>
                  <Text style={styles.categoryName}>全問題順次進行</Text>
                  <Text style={styles.categorySubtitle}>
                    302問完全制覇モード
                  </Text>
                </View>
                <View
                  style={[styles.pointsBadge, { backgroundColor: "#ff6b35" }]}
                >
                  <Text style={styles.pointsText}>302問</Text>
                </View>
              </View>

              <View style={styles.categoryInfo}>
                <Text style={styles.categoryDescription}>
                  第1問→第2問→第3問の全302問を順次進行
                </Text>
                <View style={styles.examInfo}>
                  <Text style={styles.examInfoText}>
                    📚 仕訳250問 • 📋 帳簿40問 • 📊 決算書12問
                  </Text>
                </View>
                <Text style={styles.categoryDetails}>
                  🎯 problemsStrategy.md準拠の完全版問題集
                </Text>
                <Text style={styles.categoryProgress}>
                  全{Object.values(questionCounts).reduce((a, b) => a + b, 0)}
                  問の順次学習
                </Text>
              </View>

              <View
                style={[styles.categoryAction, { backgroundColor: "#ff6b35" }]}
              >
                <Text style={styles.actionText}>開始</Text>
              </View>
            </TouchableOpacity>

            {/* 既存のカテゴリ別学習 */}
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  { borderLeftColor: category.color },
                ]}
                onPress={() => {
                  // カテゴリ詳細画面に遷移
                  router.push(`/(tabs)/learning/category/${category.id}`);
                }}
              >
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <View style={styles.categoryTitleContainer}>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categorySubtitle}>
                      {category.subtitle}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.pointsBadge,
                      { backgroundColor: category.color },
                    ]}
                  >
                    <Text style={styles.pointsText}>{category.points}</Text>
                  </View>
                </View>

                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryDescription}>
                    {category.description}
                  </Text>
                  <View style={styles.examInfo}>
                    <Text style={styles.examInfoText}>
                      🎯 本試験: {category.examCount} • ⏱ {category.examTime}
                    </Text>
                  </View>
                  <Text style={styles.categoryDetails}>
                    📚 {category.details}
                  </Text>
                  <Text style={styles.categoryProgress}>
                    練習問題: 全{category.totalQuestions}問 • 学習進捗:{" "}
                    {Math.round(
                      (category.completedQuestions / category.totalQuestions) *
                        100,
                    ) || 0}
                    %
                  </Text>
                </View>

                <View
                  style={[
                    styles.categoryAction,
                    { backgroundColor: category.color },
                  ]}
                >
                  <Text style={styles.actionText}>選択</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>

      <View style={styles.mockExamSection}>
        <Text style={styles.sectionTitle}>🎯 実力チェック</Text>
        <TouchableOpacity
          style={styles.mockExamButton}
          onPress={() => {
            router.push("/mock-exam");
          }}
        >
          <Text style={styles.mockExamIcon}>🎯</Text>
          <View style={styles.mockExamInfo}>
            <Text style={styles.mockExamTitle}>CBT形式模擬試験</Text>
            <Text style={styles.mockExamSubtitle}>
              本試験同等の60分制限・5セット用意
            </Text>
            <Text style={styles.mockExamDetail}>
              第1問（仕訳15問45点）• 第2問（補助簿等2問20点）•
              第3問（決算書1問35点）
            </Text>
          </View>
          <View style={styles.examAction}>
            <Text style={styles.examActionText}>開始</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerSection: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 1,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2f95dc",
    textAlign: "center",
  },
  header: {
    padding: 20,
    alignItems: "center",
    paddingTop: 40, // ヘッダータイトル分のスペースを削減
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2f95dc",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 8,
  },
  totalQuestions: {
    fontSize: 14,
    textAlign: "center",
    color: "#999",
    fontStyle: "italic",
  },
  categoriesContainer: {
    padding: 20,
  },
  categoryCard: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryIcon: {
    fontSize: 30,
    marginRight: 10,
  },
  categoryTitleContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  categorySubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  pointsBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  pointsText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  categoryInfo: {
    marginLeft: 40,
  },
  categoryDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  examInfo: {
    marginBottom: 5,
  },
  examInfoText: {
    fontSize: 12,
    color: "#666",
  },
  categoryDetails: {
    fontSize: 12,
    color: "#999",
    marginBottom: 5,
  },
  categoryProgress: {
    fontSize: 12,
    color: "#666",
  },
  categoryAction: {
    position: "absolute",
    right: 15,
    bottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  actionText: {
    color: "white",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  mockExamSection: {
    padding: 20,
  },
  mockExamButton: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#ff6b35",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mockExamIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  mockExamInfo: {
    flex: 1,
  },
  mockExamTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  mockExamSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  mockExamDetail: {
    fontSize: 12,
    color: "#999",
  },
  examAction: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#ff6b35",
    borderRadius: 5,
  },
  examActionText: {
    color: "white",
    fontWeight: "bold",
  },
  loadingContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
});
