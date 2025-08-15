/**
 * タブレットレイアウトフック（Phase 3）
 * iPad・Androidタブレット対応のレスポンシブレイアウト
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { Dimensions, Platform, Animated } from "react-native";
import { useAccessibility } from "./useAccessibility";

export interface DeviceInfo {
  isTablet: boolean;
  isLandscape: boolean;
  screenWidth: number;
  screenHeight: number;
  deviceType: "phone" | "tablet" | "desktop";
  breakpoint: "xs" | "sm" | "md" | "lg" | "xl";
  densityPixelRatio: number;
}

export interface TabletLayoutConfig {
  // ブレークポイント定義 (論理ピクセル)
  breakpoints: {
    xs: number; // 320px - スマートフォン（縦）
    sm: number; // 768px - タブレット（縦）
    md: number; // 1024px - タブレット（横）
    lg: number; // 1366px - デスクトップ
    xl: number; // 1920px - 大画面デスクトップ
  };
  
  // タブレット判定閾値
  tabletMinWidth: number;
  tabletMinHeight: number;
  
  // コンテンツ幅制限
  maxContentWidth: {
    phone: number;
    tablet: number;
    desktop: number;
  };
  
  // サイドバー設定
  sidebar: {
    minWidth: number;
    maxWidth: number;
    collapsedWidth: number;
  };
  
  // グリッド設定
  grid: {
    columns: {
      phone: number;
      tablet: number;
      desktop: number;
    };
    gutter: {
      phone: number;
      tablet: number;
      desktop: number;
    };
  };
}

export interface ResponsiveStyles {
  container: any;
  content: any;
  sidebar: any;
  grid: any;
  spacing: any;
  typography: any;
}

const defaultConfig: TabletLayoutConfig = {
  breakpoints: {
    xs: 0,
    sm: 768,
    md: 1024,
    lg: 1366,
    xl: 1920,
  },
  tabletMinWidth: 768,
  tabletMinHeight: 600,
  maxContentWidth: {
    phone: 480,
    tablet: 1024,
    desktop: 1200,
  },
  sidebar: {
    minWidth: 280,
    maxWidth: 320,
    collapsedWidth: 64,
  },
  grid: {
    columns: {
      phone: 1,
      tablet: 2,
      desktop: 3,
    },
    gutter: {
      phone: 16,
      tablet: 24,
      desktop: 32,
    },
  },
};

export function useTabletLayout(config: Partial<TabletLayoutConfig> = {}) {
  const finalConfig = { ...defaultConfig, ...config };
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => 
    getDeviceInfo(Dimensions.get("window"), finalConfig)
  );
  const { isReduceMotionEnabled } = useAccessibility();

  // デバイス情報計算
  const getDeviceInfo = useCallback((
    dimensions: { width: number; height: number },
    config: TabletLayoutConfig
  ): DeviceInfo => {
    const { width, height } = dimensions;
    const isLandscape = width > height;
    const densityPixelRatio = Dimensions.get("screen").scale;

    // タブレット判定
    const isTablet = width >= config.tabletMinWidth && 
                    height >= config.tabletMinHeight;

    // デバイスタイプ判定
    let deviceType: DeviceInfo["deviceType"] = "phone";
    if (width >= config.breakpoints.lg) {
      deviceType = "desktop";
    } else if (isTablet) {
      deviceType = "tablet";
    }

    // ブレークポイント判定
    let breakpoint: DeviceInfo["breakpoint"] = "xs";
    if (width >= config.breakpoints.xl) {
      breakpoint = "xl";
    } else if (width >= config.breakpoints.lg) {
      breakpoint = "lg";
    } else if (width >= config.breakpoints.md) {
      breakpoint = "md";
    } else if (width >= config.breakpoints.sm) {
      breakpoint = "sm";
    }

    return {
      isTablet,
      isLandscape,
      screenWidth: width,
      screenHeight: height,
      deviceType,
      breakpoint,
      densityPixelRatio,
    };
  }, []);

  // 画面サイズ変更の監視（オリエンテーション対応）
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      // オリエンテーション変更時の遅延処理（200ms）
      // これによりアニメーション中のレイアウト更新を防ぐ
      const timeoutId = setTimeout(() => {
        setDeviceInfo(getDeviceInfo(window, finalConfig));
      }, 200);

      return () => clearTimeout(timeoutId);
    });

    return () => subscription?.remove();
  }, [getDeviceInfo, finalConfig]);

  // レスポンシブスタイル生成
  const getResponsiveStyles = useCallback((): ResponsiveStyles => {
    const { deviceType, isLandscape, screenWidth, screenHeight } = deviceInfo;
    const maxWidth = finalConfig.maxContentWidth[deviceType];
    const gridColumns = finalConfig.grid.columns[deviceType];
    const gutterSize = finalConfig.grid.gutter[deviceType];

    return {
      container: {
        flex: 1,
        flexDirection: deviceType === "tablet" && isLandscape ? "row" : "column",
        maxWidth: deviceType !== "phone" ? maxWidth : undefined,
        alignSelf: deviceType !== "phone" ? "center" : undefined,
        width: "100%",
      },
      
      content: {
        flex: 1,
        paddingHorizontal: deviceType === "phone" ? 16 : 24,
        paddingVertical: deviceType === "phone" ? 16 : 20,
        maxWidth: deviceType === "phone" ? undefined : maxWidth - (isLandscape ? finalConfig.sidebar.maxWidth : 0),
      },
      
      sidebar: {
        width: deviceType === "tablet" && isLandscape 
          ? finalConfig.sidebar.maxWidth 
          : deviceType === "desktop" 
            ? finalConfig.sidebar.maxWidth 
            : 0,
        minWidth: deviceType === "tablet" && isLandscape 
          ? finalConfig.sidebar.minWidth 
          : 0,
        backgroundColor: "#FFFFFF",
        borderRightWidth: deviceType === "tablet" || deviceType === "desktop" ? 1 : 0,
        borderRightColor: "#E0E0E0",
        paddingVertical: 20,
        paddingHorizontal: 16,
      },
      
      grid: {
        flexDirection: "row",
        flexWrap: "wrap" as "wrap",
        marginHorizontal: -gutterSize / 2,
        justifyContent: gridColumns === 1 ? "center" : "flex-start",
      },
      
      spacing: {
        xs: 4,
        sm: 8,
        md: deviceType === "phone" ? 12 : 16,
        lg: deviceType === "phone" ? 16 : 24,
        xl: deviceType === "phone" ? 20 : 32,
        xxl: deviceType === "phone" ? 24 : 40,
      },
      
      typography: {
        scale: deviceType === "phone" ? 1 : deviceType === "tablet" ? 1.1 : 1.2,
        lineHeight: deviceType === "phone" ? 1.4 : 1.5,
        maxWidth: deviceType === "phone" ? undefined : 600,
      },
    };
  }, [deviceInfo, finalConfig]);

  // グリッドアイテムスタイル生成
  const getGridItemStyle = useCallback((
    span: number = 1,
    offset: number = 0
  ) => {
    const { deviceType } = deviceInfo;
    const gridColumns = finalConfig.grid.columns[deviceType];
    const gutterSize = finalConfig.grid.gutter[deviceType];
    const itemWidth = (100 / gridColumns) * span;
    const offsetWidth = (100 / gridColumns) * offset;

    return {
      width: `${itemWidth}%` as any,
      marginLeft: offset > 0 ? `${offsetWidth}%` as any : 0,
      paddingHorizontal: gutterSize / 2,
      marginBottom: gutterSize,
    };
  }, [deviceInfo, finalConfig]);

  // ブレークポイント判定ヘルパー
  const isBreakpoint = useCallback((
    breakpoint: keyof TabletLayoutConfig["breakpoints"]
  ): boolean => {
    return deviceInfo.screenWidth >= finalConfig.breakpoints[breakpoint];
  }, [deviceInfo.screenWidth, finalConfig.breakpoints]);

  // 条件付きスタイル適用
  const whenBreakpoint = useCallback(<T>(
    breakpoint: keyof TabletLayoutConfig["breakpoints"],
    trueValue: T,
    falseValue?: T
  ): T | undefined => {
    return isBreakpoint(breakpoint) ? trueValue : falseValue;
  }, [isBreakpoint]);

  // デバイス別値取得
  const getValueByDevice = useCallback(<T>(values: {
    phone?: T;
    tablet?: T;
    desktop?: T;
    default: T;
  }): T => {
    const { deviceType } = deviceInfo;
    return values[deviceType] ?? values.default;
  }, [deviceInfo]);

  // マスター・ディテールレイアウト判定
  const shouldUseMasterDetail = useCallback((): boolean => {
    return deviceInfo.isTablet && deviceInfo.isLandscape;
  }, [deviceInfo]);

  // Split View判定
  const shouldUseSplitView = useCallback((): boolean => {
    return (deviceInfo.deviceType === "tablet" && deviceInfo.isLandscape) ||
           deviceInfo.deviceType === "desktop";
  }, [deviceInfo]);

  // 画面密度による調整値取得
  const getDensityAdjustedValue = useCallback((baseValue: number): number => {
    const { densityPixelRatio } = deviceInfo;
    if (densityPixelRatio <= 1) return baseValue;
    if (densityPixelRatio <= 2) return baseValue * 1.1;
    if (densityPixelRatio <= 3) return baseValue * 1.2;
    return baseValue * 1.3;
  }, [deviceInfo.densityPixelRatio]);

  // オリエンテーション対応ヘルパー
  const getOrientationSpecificValue = useCallback(<T>(values: {
    portrait?: T;
    landscape?: T;
    default: T;
  }): T => {
    const { isLandscape } = deviceInfo;
    if (isLandscape && values.landscape !== undefined) {
      return values.landscape;
    }
    if (!isLandscape && values.portrait !== undefined) {
      return values.portrait;
    }
    return values.default;
  }, [deviceInfo]);

  // オリエンテーション変更時のコンテンツ配置取得
  const getOrientationLayout = useCallback(() => {
    const { isTablet, isLandscape, screenWidth, screenHeight } = deviceInfo;
    
    return {
      // メインコンテンツの配置
      contentDirection: isTablet && isLandscape ? "row" : "column",
      
      // サイドバーの表示条件
      shouldShowSidebar: isTablet && isLandscape,
      
      // コンテンツ幅の調整
      contentWidth: isTablet && isLandscape 
        ? screenWidth - finalConfig.sidebar.maxWidth 
        : screenWidth,
      
      // ナビゲーションの配置
      navigationPosition: isTablet && isLandscape ? "side" : "bottom",
      
      // カードレイアウトの列数
      cardColumns: isTablet 
        ? (isLandscape ? 3 : 2)
        : 1,
      
      // スペーシングの調整
      spacing: {
        horizontal: isTablet ? 24 : 16,
        vertical: isTablet ? 20 : 16,
        grid: isTablet ? (isLandscape ? 32 : 24) : 16,
      }
    };
  }, [deviceInfo, finalConfig]);

  // Safe Area対応のパディング取得
  const getOrientationSafePadding = useCallback(() => {
    const { isLandscape } = deviceInfo;
    
    return {
      top: 0, // Safe Area Provider が管理
      bottom: 0, // Safe Area Provider が管理
      left: isLandscape ? 20 : 0, // 横向き時のサイド余白
      right: isLandscape ? 20 : 0, // 横向き時のサイド余白
    };
  }, [deviceInfo]);

  return {
    deviceInfo,
    responsiveStyles: getResponsiveStyles(),
    getGridItemStyle,
    isBreakpoint,
    whenBreakpoint,
    getValueByDevice,
    shouldUseMasterDetail,
    shouldUseSplitView,
    getDensityAdjustedValue,
    getOrientationSpecificValue,
    getOrientationLayout,
    getOrientationSafePadding,
    config: finalConfig,
  };
}

/**
 * レスポンシブレイアウトコンポーネント
 */
