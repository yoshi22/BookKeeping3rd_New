import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActionSheetIOS,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

export interface FinancialStatementEntry {
  accountName: string;
  amount: number;
}

export interface FinancialStatementFormProps {
  onSubmit: (data: {
    balanceSheet: {
      assets: FinancialStatementEntry[];
      liabilities: FinancialStatementEntry[];
      equity: FinancialStatementEntry[];
    };
    incomeStatement: {
      revenues: FinancialStatementEntry[];
      expenses: FinancialStatementEntry[];
      netIncome: number;
    };
  }) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  questionNumber: number;
  totalQuestions: number;
  timeRemaining: string;
  explanation?: string;
  correctAnswer?: any;
  userAnswer?: any;
  isCorrect?: boolean;
  showExplanation?: boolean;
  questionText?: string;
}

const ACCOUNT_OPTIONS = [
  { label: "勘定科目を選択", value: "" },
  // 資産（Assets）
  { label: "現金", value: "現金", category: "assets" },
  { label: "当座預金", value: "当座預金", category: "assets" },
  { label: "普通預金", value: "普通預金", category: "assets" },
  { label: "小口現金", value: "小口現金", category: "assets" },
  { label: "売掛金", value: "売掛金", category: "assets" },
  { label: "受取手形", value: "受取手形", category: "assets" },
  { label: "商品", value: "商品", category: "assets" },
  { label: "前払金", value: "前払金", category: "assets" },
  { label: "前払費用", value: "前払費用", category: "assets" },
  { label: "仮払金", value: "仮払金", category: "assets" },
  { label: "貸付金", value: "貸付金", category: "assets" },
  { label: "建物", value: "建物", category: "assets" },
  { label: "備品", value: "備品", category: "assets" },
  { label: "土地", value: "土地", category: "assets" },
  { label: "車両運搬具", value: "車両運搬具", category: "assets" },

  // 負債（Liabilities）
  { label: "買掛金", value: "買掛金", category: "liabilities" },
  { label: "支払手形", value: "支払手形", category: "liabilities" },
  { label: "前受金", value: "前受金", category: "liabilities" },
  { label: "前受収益", value: "前受収益", category: "liabilities" },
  { label: "仮受金", value: "仮受金", category: "liabilities" },
  { label: "未払金", value: "未払金", category: "liabilities" },
  { label: "未払費用", value: "未払費用", category: "liabilities" },
  { label: "借入金", value: "借入金", category: "liabilities" },
  { label: "預り金", value: "預り金", category: "liabilities" },
  { label: "貸倒引当金", value: "貸倒引当金", category: "liabilities" },
  { label: "減価償却累計額", value: "減価償却累計額", category: "liabilities" },

  // 純資産（Equity）
  { label: "資本金", value: "資本金", category: "equity" },
  { label: "繰越利益剰余金", value: "繰越利益剰余金", category: "equity" },
  { label: "当期純利益", value: "当期純利益", category: "equity" },
  { label: "当期純損失", value: "当期純損失", category: "equity" },

  // 収益（Revenues）
  { label: "売上高", value: "売上高", category: "revenues" },
  { label: "受取利息", value: "受取利息", category: "revenues" },
  { label: "受取手数料", value: "受取手数料", category: "revenues" },
  { label: "受取配当金", value: "受取配当金", category: "revenues" },
  { label: "固定資産売却益", value: "固定資産売却益", category: "revenues" },

  // 費用（Expenses）
  { label: "仕入", value: "仕入", category: "expenses" },
  { label: "給料", value: "給料", category: "expenses" },
  { label: "支払利息", value: "支払利息", category: "expenses" },
  { label: "支払手数料", value: "支払手数料", category: "expenses" },
  { label: "減価償却費", value: "減価償却費", category: "expenses" },
  { label: "貸倒引当金繰入", value: "貸倒引当金繰入", category: "expenses" },
  { label: "租税公課", value: "租税公課", category: "expenses" },
  { label: "水道光熱費", value: "水道光熱費", category: "expenses" },
  { label: "通信費", value: "通信費", category: "expenses" },
  { label: "旅費交通費", value: "旅費交通費", category: "expenses" },
  { label: "消耗品費", value: "消耗品費", category: "expenses" },
  { label: "修繕費", value: "修繕費", category: "expenses" },
  { label: "保険料", value: "保険料", category: "expenses" },
  { label: "固定資産売却損", value: "固定資産売却損", category: "expenses" },
];

