/**
 * CBT形式解答フォームコンポーネント
 * Step 2.2: 解答記録機能実装 - 解答送信処理追加
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AccountDropdown from './AccountDropdown';
import NumberInput from './NumberInput';
import { answerService, SubmitAnswerRequest, SubmitAnswerResponse } from '../services/answer-service';
import { SessionType } from '../types/database';

interface AnswerField {
  label: string;
  type: 'dropdown' | 'number' | 'text';
  name: string;
  required: boolean;
  format?: 'currency' | 'percentage';
  options?: string[];
}

interface AnswerFormProps {
  fields: AnswerField[];
  answers: Record<string, any>;
  onAnswerChange: (fieldName: string, value: any) => void;
  questionId: string;
  sessionType?: SessionType;
  sessionId?: string;
  startTime?: number;
  onSubmitAnswer?: (response: SubmitAnswerResponse) => void;
  showSubmitButton?: boolean;
}

export default function AnswerForm({
  fields,
  answers,
  onAnswerChange,
  questionId,
  sessionType = 'learning',
  sessionId,
  startTime = Date.now(),
  onSubmitAnswer,
  showSubmitButton = true,
}: AnswerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 解答送信処理
  const handleSubmitAnswer = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // 必須フィールドチェック
      const missingFields = fields
        .filter(field => field.required && !answers[field.name])
        .map(field => field.label);
      
      if (missingFields.length > 0) {
        Alert.alert(
          '入力エラー',
          `以下の項目は必須です：\n${missingFields.join('\n')}`
        );
        return;
      }
      
      const request: SubmitAnswerRequest = {
        questionId,
        answerData: answers,
        sessionType,
        sessionId,
        startTime,
      };
      
      const response = await answerService.submitAnswer(request);
      
      if (onSubmitAnswer) {
        onSubmitAnswer(response);
      } else {
        // デフォルトの結果表示
        Alert.alert(
          response.isCorrect ? '正解！' : '不正解',
          response.isCorrect 
            ? '正解です。よくできました！' 
            : '不正解です。解説を確認して復習しましょう。',
          [{ text: 'OK' }]
        );
      }
      
    } catch (error) {
      console.error('[AnswerForm] 解答送信エラー:', error);
      Alert.alert(
        'エラー',
        '解答の送信に失敗しました。もう一度お試しください。'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 重複使用防止のため、既に選択された勘定科目を取得
  const getSelectedAccounts = () => {
    return fields
      .filter(field => field.type === 'dropdown' && answers[field.name])
      .map(field => answers[field.name])
      .filter(Boolean);
  };

  const renderField = (field: AnswerField) => {
    switch (field.type) {
      case 'dropdown':
        return (
          <AccountDropdown
            key={field.name}
            label={field.label}
            value={answers[field.name]}
            onChange={(value) => onAnswerChange(field.name, value)}
            required={field.required}
            excludeAccounts={getSelectedAccounts().filter(account => account !== answers[field.name])}
          />
        );

      case 'number':
        return (
          <NumberInput
            key={field.name}
            label={field.label}
            value={answers[field.name]}
            onChange={(value) => onAnswerChange(field.name, value)}
            required={field.required}
            format={field.format}
            placeholder={field.format === 'currency' ? '金額を入力してください' : '数値を入力してください'}
          />
        );

      case 'text':
        return (
          <View key={field.name} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field.label}
              {field.required && <Text style={styles.required}> *</Text>}
            </Text>
            <TouchableOpacity
              style={styles.textInput}
              onPress={() => {
                Alert.alert('テキスト入力', `${field.label}の入力機能は後のステップで実装します`);
              }}
            >
              <Text style={[
                styles.inputText,
                !answers[field.name] && styles.placeholderText
              ]}>
                {answers[field.name] || 'テキストを入力'}
              </Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>解答</Text>
      {fields.map(renderField)}
      
      {showSubmitButton && (
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled
          ]}
          onPress={handleSubmitAnswer}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <View style={styles.submitButtonContent}>
              <ActivityIndicator size="small" color="white" style={styles.loader} />
              <Text style={styles.submitButtonText}>送信中...</Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>解答を送信</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  fieldContainer: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  required: {
    color: '#d32f2f',
  },
  textInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
    minHeight: 48,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9E9E9E',
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginRight: 8,
  },
});