import React from "react";
import { View, ViewStyle, Text, TouchableOpacity, ScrollView } from "react-native";

export interface ResponsiveContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  sidebar?: React.ReactNode;
  sidebarStyle?: ViewStyle;
  enableSplitView?: boolean;
  enableMasterDetail?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  style,
  contentStyle,
  sidebar,
  sidebarStyle,
  enableSplitView = true,
  enableMasterDetail = true,
}) => {
  const { 
    responsiveStyles, 
    shouldUseSplitView, 
    shouldUseMasterDetail,
    deviceInfo,
    getOrientationLayout,
    getOrientationSafePadding
  } = useTabletLayout();

  const useSplitLayout = enableSplitView && shouldUseSplitView();
  const useMasterDetailLayout = enableMasterDetail && shouldUseMasterDetail();
  const orientationLayout = getOrientationLayout();
  const safePadding = getOrientationSafePadding();

  // オリエンテーション対応のコンテナスタイル
  const containerStyle = {
    ...responsiveStyles.container,
    flexDirection: orientationLayout.contentDirection as "row" | "column",
    paddingLeft: safePadding.left,
    paddingRight: safePadding.right,
  };

  if (sidebar && (useSplitLayout || useMasterDetailLayout)) {
    return (
      <View style={[containerStyle, style]}>
        {/* サイドバー */}
        <View style={[responsiveStyles.sidebar, sidebarStyle]}>
          {sidebar}
        </View>
        
        {/* メインコンテンツ */}
        <View style={[
          responsiveStyles.content, 
          { 
            width: orientationLayout.contentWidth,
            paddingHorizontal: orientationLayout.spacing.horizontal,
            paddingVertical: orientationLayout.spacing.vertical,
          },
          contentStyle
        ]}>
          {children}
        </View>
      </View>
    );
  }

  // モバイルレイアウト（オリエンテーション対応）
  return (
    <View style={[containerStyle, style]}>
      <View style={[
        responsiveStyles.content,
        {
          paddingHorizontal: orientationLayout.spacing.horizontal,
          paddingVertical: orientationLayout.spacing.vertical,
        },
        contentStyle
      ]}>
        {children}
      </View>
    </View>
  );
};

