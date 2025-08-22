/**
 * カテゴリ詳細画面（問題選択・フィルタリング）
 * 仕訳・帳簿・試算表の各カテゴリに対応した問題選択UI
 */

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Screen } from "../../../../src/components/layout/ResponsiveLayout";
import { QuestionRepository } from "../../../../src/data/repositories/question-repository";
import { LearningHistoryRepository } from "../../../../src/data/repositories/learning-history-repository";
import {
  useTheme,
  useThemedStyles,
  useCategoryColors,
  useLearningColors,
  type Theme,
} from "../../../../src/context/ThemeContext";
import type {
  Question,
  QuestionCategory,
  QuestionDifficulty,
} from "../../../../src/types/models";
import { logger } from "../../../../src/utils/logger";

interface FilterOptions {
  difficulties: QuestionDifficulty[];
  questionTypes: string[];
  learningStatus:
    | "all"
    | "unstudied"
    | "incorrect"
    | "recent_incorrect"
    | "needs_review";
  excludeRecent: boolean;
}

export default function CategoryDetailScreen() {
  const router = useRouter();
  const { categoryId } = useLocalSearchParams<{
    categoryId: QuestionCategory;
  }>();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  // テーマシステムの取得
  const { theme } = useTheme();
  const categoryColors = useCategoryColors();
  const learningColors = useLearningColors();

  // テーマ対応スタイル生成
  const styles = useThemedStyles(createStyles);

  // カテゴリ情報の定義
  const categoryConfig = {
    journal: {
      id: "journal" as QuestionCategory,
      name: "第1問",
      subtitle: "仕訳問題",
      description: "基本的な仕訳から応用仕訳まで",
      icon: "📝",
      color: categoryColors.journal,
      points: "45点",
      examInfo: "本試験: 15問 • 15-20分",
    },
    ledger: {
      id: "ledger" as QuestionCategory,
      name: "第2問",
      subtitle: "補助簿・勘定記入・伝票",
      description: "帳簿記入と勘定の理解",
      icon: "📋",
      color: categoryColors.ledger,
      points: "20点",
      examInfo: "本試験: 2問 • 15-20分",
    },
    trial_balance: {
      id: "trial_balance" as QuestionCategory,
      name: "第3問",
      subtitle: "決算書作成",
      description: "財務諸表・精算表・試算表の作成",
      icon: "📊",
      color: categoryColors.trialBalance,
      points: "35点",
      examInfo: "本試験: 1問 • 25-30分",
    },
    financial_statement: {
      id: "financial_statement" as QuestionCategory,
      name: "財務諸表",
      subtitle: "財務諸表作成問題",
      description: "貸借対照表・損益計算書の作成",
      icon: "📈",
      color: theme.colors.secondary,
      points: "35点",
      examInfo: "財務諸表作成問題",
    },
    voucher_entry: {
      id: "voucher_entry" as QuestionCategory,
      name: "伝票記入",
      subtitle: "伝票記入問題",
      description: "3伝票制・5伝票制による記入",
      icon: "📄",
      color: theme.colors.textSecondary,
      points: "20点",
      examInfo: "伝票記入問題",
    },
    multiple_blank_choice: {
      id: "multiple_blank_choice" as QuestionCategory,
      name: "複数空欄選択",
      subtitle: "複数空欄選択問題",
      description: "複数の空欄を選択肢から選ぶ問題",
      icon: "✅",
      color: theme.colors.info,
      points: "20点",
      examInfo: "複数空欄選択問題",
    },
  };

  const currentCategory =
    categoryConfig[categoryId as QuestionCategory] || categoryConfig.journal;

  // 難易度オプションの定義 (5段階を3分類にマッピング)
  const difficultyOptions = [
    {
      levels: [1, 2] as QuestionDifficulty[],
      name: "基礎",
      description: "基本的な問題・基礎レベル (難易度1-2)",
      color: learningColors.completed,
      icon: "⭐",
    },
    {
      levels: [3] as QuestionDifficulty[],
      name: "標準",
      description: "標準的な問題・中級レベル (難易度3)",
      color: theme.colors.warning,
      icon: "⭐⭐",
    },
    {
      levels: [4, 5] as QuestionDifficulty[],
      name: "応用",
      description: "応用問題・上級レベル (難易度4-5)",
      color: theme.colors.error,
      icon: "⭐⭐⭐",
    },
  ];

  // 問題タイプオプションの定義 (problemsStrategy.md完全準拠)
  const questionTypeOptions: Record<
    QuestionCategory,
    { type: string; name: string; icon: string; count: number }[]
  > = {
    journal: [
      { type: "cash_deposit", name: "現金・預金取引", icon: "💰", count: 42 },
      { type: "sales_purchase", name: "商品売買取引", icon: "🛒", count: 45 },
      { type: "receivable_payable", name: "債権・債務", icon: "📋", count: 41 },
      { type: "salary_tax", name: "給与・税金", icon: "💼", count: 42 },
      { type: "fixed_asset", name: "固定資産", icon: "🏢", count: 40 },
      { type: "adjustment", name: "決算整理", icon: "📊", count: 40 },
    ],
    ledger: [
      { type: "account_entry", name: "勘定記入問題", icon: "✏️", count: 10 },
      {
        type: "subsidiary_books",
        name: "補助簿記入問題",
        icon: "📓",
        count: 10,
      },
      { type: "voucher_entry", name: "伝票記入問題", icon: "📄", count: 10 },
      {
        type: "theory_selection",
        name: "理論・選択問題",
        icon: "📖",
        count: 10,
      },
    ],
    trial_balance: [
      {
        type: "financial_statements",
        name: "財務諸表作成",
        icon: "📊",
        count: 4,
      },
      { type: "worksheet", name: "精算表作成", icon: "📋", count: 4 },
      { type: "trial_balance", name: "試算表作成", icon: "📝", count: 4 },
    ],
    financial_statement: [
      {
        type: "balance_sheet",
        name: "貸借対照表作成",
        icon: "📊",
        count: 1,
      },
      {
        type: "income_statement",
        name: "損益計算書作成",
        icon: "📈",
        count: 1,
      },
    ],
    voucher_entry: [
      {
        type: "3_voucher_system",
        name: "3伝票制",
        icon: "📄",
        count: 5,
      },
      {
        type: "5_voucher_system",
        name: "5伝票制",
        icon: "📋",
        count: 5,
      },
    ],
    multiple_blank_choice: [
      {
        type: "multiple_choice",
        name: "複数空欄選択",
        icon: "✅",
        count: 10,
      },
    ],
  };

  const [filters, setFilters] = useState<FilterOptions>({
    difficulties: [],
    questionTypes: [],
    learningStatus: "all",
    excludeRecent: false,
  });

  const [learningStats, setLearningStats] = useState<{
    answeredQuestions: Set<string>;
    incorrectQuestions: Map<string, number>;
    recentQuestions: Set<string>;
  }>({
    answeredQuestions: new Set(),
    incorrectQuestions: new Map(),
    recentQuestions: new Set(),
  });

  // 問題データと学習統計を読み込む
  useEffect(() => {
    const loadData = async () => {
      try {
        // 問題データを読み込む（problemsStrategy順序を使用）
        const questionRepository = new QuestionRepository();
        const categoryQuestions = await questionRepository.findByCategory(
          categoryId as QuestionCategory,
          { useProblemsStrategyOrder: true },
        );

        setQuestions(categoryQuestions);
        setFilteredQuestions(categoryQuestions);

        // 学習統計を読み込む
        await loadLearningStats();
      } catch (error) {
        logger.error("[CategoryDetail] データ読み込みエラー:", error as Error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      loadData();
    }
  }, [categoryId]);

  // フィルターが変更されたときに問題を再フィルタリング
  useEffect(() => {
    if (questions.length > 0) {
      applyFilters();
    }
  }, [filters, questions]);

  // カテゴリ情報
  const categoryInfo = {
    journal: {
      name: "第1問：仕訳問題",
      description: "基本的な仕訳15問（各3点）",
      icon: "📝",
      color: categoryColors.journal,
      examInfo: "本試験：15問・45点・20分",
      levels: [
        {
          name: "基礎",
          description: "基本的な商品売買・現金取引",
          difficulty: 1 as QuestionDifficulty,
        },
        {
          name: "応用",
          description: "手形・固定資産・決算整理",
          difficulty: 2 as QuestionDifficulty,
        },
        {
          name: "総合",
          description: "複合取引・応用問題",
          difficulty: 3 as QuestionDifficulty,
        },
      ],
    },
    ledger: {
      name: "第2問：帳簿・補助簿",
      description: "帳簿記入・補助簿・伝票処理",
      icon: "📋",
      color: categoryColors.ledger,
      examInfo: "本試験：2問・20点・20分",
      levels: [
        {
          name: "基礎",
          description: "勘定記入・補助簿記入",
          difficulty: 1 as QuestionDifficulty,
        },
        {
          name: "応用",
          description: "伝票記入・理論問題",
          difficulty: 2 as QuestionDifficulty,
        },
        {
          name: "総合",
          description: "複合的な帳簿処理",
          difficulty: 3 as QuestionDifficulty,
        },
      ],
    },
    trial_balance: {
      name: "第3問：決算書作成",
      description: "財務諸表・精算表・試算表",
      icon: "📊",
      color: categoryColors.trialBalance,
      examInfo: "本試験：1問・35点・20分",
      levels: [
        {
          name: "基礎",
          description: "財務諸表作成（基礎レベル）",
          difficulty: 1 as QuestionDifficulty,
        },
        {
          name: "応用",
          description: "精算表作成（標準レベル）",
          difficulty: 2 as QuestionDifficulty,
        },
        {
          name: "総合",
          description: "試算表作成（応用レベル）",
          difficulty: 3 as QuestionDifficulty,
        },
      ],
    },
  };

  const loadLearningStats = async () => {
    try {
      const historyRepository = new LearningHistoryRepository();

      // カテゴリの解答履歴を取得
      const categoryHistory = await historyRepository.findByCategory(
        categoryId!,
        {
          limit: 1000,
        },
      );

      // 解答済み問題のセット
      const answeredQuestions = new Set(
        categoryHistory.map((h) => h.question_id),
      );

      // 間違えた問題とその回数をマップで管理
      const incorrectQuestions = new Map<string, number>();
      categoryHistory.forEach((history) => {
        if (!history.is_correct) {
          const current = incorrectQuestions.get(history.question_id) || 0;
          incorrectQuestions.set(history.question_id, current + 1);
        }
      });

      // 最近（7日以内）に解いた問題
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentQuestions = new Set(
        categoryHistory
          .filter((h) => new Date(h.answered_at) > sevenDaysAgo)
          .map((h) => h.question_id),
      );

      setLearningStats({
        answeredQuestions,
        incorrectQuestions,
        recentQuestions,
      });
    } catch (error) {
      logger.error("学習統計の読み込みに失敗:", error as Error);
    }
  };

  // 学習状況別の問題数を取得する関数
  const getQuestionsForStatus = (
    status: FilterOptions["learningStatus"],
  ): number => {
    switch (status) {
      case "all":
        return questions.length;
      case "unstudied":
        return questions.filter(
          (q) => !learningStats.answeredQuestions.has(q.id),
        ).length;
      case "incorrect":
        return questions.filter((q) =>
          learningStats.incorrectQuestions.has(q.id),
        ).length;
      case "recent_incorrect":
        return questions.filter((q) =>
          learningStats.incorrectQuestions.has(q.id),
        ).length;
      case "needs_review":
        return questions.filter(
          (q) =>
            learningStats.incorrectQuestions.has(q.id) &&
            !learningStats.recentQuestions.has(q.id),
        ).length;
      default:
        return 0;
    }
  };

  const applyFilters = () => {
    let filtered = [...questions];

    // 難易度フィルター（複数選択対応）
    if (filters.difficulties.length > 0) {
      filtered = filtered.filter((q) =>
        filters.difficulties.includes(q.difficulty),
      );
    }

    // 問題類型フィルター（problemsStrategy.md準拠の分類ロジック使用）
    if (filters.questionTypes.length > 0) {
      filtered = filtered.filter((q) =>
        filters.questionTypes.some((type) =>
          getQuestionTypeFromQuestion(q).includes(type),
        ),
      );
    }

    // 学習状況フィルター
    if (filters.learningStatus !== "all") {
      switch (filters.learningStatus) {
        case "unstudied":
          // まだ解いたことのない問題
          filtered = filtered.filter(
            (q) => !learningStats.answeredQuestions.has(q.id),
          );
          break;
        case "incorrect":
          // 間違えたことがある問題
          filtered = filtered.filter((q) =>
            learningStats.incorrectQuestions.has(q.id),
          );
          break;
        case "recent_incorrect":
          // 最近間違えた問題（間違いが多い順）
          filtered = filtered
            .filter((q) => learningStats.incorrectQuestions.has(q.id))
            .sort((a, b) => {
              const aCount = learningStats.incorrectQuestions.get(a.id) || 0;
              const bCount = learningStats.incorrectQuestions.get(b.id) || 0;
              return bCount - aCount;
            });
          break;
        case "needs_review":
          // 復習が必要な問題（間違いがあり、最近解いていない）
          filtered = filtered.filter(
            (q) =>
              learningStats.incorrectQuestions.has(q.id) &&
              !learningStats.recentQuestions.has(q.id),
          );
          break;
      }
    }

    // 最近解いた問題を除外
    if (filters.excludeRecent) {
      filtered = filtered.filter(
        (q) => !learningStats.recentQuestions.has(q.id),
      );
    }

    setFilteredQuestions(filtered);
  };

  // 問題から類型を推測する関数 (tags_jsonベース・動的分類)
  const getQuestionTypeFromQuestion = (question: Question): string[] => {
    try {
      if (categoryId === "journal") {
        // tags_jsonからsubcategoryを取得して分類
        const tags = JSON.parse(question.tags_json || "{}");
        const subcategory = tags.subcategory;

        // subcategoryからquestion typeへのマッピング
        const subcategoryToType: Record<string, string> = {
          // 現金・預金関連
          cash_deposit: "cash_deposit",

          // 商品売買関連
          sales_purchase: "sales_purchase",
          merchandise: "sales_purchase",
          shipping_special: "sales_purchase",

          // 債権・債務関連
          receivable_payable: "receivable_payable",
          bill_of_exchange: "receivable_payable",
          lending_borrowing: "receivable_payable",

          // 給与・税金関連
          salary_tax: "salary_tax",
          salary_payment: "salary_tax",
          salary_withholding: "salary_tax",
          payroll: "salary_tax",
          social_insurance: "salary_tax",
          source_tax: "salary_tax",
          corporate_tax: "salary_tax",

          // 固定資産関連
          fixed_asset: "fixed_asset",
          fixed_asset_disposal: "fixed_asset",

          // 決算整理関連
          adjustment: "adjustment",
        };

        const questionType = subcategoryToType[subcategory];
        return questionType ? [questionType] : ["other"];
      } else if (categoryId === "ledger") {
        // Use tags_json for dynamic categorization
        const tags = JSON.parse(question.tags_json || "{}");
        const subcategory = tags.subcategory;

        const subcategoryToType: Record<string, string> = {
          general_ledger: "account_entry", // Q_L_001-010: 勘定記入問題
          subsidiary_ledger: "subsidiary_books", // Q_L_011-020: 補助簿記入問題
          voucher: "voucher_entry", // Q_L_021-030: 伝票記入問題
          theory: "theory_selection", // Q_L_031-040: 理論・選択問題
        };

        const questionType = subcategoryToType[subcategory];
        return questionType ? [questionType] : ["other"];
      } else if (categoryId === "trial_balance") {
        // 第3問の分類（3パターン×4難易度=12問）
        const questionId = question.id;

        // パターン1: 財務諸表作成 (4問)
        if (["Q_T_001", "Q_T_002", "Q_T_003", "Q_T_004"].includes(questionId)) {
          return ["financial_statements"];
        }

        // パターン2: 精算表作成 (4問)
        if (["Q_T_005", "Q_T_006", "Q_T_007", "Q_T_008"].includes(questionId)) {
          return ["worksheet"];
        }

        // パターン3: 試算表作成 (4問)
        if (["Q_T_009", "Q_T_010", "Q_T_011", "Q_T_012"].includes(questionId)) {
          return ["trial_balance"];
        }

        // フォールバック: デフォルトは試算表
        return ["trial_balance"];
      }
      return ["other"];
    } catch (e) {
      return ["other"];
    }
  };

  const toggleDifficultyFilter = (levelGroup: QuestionDifficulty[]) => {
    // 複数レベルのグループを処理
    const hasAllSelected = levelGroup.every((level) =>
      filters.difficulties.includes(level),
    );

    let newDifficulties: QuestionDifficulty[];
    if (hasAllSelected) {
      // 全て選択済みの場合は全て除外
      newDifficulties = filters.difficulties.filter(
        (d) => !levelGroup.includes(d),
      );
    } else {
      // 一部または全く選択されていない場合は全て追加
      newDifficulties = [
        ...filters.difficulties,
        ...levelGroup.filter((level) => !filters.difficulties.includes(level)),
      ];
    }

    setFilters({ ...filters, difficulties: newDifficulties });
  };

  const toggleQuestionTypeFilter = (questionType: string) => {
    const newQuestionTypes = filters.questionTypes.includes(questionType)
      ? filters.questionTypes.filter((t) => t !== questionType)
      : [...filters.questionTypes, questionType];
    setFilters({ ...filters, questionTypes: newQuestionTypes });
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1:
      case 2:
        return learningColors.completed; // 基礎 - 緑
      case 3:
        return theme.colors.warning; // 標準 - オレンジ
      case 4:
      case 5:
        return theme.colors.error; // 応用 - 赤
      default:
        return theme.colors.textSecondary; // その他 - グレー
    }
  };

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1:
      case 2:
        return "基礎";
      case 3:
        return "標準";
      case 4:
      case 5:
        return "応用";
      default:
        return "";
    }
  };

  // 問題のタグから表示用のラベルを生成する関数
  const generateQuestionTags = (question: Question): string[] => {
    try {
      const tags = JSON.parse(question.tags_json || "{}");
      const tagLabels: string[] = [];

      // サブカテゴリのラベル
      if (tags.subcategory) {
        const subcategoryLabels: Record<string, string> = {
          // 仕訳問題のサブカテゴリ
          cash_deposit: "現金・預金",
          sales_purchase: "商品売買",
          receivable_payable: "債権・債務",
          salary_tax: "給与・税金",
          fixed_asset: "固定資産",
          adjustment: "決算整理",
          // 帳簿問題のサブカテゴリ
          general_ledger: "総勘定元帳",
          subsidiary_ledger: "補助簿",
          voucher: "伝票",
          theory: "理論・選択",
          // 試算表問題のサブカテゴリ
          financial_statement: "財務諸表",
          worksheet: "精算表",
          trial_balance: "試算表",
        };
        const label = subcategoryLabels[tags.subcategory];
        if (label) tagLabels.push(label);
      }

      // パターンのラベル
      if (tags.pattern && typeof tags.pattern === "string") {
        tagLabels.push(tags.pattern);
      }

      // サブパターンのラベル（problemsStrategy.md階層構造対応）
      if (tags.subpattern && typeof tags.subpattern === "string") {
        tagLabels.push(tags.subpattern);
      }

      // キーワードから主要なものを1つ追加
      if (
        tags.keywords &&
        Array.isArray(tags.keywords) &&
        tags.keywords.length > 0
      ) {
        // 最初のキーワードを追加（重複しない場合）
        const keyword = tags.keywords[0];
        if (!tagLabels.includes(keyword)) {
          tagLabels.push(keyword);
        }
      }

      return tagLabels.slice(0, 3); // 最大3つまで
    } catch (e) {
      logger.error("タグ解析エラー:", e as Error);
      return [];
    }
  };

  if (loading) {
    return (
      <Screen safeArea={true}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>問題を読み込み中...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen safeArea={true} scrollable={true}>
      {/* ヘッダー */}
      <View style={[styles.header, { backgroundColor: currentCategory.color }]}>
        <Text style={styles.categoryIcon}>{currentCategory.icon}</Text>
        <Text style={styles.headerTitle}>{currentCategory.name}</Text>
        <Text style={styles.headerSubtitle}>{currentCategory.description}</Text>
        <Text style={styles.examInfo}>{currentCategory.examInfo}</Text>
        <Text style={styles.questionCount}>全{questions.length}問</Text>
      </View>

      {/* 難易度フィルター */}
      <View style={styles.filtersContainer}>
        <Text style={styles.sectionTitle}>
          📊 難易度で絞り込む（複数選択可）
        </Text>
        <View style={styles.difficultyGrid}>
          {difficultyOptions.map((option, index) => {
            const isSelected = option.levels.every((level) =>
              filters.difficulties.includes(level),
            );
            const levelQuestions = questions.filter((q) =>
              option.levels.includes(q.difficulty),
            );

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.difficultyCard,
                  {
                    borderColor: option.color,
                    backgroundColor: isSelected
                      ? option.color
                      : theme.colors.surface,
                  },
                ]}
                onPress={() => toggleDifficultyFilter(option.levels)}
              >
                <Text
                  style={[
                    styles.difficultyName,
                    { color: isSelected ? theme.colors.surface : option.color },
                  ]}
                >
                  {option.name}
                  {isSelected && " ✓"}
                </Text>
                <Text
                  style={[
                    styles.difficultyCount,
                    {
                      color: isSelected
                        ? theme.colors.surface
                        : theme.colors.textSecondary,
                    },
                  ]}
                >
                  {levelQuestions.length}問
                </Text>
                <Text
                  style={[
                    styles.difficultyDescription,
                    {
                      color: isSelected
                        ? theme.colors.surface
                        : theme.colors.textDisabled,
                    },
                  ]}
                >
                  {option.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 問題類型フィルター */}
      <View style={styles.filtersContainer}>
        <Text style={styles.sectionTitle}>
          🏷️ 問題類型で絞り込む（複数選択可）
        </Text>
        <View style={styles.questionTypeGrid}>
          {questionTypeOptions[categoryId!]?.map((option, index) => {
            const isSelected = filters.questionTypes.includes(option.type);
            const typeQuestions = questions.filter((q) =>
              getQuestionTypeFromQuestion(q).includes(option.type),
            );

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.questionTypeCard,
                  {
                    borderColor: isSelected
                      ? theme.colors.primary
                      : theme.colors.border,
                    backgroundColor: isSelected
                      ? theme.colors.primary
                      : theme.colors.surface,
                  },
                ]}
                onPress={() => toggleQuestionTypeFilter(option.type)}
              >
                <Text
                  style={[
                    styles.questionTypeName,
                    {
                      color: isSelected
                        ? theme.colors.surface
                        : theme.colors.text,
                    },
                  ]}
                >
                  {option.name}
                  {isSelected && " ✓"}
                </Text>
                <Text
                  style={[
                    styles.questionTypeCount,
                    {
                      color: isSelected
                        ? theme.colors.surface
                        : theme.colors.textSecondary,
                    },
                  ]}
                >
                  {typeQuestions.length}問
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 学習状況フィルター */}
      <View style={styles.filtersContainer}>
        <Text style={styles.sectionTitle}>🎯 学習状況で絞り込む</Text>
        <View style={styles.learningStatusGrid}>
          {[
            {
              status: "all" as const,
              name: "すべて",
              description: "全ての問題を表示",
              icon: "📚",
              color: theme.colors.textSecondary,
            },
            {
              status: "unstudied" as const,
              name: "未学習",
              description: "まだ解いたことのない問題",
              icon: "🆕",
              color: theme.colors.success,
            },
            {
              status: "incorrect" as const,
              name: "間違い経験",
              description: "過去に間違えた問題",
              icon: "❌",
              color: theme.colors.error,
            },
            {
              status: "recent_incorrect" as const,
              name: "弱点克服",
              description: "間違いが多い問題順",
              icon: "🔥",
              color: learningColors.needsReview,
            },
            {
              status: "needs_review" as const,
              name: "復習推奨",
              description: "間違いがあり最近解いていない",
              icon: "🔄",
              color: theme.colors.warning,
            },
          ].map((option) => {
            const isSelected = filters.learningStatus === option.status;
            const statusQuestions = getQuestionsForStatus(option.status);

            return (
              <TouchableOpacity
                key={option.status}
                style={[
                  styles.learningStatusCard,
                  {
                    borderColor: option.color,
                    backgroundColor: isSelected
                      ? option.color
                      : theme.colors.surface,
                  },
                ]}
                onPress={() =>
                  setFilters({ ...filters, learningStatus: option.status })
                }
              >
                <Text style={styles.statusIcon}>{option.icon}</Text>
                <Text
                  style={[
                    styles.statusName,
                    { color: isSelected ? theme.colors.surface : option.color },
                  ]}
                >
                  {option.name}
                  {isSelected && " ✓"}
                </Text>
                <Text
                  style={[
                    styles.statusCount,
                    {
                      color: isSelected
                        ? theme.colors.surface
                        : theme.colors.textSecondary,
                    },
                  ]}
                >
                  {statusQuestions}問
                </Text>
                <Text
                  style={[
                    styles.statusDescription,
                    {
                      color: isSelected
                        ? theme.colors.surface
                        : theme.colors.textDisabled,
                    },
                  ]}
                >
                  {option.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 最近解いた問題を除外するオプション */}
        <TouchableOpacity
          style={[
            styles.excludeRecentOption,
            {
              backgroundColor: filters.excludeRecent
                ? theme.colors.primary
                : theme.colors.surface,
            },
          ]}
          onPress={() =>
            setFilters({ ...filters, excludeRecent: !filters.excludeRecent })
          }
        >
          <Text
            style={[
              styles.excludeRecentText,
              {
                color: filters.excludeRecent
                  ? theme.colors.surface
                  : theme.colors.text,
              },
            ]}
          >
            🕒 最近解いた問題を除外する (7日以内)
            {filters.excludeRecent && " ✓"}
          </Text>
          <Text
            style={[
              styles.excludeRecentCount,
              {
                color: filters.excludeRecent
                  ? theme.colors.surface
                  : theme.colors.textSecondary,
              },
            ]}
          >
            除外対象: {learningStats.recentQuestions.size}問
          </Text>
        </TouchableOpacity>
      </View>

      {/* 問題一覧（フィルター済み） */}
      {filteredQuestions.length > 0 ? (
        <View style={styles.questionsContainer}>
          <View style={styles.questionListHeader}>
            <Text style={styles.sectionTitle}>📝 問題一覧</Text>
            <View style={styles.questionStats}>
              <Text style={styles.questionStatsText}>
                {filteredQuestions.length}問が該当
              </Text>
            </View>
          </View>

          {filteredQuestions.map((question) => (
            <TouchableOpacity
              key={question.id}
              style={styles.questionCard}
              onPress={() => {
                // フィルタ済み問題リストをクエリパラメータとして渡す
                const filteredIds = filteredQuestions
                  .map((q) => q.id)
                  .join(",");
                router.push(
                  `/(tabs)/learning/question/${question.id}?filteredQuestions=${filteredIds}&sessionType=learning`,
                );
              }}
            >
              <View style={styles.questionHeader}>
                <View style={styles.tagContainer}>
                  {generateQuestionTags(question).map((tag, index) => (
                    <View key={index} style={styles.tagBadge}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
                <View
                  style={[
                    styles.difficultyBadge,
                    {
                      backgroundColor: getDifficultyColor(question.difficulty),
                    },
                  ]}
                >
                  <Text style={styles.difficultyText}>
                    {getDifficultyLabel(question.difficulty)}
                  </Text>
                </View>
              </View>
              {/* 問題文のプレビュー */}
              <Text style={styles.questionText} numberOfLines={2}>
                {question.question_text}
              </Text>
              {/* 学習状況の表示 */}
              <View style={styles.questionStatus}>
                {!learningStats.answeredQuestions.has(question.id) && (
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: theme.colors.success },
                    ]}
                  >
                    <Text style={styles.statusBadgeText}>未学習</Text>
                  </View>
                )}
                {learningStats.incorrectQuestions.has(question.id) && (
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: theme.colors.error },
                    ]}
                  >
                    <Text style={styles.statusBadgeText}>
                      間違い{learningStats.incorrectQuestions.get(question.id)}
                      回
                    </Text>
                  </View>
                )}
                {learningStats.recentQuestions.has(question.id) && (
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: theme.colors.warning },
                    ]}
                  >
                    <Text style={styles.statusBadgeText}>最近解答</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.noQuestionsContainer}>
          <Text style={styles.noQuestionsText}>
            条件に該当する問題がありません
          </Text>
          <Text style={styles.noQuestionsSubtext}>
            フィルター条件を変更してお試しください
          </Text>
        </View>
      )}
    </Screen>
  );
}

// テーマ対応スタイル生成関数
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    loadingText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    header: {
      padding: 20,
      alignItems: "center",
      position: "relative",
    },
    backButton: {
      position: "absolute",
      top: 20,
      left: 20,
      zIndex: 1,
    },
    backButtonText: {
      color: theme.colors.surface,
      fontSize: 16,
      fontWeight: "bold",
    },
    categoryIcon: {
      fontSize: 48,
      marginBottom: 10,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.surface,
      marginBottom: 5,
    },
    headerSubtitle: {
      fontSize: 16,
      color: theme.colors.surface,
      opacity: 0.9,
      marginBottom: 10,
    },
    questionCount: {
      fontSize: 14,
      color: theme.colors.surface,
      opacity: 0.8,
    },
    examInfo: {
      fontSize: 13,
      color: theme.colors.surface,
      opacity: 0.9,
      marginTop: 5,
      textAlign: "center",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 12,
      color: theme.colors.text,
    },
    difficultyGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    difficultyCard: {
      width: "48%",
      borderRadius: 10,
      padding: 15,
      alignItems: "center",
      marginBottom: 10,
      borderWidth: 2,
      ...theme.shadows.medium,
    },
    difficultyName: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 4,
      textAlign: "center",
    },
    difficultyCount: {
      fontSize: 14,
      marginBottom: 4,
      textAlign: "center",
    },
    difficultyDescription: {
      fontSize: 12,
      textAlign: "center",
      lineHeight: 16,
    },
    questionTypeGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    questionTypeCard: {
      width: "48%",
      borderRadius: 10,
      padding: 12,
      alignItems: "center",
      marginBottom: 10,
      borderWidth: 2,
      ...theme.shadows.medium,
    },
    questionTypeName: {
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 4,
      textAlign: "center",
    },
    questionTypeCount: {
      fontSize: 12,
      marginBottom: 4,
      textAlign: "center",
    },
    questionTypeDescription: {
      fontSize: 10,
      textAlign: "center",
      lineHeight: 14,
    },
    filtersContainer: {
      padding: 20,
      paddingTop: 0,
    },
    learningStatusGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: 15,
    },
    learningStatusCard: {
      width: "48%",
      borderRadius: 10,
      padding: 12,
      alignItems: "center",
      marginBottom: 10,
      borderWidth: 2,
      ...theme.shadows.medium,
    },
    statusIcon: {
      fontSize: 20,
      marginBottom: 4,
    },
    statusName: {
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 4,
      textAlign: "center",
    },
    statusCount: {
      fontSize: 12,
      marginBottom: 4,
      textAlign: "center",
    },
    statusDescription: {
      fontSize: 10,
      textAlign: "center",
      lineHeight: 14,
    },
    excludeRecentOption: {
      borderRadius: 10,
      padding: 12,
      borderWidth: 2,
      borderColor: theme.colors.primary,
      ...theme.shadows.medium,
    },
    excludeRecentText: {
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 4,
    },
    excludeRecentCount: {
      fontSize: 12,
    },
    questionsContainer: {
      padding: 20,
      paddingTop: 0,
    },
    questionListHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
    },
    questionStats: {
      alignItems: "flex-end",
    },
    questionStatsText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 5,
    },
    showAllButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 15,
    },
    showAllButtonText: {
      color: theme.colors.surface,
      fontSize: 12,
      fontWeight: "bold",
    },
    questionCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
      ...theme.shadows.small,
    },
    questionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    questionId: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontWeight: "bold",
    },
    questionTitle: {
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: "bold",
      flex: 1,
      marginRight: 8,
    },
    tagContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      flex: 1,
      gap: 4,
      marginRight: 8,
    },
    tagBadge: {
      backgroundColor: theme.colors.borderLight,
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    tagText: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    difficultyBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    difficultyText: {
      fontSize: 10,
      color: theme.colors.surface,
      fontWeight: "bold",
    },
    questionText: {
      fontSize: 14,
      color: theme.colors.text,
      lineHeight: 20,
    },
    showMoreButton: {
      backgroundColor: theme.colors.card,
      borderRadius: 10,
      padding: 15,
      alignItems: "center",
      marginTop: 10,
    },
    showMoreText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    noQuestionsContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: 10,
      padding: 30,
      margin: 20,
      alignItems: "center",
      ...theme.shadows.small,
    },
    noQuestionsText: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.textSecondary,
      marginBottom: 8,
      textAlign: "center",
    },
    noQuestionsSubtext: {
      fontSize: 14,
      color: theme.colors.textDisabled,
      textAlign: "center",
    },
    questionStatus: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 8,
      gap: 4,
    },
    statusBadge: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
      marginRight: 4,
      marginBottom: 4,
    },
    statusBadgeText: {
      fontSize: 10,
      color: theme.colors.surface,
      fontWeight: "bold",
    },
  });
