/**
 * 問題ナビゲーションコンポーネント
 * Step 2.1.6: カテゴリ選択・問題ナビゲーション機能実装
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface QuestionNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  categoryName: string;
  onPrevious: () => void;
  onNext: () => void;
  onQuestionSelect?: (index: number) => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  showQuestionNumbers?: boolean;
}

export default function QuestionNavigation({
  currentQuestionIndex,
  totalQuestions,
  categoryName,
  onPrevious,
  onNext,
  onQuestionSelect,
  canGoPrevious = true,
  canGoNext = true,
  showQuestionNumbers = false,
}: QuestionNavigationProps) {

  // 進捗率の計算
  const progressPercentage = totalQuestions > 0 
    ? ((currentQuestionIndex + 1) / totalQuestions) * 100 
    : 0;

  // 問題番号リストの生成（表示する場合）
  const renderQuestionNumbers = () => {
    if (!showQuestionNumbers || !onQuestionSelect) return null;

    const numbers = [];
    for (let i = 0; i < totalQuestions; i++) {
      numbers.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.questionNumber,
            i === currentQuestionIndex && styles.questionNumberActive,
          ]}
          onPress={() => onQuestionSelect(i)}
        >
          <Text style={[
            styles.questionNumberText,
            i === currentQuestionIndex && styles.questionNumberTextActive,
          ]}>
            {i + 1}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.questionNumbersContainer}>
        <Text style={styles.questionNumbersTitle}>問題選択:</Text>
        <View style={styles.questionNumbers}>
          {numbers}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* ヘッダー情報 */}
      <View style={styles.header}>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{categoryName}</Text>
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1} / {totalQuestions}
          </Text>
        </View>
        <Text style={styles.progressPercentage}>
          {Math.round(progressPercentage)}%
        </Text>
      </View>

      {/* 進捗バー */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill,
              { width: `${progressPercentage}%` }
            ]} 
          />
        </View>
      </View>

      {/* ナビゲーションボタン */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={[
            styles.navButton,
            styles.prevButton,
            !canGoPrevious && styles.navButtonDisabled,
          ]}
          onPress={onPrevious}
          disabled={!canGoPrevious}
        >
          <Text style={[
            styles.navButtonText,
            !canGoPrevious && styles.navButtonTextDisabled,
          ]}>
            ← 前の問題
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            styles.nextButton,
            !canGoNext && styles.navButtonDisabled,
          ]}
          onPress={onNext}
          disabled={!canGoNext}
        >
          <Text style={[
            styles.navButtonText,
            !canGoNext && styles.navButtonTextDisabled,
          ]}>
            次の問題 →
          </Text>
        </TouchableOpacity>
      </View>

      {/* 問題番号選択（オプション） */}
      {renderQuestionNumbers()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2f95dc',
  },
  progressBarContainer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2f95dc',
    borderRadius: 4,
  },
  navigationButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  navButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  prevButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  nextButton: {
    backgroundColor: '#2f95dc',
  },
  navButtonDisabled: {
    backgroundColor: '#f0f0f0',
    borderColor: '#e0e0e0',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  navButtonTextDisabled: {
    color: '#ccc',
  },
  questionNumbersContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  questionNumbersTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  questionNumbers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  questionNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionNumberActive: {
    backgroundColor: '#2f95dc',
    borderColor: '#2f95dc',
  },
  questionNumberText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  questionNumberTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
});