/**
 * レスポンシブグリッドコンポーネント
 */
export interface ResponsiveGridProps {
  children: React.ReactNode;
  style?: ViewStyle;
  itemSpan?: number;
  itemOffset?: number;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  style,
}) => {
  const { responsiveStyles, getOrientationLayout } = useTabletLayout();
  const orientationLayout = getOrientationLayout();

  return (
    <View style={[
      responsiveStyles.grid, 
      { 
        marginHorizontal: -orientationLayout.spacing.grid / 2,
      },
      style
    ]}>
      {children}
    </View>
  );
};

export const ResponsiveGridItem: React.FC<ResponsiveGridProps> = ({
  children,
  style,
  itemSpan = 1,
  itemOffset = 0,
}) => {
  const { getGridItemStyle, getOrientationLayout } = useTabletLayout();
  const orientationLayout = getOrientationLayout();
  
  // オリエンテーション対応のスパン計算
  const effectiveSpan = Math.min(itemSpan, orientationLayout.cardColumns);

  return (
    <View style={[
      getGridItemStyle(effectiveSpan, itemOffset),
      {
        paddingHorizontal: orientationLayout.spacing.grid / 2,
        marginBottom: orientationLayout.spacing.grid,
      },
      style
    ]}>
      {children}
    </View>
  );
};

