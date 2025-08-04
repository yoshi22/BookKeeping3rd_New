/**
 * 問題文表示コンポーネント
 * Step 2.1.5: 問題文・解説表示コンポーネント実装
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

interface QuestionTextProps {
  questionText: string;
  questionId?: string;
  difficulty?: number;
  showDifficulty?: boolean;
}

export default function QuestionText({
  questionText,
  questionId,
  difficulty,
  showDifficulty = true,
}: QuestionTextProps) {
  
  // 改行や特殊文字を適切に表示するためのフォーマット
  const formatQuestionText = (text: string): string => {
    return text
      .replace(/\\n/g, '\n') // エスケープされた改行を実際の改行に変換
      .trim();
  };

  // 難易度に応じたスタイルを取得
  const getDifficultyStyle = (level: number) => {
    switch (level) {
      case 1:
        return { color: '#4caf50', text: '基礎' }; // 緑
      case 2:
        return { color: '#ff9800', text: '標準' }; // オレンジ
      case 3:
        return { color: '#f44336', text: '応用' }; // 赤
      case 4:
        return { color: '#9c27b0', text: '発展' }; // 紫
      case 5:
        return { color: '#e91e63', text: '最高' }; // ピンク
      default:
        return { color: '#757575', text: '不明' }; // グレー
    }
  };

  const difficultyInfo = difficulty ? getDifficultyStyle(difficulty) : null;

  return (
    <View style={styles.container}>
      {/* 問題ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.title}>問題</Text>
        {questionId && (
          <Text style={styles.questionId}>{questionId}</Text>
        )}
        {showDifficulty && difficultyInfo && (
          <View style={styles.difficultyContainer}>
            <Text style={[styles.difficultyText, { color: difficultyInfo.color }]}>
              {difficultyInfo.text}
            </Text>
          </View>
        )}
      </View>

      {/* 問題文 */}
      <ScrollView 
        style={styles.textContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.questionText}>
          {formatQuestionText(questionText)}
        </Text>
      </ScrollView>
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
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  questionId: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
  },
  difficultyContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  textContainer: {
    maxHeight: 300, // 長い問題文の場合はスクロール可能
  },
  questionText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#333',
    padding: 20,
    textAlign: 'left',
  },
});