export default function FinancialStatementForm({
  onSubmit,
  onNext,
  onPrevious,
  questionNumber,
  totalQuestions,
  timeRemaining,
  explanation,
  correctAnswer,
  userAnswer,
  isCorrect,
  showExplanation,
  questionText,
}: FinancialStatementFormProps) {
  const { theme } = useTheme();

  // 貸借対照表のエントリ
  const [assets, setAssets] = useState<FinancialStatementEntry[]>([
    { accountName: "", amount: 0 },
  ]);
  const [liabilities, setLiabilities] = useState<FinancialStatementEntry[]>([
    { accountName: "", amount: 0 },
  ]);
  const [equity, setEquity] = useState<FinancialStatementEntry[]>([
    { accountName: "", amount: 0 },
  ]);

  // 損益計算書のエントリ
  const [revenues, setRevenues] = useState<FinancialStatementEntry[]>([
    { accountName: "", amount: 0 },
  ]);
  const [expenses, setExpenses] = useState<FinancialStatementEntry[]>([
    { accountName: "", amount: 0 },
  ]);

  // モーダル表示制御
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<{
    type: "assets" | "liabilities" | "equity" | "revenues" | "expenses";
    index: number;
  } | null>(null);

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("ja-JP");
  };

  const updateEntry = useCallback(
    (
      type: "assets" | "liabilities" | "equity" | "revenues" | "expenses",
      index: number,
      field: "accountName" | "amount",
      value: string | number,
    ) => {
      const updateFunction = {
        assets: setAssets,
        liabilities: setLiabilities,
        equity: setEquity,
        revenues: setRevenues,
        expenses: setExpenses,
      }[type];

      updateFunction((prevEntries) => {
        const newEntries = [...prevEntries];
        newEntries[index] = { ...newEntries[index], [field]: value };
        return newEntries;
      });
    },
    [],
  );

  const addEntry = (
    type: "assets" | "liabilities" | "equity" | "revenues" | "expenses",
  ) => {
    const updateFunction = {
      assets: setAssets,
      liabilities: setLiabilities,
      equity: setEquity,
      revenues: setRevenues,
      expenses: setExpenses,
    }[type];

    updateFunction((prev) => [...prev, { accountName: "", amount: 0 }]);
  };

  const removeEntry = (
    type: "assets" | "liabilities" | "equity" | "revenues" | "expenses",
    index: number,
  ) => {
    const updateFunction = {
      assets: setAssets,
      liabilities: setLiabilities,
      equity: setEquity,
      revenues: setRevenues,
      expenses: setExpenses,
    }[type];

    updateFunction((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== index) : prev,
    );
  };

  const showAccountSelector = (
    type: "assets" | "liabilities" | "equity" | "revenues" | "expenses",
    index: number,
  ) => {
    setCurrentSelection({ type, index });
    setModalVisible(true);
  };

  const selectAccountFromModal = (account: {
    label: string;
    value: string;
    category: string;
  }) => {
    if (currentSelection) {
      updateEntry(
        currentSelection.type,
        currentSelection.index,
        "accountName",
        account.value,
      );
    }
    setModalVisible(false);
    setCurrentSelection(null);
  };

  // 計算
  const getTotalAssets = () =>
    assets.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  const getTotalLiabilities = () =>
    liabilities.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  const getTotalEquity = () =>
    equity.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  const getTotalRevenues = () =>
    revenues.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  const getTotalExpenses = () =>
    expenses.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  const getNetIncome = () => getTotalRevenues() - getTotalExpenses();

  // 貸借対照表バランスチェック
  const isBalanceSheetBalanced = () =>
    getTotalAssets() === getTotalLiabilities() + getTotalEquity();

  const validateAndSubmit = () => {
    // 有効なエントリをフィルタ
    const validAssets = assets.filter(
      (entry) => entry.accountName.trim() && entry.amount > 0,
    );
    const validLiabilities = liabilities.filter(
      (entry) => entry.accountName.trim() && entry.amount > 0,
    );
    const validEquity = equity.filter(
      (entry) => entry.accountName.trim() && entry.amount > 0,
    );
    const validRevenues = revenues.filter(
      (entry) => entry.accountName.trim() && entry.amount > 0,
    );
    const validExpenses = expenses.filter(
      (entry) => entry.accountName.trim() && entry.amount > 0,
    );

    if (
      validAssets.length === 0 ||
      validLiabilities.length === 0 ||
      validEquity.length === 0
    ) {
      Alert.alert(
        "エラー",
        "貸借対照表の各項目に少なくとも1つの有効なエントリを入力してください",
      );
      return;
    }

    if (validRevenues.length === 0 || validExpenses.length === 0) {
      Alert.alert(
        "エラー",
        "損益計算書の収益・費用に少なくとも1つの有効なエントリを入力してください",
      );
      return;
    }

    const data = {
      balanceSheet: {
        assets: validAssets,
        liabilities: validLiabilities,
        equity: validEquity,
      },
      incomeStatement: {
        revenues: validRevenues,
        expenses: validExpenses,
        netIncome: getNetIncome(),
      },
    };

    if (!isBalanceSheetBalanced()) {
      Alert.alert(
        "確認",
        `貸借対照表が一致しませんが、このまま解答しますか？\n資産合計: ${formatCurrency(getTotalAssets())}円\n負債・純資産合計: ${formatCurrency(getTotalLiabilities() + getTotalEquity())}円`,
        [
          { text: "キャンセル", style: "cancel" },
          { text: "解答する", onPress: () => onSubmit(data) },
        ],
      );
    } else {
      onSubmit(data);
    }
  };

  const renderEntrySection = (
    title: string,
    entries: FinancialStatementEntry[],
    type: "assets" | "liabilities" | "equity" | "revenues" | "expenses",
    categoryFilter?: string,
  ) => {
    const categoryOptions = categoryFilter
      ? ACCOUNT_OPTIONS.filter((opt) => opt.category === categoryFilter)
      : ACCOUNT_OPTIONS;

    return (
      <View
        style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {title}
        </Text>

        {entries.map((entry, index) => (
          <View
            key={index}
            style={[
              styles.entryRow,
              { borderBottomColor: theme.colors.border },
            ]}
          >
            <View style={styles.accountCell}>
              <TouchableOpacity
                style={[
                  styles.accountPickerContainer,
                  {
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={() => showAccountSelector(type, index)}
              >
                <Text
                  style={[
                    styles.accountPickerText,
                    {
                      color: entry.accountName
                        ? theme.colors.text
                        : theme.colors.textSecondary,
                    },
                  ]}
                >
                  {entry.accountName || "勘定科目を選択"}
                </Text>
                <Text
                  style={[
                    styles.accountPickerArrow,
                    { color: theme.colors.primary },
                  ]}
                >
                  ▼
                </Text>
              </TouchableOpacity>
              {entries.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeEntry(type, index)}
                  style={[
                    styles.removeButton,
                    { backgroundColor: theme.colors.error },
                  ]}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.amountCell}>
              <TextInput
                style={[
                  styles.amountInput,
                  {
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  },
                ]}
                value={entry.amount > 0 ? entry.amount.toString() : ""}
                onChangeText={(value) => {
                  if (value === "" || /^\d+$/.test(value)) {
                    const numValue = value === "" ? 0 : parseInt(value);
                    updateEntry(type, index, "amount", numValue);
                  }
                }}
                placeholder="0"
                keyboardType="numeric"
                returnKeyType="done"
                selectTextOnFocus={true}
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
          </View>
        ))}

        <TouchableOpacity
          onPress={() => addEntry(type)}
          style={[
            styles.addButton,
            {
              backgroundColor: theme.colors.primary + "20",
              borderColor: theme.colors.primary,
            },
          ]}
        >
          <Text style={[styles.addButtonText, { color: theme.colors.primary }]}>
            + 項目を追加
          </Text>
        </TouchableOpacity>

        <View
          style={[
            styles.totalRow,
            { backgroundColor: theme.colors.primary + "10" },
          ]}
        >
          <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
            {title}合計
          </Text>
          <Text style={[styles.totalAmount, { color: theme.colors.primary }]}>
            {formatCurrency(
              entries.reduce((sum, entry) => sum + (entry.amount || 0), 0),
            )}
            円
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* 貸借対照表 */}
      <Text style={[styles.mainTitle, { color: theme.colors.text }]}>
        貸借対照表
      </Text>

      {renderEntrySection("資産", assets, "assets", "assets")}
      {renderEntrySection("負債", liabilities, "liabilities", "liabilities")}
      {renderEntrySection("純資産", equity, "equity", "equity")}

      {/* 貸借対照表バランス表示 */}
      <View
        style={[
          styles.balanceCheckCard,
          {
            backgroundColor: isBalanceSheetBalanced()
              ? theme.colors.success + "20"
              : theme.colors.error + "20",
            borderColor: isBalanceSheetBalanced()
              ? theme.colors.success
              : theme.colors.error,
          },
        ]}
      >
        <Text
          style={[
            styles.balanceText,
            {
              color: isBalanceSheetBalanced()
                ? theme.colors.success
                : theme.colors.error,
            },
          ]}
        >
          {isBalanceSheetBalanced()
            ? "✅ 貸借対照表が一致しています"
            : "⚠️ 貸借対照表が一致していません"}
        </Text>
        <Text style={[styles.balanceDetail, { color: theme.colors.text }]}>
          資産合計: {formatCurrency(getTotalAssets())}円
        </Text>
        <Text style={[styles.balanceDetail, { color: theme.colors.text }]}>
          負債・純資産合計:{" "}
          {formatCurrency(getTotalLiabilities() + getTotalEquity())}円
        </Text>
      </View>

      {/* 損益計算書 */}
      <Text style={[styles.mainTitle, { color: theme.colors.text }]}>
        損益計算書
      </Text>

      {renderEntrySection("収益", revenues, "revenues", "revenues")}
      {renderEntrySection("費用", expenses, "expenses", "expenses")}

      {/* 当期純利益表示 */}
      <View
        style={[
          styles.netIncomeCard,
          {
            backgroundColor:
              getNetIncome() >= 0
                ? theme.colors.success + "20"
                : theme.colors.error + "20",
            borderColor:
              getNetIncome() >= 0 ? theme.colors.success : theme.colors.error,
          },
        ]}
      >
        <Text style={[styles.netIncomeTitle, { color: theme.colors.text }]}>
          {getNetIncome() >= 0 ? "当期純利益" : "当期純損失"}
        </Text>
        <Text
          style={[
            styles.netIncomeAmount,
            {
              color:
                getNetIncome() >= 0 ? theme.colors.success : theme.colors.error,
            },
          ]}
        >
          {formatCurrency(Math.abs(getNetIncome()))}円
        </Text>
      </View>

      {/* 送信ボタン */}
      <TouchableOpacity
        onPress={validateAndSubmit}
        style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
      >
        <Text
          style={[styles.submitButtonText, { color: theme.colors.background }]}
        >
          財務諸表を提出
        </Text>
      </TouchableOpacity>

      {/* 勘定科目選択モーダル */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <View
              style={[
                styles.modalHeader,
                { borderBottomColor: theme.colors.border },
              ]}
            >
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                勘定科目を選択
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[
                  styles.modalCloseButton,
                  { backgroundColor: theme.colors.error },
                ]}
              >
                <Text style={styles.modalCloseText}>×</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={
                currentSelection
                  ? ACCOUNT_OPTIONS.filter(
                      (opt) =>
                        opt.value !== "" &&
                        opt.category &&
                        opt.category ===
                          {
                            assets: "assets",
                            liabilities: "liabilities",
                            equity: "equity",
                            revenues: "revenues",
                            expenses: "expenses",
                          }[currentSelection.type],
                    )
                  : []
              }
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    { borderBottomColor: theme.colors.border + "30" },
                  ]}
                  onPress={() =>
                    selectAccountFromModal(
                      item as {
                        label: string;
                        value: string;
                        category: string;
                      },
                    )
                  }
                >
                  <Text
                    style={[styles.modalItemText, { color: theme.colors.text }]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  sectionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  entryRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    alignItems: "center",
    marginBottom: 8,
  },
  accountCell: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  accountPickerContainer: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 6,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    flexDirection: "row",
    marginRight: 8,
  },
  accountPickerText: {
    fontSize: 14,
    flex: 1,
  },
  accountPickerArrow: {
    fontSize: 12,
    marginLeft: 8,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  amountCell: {
    flex: 1,
    paddingHorizontal: 4,
  },
  amountInput: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    textAlign: "right",
    minHeight: 44,
  },
  addButton: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  balanceCheckCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    alignItems: "center",
  },
  balanceText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  balanceDetail: {
    fontSize: 14,
    marginBottom: 4,
  },
  netIncomeCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    alignItems: "center",
  },
  netIncomeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  netIncomeAmount: {
    fontSize: 24,
    fontWeight: "bold",
  },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
  },
  modalItemText: {
    fontSize: 16,
  },
});