/**
 * オリエンテーション対応コンポーネント
 */
export interface OrientationAwareViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  portraitStyle?: ViewStyle;
  landscapeStyle?: ViewStyle;
  tabletStyle?: ViewStyle;
  phoneStyle?: ViewStyle;
}

export const OrientationAwareView: React.FC<OrientationAwareViewProps> = ({
  children,
  style,
  portraitStyle,
  landscapeStyle,
  tabletStyle,
  phoneStyle,
}) => {
  const { deviceInfo, getOrientationSpecificValue } = useTabletLayout();
  
  // デバイスタイプ別スタイル
  const deviceStyle = deviceInfo.isTablet ? tabletStyle : phoneStyle;
  
  // オリエンテーション別スタイル
  const orientationStyle = getOrientationSpecificValue({
    portrait: portraitStyle,
    landscape: landscapeStyle,
    default: {},
  });

  return (
    <View style={[style, deviceStyle, orientationStyle]}>
      {children}
    </View>
  );
};

/**
 * 画面回転アニメーション対応コンテナ
 */

export interface RotationAwareContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  animationDuration?: number;
  animateOnRotation?: boolean;
}

export const RotationAwareContainer: React.FC<RotationAwareContainerProps> = ({
  children,
  style,
  animationDuration = 300,
  animateOnRotation = true,
}) => {
  const { deviceInfo } = useTabletLayout();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const previousOrientation = useRef(deviceInfo.isLandscape);

  // オリエンテーション変更時のアニメーション
  React.useEffect(() => {
    if (!animateOnRotation) return;
    
    if (previousOrientation.current !== deviceInfo.isLandscape) {
      // フェードアウト→フェードイン
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: animationDuration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: animationDuration / 2,
          useNativeDriver: true,
        }),
      ]).start();
      
      previousOrientation.current = deviceInfo.isLandscape;
    }
  }, [deviceInfo.isLandscape, fadeAnim, animationDuration, animateOnRotation]);

  return (
    <Animated.View style={[{ opacity: fadeAnim }, style]}>
      {children}
    </Animated.View>
  );
};

/**
 * Master-Detail分割レイアウトコンポーネント
 */
