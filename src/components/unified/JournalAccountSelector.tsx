/**
 * 仕訳エントリフォーム 勘定科目選択コンポーネント
 * JournalEntryForm分割 - Phase 3
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ActionSheetIOS,
  Platform,
} from "react-native";
import {
  useTheme,
  useThemedStyles,
  type Theme,
} from "../../context/ThemeContext";
import { STANDARD_ACCOUNT_OPTIONS } from "../shared/AccountOptions";
import { JournalAccountSelectorProps } from "./JournalFormTypes";

export const JournalAccountSelector: React.FC<JournalAccountSelectorProps> = ({
  visible,
  onSelect,
  onClose,
  currentSelection,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  // iOS用ActionSheet表示
  const showIOSActionSheet = (
    type: "debit" | "credit",
    index: number,
    onSelectAccount: (account: { label: string; value: string }) => void,
  ) => {
    if (Platform.OS === "ios") {
      const options = STANDARD_ACCOUNT_OPTIONS.map((option) => option.label);
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: "勘定科目を選択",
          options: ["キャンセル", ...options],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            const selectedAccount = STANDARD_ACCOUNT_OPTIONS[buttonIndex - 1];
            onSelectAccount(selectedAccount);
          }
        },
      );
    }
  };

  const handleAccountSelect = (account: { label: string; value: string }) => {
    onSelect(account);
    onClose();
  };

  // Android用Modal表示
  if (Platform.OS === "android") {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>勘定科目を選択</Text>
              <TouchableOpacity
                onPress={onClose}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>×</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={STANDARD_ACCOUNT_OPTIONS.filter(
                (account) => account.value !== "",
              )}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleAccountSelect(item)}
                >
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    );
  }

  // iOSでは何も表示しない（ActionSheetを使用）
  return null;
};

/**
 * 勘定科目選択ボタンコンポーネント
 */
interface AccountPickerButtonProps {
  account: string;
  onPress: () => void;
  testID?: string;
  accessibilityLabel?: string;
}

export const AccountPickerButton: React.FC<AccountPickerButtonProps> = ({
  account,
  onPress,
  testID,
  accessibilityLabel,
}) => {
  const styles = useThemedStyles(createStyles);

  return (
    <TouchableOpacity
      style={styles.accountPickerContainer}
      onPress={onPress}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={styles.accountPickerText}>
        {account || "勘定科目を選択"}
      </Text>
      <Text style={styles.accountPickerArrow}>▼</Text>
    </TouchableOpacity>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.colors.background + "80",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: "80%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
    },
    modalCloseButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: theme.colors.error,
      justifyContent: "center",
      alignItems: "center",
    },
    modalCloseText: {
      color: theme.colors.background,
      fontSize: 18,
      fontWeight: "bold",
    },
    modalItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border + "30",
    },
    modalItemText: {
      fontSize: 16,
      color: theme.colors.text,
    },
    accountPickerContainer: {
      width: "100%",
      minHeight: 50,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 4,
      backgroundColor: theme.colors.background,
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 12,
      flexDirection: "row",
    },
    accountPickerText: {
      fontSize: 14,
      color: theme.colors.text,
      flex: 1,
    },
    accountPickerArrow: {
      fontSize: 12,
      color: theme.colors.primary,
      marginLeft: 8,
    },
  });
