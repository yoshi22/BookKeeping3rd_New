/**
 * カテゴリ詳細画面（問題選択・フィルタリング）
 * 仕訳・帳簿・試算表の各カテゴリに対応した問題選択UI
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  FlatList,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Screen } from "../../../../src/components/layout/ResponsiveLayout";
import { QuestionRepository } from "../../../../src/data/repositories/question-repository";
import { LearningHistoryRepository } from "../../../../src/data/repositories/learning-history-repository";
import type {
  Question,
  QuestionCategory,
  QuestionDifficulty,
} from "../../../../src/types/models";

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
  const [showFilters, setShowFilters] = useState(false);

  // カテゴリ情報の定義
  const categoryConfig = {
    journal: {
      id: "journal" as QuestionCategory,
      name: "第1問",
      subtitle: "仕訳問題",
      description: "基本的な仕訳から応用仕訳まで",
      icon: "📝",
      color: "#4CAF50",
      points: "45点",
      examInfo: "本試験: 15問 • 15-20分",
    },
    ledger: {
      id: "ledger" as QuestionCategory,
      name: "第2問",
      subtitle: "補助簿・勘定記入・伝票",
      description: "帳簿記入と勘定の理解",
      icon: "📋",
      color: "#FF9800",
      points: "20点",
      examInfo: "本試験: 2問 • 15-20分",
    },
    trial_balance: {
      id: "trial_balance" as QuestionCategory,
      name: "第3問",
      subtitle: "決算書作成",
      description: "財務諸表・精算表・試算表の作成",
      icon: "📊",
      color: "#2196F3",
      points: "35点",
      examInfo: "本試験: 1問 • 25-30分",
    },
    financial_statement: {
      id: "financial_statement" as QuestionCategory,
      name: "財務諸表",
      subtitle: "財務諸表作成問題",
      description: "貸借対照表・損益計算書の作成",
      icon: "📈",
      color: "#9c27b0",
      points: "35点",
      examInfo: "財務諸表作成問題",
    },
  };

  const currentCategory =
    categoryConfig[categoryId as QuestionCategory] || categoryConfig.journal;

  // 難易度オプションの定義 (problemsStrategy.md準拠: 3分類)
  const difficultyOptions = [
    {
      level: 1 as QuestionDifficulty,
      name: "基礎",
      description: "基本的な問題・基礎レベル",
      color: "#4CAF50",
      icon: "⭐",
    },
    {
      level: 2 as QuestionDifficulty,
      name: "標準",
      description: "標準的な問題・中級レベル",
      color: "#FF9800",
      icon: "⭐⭐",
    },
    {
      level: 3 as QuestionDifficulty,
      name: "応用",
      description: "応用問題・上級レベル",
      color: "#F44336",
      icon: "⭐⭐⭐",
    },
  ];

  // 問題タイプオプションの定義 (problemsStrategy.md完全準拠)
  const questionTypeOptions: Record<
    QuestionCategory,
    Array<{ type: string; name: string; icon: string; count: number }>
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
        console.log(
          `[CategoryDetail] カテゴリ ${categoryId} のデータ読み込み開始`,
        );

        // 問題データを読み込む（problemsStrategy順序を使用）
        const questionRepository = new QuestionRepository();
        const categoryQuestions = await questionRepository.findByCategory(
          categoryId as QuestionCategory,
          { useProblemsStrategyOrder: true },
        );

        console.log(
          `[CategoryDetail] ${categoryQuestions.length}問の問題を取得`,
        );
        setQuestions(categoryQuestions);
        setFilteredQuestions(categoryQuestions);

        // 学習統計を読み込む
        await loadLearningStats();
      } catch (error) {
        console.error("[CategoryDetail] データ読み込みエラー:", error);
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
      color: "#4CAF50",
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
      color: "#FF9800",
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
      color: "#2196F3",
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
      console.error("学習統計の読み込みに失敗:", error);
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

  // 問題から類型を推測する関数 (排他的分類・problemsStrategy.md準拠)
  const getQuestionTypeFromQuestion = (question: Question): string[] => {
    try {
      if (categoryId === "journal") {
        // problemsStrategy.md準拠のバランス調整分類（排他的ID指定）
        const questionId = question.id;

        // 現金・預金取引 (42問)
        if (
          [
            "Q_J_066",
            "Q_J_067",
            "Q_J_068",
            "Q_J_069",
            "Q_J_070",
            "Q_J_071",
            "Q_J_072",
            "Q_J_073",
            "Q_J_074",
            "Q_J_075",
            "Q_J_076",
            "Q_J_077",
            "Q_J_078",
            "Q_J_079",
            "Q_J_080",
            "Q_J_081",
            "Q_J_082",
            "Q_J_083",
            "Q_J_084",
            "Q_J_085",
            "Q_J_086",
            "Q_J_087",
            "Q_J_088",
            "Q_J_089",
            "Q_J_090",
            "Q_J_091",
            "Q_J_092",
            "Q_J_093",
            "Q_J_094",
            "Q_J_095",
            "Q_J_096",
            "Q_J_097",
            "Q_J_098",
            "Q_J_099",
            "Q_J_100",
            "Q_J_101",
            "Q_J_102",
            "Q_J_103",
            "Q_J_104",
            "Q_J_105",
            "Q_J_017",
            "Q_J_018",
          ].includes(questionId)
        ) {
          return ["cash_deposit"];
        }

        // 商品売買取引 (45問)
        if (
          [
            "Q_J_016",
            "Q_J_019",
            "Q_J_022",
            "Q_J_025",
            "Q_J_028",
            "Q_J_031",
            "Q_J_034",
            "Q_J_037",
            "Q_J_040",
            "Q_J_043",
            "Q_J_046",
            "Q_J_049",
            "Q_J_052",
            "Q_J_055",
            "Q_J_058",
            "Q_J_061",
            "Q_J_064",
            "Q_J_020",
            "Q_J_021",
            "Q_J_023",
            "Q_J_024",
            "Q_J_026",
            "Q_J_027",
            "Q_J_029",
            "Q_J_030",
            "Q_J_032",
            "Q_J_033",
            "Q_J_035",
            "Q_J_036",
            "Q_J_038",
            "Q_J_039",
            "Q_J_041",
            "Q_J_042",
            "Q_J_044",
            "Q_J_045",
            "Q_J_047",
            "Q_J_048",
            "Q_J_050",
            "Q_J_051",
            "Q_J_053",
            "Q_J_054",
            "Q_J_056",
            "Q_J_057",
            "Q_J_059",
            "Q_J_060",
          ].includes(questionId)
        ) {
          return ["sales_purchase"];
        }

        // 債権・債務 (41問)
        if (
          [
            "Q_J_136",
            "Q_J_137",
            "Q_J_138",
            "Q_J_139",
            "Q_J_140",
            "Q_J_141",
            "Q_J_142",
            "Q_J_143",
            "Q_J_144",
            "Q_J_145",
            "Q_J_146",
            "Q_J_147",
            "Q_J_148",
            "Q_J_149",
            "Q_J_150",
            "Q_J_151",
            "Q_J_152",
            "Q_J_153",
            "Q_J_154",
            "Q_J_155",
            "Q_J_156",
            "Q_J_157",
            "Q_J_158",
            "Q_J_159",
            "Q_J_160",
            "Q_J_106",
            "Q_J_107",
            "Q_J_108",
            "Q_J_109",
            "Q_J_110",
            "Q_J_111",
            "Q_J_112",
            "Q_J_113",
            "Q_J_114",
            "Q_J_115",
            "Q_J_116",
            "Q_J_117",
            "Q_J_118",
            "Q_J_119",
            "Q_J_120",
            "Q_J_121",
          ].includes(questionId)
        ) {
          return ["receivable_payable"];
        }

        // 給与・税金 (42問)
        if (
          [
            "Q_J_243",
            "Q_J_246",
            "Q_J_249",
            "Q_J_062",
            "Q_J_063",
            "Q_J_065",
            "Q_J_122",
            "Q_J_123",
            "Q_J_124",
            "Q_J_125",
            "Q_J_126",
            "Q_J_127",
            "Q_J_128",
            "Q_J_129",
            "Q_J_130",
            "Q_J_131",
            "Q_J_132",
            "Q_J_133",
            "Q_J_134",
            "Q_J_135",
            "Q_J_161",
            "Q_J_162",
            "Q_J_163",
            "Q_J_164",
            "Q_J_165",
            "Q_J_166",
            "Q_J_167",
            "Q_J_168",
            "Q_J_169",
            "Q_J_170",
            "Q_J_171",
            "Q_J_172",
            "Q_J_173",
            "Q_J_174",
            "Q_J_175",
            "Q_J_176",
            "Q_J_177",
            "Q_J_178",
            "Q_J_179",
            "Q_J_180",
            "Q_J_181",
            "Q_J_182",
          ].includes(questionId)
        ) {
          return ["salary_tax"];
        }

        // 固定資産 (40問)
        if (
          [
            "Q_J_183",
            "Q_J_184",
            "Q_J_185",
            "Q_J_186",
            "Q_J_187",
            "Q_J_188",
            "Q_J_189",
            "Q_J_190",
            "Q_J_191",
            "Q_J_192",
            "Q_J_193",
            "Q_J_194",
            "Q_J_195",
            "Q_J_241",
            "Q_J_244",
            "Q_J_247",
            "Q_J_250",
            "Q_J_196",
            "Q_J_197",
            "Q_J_198",
            "Q_J_199",
            "Q_J_200",
            "Q_J_201",
            "Q_J_202",
            "Q_J_203",
            "Q_J_204",
            "Q_J_205",
            "Q_J_206",
            "Q_J_207",
            "Q_J_208",
            "Q_J_209",
            "Q_J_210",
            "Q_J_211",
            "Q_J_212",
            "Q_J_213",
            "Q_J_214",
            "Q_J_215",
            "Q_J_216",
            "Q_J_217",
            "Q_J_218",
          ].includes(questionId)
        ) {
          return ["fixed_asset"];
        }

        // 決算整理 (25問) - 残りの問題
        if (
          [
            "Q_J_219",
            "Q_J_220",
            "Q_J_221",
            "Q_J_222",
            "Q_J_223",
            "Q_J_224",
            "Q_J_225",
            "Q_J_226",
            "Q_J_227",
            "Q_J_228",
            "Q_J_229",
            "Q_J_230",
            "Q_J_231",
            "Q_J_232",
            "Q_J_233",
            "Q_J_234",
            "Q_J_235",
            "Q_J_236",
            "Q_J_237",
            "Q_J_238",
            "Q_J_239",
            "Q_J_240",
            "Q_J_242",
            "Q_J_245",
            "Q_J_248",
          ].includes(questionId)
        ) {
          return ["adjustment"];
        }
      } else if (categoryId === "ledger") {
        const questionId = question.id;

        // パターン1: 勘定記入問題 (10問)
        if (
          [
            "Q_L_001",
            "Q_L_002",
            "Q_L_003",
            "Q_L_004",
            "Q_L_005",
            "Q_L_006",
            "Q_L_007",
            "Q_L_008",
            "Q_L_009",
            "Q_L_010",
          ].includes(questionId)
        ) {
          return ["account_entry"];
        }

        // パターン2: 補助簿記入問題 (10問)
        if (
          [
            "Q_L_011",
            "Q_L_012",
            "Q_L_013",
            "Q_L_014",
            "Q_L_015",
            "Q_L_016",
            "Q_L_017",
            "Q_L_018",
            "Q_L_019",
            "Q_L_020",
          ].includes(questionId)
        ) {
          return ["subsidiary_books"];
        }

        // パターン3: 伝票記入問題 (10問)
        if (
          [
            "Q_L_021",
            "Q_L_022",
            "Q_L_023",
            "Q_L_024",
            "Q_L_025",
            "Q_L_026",
            "Q_L_027",
            "Q_L_028",
            "Q_L_029",
            "Q_L_030",
          ].includes(questionId)
        ) {
          return ["voucher_entry"];
        }

        // パターン4: 理論・選択問題 (10問)
        if (
          [
            "Q_L_031",
            "Q_L_032",
            "Q_L_033",
            "Q_L_034",
            "Q_L_035",
            "Q_L_036",
            "Q_L_037",
            "Q_L_038",
            "Q_L_039",
            "Q_L_040",
            "Q_L_041",
            "Q_L_042",
          ].includes(questionId)
        ) {
          return ["theory_selection"];
        }

        return ["theory_selection"]; // デフォルト
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

  const toggleDifficultyFilter = (difficulty: QuestionDifficulty) => {
    const newDifficulties = filters.difficulties.includes(difficulty)
      ? filters.difficulties.filter((d) => d !== difficulty)
      : [...filters.difficulties, difficulty];
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
        return "#4CAF50"; // 基礎 - 緑
      case 2:
        return "#FF9800"; // 標準 - オレンジ
      case 3:
        return "#F44336"; // 応用 - 赤
      default:
        return "#757575"; // その他 - グレー
    }
  };

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return "基礎";
      case 2:
        return "標準";
      case 3:
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
      console.error("タグ解析エラー:", e);
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
            const isSelected = filters.difficulties.includes(option.level);
            const levelQuestions = questions.filter(
              (q) => q.difficulty === option.level,
            );

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.difficultyCard,
                  {
                    borderColor: option.color,
                    backgroundColor: isSelected ? option.color : "white",
                  },
                ]}
                onPress={() => toggleDifficultyFilter(option.level)}
              >
                <Text
                  style={[
                    styles.difficultyName,
                    { color: isSelected ? "white" : option.color },
                  ]}
                >
                  {option.name}
                  {isSelected && " ✓"}
                </Text>
                <Text
                  style={[
                    styles.difficultyCount,
                    { color: isSelected ? "white" : "#666" },
                  ]}
                >
                  {levelQuestions.length}問
                </Text>
                <Text
                  style={[
                    styles.difficultyDescription,
                    { color: isSelected ? "white" : "#999" },
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
                    borderColor: isSelected ? "#2196F3" : "#ddd",
                    backgroundColor: isSelected ? "#2196F3" : "white",
                  },
                ]}
                onPress={() => toggleQuestionTypeFilter(option.type)}
              >
                <Text
                  style={[
                    styles.questionTypeName,
                    { color: isSelected ? "white" : "#333" },
                  ]}
                >
                  {option.name}
                  {isSelected && " ✓"}
                </Text>
                <Text
                  style={[
                    styles.questionTypeCount,
                    { color: isSelected ? "white" : "#666" },
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
              color: "#757575",
            },
            {
              status: "unstudied" as const,
              name: "未学習",
              description: "まだ解いたことのない問題",
              icon: "🆕",
              color: "#4CAF50",
            },
            {
              status: "incorrect" as const,
              name: "間違い経験",
              description: "過去に間違えた問題",
              icon: "❌",
              color: "#F44336",
            },
            {
              status: "recent_incorrect" as const,
              name: "弱点克服",
              description: "間違いが多い問題順",
              icon: "🔥",
              color: "#FF5722",
            },
            {
              status: "needs_review" as const,
              name: "復習推奨",
              description: "間違いがあり最近解いていない",
              icon: "🔄",
              color: "#FF9800",
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
                    backgroundColor: isSelected ? option.color : "white",
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
                    { color: isSelected ? "white" : option.color },
                  ]}
                >
                  {option.name}
                  {isSelected && " ✓"}
                </Text>
                <Text
                  style={[
                    styles.statusCount,
                    { color: isSelected ? "white" : "#666" },
                  ]}
                >
                  {statusQuestions}問
                </Text>
                <Text
                  style={[
                    styles.statusDescription,
                    { color: isSelected ? "white" : "#999" },
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
            { backgroundColor: filters.excludeRecent ? "#2196F3" : "white" },
          ]}
          onPress={() =>
            setFilters({ ...filters, excludeRecent: !filters.excludeRecent })
          }
        >
          <Text
            style={[
              styles.excludeRecentText,
              { color: filters.excludeRecent ? "white" : "#333" },
            ]}
          >
            🕒 最近解いた問題を除外する (7日以内)
            {filters.excludeRecent && " ✓"}
          </Text>
          <Text
            style={[
              styles.excludeRecentCount,
              { color: filters.excludeRecent ? "white" : "#666" },
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
                    style={[styles.statusBadge, { backgroundColor: "#4CAF50" }]}
                  >
                    <Text style={styles.statusBadgeText}>未学習</Text>
                  </View>
                )}
                {learningStats.incorrectQuestions.has(question.id) && (
                  <View
                    style={[styles.statusBadge, { backgroundColor: "#F44336" }]}
                  >
                    <Text style={styles.statusBadgeText}>
                      間違い{learningStats.incorrectQuestions.get(question.id)}
                      回
                    </Text>
                  </View>
                )}
                {learningStats.recentQuestions.has(question.id) && (
                  <View
                    style={[styles.statusBadge, { backgroundColor: "#FF9800" }]}
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
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
    color: "white",
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
    color: "white",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "white",
    opacity: 0.9,
    marginBottom: 10,
  },
  questionCount: {
    fontSize: 14,
    color: "white",
    opacity: 0.8,
  },
  examInfo: {
    fontSize: 13,
    color: "white",
    opacity: 0.9,
    marginTop: 5,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
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
    borderColor: "#2196F3",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
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
    color: "#666",
    marginBottom: 5,
  },
  showAllButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  showAllButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  questionCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  questionId: {
    fontSize: 12,
    color: "#666",
    fontWeight: "bold",
  },
  questionTitle: {
    fontSize: 14,
    color: "#333",
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
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  tagText: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    color: "white",
    fontWeight: "bold",
  },
  questionText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  showMoreButton: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  showMoreText: {
    fontSize: 14,
    color: "#666",
  },
  noQuestionsContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 30,
    margin: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  noQuestionsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  noQuestionsSubtext: {
    fontSize: 14,
    color: "#999",
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
    color: "white",
    fontWeight: "bold",
  },
});
