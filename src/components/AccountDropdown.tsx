/**
 * CBT形式 勘定科目選択ドロップダウンコンポーネント
 * Step 2.1.3: CBT形式のドロップダウン選択コンポーネント実装
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from "react-native";

// 簿記3級レベルの基本勘定科目データ（仕訳問題用）
const JOURNAL_ACCOUNT_ITEMS = [
  { code: "111", name: "現金", category: "asset" },
  { code: "111-1", name: "現金過不足", category: "asset" },
  { code: "111-2", name: "小口現金", category: "asset" },
  { code: "112", name: "預金", category: "asset" },
  { code: "112-1", name: "当座預金", category: "asset" },
  { code: "112-2", name: "当座借越", category: "liability" },
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
];

interface AccountDropdownProps {
  label: string;
  value?: string;
  onChange: (accountName: string) => void;
  required?: boolean;
  excludeAccounts?: string[]; // 重複使用防止のため除外する勘定科目
  placeholder?: string;
}

export default function AccountDropdown({
  label,
  value,
  onChange,
  required = false,
  excludeAccounts = [],
  placeholder = "勘定科目を選択してください",
}: AccountDropdownProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 除外勘定科目を除いた選択可能な勘定科目リスト
  const availableAccounts = JOURNAL_ACCOUNT_ITEMS.filter(
    (account) => !excludeAccounts.includes(account.name),
  );

  // カテゴリ別にグループ化
  const groupedAccounts = {
    asset: availableAccounts.filter((account) => account.category === "asset"),
    liability: availableAccounts.filter(
      (account) => account.category === "liability",
    ),
    equity: availableAccounts.filter(
      (account) => account.category === "equity",
    ),
    revenue: availableAccounts.filter(
      (account) => account.category === "revenue",
    ),
    expense: availableAccounts.filter(
      (account) => account.category === "expense",
    ),
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case "asset":
        return "資産";
      case "liability":
        return "負債";
      case "equity":
        return "純資産";
      case "revenue":
        return "収益";
      case "expense":
        return "費用";
      default:
        return category;
    }
  };

  const handleAccountSelect = (accountName: string) => {
    onChange(accountName);
    setIsModalVisible(false);
  };

  const openModal = () => {
    if (availableAccounts.length === 0) {
      Alert.alert("選択不可", "選択可能な勘定科目がありません");
      return;
    }
    setIsModalVisible(true);
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
            styles.dropdownButton,
            !value && styles.dropdownButtonEmpty,
            availableAccounts.length === 0 && styles.dropdownButtonDisabled,
          ]}
          onPress={openModal}
          disabled={availableAccounts.length === 0}
        >
          <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
            {value || placeholder}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        {excludeAccounts.length > 0 && (
          <Text style={styles.excludeInfo}>
            {excludeAccounts.length}個の勘定科目が使用済みのため非表示
          </Text>
        )}
      </View>

      {/* 勘定科目選択モーダル */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>勘定科目を選択</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {Object.entries(groupedAccounts).map(
                ([category, accounts]) =>
                  accounts.length > 0 && (
                    <View key={category} style={styles.categorySection}>
                      <Text style={styles.categoryTitle}>
                        {getCategoryName(category)}
                      </Text>
                      {accounts.map((account) => (
                        <TouchableOpacity
                          key={account.code}
                          style={[
                            styles.accountItem,
                            value === account.name &&
                              styles.accountItemSelected,
                          ]}
                          onPress={() => handleAccountSelect(account.name)}
                        >
                          <Text
                            style={[
                              styles.accountName,
                              value === account.name &&
                                styles.accountNameSelected,
                            ]}
                          >
                            {account.name}
                          </Text>
                          <Text style={styles.accountCode}>{account.code}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ),
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>キャンセル</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  required: {
    color: "#d32f2f",
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "white",
    minHeight: 48,
  },
  dropdownButtonEmpty: {
    borderColor: "#ccc",
  },
  dropdownButtonDisabled: {
    backgroundColor: "#f5f5f5",
    borderColor: "#e0e0e0",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  placeholderText: {
    color: "#999",
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
  },
  excludeInfo: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    width: "98%",
    height: "80%",
    minHeight: "70%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#666",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2f95dc",
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  accountItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  accountItemSelected: {
    backgroundColor: "#e3f2fd",
    borderWidth: 1,
    borderColor: "#2f95dc",
  },
  accountName: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  accountNameSelected: {
    fontWeight: "bold",
    color: "#2f95dc",
  },
  accountCode: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  cancelButton: {
    padding: 12,
    borderRadius: 6,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666",
  },
});
