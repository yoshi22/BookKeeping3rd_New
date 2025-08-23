/**
 * 統合勘定科目選択コンポーネント
 * Phase 12: Component Integration
 *
 * AccountDropdown、AccountSelector、JournalAccountSelectorを統合
 * 全ての問題タイプ（仕訳・帳簿・試算表）に対応
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  FlatList,
  Platform,
  ActionSheetIOS,
  Alert,
} from "react-native";
import {
  useTheme,
  useThemedStyles,
  type Theme,
} from "../../context/ThemeContext";
import { STANDARD_ACCOUNT_OPTIONS } from "../shared/AccountOptions";
import type { AccountOption } from "../shared/FormTypes";

// 簿記3級レベルの基本勘定科目データ（拡張版）
const EXTENDED_ACCOUNT_ITEMS = [
  { code: "111", name: "現金", category: "asset" },
  { code: "111-1", name: "現金過不足", category: "asset" },
  { code: "111-2", name: "小口現金", category: "asset" },
  { code: "112", name: "預金", category: "asset" },
  { code: "112-1", name: "当座預金", category: "asset" },
  { code: "112-2", name: "当座借越", category: "liability" },
  { code: "112-3", name: "普通預金", category: "asset" },
  { code: "113", name: "売掛金", category: "asset" },
  { code: "113-1", name: "貸倒引当金", category: "asset" },
  { code: "114", name: "受取手形", category: "asset" },
  { code: "115", name: "商品", category: "asset" },
  { code: "116", name: "繰越商品", category: "asset" },
  { code: "117", name: "前払費用", category: "asset" },
  { code: "118", name: "建物", category: "asset" },
  { code: "118-1", name: "建物減価償却累計額", category: "asset" },
  { code: "119", name: "備品", category: "asset" },
  { code: "119-1", name: "備品減価償却累計額", category: "asset" },
  { code: "120", name: "車両", category: "asset" },
  { code: "120-1", name: "車両運搬具", category: "asset" },
  { code: "120-2", name: "車両運搬具減価償却累計額", category: "asset" },
  { code: "211", name: "買掛金", category: "liability" },
  { code: "212", name: "支払手形", category: "liability" },
  { code: "213", name: "借入金", category: "liability" },
  { code: "214", name: "未払金", category: "liability" },
  { code: "214-1", name: "未払費用", category: "liability" },
  { code: "215", name: "前受金", category: "liability" },
  { code: "216", name: "預り金", category: "liability" },
  { code: "311", name: "資本金", category: "equity" },
  { code: "411", name: "売上", category: "revenue" },
  { code: "412", name: "受取利息", category: "revenue" },
  { code: "413", name: "雑収入", category: "revenue" },
  { code: "414", name: "固定資産売却益", category: "revenue" },
  { code: "415", name: "雑益", category: "revenue" },
  { code: "511", name: "仕入", category: "expense" },
  { code: "512", name: "給料", category: "expense" },
  { code: "513", name: "旅費交通費", category: "expense" },
  { code: "514", name: "通信費", category: "expense" },
  { code: "515", name: "水道光熱費", category: "expense" },
  { code: "516", name: "減価償却費", category: "expense" },
  { code: "517", name: "支払利息", category: "expense" },
  { code: "518", name: "雑費", category: "expense" },
  { code: "519", name: "保険料", category: "expense" },
  { code: "520", name: "法人税等", category: "expense" },
  { code: "521", name: "法定福利費", category: "expense" },
  { code: "522", name: "租税公課", category: "expense" },
  { code: "523", name: "貸倒引当金繰入", category: "expense" },
  { code: "524", name: "固定資産除却損", category: "expense" },
  { code: "525", name: "雑損", category: "expense" },
];

export type AccountSelectionMode = "dropdown" | "modal" | "actionsheet";
export type QuestionType = "journal" | "ledger" | "trial_balance";

export interface UnifiedAccountSelectorProps {
  label?: string;
  value?: string;
  onChange: (accountName: string) => void;
  required?: boolean;
  excludeAccounts?: string[];
  placeholder?: string;
  mode?: AccountSelectionMode;
  questionType?: QuestionType;

  // Modal mode specific props
  visible?: boolean;
  onClose?: () => void;

  // Advanced selection props
  currentSelection?: {
    type: "debitAccount" | "creditAccount" | "debit" | "credit";
    index: number;
  };

  // Test ID for E2E testing
  testID?: string;
}

export const UnifiedAccountSelector: React.FC<UnifiedAccountSelectorProps> = ({
  label,
  value,
  onChange,
  required = false,
  excludeAccounts = [],
  placeholder = "勘定科目を選択してください",
  mode = "dropdown",
  questionType = "journal",
  visible = false,
  onClose,
  currentSelection,
  testID,
}) => {
  const styles = useThemedStyles(createStyles);
  // For dropdown mode, use internal state only. For modal mode, use visible prop.
  const [internalModalVisible, setInternalModalVisible] = useState(false);
  const modalVisible = mode === "modal" ? visible : internalModalVisible;

  // Get appropriate account options based on question type
  const getAccountOptions = (): AccountOption[] => {
    if (questionType === "journal" && mode === "dropdown") {
      // Use extended account items for journal questions in dropdown mode
      return EXTENDED_ACCOUNT_ITEMS.filter(
        (item) => !excludeAccounts.includes(item.name),
      ).map((item) => ({ label: item.name, value: item.name }));
    }

    // Use standard options for other cases
    return STANDARD_ACCOUNT_OPTIONS.filter(
      (option) => !excludeAccounts.includes(option.value),
    );
  };

  const accountOptions = getAccountOptions();

  // iOS ActionSheet implementation
  const showIOSActionSheet = () => {
    if (Platform.OS !== "ios") return;

    const options = ["キャンセル", ...accountOptions.map((opt) => opt.label)];

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 0,
        title: label || "勘定科目を選択",
      },
      (buttonIndex) => {
        if (buttonIndex > 0) {
          const selectedAccount = accountOptions[buttonIndex - 1];
          onChange(selectedAccount.value);
        }
      },
    );
  };

  const handleAccountSelect = (account: AccountOption) => {
    console.log("[UnifiedAccountSelector] Account selected:", account.value);
    onChange(account.value);
    if (mode === "modal") {
      setInternalModalVisible(false);
      onClose?.();
    } else if (mode === "dropdown") {
      setInternalModalVisible(false);
    }
  };

  const openModal = () => {
    console.log("[UnifiedAccountSelector] Opening modal, mode:", mode);
    if (mode === "actionsheet" && Platform.OS === "ios") {
      showIOSActionSheet();
    } else {
      if (mode === "dropdown") {
        setInternalModalVisible(true);
      } else {
        setInternalModalVisible(true);
      }
    }
  };

  const closeModal = () => {
    console.log("[UnifiedAccountSelector] Closing modal");
    if (mode === "dropdown") {
      setInternalModalVisible(false);
    } else {
      setInternalModalVisible(false);
      onClose?.();
    }
  };

  // Render dropdown mode
  if (mode === "dropdown") {
    return (
      <View style={styles.container}>
        {label && (
          <Text style={styles.label}>
            {label} {required && <Text style={styles.required}>*</Text>}
          </Text>
        )}
        <TouchableOpacity
          style={[styles.dropdown, !value && styles.placeholder]}
          onPress={() => {
            console.log("[UnifiedAccountSelector] TouchableOpacity pressed");
            openModal();
          }}
          testID={testID}
          activeOpacity={0.7}
        >
          <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
            {value || placeholder}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => {
            console.log(
              "[UnifiedAccountSelector] Modal onRequestClose triggered",
            );
            closeModal();
          }}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              onPress={() => {
                console.log("[UnifiedAccountSelector] Modal overlay pressed");
                closeModal();
              }}
              activeOpacity={1}
            />
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {label || "勘定科目を選択"}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.optionsList}>
                {accountOptions.map((option, index) => (
                  <TouchableOpacity
                    key={`${option.value}-${index}`}
                    style={[
                      styles.optionItem,
                      value === option.value && styles.selectedOption,
                    ]}
                    onPress={() => handleAccountSelect(option)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        value === option.value && styles.selectedOptionText,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Render modal mode (for unified forms)
  if (mode === "modal") {
    return (
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>勘定科目を選択</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={accountOptions}
              style={styles.optionsList}
              keyExtractor={(item, index) => `${item.value}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => handleAccountSelect(item)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    );
  }

  // Default case - should not reach here
  return null;
};

// Helper function for iOS ActionSheet (backward compatibility)
export const showIOSAccountSelector = (
  type: "debitAccount" | "creditAccount" | "debit" | "credit",
  index: number,
  onSelectAccount: (
    type: "debitAccount" | "creditAccount" | "debit" | "credit",
    index: number,
    account: string,
  ) => void,
  excludeAccounts: string[] = [],
) => {
  if (Platform.OS !== "ios") return;

  const accountOptions = STANDARD_ACCOUNT_OPTIONS.filter(
    (option) => !excludeAccounts.includes(option.value) && option.value,
  );

  const options = ["キャンセル", ...accountOptions.map((opt) => opt.label)];

  ActionSheetIOS.showActionSheetWithOptions(
    {
      options,
      cancelButtonIndex: 0,
      title: "勘定科目を選択",
    },
    (buttonIndex) => {
      if (buttonIndex > 0) {
        const selectedAccount = accountOptions[buttonIndex - 1];
        onSelectAccount(type, index, selectedAccount.value);
      }
    },
  );
};

const createStyles = (theme: Theme): StyleSheet.NamedStyles<any> =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 8,
      color: theme.colors.text,
    },
    required: {
      color: theme.colors.error || "#ff4444",
    },
    dropdown: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.surface || "#f9f9f9",
      borderWidth: 1,
      borderColor: theme.colors.border || "#ddd",
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      minHeight: 50,
    },
    placeholder: {
      borderColor: theme.colors.border || "#ccc",
    },
    dropdownText: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
    },
    placeholderText: {
      color: theme.colors.textDisabled || "#999",
      fontStyle: "italic",
    },
    dropdownArrow: {
      fontSize: 12,
      color: theme.colors.text,
      marginLeft: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: theme.colors.surface || "#fff",
      borderRadius: 12,
      width: "90%",
      maxHeight: "80%",
      overflow: "hidden",
      elevation: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.3,
      shadowRadius: 10,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border || "#eee",
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    closeButton: {
      width: 32,
      height: 32,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 16,
      backgroundColor: theme.colors.border || "#f0f0f0",
    },
    closeButtonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    optionsList: {
      maxHeight: 400,
    },
    optionItem: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border || "#f0f0f0",
    },
    selectedOption: {
      backgroundColor: theme.colors.primary + "20" || "#007AFF20",
    },
    optionText: {
      fontSize: 16,
      color: theme.colors.text,
    },
    selectedOptionText: {
      color: theme.colors.primary || "#007AFF",
      fontWeight: "600",
    },
  });

export default UnifiedAccountSelector;
