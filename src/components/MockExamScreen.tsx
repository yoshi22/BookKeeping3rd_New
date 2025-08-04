/**
 * 模試実行画面コンポーネント
 * 時間制限付きCBT形式模試の実行機能
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { QuestionDisplay } from './QuestionDisplay.optimized';
import { AnswerForm } from './AnswerForm';
import { QuestionNavigation } from './QuestionNavigation.optimized';
import { MockExamService, MockExamSession, MockExamSessionResult } from '../services/mock-exam-service';
import { CBTAnswerData } from '../types/database';
import { Question, MockExamQuestion } from '../types/models';

interface MockExamScreenProps {
  examId: string;
  onComplete: (result: MockExamSessionResult) => void;
  onExit: () => void;
}

export const MockExamScreen: React.FC<MockExamScreenProps> = ({
  examId,
  onComplete,
  onExit
}) => {
  const [session, setSession] = useState<MockExamSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const mockExamService = useRef(new MockExamService()).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeSession();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (session) {
      startTimer();
    }
  }, [session]);

  const initializeSession = async () => {
    try {
      setLoading(true);
      const newSession = await mockExamService.startMockExamSession(examId);
      setSession(newSession);
      setRemainingTime(mockExamService.getRemainingTime(newSession));
    } catch (error) {
      console.error('Failed to initialize mock exam session:', error);
      Alert.alert('エラー', '模試の開始に失敗しました', [
        { text: 'OK', onPress: onExit }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      if (!session) return;

      const timeLeft = mockExamService.getRemainingTime(session);
      setRemainingTime(timeLeft);

      if (timeLeft <= 0) {
        setIsTimeUp(true);
        handleTimeUp();
      }
    }, 1000);
  };

  const handleTimeUp = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    Alert.alert(
      '時間終了',
      '制限時間が終了しました。模試を自動的に終了します。',
      [{ text: 'OK', onPress: handleForceSubmit }],
      { cancelable: false }
    );
  };

  const handleAnswerSubmit = async (questionId: string, answer: CBTAnswerData, answerTime: number) => {
    if (!session) return;

    try {
      await mockExamService.recordMockExamAnswer(session, questionId, answer, answerTime);
      
      // セッション状態を更新
      const updatedSession = { ...session };
      updatedSession.answers.set(questionId, answer);
      setSession(updatedSession);

    } catch (error) {
      console.error('Failed to record answer:', error);
      Alert.alert('エラー', '解答の記録に失敗しました');
    }
  };

  const handleQuestionChange = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmitExam = () => {
    if (!session) return;

    const progress = mockExamService.getSessionProgress(session);
    
    if (progress.answeredQuestions < progress.totalQuestions) {
      Alert.alert(
        '未解答の問題があります',
        `${progress.totalQuestions - progress.answeredQuestions}問が未解答です。本当に提出しますか？`,
        [
          { text: 'キャンセル', style: 'cancel' },
          { text: '提出', style: 'destructive', onPress: () => setShowSubmitConfirm(true) }
        ]
      );
    } else {
      setShowSubmitConfirm(true);
    }
  };

  const handleConfirmSubmit = async () => {
    if (!session) return;

    try {
      setSubmitting(true);
      setShowSubmitConfirm(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      const result = await mockExamService.completeMockExamSession(session);
      onComplete(result);
    } catch (error) {
      console.error('Failed to submit exam:', error);
      Alert.alert('エラー', '模試の提出に失敗しました');
      setSubmitting(false);
    }
  };

  const handleForceSubmit = async () => {
    if (!session) return;

    try {
      setSubmitting(true);
      const result = await mockExamService.completeMockExamSession(session);
      onComplete(result);
    } catch (error) {
      console.error('Failed to force submit exam:', error);
      Alert.alert('エラー', '模試の終了に失敗しました');
    }
  };

  const handleExit = () => {
    setShowExitConfirm(true);
  };

  const handleConfirmExit = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    onExit();
  };

  const formatTime = (timeMs: number): string => {
    const totalSeconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCurrentQuestion = (): (Question & MockExamQuestion) | null => {
    if (!session || currentQuestionIndex >= session.questions.length) {
      return null;
    }
    return session.questions[currentQuestionIndex];
  };

  const getCurrentAnswer = (): CBTAnswerData | undefined => {
    const question = getCurrentQuestion();
    if (!question || !session) return undefined;
    return session.answers.get(question.question_id);
  };

  const getProgressInfo = () => {
    if (!session) return { answered: 0, total: 0, percentage: 0 };
    return mockExamService.getSessionProgress(session);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>模試を準備中...</Text>
      </View>
    );
  }

  if (submitting) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>模試を採点中...</Text>
      </View>
    );
  }

  if (!session) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>模試の読み込みに失敗しました</Text>
        <TouchableOpacity style={styles.exitButton} onPress={onExit}>
          <Text style={styles.exitButtonText}>戻る</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQuestion = getCurrentQuestion();
  const currentAnswer = getCurrentAnswer();
  const progress = getProgressInfo();

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleExit} style={styles.exitButton}>
            <Text style={styles.exitButtonText}>終了</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerCenter}>
          <Text style={[
            styles.timeText,
            remainingTime < 300000 && styles.timeWarning, // 5分切ったら警告色
            remainingTime < 60000 && styles.timeCritical   // 1分切ったら危険色
          ]}>
            残り時間: {formatTime(remainingTime)}
          </Text>
          <Text style={styles.progressText}>
            {progress.answered}/{progress.total} 問題
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            onPress={handleSubmitExam}
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}>提出</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 進捗バー */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progress.progressPercentage}%` }
            ]} 
          />
        </View>
      </View>

      {/* 問題表示エリア */}
      <ScrollView style={styles.questionContainer}>
        {currentQuestion && (
          <>
            <QuestionDisplay
              question={currentQuestion}
              currentAnswer={currentAnswer}
              onAnswerChange={() => {}} // 模試では即座に保存しない
              showExplanation={false}
            />
            
            <AnswerForm
              question={currentQuestion}
              initialAnswer={currentAnswer}
              onSubmit={(answer, answerTime) => 
                handleAnswerSubmit(currentQuestion.question_id, answer, answerTime)
              }
              submitButtonText="解答を記録"
              allowMultipleSubmit={true}
            />
          </>
        )}
      </ScrollView>

      {/* 問題ナビゲーション */}
      <View style={styles.navigationContainer}>
        <QuestionNavigation
          questions={session.questions}
          currentIndex={currentQuestionIndex}
          answeredQuestions={Array.from(session.answers.keys())}
          onQuestionSelect={handleQuestionChange}
          showAnswerStatus={true}
        />
      </View>

      {/* 終了確認モーダル */}
      <Modal
        visible={showExitConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExitConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>模試を終了しますか？</Text>
            <Text style={styles.modalMessage}>
              終了すると進捗は保存されません。{'\n'}
              本当に終了しますか？
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowExitConfirm(false)}
              >
                <Text style={styles.cancelButtonText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmExit}
              >
                <Text style={styles.confirmButtonText}>終了</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 提出確認モーダル */}
      <Modal
        visible={showSubmitConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSubmitConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>模試を提出しますか？</Text>
            <Text style={styles.modalMessage}>
              提出後は解答の変更はできません。{'\n'}
              本当に提出しますか？
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowSubmitConfirm(false)}
              >
                <Text style={styles.cancelButtonText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmSubmit}
              >
                <Text style={styles.confirmButtonText}>提出</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerLeft: {
    flex: 1,
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  timeWarning: {
    color: '#fd7e14',
  },
  timeCritical: {
    color: '#dc3545',
  },
  progressText: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  exitButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  questionContainer: {
    flex: 1,
    padding: 16,
  },
  navigationContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6c757d',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    margin: 20,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#dc3545',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});