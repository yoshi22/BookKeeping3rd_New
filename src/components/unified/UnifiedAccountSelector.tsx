/**
 * 統合勘定科目選択コンポーネント
 * Phase 12: Component Integration
 *
 * AccountDropdown、AccountSelector、JournalAccountSelectorを統合
 * 全ての問題タイプ（仕訳・帳簿・試算表）に対応
 */

import React, { useState, useEffect } from "react";
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
import {
  filterAccountsForQuestion,
  type FilteredAccountOptions,
} from "../../services/account-filter-service";

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

  // Dynamic filtering props
  questionId?: string;
  questionText?: string;
  enableDynamicFiltering?: boolean;
  showAllAccountsOption?: boolean;
  maxFilteredAccounts?: number;

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
  questionId,
  questionText,
  enableDynamicFiltering = false,
  showAllAccountsOption = true,
  maxFilteredAccounts = 15,
  testID,
}) => {
  const styles = useThemedStyles(createStyles);
  // For dropdown mode, use internal state only. For modal mode, use visible prop.
  const [internalModalVisible, setInternalModalVisible] = useState(false);
  const modalVisible = mode === "modal" ? visible : internalModalVisible;

  // State for dynamic filtering
  const [showAllAccounts, setShowAllAccounts] = useState(false);
  const [filteredResult, setFilteredResult] =
    useState<FilteredAccountOptions | null>(null);

  // Effect to update filtered accounts when questionId or questionText changes
  useEffect(() => {
    if (enableDynamicFiltering && (questionId || questionText)) {
      try {
        const result = filterAccountsForQuestion(
          questionId,
          questionText,
          maxFilteredAccounts,
        );
        setFilteredResult(result);
        setShowAllAccounts(false); // Reset show all when filtering updates
      } catch (error) {
        console.warn(
          "[UnifiedAccountSelector] Dynamic filtering failed:",
          error,
        );
        setFilteredResult(null);
      }
    } else {
      setFilteredResult(null);
    }
  }, [enableDynamicFiltering, questionId, questionText, maxFilteredAccounts]);

  // Get appropriate account options
  const getAccountOptions = (): AccountOption[] => {
    let baseOptions: AccountOption[];

    // Use dynamic filtering if enabled and available
    if (enableDynamicFiltering && filteredResult && !showAllAccounts) {
      baseOptions = filteredResult.accounts;
    } else {
      // Use standard options for all cases to ensure consistency
      baseOptions = STANDARD_ACCOUNT_OPTIONS;
    }

    // Apply excludeAccounts filter
    return baseOptions.filter(
      (option) => !excludeAccounts.includes(option.value),
    );
  };

  const accountOptions = getAccountOptions();

  // Check if "Show All" option should be displayed
  const shouldShowAllOption =
    enableDynamicFiltering &&
    filteredResult &&
    showAllAccountsOption &&
    !showAllAccounts &&
    filteredResult.hasShowAllOption;

  // iOS ActionSheet implementation
  const showIOSActionSheet = () => {
    if (Platform.OS !== "ios") return;

    let options = ["キャンセル", ...accountOptions.map((opt) => opt.label)];

    // Add "Show All" option if needed
    if (shouldShowAllOption) {
      options.push("その他の勘定科目を表示");
    }

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 0,
        title: label || "勘定科目を選択",
      },
      (buttonIndex) => {
        if (buttonIndex > 0) {
          // Check if "Show All" option was selected
          if (shouldShowAllOption && buttonIndex === options.length - 1) {
            setShowAllAccounts(true);
            // Re-show ActionSheet with all accounts
            setTimeout(() => showIOSActionSheet(), 100);
          } else {
            const selectedAccount = accountOptions[buttonIndex - 1];
            onChange(selectedAccount.value);
          }
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
                    testID={`account-option-${option.value}`}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        value === option.value && styles.selectedOptionText,
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}

                {/* Show All option */}
                {shouldShowAllOption && (
                  <TouchableOpacity
                    style={styles.showAllOption}
                    onPress={() => setShowAllAccounts(true)}
                    testID="show-all-accounts-option"
                  >
                    <Text style={styles.showAllOptionText}>
                      その他の勘定科目を表示
                    </Text>
                  </TouchableOpacity>
                )}
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
                  testID={`account-option-${item.value}`}
                >
                  <Text
                    style={styles.optionText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
              ListFooterComponent={
                shouldShowAllOption ? (
                  <TouchableOpacity
                    style={styles.showAllOption}
                    onPress={() => setShowAllAccounts(true)}
                    testID="show-all-accounts-option"
                  >
                    <Text style={styles.showAllOptionText}>
                      その他の勘定科目を表示
                    </Text>
                  </TouchableOpacity>
                ) : null
              }
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
    showAllOption: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 2,
      borderTopColor: theme.colors.primary || "#007AFF",
      backgroundColor: (theme.colors.primary || "#007AFF") + "10",
      marginTop: 8,
    },
    showAllOptionText: {
      fontSize: 16,
      color: theme.colors.primary || "#007AFF",
      fontWeight: "600",
      textAlign: "center",
    },
  });

export default UnifiedAccountSelector;
