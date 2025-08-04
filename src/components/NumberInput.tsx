/**
 * CBT形式 数値入力コンポーネント
 * Step 2.1.4: 数値入力コンポーネント実装（カンマ自動挿入対応）
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';

interface NumberInputProps {
  label: string;
  value?: number;
  onChange: (value: number | undefined) => void;
  required?: boolean;
  format?: 'currency' | 'percentage' | 'number';
  placeholder?: string;
  maxValue?: number;
  minValue?: number;
}

export default function NumberInput({
  label,
  value,
  onChange,
  required = false,
  format = 'number',
  placeholder = '数値を入力してください',
  maxValue,
  minValue = 0,
}: NumberInputProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');

  // 数値をフォーマットして表示
  const formatDisplayValue = (num: number | undefined): string => {
    if (num === undefined || num === null) return '';
    
    switch (format) {
      case 'currency':
        return `¥${num.toLocaleString()}`;
      case 'percentage':
        return `${num}%`;
      default:
        return num.toLocaleString();
    }
  };

  // 入力テキストから数値を抽出
  const parseInputValue = (text: string): number | undefined => {
    // カンマ、円マーク、%マークを除去
    const cleanText = text.replace(/[¥,%]/g, '');
    
    if (cleanText === '') return undefined;
    
    const num = parseFloat(cleanText);
    
    if (isNaN(num)) return undefined;
    
    return num;
  };

  // 入力値のリアルタイムフォーマット
  const formatInputText = (text: string): string => {
    const num = parseInputValue(text);
    if (num === undefined) return text;
    
    // 数値が有効な場合、カンマ区切りで表示
    return num.toLocaleString();
  };

  // 数値バリデーション
  const validateValue = (num: number): string | null => {
    if (minValue !== undefined && num < minValue) {
      return `${minValue}以上の値を入力してください`;
    }
    
    if (maxValue !== undefined && num > maxValue) {
      return `${maxValue}以下の値を入力してください`;
    }
    
    // 小数点以下の桁数チェック（金額の場合は整数のみ）
    if (format === 'currency' && num % 1 !== 0) {
      return '金額は整数で入力してください';
    }
    
    return null;
  };

  // モーダルを開く
  const openModal = () => {
    setInputText(value ? value.toString() : '');
    setIsModalVisible(true);
  };

  // 入力確定処理
  const handleConfirm = () => {
    const num = parseInputValue(inputText);
    
    if (required && num === undefined) {
      Alert.alert('入力エラー', '値を入力してください');
      return;
    }
    
    if (num !== undefined) {
      const validationError = validateValue(num);
      if (validationError) {
        Alert.alert('入力エラー', validationError);
        return;
      }
    }
    
    onChange(num);
    setIsModalVisible(false);
    setInputText('');
  };

  // キャンセル処理
  const handleCancel = () => {
    setIsModalVisible(false);
    setInputText('');
  };

  // クリア処理
  const handleClear = () => {
    setInputText('');
  };

  // 入力テキスト変更処理
  const handleTextChange = (text: string) => {
    // 数字、カンマ、小数点のみ許可
    const sanitizedText = text.replace(/[^\d.,]/g, '');
    setInputText(sanitizedText);
  };

  // プリセット値ボタン（金額入力用）
  const presetValues = format === 'currency' ? [
    1000, 5000, 10000, 50000, 100000, 500000, 1000000
  ] : [];

  const handlePresetValue = (presetValue: number) => {
    setInputText(presetValue.toString());
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
        
        <TouchableOpacity
          style={[
            styles.inputButton,
            !value && styles.inputButtonEmpty,
          ]}
          onPress={openModal}
        >
          <Text style={[
            styles.inputText,
            !value && styles.placeholderText,
          ]}>
            {value !== undefined ? formatDisplayValue(value) : placeholder}
          </Text>
          <Text style={styles.inputIcon}>✏️</Text>
        </TouchableOpacity>
      </View>

      {/* 数値入力モーダル */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancel}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}を入力</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCancel}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              {/* 現在値表示 */}
              {value !== undefined && (
                <View style={styles.currentValueSection}>
                  <Text style={styles.currentValueLabel}>現在の値:</Text>
                  <Text style={styles.currentValueText}>
                    {formatDisplayValue(value)}
                  </Text>
                </View>
              )}

              {/* 入力フィールド */}
              <View style={styles.inputSection}>
                <TextInput
                  style={styles.textInput}
                  value={inputText}
                  onChangeText={handleTextChange}
                  keyboardType="numeric"
                  placeholder={`例: ${format === 'currency' ? '100000' : '100'}`}
                  autoFocus={true}
                  selectTextOnFocus={true}
                />
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={handleClear}
                >
                  <Text style={styles.clearButtonText}>クリア</Text>
                </TouchableOpacity>
              </View>

              {/* プレビュー表示 */}
              {inputText && (
                <View style={styles.previewSection}>
                  <Text style={styles.previewLabel}>プレビュー:</Text>
                  <Text style={styles.previewText}>
                    {formatDisplayValue(parseInputValue(inputText))}
                  </Text>
                </View>
              )}

              {/* プリセット値ボタン（金額入力用） */}
              {presetValues.length > 0 && (
                <View style={styles.presetSection}>
                  <Text style={styles.presetLabel}>よく使う金額:</Text>
                  <View style={styles.presetButtons}>
                    {presetValues.map((preset) => (
                      <TouchableOpacity
                        key={preset}
                        style={styles.presetButton}
                        onPress={() => handlePresetValue(preset)}
                      >
                        <Text style={styles.presetButtonText}>
                          ¥{preset.toLocaleString()}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* 入力制限の説明 */}
              <View style={styles.helpSection}>
                <Text style={styles.helpText}>
                  {format === 'currency' && '• 金額は整数で入力してください'}
                  {minValue !== undefined && `• 最小値: ${minValue.toLocaleString()}`}
                  {maxValue !== undefined && `• 最大値: ${maxValue.toLocaleString()}`}
                </Text>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>確定</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  required: {
    color: '#d32f2f',
  },
  inputButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
    minHeight: 48,
  },
  inputButtonEmpty: {
    borderColor: '#ccc',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  placeholderText: {
    color: '#999',
  },
  inputIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  modalContent: {
    padding: 16,
  },
  currentValueSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  currentValueLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  currentValueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  inputSection: {
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    textAlign: 'right',
    marginBottom: 8,
  },
  clearButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  clearButtonText: {
    color: '#666',
    fontSize: 14,
  },
  previewSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  previewLabel: {
    fontSize: 14,
    color: '#1976d2',
    marginBottom: 4,
  },
  previewText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  presetSection: {
    marginBottom: 16,
  },
  presetLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  presetButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginRight: 4,
    marginBottom: 4,
  },
  presetButtonText: {
    fontSize: 12,
    color: '#333',
  },
  helpSection: {
    marginBottom: 16,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#2f95dc',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});