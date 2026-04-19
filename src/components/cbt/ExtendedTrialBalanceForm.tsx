// @ts-nocheck
/**
 * 8桁精算表CBTフォームコンポーネント
 * 試算表・修正記入・損益計算書・貸借対照表の複合表
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

interface ExtendedTrialBalanceFormProps {
  template: CBTAnswerTemplate;
  initialData?: Record<string, any>[];
  onDataChange: (data: Record<string, any>[]) => void;
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

interface CellData {
  [key: string]: string | number;
}

export const ExtendedTrialBalanceForm: React.FC<
  ExtendedTrialBalanceFormProps
> = ({ template, initialData = [], onDataChange, onValidationChange }) => {
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

  // 計算式の評価（8桁精算表用）
  const calculateFormula = (
    formula: string,
    data: CellData[],
    rowIndex: number,
  ): number => {
    try {
      const currentRow = data[rowIndex];

      switch (formula) {
        case "tb_debit + adj_debit":
          // 試算表借方 + 修正記入借方
          const tbDebit = (currentRow.trial_balance_debit as number) || 0;
          const adjDebit = (currentRow.adjustment_debit as number) || 0;
          return tbDebit + adjDebit;

        case "tb_credit + adj_credit":
          // 試算表貸方 + 修正記入貸方
          const tbCredit = (currentRow.trial_balance_credit as number) || 0;
          const adjCredit = (currentRow.adjustment_credit as number) || 0;
          return tbCredit + adjCredit;

        case "pl_debit_calc":
          // 損益計算書借方の自動計算
          const accountType = currentRow.account_type as string;
          if (accountType === "expense" || accountType === "cost") {
            const totalDebit =
              ((currentRow.trial_balance_debit as number) || 0) +
              ((currentRow.adjustment_debit as number) || 0);
            const totalCredit =
              ((currentRow.trial_balance_credit as number) || 0) +
              ((currentRow.adjustment_credit as number) || 0);
            return Math.max(0, totalDebit - totalCredit);
          }
          return 0;

        case "pl_credit_calc":
          // 損益計算書貸方の自動計算
          const accountTypeCredit = currentRow.account_type as string;
          if (
            accountTypeCredit === "revenue" ||
            accountTypeCredit === "income"
          ) {
            const totalDebit =
              ((currentRow.trial_balance_debit as number) || 0) +
              ((currentRow.adjustment_debit as number) || 0);
            const totalCredit =
              ((currentRow.trial_balance_credit as number) || 0) +
              ((currentRow.adjustment_credit as number) || 0);
            return Math.max(0, totalCredit - totalDebit);
          }
          return 0;

        case "bs_debit_calc":
          // 貸借対照表借方の自動計算
          const bsAccountType = currentRow.account_type as string;
          if (bsAccountType === "asset") {
            const totalDebit =
              ((currentRow.trial_balance_debit as number) || 0) +
              ((currentRow.adjustment_debit as number) || 0);
            const totalCredit =
              ((currentRow.trial_balance_credit as number) || 0) +
              ((currentRow.adjustment_credit as number) || 0);
            return Math.max(0, totalDebit - totalCredit);
          }
          return 0;

        case "bs_credit_calc":
          // 貸借対照表貸方の自動計算
          const bsCreditAccountType = currentRow.account_type as string;
          if (
            bsCreditAccountType === "liability" ||
            bsCreditAccountType === "equity"
          ) {
            const totalDebit =
              ((currentRow.trial_balance_debit as number) || 0) +
              ((currentRow.adjustment_debit as number) || 0);
            const totalCredit =
              ((currentRow.trial_balance_credit as number) || 0) +
              ((currentRow.adjustment_credit as number) || 0);
            return Math.max(0, totalCredit - totalDebit);
          }
          return 0;

        case "sum_column":
          // 列の合計計算
          const columnKey = formula.split(":")[1];
          return data.reduce((sum, row) => {
            return sum + ((row[columnKey] as number) || 0);
          }, 0);

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

    // 8桁精算表特有の検証
    const plDebitTotal = data.reduce(
      (sum, row) => sum + ((row.pl_debit as number) || 0),
      0,
    );
    const plCreditTotal = data.reduce(
      (sum, row) => sum + ((row.pl_credit as number) || 0),
      0,
    );
    const bsDebitTotal = data.reduce(
      (sum, row) => sum + ((row.bs_debit as number) || 0),
      0,
    );
    const bsCreditTotal = data.reduce(
      (sum, row) => sum + ((row.bs_credit as number) || 0),
      0,
    );

    // 損益計算書の貸借差額（当期純利益・純損失）
    const netIncome = plCreditTotal - plDebitTotal;

    // 貸借対照表の貸借平均チェック（当期純利益考慮）
    const expectedBsCredit = bsCreditTotal + Math.max(0, netIncome);
    const expectedBsDebit = bsDebitTotal + Math.max(0, -netIncome);

    if (Math.abs(expectedBsCredit - expectedBsDebit) > 0.01) {
      errors.push("貸借対照表の借方と貸方が一致しません（当期純利益を考慮）");
    }

    setValidationErrors(errors);
    onValidationChange?.(errors.length === 0, errors);
  };

  // ドロップダウン選択肢の取得
  const getDropdownOptions = (column: ColumnDefinition): string[] => {
    if (column.options_ref === "allowed_accounts") {
      return template.allowed_accounts;
    }

    // 8桁精算表特有の選択肢
    if (column.key === "account_type") {
      return ["asset", "liability", "equity", "revenue", "expense", "cost"];
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

  // 列グループの描画
  const getColumnGroup = (columnKey: string): string => {
    if (columnKey.includes("trial_balance")) return "trial_balance";
    if (columnKey.includes("adjustment")) return "adjustment";
    if (columnKey.includes("pl_")) return "profit_loss";
    if (columnKey.includes("bs_")) return "balance_sheet";
    return "account";
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
            testID={`extended-tb-cell-${rowIndex}-${column.key}`}
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
            testID={`extended-tb-cell-${rowIndex}-${column.key}`}
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

      default:
        return (
          <TextInput
            style={[styles.textInput, !isEditable && styles.disabledCell]}
            value={cellValue.toString()}
            onChangeText={(text) => updateCellValue(rowIndex, column.key, text)}
            placeholder={column.placeholder}
            editable={isEditable}
            testID={`extended-tb-cell-${rowIndex}-${column.key}`}
          />
        );
    }
  };

  // 列グループヘッダーの描画
  const renderColumnGroupHeaders = () => {
    const groups = [
      { key: "account", label: "勘定科目", span: 1, color: "#333333" },
      { key: "trial_balance", label: "試算表", span: 2, color: "#1976D2" },
      { key: "adjustment", label: "修正記入", span: 2, color: "#9C27B0" },
      { key: "profit_loss", label: "損益計算書", span: 2, color: "#F57C00" },
      { key: "balance_sheet", label: "貸借対照表", span: 2, color: "#388E3C" },
    ];

    return (
      <View style={styles.groupHeader}>
        {groups.map((group) => (
          <View
            key={group.key}
            style={[
              styles.groupHeaderCell,
              {
                flex: group.span,
                backgroundColor: `${group.color}20`,
                borderBottomColor: group.color,
              },
            ]}
          >
            <Text style={[styles.groupHeaderText, { color: group.color }]}>
              {group.label}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
      <View style={styles.container} testID="extended-trial-balance-form">
        {/* 8桁精算表タイトル */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>8桁精算表</Text>
          <Text style={styles.subtitleText}>
            試算表・修正記入・損益計算書・貸借対照表
          </Text>
        </View>

        {/* 列グループヘッダー */}
        {renderColumnGroupHeaders()}

        {/* テーブルヘッダー */}
        <View style={styles.tableHeader}>
          {template.columns.map((column) => (
            <View
              key={column.key}
              style={[
                styles.headerCell,
                {
                  width: column.width,
                  backgroundColor: getColumnGroupColor(
                    getColumnGroup(column.key),
                  ),
                },
              ]}
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
                    testID={`extended-tb-option-${option}`}
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
    </ScrollView>
  );
};

// 列グループの色を取得
const getColumnGroupColor = (group: string): string => {
  switch (group) {
    case "trial_balance":
      return "#E3F2FD";
    case "adjustment":
      return "#F3E5F5";
    case "profit_loss":
      return "#FFF3E0";
    case "balance_sheet":
      return "#E8F5E8";
    default:
      return "#F5F5F5";
  }
};

const styles = StyleSheet.create({
  container: {
    minWidth: 1000,
    backgroundColor: "#FFFFFF",
  },
  titleContainer: {
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginTop: 4,
  },
  groupHeader: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  groupHeaderCell: {
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
    borderBottomWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  groupHeaderText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#666666",
  },
  headerCell: {
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
  },
  headerText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333333",
    textAlign: "center",
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
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
    minHeight: 40,
    justifyContent: "center",
  },
  dropdownCell: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    paddingVertical: 4,
    backgroundColor: "#FAFAFA",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  dropdownText: {
    fontSize: 12,
    color: "#333333",
    flex: 1,
  },
  currencyInput: {
    fontSize: 12,
    color: "#333333",
    textAlign: "right",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  textInput: {
    fontSize: 12,
    color: "#333333",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  computedCell: {
    backgroundColor: "#F8F9FA",
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  computedText: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "500",
  },
  disabledCell: {
    backgroundColor: "#F8F9FA",
    opacity: 0.7,
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
