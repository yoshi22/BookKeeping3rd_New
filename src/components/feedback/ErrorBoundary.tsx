/**
 * エラーバウンダリとエラーハンドリング
 * 簿記3級問題集アプリ - Step 5.2: UX最適化
 *
 * ユーザーフレンドリーなエラー対応システム
 */

import React, { Component, ReactNode } from "react";
import { View, ScrollView } from "react-native";
import { Typography, Heading } from "../ui/Typography";
import { Button } from "../ui/Button";
import { Card, CardContent, CardActions } from "../ui/Card";
import { Container } from "../layout/ResponsiveLayout";
import { useTheme, type Theme } from "../../context/ThemeContext";
import { logger } from "../../utils/logger";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: any) => ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({
      error,
      errorInfo,
    });

    // エラーログ記録
    this.logError(error, errorInfo);

    // カスタムエラーハンドラーを呼び出し
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private logError = (error: Error, errorInfo: any) => {
    const errorLog = {
      timestamp: new Date().toISOString(),
      message: (error as Error).message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
    };

    // 開発環境でのみコンソール出力
    if (__DEV__) {
      logger.error("ErrorBoundary caught an error:", error, {
        timestamp: errorLog.timestamp,
        componentStack: errorLog.componentStack,
        userAgent: errorLog.userAgent,
      });
    }

    // 本番環境では、ローカルストレージに保存（分析用）
    this.saveErrorToStorage(errorLog);
  };

  private saveErrorToStorage = async (errorLog: any) => {
    try {
      const AsyncStorage = await import(
        "@react-native-async-storage/async-storage"
      );
      const existingLogs = await AsyncStorage.default.getItem("error_logs");
      const logs = existingLogs ? JSON.parse(existingLogs) : [];

      logs.push(errorLog);

      // 最新100件のみ保持
      const recentLogs = logs.slice(-100);

      await AsyncStorage.default.setItem(
        "error_logs",
        JSON.stringify(recentLogs),
      );
    } catch (error) {
      logger.error("Failed to save error log:", error  as Error);
    }
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReload = () => {
    // アプリの再読み込み（React Nativeでは制限的）
    this.handleReset();
  };

  render() {
    if (this.state.hasError) {
      // カスタムフォールバックが提供されている場合
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.state.errorInfo);
      }

      // デフォルトエラー画面
      return (
        <DefaultErrorScreen
          error={this.state.error!}
          onReset={this.handleReset}
          onReload={this.handleReload}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * デフォルトエラー画面
 */
interface DefaultErrorScreenProps {
  error: Error;
  onReset: () => void;
  onReload: () => void;
}

function DefaultErrorScreen({
  error,
  onReset,
  onReload,
}: DefaultErrorScreenProps) {
  const { theme } = useTheme();
  const isNetworkError =
    (error as Error).message.includes("Network") || (error as Error).message.includes("fetch");
  const isStorageError =
    (error as Error).message.includes("Storage") || (error as Error).message.includes("AsyncStorage");
  const isRenderError =
    (error as Error).message.includes("render") || (error as Error).message.includes("component");

  const getErrorMessage = () => {
    if (isNetworkError) {
      return "通信エラーが発生しました。インターネット接続を確認してください。";
    }
    if (isStorageError) {
      return "データの読み込みに失敗しました。アプリを再起動してください。";
    }
    if (isRenderError) {
      return "画面の表示に問題が発生しました。";
    }
    return "予期しないエラーが発生しました。";
  };

  const getErrorIcon = () => {
    if (isNetworkError) return "🌐";
    if (isStorageError) return "💾";
    if (isRenderError) return "🖥️";
    return "⚠️";
  };

  const getSuggestedActions = () => {
    const actions = ["アプリを再試行する"];

    if (isNetworkError) {
      actions.push("インターネット接続を確認する", "オフライン機能を使用する");
    }
    if (isStorageError) {
      actions.push("アプリを再起動する", "デバイスの容量を確認する");
    }

    return actions;
  };

  return (
    <Container style={{ flex: 1, justifyContent: "center" }}>
      <Card variant="elevated">
        <CardContent>
          {/* エラーアイコン */}
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <Typography variant="h1" align="center">
              {getErrorIcon()}
            </Typography>
          </View>

          {/* エラータイトル */}
          <Heading level={3} align="center" style={{ marginBottom: 16 }}>
            問題が発生しました
          </Heading>

          {/* エラーメッセージ */}
          <Typography
            variant="body1"
            align="center"
            color="secondary"
            style={{ marginBottom: 24 }}
          >
            {getErrorMessage()}
          </Typography>

          {/* 推奨アクション */}
          <View style={{ marginBottom: 24 }}>
            <Typography variant="subtitle2" style={{ marginBottom: 12 }}>
              次の操作をお試しください：
            </Typography>
            {getSuggestedActions().map((action, index) => (
              <Typography
                key={index}
                variant="body2"
                color="secondary"
                style={{ marginBottom: 4 }}
              >
                • {action}
              </Typography>
            ))}
          </View>

          {/* 開発環境でのエラー詳細 */}
          {__DEV__ && (
            <View style={{ marginBottom: 24 }}>
              <Typography variant="caption" color="error">
                開発モード - エラー詳細:
              </Typography>
              <ScrollView
                style={{
                  maxHeight: 100,
                  backgroundColor: theme.colors.background,
                  padding: 8,
                  marginTop: 8,
                }}
              >
                <Typography
                  variant="caption"
                  style={{ fontFamily: "monospace" }}
                >
                  {(error as Error).message}
                </Typography>
              </ScrollView>
            </View>
          )}
        </CardContent>

        <CardActions justify="space-between">
          <Button title="再試行" variant="primary" onPress={onReset} />
          <Button
            title="アプリ再読み込み"
            variant="outline"
            onPress={onReload}
          />
        </CardActions>
      </Card>
    </Container>
  );
}

/**
 * 特定エラー用のバウンダリコンポーネント
 */

// ネットワークエラー用
export function NetworkErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary fallback={(error) => <NetworkErrorFallback error={error} />}>
      {children}
    </ErrorBoundary>
  );
}

