/**
 * 最適化版問題ナビゲーションコンポーネント
 * Step 2.1.7: パフォーマンス最適化実装例
 */

import React, { memo, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
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

// 問題番号アイテムコンポーネント（memo化で最適化）
const QuestionNumberItem = memo<{
  index: number;
  isActive: boolean;
  onPress: (index: number) => void;
}>(({ index, isActive, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(index);
  }, [index, onPress]);

  return (
    <TouchableOpacity
      style={[
        styles.questionNumber,
        isActive && styles.questionNumberActive,
      ]}
      onPress={handlePress}
    >
      <Text style={[
        styles.questionNumberText,
        isActive && styles.questionNumberTextActive,
      ]}>
        {index + 1}
      </Text>
    </TouchableOpacity>
  );
});

QuestionNumberItem.displayName = 'QuestionNumberItem';

// メインコンポーネント（memo化で最適化）
const QuestionNavigation = memo<QuestionNavigationProps>(({
  currentQuestionIndex,
  totalQuestions,
  categoryName,
  onPrevious,
  onNext,
  onQuestionSelect,
  canGoPrevious = true,
  canGoNext = true,
  showQuestionNumbers = false,
}) => {

  // 進捗率の計算（useMemoで最適化）
  const progressPercentage = useMemo(() => {
    return totalQuestions > 0 
      ? ((currentQuestionIndex + 1) / totalQuestions) * 100 
      : 0;
  }, [currentQuestionIndex, totalQuestions]);

  // 問題番号データの生成（useMemoで最適化）
  const questionNumberData = useMemo(() => {
    if (!showQuestionNumbers || !onQuestionSelect) return [];
    
    return Array.from({ length: totalQuestions }, (_, index) => ({
      id: index.toString(),
      index,
      isActive: index === currentQuestionIndex,
    }));
  }, [totalQuestions, currentQuestionIndex, showQuestionNumbers, onQuestionSelect]);

  // 問題番号選択ハンドラー（useCallbackで最適化）
  const handleQuestionSelect = useCallback((index: number) => {
    onQuestionSelect?.(index);
  }, [onQuestionSelect]);

  // FlatListの項目レンダリング（useCallbackで最適化）
  const renderQuestionNumber = useCallback(({ item }: { item: any }) => (
    <QuestionNumberItem
      index={item.index}
      isActive={item.isActive}
      onPress={handleQuestionSelect}
    />
  ), [handleQuestionSelect]);

  // FlatListのキー抽出（useCallbackで最適化）
  const keyExtractor = useCallback((item: any) => item.id, []);

  // ナビゲーションボタンのスタイル（useMemoで最適化）
  const prevButtonStyle = useMemo(() => [
    styles.navButton,
    styles.prevButton,
    !canGoPrevious && styles.navButtonDisabled,
  ], [canGoPrevious]);

  const nextButtonStyle = useMemo(() => [
    styles.navButton,
    styles.nextButton,
    !canGoNext && styles.navButtonDisabled,
  ], [canGoNext]);

  const prevButtonTextStyle = useMemo(() => [
    styles.navButtonText,
    !canGoPrevious && styles.navButtonTextDisabled,
  ], [canGoPrevious]);

  const nextButtonTextStyle = useMemo(() => [
    styles.navButtonText,
    !canGoNext && styles.navButtonTextDisabled,
  ], [canGoNext]);

  // 進捗バーのスタイル（useMemoで最適化）
  const progressBarFillStyle = useMemo(() => [
    styles.progressBarFill,
    { width: `${progressPercentage}%` }
  ], [progressPercentage]);

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
          <View style={progressBarFillStyle} />
        </View>
      </View>

      {/* ナビゲーションボタン */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={prevButtonStyle}
          onPress={onPrevious}
          disabled={!canGoPrevious}
        >
          <Text style={prevButtonTextStyle}>
            ← 前の問題
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={nextButtonStyle}
          onPress={onNext}
          disabled={!canGoNext}
        >
          <Text style={nextButtonTextStyle}>
            次の問題 →
          </Text>
        </TouchableOpacity>
      </View>

      {/* 問題番号選択（FlatListで仮想化） */}
      {showQuestionNumbers && onQuestionSelect && (
        <View style={styles.questionNumbersContainer}>
          <Text style={styles.questionNumbersTitle}>問題選択:</Text>
          <FlatList
            data={questionNumberData}
            renderItem={renderQuestionNumber}
            keyExtractor={keyExtractor}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.questionNumbers}
            getItemLayout={(data, index) => ({
              length: 44, // questionNumber width + margin
              offset: 44 * index,
              index,
            })}
            initialNumToRender={10}
            maxToRenderPerBatch={5}
            windowSize={10}
            removeClippedSubviews={true}
          />
        </View>
      )}
    </View>
  );
});

QuestionNavigation.displayName = 'QuestionNavigation';

export default QuestionNavigation;

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
    color: '#333',
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
    gap: 8,
    paddingHorizontal: 4,
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