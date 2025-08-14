import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { MockExam } from "../../src/types/models";
import { MockExamRepository } from "../../src/data/repositories/mock-exam-repository";
import { Screen } from "../../src/components/layout/ResponsiveLayout";

export default function MockExamTabScreen() {
  const router = useRouter();
  const [mockExams, setMockExams] = useState<MockExam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMockExams();
  }, []);

  const loadMockExams = async () => {
    try {
      const mockExamRepo = new MockExamRepository();
      const exams = await mockExamRepo.findAll();
      const activeExams = exams.filter((exam) => exam.is_active);
      setMockExams(activeExams);
    } catch (error) {
      console.error("Error loading mock exams:", error);
      Alert.alert("エラー", "模試データの読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const startMockExam = (exam: MockExam) => {
    Alert.alert(
      "模試開始確認",
      `${exam.name}を開始しますか？\\n\\n制限時間: ${exam.time_limit_minutes}分\\n合格基準: ${exam.passing_score}点以上`,
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "開始",
          onPress: () => {
            router.push({
              pathname: "/mock-exam/[examId]",
              params: { examId: exam.id },
            });
          },
        },
      ],
    );
  };

  return (
    <Screen testID="mock-exam-screen">
      {/* アプリタイトル（ヘッダー代替） */}
      <View style={styles.headerSection}>
        <Text style={styles.appTitle}>模擬試験</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>模擬試験</Text>
        <Text style={styles.subtitle}>
          本試験形式のCBT模擬試験で実力をチェックしましょう。
          制限時間内に全問題に取り組んでください。
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2f95dc" />
            <Text style={styles.loadingText}>模試データを読み込み中...</Text>
          </View>
        ) : (
          <View testID="mock-exam-list">
            {mockExams.map((exam) => {
              let structure;
              try {
                structure = JSON.parse(exam.structure_json);
              } catch {
                structure = {
                  section1: { count: 15 },
                  section2: { count: 2 },
                  section3: { count: 1 },
                };
              }
              const totalQuestions =
                (structure.section1?.count || 0) +
                (structure.section2?.count || 0) +
                (structure.section3?.count || 0);

              // Format exam ID as 3-digit string for testID
              const examIdFormatted = exam.id.toString().padStart(3, "0");

              return (
                <TouchableOpacity
                  key={exam.id}
                  style={styles.examCard}
                  onPress={() => startMockExam(exam)}
                  testID={`mock-exam-${examIdFormatted}`}
                  accessibilityLabel={`${exam.name}模試を開始`}
                >
                  <View style={styles.examInfo}>
                    <Text style={styles.examName}>{exam.name}</Text>
                    <Text style={styles.examDescription}>
                      {exam.description}
                    </Text>
                    <View style={styles.examDetails}>
                      <Text style={styles.examDetail}>
                        📝 {totalQuestions}問
                      </Text>
                      <Text style={styles.examDetail}>
                        ⏰ {exam.time_limit_minutes}分
                      </Text>
                      <Text style={styles.examDetail}>
                        🎯 {exam.total_score}点満点
                      </Text>
                      <Text style={styles.examDetail}>
                        ✅ {exam.passing_score}点で合格
                      </Text>
                    </View>
                  </View>
                  <View style={styles.startButton}>
                    <Text style={styles.startButtonText}>開始</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
    paddingTop: 60, // ヘッダータイトル分のスペース
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
    lineHeight: 24,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  examCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  examInfo: {
    flex: 1,
  },
  examName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  examDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  examDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  examDetail: {
    fontSize: 12,
    color: "#888",
    marginRight: 16,
    marginBottom: 4,
  },
  startButton: {
    backgroundColor: "#2f95dc",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
