// @ts-nocheck
/**
 * 補助元帳CBTフォームコンポーネント
 * 固定レイアウト、顧客・仕入先別詳細管理、自動計算列
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

interface SubsidiaryLedgerFormProps {
  template: CBTAnswerTemplate;
  initialData?: Record<string, any>[];
  onDataChange: (data: Record<string, any>[]) => void;
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

interface CellData {
  [key: string]: string | number;
}

export const SubsidiaryLedgerForm: React.FC<SubsidiaryLedgerFormProps> = ({
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

  // 計算式の評価（補助元帳用）
  const calculateFormula = (
    formula: string,
    data: CellData[],
    rowIndex: number,
  ): number => {
    try {
      const currentRow = data[rowIndex];

      switch (formula) {
        case "prev + debit - credit":
          const prevBalance =
            rowIndex > 0 ? (data[rowIndex - 1].balance as number) || 0 : 0;
          const debit = (currentRow.debit as number) || 0;
          const credit = (currentRow.credit as number) || 0;
          return prevBalance + debit - credit;

        case "running_total":
          // 累計計算（補助元帳特有）
          let total = 0;
          for (let i = 0; i <= rowIndex; i++) {
            const amount = (data[i].amount as number) || 0;
            total += amount;
          }
          return total;

        case "debit + credit":
          const totalDebit = (currentRow.debit as number) || 0;
          const totalCredit = (currentRow.credit as number) || 0;
          return totalDebit + totalCredit;

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

        // 補助元帳特有の検証
        if (col.key === "customer_code" && row[col.key]) {
          // 顧客コードの形式チェック（例：C001形式）
          const code = row[col.key] as string;
          if (!/^[A-Z]\d{3}$/.test(code)) {
            errors.push(
              `${rowDef?.label || `行${index + 1}`}の顧客コードは正しい形式で入力してください（例：C001）`,
            );
          }
        }
      });
    });

    setValidationErrors(errors);
    onValidationChange?.(errors.length === 0, errors);
  };

  // ドロップダウン選択肢の取得
  const getDropdownOptions = (column: ColumnDefinition): string[] => {
    if (column.options_ref === "allowed_accounts") {
      return template.allowed_accounts;
    }

    // 補助元帳特有の選択肢
    if (column.key === "customer_name") {
      return [
        "㈱田中商事",
        "㈲佐藤物産",
        "山田工業㈱",
        "㈱鈴木商店",
        "高橋製作所",
        "伊藤貿易㈱",
        "㈱渡辺商会",
        "中村興業㈱",
      ];
    }

    if (column.key === "supplier_name") {
      return [
        "㈱ABC商事",
        "XYZ物産㈱",
        "㈲DEF工業",
        "GHI商店",
        "JKL製作所",
        "MNO貿易",
        "PQR商会",
        "STU興業",
      ];
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
            testID={`subsidiary-cell-${rowIndex}-${column.key}`}
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
            testID={`subsidiary-cell-${rowIndex}-${column.key}`}
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

      case "code":
        // 補助元帳特有の顧客・仕入先コード入力
        return (
          <TextInput
            style={[styles.codeInput, !isEditable && styles.disabledCell]}
            value={cellValue.toString()}
            onChangeText={(text) =>
              updateCellValue(rowIndex, column.key, text.toUpperCase())
            }
            placeholder={column.placeholder}
            maxLength={4}
            autoCapitalize="characters"
            editable={isEditable}
            testID={`subsidiary-cell-${rowIndex}-${column.key}`}
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
            testID={`subsidiary-cell-${rowIndex}-${column.key}`}
          />
        );
    }
  };

  return (
    <View style={styles.container} testID="subsidiary-ledger-form">
      {/* 補助元帳タイトル */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>補助元帳</Text>
        <Text style={styles.subtitleText}>
          {template.layout_variant === "customer" ? "得意先別" : "仕入先別"}詳細
        </Text>
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
              ).map((option, index) => {
                const isSelected =
                  tableData[selectedDropdown.rowIndex]?.[
                    selectedDropdown.columnKey
                  ] === option;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dropdownOption,
                      isSelected && styles.dropdownOptionSelected,
                    ]}
                    onPress={() => selectDropdownOption(option)}
                    testID={`subsidiary-option-${option}`}
                  >
                    <Text
                      style={[
                        styles.dropdownOptionText,
                        isSelected && styles.dropdownOptionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
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
  titleContainer: {
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  titleText: {
    fontSize: 18,
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
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#E3F2FD",
    borderBottomWidth: 2,
    borderBottomColor: "#1976D2",
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
    color: "#1976D2",
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
  codeInput: {
    fontSize: 14,
    color: "#333333",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontFamily: "monospace",
    backgroundColor: "#F9F9F9",
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
  dropdownOptionSelected: {
    backgroundColor: "#E3F2FD", // 淡い青色でテキストの可読性向上
  },
  dropdownOptionText: {
    fontSize: 14,
    color: "#333333",
  },
  dropdownOptionTextSelected: {
    color: "#1976D2",
    fontWeight: "600",
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
