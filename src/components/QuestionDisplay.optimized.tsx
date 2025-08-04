/**
 * 最適化版問題表示統合コンポーネント
 * Step 2.1.7: パフォーマンス最適化実装例
 */

import React, { memo, useMemo, useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useDebounce } from '../hooks/useQuestionNavigation.optimized';
import AccountDropdown from './AccountDropdown';
import NumberInput from './NumberInput';
import QuestionText from './QuestionText';
import ExplanationPanel from './ExplanationPanel';

interface AnswerField {
  label: string;
  type: 'dropdown' | 'number' | 'text';
  name: string;
  required: boolean;
  format?: 'currency' | 'percentage' | 'number';
  options?: string[];
}

interface QuestionDisplayProps {
  questionId: string;
  categoryName: string;
  questionText: string;
  difficulty: number;
  answerFields: AnswerField[];
  answers: Record<string, any>;
  explanation: string;
  showExplanation: boolean;
  isCorrect: boolean;
  correctAnswer: Record<string, any>;
  onBack: () => void;
  onSubmit: () => void;
  onAnswerChange: (fieldName: string, value: any) => void;
}

// 解答フィールドコンポーネント（memo化で最適化）
const AnswerFieldComponent = memo<{
  field: AnswerField;
  value: any;
  onChange: (value: any) => void;
  excludeAccounts?: string[];
}>(({ field, value, onChange, excludeAccounts = [] }) => {
  // デバウンス処理（入力の最適化）
  const debouncedValue = useDebounce(value, 300);
  
  const handleChange = useCallback((newValue: any) => {
    onChange(newValue);
  }, [onChange]);

  switch (field.type) {
    case 'dropdown':
      return (
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>{field.label}</Text>
          <AccountDropdown
            selectedAccount={debouncedValue || ''}
            onAccountSelect={handleChange}
            excludeAccounts={excludeAccounts}
            placeholder={`${field.label}を選択`}
          />
        </View>
      );
    
    case 'number':
      return (
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>{field.label}</Text>
          <NumberInput
            value={debouncedValue}
            onValueChange={handleChange}
            format={field.format || 'number'}
            placeholder={`${field.label}を入力`}
          />
        </View>
      );
    
    default:
      return null;
  }
});

AnswerFieldComponent.displayName = 'AnswerFieldComponent';

// メインコンポーネント（memo化で最適化）
const QuestionDisplayOptimized = memo<QuestionDisplayProps>(({
  questionId,
  categoryName,
  questionText,
  difficulty,
  answerFields,
  answers,
  explanation,
  showExplanation,
  isCorrect,
  correctAnswer,
  onBack,
  onSubmit,
  onAnswerChange,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 必須フィールドの検証（useMemoで最適化）
  const validationState = useMemo(() => {
    const requiredFields = answerFields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !answers[field.name]);
    const isValid = missingFields.length === 0;
    
    return {
      isValid,
      missingFields,
      requiredFields,
    };
  }, [answerFields, answers]);

  // 除外する勘定科目の計算（仕訳問題用、useMemoで最適化）
  const excludeAccounts = useMemo(() => {
    if (categoryName !== '仕訳') return [];
    
    const debitAccount = answers.debit_account;
    const creditAccount = answers.credit_account;
    
    const excludes: string[] = [];
    if (debitAccount) excludes.push(debitAccount);
    if (creditAccount) excludes.push(creditAccount);
    
    return excludes;
  }, [answers.debit_account, answers.credit_account, categoryName]);

  // 解答変更ハンドラー（useCallbackで最適化）
  const handleAnswerChange = useCallback((fieldName: string, value: any) => {
    onAnswerChange(fieldName, value);
  }, [onAnswerChange]);

  // 解答送信ハンドラー（useCallbackで最適化）
  const handleSubmit = useCallback(async () => {
    if (!validationState.isValid) {
      Alert.alert(
        '入力不備',
        `以下の項目を入力してください:\n${validationState.missingFields.map(field => field.label).join('\n')}`
      );
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 非同期処理のシミュレーション
      await new Promise(resolve => setTimeout(resolve, 500));
      onSubmit();
    } catch (error) {
      Alert.alert('エラー', '解答の送信に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  }, [validationState, onSubmit]);

  // 解答フィールドのレンダリング（useMemoで最適化）
  const renderedAnswerFields = useMemo(() => {
    return answerFields.map((field) => {
      const fieldExcludeAccounts = field.type === 'dropdown' ? excludeAccounts : [];
      
      return (
        <AnswerFieldComponent
          key={field.name}
          field={field}
          value={answers[field.name]}
          onChange={(value) => handleAnswerChange(field.name, value)}
          excludeAccounts={fieldExcludeAccounts}
        />
      );
    });
  }, [answerFields, answers, excludeAccounts, handleAnswerChange]);

  // アクションボタンのスタイル（useMemoで最適化）
  const submitButtonStyle = useMemo(() => [
    styles.submitButton,
    (!validationState.isValid || isSubmitting) && styles.submitButtonDisabled,
  ], [validationState.isValid, isSubmitting]);

  const submitButtonTextStyle = useMemo(() => [
    styles.submitButtonText,
    (!validationState.isValid || isSubmitting) && styles.submitButtonTextDisabled,
  ], [validationState.isValid, isSubmitting]);

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true} // パフォーマンス最適化
    >
      {/* 問題文表示 */}
      <QuestionText
        questionId={questionId}
        categoryName={categoryName}
        questionText={questionText}
        difficulty={difficulty}
      />

      {/* 解答フォーム */}
      <View style={styles.answerForm}>
        <Text style={styles.answerFormTitle}>解答</Text>
        {renderedAnswerFields}

        {/* アクションボタン */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
          >
            <Text style={styles.backButtonText}>戻る</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={submitButtonStyle}
            onPress={handleSubmit}
            disabled={!validationState.isValid || isSubmitting}
          >
            <Text style={submitButtonTextStyle}>
              {isSubmitting ? '送信中...' : '解答送信'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 入力状態表示（デバッグ用、開発時のみ表示） */}
        {__DEV__ && (
          <View style={styles.debugInfo}>
            <Text style={styles.debugTitle}>入力状態 (開発用):</Text>
            <Text style={styles.debugText}>
              必須: {validationState.requiredFields.length}, 
              入力済み: {validationState.requiredFields.length - validationState.missingFields.length}, 
              未入力: {validationState.missingFields.length}
            </Text>
          </View>
        )}
      </View>

      {/* 解説パネル */}
      {showExplanation && (
        <ExplanationPanel
          explanation={explanation}
          isCorrect={isCorrect}
          userAnswer={answers}
          correctAnswer={correctAnswer}
          expanded={true}
        />
      )}
    </ScrollView>
  );
});

QuestionDisplayOptimized.displayName = 'QuestionDisplayOptimized';

export default QuestionDisplayOptimized;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  answerForm: {
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
  answerFormTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  backButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  submitButton: {
    flex: 2,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#2f95dc',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  submitButtonTextDisabled: {
    color: '#666',
  },
  debugInfo: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#ff9800',
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  debugText: {
    fontSize: 11,
    color: '#666',
  },
});