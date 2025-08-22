/**
 * 勘定科目選択コンポーネント
 * LedgerEntryForm分割 - Phase 2
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  ActionSheetIOS,
} from "react-native";
import {
  useTheme,
  useThemedStyles,
  type Theme,
} from "../../context/ThemeContext";
import { STANDARD_ACCOUNT_OPTIONS } from "../shared/AccountOptions";
import { AccountSelectorProps } from "./LedgerFormTypes";

interface AccountSelectorComponentProps extends AccountSelectorProps {
  onAccountSelect: (
    type: "debitAccount" | "creditAccount",
    index: number,
    account: string,
  ) => void;
}

export const AccountSelector: React.FC<AccountSelectorComponentProps> = ({
  visible,
  onSelect,
  onClose,
  currentSelection,
  onAccountSelect,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const handleAccountSelection = (account: {
    label: string;
    value: string;
  }) => {
    onSelect(account);
  };

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
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
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
                onPress={() => handleAccountSelection(item)}
              >
                <Text style={styles.modalItemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
};

/**
 * iOS用ActionSheet表示
 */
export const showIOSAccountSelector = (
  type: "debitAccount" | "creditAccount",
  index: number,
  onSelect: (
    type: "debitAccount" | "creditAccount",
    index: number,
    account: string,
  ) => void,
): void => {
  if (Platform.OS !== "ios") return;

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
        onSelect(type, index, selectedAccount.value);
      }
    },
  );
};

/**
 * 勘定科目選択ピッカー
 */
interface AccountPickerProps {
  value: string;
  onPress: () => void;
  placeholder?: string;
}

export const AccountPicker: React.FC<AccountPickerProps> = ({
  value,
  onPress,
  placeholder = "勘定科目を選択",
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <TouchableOpacity style={styles.accountPickerContainer} onPress={onPress}>
      <Text
        style={[
          styles.accountPickerText,
          {
            color: value ? theme.colors.text : theme.colors.textSecondary,
          },
        ]}
      >
        {value || placeholder}
      </Text>
      <Text style={styles.accountPickerArrow}>▼</Text>
    </TouchableOpacity>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: theme.colors.background,
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
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.error,
    },
    modalCloseText: {
      color: theme.colors.surface,
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
      minHeight: 50,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 4,
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 12,
      flexDirection: "row",
      backgroundColor: theme.colors.background,
    },
    accountPickerText: {
      fontSize: 14,
      flex: 1,
    },
    accountPickerArrow: {
      fontSize: 12,
      marginLeft: 8,
      color: theme.colors.primary,
    },
  });
