/**
 * 解答結果ダイアログコンポーネント
 * Step 2.2: 解説表示機能実装
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SubmitAnswerResponse } from '../services/answer-service';
import ExplanationPanel from './ExplanationPanel';

interface AnswerResultDialogProps {
  visible: boolean;
  result: SubmitAnswerResponse | null;
  onClose: () => void;
  onNextQuestion?: () => void;
  onReviewQuestion?: () => void;
  showNextButton?: boolean;
  showReviewButton?: boolean;
}

export default function AnswerResultDialog({
  visible,
  result,
  onClose,
  onNextQuestion,
  onReviewQuestion,
  showNextButton = true,
  showReviewButton = true,
}: AnswerResultDialogProps) {
  
  if (!result) return null;

  const formatAnswerTime = (timeMs: number): string => {
    const seconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}分${remainingSeconds}秒`;
    }
    return `${remainingSeconds}秒`;
  };

  const formatCorrectAnswer = (correctAnswer: any): Record<string, any> => {
    if (correctAnswer.journalEntry) {
      return {
        '借方勘定科目': correctAnswer.journalEntry.debit_account,
        '借方金額': correctAnswer.journalEntry.debit_amount?.toLocaleString(),
        '貸方勘定科目': correctAnswer.journalEntry.credit_account,
        '貸方金額': correctAnswer.journalEntry.credit_amount?.toLocaleString(),
      };
    }
    
    if (correctAnswer.ledgerEntry) {
      const formatted: Record<string, any> = {};
      correctAnswer.ledgerEntry.entries?.forEach((entry: any, index: number) => {
        if (entry.account) formatted[`勘定科目${index + 1}`] = entry.account;
        if (entry.amount) formatted[`金額${index + 1}`] = entry.amount.toLocaleString();
        if (entry.description) formatted[`摘要${index + 1}`] = entry.description;
      });
      return formatted;
    }
    
    if (correctAnswer.trialBalance) {
      const formatted: Record<string, any> = {};
      Object.entries(correctAnswer.trialBalance.balances || {}).forEach(([account, amount]) => {
        formatted[account] = (amount as number).toLocaleString();
      });
      return formatted;
    }
    
    return correctAnswer;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* ヘッダー */}
        <View style={[
          styles.header,
          result.isCorrect ? styles.correctHeader : styles.incorrectHeader
        ]}>
          <View style={styles.headerContent}>
            <View style={[
              styles.resultIcon,
              result.isCorrect ? styles.correctIcon : styles.incorrectIcon
            ]}>
              <Text style={styles.resultIconText}>
                {result.isCorrect ? '✓' : '✗'}
              </Text>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.resultTitle}>
                {result.isCorrect ? '正解！' : '不正解'}
              </Text>
              <Text style={styles.resultSubtitle}>
                解答時間: {formatAnswerTime(result.answerTimeMs)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* バリデーションエラー表示 */}
          {result.validationErrors && result.validationErrors.length > 0 && (
            <View style={styles.errorSection}>
              <Text style={styles.errorTitle}>入力エラー</Text>
              {result.validationErrors.map((error, index) => (
                <Text key={index} style={styles.errorText}>
                  • {error}
                </Text>
              ))}
            </View>
          )}

          {/* 解説パネル */}
          <ExplanationPanel
            explanation={result.explanation}
            isVisible={true}
            isCorrect={result.isCorrect}
            correctAnswer={formatCorrectAnswer(result.correctAnswer)}
            showAnswerComparison={true}
          />

          {/* 学習アドバイス */}
          <View style={styles.adviceSection}>
            <Text style={styles.adviceTitle}>
              {result.isCorrect ? '🎉 学習アドバイス' : '📚 復習アドバイス'}
            </Text>
            <Text style={styles.adviceText}>
              {result.isCorrect 
                ? 'おめでとうございます！正解です。この調子で学習を続けましょう。類似問題にも挑戦することで理解をより深めることができます。'
                : '間違いを恐れる必要はありません。解説をよく読んで理解を深め、復習機能を活用して再度挑戦しましょう。繰り返し学習することで必ず理解できるようになります。'
              }
            </Text>
          </View>
        </ScrollView>

        {/* アクションボタン */}
        <View style={styles.actionButtons}>
          {showReviewButton && !result.isCorrect && (
            <TouchableOpacity
              style={[styles.actionButton, styles.reviewButton]}
              onPress={onReviewQuestion}
            >
              <Text style={styles.reviewButtonText}>復習リストに追加</Text>
            </TouchableOpacity>
          )}
          
          {showNextButton && (
            <TouchableOpacity
              style={[styles.actionButton, styles.nextButton]}
              onPress={onNextQuestion}
            >
              <Text style={styles.nextButtonText}>次の問題へ</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const { height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  correctHeader: {
    backgroundColor: '#4caf50',
  },
  incorrectHeader: {
    backgroundColor: '#f44336',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  correctIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  incorrectIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  resultIconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerTextContainer: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingTop: 10,
  },
  errorSection: {
    backgroundColor: '#fff3cd',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 4,
  },
  adviceSection: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  adviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  adviceText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#555',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 40,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  reviewButton: {
    backgroundColor: '#ff9800',
  },
  nextButton: {
    backgroundColor: '#2196f3',
  },
  reviewButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});