/**
 * 試算表CBTフォームコンポーネント
 * 合計残高試算表（3列）と8桁精算表（7列）に対応
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { CBTAnswerTemplate, ColumnDefinition } from "@/types/models";

interface TrialBalanceFormProps {
  template: CBTAnswerTemplate;
  initialData?: Record<string, any>[];
  onDataChange: (data: Record<string, any>[]) => void;
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

interface TrialBalanceData {
  [key: string]: string | number;
}

interface AdjustmentEntry {
  description: string;
  debit_account: string;
  debit_amount: number;
  credit_account: string;
  credit_amount: number;
}

export const TrialBalanceForm: React.FC<TrialBalanceFormProps> = ({
  template,
  initialData = [],
  onDataChange,
  onValidationChange,
}) => {
  const [tableData, setTableData] = useState<TrialBalanceData[]>([]);
  const [adjustmentEntries, setAdjustmentEntries] = useState<AdjustmentEntry[]>(
    [
      {
        description: "",
        debit_account: "",
        debit_amount: 0,
        credit_account: "",
        credit_amount: 0,
      },
      {
        description: "",
        debit_account: "",
        debit_amount: 0,
        credit_account: "",
        credit_amount: 0,
      },
    ],
  );
  const [totals, setTotals] = useState({ debit: 0, credit: 0 });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // 8桁精算表かどうかの判定
  const isExtended = template.layout_variant === "trial_v2";

  // 初期データの設定
  useEffect(() => {
    if (initialData.length > 0) {
      setTableData(initialData);
    } else {
      initializeTableData();
    }
  }, [template]);

  // テーブルデータの初期化
  const initializeTableData = () => {
    const initialRows: TrialBalanceData[] = template.rows.map((row) => {
      const rowData: TrialBalanceData = { row_id: row.row_id };

      // デフォルト値を設定
      if (row.default_values) {
        Object.assign(rowData, row.default_values);
      }

      // 列の初期値を設定
      template.columns.forEach((col) => {
        if (!(col.key in rowData)) {
          rowData[col.key] = col.input === "currency" ? 0 : "";
        }
      });

      return rowData;
    });

    setTableData(initialRows);
  };

  // セルの値更新
  const updateCellValue = (
    rowIndex: number,
    columnKey: string,
    value: string | number,
  ) => {
    const newData = [...tableData];
    newData[rowIndex] = { ...newData[rowIndex], [columnKey]: value };

    setTableData(newData);
    updateTotals(newData);
    onDataChange(newData);
    validateData(newData);
  };

  // 調整仕訳の更新
  const updateAdjustmentEntry = (
    entryIndex: number,
    field: keyof AdjustmentEntry,
    value: string | number,
  ) => {
    const newEntries = [...adjustmentEntries];
    newEntries[entryIndex] = { ...newEntries[entryIndex], [field]: value };
    setAdjustmentEntries(newEntries);

    // 調整仕訳を試算表に反映
    applyAdjustmentEntries(newEntries);
  };

  // 調整仕訳を試算表に反映
  const applyAdjustmentEntries = (entries: AdjustmentEntry[]) => {
    // 実装は簡略化
    // 実際にはここで調整仕訳の内容を試算表の該当勘定科目に反映する
    console.log("調整仕訳適用:", entries);
  };

  // 合計計算
  const updateTotals = (data: TrialBalanceData[]) => {
    let debitTotal = 0;
    let creditTotal = 0;

    data.forEach((row) => {
      const debit = parseFloat(row.debit?.toString() || "0") || 0;
      const credit = parseFloat(row.credit?.toString() || "0") || 0;
      debitTotal += debit;
      creditTotal += credit;
    });

    setTotals({ debit: debitTotal, credit: creditTotal });
  };

  // データの検証
  const validateData = (data: TrialBalanceData[]) => {
    const errors: string[] = [];

    // 借方と貸方の合計一致チェック
    const debitTotal = data.reduce(
      (sum, row) => sum + (parseFloat(row.debit?.toString() || "0") || 0),
      0,
    );
    const creditTotal = data.reduce(
      (sum, row) => sum + (parseFloat(row.credit?.toString() || "0") || 0),
      0,
    );

    if (Math.abs(debitTotal - creditTotal) > 0.01) {
      errors.push("借方と貸方の合計が一致していません");
    }

    // 必須項目チェック
    data.forEach((row, index) => {
      template.columns.forEach((col) => {
        if (col.required && !row[col.key]) {
          errors.push(`${index + 1}行目の${col.label}は必須です`);
        }
      });
    });

    setValidationErrors(errors);
    onValidationChange?.(errors.length === 0, errors);
  };

  // セルの描画
  const renderCell = (
    row: TrialBalanceData,
    column: ColumnDefinition,
    rowIndex: number,
  ): React.ReactNode => {
    const cellValue = row[column.key] || "";

    switch (column.input) {
      case "currency":
        return (
          <TextInput
            style={styles.currencyInput}
            value={cellValue.toString()}
            onChangeText={(text) => {
              const numValue = parseFloat(text.replace(/[^\d.-]/g, "")) || 0;
              updateCellValue(rowIndex, column.key, numValue);
            }}
            keyboardType="numeric"
            placeholder="0"
            testID={`cell-${rowIndex}-${column.key}`}
          />
        );

      default:
        return (
          <TextInput
            style={styles.textInput}
            value={cellValue.toString()}
            onChangeText={(text) => updateCellValue(rowIndex, column.key, text)}
            placeholder={column.placeholder || ""}
            testID={`cell-${rowIndex}-${column.key}`}
          />
        );
    }
  };

  // 調整仕訳行の描画
  const renderAdjustmentEntry = (entry: AdjustmentEntry, index: number) => (
    <View key={index} style={styles.adjustmentRow}>
      <Text style={styles.adjustmentNumber}>{index + 1}</Text>

      <TextInput
        style={styles.adjustmentInput}
        value={entry.description}
        onChangeText={(text) =>
          updateAdjustmentEntry(index, "description", text)
        }
        placeholder="摘要"
        testID={`adjustment-${index}-description`}
      />

      <TextInput
        style={styles.adjustmentInput}
        value={entry.debit_account}
        onChangeText={(text) =>
          updateAdjustmentEntry(index, "debit_account", text)
        }
        placeholder="借方科目"
        testID={`adjustment-${index}-debit-account`}
      />

      <TextInput
        style={styles.adjustmentCurrencyInput}
        value={entry.debit_amount.toString()}
        onChangeText={(text) => {
          const numValue = parseFloat(text.replace(/[^\d.-]/g, "")) || 0;
          updateAdjustmentEntry(index, "debit_amount", numValue);
        }}
        keyboardType="numeric"
        placeholder="0"
        testID={`adjustment-${index}-debit-amount`}
      />

      <TextInput
        style={styles.adjustmentInput}
        value={entry.credit_account}
        onChangeText={(text) =>
          updateAdjustmentEntry(index, "credit_account", text)
        }
        placeholder="貸方科目"
        testID={`adjustment-${index}-credit-account`}
      />

      <TextInput
        style={styles.adjustmentCurrencyInput}
        value={entry.credit_amount.toString()}
        onChangeText={(text) => {
          const numValue = parseFloat(text.replace(/[^\d.-]/g, "")) || 0;
          updateAdjustmentEntry(index, "credit_amount", numValue);
        }}
        keyboardType="numeric"
        placeholder="0"
        testID={`adjustment-${index}-credit-amount`}
      />
    </View>
  );

  return (
    <View style={styles.container} testID="trial-balance-form">
      {/* メイン試算表 */}
      <View style={styles.mainTable}>
        <Text style={styles.tableTitle}>
          {isExtended ? "八桁精算表" : "合計残高試算表"}
        </Text>

        {/* テーブルヘッダー */}
        <View style={styles.tableHeader}>
          {template.columns.map((column) => (
            <View
              key={column.key}
              style={[styles.headerCell, { width: column.width }]}
            >
              <Text style={styles.headerText}>{column.label}</Text>
            </View>
          ))}
        </View>

        {/* テーブル本体 */}
        <ScrollView style={styles.tableBody}>
          {tableData.map((row, rowIndex) => (
            <View key={row.row_id} style={styles.tableRow}>
              {template.columns.map((column) => (
                <View
                  key={column.key}
                  style={[styles.tableCell, { width: column.width }]}
                >
                  {renderCell(row, column, rowIndex)}
                </View>
              ))}
            </View>
          ))}
        </ScrollView>

        {/* 合計行 */}
        <View style={styles.totalRow}>
          <View
            style={[styles.totalCell, { width: template.columns[0].width }]}
          >
            <Text style={styles.totalText}>合計</Text>
          </View>
          <View
            style={[styles.totalCell, { width: template.columns[1].width }]}
          >
            <Text style={styles.totalNumber}>
              {totals.debit.toLocaleString()}
            </Text>
          </View>
          <View
            style={[styles.totalCell, { width: template.columns[2].width }]}
          >
            <Text style={styles.totalNumber}>
              {totals.credit.toLocaleString()}
            </Text>
          </View>
          {/* 8桁精算表の場合は追加列 */}
          {isExtended &&
            template.columns.slice(3).map((column) => (
              <View
                key={column.key}
                style={[styles.totalCell, { width: column.width }]}
              >
                <Text style={styles.totalNumber}>0</Text>
              </View>
            ))}
        </View>
      </View>

      {/* 調整仕訳エリア */}
      <View style={styles.adjustmentSection}>
        <Text style={styles.adjustmentTitle}>調整仕訳</Text>

        <View style={styles.adjustmentHeader}>
          <Text style={styles.adjustmentHeaderText}>No.</Text>
          <Text style={styles.adjustmentHeaderText}>摘要</Text>
          <Text style={styles.adjustmentHeaderText}>借方科目</Text>
          <Text style={styles.adjustmentHeaderText}>借方金額</Text>
          <Text style={styles.adjustmentHeaderText}>貸方科目</Text>
          <Text style={styles.adjustmentHeaderText}>貸方金額</Text>
        </View>

        {adjustmentEntries.map((entry, index) =>
          renderAdjustmentEntry(entry, index),
        )}

        {/* 差額表示バー */}
        <View
          style={[
            styles.balanceBar,
            Math.abs(totals.debit - totals.credit) < 0.01
              ? styles.balanceBarGreen
              : styles.balanceBarRed,
          ]}
        >
          <Text style={styles.balanceText}>
            借方 - 貸方 = {(totals.debit - totals.credit).toLocaleString()}
            {Math.abs(totals.debit - totals.credit) < 0.01 && " ✓"}
          </Text>
        </View>
      </View>

      {/* バリデーションエラー表示 */}
      {validationErrors.length > 0 && (
        <View style={styles.errorContainer}>
          {validationErrors.map((error, index) => (
            <Text key={index} style={styles.errorText}>
              ⚠️ {error}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  mainTable: {
    flex: 1,
    marginBottom: 20,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 12,
    textAlign: "center",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderBottomWidth: 2,
    borderBottomColor: "#0066CC",
  },
  headerCell: {
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
  },
  tableBody: {
    flex: 1,
    maxHeight: 300,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  tableCell: {
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
    minHeight: 44,
    justifyContent: "center",
  },
  currencyInput: {
    fontSize: 14,
    color: "#333333",
    textAlign: "right",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  textInput: {
    fontSize: 14,
    color: "#333333",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  totalRow: {
    flexDirection: "row",
    backgroundColor: "#E3F2FD",
    borderTopWidth: 2,
    borderTopColor: "#0066CC",
  },
  totalCell: {
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
  },
  totalText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
  },
  totalNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0066CC",
  },
  adjustmentSection: {
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  adjustmentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 12,
  },
  adjustmentHeader: {
    flexDirection: "row",
    backgroundColor: "#E0E0E0",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  adjustmentHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
    color: "#555555",
    textAlign: "center",
  },
  adjustmentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  adjustmentNumber: {
    width: 30,
    fontSize: 14,
    fontWeight: "500",
    color: "#666666",
    textAlign: "center",
  },
  adjustmentInput: {
    flex: 1,
    fontSize: 12,
    color: "#333333",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginHorizontal: 2,
  },
  adjustmentCurrencyInput: {
    flex: 1,
    fontSize: 12,
    color: "#333333",
    textAlign: "right",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginHorizontal: 2,
  },
  balanceBar: {
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
    alignItems: "center",
  },
  balanceBarGreen: {
    backgroundColor: "#E8F5E8",
    borderColor: "#4CAF50",
    borderWidth: 1,
  },
  balanceBarRed: {
    backgroundColor: "#FFEBEE",
    borderColor: "#F44336",
    borderWidth: 1,
  },
  balanceText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
  },
  errorContainer: {
    backgroundColor: "#FFEBEE",
    padding: 12,
    marginTop: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#F44336",
  },
  errorText: {
    fontSize: 12,
    color: "#D32F2F",
    marginBottom: 4,
  },
});
