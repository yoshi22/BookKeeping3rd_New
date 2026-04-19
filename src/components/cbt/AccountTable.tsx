/**
 * 勘定科目テーブル共通コンポーネント
 * 試算表・合計残高試算表で使用
 */

import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import {
  useTheme,
  useThemedStyles,
  useColors,
  useDynamicColors,
  type Theme,
} from "../../context/ThemeContext";

export interface TableColumn {
  /** 列のキー */
  key: string;
  /** 列のヘッダー表示テキスト */
  header: string;
  /** 列の幅（flexベース、デフォルト: 1） */
  flex?: number;
  /** 右寄せするか */
  alignRight?: boolean;
}

export interface TableCell {
  /** セルの値（文字列または数値またはReact要素） */
  value: string | number | React.ReactNode;
  /** セルのスタイル（オプション） */
  style?: any;
  /** 太字にするか */
  bold?: boolean;
}

export interface TableRow {
  /** 行のキー */
  key: string;
  /** 各列のセルデータ（列キーをキーとしたオブジェクト） */
  cells: Record<string, TableCell>;
  /** 行全体のスタイル（オプション） */
  rowStyle?: any;
}

export interface AccountTableProps {
  /** テーブルのタイトル */
  title?: string;
  /** 列定義の配列 */
  columns: TableColumn[];
  /** 行データの配列 */
  rows: TableRow[];
  /** テーブル全体のスタイル（オプション） */
  containerStyle?: any;
}

export default function AccountTable({
  title,
  columns,
  rows,
  containerStyle,
}: AccountTableProps) {
  const { theme } = useTheme();
  const colors = useColors();
  const dynamicColors = useDynamicColors();
  const styles = useThemedStyles(createStyles);

  // セルの値をレンダリング
  const renderCellValue = (cell: TableCell, column: TableColumn) => {
    const { value, style: cellStyle, bold } = cell;

    // React要素の場合はそのまま返す
    if (React.isValidElement(value)) {
      return value;
    }

    // 数値の場合はフォーマット
    let displayValue: string;
    if (typeof value === "number") {
      displayValue = value.toLocaleString("ja-JP");
    } else {
      displayValue = value == null ? "" : String(value);
    }

    return (
      <Text
        style={[
          styles.cellText,
          column.alignRight && styles.cellTextRight,
          bold && styles.cellTextBold,
          cellStyle,
        ]}
      >
        {displayValue}
      </Text>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* タイトル */}
      {title && (
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}

      {/* テーブル */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          {/* ヘッダー行 */}
          <View style={styles.headerRow}>
            {columns.map((column) => (
              <View
                key={column.key}
                style={[styles.headerCell, { flex: column.flex || 1 }]}
              >
                <Text style={styles.headerText}>{column.header}</Text>
              </View>
            ))}
          </View>

          {/* データ行 */}
          {rows.map((row, rowIndex) => (
            <View
              key={row.key}
              style={[
                styles.dataRow,
                rowIndex % 2 === 1 && styles.dataRowAlternate,
                row.rowStyle,
              ]}
            >
              {columns.map((column) => {
                const cell = row.cells[column.key] || { value: "" };
                return (
                  <View
                    key={`${row.key}-${column.key}`}
                    style={[styles.dataCell, { flex: column.flex || 1 }]}
                  >
                    {renderCellValue(cell, column)}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      overflow: "hidden",
      ...theme.shadows.small,
    },
    titleContainer: {
      backgroundColor: theme.colors.primary,
      padding: 12,
      alignItems: "center",
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#FFFFFF",
    },

    // Table styles
    table: {
      minWidth: "100%",
    },
    headerRow: {
      flexDirection: "row",
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.borderLight,
    },
    headerCell: {
      padding: 12,
      justifyContent: "center",
      alignItems: "center",
      minWidth: 80,
    },
    headerText: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "center",
    },

    dataRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
    dataRowAlternate: {
      backgroundColor: theme.colors.backgroundSecondary,
    },
    dataCell: {
      padding: 12,
      justifyContent: "center",
      minWidth: 80,
    },
    cellText: {
      fontSize: 14,
      color: theme.colors.text,
    },
    cellTextRight: {
      textAlign: "right",
    },
    cellTextBold: {
      fontWeight: "bold",
    },
  });
