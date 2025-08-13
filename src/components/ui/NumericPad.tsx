import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

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

  const styles = createStyles(theme);

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

const createStyles = (theme: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    container: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: "70%",
    },
    safeArea: {
      paddingBottom: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerText: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
    },
    closeButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: theme.colors.error,
      justifyContent: "center",
      alignItems: "center",
    },
    closeButtonText: {
      color: theme.colors.background,
      fontSize: 18,
      fontWeight: "bold",
    },
    displayArea: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 20,
      paddingHorizontal: 20,
      minHeight: 80,
      backgroundColor: theme.colors.background,
      marginHorizontal: 20,
      marginVertical: 15,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    displayText: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.colors.text,
      marginRight: 10,
    },
    displayUnit: {
      fontSize: 20,
      color: theme.colors.textSecondary,
    },
    padContainer: {
      paddingHorizontal: 20,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    button: {
      flex: 1,
      height: 60,
      backgroundColor: theme.colors.background,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 5,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    buttonText: {
      fontSize: 24,
      fontWeight: "600",
      color: theme.colors.text,
    },
    clearButton: {
      backgroundColor: theme.colors.warning + "20",
      borderColor: theme.colors.warning,
    },
    clearText: {
      color: theme.colors.warning,
      fontSize: 16,
    },
    deleteButton: {
      backgroundColor: theme.colors.error + "20",
      borderColor: theme.colors.error,
    },
    deleteText: {
      color: theme.colors.error,
      fontSize: 16,
    },
    confirmButton: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    confirmText: {
      color: theme.colors.background,
      fontSize: 16,
    },
  });
