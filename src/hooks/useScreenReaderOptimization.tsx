/**
 * スクリーンリーダー最適化フック（Phase 4）
 * VoiceOver・TalkBack・NVDA対応・構造化ナビゲーション・コンテキスト情報提供
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Platform } from "react-native";
import { useAccessibility } from "./useAccessibility";

export interface ScreenReaderElement {
  id: string;
  label: string;
  role?: string;
  hint?: string;
  value?: string;
  state?: Record<string, boolean>;
  level?: number; // ヘッダーレベル（h1=1, h2=2, etc.）
  position?: { index: number; total: number }; // リスト内位置
  parent?: string; // 親要素ID
  children?: string[]; // 子要素IDs
}

export interface ScreenReaderContext {
  screenTitle: string;
  section: string;
  subsection?: string;
  totalItems?: number;
  currentItem?: number;
  mode: "learning" | "review" | "exam" | "navigation" | "form";
  questionType?: "journal" | "ledger" | "trial_balance";
  progress?: {
    current: number;
    total: number;
    percentage: number;
  };
}

export interface AnnouncementOptions {
  priority: "low" | "medium" | "high" | "assertive";
  interrupt?: boolean;
  delay?: number;
  context?: boolean;
}

export function useScreenReaderOptimization() {
  const { isScreenReaderEnabled, isVoiceOverRunning } = useAccessibility();

  const elementsRef = useRef<Map<string, ScreenReaderElement>>(new Map());
  const contextRef = useRef<ScreenReaderContext | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const lastAnnouncementRef = useRef<string>("");

  // スクリーンリーダー要素の登録
  const registerElement = useCallback((element: ScreenReaderElement) => {
    elementsRef.current.set(element.id, element);
  }, []);

  // スクリーンリーダー要素の削除
  const unregisterElement = useCallback((elementId: string) => {
    elementsRef.current.delete(elementId);
  }, []);

  // コンテキスト情報の設定
  const setContext = useCallback((context: ScreenReaderContext) => {
    contextRef.current = context;
  }, []);

  // 構造化されたアナウンス
  const announceWithContext = useCallback(
    (
      message: string,
      options: AnnouncementOptions = { priority: "medium" },
    ) => {
      if (!isScreenReaderEnabled) return;

      const {
        priority = "medium",
        interrupt = false,
        delay = 0,
        context = true,
      } = options;

      let fullMessage = message;

      // コンテキスト情報を含める
      if (context && contextRef.current) {
        const ctx = contextRef.current;
        const contextParts = [];

        // 画面情報
        if (ctx.screenTitle) {
          contextParts.push(`画面: ${ctx.screenTitle}`);
        }

        // セクション情報
        if (ctx.section) {
          contextParts.push(`セクション: ${ctx.section}`);
        }

        // 進捗情報
        if (ctx.progress) {
          const { current, total, percentage } = ctx.progress;
          contextParts.push(`進捗: ${current}/${total} (${percentage}%)`);
        }

        // 現在位置情報
        if (ctx.currentItem && ctx.totalItems) {
          contextParts.push(`${ctx.currentItem}件目 / 全${ctx.totalItems}件`);
        }

        if (contextParts.length > 0) {
          fullMessage = `${contextParts.join(", ")}. ${message}`;
        }
      }

      // 重複アナウンスの防止
      if (fullMessage === lastAnnouncementRef.current && !interrupt) {
        return;
      }
      lastAnnouncementRef.current = fullMessage;

      const announceWithDelay = () => {
        try {
          if (Platform.OS === "ios") {
            // iOS VoiceOver対応
            AccessibilityInfo.announceForAccessibility(fullMessage);
          } else {
            // Android TalkBack対応
            AccessibilityInfo.announceForAccessibility(fullMessage);
          }
        } catch (error) {
          console.warn("[ScreenReader] アナウンスエラー:", error);
        }
      };

      if (delay > 0) {
        setTimeout(announceWithDelay, delay);
      } else {
        announceWithDelay();
      }
    },
    [isScreenReaderEnabled],
  );

  // 簿記問題専用のアナウンス
  const announceCBTQuestion = useCallback(
    (
      questionType: "journal" | "ledger" | "trial_balance",
      questionNumber: number,
      totalQuestions: number,
      difficulty: number,
    ) => {
      const typeNames = {
        journal: "仕訳問題",
        ledger: "帳簿問題",
        trial_balance: "試算表問題",
      };

      const difficultyNames = {
        1: "基礎",
        2: "標準",
        3: "応用",
        4: "上級",
        5: "最上級",
      };

      const message = [
        `${typeNames[questionType]}`,
        `第${questionNumber}問`,
        `全${totalQuestions}問中`,
        `難易度: ${difficultyNames[difficulty] || difficulty}`,
        "フォームフィールドを使用して解答してください",
      ].join(", ");

      announceWithContext(message, {
        priority: "high",
        context: true,
      });
    },
    [announceWithContext],
  );

  // フォーム要素の詳細アナウンス
  const announceFormField = useCallback(
    (
      fieldType: "text" | "dropdown" | "number",
      label: string,
      value?: string,
      required = false,
      error?: string,
    ) => {
      const fieldTypeNames = {
        text: "テキスト入力",
        dropdown: "ドロップダウン選択",
        number: "数値入力",
      };

      const parts = [
        label,
        fieldTypeNames[fieldType],
        required ? "必須項目" : "任意項目",
      ];

      if (value) {
        parts.push(`現在の値: ${value}`);
      }

      if (error) {
        parts.push(`エラー: ${error}`);
      }

      const message = parts.join(", ");
      announceWithContext(message, { priority: "medium" });
    },
    [announceWithContext],
  );

  // ナビゲーション状態のアナウンス
  const announceNavigation = useCallback(
    (
      direction: "next" | "previous" | "first" | "last",
      itemType: "question" | "field" | "option" | "page",
      currentPosition?: { index: number; total: number },
    ) => {
      setIsNavigating(true);

      const directionNames = {
        next: "次の",
        previous: "前の",
        first: "最初の",
        last: "最後の",
      };

      const itemTypeNames = {
        question: "問題",
        field: "フィールド",
        option: "選択肢",
        page: "ページ",
      };

      let message = `${directionNames[direction]}${itemTypeNames[itemType]}`;

      if (currentPosition) {
        message += `, ${currentPosition.index}/${currentPosition.total}`;
      }

      announceWithContext(message, {
        priority: "medium",
        delay: 200, // ナビゲーション音の後に再生
      });

      // ナビゲーション状態をリセット
      setTimeout(() => setIsNavigating(false), 1000);
    },
    [announceWithContext],
  );

  // 解答結果のアナウンス
  const announceAnswerResult = useCallback(
    (
      isCorrect: boolean,
      score?: number,
      explanation?: string,
      nextAction?: string,
    ) => {
      const resultMessage = isCorrect ? "正解です" : "不正解です";
      const parts = [resultMessage];

      if (score !== undefined) {
        parts.push(`スコア: ${score}点`);
      }

      if (explanation) {
        parts.push(`解説: ${explanation}`);
      }

      if (nextAction) {
        parts.push(`次のアクション: ${nextAction}`);
      }

      announceWithContext(parts.join(". "), {
        priority: "high",
        interrupt: true,
      });
    },
    [announceWithContext],
  );

  // リスト要素のアナウンス
  const announceListItem = useCallback(
    (
      itemLabel: string,
      position: { index: number; total: number },
      itemType = "アイテム",
    ) => {
      const message = `${itemLabel}, ${itemType} ${position.index}/${position.total}`;
      announceWithContext(message, { priority: "medium" });
    },
    [announceWithContext],
  );

  // テーブル・グリッドのアナウンス
  const announceTableCell = useCallback(
    (
      content: string,
      position: {
        row: number;
        column: number;
        totalRows: number;
        totalColumns: number;
      },
      columnHeader?: string,
      rowHeader?: string,
    ) => {
      const parts = [content];

      if (columnHeader) {
        parts.push(`列: ${columnHeader}`);
      }

      if (rowHeader) {
        parts.push(`行: ${rowHeader}`);
      }

      parts.push(`位置: 行${position.row}, 列${position.column}`);
      parts.push(`全${position.totalRows}行 ${position.totalColumns}列`);

      announceWithContext(parts.join(", "), { priority: "medium" });
    },
    [announceWithContext],
  );

  // エラー・警告のアナウンス
  const announceError = useCallback(
    (
      message: string,
      severity: "warning" | "error" | "info" = "error",
      action?: string,
    ) => {
      const severityNames = {
        warning: "警告",
        error: "エラー",
        info: "情報",
      };

      const parts = [`${severityNames[severity]}: ${message}`];

      if (action) {
        parts.push(`対処方法: ${action}`);
      }

      announceWithContext(parts.join(". "), {
        priority: "assertive",
        interrupt: true,
      });
    },
    [announceWithContext],
  );

  // 進捗状況のアナウンス
  const announceProgress = useCallback(
    (current: number, total: number, description?: string) => {
      const percentage = Math.round((current / total) * 100);
      const parts = [`進捗: ${current}/${total}`];

      if (description) {
        parts.push(description);
      }

      parts.push(`${percentage}%完了`);

      announceWithContext(parts.join(", "), { priority: "medium" });
    },
    [announceWithContext],
  );

  // モーダル・ダイアログのアナウンス
  const announceModal = useCallback(
    (
      title: string,
      type: "dialog" | "alert" | "confirmation" = "dialog",
      content?: string,
    ) => {
      const typeNames = {
        dialog: "ダイアログ",
        alert: "アラート",
        confirmation: "確認ダイアログ",
      };

      const parts = [`${typeNames[type]}が開きました`, `タイトル: ${title}`];

      if (content) {
        parts.push(`内容: ${content}`);
      }

      parts.push("ESCキーで閉じることができます");

      announceWithContext(parts.join(". "), {
        priority: "high",
        interrupt: true,
      });
    },
    [announceWithContext],
  );

  // 画面変更のアナウンス
  const announceScreenChange = useCallback(
    (screenTitle: string, description?: string, landmarks?: string[]) => {
      const parts = [`画面が変わりました: ${screenTitle}`];

      if (description) {
        parts.push(description);
      }

      if (landmarks && landmarks.length > 0) {
        parts.push(`利用可能な要素: ${landmarks.join(", ")}`);
      }

      announceWithContext(parts.join(". "), {
        priority: "high",
        delay: 500, // 画面遷移アニメーション後
      });
    },
    [announceWithContext],
  );

  // キーボードショートカットのヘルプ
  const announceKeyboardHelp = useCallback(() => {
    const shortcuts = [
      "Tabキー: 次の要素に移動",
      "Shift+Tab: 前の要素に移動",
      "Enterキー: 選択または実行",
      "ESCキー: キャンセルまたは戻る",
      "矢印キー: オプション選択",
      "F1キー: ヘルプ表示",
    ];

    const message = `キーボードショートカット: ${shortcuts.join(", ")}`;
    announceWithContext(message, { priority: "medium" });
  }, [announceWithContext]);

  // スクリーンリーダー検出時の初期化
  useEffect(() => {
    if (isScreenReaderEnabled) {
      // スクリーンリーダーが有効な場合の初期アナウンス
      announceWithContext("スクリーンリーダーサポートが有効です", {
        priority: "medium",
        delay: 1000,
        context: false,
      });
    }
  }, [isScreenReaderEnabled, announceWithContext]);

  return {
    // 基本機能
    registerElement,
    unregisterElement,
    setContext,

    // アナウンス機能
    announceWithContext,
    announceCBTQuestion,
    announceFormField,
    announceNavigation,
    announceAnswerResult,
    announceListItem,
    announceTableCell,
    announceError,
    announceProgress,
    announceModal,
    announceScreenChange,
    announceKeyboardHelp,

    // 状態
    isNavigating,
    isScreenReaderEnabled,
    isVoiceOverRunning,

    // ユーティリティ
    context: contextRef.current,
    elements: elementsRef.current,
  };
}

/**
 * 簿記問題専用のスクリーンリーダー対応コンポーネント
 */