function NetworkErrorFallback({ error }: { error: Error }) {
  return (
    <Container style={{ flex: 1, justifyContent: "center" }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h2" align="center">
            🌐
          </Typography>
          <Heading
            level={4}
            align="center"
            style={{ marginTop: 16, marginBottom: 12 }}
          >
            接続エラー
          </Heading>
          <Typography variant="body2" align="center" color="secondary">
            ネットワーク接続を確認してください。この問題集はオフラインでも利用できます。
          </Typography>
        </CardContent>
        <CardActions>
          <Button title="オフラインで続行" variant="primary" fullWidth />
        </CardActions>
      </Card>
    </Container>
  );
}

// データエラー用
export function DataErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary fallback={(error) => <DataErrorFallback error={error} />}>
      {children}
    </ErrorBoundary>
  );
}

function DataErrorFallback({ error }: { error: Error }) {
  const handleDataReset = async () => {
    try {
      // データベースの再初期化
      // Database reset removed - DatabaseService not available
      // await DatabaseService.default.resetDatabase();

      // アプリの再読み込み
      window.location.reload();
    } catch (resetError) {
      logger.error("Failed to reset data:", resetError  as Error);
    }
  };

  return (
    <Container style={{ flex: 1, justifyContent: "center" }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h2" align="center">
            💾
          </Typography>
          <Heading
            level={4}
            align="center"
            style={{ marginTop: 16, marginBottom: 12 }}
          >
            データエラー
          </Heading>
          <Typography
            variant="body2"
            align="center"
            color="secondary"
            style={{ marginBottom: 16 }}
          >
            学習データの読み込みに失敗しました。データを初期化して修復できます。
          </Typography>
          <Typography variant="caption" align="center" color="warning">
            ※ 初期化すると学習履歴が削除されます
          </Typography>
        </CardContent>
        <CardActions justify="space-between">
          <Button title="再試行" variant="outline" />
          <Button
            title="データ初期化"
            variant="danger"
            onPress={handleDataReset}
          />
        </CardActions>
      </Card>
    </Container>
  );
}

/**
 * エラーハンドリングフック
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((error: Error) => {
    setError(error);

    // エラーログ
    logger.error("Error handled by useErrorHandler:", error  as Error);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  const wrapAsync = React.useCallback(
    <T,>(asyncFn: () => Promise<T>): Promise<T | undefined> => {
      return asyncFn().catch((error) => {
        handleError(error);
        return undefined;
      });
    },
    [handleError],
  );

  return {
    error,
    handleError,
    clearError,
    wrapAsync,
  };
}
