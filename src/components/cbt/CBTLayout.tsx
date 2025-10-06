/**
 * CBTレイアウト統合コンポーネント
 * ヘッダー、メモパネル、メインコンテンツを統合したCBT準拠レイアウト
 * Phase C: Q2/Q3 CBT UI改善の統合レイアウト
 */

import React, { useState, ReactNode } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { CBTHeader } from "./CBTHeader";
import { CBTMemoPanel } from "./CBTMemoPanel";

interface CBTLayoutProps {
  // ヘッダー設定
  sectionNumber: 1 | 2 | 3;
  questionIndex: number;
  totalQuestions: number;
  timeRemaining?: number;
  isMarked?: boolean;
  onBackPress: () => void;
  onMarkToggle?: () => void;
  onTimeUp?: () => void;

  // メインコンテンツ
  children: ReactNode;

  // メモ機能設定
  enableMemo?: boolean;
  initialMemo?: string;
  onMemoChange?: (memo: string) => void;

  // レイアウト設定
  showHeader?: boolean;
  backgroundColor?: string;
  contentPadding?: number;

  // テストID
  testID?: string;
}

export const CBTLayout: React.FC<CBTLayoutProps> = ({
  sectionNumber,
  questionIndex,
  totalQuestions,
  timeRemaining = 0,
  isMarked = false,
  onBackPress,
  onMarkToggle = () => {},
  onTimeUp,
  children,
  enableMemo = true,
  initialMemo = "",
  onMemoChange,
  showHeader = true,
  backgroundColor = "#FFFFFF",
  contentPadding = 16,
  testID = "cbt-layout",
}) => {
  const [memoVisible, setMemoVisible] = useState(false);

  const toggleMemo = () => {
    setMemoVisible(!memoVisible);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      testID={testID}
    >
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* CBTヘッダー */}
        {showHeader && (
          <CBTHeader
            sectionNumber={sectionNumber}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            timeRemaining={timeRemaining}
            isMarked={isMarked}
            onBackPress={onBackPress}
            onMarkToggle={onMarkToggle}
            onTimeUp={onTimeUp}
          />
        )}

        {/* メインコンテンツエリア */}
        <View
          style={[
            styles.contentArea,
            {
              paddingHorizontal: contentPadding,
              paddingTop: contentPadding,
              paddingBottom: enableMemo ? contentPadding + 60 : contentPadding, // メモボタン分の余白
            },
          ]}
          testID={`${testID}-content`}
        >
          {children}
        </View>

        {/* CBTメモパネル */}
        {enableMemo && (
          <CBTMemoPanel
            isVisible={memoVisible}
            onToggleVisibility={toggleMemo}
            initialMemo={initialMemo}
            onMemoChange={onMemoChange}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  contentArea: {
    flex: 1,
  },
});

// CBTレイアウト用のコンテキスト
export interface CBTLayoutContext {
  sectionNumber: number;
  questionIndex: number;
  totalQuestions: number;
  isTimedSession: boolean;
  timeRemaining: number;
  isMarked: boolean;
  toggleMark: () => void;
  memo: string;
  updateMemo: (memo: string) => void;
}

// CBTレイアウトのプリセット設定
export const CBTLayoutPresets = {
  // 模試モード（時間制限付き）
  mockExam: {
    showHeader: true,
    enableMemo: true,
    backgroundColor: "#F8F9FA",
    contentPadding: 20,
  },

  // 学習モード（時間制限なし）
  learning: {
    showHeader: true,
    enableMemo: true,
    backgroundColor: "#FFFFFF",
    contentPadding: 16,
  },

  // 復習モード（シンプル）
  review: {
    showHeader: true,
    enableMemo: false,
    backgroundColor: "#FFFFFF",
    contentPadding: 16,
  },

  // フルスクリーンモード（ヘッダーなし）
  fullscreen: {
    showHeader: false,
    enableMemo: false,
    backgroundColor: "#FFFFFF",
    contentPadding: 0,
  },
} as const;

export type CBTLayoutPresetType = keyof typeof CBTLayoutPresets;
