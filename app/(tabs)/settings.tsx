import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Screen } from "../../src/components/layout/ResponsiveLayout";
import { AppIcon, IconContextSizes } from "../../src/theme/icons";
import {
  useTheme,
  useThemedStyles,
  ThemeMode,
  type Theme,
} from "../../src/context/ThemeContext";
import { usePurchase } from "../../src/context/PurchaseContext";
import { useAtt } from "../../src/context/AttContext";
import { confirmResetDatabase } from "../../src/utils/reset-database";
import { TestDataCreator } from "../../src/components/dev-tools/TestDataCreator";
import { REMOVE_ADS_DISPLAY_PRICE } from "../../src/config/monetization";
import { logRemoveAdsCTAClicked } from "../../src/services/analytics-service";

export default function SettingsScreen() {
  // Phase 4: ダークモード対応のテーマシステム
  const { theme, getStatusBarStyle, themeMode, setThemeMode } = useTheme();
  const styles = useThemedStyles(createStyles);

  // 購入状態
  const {
    isPremium,
    isLoading: isPurchaseLoading,
    purchaseRemoveAds,
    restorePurchases,
    error: purchaseError,
    clearError,
  } = usePurchase();
  const {
    status: attStatus,
    granted: isAttGranted,
    canAskAgain: canAskAttAgain,
    appState: attAppState,
    lastCheckedAt: attLastCheckedAt,
    isLoading: isAttLoading,
    isRequesting: isAttRequesting,
    refreshStatus: refreshAttStatus,
    requestPermission: requestAttPermission,
    openAppSettings,
  } = useAtt();

  // カスタムテーマ選択モーダル状態
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(themeMode);

  // 開発者モード状態
  const [showTestDataCreator, setShowTestDataCreator] = useState(false);

  // 購入エラー表示
  React.useEffect(() => {
    if (purchaseError) {
      Alert.alert("エラー", purchaseError, [
        { text: "OK", onPress: clearError },
      ]);
    }
  }, [purchaseError, clearError]);

  // 広告削除購入ハンドラー
  const handlePurchaseRemoveAds = async () => {
    logRemoveAdsCTAClicked("settings");
    const success = await purchaseRemoveAds();
    if (success) {
      Alert.alert("購入完了", "広告が削除されました。ありがとうございます！");
    }
  };

  // 購入復元ハンドラー
  const handleRestorePurchases = async () => {
    const success = await restorePurchases();
    if (success) {
      Alert.alert("復元完了", "購入が復元されました。");
    } else {
      Alert.alert("復元結果", "復元可能な購入は見つかりませんでした。");
    }
  };

  // テーマ情報
  const themeOptions: {
    key: ThemeMode;
    label: string;
    description: string;
  }[] = [
    { key: "light", label: "ライトモード", description: "明るい背景のテーマ" },
    { key: "dark", label: "ダークモード", description: "暗い背景のテーマ" },
    { key: "system", label: "システム設定", description: "端末の設定に従う" },
  ];

  // Custom theme options removed as unused

  const handleThemeChange = (mode: ThemeMode) => {
    setSelectedTheme(mode);
    setThemeMode(mode);
    setShowThemeModal(false);
  };

  const attStatusLabel =
    {
      undetermined: "未確認",
      granted: "許可済み",
      denied: "拒否済み",
      restricted: "制限中",
      unavailable: "対象外",
    }[attStatus] ?? attStatus;

  const attLastCheckedLabel = attLastCheckedAt
    ? new Date(attLastCheckedAt).toLocaleString("ja-JP")
    : "未確認";

  const handleRequestAtt = async () => {
    await requestAttPermission("settings");
  };

  return (
    <Screen
      safeArea={true}
      scrollable={true}
      statusBarStyle={getStatusBarStyle()}
      testID="settings-screen"
    >
      {/* アプリタイトル（ヘッダー代替） */}
      <View style={styles.headerSection}>
        <Text style={styles.appTitle}>設定</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* 復習システムの説明セクション */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppIcon
              name="learning"
              size={IconContextSizes.listItem}
              color={theme.colors.primary}
            />
            <Text style={styles.sectionTitle}>復習システムについて</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>効率的な学習のための仕組み</Text>
            <Text style={styles.description}>
              このアプリは、間違えた問題を効率的に復習できるよう設計されています。
            </Text>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>📝 復習対象になる条件</Text>
              <Text style={styles.infoText}>
                学習タブで問題に不正解した場合のみ、その問題が復習リストに追加されます。
                初回で正解した問題は復習対象になりません。
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>🎯 復習から外れる条件</Text>
              <Text style={styles.infoText}>
                復習タブで連続2回正解すると、その問題は「克服済み」となり、
                復習リストから自動的に削除されます。
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>⚡ 優先度の仕組み</Text>
              <Text style={styles.infoText}>
                誤答回数が多い問題ほど優先的に出題されます。 また、試算表 → 仕訳
                → 帳簿の順で重要度が設定されています。
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>📊 復習ステータス</Text>
              <Text style={styles.infoText}>
                • 通常復習：1回間違えた問題{"\n"}• 重点復習：2回以上間違えた問題
                {"\n"}• 克服済み：連続2回正解した問題（リストから削除）
              </Text>
            </View>
          </View>
        </View>

        {/* トラッキング許可診断セクション */}
        {Platform.OS === "ios" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AppIcon
                name="info"
                size={IconContextSizes.listItem}
                color={theme.colors.primary}
              />
              <Text style={styles.sectionTitle}>トラッキング許可診断</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>ATT ステータス</Text>
              <Text style={styles.description}>
                iOSの状態を確認します。拒否済みまたは制限中の場合、アプリ側からシステムダイアログを再表示することはできません。
              </Text>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>現在の状態</Text>
                <Text style={styles.infoValue}>{attStatusLabel}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>許可</Text>
                <Text style={styles.infoValue}>
                  {isAttGranted ? "はい" : "いいえ"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>再要求可能</Text>
                <Text style={styles.infoValue}>
                  {canAskAttAgain ? "はい" : "いいえ"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>AppState</Text>
                <Text style={styles.infoValue}>{attAppState}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>最終確認</Text>
                <Text style={styles.infoValue}>{attLastCheckedLabel}</Text>
              </View>

              {attStatus === "undetermined" ? (
                <TouchableOpacity
                  style={[
                    styles.purchaseButton,
                    isAttRequesting && styles.purchaseButtonDisabled,
                  ]}
                  onPress={handleRequestAtt}
                  disabled={isAttRequesting}
                  testID="settings-att-request-button"
                  accessibilityLabel="トラッキング許可をリクエスト"
                >
                  {isAttRequesting ? (
                    <ActivityIndicator color={theme.colors.surface} />
                  ) : (
                    <Text style={styles.purchaseButtonText}>
                      トラッキング許可をリクエスト
                    </Text>
                  )}
                </TouchableOpacity>
              ) : (
                <Text style={styles.attHelpText}>
                  {attStatus === "denied" || attStatus === "restricted"
                    ? "この状態ではATTダイアログは再表示されません。iOSの設定で変更できる場合があります。"
                    : "ATTの初回判定は完了しています。"}
                </Text>
              )}

              <TouchableOpacity
                style={styles.themeButton}
                onPress={refreshAttStatus}
                disabled={isAttLoading}
                testID="settings-att-refresh-button"
                accessibilityLabel="トラッキング許可状態を再確認"
              >
                <View style={styles.themeButtonContent}>
                  <Text style={styles.themeButtonLabel}>状態を再確認</Text>
                  <Text style={styles.themeButtonValue}>
                    {isAttLoading ? "確認中..." : "再読み込み"}
                  </Text>
                </View>
              </TouchableOpacity>

              {(attStatus === "denied" || attStatus === "restricted") && (
                <TouchableOpacity
                  style={styles.restoreButton}
                  onPress={openAppSettings}
                  testID="settings-att-open-settings-button"
                  accessibilityLabel="アプリ設定を開く"
                >
                  <Text style={styles.restoreButtonText}>
                    iOSのアプリ設定を開く
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* テーマ設定セクション */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppIcon
              name="settings"
              size={IconContextSizes.listItem}
              color={theme.colors.primary}
            />
            <Text style={styles.sectionTitle}>テーマ設定</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>表示テーマの切り替え</Text>
            <Text style={styles.description}>
              アプリの表示テーマを変更できます。システム設定に従うか、手動で選択できます。
            </Text>

            <TouchableOpacity
              style={styles.themeButton}
              onPress={() => setShowThemeModal(true)}
              testID="settings-theme-button"
              accessibilityLabel="テーマを変更"
            >
              <View style={styles.themeButtonContent}>
                <Text style={styles.themeButtonLabel}>現在のテーマ</Text>
                <Text style={styles.themeButtonValue}>
                  {themeOptions.find((option) => option.key === themeMode)
                    ?.label || "不明"}
                </Text>
              </View>
              <AppIcon
                name="forward"
                size="small"
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 広告削除セクション */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppIcon
              name="badge"
              size={IconContextSizes.listItem}
              color={theme.colors.primary}
            />
            <Text style={styles.sectionTitle}>広告削除</Text>
          </View>

          <View style={styles.card}>
            {isPremium ? (
              <>
                <View style={styles.premiumBadge}>
                  <AppIcon
                    name="correct"
                    size="small"
                    color={theme.colors.surface}
                  />
                  <Text style={styles.premiumBadgeText}>購入済み</Text>
                </View>
                <Text style={styles.premiumDescription}>
                  広告削除を購入いただきありがとうございます。
                  広告なしで快適に学習をお楽しみください。
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.cardTitle}>集中モードで学習効率UP</Text>
                <Text style={styles.description}>
                  広告を削除して、より集中して学習に取り組めます。
                  一度購入すると永続的に広告が非表示になります。
                </Text>

                <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>価格</Text>
                  <Text style={styles.priceValue}>
                    {REMOVE_ADS_DISPLAY_PRICE}
                  </Text>
                  <Text style={styles.priceNote}>（買い切り）</Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.purchaseButton,
                    isPurchaseLoading && styles.purchaseButtonDisabled,
                  ]}
                  onPress={handlePurchaseRemoveAds}
                  disabled={isPurchaseLoading}
                  testID="settings-purchase-button"
                  accessibilityLabel="広告を削除"
                >
                  {isPurchaseLoading ? (
                    <ActivityIndicator color={theme.colors.surface} />
                  ) : (
                    <>
                      <AppIcon
                        name="badge"
                        size={IconContextSizes.button}
                        color="white"
                      />
                      <Text style={styles.purchaseButtonText}>広告を削除</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.restoreButton}
                  onPress={handleRestorePurchases}
                  disabled={isPurchaseLoading}
                  testID="settings-restore-button"
                  accessibilityLabel="購入を復元"
                >
                  <Text style={styles.restoreButtonText}>購入を復元</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* アプリ情報セクション */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppIcon
              name="info"
              size={IconContextSizes.listItem}
              color={theme.colors.primary}
            />
            <Text style={styles.sectionTitle}>アプリ情報</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>アプリ名</Text>
              <Text style={styles.infoValue}>簿記3級問題集「確実復習」</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>バージョン</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>データ保存</Text>
              <Text style={styles.infoValue}>端末内のみ（完全オフライン）</Text>
            </View>
          </View>
        </View>

        {/* データベース管理セクション */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppIcon
              name="debug"
              size={IconContextSizes.listItem}
              color={theme.colors.primary}
            />
            <Text style={styles.sectionTitle}>データベース管理</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>問題データのリセット</Text>
            <Text style={styles.description}>
              問題データを最新の状態にリセットします。
              全ての学習履歴も削除されますのでご注意ください。
            </Text>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={confirmResetDatabase}
              testID="settings-reset-database-button"
              accessibilityLabel="データベースをリセット"
            >
              <AppIcon
                name="reset"
                size={IconContextSizes.button}
                color="white"
              />
              <Text style={styles.resetButtonText}>データベースをリセット</Text>
            </TouchableOpacity>

            <Text style={styles.warningText}>⚠️ この操作は取り消せません</Text>
          </View>
        </View>

        {/* 開発者向けセクション（開発環境のみ） */}
        {__DEV__ && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AppIcon
                name="debug"
                size={IconContextSizes.listItem}
                color={theme.colors.primary}
              />
              <Text style={styles.sectionTitle}>開発者ツール</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>復習システム テストデータ</Text>
              <Text style={styles.description}>
                復習機能をテストするためのサンプルデータを作成します。
                学習履歴と復習アイテムがない場合にご利用ください。
              </Text>

              <TouchableOpacity
                style={styles.themeButton}
                onPress={() => setShowTestDataCreator(true)}
                testID="settings-test-data-button"
                accessibilityLabel="テストデータ作成"
              >
                <View style={styles.themeButtonContent}>
                  <Text style={styles.themeButtonLabel}>復習テストデータ</Text>
                  <Text style={styles.themeButtonValue}>作成 →</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 学習のコツセクション */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppIcon
              name="help"
              size={IconContextSizes.listItem}
              color={theme.colors.primary}
            />
            <Text style={styles.sectionTitle}>効果的な学習のコツ</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>1.</Text>
              <Text style={styles.tipText}>
                まずは学習タブで新しい問題に挑戦し、基礎知識を身につけましょう。
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>2.</Text>
              <Text style={styles.tipText}>
                間違えた問題は自動的に復習リストに追加されるので、定期的に復習タブをチェックしましょう。
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>3.</Text>
              <Text style={styles.tipText}>
                復習で2回連続正解できたら、その問題は理解できたと判断されます。
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>4.</Text>
              <Text style={styles.tipText}>
                模試機能で実力を確認し、本番に備えましょう。
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* テーマ選択モーダル */}
      <Modal
        visible={showThemeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowThemeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>テーマを選択</Text>
              <TouchableOpacity
                onPress={() => setShowThemeModal(false)}
                style={styles.modalCloseButton}
                testID="theme-modal-close"
              >
                <AppIcon
                  name="close"
                  size="medium"
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {themeOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.themeOption,
                    selectedTheme === option.key && styles.themeOptionSelected,
                  ]}
                  onPress={() => handleThemeChange(option.key)}
                  testID={`theme-option-${option.key}`}
                >
                  <View style={styles.themeOptionContent}>
                    <Text style={styles.themeOptionLabel}>{option.label}</Text>
                    <Text style={styles.themeOptionDescription}>
                      {option.description}
                    </Text>
                  </View>
                  {selectedTheme === option.key && (
                    <AppIcon
                      name="correct"
                      size="small"
                      color={theme.colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* テストデータ作成モーダル（開発環境のみ） */}
      {__DEV__ && (
        <Modal
          visible={showTestDataCreator}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowTestDataCreator(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { maxHeight: "90%" }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  復習システム テストデータ作成
                </Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowTestDataCreator(false)}
                >
                  <AppIcon
                    name="close"
                    size="medium"
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              <TestDataCreator />
            </View>
          </View>
        </Modal>
      )}
    </Screen>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      paddingBottom: 40,
    },
    headerSection: {
      position: "absolute",
      top: 20,
      left: 0,
      right: 0,
      alignItems: "center",
      paddingHorizontal: 20,
      zIndex: 1,
    },
    appTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.primary,
      textAlign: "center",
    },
    section: {
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
      paddingTop: 40, // 最初のセクションのみヘッダー分の余白
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
      marginLeft: 10,
    },
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 10,
      padding: 20,
      marginBottom: 20,
      ...theme.shadows.medium,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 10,
    },
    description: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
      marginBottom: 15,
    },
    infoItem: {
      marginVertical: 10,
    },
    infoLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 5,
    },
    infoText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
      paddingLeft: 20,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
    infoValue: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    tipItem: {
      flexDirection: "row",
      marginVertical: 8,
    },
    tipNumber: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginRight: 10,
      minWidth: 20,
    },
    tipText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
      flex: 1,
    },
    resetButton: {
      backgroundColor: theme.colors.error,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 15,
      borderRadius: 8,
      marginTop: 20,
      marginBottom: 10,
    },
    resetButtonText: {
      color: theme.colors.surface,
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },
    warningText: {
      fontSize: 12,
      color: theme.colors.error,
      textAlign: "center",
      marginTop: 5,
    },
    attHelpText: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      lineHeight: 19,
      marginTop: 15,
    },
    themeButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 15,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      marginTop: 10,
    },
    themeButtonContent: {
      flex: 1,
    },
    themeButtonLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 2,
    },
    themeButtonValue: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.colors.background + "80",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: theme.colors.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: "80%",
      paddingBottom: 40,
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    modalCloseButton: {
      padding: 5,
    },
    modalScroll: {
      padding: 20,
    },
    themeOption: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 15,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
    },
    themeOptionSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryLight,
    },
    themeOptionContent: {
      flex: 1,
    },
    themeOptionLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 2,
    },
    themeOptionDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    // 購入関連スタイル
    premiumBadge: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.success,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginBottom: 15,
    },
    premiumBadgeText: {
      color: theme.colors.surface,
      fontSize: 16,
      fontWeight: "bold",
      marginLeft: 8,
    },
    premiumDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
    priceContainer: {
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent: "center",
      marginVertical: 15,
      padding: 15,
      backgroundColor: theme.colors.primaryLight,
      borderRadius: 8,
    },
    priceLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginRight: 8,
    },
    priceValue: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.primary,
    },
    priceNote: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginLeft: 4,
    },
    purchaseButton: {
      backgroundColor: theme.colors.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 15,
      borderRadius: 8,
      marginTop: 10,
    },
    purchaseButtonDisabled: {
      opacity: 0.6,
    },
    purchaseButtonText: {
      color: theme.colors.surface,
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },
    restoreButton: {
      alignItems: "center",
      justifyContent: "center",
      padding: 12,
      marginTop: 10,
    },
    restoreButtonText: {
      color: theme.colors.primary,
      fontSize: 14,
      textDecorationLine: "underline",
    },
  });
