/**
 * キーボードナビゲーション拡張フック（Phase 4）
 * CBT形式問題・フォーム入力・ボタン操作のキーボード対応
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, Platform } from "react-native";
import { useAccessibilityFocus } from "./useAccessibilityFocus";
import { useAccessibility } from "./useAccessibility";

export interface KeyboardShortcut {
  key: string;
  modifiers?: ("ctrl" | "alt" | "shift" | "cmd")[];
  action: () => void;
  description: string;
  category?: "navigation" | "action" | "form" | "global";
}

export interface KeyboardNavigationOptions {
  enableGlobalShortcuts?: boolean;
  enableFormNavigation?: boolean;
  enableModalNavigation?: boolean;
  trapFocus?: boolean;
  announceShortcuts?: boolean;
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions = {}) {
  const {
    enableGlobalShortcuts = true,
    enableFormNavigation = true,
    enableModalNavigation = true,
    trapFocus = false,
    announceShortcuts = true,
  } = options;

  const { isScreenReaderEnabled } = useAccessibility();
  const {
    registerFocusGroup,
    unregisterFocusGroup,
    focusNext,
    focusPrevious,
    announce,
  } = useAccessibilityFocus();

  const shortcutsRef = useRef<Map<string, KeyboardShortcut>>(new Map());
  const activeGroupRef = useRef<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // キーボードショートカットの登録
  const registerShortcut = useCallback(
    (id: string, shortcut: KeyboardShortcut) => {
      shortcutsRef.current.set(id, shortcut);
    },
    [],
  );

  // キーボードショートカットの削除
  const unregisterShortcut = useCallback((id: string) => {
    shortcutsRef.current.delete(id);
  }, []);

  // キーの組み合わせを文字列に変換
  const getKeyCombo = useCallback((event: any) => {
    const { key, ctrlKey, altKey, shiftKey, metaKey } = event;
    const modifiers = [];

    if (ctrlKey || metaKey) modifiers.push("ctrl");
    if (altKey) modifiers.push("alt");
    if (shiftKey) modifiers.push("shift");

    return `${modifiers.join("+")}${modifiers.length ? "+" : ""}${key.toLowerCase()}`;
  }, []);

  // グローバルキーボードイベントハンドラー
  const handleGlobalKeyPress = useCallback(
    (event: any) => {
      if (!enableGlobalShortcuts) return;

      const keyCombo = getKeyCombo(event);

      // 登録されたショートカットを検索
      for (const [id, shortcut] of shortcutsRef.current) {
        const shortcutCombo = `${shortcut.modifiers?.join("+") || ""}${shortcut.modifiers?.length ? "+" : ""}${shortcut.key.toLowerCase()}`;

        if (keyCombo === shortcutCombo) {
          event.preventDefault();
          event.stopPropagation();

          try {
            shortcut.action();

            // ショートカット実行のアナウンス
            if (announceShortcuts && isScreenReaderEnabled) {
              announce(`ショートカット実行: ${shortcut.description}`);
            }
          } catch (error) {
            console.warn(
              "[KeyboardNavigation] ショートカット実行エラー:",
              error,
            );
          }
          return;
        }
      }

      // フォーカスグループでのナビゲーション
      if (activeGroupRef.current) {
        switch (event.key) {
          case "Tab":
            event.preventDefault();
            if (event.shiftKey) {
              focusPrevious(activeGroupRef.current);
            } else {
              focusNext(activeGroupRef.current);
            }
            break;
          case "ArrowUp":
          case "ArrowDown":
          case "ArrowLeft":
          case "ArrowRight":
            // アクセシビリティフォーカスフックで処理される
            break;
          case "Escape":
            if (isModalOpen && enableModalNavigation) {
              // ESCキーでモーダルを閉じる処理
              announce("モーダルを閉じます");
            }
            break;
        }
      }
    },
    [
      enableGlobalShortcuts,
      getKeyCombo,
      announce,
      announceShortcuts,
      isScreenReaderEnabled,
      focusNext,
      focusPrevious,
      isModalOpen,
      enableModalNavigation,
    ],
  );

  // フォーム特化のキーボードナビゲーション
  const handleFormKeyPress = useCallback(
    (
      event: any,
      fieldType: "text" | "dropdown" | "number" | "button",
      fieldId: string,
      groupId: string,
    ) => {
      if (!enableFormNavigation) return;

      const { key, ctrlKey, altKey, shiftKey } = event;

      switch (key) {
        case "Tab":
          // Tabキーは標準のフォーカス移動
          if (!shiftKey) {
            focusNext(groupId);
          } else {
            focusPrevious(groupId);
          }
          event.preventDefault();
          break;

        case "Enter":
          // フィールドタイプに応じた処理
          if (fieldType === "dropdown") {
            // ドロップダウンを開く
            announce("ドロップダウンを開きます");
          } else if (fieldType === "button") {
            // ボタンの場合はクリックイベントをトリガー
            event.target?.click?.();
          } else if (fieldType === "text" || fieldType === "number") {
            // 次のフィールドに移動
            focusNext(groupId);
          }
          break;

        case "ArrowDown":
          if (fieldType === "dropdown") {
            // ドロップダウンで次のオプション
            event.preventDefault();
            announce("次のオプション");
          }
          break;

        case "ArrowUp":
          if (fieldType === "dropdown") {
            // ドロップダウンで前のオプション
            event.preventDefault();
            announce("前のオプション");
          }
          break;

        case "Escape":
          // ドロップダウンやモーダルを閉じる
          announce("入力をキャンセル");
          break;

        case "F1":
          // ヘルプ表示
          event.preventDefault();
          announce("ヘルプ情報を表示");
          break;
      }
    },
    [enableFormNavigation, focusNext, focusPrevious, announce],
  );

  // CBT問題特化のキーボードショートカット
  const registerCBTShortcuts = useCallback(
    (questionType: "journal" | "ledger" | "trial_balance") => {
      // 共通ショートカット
      registerShortcut("submit-answer", {
        key: "Enter",
        modifiers: ["ctrl"],
        action: () => {
          // 解答送信処理（コンポーネント側で実装）
          announce("解答を送信します");
        },
        description: "解答送信",
        category: "action",
      });

      registerShortcut("clear-answer", {
        key: "Delete",
        modifiers: ["ctrl"],
        action: () => {
          announce("解答をクリアします");
        },
        description: "解答クリア",
        category: "action",
      });

      registerShortcut("show-hint", {
        key: "F2",
        action: () => {
          announce("ヒントを表示します");
        },
        description: "ヒント表示",
        category: "action",
      });

      registerShortcut("show-explanation", {
        key: "F3",
        action: () => {
          announce("解説を表示します");
        },
        description: "解説表示",
        category: "action",
      });

      // 問題タイプ別ショートカット
      switch (questionType) {
        case "journal":
          registerShortcut("focus-debit-account", {
            key: "1",
            modifiers: ["alt"],
            action: () => {
              announce("借方科目にフォーカス");
            },
            description: "借方科目フォーカス",
            category: "navigation",
          });

          registerShortcut("focus-debit-amount", {
            key: "2",
            modifiers: ["alt"],
            action: () => {
              announce("借方金額にフォーカス");
            },
            description: "借方金額フォーカス",
            category: "navigation",
          });

          registerShortcut("focus-credit-account", {
            key: "3",
            modifiers: ["alt"],
            action: () => {
              announce("貸方科目にフォーカス");
            },
            description: "貸方科目フォーカス",
            category: "navigation",
          });

          registerShortcut("focus-credit-amount", {
            key: "4",
            modifiers: ["alt"],
            action: () => {
              announce("貸方金額にフォーカス");
            },
            description: "貸方金額フォーカス",
            category: "navigation",
          });
          break;

        case "ledger":
          registerShortcut("focus-amount-field", {
            key: "1",
            modifiers: ["alt"],
            action: () => {
              announce("金額フィールドにフォーカス");
            },
            description: "金額フィールドフォーカス",
            category: "navigation",
          });
          break;

        case "trial_balance":
          registerShortcut("focus-debit-total", {
            key: "1",
            modifiers: ["alt"],
            action: () => {
              announce("借方合計にフォーカス");
            },
            description: "借方合計フォーカス",
            category: "navigation",
          });

          registerShortcut("focus-credit-total", {
            key: "2",
            modifiers: ["alt"],
            action: () => {
              announce("貸方合計にフォーカス");
            },
            description: "貸方合計フォーカス",
            category: "navigation",
          });
          break;
      }
    },
    [registerShortcut, announce],
  );

  // ナビゲーション用ショートカット
  const registerNavigationShortcuts = useCallback(() => {
    registerShortcut("go-back", {
      key: "Backspace",
      modifiers: ["alt"],
      action: () => {
        // 戻る処理（コンポーネント側で実装）
        announce("前の画面に戻ります");
      },
      description: "前の画面に戻る",
      category: "navigation",
    });

    registerShortcut("go-home", {
      key: "h",
      modifiers: ["ctrl", "alt"],
      action: () => {
        announce("ホーム画面に移動します");
      },
      description: "ホーム画面に移動",
      category: "navigation",
    });

    registerShortcut("open-menu", {
      key: "m",
      modifiers: ["ctrl"],
      action: () => {
        announce("メニューを開きます");
      },
      description: "メニューを開く",
      category: "navigation",
    });

    registerShortcut("next-question", {
      key: "ArrowRight",
      modifiers: ["ctrl"],
      action: () => {
        announce("次の問題に移動します");
      },
      description: "次の問題",
      category: "navigation",
    });

    registerShortcut("previous-question", {
      key: "ArrowLeft",
      modifiers: ["ctrl"],
      action: () => {
        announce("前の問題に移動します");
      },
      description: "前の問題",
      category: "navigation",
    });
  }, [registerShortcut, announce]);

  // アクティブなフォーカスグループを設定
  const setActiveGroup = useCallback((groupId: string | null) => {
    activeGroupRef.current = groupId;
  }, []);

  // モーダル状態の管理
  const setModalOpen = useCallback((isOpen: boolean) => {
    setIsModalOpen(isOpen);
  }, []);

  // ショートカットヘルプの取得
  const getShortcutsHelp = useCallback(() => {
    const shortcuts = Array.from(shortcutsRef.current.values());
    const categories = {
      navigation: shortcuts.filter((s) => s.category === "navigation"),
      action: shortcuts.filter((s) => s.category === "action"),
      form: shortcuts.filter((s) => s.category === "form"),
      global: shortcuts.filter((s) => s.category === "global"),
    };

    return {
      categories,
      all: shortcuts,
      count: shortcuts.length,
    };
  }, []);

  // Androidの戻るボタン処理
  useEffect(() => {
    if (Platform.OS === "android") {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          if (isModalOpen) {
            announce("モーダルを閉じます");
            return true; // イベントを消費
          }
          return false; // 標準の戻る処理を実行
        },
      );

      return () => backHandler.remove();
    }
  }, [isModalOpen, announce]);

  // 初期化時にナビゲーションショートカットを登録
  useEffect(() => {
    registerNavigationShortcuts();

    return () => {
      // クリーンアップ
      shortcutsRef.current.clear();
    };
  }, [registerNavigationShortcuts]);

  return {
    // ショートカット管理
    registerShortcut,
    unregisterShortcut,
    registerCBTShortcuts,
    registerNavigationShortcuts,

    // イベントハンドラー
    handleGlobalKeyPress,
    handleFormKeyPress,

    // 状態管理
    setActiveGroup,
    setModalOpen,

    // ヘルプ
    getShortcutsHelp,

    // アクセシビリティ情報
    isScreenReaderEnabled,
  };
}

/**
 * キーボードナビゲーション対応のフォームフィールドコンポーネント
 */
export interface KeyboardNavigableFieldProps {
  fieldId: string;
  groupId: string;
  fieldType: "text" | "dropdown" | "number" | "button";
  onKeyPress?: (event: any) => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export function useKeyboardNavigableField({
  fieldId,
  groupId,
  fieldType,
  onKeyPress,
  disabled = false,
}: Omit<KeyboardNavigableFieldProps, "children">) {
  const { handleFormKeyPress } = useKeyboardNavigation();

  const handleKeyPressWrapper = useCallback(
    (event: any) => {
      if (disabled) return;

      // カスタムハンドラーを先に実行
      onKeyPress?.(event);

      // 標準のフォームナビゲーション処理
      if (!event.defaultPrevented) {
        handleFormKeyPress(event, fieldType, fieldId, groupId);
      }
    },
    [disabled, onKeyPress, handleFormKeyPress, fieldType, fieldId, groupId],
  );

  return {
    handleKeyPress: handleKeyPressWrapper,
    fieldId,
    groupId,
    fieldType,
    disabled,
  };
}
