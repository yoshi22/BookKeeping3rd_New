/**
 * 模試選択コンポーネント
 * 利用可能な模試一覧の表示と選択機能
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MockExam, MockExamResult } from "../types/models";
import { MockExamService } from "../services/mock-exam-service";

interface MockExamSelectorProps {
  onExamSelected: (examId: string) => void;
  onViewResults?: (examId: string) => void;
}

interface MockExamItemData extends MockExam {
  lastResult?: MockExamResult;
  bestScore?: number;
  attemptCount?: number;
}

export const MockExamSelector: React.FC<MockExamSelectorProps> = ({
  onExamSelected,
  onViewResults,
}) => {
  const [mockExams, setMockExams] = useState<MockExamItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mockExamService = new MockExamService();

  useEffect(() => {
    loadMockExams();
  }, []);

  const loadMockExams = async () => {
    try {
      setLoading(true);
      setError(null);

      // 模試一覧を取得
      const exams = await mockExamService.getAvailableMockExams();

      // 各模試の結果情報を取得
      const examStats = await mockExamService.getMockExamStatisticsByExam();

      const enrichedExams: MockExamItemData[] = await Promise.all(
        exams.map(async (exam) => {
          const stats = examStats.find((s) => s.examId === exam.id);
          const lastResult = await mockExamService.getLatestMockExamResult(
            exam.id,
          );

          return {
            ...exam,
            lastResult: lastResult || undefined,
            bestScore: stats?.bestScore || 0,
            attemptCount: stats?.attemptCount || 0,
          };
        }),
      );

      setMockExams(enrichedExams);
    } catch (err) {
      console.error("Failed to load mock exams:", err);
      setError("模試情報の読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = (examId: string, examName: string) => {
    Alert.alert(
      "模試開始確認",
      `「${examName}」を開始しますか？\n\n• 制限時間: 60分\n• 途中保存はできません\n• 一度開始すると中断できません`,
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "開始",
          style: "default",
          onPress: () => onExamSelected(examId),
        },
      ],
    );
  };

  const renderMockExamItem = ({ item }: { item: MockExamItemData }) => (
    <View style={styles.examCard}>
      <View style={styles.examHeader}>
        <Text style={styles.examTitle}>{item.name}</Text>
        <View style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>
            {getDifficultyLevel(item.id)}
          </Text>
        </View>
      </View>

      <Text style={styles.examDescription}>{item.description}</Text>

      <View style={styles.examStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>制限時間</Text>
          <Text style={styles.statValue}>{item.time_limit_minutes}分</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>合格点</Text>
          <Text style={styles.statValue}>{item.passing_score}点</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>受験回数</Text>
          <Text style={styles.statValue}>{item.attemptCount || 0}回</Text>
        </View>

        {item.bestScore && item.bestScore > 0 && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>最高得点</Text>
            <Text
              style={[
                styles.statValue,
                item.bestScore >= item.passing_score
                  ? styles.passedScore
                  : styles.failedScore,
              ]}
            >
              {item.bestScore}点
            </Text>
          </View>
        )}
      </View>

      {item.lastResult && (
        <View style={styles.lastResultContainer}>
          <Text style={styles.lastResultLabel}>前回結果:</Text>
          <Text
            style={[
              styles.lastResultScore,
              item.lastResult.is_passed
                ? styles.passedScore
                : styles.failedScore,
            ]}
          >
            {item.lastResult.total_score}点
            {item.lastResult.is_passed ? " (合格)" : " (不合格)"}
          </Text>
          <Text style={styles.lastResultDate}>
            {formatDate(item.lastResult.taken_at)}
          </Text>
        </View>
      )}

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => handleStartExam(item.id, item.name)}
        >
          <Text style={styles.startButtonText}>模試開始</Text>
        </TouchableOpacity>

        {item.attemptCount && item.attemptCount > 0 && onViewResults && (
          <TouchableOpacity
            style={styles.resultsButton}
            onPress={() => onViewResults!(item.id)}
          >
            <Text style={styles.resultsButtonText}>結果履歴</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const getDifficultyLevel = (examId: string): string => {
    switch (examId) {
      case "MOCK_001":
        return "基礎";
      case "MOCK_002":
        return "標準";
      case "MOCK_003":
        return "応用";
      case "MOCK_004":
        return "実践";
      case "MOCK_005":
        return "総合";
      default:
        return "標準";
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>模試情報を読み込み中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadMockExams}>
          <Text style={styles.retryButtonText}>再試行</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>模試選択</Text>
        <Text style={styles.headerSubtitle}>
          本試験形式の模試で実力をチェックしましょう
        </Text>
      </View>

      <FlatList
        data={mockExams}
        keyExtractor={(item) => item.id}
        renderItem={renderMockExamItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6c757d",
  },
  listContainer: {
    padding: 16,
  },
  examCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  examHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  examTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212529",
    flex: 1,
  },
  difficultyBadge: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    color: "#1976d2",
    fontWeight: "600",
  },
  examDescription: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 16,
    lineHeight: 20,
  },
  examStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#212529",
  },
  passedScore: {
    color: "#28a745",
  },
  failedScore: {
    color: "#dc3545",
  },
  lastResultContainer: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  lastResultLabel: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 4,
  },
  lastResultScore: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  lastResultDate: {
    fontSize: 12,
    color: "#6c757d",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  startButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resultsButton: {
    flex: 1,
    backgroundColor: "#6c757d",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  resultsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6c757d",
  },
  errorText: {
    fontSize: 16,
    color: "#dc3545",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
