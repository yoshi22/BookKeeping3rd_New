/**
 * 伝票CBTフォームコンポーネント
 * 仕訳伝票・入金伝票・出金伝票の記入用固定レイアウト
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type {
  CBTAnswerTemplate,
  ColumnDefinition,
  RowDefinition,
} from "@/types/models";

interface VoucherFormProps {
  template: CBTAnswerTemplate;
  initialData?: Record<string, any>[];
  onDataChange: (data: Record<string, any>[]) => void;
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

interface CellData {
  [key: string]: string | number;
}

export const VoucherForm: React.FC<VoucherFormProps> = ({
  template,
  initialData = [],
  onDataChange,
  onValidationChange,
}) => {
  const [tableData, setTableData] = useState<CellData[]>([]);
  const [selectedDropdown, setSelectedDropdown] = useState<{
    rowIndex: number;
    columnKey: string;
  } | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

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
    const initialRows: CellData[] = template.rows.map((row) => {
      const rowData: CellData = { row_id: row.row_id };

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

    // 自動計算列の更新
    updateComputedColumns(newData, rowIndex);

    setTableData(newData);
    onDataChange(newData);
    validateData(newData);
  };

  // 自動計算列の更新
  const updateComputedColumns = (data: CellData[], changedRowIndex: number) => {
    template.columns.forEach((col) => {
      if (col.input === "computed" && col.formula) {
        data.forEach((row, rowIndex) => {
          const computedValue = calculateFormula(col.formula!, data, rowIndex);
          data[rowIndex][col.key] = computedValue;
        });
      }
    });
  };

  // 計算式の評価（伝票用）
  const calculateFormula = (
    formula: string,
    data: CellData[],
    rowIndex: number,
  ): number => {
    try {
      const currentRow = data[rowIndex];

      switch (formula) {
        case "sum_debit":
          // 借方合計
          return data.reduce((sum, row) => {
            const debit = (row.debit as number) || 0;
            return sum + debit;
          }, 0);

        case "sum_credit":
          // 貸方合計
          return data.reduce((sum, row) => {
            const credit = (row.credit as number) || 0;
            return sum + credit;
          }, 0);

        case "balance_check":
          // 貸借差額
          const totalDebit = data.reduce(
            (sum, row) => sum + ((row.debit as number) || 0),
            0,
          );
          const totalCredit = data.reduce(
            (sum, row) => sum + ((row.credit as number) || 0),
            0,
          );
          return totalDebit - totalCredit;

        case "line_total":
          // 行の合計（複合仕訳の場合）
          const lineDebit = (currentRow.debit as number) || 0;
          const lineCredit = (currentRow.credit as number) || 0;
          return lineDebit + lineCredit;

        default:
          return 0;
      }
    } catch {
      return 0;
    }
  };

  // データの検証
  const validateData = (data: CellData[]) => {
    const errors: string[] = [];

    data.forEach((row, index) => {
      const rowDef = template.rows[index];
      if (rowDef?.locked) return; // ロック行はスキップ

      template.columns.forEach((col) => {
        if (col.required && !row[col.key]) {
          errors.push(
            `${rowDef?.label || `行${index + 1}`}の${col.label}は必須です`,
          );
        }
      });
    });

    // 伝票特有の検証
    const totalDebit = data.reduce(
      (sum, row) => sum + ((row.debit as number) || 0),
      0,
    );
    const totalCredit = data.reduce(
      (sum, row) => sum + ((row.credit as number) || 0),
      0,
    );

    if (
      Math.abs(totalDebit - totalCredit) > 0.01 &&
      template.layout_variant === "journal"
    ) {
      errors.push("借方と貸方の合計金額が一致しません");
    }

    // 入金伝票・出金伝票の検証
    if (template.layout_variant === "receipt" && totalCredit === 0) {
      errors.push("入金伝票では貸方金額の入力が必要です");
    }
    if (template.layout_variant === "payment" && totalDebit === 0) {
      errors.push("出金伝票では借方金額の入力が必要です");
    }

    setValidationErrors(errors);
    onValidationChange?.(errors.length === 0, errors);
  };

  // ドロップダウン選択肢の取得
  const getDropdownOptions = (column: ColumnDefinition): string[] => {
    if (column.options_ref === "allowed_accounts") {
      return template.allowed_accounts;
    }

    // 伝票特有の選択肢
    if (column.key === "voucher_type") {
      return ["仕訳伝票", "入金伝票", "出金伝票", "振替伝票"];
    }

    if (column.key === "department") {
      return ["営業部", "経理部", "総務部", "製造部", "購買部"];
    }

    return [];
  };

  // ドロップダウンを開く
  const openDropdown = (rowIndex: number, columnKey: string) => {
    setSelectedDropdown({ rowIndex, columnKey });
  };

  // ドロップダウンで選択
  const selectDropdownOption = (option: string) => {
    if (selectedDropdown) {
      updateCellValue(
        selectedDropdown.rowIndex,
        selectedDropdown.columnKey,
        option,
      );
      setSelectedDropdown(null);
    }
  };

  // 行が編集可能かチェック
  const isRowEditable = (rowIndex: number): boolean => {
    const rowDef = template.rows[rowIndex];
    return !rowDef?.locked;
  };

  // 伝票種別の取得
  const getVoucherTypeLabel = (): string => {
    switch (template.layout_variant) {
      case "journal":
        return "仕訳伝票";
      case "receipt":
        return "入金伝票";
      case "payment":
        return "出金伝票";
      case "transfer":
        return "振替伝票";
      default:
        return "伝票";
    }
  };

  // セルの描画
  const renderCell = (
    row: CellData,
    column: ColumnDefinition,
    rowIndex: number,
  ): React.ReactNode => {
    const isEditable = isRowEditable(rowIndex) && column.input !== "computed";
    const cellValue = row[column.key] || "";

    switch (column.input) {
      case "dropdown":
        return (
          <TouchableOpacity
            style={[styles.dropdownCell, !isEditable && styles.disabledCell]}
            onPress={() => isEditable && openDropdown(rowIndex, column.key)}
            disabled={!isEditable}
            testID={`voucher-cell-${rowIndex}-${column.key}`}
          >
            <Text style={styles.dropdownText}>
              {cellValue || column.placeholder}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#666666" />
          </TouchableOpacity>
        );

      case "currency":
        return (
          <TextInput
            style={[styles.currencyInput, !isEditable && styles.disabledCell]}
            value={cellValue.toString()}
            onChangeText={(text) => {
              const numValue = parseFloat(text.replace(/[^\d.-]/g, "")) || 0;
              updateCellValue(rowIndex, column.key, numValue);
            }}
            keyboardType="numeric"
            placeholder={column.placeholder}
            editable={isEditable}
            testID={`voucher-cell-${rowIndex}-${column.key}`}
          />
        );

      case "computed":
        return (
          <View style={[styles.computedCell, styles.disabledCell]}>
            <Text style={styles.computedText}>
              {typeof cellValue === "number"
                ? cellValue.toLocaleString()
                : cellValue}
            </Text>
          </View>
        );

      case "date":
        return (
          <TextInput
            style={[styles.dateInput, !isEditable && styles.disabledCell]}
            value={cellValue.toString()}
            onChangeText={(text) => updateCellValue(rowIndex, column.key, text)}
            placeholder={column.placeholder || "MM/DD"}
            maxLength={5}
            editable={isEditable}
            testID={`voucher-cell-${rowIndex}-${column.key}`}
          />
        );

      case "number":
        return (
          <TextInput
            style={[styles.numberInput, !isEditable && styles.disabledCell]}
            value={cellValue.toString()}
            onChangeText={(text) => {
              const numValue = parseInt(text.replace(/[^\d]/g, ""), 10) || 0;
              updateCellValue(rowIndex, column.key, numValue);
            }}
            keyboardType="numeric"
            placeholder={column.placeholder}
            editable={isEditable}
            testID={`voucher-cell-${rowIndex}-${column.key}`}
          />
        );

      default:
        return (
          <TextInput
            style={[styles.textInput, !isEditable && styles.disabledCell]}
            value={cellValue.toString()}
            onChangeText={(text) => updateCellValue(rowIndex, column.key, text)}
            placeholder={column.placeholder}
            editable={isEditable}
            testID={`voucher-cell-${rowIndex}-${column.key}`}
          />
        );
    }
  };

  return (
    <View style={styles.container} testID="voucher-form">
      {/* 伝票ヘッダー */}
      <View style={styles.voucherHeader}>
        <Text style={styles.voucherTitle}>{getVoucherTypeLabel()}</Text>
        <View style={styles.voucherInfo}>
          <Text style={styles.voucherNumber}>No. ___________</Text>
          <Text style={styles.voucherDate}>日付: 令和___年___月___日</Text>
        </View>
      </View>

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

      {/* 合計行（伝票の場合） */}
      {template.layout_variant === "journal" && (
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>合計</Text>
          <Text style={styles.totalAmount}>
            借方:{" "}
            {tableData
              .reduce((sum, row) => sum + ((row.debit as number) || 0), 0)
              .toLocaleString()}
          </Text>
          <Text style={styles.totalAmount}>
            貸方:{" "}
            {tableData
              .reduce((sum, row) => sum + ((row.credit as number) || 0), 0)
              .toLocaleString()}
          </Text>
        </View>
      )}

      {/* ドロップダウンオーバーレイ */}
      {selectedDropdown && (
        <View style={styles.dropdownOverlay}>
          <TouchableOpacity
            style={styles.dropdownBackdrop}
            onPress={() => setSelectedDropdown(null)}
          />
          <View style={styles.dropdownMenu}>
            <ScrollView style={styles.dropdownList}>
              {getDropdownOptions(
                template.columns.find(
                  (col) => col.key === selectedDropdown.columnKey,
                )!,
              ).map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownOption}
                  onPress={() => selectDropdownOption(option)}
                  testID={`voucher-option-${option}`}
                >
                  <Text style={styles.dropdownOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

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
  },
  voucherHeader: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#4CAF50",
  },
  voucherTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 8,
  },
  voucherInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  voucherNumber: {
    fontSize: 14,
    color: "#666666",
  },
  voucherDate: {
    fontSize: 14,
    color: "#666666",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#E8F5E8",
    borderBottomWidth: 2,
    borderBottomColor: "#4CAF50",
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
    color: "#2E7D32",
  },
  tableBody: {
    flex: 1,
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
  dropdownCell: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: "#FAFAFA",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  dropdownText: {
    fontSize: 14,
    color: "#333333",
    flex: 1,
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
  dateInput: {
    fontSize: 14,
    color: "#333333",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontFamily: "monospace",
  },
  numberInput: {
    fontSize: 14,
    color: "#333333",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  computedCell: {
    backgroundColor: "#F8F9FA",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  computedText: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  disabledCell: {
    backgroundColor: "#F8F9FA",
    opacity: 0.7,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#E8F5E8",
    padding: 12,
    borderTopWidth: 2,
    borderTopColor: "#4CAF50",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E7D32",
  },
  dropdownOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  dropdownBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  dropdownMenu: {
    position: "absolute",
    top: "50%",
    left: "10%",
    right: "10%",
    maxHeight: 300,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownList: {
    maxHeight: 250,
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  dropdownOptionText: {
    fontSize: 14,
    color: "#333333",
  },
  errorContainer: {
    backgroundColor: "#FFEBEE",
    padding: 12,
    margin: 16,
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