export interface CBTScreenReaderProps {
  questionType: "journal" | "ledger" | "trial_balance";
  questionNumber: number;
  totalQuestions: number;
  difficulty: number;
  children: React.ReactNode;
}

export function useCBTScreenReader({
  questionType,
  questionNumber,
  totalQuestions,
  difficulty,
}: Omit<CBTScreenReaderProps, "children">) {
  const {
    setContext,
    announceCBTQuestion,
    announceFormField,
    announceAnswerResult,
    isScreenReaderEnabled,
  } = useScreenReaderOptimization();

  // 問題コンテキストの設定
  useEffect(() => {
    if (isScreenReaderEnabled) {
      setContext({
        screenTitle: "簿記問題",
        section: "CBT形式問題",
        mode: "learning",
        questionType,
        progress: {
          current: questionNumber,
          total: totalQuestions,
          percentage: Math.round((questionNumber / totalQuestions) * 100),
        },
      });

      // 問題の詳細をアナウンス
      announceCBTQuestion(
        questionType,
        questionNumber,
        totalQuestions,
        difficulty,
      );
    }
  }, [
    questionType,
    questionNumber,
    totalQuestions,
    difficulty,
    setContext,
    announceCBTQuestion,
    isScreenReaderEnabled,
  ]);

  return {
    announceFormField,
    announceAnswerResult,
    isScreenReaderEnabled,
  };
}