export interface MasterDetailContainerProps {
  children: React.ReactNode;
  masterComponent?: React.ReactNode;
  masterTitle?: string;
  masterWidth?: number;
  style?: ViewStyle;
  masterStyle?: ViewStyle;
  detailStyle?: ViewStyle;
  enableSplitView?: boolean;
  showMasterInPortrait?: boolean;
}

export const MasterDetailContainer: React.FC<MasterDetailContainerProps> = ({
  children,
  masterComponent,
  masterTitle = "一覧",
  masterWidth,
  style,
  masterStyle,
  detailStyle,
  enableSplitView = true,
  showMasterInPortrait = false,
}) => {
  const { 
    deviceInfo, 
    shouldUseSplitView, 
    getOrientationLayout,
    config: { sidebar }
  } = useTabletLayout();
  
  const orientationLayout = getOrientationLayout();
  const shouldShowSplit = enableSplitView && 
    (shouldUseSplitView() || (showMasterInPortrait && deviceInfo.isTablet));
  
  const finalMasterWidth = masterWidth || sidebar.maxWidth;

  if (shouldShowSplit && masterComponent) {
    return (
      <View style={[
        {
          flex: 1,
          flexDirection: "row",
        },
        style
      ]}>
        {/* Master Panel */}
        <View style={[
          {
            width: finalMasterWidth,
            borderRightWidth: 1,
            borderRightColor: "#E0E0E0",
            backgroundColor: "#FAFAFA",
          },
          masterStyle
        ]}>
          {masterTitle && (
            <View style={{
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: "#E0E0E0",
              backgroundColor: "#FFFFFF",
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#333",
              }}>
                {masterTitle}
              </Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            {masterComponent}
          </View>
        </View>
        
        {/* Detail Panel */}
        <View style={[
          {
            flex: 1,
            backgroundColor: "#FFFFFF",
          },
          detailStyle
        ]}>
          {children}
        </View>
      </View>
    );
  }

  // モバイルレイアウト（シングルペイン）
  return (
    <View style={[{ flex: 1 }, style]}>
      {children}
    </View>
  );
};

/**
 * SplitViewナビゲーション対応コンポーネント
 */
export interface SplitViewNavigationProps {
  children: React.ReactNode;
  navigationItems?: Array<{
    id: string;
    title: string;
    icon?: string;
    onPress: () => void;
    active?: boolean;
  }>;
  style?: ViewStyle;
}

export const SplitViewNavigation: React.FC<SplitViewNavigationProps> = ({
  children,
  navigationItems = [],
  style,
}) => {
  const { deviceInfo, shouldUseSplitView } = useTabletLayout();
  
  const shouldShowSideNav = shouldUseSplitView() && navigationItems.length > 0;

  if (shouldShowSideNav) {
    return (
      <View style={[
        {
          flex: 1,
          flexDirection: "row",
        },
        style
      ]}>
        {/* Side Navigation */}
        <View style={{
          width: 280,
          backgroundColor: "#F8F9FA",
          borderRightWidth: 1,
          borderRightColor: "#E0E0E0",
        }}>
          <ScrollView style={{ flex: 1 }}>
            {navigationItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  backgroundColor: item.active ? "#E3F2FD" : "transparent",
                  borderLeftWidth: item.active ? 4 : 0,
                  borderLeftColor: "#2196F3",
                }}
                onPress={item.onPress}
                accessibilityLabel={item.title}
                accessibilityRole="button"
              >
                {item.icon && (
                  <Text style={{
                    fontSize: 20,
                    marginRight: 12,
                  }}>
                    {item.icon}
                  </Text>
                )}
                <Text style={{
                  fontSize: 16,
                  color: item.active ? "#1976D2" : "#333",
                  fontWeight: item.active ? "600" : "normal",
                }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Content Area */}
        <View style={{ flex: 1 }}>
          {children}
        </View>
      </View>
    );
  }

  // モバイルレイアウト
  return (
    <View style={[{ flex: 1 }, style]}>
      {children}
    </View>
  );
};

ResponsiveContainer.displayName = "ResponsiveContainer";
ResponsiveGrid.displayName = "ResponsiveGrid";
ResponsiveGridItem.displayName = "ResponsiveGridItem";
OrientationAwareView.displayName = "OrientationAwareView";
RotationAwareContainer.displayName = "RotationAwareContainer";
MasterDetailContainer.displayName = "MasterDetailContainer";
SplitViewNavigation.displayName = "SplitViewNavigation";