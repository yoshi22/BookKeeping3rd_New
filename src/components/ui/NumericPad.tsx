import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import { useTheme, type Theme } from "../../context/ThemeContext";

interface NumericPadProps {
  visible: boolean;
  value: string;
  onValueChange: (value: string) => void;
  onClose: () => void;
  placeholder?: string;
  label?: string;
  maxLength?: number;
}

export default function NumericPad({
  visible,
  value,
  onValueChange,
  onClose,
  placeholder = "金額を入力",
  label = "金額入力",
  maxLength = 10,
}: NumericPadProps) {
  const { theme } = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const handleNumberPress = (num: string) => {
    if (value.length < maxLength) {
      onValueChange(value + num);
    }
  };

  const handleDelete = () => {
    if (value.length > 0) {
      onValueChange(value.slice(0, -1));
    }
  };

  const handleClear = () => {
    onValueChange("");
  };

  const handleConfirm = () => {
    onClose();
  };

  const formatAmount = (amount: string) => {
    if (!amount) return "";
    const num = parseInt(amount);
    return num.toLocaleString();
  };

  const styles = createStyles(theme, screenWidth, screenHeight);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <SafeAreaView style={styles.safeArea}>
            {/* ヘッダー */}
            <View style={styles.header}>
              <Text style={styles.headerText}>{label}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* 表示エリア */}
            <View style={styles.displayArea}>
              <Text style={styles.displayText}>
                {value ? formatAmount(value) : placeholder}
              </Text>
              <Text style={styles.displayUnit}>円</Text>
            </View>

            {/* 数字パッド */}
            <View style={styles.padContainer}>
              {/* 1-3行目 */}
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleNumberPress("1")}
                >
                  <Text style={styles.buttonText}>1</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleNumberPress("2")}
                >
                  <Text style={styles.buttonText}>2</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleNumberPress("3")}
                >
                  <Text style={styles.buttonText}>3</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleNumberPress("4")}
                >
                  <Text style={styles.buttonText}>4</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleNumberPress("5")}
                >
                  <Text style={styles.buttonText}>5</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleNumberPress("6")}
                >
                  <Text style={styles.buttonText}>6</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleNumberPress("7")}
                >
                  <Text style={styles.buttonText}>7</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleNumberPress("8")}
                >
                  <Text style={styles.buttonText}>8</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleNumberPress("9")}
                >
                  <Text style={styles.buttonText}>9</Text>
                </TouchableOpacity>
              </View>

              {/* 4行目 */}
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleNumberPress("00")}
                >
                  <Text style={styles.buttonText}>00</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleNumberPress("0")}
                >
                  <Text style={styles.buttonText}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleNumberPress("000")}
                >
                  <Text style={styles.buttonText}>000</Text>
                </TouchableOpacity>
              </View>

              {/* 操作ボタン */}
              <View style={styles.row}>
                <TouchableOpacity
                  style={[styles.button, styles.clearButton]}
                  onPress={handleClear}
                >
                  <Text style={[styles.buttonText, styles.clearText]}>
                    クリア
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={handleDelete}
                >
                  <Text style={[styles.buttonText, styles.deleteText]}>
                    削除
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={handleConfirm}
                >
                  <Text style={[styles.buttonText, styles.confirmText]}>
                    確定
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (
  theme: any,
  screenWidth: number,
  screenHeight: number,
) => {
  // 相対サイズ計算ロジック（最小値・最大値制限付き）
  const responsive = {
    padding: {
      horizontal: Math.max(10, Math.min(30, screenWidth * 0.05)),
      vertical: Math.max(10, Math.min(25, screenHeight * 0.02)),
      bottom: Math.max(15, Math.min(30, screenHeight * 0.025)),
    },
    margin: {
      horizontal: Math.max(2, Math.min(8, screenWidth * 0.015)),
      vertical: Math.max(10, Math.min(20, screenHeight * 0.02)),
    },
    button: {
      height: Math.max(45, Math.min(80, screenHeight * 0.075)),
      closeSize: Math.max(25, Math.min(40, screenWidth * 0.08)),
    },
    fontSize: {
      header: Math.max(14, Math.min(22, screenWidth * 0.045)),
      closeButton: Math.max(14, Math.min(22, screenWidth * 0.045)),
      display: Math.max(24, Math.min(40, screenWidth * 0.08)),
      displayUnit: Math.max(16, Math.min(26, screenWidth * 0.05)),
      button: Math.max(18, Math.min(30, screenWidth * 0.06)),
      action: Math.max(12, Math.min(18, screenWidth * 0.04)),
    },
    radius: {
      small: Math.max(6, Math.min(15, screenWidth * 0.025)),
      medium: Math.max(8, Math.min(20, screenWidth * 0.05)),
    },
    displayArea: {
      minHeight: Math.max(60, Math.min(100, screenHeight * 0.1)),
    },
  };

  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.colors.background + "80",
      justifyContent: "flex-end",
    },
    container: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: responsive.radius.medium,
      borderTopRightRadius: responsive.radius.medium,
      maxHeight: "70%",
    },
    safeArea: {
      paddingBottom: responsive.padding.bottom,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: responsive.padding.horizontal,
      paddingVertical: responsive.padding.vertical,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerText: {
      fontSize: responsive.fontSize.header,
      fontWeight: "600",
      color: theme.colors.text,
    },
    closeButton: {
      width: responsive.button.closeSize,
      height: responsive.button.closeSize,
      borderRadius: responsive.button.closeSize / 2,
      backgroundColor: theme.colors.error,
      justifyContent: "center",
      alignItems: "center",
    },
    closeButtonText: {
      color: theme.colors.background,
      fontSize: responsive.fontSize.closeButton,
      fontWeight: "bold",
    },
    displayArea: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: responsive.padding.vertical,
      paddingHorizontal: responsive.padding.horizontal,
      minHeight: responsive.displayArea.minHeight,
      backgroundColor: theme.colors.background,
      marginHorizontal: responsive.padding.horizontal,
      marginVertical: responsive.margin.vertical,
      borderRadius: responsive.radius.small,
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    displayText: {
      fontSize: responsive.fontSize.display,
      fontWeight: "bold",
      color: theme.colors.text,
      marginRight: responsive.margin.horizontal * 2,
    },
    displayUnit: {
      fontSize: responsive.fontSize.displayUnit,
      color: theme.colors.textSecondary,
    },
    padContainer: {
      paddingHorizontal: responsive.padding.horizontal,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: responsive.margin.vertical / 2,
    },
    button: {
      flex: 1,
      height: responsive.button.height,
      backgroundColor: theme.colors.background,
      borderRadius: responsive.radius.small,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: responsive.margin.horizontal,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    buttonText: {
      fontSize: responsive.fontSize.button,
      fontWeight: "600",
      color: theme.colors.text,
    },
    clearButton: {
      backgroundColor: theme.colors.warning + "20",
      borderColor: theme.colors.warning,
    },
    clearText: {
      color: theme.colors.warning,
      fontSize: responsive.fontSize.action,
    },
    deleteButton: {
      backgroundColor: theme.colors.error + "20",
      borderColor: theme.colors.error,
    },
    deleteText: {
      color: theme.colors.error,
      fontSize: responsive.fontSize.action,
    },
    confirmButton: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    confirmText: {
      color: theme.colors.background,
      fontSize: responsive.fontSize.action,
    },
  });
};
